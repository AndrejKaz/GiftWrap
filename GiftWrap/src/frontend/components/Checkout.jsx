import '../Style/Checkout.css'
import { getCartItemTotal, getProduct } from '../../backend/store.js'
import { escapeHtml } from './image.jsx'
import { icon } from './icon.jsx'
import { button } from './Button.jsx'

function checkoutTotal(state) {
  const subtotal = state.cart.reduce((sum, item) => sum + getCartItemTotal(item), 0)
  const shipping = subtotal >= 75 ? 0 : 6
  return { subtotal, shipping, total: subtotal + shipping }
}

export function renderCheckout(state) {
  if (!state.checkoutOpen) return ''
  const { subtotal, shipping, total } = checkoutTotal(state)

  if (state.checkoutComplete) {
    return `
      <div class="checkout-backdrop" data-close-checkout>
        <section class="checkout-dialog checkout-success" role="dialog" aria-modal="true" aria-labelledby="checkout-title" aria-describedby="checkout-success-message">
          <button class="checkout-close icon-button" type="button" data-close-checkout aria-label="Close">${icon('close')}</button>
          <span class="checkout-success-mark">✳</span>
          <span class="eyebrow">All wrapped up</span>
          <h2 id="checkout-title" tabindex="-1">Your demo order is in!</h2>
          <p id="checkout-success-message" role="status">This was a checkout preview only. No payment was taken, no order was sent, and your card and address details were not saved.</p>
          ${button('Back to the good stuff', { variant: 'coral', attributes: 'data-close-checkout' })}
        </section>
      </div>`
  }

  const orderItems = state.cart.map(item => {
    const product = getProduct(item.id)
    const bundle = item.items?.length
      ? `<small>Includes ${item.items.map(id => escapeHtml(getProduct(id)?.name || 'Gift')).join(', ')}</small>`
      : ''
    return `<li><span>${escapeHtml(product?.name || 'Gift')} × ${item.quantity}${bundle}</span><strong>$${getCartItemTotal(item)}</strong></li>`
  }).join('')

  return `
    <div class="checkout-backdrop">
      <section class="checkout-dialog" role="dialog" aria-modal="true" aria-labelledby="checkout-title" aria-describedby="checkout-demo-notice">
        <div class="checkout-heading">
          <div><span class="eyebrow">A safe little pretend checkout</span><h2 id="checkout-title">Where should we send it?</h2></div>
          <button class="checkout-close icon-button" type="button" data-close-checkout aria-label="Close checkout">${icon('close')}</button>
        </div>
        <p class="checkout-demo-notice" id="checkout-demo-notice"><strong>Fictional checkout only.</strong> Do not enter real payment or personal details. Use the example address and test card below; no payment is processed, no order is created, and nothing is saved.</p>
        <div class="checkout-layout">
          <form class="checkout-form" data-checkout-form autocomplete="off">
            <fieldset>
              <legend>Delivery address</legend>
              <label for="checkout-name">Full name</label>
              <input id="checkout-name" name="name" autocomplete="name" placeholder="Alex Example" required>
              <label for="checkout-address">Street address</label>
              <input id="checkout-address" name="address" autocomplete="street-address" placeholder="123 Example Street" required>
              <div class="checkout-address-row">
                <div><label for="checkout-city">City</label><input id="checkout-city" name="city" autocomplete="address-level2" placeholder="Sampletown" required></div>
                <div><label for="checkout-postal">Postal code</label><input id="checkout-postal" name="postalCode" autocomplete="postal-code" placeholder="12345" required></div>
              </div>
              <label for="checkout-country">Country</label>
              <input id="checkout-country" name="country" autocomplete="country-name" placeholder="United States" required>
            </fieldset>
            <fieldset>
              <legend>Demo card</legend>
              <label for="checkout-card">Card number</label>
              <input id="checkout-card" name="cardNumber" inputmode="numeric" autocomplete="off" maxlength="19" pattern="4242 ?4242 ?4242 ?4242" placeholder="4242 4242 4242 4242" aria-describedby="checkout-card-help" required>
              <p id="checkout-card-help" class="checkout-field-help">Test card: 4242 4242 4242 4242 · Any valid-looking future MM/YY · Any 3 digits</p>
              <div class="checkout-address-row">
                <div><label for="checkout-expiry">Expiry (MM/YY)</label><input id="checkout-expiry" name="expiry" inputmode="numeric" autocomplete="off" maxlength="5" pattern="(0[1-9]|1[0-2])/[0-9]{2}" placeholder="12/30" required></div>
                <div><label for="checkout-cvc">Security code</label><input id="checkout-cvc" name="cvc" inputmode="numeric" autocomplete="off" maxlength="3" pattern="[0-9]{3}" placeholder="123" required></div>
              </div>
            </fieldset>
            ${button(`Place demo order · $${total}`, { variant: 'coral', className: 'checkout-submit' })}
          </form>
          <aside class="checkout-summary" aria-label="Order summary">
            <h3>Your little bundle</h3>
            <ul>${orderItems}</ul>
            <div><span>Subtotal</span><strong>$${subtotal}</strong></div>
            <div><span>Shipping</span><strong>${shipping ? `$${shipping}` : 'Free'}</strong></div>
            <div class="checkout-total"><span>Total</span><strong>$${total}</strong></div>
            <p>Orders over $75 ship free.</p>
          </aside>
        </div>
      </section>
    </div>`
}
