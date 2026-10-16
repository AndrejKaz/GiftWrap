
import { loadSavedState, state } from '../backend/store.js'
import { renderHeader } from './components/Header.js'
import { renderHero } from './components/Hero.js'
import { renderCategories } from './components/CategorySection.js'
import { renderProducts } from './components/ProductSection.js'
import { renderBoxBuilder } from './components/GiftBoxBuilder.js'
import { renderLoveNote } from './components/LoveNote.js'
import { renderFooter } from './components/Footer.js'
import { renderDrawer } from './components/Drawer.js'
import { attachStorefrontEvents } from './events.js'

export function mountStorefront() {
  const app = document.querySelector('#app')
  let toastTimeout

  function render() {
    app.innerHTML = `
      ${renderHeader(state)}
      <main>
        ${renderHero()}
        ${renderCategories()}
        ${renderProducts(state)}
        ${renderBoxBuilder(state)}
        ${renderLoveNote()}
      </main>
      ${renderFooter()}
      ${renderDrawer(state)}
      <div class="toast" role="status" aria-live="polite"></div>`
  }

  function showToast(message) {
    const toast = document.querySelector('.toast')
    toast.textContent = message
    toast.classList.add('visible')
    window.clearTimeout(toastTimeout)
    toastTimeout = window.setTimeout(() => toast.classList.remove('visible'), 2500)
  }

  loadSavedState()
  render()
  attachStorefrontEvents(app, render, showToast)
}
