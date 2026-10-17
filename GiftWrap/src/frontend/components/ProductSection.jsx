import { categories } from '../../backend/catalog.js'
import '../Style/ProductSection.css'
import '../Style/ProductDetails.css'
import { icon } from './icon.jsx'
import { imageUrl, escapeHtml } from './image.jsx'
import { button } from './Button.jsx'

export function renderProductCard(product, state) {
  const wished = state.wishlist.has(product.id)
  return `
    <article class="product-card">
      <div class="product-image product-${escapeHtml(product.color)}">
        <img src="${escapeHtml(imageUrl(product.image))}" data-fallback="${escapeHtml(product.id)}" alt="${escapeHtml(product.name)}" loading="lazy">
        <button class="product-image-details" type="button" data-product-details="${escapeHtml(product.id)}" aria-label="View details for ${escapeHtml(product.name)}"></button>
        ${product.badge ? `<span class="product-badge">${escapeHtml(product.badge)}</span>` : ''}
        <button class="product-heart ${wished ? 'is-wished' : ''}" data-wishlist="${escapeHtml(product.id)}" aria-label="${wished ? 'Remove' : 'Add'} ${escapeHtml(product.name)} ${wished ? 'from' : 'to'} wishlist" aria-pressed="${wished}">${icon('heart', 18)}</button>
        <button class="quick-add" data-add="${escapeHtml(product.id)}">Add to bag <span>+</span></button>
      </div>
      <div class="product-info"><div><span class="product-brand">${escapeHtml(product.brand)}</span><h3><button class="product-name-button" type="button" data-product-details="${escapeHtml(product.id)}">${escapeHtml(product.name)}</button></h3></div><span class="product-price">$${product.price}</span></div>
      <div class="product-meta"><span>${escapeHtml(product.kind)}</span><span class="product-meta-dot">✳</span><span>Gift-ready</span></div>
    </article>`
}

function normalizeSearchText(value) {
  return String(value ?? '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLocaleLowerCase()
}

function renderProductResults(state, { animate = false } = {}) {
  const searchTerm = state.search.trim().toLocaleLowerCase()
  const searchWords = searchTerm.split(/\s+/).filter(Boolean)
  const matchingProducts = state.products.filter(product => {
    const categoryMatches = searchWords.length > 0 || state.category === 'all' || product.category === state.category
    const searchFields = [product.name, product.brand, product.kind, product.category, product.badge]
      .filter(Boolean)
      .join(' ')
    const searchableText = normalizeSearchText(searchFields)
    const searchMatches = searchWords.every(word => searchableText.includes(normalizeSearchText(word)))
    return categoryMatches && searchMatches
  })
  if (state.productSort === 'price-ascending') matchingProducts.sort((a, b) => a.price - b.price || a.name.localeCompare(b.name))
  if (state.productSort === 'price-descending') matchingProducts.sort((a, b) => b.price - a.price || a.name.localeCompare(b.name))
  const resultLabel = matchingProducts.length === 1 ? 'gift' : 'gifts'

  return `
    <div class="product-results" aria-live="polite">
      <p class="search-result-count" role="status">${matchingProducts.length} ${resultLabel}${searchTerm ? ' found' : ' in the collection'}</p>
      ${matchingProducts.length
        ? `<div class="product-grid ${animate ? 'is-entering' : ''}">${matchingProducts.map(product => renderProductCard(product, state)).join('')}</div>`
        : `<div class="empty-state ${animate ? 'is-entering' : ''}"><span>✳</span><h3>${searchTerm ? 'No gifts match that search yet.' : 'No little things found just yet.'}</h3><p>${searchTerm ? 'Try a different word, or clear your search to browse the collection.' : 'Try another recipient filter or take a peek at everything.'}</p>${button(searchTerm ? 'Clear search' : 'See all the good stuff', { attributes: searchTerm ? 'data-clear-search' : 'data-category="all"' })}</div>`}
      ${!searchTerm && state.category === 'all' ? `<div class="collection-footnote"><span>✳</span> The best gifts aren’t always for a special occasion. <a href="#make-a-box">Make your own little moment ${icon('arrow', 15)}</a></div>` : ''}
    </div>`
}

export function renderProducts(state, { animate = false } = {}) {
  const searchTerm = state.search.trim()
  const categoryName = categories.find(category => category.id === state.category)?.name
  const title = searchTerm
    ? `Little things for “${escapeHtml(state.search.trim())}”`
    : categoryName
      ? `${categoryName}, made easy.`
      : 'Little things, big feelings.'
  return `
    <section class="products-section section-wrap" id="gifts" aria-labelledby="gifts-heading">
      <div class="section-heading product-section-heading">
        <div><span class="eyebrow product-section-eyebrow">${searchTerm ? 'A little search, a lot of love' : 'The feel-good collection'}</span><h2 id="gifts-heading">${title}</h2></div>
        <button class="text-link shop-all" data-category="all">Shop all the good stuff <span>↗</span></button>
      </div>
      <div class="product-filters" role="group" aria-label="Filter gifts by recipient">
        <button class="filter-chip ${state.category === 'all' ? 'selected' : ''}" data-category="all">Everything <span>${state.products.length}</span></button>
        <button class="filter-chip ${state.category === 'adults' ? 'selected' : ''}" data-category="adults">For your people</button>
        <button class="filter-chip ${state.category === 'kids' ? 'selected' : ''}" data-category="kids">For little ones</button>
        <button class="filter-chip ${state.category === 'pets' ? 'selected' : ''}" data-category="pets">For the fur family</button>
      </div>
      <div class="product-sort"><label for="product-sort">Sort by</label><select id="product-sort" aria-label="Sort gifts">${[
        ['recommended', 'Recommended'],
        ['price-ascending', 'Price: low to high'],
        ['price-descending', 'Price: high to low'],
      ].map(([value, label]) => `<option value="${value}" ${state.productSort === value ? 'selected' : ''}>${label}</option>`).join('')}</select></div>
      ${renderProductResults(state, { animate })}
    </section>`
}

export function renderProductDetails(state) {
  const product = state.products.find(item => item.id === state.productDetailId)
  if (!product) return ''

  const description = `${product.name} is a thoughtful ${product.kind.toLocaleLowerCase()} from ${product.brand}, chosen to make their day feel a little more special.`
  return `
    <div class="product-detail-backdrop" data-close-product-details>
      <section class="product-detail-dialog" role="dialog" aria-modal="true" aria-labelledby="product-detail-title" aria-describedby="product-detail-description">
        <button class="product-detail-close icon-button" type="button" data-close-product-details aria-label="Close product details">×</button>
        <div class="product-detail-image product-${escapeHtml(product.color)}"><img src="${escapeHtml(imageUrl(product.image))}" data-fallback="${escapeHtml(product.id)}" alt="${escapeHtml(product.name)}"></div>
        <div class="product-detail-copy">
          <span class="product-brand">${escapeHtml(product.brand)}</span>
          <span class="eyebrow">${escapeHtml(product.kind)}</span>
          <h2 id="product-detail-title">${escapeHtml(product.name)}</h2>
          <p id="product-detail-description">${escapeHtml(description)}</p>
          ${product.badge ? `<span class="product-detail-badge">${escapeHtml(product.badge)}</span>` : ''}
          <div class="product-detail-price">$${product.price}</div>
          <p class="product-detail-note">Arrives gift-ready, with a little extra thoughtfulness.</p>
          <button class="button button-coral product-detail-add" type="button" data-detail-add="${escapeHtml(product.id)}">Add to bag <span aria-hidden="true">+</span></button>
        </div>
      </section>
    </div>`
}
