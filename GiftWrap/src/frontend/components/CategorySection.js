import { categories } from '../../backend/catalog.js'
import { icon } from './icon.js'
import { imageUrl } from './image.js'

export function renderCategories() {
  return `
    <section class="categories-section section-wrap" aria-labelledby="category-heading">
      <div class="section-heading">
        <div><span class="eyebrow">A good place to start</span><h2 id="category-heading">Who are we celebrating?</h2></div>
        <p>There’s a little something for<br>everybody you love.</p>
      </div>
      <div class="category-grid">
        ${categories.map(category => `
          <button class="category-card category-${category.color}" data-category="${category.id}" aria-label="Shop gifts ${category.name.toLowerCase()}">
            <span class="category-index">${category.mark} / 03</span>
            <span class="category-copy"><strong>${category.name}</strong><span>${category.detail}</span><i>${icon('arrow', 18)}</i></span>
            <img src="${imageUrl(category.image, 720)}" data-fallback="${category.id}" alt="" loading="lazy">
            <span class="category-image-wash"></span>
          </button>`).join('')}
      </div>
    </section>`
}
