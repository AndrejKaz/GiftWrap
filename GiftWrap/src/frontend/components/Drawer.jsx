import '../Style/Drawer.css'
import { icon } from './icon.jsx'
import { getCartItemTotal, getProduct } from '../../backend/store.js'
import { boxSizes } from '../../backend/catalog.js'
import { imageUrl, escapeHtml } from './image.jsx'
import { button } from './Button.jsx'

export function renderDrawer(state) {
  if (!state.drawer) return ''
  const isWishlist = state.drawer === 'wishlist'
  const items = isWishlist
    ? [...state.wishlist].map(id => ({ id, quantity: 1 }))
    : state.cart.map(item => ({ ...item }))
  const total = items.reduce((sum, item) => sum + getCartItemTotal(item), 0)
  return `
    <div class="drawer-backdrop" data-close-drawer></div>
    <aside class="side-drawer" role="dialog" aria-modal="true" aria-labelledby="drawer-title">
      <div class="drawer-head"><div><span class="eyebrow">${isWishlist ? 'Saved for a little later' : 'The happy things'}</span><h2 id="drawer-title">${isWishlist ? 'Your wishlist' : 'Your bag'} <span>(${items.length})</span></h2></div><button class="icon-button" data-close-drawer aria-label="Close">${icon('close')}</button></div>
      ${items.length ? `<div class="drawer-items">${items.map(item => {
        const product = getProduct(item.id)
        const lineTotal = getCartItemTotal(item)
        const bundleSummary = item.items?.length
          ? `<span class="bundle-summary">Includes ${item.items.map(id => getProduct(id).name).join(', ')}</span>`
          : ''
        return `<div class="drawer-item"><img src="${imageUrl(product.image, 240)}" alt="${escapeHtml(product.name)}"><div class="drawer-item-info"><span class="product-brand">${product.brand}</span><strong>${product.name}</strong>${bundleSummary}<span class="drawer-item-price">$${lineTotal}</span>${isWishlist ? `<button class="drawer-add" data-add="${product.id}">Add to bag +</button>` : `<div class="quantity-control"><button data-quantity="${product.id}" data-delta="-1" aria-label="Remove one ${product.name}">${icon('minus', 14)}</button><span>${item.quantity}</span><button data-quantity="${product.id}" data-delta="1" aria-label="Add one ${product.name}">${icon('plus', 14)}</button></div>`}</div><button class="remove-item" data-remove="${product.id}" aria-label="Remove ${product.name}">${icon('close', 16)}</button></div>`
      }).join('')}</div>` : `<div class="drawer-empty"><span>${isWishlist ? '♡' : '✳'}</span><h3>${isWishlist ? 'Save the good ones here.' : 'Your bag’s taking a little nap.'}</h3><p>${isWishlist ? 'Tap a heart on anything that makes you think of them.' : 'Go on, find a little something that makes you smile.'}</p>${button('Find their kind of gift', { attributes: 'data-close-drawer data-scroll="#gifts"' })}</div>`}
      ${items.length && !isWishlist ? `<div class="drawer-checkout"><div class="shipping-progress"><span>${total >= 75 ? 'You unlocked free shipping. Nice!' : `$${75 - total} away from free shipping`}</span><i><i style="--progress:${Math.min(total / 75 * 100, 100)}%"></i></i></div><div class="drawer-subtotal"><span>Subtotal</span><strong>$${total}</strong></div>${button('That’s a wrap — checkout', { variant: 'coral', className: 'checkout-button', iconSize: 17 })}<span class="checkout-note">Demo checkout · no real payment taken</span></div>` : ''}
    </aside>`
}
