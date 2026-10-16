import '../Style/Hero.css'
import { icon } from './icon.jsx'
import { imageUrl } from './image.jsx'
import { button } from './Button.jsx'

export function renderHero() {
  return `
    <section class="hero">
      <div class="hero-copy">
        <div class="eyebrow"><span class="eyebrow-star">✳</span> The art of the little thing</div>
        <h1>Make someone’s<br><em>whole day.</em></h1>
        <p class="hero-subtitle">Good gifts for your favorite people (and pets). Pick a little something, add a bow, make a memory.</p>
        <div class="hero-actions">
          ${button('Find their kind of gift', { attributes: 'data-scroll="#gifts"', iconSize: 17 })}
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
