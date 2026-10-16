import '../Style/Button.css'
import { icon } from './icon.jsx'

export function button(text, {
  variant = 'dark',
  iconName = 'arrow',
  iconSize = 16,
  className = '',
  attributes = '',
} = {}) {
  return `<button class="button button-${variant} ${className}" ${attributes}>${text} ${icon(iconName, iconSize)}</button>`
}
