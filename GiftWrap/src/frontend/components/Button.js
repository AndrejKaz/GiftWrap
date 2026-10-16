import { icon } from './icon.js'

export function button(text, {
  variant = 'dark',
  iconName = 'arrow',
  iconSize = 16,
  className = '',
  attributes = '',
} = {}) {
  return `<button class="button button-${variant} ${className}" ${attributes}>${text} ${icon(iconName, iconSize)}</button>`
}
