import '../Style/DatabaseCatalog.css'
import { escapeHtml } from './image.jsx'

export function renderDatabaseCatalog(state) {
  if (state.databaseLoading) {
    return '<section class="database-catalog database-catalog-loading section-wrap" role="status" aria-live="polite">Refreshing your connected catalog…</section>'
  }
  if (!state.databaseError) return ''

  return `
    <section class="database-catalog database-catalog-error section-wrap" role="alert" aria-labelledby="database-catalog-title">
      <div>
        <span class="eyebrow">Your connected catalog</span>
        <h2 id="database-catalog-title">Supabase products could not be loaded.</h2>
        <p>${escapeHtml(state.databaseError)}</p>
        <p class="database-fallback-note">You can keep browsing the products already shown while you retry.</p>
        <button class="database-retry" type="button" data-retry-catalog>Try again</button>
      </div>
    </section>`
}
