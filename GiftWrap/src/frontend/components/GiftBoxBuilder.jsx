import { products, boxSizes } from '../../backend/catalog.js'
import { currentBox, getProduct } from '../../backend/store.js'
import '../Style/GiftBoxBuilder.css'
import { icon } from './icon.jsx'
import { imageUrl } from './image.jsx'
import { button } from './Button.jsx'

export function renderBoxBuilder(state) {
  const box = currentBox()
  const itemCount = state.boxItems.length
  return `
    <section class="builder-section" id="make-a-box">
      <div class="builder-inner section-wrap">
        <div class="builder-copy">
          <span class="eyebrow"><span class="eyebrow-star">✳</span> Made by you, wrapped by us</span>
          <h2>A little box<br>of <em>everything.</em></h2>
          <p>Put all their favorite little things in one very lovely place. We’ll make it feel like opening a hug.</p>
          <div class="builder-steps"><span><b>01</b> Pick your box</span><span><b>02</b> Choose their things</span><span><b>03</b> Send the love</span></div>
          <div class="builder-note">Every box arrives tied with a bow. Because of course it does.</div>
        </div>
        <div class="builder-card">
          <div class="builder-card-head"><div><span class="eyebrow">Your very own</span><h3>Little love box</h3></div><span class="builder-step">STEP 01 / 02</span></div>
          <div class="box-options" role="group" aria-label="Choose a gift box size">
            ${boxSizes.map(size => `
              <button class="box-option ${state.boxSize === size.id ? 'selected' : ''}" data-box-size="${size.id}" aria-pressed="${state.boxSize === size.id}">
                <span class="box-option-top"><strong>${size.name}</strong><span>$${size.price}</span></span>
                <span class="box-dimensions">${size.dimensions}</span>
                <span class="box-capacity"><i class="capacity-bar"><i style="--capacity:${Math.min(itemCount / size.capacity * 100, 100)}%"></i></i>${size.capacity} lovely ${size.capacity === 1 ? 'thing' : 'things'} max</span>
              </button>`).join('')}
          </div>
          <div class="builder-pick-head"><span>Pick their little things</span><span>${itemCount} / ${box.capacity} in your box</span></div>
          <div class="builder-picks">
            ${products.map(product => {
              const quantity = state.boxItems.filter(id => id === product.id).length
              return `<button class="builder-pick ${quantity ? 'in-box' : ''}" data-box-add="${product.id}" aria-label="${quantity ? 'Remove' : 'Add'} ${product.name} ${quantity ? 'from' : 'to'} custom box">
                <span class="pick-mini product-${product.color}"><img src="${imageUrl(product.image, 160)}" data-fallback="${product.id}" alt="" loading="lazy">${quantity ? `<i>${quantity}</i>` : ''}</span>
                <span class="pick-name">${product.name}</span><span class="pick-price">$${product.price}</span>
                <span class="pick-plus">${quantity ? '−' : '+'}</span>
              </button>`
            }).join('')}
          </div>
          <div class="builder-card-foot"><span class="box-price">${itemCount ? `$${box.price + state.boxItems.reduce((sum, id) => sum + getProduct(id).price, 0)}` : `$${box.price}`} <small>total</small></span>
            ${button(itemCount ? 'Add your box to bag' : 'Choose something first', {
              variant: 'coral',
              attributes: `data-add-box ${itemCount === 0 || itemCount > box.capacity ? 'disabled' : ''}`,
            })}
          </div>
          ${itemCount > box.capacity ? `<p class="box-warning">Your ${box.name.toLowerCase()} box fits ${box.capacity} things. Remove ${itemCount - box.capacity} to continue.</p>` : ''}
        </div>
      </div>
    </section>`
}
