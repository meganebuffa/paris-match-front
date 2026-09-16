import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { documentToReactComponents } from '@contentful/rich-text-react-renderer'
import { BLOCKS, MARKS } from '@contentful/rich-text-types'
import { client } from '../contentful'

const options = {
  renderMark: {
    [MARKS.BOLD]: (text) => <strong className="accent">{text}</strong>,
  },
  renderNode: {
    [BLOCKS.HEADING_2]: (node, children) => (
      <h2 className="article-subtitle">{children}</h2>
    ),
    [BLOCKS.PARAGRAPH]: (node, children) => (
      <p className="article-body">{children}</p>
    ),
  },
}

function ArticleDetail() {
  const { slug } = useParams()
  const [article, setArticle] = useState(null)

  useEffect(() => {
    client
      .getEntries({ content_type: 'article', 'fields.slug': slug })
      .then((response) => setArticle(response.items[0]))
      .catch((error) => console.error(error))
  }, [slug])

  if (!article) return <p>Chargement...</p>

  return (
    <div>
      <Link to="/">Retour</Link>
      <h1>{article.fields.titre}</h1>
      <p>Par {article.fields.auteur.fields.nom}</p>
      <img src={article.fields.photoCouverture.fields.file.url} alt="" width="600" />
      <p>{article.fields.chapo}</p>
      <div>{documentToReactComponents(article.fields.corps, options)}</div>
    </div>
  )
}

export default ArticleDetail