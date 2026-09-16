import { useState, useEffect } from 'react'
import { client } from '../contentful'
import ArticleCard from '../components/ArticleCard'

function Home() {
  const [articles, setArticles] = useState([])

  useEffect(() => {
    client
      .getEntries({ content_type: 'article' })
      .then((response) => setArticles(response.items))
      .catch((error) => console.error(error))
  }, [])

  return (
    <div>
      <h1>Paris Match</h1>
      {articles.map((article) => (
        <ArticleCard
          key={article.sys.id}
          slug={article.fields.slug}
          titre={article.fields.titre}
          chapo={article.fields.chapo}
          auteur={article.fields.auteur.fields.nom}
          image={article.fields.photoCouverture.fields.file.url}
        />
      ))}
    </div>
  )
}

export default Home