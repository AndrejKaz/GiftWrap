import { currentBox, getProduct, saveState, state } from '../backend/store.js'
import { loadDatabaseCatalog, registerWithUsername, signInWithUsername, signOut } from '../backend/supabase.js'
import { renderProducts } from './components/ProductSection.jsx'
import { fallbackArt as imageFallback } from './components/image.jsx'

export function attachStorefrontEvents(app, render, showToast, applySessionUser) {
  let modalReturnProductId = ''
  let modalReturnTrigger = 'name'

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

  app.addEventListener('wheel', event => {
    if (!(event.target instanceof Element)) return
    const grid = event.target.closest('.product-grid')
    if (!grid || grid.scrollWidth <= grid.clientWidth || Math.abs(event.deltaX) >= Math.abs(event.deltaY)) return

    const multiplier = event.deltaMode === WheelEvent.DOM_DELTA_LINE
      ? 16
      : event.deltaMode === WheelEvent.DOM_DELTA_PAGE
        ? window.innerHeight
        : 1
    const delta = event.deltaY * multiplier
    if (!delta || (delta < 0 && grid.scrollLeft <= 0) || (delta > 0 && grid.scrollLeft >= grid.scrollWidth - grid.clientWidth)) return

    event.preventDefault()
    grid.scrollLeft = Math.max(0, Math.min(grid.scrollLeft + delta, grid.scrollWidth - grid.clientWidth))
  }, { passive: false })

  function addToCart(id, quantity = 1) {
    const found = state.cart.find(item => item.id === id)
    if (found) found.quantity += quantity
    else state.cart.push({ id, quantity })
    saveState()
    render()
    showToast(`${getProduct(id).name} added to your bag ✳`)
  }

  function updateSearch(event) {
    if (!(event.target instanceof HTMLInputElement) || event.target.id !== 'search-input') return
    state.search = event.target.value
    const section = document.querySelector('#gifts')
    if (!section) return

    const scrollX = window.scrollX
    const scrollY = window.scrollY
    const nextSection = document.createElement('template')
    nextSection.innerHTML = renderProducts(state)
    const next = nextSection.content.querySelector('#gifts')
    section.querySelector('.product-section-eyebrow').textContent =
      next.querySelector('.product-section-eyebrow').textContent
    section.querySelector('#gifts-heading').textContent =
      next.querySelector('#gifts-heading').textContent
    const results = section.querySelector('.product-results')
    results.innerHTML = next.querySelector('.product-results').innerHTML
    const grid = results.querySelector('.product-grid')
    if (grid) grid.scrollLeft = 0

    const root = document.documentElement
    const previousScrollBehavior = root.style.scrollBehavior
    root.style.scrollBehavior = 'auto'
    window.scrollTo(scrollX, scrollY)
    requestAnimationFrame(() => {
      window.scrollTo(scrollX, scrollY)
      root.style.scrollBehavior = previousScrollBehavior
    })
  }

  function closeDrawer({ restoreFocus = true } = {}) {
    const wasWishlist = state.drawer === 'wishlist'
    state.drawer = null
    render()
    if (restoreFocus) document.querySelector(wasWishlist ? '.wishlist-open' : '.cart-open')?.focus()
  }

  app.addEventListener('input', updateSearch)
  app.addEventListener('search', updateSearch)

  app.addEventListener('change', event => {
    if (!(event.target instanceof HTMLSelectElement) || event.target.id !== 'product-sort') return
    state.productSort = event.target.value
    const input = document.querySelector('#search-input')
    if (input) updateSearch({ target: input })
  })

  app.addEventListener('keydown', event => {
    if (!(event.ctrlKey || event.metaKey) || event.key.toLocaleLowerCase() !== 'k') return
    if (document.querySelector('[role="dialog"][aria-modal="true"]')) return
    const searchInput = document.querySelector('#search-input')
    if (!searchInput) return
    event.preventDefault()
    searchInput.focus()
  })

  app.addEventListener('submit', event => {
    if (event.target.matches('[data-checkout-form]')) {
      event.preventDefault()
      const form = event.target
      if (!form.reportValidity()) return

      const cardNumber = String(new FormData(form).get('cardNumber') || '').replace(/\s/g, '')
      if (cardNumber !== '4242424242424242') {
        const input = form.elements.cardNumber
        input.setCustomValidity('Use the demo card number shown above.')
        input.reportValidity()
        input.addEventListener('input', () => input.setCustomValidity(''), { once: true })
        return
      }

      state.checkoutComplete = true
      state.cart = []
      saveState()
      render()
      document.querySelector('.checkout-success h2')?.focus()
      return
    }
    if (event.target.matches('[data-auth-form]')) {
      event.preventDefault()
      const form = event.target
      const credentials = Object.fromEntries(new FormData(form))
      const registering = state.authMode === 'register'
      if (registering && credentials.password !== credentials.passwordConfirm) {
        state.authError = 'Those passwords do not match.'
        render()
        return
      }

      state.authBusy = true
      state.authError = ''
      render()
      const authentication = registering
        ? registerWithUsername(credentials.username, credentials.password)
        : signInWithUsername(credentials.username, credentials.password)

      authentication.then(async data => {
        if (!data.token || !data.user) {
          state.authError = 'The authentication service did not return a session. Check the Supabase Edge Function configuration.'
          return
        }
        await applySessionUser(data.user)
      }).catch(error => {
        state.authError = error.message
      }).finally(() => {
        state.authBusy = false
        render()
      })
      return
    }
    if (!event.target.matches('.newsletter')) return
    event.preventDefault()
    const email = new FormData(event.target).get('email')
    showToast(`A little love is headed to ${email} ✳`)
    event.target.reset()
  })

  app.addEventListener('click', event => {
    const target = event.target.closest('button, a, [data-close-drawer]')
    if (event.target.matches('.product-detail-backdrop')) {
      closeProductDetails()
      return
    }
    if (event.target.matches('.checkout-backdrop')) {
      const completed = state.checkoutComplete
      state.checkoutOpen = false
      state.checkoutComplete = false
      state.drawer = completed ? null : 'cart'
      render()
      if (completed) document.querySelector('.cart-open')?.focus()
      else document.querySelector('.checkout-button')?.focus()
      return
    }
    if (!target) return

    if (target.matches('[data-auth-mode]')) {
      state.authMode = target.dataset.authMode
      state.authError = ''
      render()
      document.querySelector('#auth-username')?.focus()
      return
    }
    if (target.matches('[data-sign-out]')) {
      state.authBusy = true
      signOut()
        .then(() => applySessionUser(null))
        .catch(error => showToast(`Could not sign out. ${error.message}`))
        .finally(() => {
          state.authBusy = false
          render()
        })
      return
    }
    if (target.matches('[data-retry-catalog]')) {
      state.databaseError = ''
      state.databaseLoading = true
      render()
      loadDatabaseCatalog()
        .then(products => {
          state.products = products
        })
        .catch(error => {
          state.databaseError = error.message
        })
        .finally(() => {
          state.databaseLoading = false
          render()
        })
      return
    }
    if (target.matches('[data-product-details]')) {
      modalReturnProductId = target.dataset.productDetails
      modalReturnTrigger = target.classList.contains('product-image-details') ? 'image' : 'name'
      state.productDetailId = modalReturnProductId
      render()
      document.querySelector('.product-detail-close')?.focus()
      return
    }
    if (target.matches('[data-close-product-details]')) {
      closeProductDetails()
      return
    }
    if (target.matches('[data-detail-add]')) {
      const id = target.dataset.detailAdd
      state.productDetailId = ''
      addToCart(id)
      return
    }
    if (target.matches('[data-clear-search]')) {
      state.search = ''
      const input = document.querySelector('#search-input')
      if (input) input.value = ''
      if (input) updateSearch({ target: input })
      return
    }
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
      closeDrawer({ restoreFocus: !target.dataset.scroll })
      return
    }
    if (target.matches('[data-close-checkout]')) {
      const completed = state.checkoutComplete
      state.checkoutOpen = false
      state.checkoutComplete = false
      state.drawer = completed ? null : 'cart'
      render()
      if (completed) document.querySelector('.cart-open')?.focus()
      else document.querySelector('.checkout-button')?.focus()
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
      state.drawer = null
      state.checkoutComplete = false
      state.checkoutOpen = true
      render()
      document.querySelector('#checkout-name')?.focus()
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
    const dialog = document.querySelector('[role="dialog"][aria-modal="true"]')
    if (dialog && event.key === 'Tab') {
      const focusable = [...dialog.querySelectorAll('a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])')]
        .filter(element => element.getClientRects().length > 0)
      if (focusable.length) {
        const first = focusable[0]
        const last = focusable[focusable.length - 1]
        if (event.shiftKey && (document.activeElement === first || !dialog.contains(document.activeElement))) {
          event.preventDefault()
          last.focus()
        } else if (!event.shiftKey && (document.activeElement === last || !dialog.contains(document.activeElement))) {
          event.preventDefault()
          first.focus()
        }
      }
    }
    if (!dialog && (event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
      event.preventDefault()
      document.querySelector('#search-input')?.focus()
    }
    if (event.key === 'Escape' && state.productDetailId) {
      closeProductDetails()
      return
    }
    if (event.key === 'Escape' && (state.drawer || state.checkoutOpen)) {
      const completed = state.checkoutComplete
      const checkoutWasOpen = state.checkoutOpen
      const drawerWasOpen = Boolean(state.drawer)
      const wishlistWasOpen = state.drawer === 'wishlist'
      state.drawer = null
      state.checkoutOpen = false
      state.checkoutComplete = false
      if (checkoutWasOpen && !completed) state.drawer = 'cart'
      render()
      if (completed) document.querySelector('.cart-open')?.focus()
      else if (checkoutWasOpen) document.querySelector('.checkout-button')?.focus()
      else if (drawerWasOpen) document.querySelector(wishlistWasOpen ? '.wishlist-open' : '.cart-open')?.focus()
    }
  })

  function closeProductDetails() {
    const productId = modalReturnProductId
    const triggerClass = modalReturnTrigger === 'image' ? 'product-image-details' : 'product-name-button'
    state.productDetailId = ''
    modalReturnProductId = ''
    render()
    const trigger = [...document.querySelectorAll('[data-product-details]')]
      .find(element => element.dataset.productDetails === productId && element.classList.contains(triggerClass))
    trigger?.focus()
  }
}
