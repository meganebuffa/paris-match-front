/**
 * Contentful sert ses images via un CDN qui redimensionne à la volée.
 * Demander la largeur réellement affichée, en webp, évite de télécharger
 * une photo de 4000 px pour la montrer dans une carte de 400 px.
 */
export function imageUrl(url, largeur) {
  if (!url) return undefined
  const absolue = url.startsWith('//') ? `https:${url}` : url
  return `${absolue}?w=${largeur}&fm=webp&q=75`
}

const formateurDate = new Intl.DateTimeFormat('fr-FR', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
})

/** "2026-09-15T15:00+02:00" -> "15 septembre 2026" */
export function formatDate(iso) {
  if (!iso) return undefined
  return formateurDate.format(new Date(iso))
}
