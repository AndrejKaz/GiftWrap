export function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, character => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  })[character])
}

export function imageUrl(photo, width = 720) {
  return `https://images.unsplash.com/${photo}?auto=format&fit=crop&w=${width}&q=85`
}

export function fallbackArt(key) {
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
