import { currentBox, getProduct, saveState, state } from '../backend/store.js'
import { renderProducts } from './components/ProductSection.jsx'
import { fallbackArt as imageFallback } from './components/image.jsx'

export function attachStorefrontEvents(app, render, showToast) {
  function selectCategory(category) {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    state.category = category
    state.search = ''
    const searchInput = document.querySelector('#search-input')
    if (searchInput) searchInput.value = ''
    document.querySelectorAll('.main-nav [data-category]').forEach(link => {
      link.classList.toggle('active', link.dataset.category === category)
    })

    const section = document.querySelector('#gifts')
    if (section) {
      section.outerHTML = renderProducts(state, { animate: !reducedMotion })
    } else {
      render()
    }
  }

  app.addEventListener('error', event => {
    const image = event.target
    if (image instanceof HTMLImageElement && image.dataset.fallback && !image.dataset.fallbackApplied) {
      image.dataset.fallbackApplied = 'true'
      image.src = imageFallback(image.dataset.fallback)
    }
  }, true)

  app.addEventListener('input', event => {
    if (event.target.id !== 'search-input') return
    state.search = event.target.value
    document.querySelector('#gifts').outerHTML = renderProducts(state)
  })

  app.addEventListener('submit', event => {
    if (!event.target.matches('.newsletter')) return
    event.preventDefault()
    const email = new FormData(event.target).get('email')
    showToast(`A little love is headed to ${email} ✳`)
    event.target.reset()
  })

  app.addEventListener('click', event => {
    const target = event.target.closest('button, a, [data-close-drawer]')
    if (!target) return

    if (target.matches('[data-category]')) {
      event.preventDefault()
      state.drawer = null
      const category = target.dataset.category
      const shouldScroll = category !== 'all' && !target.closest('.product-filters')
      selectCategory(category)
      if (shouldScroll) {
        document.querySelector('#gifts').scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
      return
    }
    if (target.dataset.scroll) {
      document.querySelector(target.dataset.scroll)?.scrollIntoView({ behavior: 'smooth' })
    }
    if (target.matches('[data-wishlist]')) {
      const { wishlist: id } = target.dataset
      if (state.wishlist.has(id)) {
        state.wishlist.delete(id)
        showToast('A little something removed from your wishlist.')
      } else {
        state.wishlist.add(id)
        showToast('Saved for someone special ✳')
      }
      saveState()
      render()
      return
    }
    if (target.matches('[data-add]')) {
      addToCart(target.dataset.add)
      return
    }
    if (target.matches('.wishlist-open')) {
      state.drawer = 'wishlist'
      render()
      document.querySelector('.side-drawer .icon-button')?.focus()
      return
    }
    if (target.matches('.cart-open')) {
      state.drawer = 'cart'
      render()
      document.querySelector('.side-drawer .icon-button')?.focus()
      return
    }
    if (target.hasAttribute('data-close-drawer')) {
      state.drawer = null
      render()
      return
    }
    if (target.matches('[data-quantity]')) {
      const item = state.cart.find(cartItem => cartItem.id === target.dataset.quantity)
      if (item) item.quantity = Math.max(1, item.quantity + Number(target.dataset.delta))
      saveState()
      render()
      return
    }
    if (target.matches('[data-remove]')) {
      const id = target.dataset.remove
      state.cart = state.cart.filter(item => item.id !== id)
      state.wishlist.delete(id)
      saveState()
      render()
      return
    }
    if (target.matches('[data-box-size]')) {
      state.boxSize = target.dataset.boxSize
      render()
      return
    }
    if (target.matches('[data-box-add]')) {
      const id = target.dataset.boxAdd
      const inBoxIndex = state.boxItems.indexOf(id)
      if (inBoxIndex !== -1) {
        state.boxItems.splice(inBoxIndex, 1)
      } else if (state.boxItems.length >= currentBox().capacity) {
        showToast(`Your ${currentBox().name.toLowerCase()} box is full. Try a bigger one ✳`)
        return
      } else {
        state.boxItems.push(id)
      }
      render()
      return
    }
    if (target.matches('[data-add-box]') && !target.disabled) {
      const box = currentBox()
      state.cart.push({ id: `gift-box-${box.id}`, quantity: 1, box: box.id, items: [...state.boxItems] })
      state.boxItems = []
      state.drawer = 'cart'
      saveState()
      showToast('Your very own gift box is in the bag ✳')
      render()
      return
    }
    if (target.matches('.checkout-button')) {
      showToast('Lovely choice. Checkout is coming very soon ✳')
      return
    }
    if (target.matches('.mobile-menu')) {
      document.querySelector('.main-nav').classList.toggle('mobile-open')
      return
    }
    if (target.matches('.wordmark')) {
      event.preventDefault()
      state.category = 'all'
      state.search = ''
      state.drawer = null
      render()
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  })

  document.addEventListener('keydown', event => {
    if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
      event.preventDefault()
      document.querySelector('#search-input')?.focus()
    }
    if (event.key === 'Escape' && state.drawer) {
      state.drawer = null
      render()
    }
  })
}

function addToCart(id, quantity = 1) {
  const found = state.cart.find(item => item.id === id)
  if (found) found.quantity += quantity
  else state.cart.push({ id, quantity })
  saveState()
  render()
  showToast(`${getProduct(id).name} added to your bag ✳`)
}
