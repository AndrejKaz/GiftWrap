import '../Style/Auth.css'
import { escapeHtml } from './image.jsx'

export function renderAuth(state) {
  const registering = state.authMode === 'register'
  return `
    <main class="auth-page">
      <section class="auth-card" aria-labelledby="auth-title">
        <a class="auth-wordmark" href="#" aria-label="little things">little<span>things</span><i>®</i></a>
        <span class="eyebrow">A little love, kept safe</span>
        <h1 id="auth-title">${registering ? 'Make your account.' : 'Welcome back.'}</h1>
        <p class="auth-intro">${registering ? 'Create an account to enter the gift shop.' : 'Sign in to visit the gift shop.'}</p>
        <form class="auth-form" data-auth-form>
          <label for="auth-username">Username</label>
          <input id="auth-username" name="username" type="text" autocomplete="username" minlength="3" maxlength="32" pattern="[A-Za-z0-9_.\\-]{3,32}" required>
          <label for="auth-password">Password</label>
          <input id="auth-password" name="password" type="password" autocomplete="${registering ? 'new-password' : 'current-password'}" minlength="8" required>
          ${registering ? `
            <label for="auth-password-confirm">Confirm password</label>
            <input id="auth-password-confirm" name="passwordConfirm" type="password" autocomplete="new-password" minlength="8" required>` : ''}
          <p class="auth-error" role="alert">${escapeHtml(state.authError)}</p>
          <button class="button button-coral auth-submit" type="submit" ${state.authBusy ? 'disabled' : ''}>
            ${state.authBusy ? 'One moment…' : registering ? 'Create my account' : 'Sign in'} <span>↗</span>
          </button>
        </form>
        <button class="auth-mode" type="button" data-auth-mode="${registering ? 'login' : 'register'}" ${state.authBusy ? 'disabled' : ''}>
          ${registering ? 'Already have an account? Sign in' : 'New here? Create an account'}
        </button>
      </section>
    </main>`
}
