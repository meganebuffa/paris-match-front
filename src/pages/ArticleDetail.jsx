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

  // key={slug} : quand le slug change, React considère que c'est un nouveau
  // composant et remet tout son state à zéro. Pas besoin de le faire à la main.
  return <ContenuArticle key={slug} slug={slug} />
}

function ContenuArticle({ slug }) {
  const [article, setArticle] = useState(null)
  const [statut, setStatut] = useState('chargement')

  useEffect(() => {
    let annule = false

    client
      .getEntries({ content_type: 'article', 'fields.slug': slug })
      .then((response) => {
        if (annule) return
        const trouve = response.items[0]
        if (trouve) {
          setArticle(trouve)
          setStatut('succes')
        } else {
          setStatut('introuvable')
        }
      })
      .catch((error) => {
        if (annule) return
        console.error(error)
        setStatut('erreur')
      })

    return () => {
      annule = true
    }
  }, [slug])

  if (statut === 'chargement') return <p>Chargement de l'article...</p>

  if (statut === 'erreur') {
    return (
      <div>
        <Link to="/">Retour</Link>
        <p>
          Cet article n'a pas pu être chargé. Merci de réessayer dans un instant.
        </p>
      </div>
    )
  }

  if (statut === 'introuvable') {
    return (
      <div>
        <Link to="/">Retour</Link>
        <p>Cet article n'existe pas ou n'est plus disponible.</p>
      </div>
    )
  }

  const auteur = article.fields.auteur?.fields?.nom
  const image = article.fields.photoCouverture?.fields?.file?.url

  return (
    <div>
      <Link to="/">Retour</Link>
      <h1>{article.fields.titre}</h1>
      {auteur && <p>Par {auteur}</p>}
      {image && <img src={image} alt="" width="600" />}
      {article.fields.chapo && <p>{article.fields.chapo}</p>}
      {article.fields.corps && (
        <div>{documentToReactComponents(article.fields.corps, options)}</div>
      )}
    </div>
  )
}

export default ArticleDetail
