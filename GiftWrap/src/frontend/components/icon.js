export const icon = (name, size = 20) => {
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
