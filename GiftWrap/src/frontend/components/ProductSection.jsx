import { products, categories } from '../../backend/catalog.js'
import '../Style/ProductSection.css'
import { icon } from './icon.jsx'
import { imageUrl, escapeHtml } from './image.jsx'
import { button } from './Button.jsx'

export function renderProductCard(product, state) {
  const wished = state.wishlist.has(product.id)
  return `
    <article class="product-card">
      <div class="product-image product-${product.color}">
        <img src="${imageUrl(product.image)}" data-fallback="${product.id}" alt="${escapeHtml(product.name)}" loading="lazy">
        ${product.badge ? `<span class="product-badge">${product.badge}</span>` : ''}
        <button class="product-heart ${wished ? 'is-wished' : ''}" data-wishlist="${product.id}" aria-label="${wished ? 'Remove' : 'Add'} ${escapeHtml(product.name)} ${wished ? 'from' : 'to'} wishlist" aria-pressed="${wished}">${icon('heart', 18)}</button>
        <button class="quick-add" data-add="${product.id}">Add to bag <span>+</span></button>
      </div>
      <div class="product-info"><div><span class="product-brand">${product.brand}</span><h3>${product.name}</h3></div><span class="product-price">$${product.price}</span></div>
      <div class="product-meta"><span>${product.kind}</span><span class="product-meta-dot">✳</span><span>Gift-ready</span></div>
    </article>`
}

export function renderProducts(state, { animate = false } = {}) {
  const searchTerm = state.search.trim().toLocaleLowerCase()
  const matchingProducts = products.filter(product => {
    const categoryMatches = Boolean(searchTerm) || state.category === 'all' || product.category === state.category
    const searchMatches = !searchTerm || `${product.name} ${product.brand} ${product.kind} ${product.category}`.toLocaleLowerCase().includes(searchTerm)
    return categoryMatches && searchMatches
  })
  const categoryName = categories.find(category => category.id === state.category)?.name
  const title = searchTerm
    ? `Little things for “${escapeHtml(state.search.trim())}”`
    : categoryName
      ? `${categoryName}, made easy.`
      : 'Little things, big feelings.'
  return `
    <section class="products-section section-wrap" id="gifts" aria-labelledby="gifts-heading">
      <div class="section-heading product-section-heading">
        <div><span class="eyebrow">${searchTerm ? 'A little search, a lot of love' : 'The feel-good collection'}</span><h2 id="gifts-heading">${title}</h2></div>
        <button class="text-link shop-all" data-category="all">Shop all the good stuff <span>↗</span></button>
      </div>
      <div class="product-filters" role="group" aria-label="Filter gifts by recipient">
        <button class="filter-chip ${state.category === 'all' ? 'selected' : ''}" data-category="all">Everything <span>${products.length}</span></button>
        <button class="filter-chip ${state.category === 'adults' ? 'selected' : ''}" data-category="adults">For your people</button>
        <button class="filter-chip ${state.category === 'kids' ? 'selected' : ''}" data-category="kids">For little ones</button>
        <button class="filter-chip ${state.category === 'pets' ? 'selected' : ''}" data-category="pets">For the fur family</button>
      </div>
      ${matchingProducts.length
        ? `<div class="product-grid ${animate ? 'is-entering' : ''}">${matchingProducts.map(product => renderProductCard(product, state)).join('')}</div>`
        : `<div class="empty-state ${animate ? 'is-entering' : ''}"><span>✳</span><h3>No little things found just yet.</h3><p>Try another search or take a peek at everything.</p>${button('See all the good stuff', { attributes: 'data-category="all"' })}</div>`}
      ${!searchTerm && state.category === 'all' ? `<div class="collection-footnote"><span>✳</span> The best gifts aren’t always for a special occasion. <a href="#make-a-box">Make your own little moment ${icon('arrow', 15)}</a></div>` : ''}
    </section>`
}
