import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, apikey, content-type, x-app-session, x-client-info',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}
const passwordIterations = 600_000
const sessionLifetimeMs = 14 * 24 * 60 * 60 * 1000
const encoder = new TextEncoder()
const dummyPasswordHash = 'pbkdf2-sha256$600000$AAAAAAAAAAAAAAAAAAAAAA==$AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA='

const databaseUrl = Deno.env.get('SUPABASE_URL')
const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

if (!databaseUrl || !serviceRoleKey) {
  throw new Error('The Edge Function requires SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY secrets.')
}

const supabase = createClient(databaseUrl, serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false },
})

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      ...corsHeaders,
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store',
    },
  })
}

function base64(bytes: Uint8Array) {
  let binary = ''
  for (const byte of bytes) binary += String.fromCharCode(byte)
  return btoa(binary)
}

function fromBase64(value: string) {
  return Uint8Array.from(atob(value), character => character.charCodeAt(0))
}

function hex(bytes: Uint8Array) {
  return Array.from(bytes, byte => byte.toString(16).padStart(2, '0')).join('')
}

function randomBytes(length: number) {
  return crypto.getRandomValues(new Uint8Array(length))
}

async function digest(value: string) {
  return hex(new Uint8Array(await crypto.subtle.digest('SHA-256', encoder.encode(value))))
}

async function derivePassword(password: string, salt: Uint8Array) {
  const key = await crypto.subtle.importKey('raw', encoder.encode(password), 'PBKDF2', false, ['deriveBits'])
  const result = await crypto.subtle.deriveBits({
    name: 'PBKDF2',
    hash: 'SHA-256',
    salt,
    iterations: passwordIterations,
  }, key, 256)
  return new Uint8Array(result)
}

function constantTimeEqual(left: Uint8Array, right: Uint8Array) {
  if (left.length !== right.length) return false
  let difference = 0
  for (let index = 0; index < left.length; index++) difference |= left[index] ^ right[index]
  return difference === 0
}

async function hashPassword(password: string) {
  const salt = randomBytes(16)
  const hash = await derivePassword(password, salt)
  return `pbkdf2-sha256$${passwordIterations}$${base64(salt)}$${base64(hash)}`
}

async function verifyPassword(password: string, encoded: string) {
  const [algorithm, iterationCount, saltText, hashText] = encoded.split('$')
  const iterations = Number(iterationCount)
  if (algorithm !== 'pbkdf2-sha256' || !Number.isInteger(iterations) || iterations < 100_000 || iterations > 1_000_000) {
    throw new Error('Stored password hash has an unsupported format.')
  }
  const actual = await derivePassword(password, fromBase64(saltText))
  return constantTimeEqual(actual, fromBase64(hashText))
}

function validateCredentials(body: Record<string, unknown>) {
  const username = typeof body.username === 'string' ? body.username.trim() : ''
  const password = typeof body.password === 'string' ? body.password : ''
  if (!/^[A-Za-z0-9_.-]{3,32}$/.test(username)) {
    return { error: 'Username must be 3–32 characters using letters, numbers, dots, dashes, or underscores.' }
  }
  if (password.length < 8 || encoder.encode(password).length > 72) {
    return { error: 'Password must be at least 8 characters and no more than 72 bytes.' }
  }
  return { username, password }
}

function publicUser(user: { id: string; user_name: string; created_at: string }) {
  return { id: user.id, user_name: user.user_name, created_at: user.created_at }
}

async function createSession(userId: string) {
  const token = hex(randomBytes(32))
  const expiresAt = new Date(Date.now() + sessionLifetimeMs).toISOString()
  const { error: cleanupError } = await supabase
    .from('AppSession')
    .delete()
    .lt('expires_at', new Date().toISOString())
  if (cleanupError) throw cleanupError
  const { error } = await supabase.from('AppSession').insert({
    id: crypto.randomUUID(),
    user_id: userId,
    token_hash: await digest(token),
    expires_at: expiresAt,
  })
  if (error) throw error
  return token
}

async function requireSession(request: Request) {
  const token = request.headers.get('x-app-session') || ''
  if (!/^[a-f0-9]{64}$/.test(token)) return null

  const { data: session, error } = await supabase
    .from('AppSession')
    .select('id, user_id, expires_at')
    .eq('token_hash', await digest(token))
    .gt('expires_at', new Date().toISOString())
    .maybeSingle()
  if (error) throw error
  if (!session) return null

  const { data: user, error: userError } = await supabase
    .from('AppUser')
    .select('id, user_name, created_at')
    .eq('id', session.user_id)
    .single()
  if (userError) throw userError
  return { token, session, user }
}

async function handleRequest(request: Request) {
  const contentLength = Number(request.headers.get('content-length') || 0)
  if (contentLength > 4096) return json({ error: 'Request body is too large.' }, 413)
  const body = await request.json().catch(() => null)
  if (!body || typeof body !== 'object' || Array.isArray(body)) return json({ error: 'Invalid request body.' }, 400)

  const action = body.action
  if (action === 'register' || action === 'login') {
    const credentials = validateCredentials(body)
    if ('error' in credentials) return json({ error: credentials.error }, 400)
    const username = credentials.username
    const password = credentials.password

    if (action === 'register') {
      const { data: user, error } = await supabase.from('AppUser').insert({
        id: crypto.randomUUID(),
        user_name: username,
        password_hash: await hashPassword(password),
      }).select('id, user_name, created_at').single()
      if (error?.code === '23505') return json({ error: 'That username is already taken.' }, 409)
      if (error) throw error
      return json({ user: publicUser(user), token: await createSession(user.id) }, 201)
    }

    const usernameKey = await digest(username.toLowerCase())
    const { data: allowed, error: limitError } = await supabase.rpc('check_username_login_limit', {
      p_username_key: usernameKey,
    })
    if (limitError) throw limitError
    if (!allowed) return json({ error: 'Too many sign-in attempts. Please wait 15 minutes and try again.' }, 429)

    const { data: user, error } = await supabase
      .from('AppUser')
      .select('id, user_name, password_hash, created_at')
      .ilike('user_name', username.replace(/[\\%_]/g, '\\$&'))
      .maybeSingle()
    if (error) throw error
    const matches = await verifyPassword(password, user?.password_hash || dummyPasswordHash)
    if (!user || !matches) {
      return json({ error: 'Username or password is incorrect.' }, 401)
    }
    return json({ user: publicUser(user), token: await createSession(user.id) })
  }

  if (action === 'session') {
    const authenticated = await requireSession(request)
    if (!authenticated) return json({ error: 'Your session has expired. Please sign in again.' }, 401)
    return json({ user: publicUser(authenticated.user) })
  }

  if (action === 'logout') {
    const authenticated = await requireSession(request)
    if (authenticated) {
      const { error } = await supabase.from('AppSession').delete().eq('id', authenticated.session.id)
      if (error) throw error
    }
    return json({ success: true })
  }

  if (action === 'catalog') {
    const authenticated = await requireSession(request)
    if (!authenticated) return json({ error: 'Please sign in to continue.' }, 401)
    const { data: products, error } = await supabase
      .from('Product')
      .select('id, product_slug, product_name, brand, price_cents, category, kind, color, image, badge')
      .not('product_slug', 'is', null)
      .order('id', { ascending: true })
    if (error) {
      console.error('Could not read Product catalog table.', error)
      return json({ error: `Could not read Product table. Check the product catalog migration and function database permissions. ${error.message}` }, 500)
    }
    return json({ products })
  }

  return json({ error: 'Unknown authentication action.' }, 400)
}

Deno.serve(async request => {
  if (request.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })
  if (request.method !== 'POST') return json({ error: 'Method not allowed.' }, 405)
  try {
    return await handleRequest(request)
  } catch (error) {
    console.error('Username auth request failed.', error)
    const detail = error instanceof Error ? error.message : String(error)
    return json({ error: `Username service error: ${detail}` }, 500)
  }
})
