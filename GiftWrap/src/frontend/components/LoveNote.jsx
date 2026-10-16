import '../Style/LoveNote.css'
import { icon } from './icon.jsx'
import { imageUrl } from './image.jsx'

export function renderLoveNote() {
  return `
    <section class="love-note section-wrap">
      <div class="love-note-image"><img src="${imageUrl('photo-1511988617509-a57c8a288659', 900)}" data-fallback="adults" alt="Friends sharing a joyful moment together" loading="lazy"><span>the happy looks good on you</span></div>
      <div class="love-note-copy"><span class="eyebrow">A little thing to remember</span><span class="big-quote">“</span><h2>It’s not just the gift.<br>It’s the <em>‘I thought of you.’</em></h2><p>For your best friend, your tiny human, your ride-or-die retriever. The good stuff is always better when it’s shared.</p><a href="#gifts" class="text-link">Find their little something <span>↗</span></a><span class="note-stamp">WITH<br>LOVE<br><b>✳</b></span></div>
    </section>`
}
