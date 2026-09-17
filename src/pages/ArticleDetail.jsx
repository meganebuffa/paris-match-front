import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { documentToReactComponents } from '@contentful/rich-text-react-renderer'
import { BLOCKS, MARKS } from '@contentful/rich-text-types'
import { client } from '../contentful'
import styles from './ArticleDetail.module.css'

const options = {
  renderMark: {
    [MARKS.BOLD]: (text) => <strong className={styles.accent}>{text}</strong>,
  },
  renderNode: {
    [BLOCKS.HEADING_2]: (node, children) => (
      <h2 className={styles.sousTitre}>{children}</h2>
    ),
    [BLOCKS.PARAGRAPH]: (node, children) => (
      <p className={styles.paragraphe}>{children}</p>
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

  if (statut === 'chargement') {
    return (
      <div className={styles.page}>
        <p className={styles.message}>Chargement de l'article...</p>
      </div>
    )
  }

  if (statut === 'erreur') {
    return (
      <div className={styles.page}>
        <Link className={styles.retour} to="/">
          Retour
        </Link>
        <p className={styles.message}>
          Cet article n'a pas pu être chargé. Merci de réessayer dans un instant.
        </p>
      </div>
    )
  }

  if (statut === 'introuvable') {
    return (
      <div className={styles.page}>
        <Link className={styles.retour} to="/">
          Retour
        </Link>
        <p className={styles.message}>
          Cet article n'existe pas ou n'est plus disponible.
        </p>
      </div>
    )
  }

  const auteur = article.fields.auteur?.fields?.nom
  const image = article.fields.photoCouverture?.fields?.file?.url

  return (
    <div className={styles.page}>
      <Link className={styles.retour} to="/">
        Retour
      </Link>
      <h1 className={styles.titre}>{article.fields.titre}</h1>
      {auteur && <p className={styles.auteur}>Par {auteur}</p>}
      {image && <img className={styles.image} src={image} alt="" />}
      {article.fields.chapo && (
        <p className={styles.chapo}>{article.fields.chapo}</p>
      )}
      {article.fields.corps && (
        <div>{documentToReactComponents(article.fields.corps, options)}</div>
      )}
    </div>
  )
}

export default ArticleDetail
