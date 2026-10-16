
import './Style/Main.css'
import { loadSavedState, state } from '../backend/store.js'
import { renderHeader } from './components/Header.jsx'
import { renderHero } from './components/Hero.jsx'
import { renderCategories } from './components/CategorySection.jsx'
import { renderProducts } from './components/ProductSection.jsx'
import { renderBoxBuilder } from './components/GiftBoxBuilder.jsx'
import { renderLoveNote } from './components/LoveNote.jsx'
import { renderFooter } from './components/Footer.jsx'
import { renderDrawer } from './components/Drawer.jsx'
import { attachStorefrontEvents } from './events.jsx'

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
