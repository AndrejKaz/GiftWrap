const supabaseUrl = import.meta.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = import.meta.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
const sessionStorageKey = 'littlethings-auth-session'
const authEndpoint = supabaseUrl ? `${supabaseUrl}/functions/v1/gift-auth` : ''

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY in GiftWrap/.env.')
}

function readSessionToken() {
  try {
    return sessionStorage.getItem(sessionStorageKey) || ''
  } catch (error) {
    console.error('Could not read the sign-in session from browser storage.', error)
    return ''
  }
}

let sessionToken = readSessionToken()

async function invokeAuth(action, { username, password } = {}) {
  const headers = {
    'Content-Type': 'application/json',
    apikey: supabaseKey,
  }
  if (sessionToken) headers['x-app-session'] = sessionToken

  let response
  try {
    response = await fetch(authEndpoint, {
      method: 'POST',
      headers,
      body: JSON.stringify({ action, username, password }),
    })
  } catch (error) {
    if (error instanceof TypeError) {
      throw new Error('Could not reach the username sign-in service. Deploy the gift-auth Supabase Edge Function, then try again.')
    }
    throw error
  }
  const result = await response.json().catch(() => ({}))
  if (!response.ok) {
    const error = new Error(result.error || 'The authentication service could not complete the request.')
    error.status = response.status
    throw error
  }
  return result
}

function saveSession(token) {
  sessionToken = token
  try {
    if (token) sessionStorage.setItem(sessionStorageKey, token)
    else sessionStorage.removeItem(sessionStorageKey)
  } catch (error) {
    console.error('Could not persist the sign-in session in this browser tab.', error)
  }
}

export async function registerWithUsername(username, password) {
  const result = await invokeAuth('register', { username: username.trim(), password })
  saveSession(result.token)
  return result
}

export async function signInWithUsername(username, password) {
  const result = await invokeAuth('login', { username: username.trim(), password })
  saveSession(result.token)
  return result
}

export async function signOut() {
  try {
    if (sessionToken) await invokeAuth('logout')
  } catch (error) {
    if (error.status !== 401) throw error
  } finally {
    saveSession('')
  }
}

export async function getCurrentUser() {
  if (!sessionToken) return null
  try {
    const result = await invokeAuth('session')
    return result.user
  } catch (error) {
    if (error.status === 401) {
      saveSession('')
      return null
    }
    throw error
  }
}

export async function loadDatabaseCatalog() {
  const result = await invokeAuth('catalog')
  return result.products.map(product => ({
    id: product.product_slug,
    name: product.product_name,
    brand: product.brand,
    price: product.price_cents / 100,
    category: product.category,
    kind: product.kind,
    color: product.color,
    image: product.image,
    badge: product.badge,
  }))
}
