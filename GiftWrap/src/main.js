import './style.css'

const icon = (name, size = 20) => {
  const paths = {
    search: '<circle cx="11" cy="11" r="7"></circle><path d="m20 20-4-4"></path>',
    heart: '<path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1.1L12 21l7.8-7.5 1.1-1.1a5.5 5.5 0 0 0-.1-7.8Z"></path>',
    bag: '<path d="M6 7h12l1 14H5L6 7Z"></path><path d="M9 7a3 3 0 0 1 6 0"></path>',
    arrow: '<path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path>',
    chevron: '<path d="m9 18 6-6-6-6"></path>',
    close: '<path d="m18 6-12 12"></path><path d="m6 6 12 12"></path>',
    minus: '<path d="M5 12h14"></path>',
    plus: '<path d="M12 5v14"></path><path d="M5 12h14"></path>',
    trash: '<path d="M3 6h18"></path><path d="M8 6V4h8v2"></path><path d="m19 6-1 14H6L5 6"></path><path d="M10 11v5m4-5v5"></path>',
    gift: '<rect x="3" y="8" width="18" height="13" rx="2"></rect><path d="M12 8v13m9-9H3m9-4c-2.4 0-4-1-4-2.5S9 3 10 4c1.2 1.2 2 4 2 4Zm0 0c2.4 0 4-1 4-2.5S15 3 14 4c-1.2 1.2-2 4-2 4Z"></path>',
    truck: '<path d="M3 6h11v11H3z"></path><path d="M14 10h4l3 3v4h-7z"></path><circle cx="7.5" cy="18.5" r="1.5"></circle><circle cx="17.5" cy="18.5" r="1.5"></circle>',
  }
  return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.65" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths[name] ?? ''}</svg>`
}

const products = [
  { id: 'sun-drops', name: 'Sun drops hoops', brand: 'Morrow Studio', price: 48, category: 'adults', kind: 'Jewellery', color: 'sand', image: 'photo-1535632066927-ab7c9ab60908', badge: 'Bestseller' },
  { id: 'little-garden', name: 'The little garden kit', brand: 'Mud & Bloom', price: 32, category: 'kids', kind: 'Creative play', color: 'lilac', image: 'photo-1599623560574-39d485900c95', badge: 'Little joy' },
  { id: 'good-dog', name: 'Good dog day set', brand: 'Sunday Pup', price: 38, category: 'pets', kind: 'For your dog', color: 'peach', image: 'photo-1589924691995-400dc9ecc119', badge: 'Pup-approved' },
  { id: 'soft-hours', name: 'Soft hours candle', brand: 'Sonder Home', price: 29, category: 'adults', kind: 'Little luxuries', color: 'butter', image: 'photo-1603006905003-be475563bc59', badge: '' },
  { id: 'story-time', name: 'A very good story', brand: 'Small Hours Press', price: 24, category: 'kids', kind: 'Books & comics', color: 'blue', image: 'photo-1512820790803-83ca734da794', badge: 'For story time' },
  { id: 'cat-nap', name: 'The window-seat cushion', brand: 'Soft Spot', price: 56, category: 'pets', kind: 'For your cat', color: 'sage', image: 'photo-1573865526739-10659fec78a5', badge: 'Cat favorite' },
  { id: 'berry-tumbler', name: 'Sunday berry tumbler', brand: 'Good Measure', price: 34, category: 'adults', kind: 'Everyday things', color: 'blue', image: 'photo-1513558161293-cdaf765edfd7', badge: '' },
  { id: 'playful-puzzle', name: 'A little bit of everything', brand: 'Happy Campers', price: 27, category: 'kids', kind: 'Games & puzzles', color: 'peach', image: 'photo-1606509036992-664d5a9fae69', badge: 'Best for sharing' },
  { id: 'fish-bowl', name: 'The tiny fin snack pack', brand: 'Little Current', price: 18, category: 'pets', kind: 'For your fish', color: 'lilac', image: 'photo-1522069169874-c58ec4b76be5', badge: '' },
  { id: 'garden-after-rain', name: 'Garden after rain perfume', brand: 'Sunday Scent Co.', price: 62, category: 'adults', kind: 'A little luxury', color: 'sage', image: 'photo-1541643600914-78b084683601', badge: 'New favorite' },
  { id: 'golden-hour', name: 'Golden hour aperitif', brand: 'A little later', price: 42, category: 'adults', kind: 'For the grown-ups', color: 'butter', image: 'photo-1514362545857-3bc16c4c7d1b', badge: '18+' },
  { id: 'comic-relief', name: 'The comic relief collection', brand: 'Small Hours Press', price: 22, category: 'kids', kind: 'Comics & stories', color: 'blue', image: 'photo-1519791883288-dc8bd696e667', badge: '' },
  { id: 'tiny-artist', name: 'Make-believe building set', brand: 'Happy Campers', price: 35, category: 'kids', kind: 'Toys & make-believe', color: 'lilac', image: 'photo-1599623560574-39d485900c95', badge: 'Make something' },
  { id: 'nap-club', name: 'Nap club cloud bed', brand: 'Soft Spot', price: 64, category: 'pets', kind: 'For sleepy pets', color: 'sage', image: 'photo-1583337130417-3346a1be7dee', badge: 'Extra cozy' },
  { id: 'tiny-feast', name: 'The little treat tin', brand: 'Sunday Pup', price: 19, category: 'pets', kind: 'Treats for good pets', color: 'peach', image: 'photo-1560743641-3914f2c45636', badge: '' },
  { id: 'parrot-party', name: 'Parrot party perch set', brand: 'Little Current', price: 31, category: 'pets', kind: 'For your parrot', color: 'butter', image: 'photo-1535591273668-578e31182c4f', badge: 'Bird-approved' },
]

const categories = [
  { id: 'adults', name: 'For your people', detail: 'A little something, just because.', image: 'photo-1517841905240-472988babdf9', color: 'peach', mark: '01' },
  { id: 'kids', name: 'For little ones', detail: 'Big wonder in a little box.', image: 'photo-1503454537195-1dcabb73ffb9', color: 'butter', mark: '02' },
  { id: 'pets', name: 'For the fur family', detail: 'They’re family, too. Obviously.', image: 'photo-1543466835-00a7907e9de1', color: 'sage', mark: '03' },
]

const boxSizes = [
  { id: 'small', name: 'Little', dimensions: '15 × 15 cm', capacity: 2, price: 8 },
  { id: 'medium', name: 'Lovely', dimensions: '30 × 30 cm', capacity: 5, price: 12 },
  { id: 'large', name: 'Big-hearted', dimensions: '60 × 45 cm', capacity: 9, price: 18 },
]

const app = document.querySelector('#app')
const state = {
  category: 'all',
  search: '',
  wishlist: new Set(),
  cart: [],
  boxSize: 'medium',
  boxItems: [],
  drawer: null,
}

function loadSavedState() {
  try {
    const saved = JSON.parse(localStorage.getItem('littlethings-store') || '{}')
    if (Array.isArray(saved.wishlist)) state.wishlist = new Set(saved.wishlist.filter(id => products.some(product => product.id === id)))
    if (Array.isArray(saved.cart)) {
      state.cart = saved.cart
        .filter(item => getProduct(item.id) && Number.isInteger(item.quantity) && item.quantity > 0)
        .map(item => ({ ...item }))
    }
  } catch (error) {
    console.error('Could not restore your saved bag and wishlist.', error)
  }
}

function saveState() {
  try {
    localStorage.setItem('littlethings-store', JSON.stringify({
      wishlist: [...state.wishlist],
      cart: state.cart,
    }))
  } catch (error) {
    console.error('Could not save your bag and wishlist.', error)
  }
}

function getProduct(id) {
  const product = products.find(item => item.id === id)
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

function getCartItemTotal(item) {
  const product = getProduct(item.id)
  const giftContents = item.items?.reduce((sum, id) => sum + (getProduct(id)?.price ?? 0), 0) ?? 0
  return (product.price + giftContents) * item.quantity
}

function currentBox() {
  return boxSizes.find(box => box.id === state.boxSize)
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, character => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  })[character])
}

function imageUrl(photo, width = 720) {
  return `https://images.unsplash.com/${photo}?auto=format&fit=crop&w=${width}&q=85`
}

function fallbackArt(key) {
  const palettes = {
    'sun-drops': ['#e9d7c2', '#bd7852', '#5b4636'],
    'little-garden': ['#e7dfee', '#a292bb', '#d48261'],
    'good-dog': ['#f1d9cb', '#bd8259', '#75533f'],
    'soft-hours': ['#efe4bb', '#d8a354', '#78855f'],
    'story-time': ['#dce5eb', '#65809a', '#d7a55c'],
    'cat-nap': ['#dfe7da', '#8caa94', '#8a705c'],
    'berry-tumbler': ['#d9e4e9', '#7892a2', '#cb705e'],
    'playful-puzzle': ['#f0d9cd', '#d78365', '#718c72'],
    'fish-bowl': ['#e4deec', '#8a86aa', '#66aeb2'],
    adults: ['#ead8ca', '#b98562', '#71584a'],
    kids: ['#f0e3c6', '#ddad60', '#738965'],
    pets: ['#dfe7da', '#83a087', '#b27758'],
    gift: ['#f1dfd0', '#d17b62', '#809174'],
  }
  const [paper, main, detail] = palettes[key] ?? palettes.gift
  let object = '<rect x="192" y="205" width="216" height="218" rx="12" fill="#efc68f"/><rect x="176" y="185" width="248" height="54" rx="10" fill="#f6d6a8"/><path d="M293 185c-70-9-77-69-37-64 26 3 39 44 40 64Zm13 0c70-9 77-69 37-64-26 3-39 44-40 64Z" fill="#fff8e9"/><path d="M299 187v236m-107-185h216" stroke="#c96750" stroke-width="18"/>'
  if (key === 'sun-drops') object = '<path d="M244 169c-12 41-27 52-44 70m44-70c12 41 27 52 44 70m-44-70v106" fill="none" stroke="#c28d3f" stroke-width="9" stroke-linecap="round"/><circle cx="200" cy="245" r="16" fill="#e6b955"/><circle cx="288" cy="245" r="16" fill="#e6b955"/><path d="M244 275c0 46-42 79-42 111a42 42 0 0 0 84 0c0-32-42-65-42-111Z" fill="#d99a58"/>'
  if (key === 'little-garden' || key === 'playful-puzzle') object = '<rect x="178" y="211" width="244" height="188" rx="22" fill="#f6e8ce"/><rect x="199" y="230" width="91" height="84" rx="20" fill="#d99177"/><rect x="307" y="230" width="91" height="84" rx="20" fill="#91a982"/><rect x="199" y="327" width="91" height="48" rx="18" fill="#e5bb64"/><circle cx="352" cy="351" r="30" fill="#93b4bd"/><path d="M234 210c4-49 42-60 53-26s-24 28-53 26Zm74 2c28-38 68-27 51 6s-39 5-51-6Z" fill="#7d9c70"/>'
  if (key === 'good-dog') object = '<path d="M166 302c-23-39 5-66 40-43l36 25h80l37-25c36-23 63 4 40 43l-36 60c-12 20-35 28-57 24-21-4-39-4-60 0-23 4-45-4-57-24Z" fill="#f0c79e"/><circle cx="248" cy="322" r="7" fill="#765944"/><circle cx="352" cy="322" r="7" fill="#765944"/><path d="M282 349c8-8 28-8 36 0-5 16-31 16-36 0Z" fill="#b86d5b"/>'
  if (key === 'soft-hours') object = '<path d="M276 153c-29 46 20 56-14 99 46-15 57-57 25-99Z" fill="#e6a754"/><rect x="207" y="244" width="186" height="184" rx="27" fill="#f4d99f"/><rect x="192" y="230" width="216" height="33" rx="12" fill="#d4a25c"/><path d="M247 320h106m-106 23h77" stroke="#fff3d5" stroke-width="8" stroke-linecap="round"/>'
  if (key === 'story-time') object = '<path d="M179 207c48-15 82-6 121 18v183c-39-24-73-33-121-18Zm242 0c-48-15-82-6-121 18v183c39-24 73-33 121-18Z" fill="#f6e9ce" stroke="#668099" stroke-width="12" stroke-linejoin="round"/><path d="M213 261h57m-57 24h57m-57 24h57m-23-48h57m-57 24h57m-57 24h57" stroke="#a7a08e" stroke-width="6" stroke-linecap="round"/>'
  if (key === 'cat-nap') object = '<path d="m185 247 20-72 62 40h66l62-40 20 72v130c0 37-30 67-67 67h-96c-37 0-67-30-67-67Z" fill="#e9e5d7"/><path d="m205 181 55 39m154-39-55 39" stroke="#8fa394" stroke-width="14" stroke-linecap="round"/><path d="M250 314h10m80 0h10m-57 34 8 6 8-6m-58-22 26 7m66-7-26 7" fill="none" stroke="#887563" stroke-width="8" stroke-linecap="round"/>'
  if (key === 'berry-tumbler') object = '<path d="M221 202h158l-16 220H237Z" fill="#f2e7d3"/><path d="M229 305h142l-8 112H237Z" fill="#bd6e65"/><path d="M248 186h104m-52 0v44m0 25c-28 27-28 55 0 68 28-13 28-41 0-68Z" fill="none" stroke="#778b93" stroke-width="10" stroke-linecap="round" stroke-linejoin="round"/><circle cx="278" cy="348" r="12" fill="#e89b79"/><circle cx="324" cy="376" r="10" fill="#f3c27b"/>'
  if (key === 'fish-bowl') object = '<path d="M169 221h262l-24 185c-8 53-48 88-107 88s-99-35-107-88Z" fill="#f5f1e8" stroke="#89b6b4" stroke-width="12"/><path d="M178 330h244l-15 75c-8 46-43 73-107 73s-99-27-107-73Z" fill="#a5d2cf"/><path d="M244 324c23-30 50-30 73 0-23 30-50 30-73 0Zm68 44c20-24 42-24 62 0-20 24-42 24-62 0Z" fill="#e7a976"/><circle cx="269" cy="321" r="4" fill="#625b4f"/><circle cx="330" cy="364" r="4" fill="#625b4f"/>'
  if (key === 'garden-after-rain') object = '<rect x="221" y="208" width="158" height="225" rx="21" fill="#f4ede0" stroke="#b7aa94" stroke-width="8"/><rect x="239" y="184" width="122" height="32" rx="5" fill="#c2aa83"/><rect x="269" y="158" width="62" height="28" rx="4" fill="#e5d6bf"/><path d="M300 284c-46 42-40 79 0 101 40-22 46-59 0-101Zm0 20v78" fill="none" stroke="#829278" stroke-width="9" stroke-linecap="round"/><circle cx="300" cy="282" r="12" fill="#d28672"/>'
  if (key === 'golden-hour') object = '<path d="M245 165h110v40l28 28v198H217V233l28-28Z" fill="#e9c78d"/><path d="M245 165h110v40H245z" fill="#f5e5c6"/><rect x="234" y="284" width="132" height="76" rx="6" fill="#fff6e3"/><path d="M253 310h94m-94 24h65" stroke="#bd7657" stroke-width="8" stroke-linecap="round"/><path d="M300 165v-31" stroke="#987d56" stroke-width="9"/>'
  if (key === 'comic-relief' || key === 'story-time') object = '<path d="m204 187 177-31 31 239-177 31Z" fill="#f4e6cc" stroke="#668099" stroke-width="10" stroke-linejoin="round"/><path d="m233 211 130-23 16 117-130 23Z" fill="#e4a477"/><path d="m252 249 87-15m-82 40 58-10" stroke="#f8f0df" stroke-width="9" stroke-linecap="round"/><circle cx="300" cy="347" r="39" fill="#91a982"/>'
  if (key === 'tiny-artist' || key === 'little-garden') object = '<rect x="178" y="211" width="244" height="188" rx="22" fill="#f6e8ce"/><rect x="199" y="230" width="91" height="84" rx="20" fill="#d99177"/><rect x="307" y="230" width="91" height="84" rx="20" fill="#91a982"/><rect x="199" y="327" width="91" height="48" rx="18" fill="#e5bb64"/><circle cx="352" cy="351" r="30" fill="#93b4bd"/><path d="M234 210c4-49 42-60 53-26s-24 28-53 26Zm74 2c28-38 68-27 51 6s-39 5-51-6Z" fill="#7d9c70"/>'
  if (key === 'nap-club') object = '<rect x="175" y="257" width="250" height="171" rx="64" fill="#eae4d5"/><rect x="198" y="280" width="204" height="122" rx="52" fill="#f5f0e5"/><path d="M207 322c45-24 140-25 190 0m-177 37c38 22 128 23 164 0" fill="none" stroke="#a0aa91" stroke-width="8" stroke-linecap="round"/><circle cx="226" cy="273" r="21" fill="#f5f0e5"/><circle cx="374" cy="273" r="21" fill="#f5f0e5"/>'
  if (key === 'tiny-feast') object = '<rect x="213" y="215" width="174" height="211" rx="35" fill="#e9d5b6"/><rect x="205" y="196" width="190" height="43" rx="13" fill="#c58b5a"/><path d="M248 284h104v94H248z" fill="#fff6e6"/><path d="M264 316h72m-72 22h55" stroke="#bd7657" stroke-width="8" stroke-linecap="round"/><circle cx="286" cy="269" r="12" fill="#e4a477"/><circle cx="316" cy="269" r="12" fill="#91a982"/>'
  if (key === 'parrot-party') object = '<path d="M236 187h128l-22 44h-84Z" fill="#a77c54"/><path d="M300 231v145m-71-89h142m-132 45h122" stroke="#bb8655" stroke-width="14" stroke-linecap="round"/><path d="M300 250c-61-26-99 30-52 75 19 19 48 22 52 22s33-3 52-22c47-45 9-101-52-75Z" fill="#e2b955"/><path d="M300 251c-33 30-41 73 0 96 41-23 33-66 0-96Z" fill="#83a77e"/><circle cx="326" cy="277" r="5" fill="#514939"/>'
  if (key === 'gift') object = '<rect x="192" y="205" width="216" height="218" rx="12" fill="#efc68f"/><rect x="176" y="185" width="248" height="54" rx="10" fill="#f6d6a8"/><path d="M293 185c-70-9-77-69-37-64 26 3 39 44 40 64Zm13 0c70-9 77-69 37-64-26 3-39 44-40 64Z" fill="#fff8e9"/><path d="M299 187v236m-107-185h216" stroke="#c96750" stroke-width="18"/>'
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 600"><rect width="600" height="600" fill="${paper}"/><circle cx="100" cy="108" r="78" fill="${main}" opacity=".18"/><circle cx="521" cy="486" r="115" fill="${detail}" opacity=".12"/><path d="M60 476c117 36 365 46 480-12" fill="none" stroke="${detail}" stroke-opacity=".23" stroke-width="2"/><g>${object}</g><text x="300" y="536" text-anchor="middle" fill="${detail}" font-family="Georgia,serif" font-size="20" font-style="italic">a little something, just for you</text></svg>`
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`
}

function getCartCount() {
  return state.cart.reduce((total, item) => total + item.quantity, 0)
}

function renderHeader() {
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

function renderHero() {
  return `
    <section class="hero">
      <div class="hero-copy">
        <div class="eyebrow"><span class="eyebrow-star">✳</span> The art of the little thing</div>
        <h1>Make someone’s<br><em>whole day.</em></h1>
        <p class="hero-subtitle">Good gifts for your favorite people (and pets). Pick a little something, add a bow, make a memory.</p>
        <div class="hero-actions">
          <button class="button button-dark" data-scroll="#gifts">Find their kind of gift ${icon('arrow', 17)}</button>
          <a href="#make-a-box" class="text-link">Build a gift box <span>↗</span></a>
        </div>
        <div class="hero-notes"><div class="avatar-stack"><span>J</span><span>M</span><span>A</span></div><span>Picked with love, packed by hand</span><span class="tiny-star">✳</span></div>
        <div class="hero-sticker"><span>gifts<br>with a<br><em>little</em><br>more love</span><b>✳</b></div>
      </div>
      <div class="hero-visual">
        <img src="${imageUrl('photo-1549465220-1a8b9238cd48', 1200)}" data-fallback="gift" alt="A lovingly wrapped gift tied with a ribbon" fetchpriority="high">
        <div class="hero-image-caption"><span>Good things, thoughtfully wrapped</span><span>✳</span></div>
        <div class="image-side-note">A LITTLE GIFT GOES A LONG WAY</div>
      </div>
      <div class="hero-bottomline"><span>For the big days</span><span class="line"></span><span>And the just-because ones</span><span class="hero-bottom-spark">✳</span></div>
    </section>`
}

function renderCategories() {
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

function renderProductCard(product) {
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

function renderProducts() {
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
        ? `<div class="product-grid">${matchingProducts.map(renderProductCard).join('')}</div>`
        : `<div class="empty-state"><span>✳</span><h3>No little things found just yet.</h3><p>Try another search or take a peek at everything.</p><button class="button button-dark" data-category="all">See all the good stuff</button></div>`}
      ${!searchTerm && state.category === 'all' ? `<div class="collection-footnote"><span>✳</span> The best gifts aren’t always for a special occasion. <a href="#make-a-box">Make your own little moment ${icon('arrow', 15)}</a></div>` : ''}
    </section>`
}

function renderBoxBuilder() {
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
            <button class="button button-coral" data-add-box ${itemCount === 0 || itemCount > box.capacity ? 'disabled' : ''}>${itemCount ? 'Add your box to bag' : 'Choose something first'} ${icon('arrow', 16)}</button>
          </div>
          ${itemCount > box.capacity ? `<p class="box-warning">Your ${box.name.toLowerCase()} box fits ${box.capacity} things. Remove ${itemCount - box.capacity} to continue.</p>` : ''}
        </div>
      </div>
    </section>`
}

function renderLoveNote() {
  return `
    <section class="love-note section-wrap">
      <div class="love-note-image"><img src="${imageUrl('photo-1511988617509-a57c8a288659', 900)}" data-fallback="adults" alt="Friends sharing a joyful moment together" loading="lazy"><span>the happy looks good on you</span></div>
      <div class="love-note-copy"><span class="eyebrow">A little thing to remember</span><span class="big-quote">“</span><h2>It’s not just the gift.<br>It’s the <em>‘I thought of you.’</em></h2><p>For your best friend, your tiny human, your ride-or-die retriever. The good stuff is always better when it’s shared.</p><a href="#gifts" class="text-link">Find their little something <span>↗</span></a><span class="note-stamp">WITH<br>LOVE<br><b>✳</b></span></div>
    </section>`
}

function renderFooter() {
  return `
    <footer class="site-footer">
      <div class="footer-main section-wrap">
        <div class="footer-brand"><a class="wordmark" href="#">little<span>things</span><i>®</i></a><p>Small things. Big love.<br>Always wrapped with care.</p><div class="social-dots"><a href="#gifts" aria-label="Instagram">ig</a><a href="#gifts" aria-label="Pinterest">p</a><a href="#gifts" aria-label="TikTok">tk</a></div></div>
        <div class="footer-links"><div><span>Find their thing</span><a href="#gifts" data-category="adults">For your people</a><a href="#gifts" data-category="kids">For little ones</a><a href="#gifts" data-category="pets">For the fur family</a></div><div><span>Here to help</span><a href="#make-a-box">Build a gift box</a><a href="#gifts">Shipping & delivery</a><a href="#gifts">A note from us</a></div></div>
        <form class="newsletter"><label for="email">A little love in your inbox?</label><p>Fresh finds, happy notes, and the occasional good dog.</p>        <div class="newsletter-field"><input id="email" name="email" type="email" placeholder="Your email address" required><button type="submit" aria-label="Subscribe">${icon('arrow', 18)}</button></div><span class="newsletter-note">No noise. Just nice things.</span></form>
      </div>
      <div class="footer-bottom section-wrap"><span>© 2025 littlethings. Made for the love of it.</span><span>Good things, wrapped thoughtfully <b>✳</b></span><a href="#app">Back to the sunshine ↑</a></div>
    </footer>`
}

function renderDrawer() {
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
      }).join('')}</div>` : `<div class="drawer-empty"><span>${isWishlist ? '♡' : '✳'}</span><h3>${isWishlist ? 'Save the good ones here.' : 'Your bag’s taking a little nap.'}</h3><p>${isWishlist ? 'Tap a heart on anything that makes you think of them.' : 'Go on, find a little something that makes you smile.'}</p><button class="button button-dark" data-close-drawer data-scroll="#gifts">Find their kind of gift ${icon('arrow', 16)}</button></div>`}
      ${items.length && !isWishlist ? `<div class="drawer-checkout"><div class="shipping-progress"><span>${total >= 75 ? 'You unlocked free shipping. Nice!' : `$${75 - total} away from free shipping`}</span><i><i style="--progress:${Math.min(total / 75 * 100, 100)}%"></i></i></div><div class="drawer-subtotal"><span>Subtotal</span><strong>$${total}</strong></div><button class="button button-coral checkout-button">That’s a wrap — checkout ${icon('arrow', 17)}</button><span class="checkout-note">Shipping & any notes added at checkout</span></div>` : ''}
    </aside>`
}

function render() {
  app.innerHTML = `${renderHeader()}<main>${renderHero()}${renderCategories()}${renderProducts()}${renderBoxBuilder()}${renderLoveNote()}</main>${renderFooter()}${renderDrawer()}<div class="toast" role="status" aria-live="polite"></div>`
}

let toastTimeout
function showToast(message) {
  const toast = document.querySelector('.toast')
  toast.textContent = message
  toast.classList.add('visible')
  window.clearTimeout(toastTimeout)
  toastTimeout = window.setTimeout(() => toast.classList.remove('visible'), 2500)
}

function addToCart(id, quantity = 1) {
  const found = state.cart.find(item => item.id === id)
  if (found) found.quantity += quantity
  else state.cart.push({ id, quantity })
  saveState()
  render()
  showToast(`${getProduct(id).name} added to your bag ✳`)
}

function updateCategory(category) {
  state.category = category
  state.search = ''
  state.drawer = null
  render()
  if (category !== 'all') document.querySelector('#gifts').scrollIntoView({ behavior: 'smooth', block: 'start' })
}

loadSavedState()
render()

app.addEventListener('error', event => {
  const image = event.target
  if (image instanceof HTMLImageElement && image.dataset.fallback && !image.dataset.fallbackApplied) {
    image.dataset.fallbackApplied = 'true'
    image.src = fallbackArt(image.dataset.fallback)
  }
}, true)

app.addEventListener('input', event => {
  if (event.target.id === 'search-input') {
    const position = event.target.selectionStart
    state.search = event.target.value
    render()
    const searchInput = document.querySelector('#search-input')
    searchInput.focus()
    searchInput.setSelectionRange(position, position)
  }
})

app.addEventListener('submit', event => {
  if (event.target.matches('.newsletter')) {
    event.preventDefault()
    const email = new FormData(event.target).get('email')
    showToast(`A little love is headed to ${email} ✳`)
    event.target.reset()
  }
})

app.addEventListener('click', event => {
  const target = event.target.closest('button, a, [data-close-drawer]')
  if (!target) return

  if (target.matches('[data-category]')) {
    event.preventDefault()
    updateCategory(target.dataset.category)
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
