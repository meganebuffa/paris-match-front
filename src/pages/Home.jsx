import { Link } from 'react-router-dom'
import ArticleCard from '../components/ArticleCard'
import { imageUrl, formatDate } from '../utils/format'
import { useReveal } from '../hooks/useReveal'
import styles from './Home.module.css'

/** Applique le filtre actif du menu à la liste complète. */
function filtrer(articles, filtre) {
  if (filtre === 'aLaUne') {
    // aLaUne est un champ optionnel : il vaut undefined sur les articles
    // jamais cochés, d'où le === true explicite.
    return articles.filter((article) => article.fields.aLaUne === true)
  }
  if (filtre.startsWith('auteur:')) {
    const nom = filtre.slice('auteur:'.length)
    return articles.filter(
      (article) => article.fields.auteur?.fields?.nom === nom,
    )
  }
  return articles
}

function Home({ articles, statut, filtre, onFiltre }) {
  // Valeur dérivée, pas un state : elle se recalcule à chaque rendu à partir
  // de `articles` et `filtre`. Un state en plus créerait deux sources de
  // vérité pouvant se désynchroniser.
  const affiches = filtrer(articles, filtre)

  // La une revient à l'article coché par la rédaction. À défaut, le premier
  // de la liste prend la place : la page garde toujours sa tête d'affiche.
  const une =
    affiches.find((article) => article.fields.aLaUne === true) ?? affiches[0]
  const secondaires = affiches.filter((article) => article !== une)

  const [refSection, sectionVisible] = useReveal()

  const uneImage = imageUrl(une?.fields.photoCouverture?.fields?.file?.url, 1600)
  const uneAuteur = une?.fields.auteur?.fields?.nom
  const uneDate = formatDate(une?.fields.datePublication)

  return (
    <div className={styles.page}>
      <h1 className={styles.titreCache}>Paris Match — l'actualité en continu</h1>

      {statut === 'chargement' && (
        <div className={styles.etat}>
          <span className={styles.spinner} aria-hidden="true" />
          <p className={styles.message}>Chargement des articles…</p>
        </div>
      )}

      {statut === 'erreur' && (
        <div className={styles.etat}>
          <p className={styles.message}>
            Les articles n'ont pas pu être chargés. Merci de réessayer dans un
            instant.
          </p>
        </div>
      )}

      {statut === 'succes' && affiches.length === 0 && (
        <div className={styles.etat}>
          <p className={styles.message}>
            {filtre === 'aLaUne'
              ? 'Aucun article à la une pour le moment.'
              : filtre.startsWith('auteur:')
                ? `Aucun article signé ${filtre.slice('auteur:'.length)}.`
                : "Aucun article n'est publié pour le moment."}
          </p>
          {filtre !== 'tous' && (
            <button
              type="button"
              className={styles.retourTous}
              onClick={() => onFiltre('tous')}
            >
              Voir tous les articles
            </button>
          )}
        </div>
      )}

      {statut === 'succes' && une && (
        <Link to={`/article/${une.fields.slug}`} className={styles.une}>
          <div className={styles.uneCadre}>
            {uneImage && (
              <img className={styles.uneImage} src={uneImage} alt="" />
            )}
            <div className={styles.uneVoile} />
          </div>
          <div className={styles.uneTexte}>
            {une.fields.aLaUne === true && (
              <span className={styles.kicker}>À la une</span>
            )}
            <h2 className={styles.uneTitre}>{une.fields.titre}</h2>
            {une.fields.chapo && (
              <p className={styles.uneChapo}>{une.fields.chapo}</p>
            )}
            {(uneAuteur || uneDate) && (
              <p className={styles.uneMeta}>
                {uneAuteur && <span>Par {uneAuteur}</span>}
                {uneAuteur && uneDate && <span aria-hidden="true"> · </span>}
                {uneDate && <span>{uneDate}</span>}
              </p>
            )}
            <span className={styles.uneLire}>Lire l'article</span>
          </div>
        </Link>
      )}

      {statut === 'succes' && secondaires.length > 0 && (
        <section
          ref={refSection}
          className={`${styles.section} ${sectionVisible ? styles.visible : ''}`}
        >
          <h2 className={styles.sectionTitre}>À lire aussi</h2>
          <div className={styles.grille}>
            {secondaires.map((article, index) => (
              <ArticleCard
                key={article.sys.id}
                index={index}
                slug={article.fields.slug}
                titre={article.fields.titre}
                chapo={article.fields.chapo}
                auteur={article.fields.auteur?.fields?.nom}
                image={article.fields.photoCouverture?.fields?.file?.url}
                date={article.fields.datePublication}
                aLaUne={article.fields.aLaUne === true}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}

export default Home
