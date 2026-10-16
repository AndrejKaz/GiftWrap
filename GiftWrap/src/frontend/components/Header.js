import { icon } from './icon.js'
import { escapeHtml } from './image.js'
import { getCartCount } from '../../backend/store.js'

export function renderHeader(state) {
  return `
    <div class="announcement"><span>Thoughtful things, wrapped with love</span><span class="announcement-dot">✳</span><span>Free delivery on orders over $75</span></div>
    <header class="site-header">
      <a class="wordmark" href="#" aria-label="little things home">little<span>things</span><i>®</i></a>
      <nav class="main-nav" aria-label="Main navigation">
        <button class="nav-link ${state.category === 'adults' ? 'active' : ''}" data-category="adults">For your people</button>
        <button class="nav-link ${state.category === 'kids' ? 'active' : ''}" data-category="kids">For little ones</button>
        <button class="nav-link ${state.category === 'pets' ? 'active' : ''}" data-category="pets">For the fur family</button>
        <a class="nav-link" href="#make-a-box">Make a gift box <span class="nav-spark">✳</span></a>
      </nav>
      <div class="header-actions">
        <label class="search-field">${icon('search', 18)}<input id="search-input" type="search" placeholder="Find a little something" value="${escapeHtml(state.search)}" aria-label="Search gifts"><kbd>⌘ K</kbd></label>
        <button class="icon-button wishlist-open" aria-label="Open wishlist" title="Wishlist">${icon('heart')}<span class="count-badge ${state.wishlist.size ? '' : 'is-empty'}">${state.wishlist.size}</span></button>
        <button class="icon-button cart-open" aria-label="Open shopping bag" title="Shopping bag">${icon('bag')}<span class="count-badge ${getCartCount() ? '' : 'is-empty'}">${getCartCount()}</span></button>
      </div>
      <button class="mobile-menu icon-button" aria-label="Open menu">☰</button>
    </header>`
}
