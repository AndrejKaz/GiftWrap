import '../Style/Footer.css'
import { icon } from './icon.jsx'

export function renderFooter() {
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
