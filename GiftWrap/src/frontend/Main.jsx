
import './Style/Main.css'
import { loadSavedState, state } from '../backend/store.js'
import { products } from '../backend/catalog.js'
import { getCurrentUser, loadDatabaseCatalog } from '../backend/supabase.js'
import { renderHeader } from './components/Header.jsx'
import { renderAuth } from './components/Auth.jsx'
import { renderDatabaseCatalog } from './components/DatabaseCatalog.jsx'
import { renderHero } from './components/Hero.jsx'
import { renderCategories } from './components/CategorySection.jsx'
import { renderProductDetails, renderProducts } from './components/ProductSection.jsx'
import { renderBoxBuilder } from './components/GiftBoxBuilder.jsx'
import { renderLoveNote } from './components/LoveNote.jsx'
import { renderFooter } from './components/Footer.jsx'
import { renderDrawer } from './components/Drawer.jsx'
import { renderCheckout } from './components/Checkout.jsx'
import { attachStorefrontEvents } from './events.jsx'

export function mountStorefront() {
  const app = document.querySelector('#app')
  let toastTimeout
  let sessionRevision = 0

  function render() {
    if (state.authLoading) {
      app.innerHTML = '<main class="auth-page" role="status" aria-live="polite" aria-busy="true">Opening the little gift shop…</main>'
      return
    }
    if (!state.user) {
      app.innerHTML = renderAuth(state)
      return
    }

    app.innerHTML = `
      ${renderHeader(state)}
      <main>
        ${renderHero()}
        ${renderDatabaseCatalog(state)}
        ${renderCategories()}
        ${renderProducts(state)}
        ${renderBoxBuilder(state)}
        ${renderLoveNote()}
      </main>
      ${renderFooter()}
      ${renderDrawer(state)}
      ${renderCheckout(state)}
      ${renderProductDetails(state)}
      <div class="toast" role="status" aria-live="polite"></div>`
  }

  function showToast(message) {
    const toast = document.querySelector('.toast')
    toast.textContent = message
    toast.classList.add('visible')
    window.clearTimeout(toastTimeout)
    toastTimeout = window.setTimeout(() => toast.classList.remove('visible'), 2500)
  }

  async function applySessionUser(user) {
    if (state.user?.id === user?.id && !state.authLoading) return
    const revision = ++sessionRevision
    state.user = user
    state.authError = ''
    state.products = products
    state.databaseError = ''
    if (!user) {
      state.cart = []
      state.wishlist = new Set()
    }
    if (user) {
      try {
        state.products = await loadDatabaseCatalog()
      } catch (error) {
        state.databaseError = error.message
      }
    }
    if (revision !== sessionRevision) return
    if (user) loadSavedState()
    state.authLoading = false
    render()
  }

  render()
  attachStorefrontEvents(app, render, showToast, applySessionUser)

  getCurrentUser()
    .then(user => applySessionUser(user))
    .catch(error => {
      state.authError = `Could not check your sign-in status. ${error.message}`
      state.authLoading = false
      render()
    })
}
