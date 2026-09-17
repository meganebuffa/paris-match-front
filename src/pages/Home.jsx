import { useState, useEffect } from 'react'
import { client } from '../contentful'
import ArticleCard from '../components/ArticleCard'
import styles from './Home.module.css'

function Home() {
  const [articles, setArticles] = useState([])
  const [statut, setStatut] = useState('chargement')
  const [filtre, setFiltre] = useState('tous')

  useEffect(() => {
    // Pas de drapeau d'annulation ici, contrairement à ArticleDetail : l'effet
    // ne part qu'une fois ([] en dépendances), donc aucune requête concurrente
    // ne peut écraser le résultat d'une autre.
    client
      .getEntries({ content_type: 'article' })
      .then((response) => {
        setArticles(response.items)
        setStatut('succes')
      })
      .catch((error) => {
        console.error(error)
        setStatut('erreur')
      })
  }, [])

  // Valeur dérivée, pas un state : elle se recalcule à chaque rendu à partir
  // de `articles` et `filtre`. aLaUne est un champ optionnel, donc absent
  // (undefined) sur les articles jamais cochés — d'où le === true explicite.
  const articlesAffiches =
    filtre === 'aLaUne'
      ? articles.filter((article) => article.fields.aLaUne === true)
      : articles

  return (
    <div className={styles.page}>
      <h1 className={styles.titre}>Paris Match</h1>

      {statut === 'succes' && (
        <div className={styles.filtres}>
          <button
            type="button"
            className={styles.bouton}
            aria-pressed={filtre === 'tous'}
            onClick={() => setFiltre('tous')}
          >
            Tous les articles
          </button>
          <button
            type="button"
            className={styles.bouton}
            aria-pressed={filtre === 'aLaUne'}
            onClick={() => setFiltre('aLaUne')}
          >
            À la une
          </button>
        </div>
      )}

      {statut === 'chargement' && (
        <p className={styles.message}>Chargement des articles...</p>
      )}

      {statut === 'erreur' && (
        <p className={styles.message}>
          Les articles n'ont pas pu être chargés. Merci de réessayer dans un
          instant.
        </p>
      )}

      {statut === 'succes' && articlesAffiches.length === 0 && (
        <p className={styles.message}>
          {filtre === 'aLaUne'
            ? "Aucun article à la une pour le moment."
            : "Aucun article n'est publié pour le moment."}
        </p>
      )}

      {statut === 'succes' && articlesAffiches.length > 0 && (
        <div className={styles.liste}>
          {articlesAffiches.map((article) => (
            <ArticleCard
              key={article.sys.id}
              slug={article.fields.slug}
              titre={article.fields.titre}
              chapo={article.fields.chapo}
              auteur={article.fields.auteur?.fields?.nom}
              image={article.fields.photoCouverture?.fields?.file?.url}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default Home
