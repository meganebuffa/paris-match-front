import { useState, useEffect } from 'react'
import { client } from '../contentful'
import ArticleCard from '../components/ArticleCard'

function Home() {
  const [articles, setArticles] = useState([])
  const [statut, setStatut] = useState('chargement')

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

  return (
    <div>
      <h1>Paris Match</h1>

      {statut === 'chargement' && <p>Chargement des articles...</p>}

      {statut === 'erreur' && (
        <p>
          Les articles n'ont pas pu être chargés. Merci de réessayer dans un
          instant.
        </p>
      )}

      {statut === 'succes' && articles.length === 0 && (
        <p>Aucun article n'est publié pour le moment.</p>
      )}

      {statut === 'succes' &&
        articles.map((article) => (
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
  )
}

export default Home
