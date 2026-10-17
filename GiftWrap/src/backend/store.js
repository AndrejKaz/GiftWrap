import { boxSizes, products } from './catalog.js'

export const state = {
  category: 'all',
  search: '',
  user: null,
  authLoading: true,
  authMode: 'login',
  authBusy: false,
  authError: '',
  products,
  databaseError: '',
  databaseLoading: false,
  wishlist: new Set(),
  cart: [],
  boxSize: 'medium',
  boxItems: [],
  drawer: null,
  checkoutOpen: false,
  checkoutComplete: false,
  productDetailId: '',
  productSort: 'recommended',
}

function getStorageKey() {
  return state.user?.id ? `littlethings-store:${state.user.id}` : 'littlethings-store'
}

export function loadSavedState() {
  state.wishlist = new Set()
  state.cart = []
  try {
    const saved = JSON.parse(localStorage.getItem(getStorageKey()) || '{}')
    if (Array.isArray(saved.wishlist)) {
      state.wishlist = new Set(saved.wishlist.filter(id => state.products.some(product => product.id === id)))
    }
    if (Array.isArray(saved.cart)) {
      state.cart = saved.cart
        .filter(item => getProduct(item.id) && Number.isInteger(item.quantity) && item.quantity > 0)
        .map(item => ({ ...item }))
    }
  } catch (error) {
    console.error('Could not restore your saved bag and wishlist.', error)
  }
}

export function saveState() {
  try {
    localStorage.setItem(getStorageKey(), JSON.stringify({
      wishlist: [...state.wishlist],
      cart: state.cart,
    }))
  } catch (error) {
    console.error('Could not save your bag and wishlist.', error)
  }
}

export function getProduct(id) {
  const product = state.products.find(item => item.id === id) ?? products.find(item => item.id === id)
  if (product) return product

  const box = boxSizes.find(size => id === `gift-box-${size.id}`)
  if (!box) return undefined

  return {
    id,
    name: `Little love box · ${box.name}`,
    brand: 'Little things · made by you',
    price: box.price,
    category: 'gift',
    kind: 'Your custom gift box',
    color: 'sage',
    image: 'photo-1549465220-1a8b9238cd48',
    isGiftBox: true,
  }
}

export function getCartItemTotal(item) {
  const product = getProduct(item.id)
  if (!product) return 0
  const giftContents = item.items?.reduce((sum, id) => sum + (getProduct(id)?.price ?? 0), 0) ?? 0
  return (product.price + giftContents) * item.quantity
}

export function currentBox() {
  return boxSizes.find(box => box.id === state.boxSize)
}

export function getCartCount() {
  return state.cart.reduce((total, item) => total + item.quantity, 0)
}
