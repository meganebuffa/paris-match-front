import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { documentToReactComponents } from '@contentful/rich-text-react-renderer'
import { BLOCKS, MARKS } from '@contentful/rich-text-types'
import { client } from '../contentful'
import { imageUrl, formatDate } from '../utils/format'
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

function Retour() {
  return (
    <Link className={styles.retour} to="/">
      <span aria-hidden="true">←</span> Retour à la une
    </Link>
  )
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
        <div className={styles.etat}>
          <span className={styles.spinner} aria-hidden="true" />
          <p className={styles.message}>Chargement de l'article…</p>
        </div>
      </div>
    )
  }

  if (statut === 'erreur') {
    return (
      <div className={styles.page}>
        <Retour />
        <p className={styles.message}>
          Cet article n'a pas pu être chargé. Merci de réessayer dans un instant.
        </p>
      </div>
    )
  }

  if (statut === 'introuvable') {
    return (
      <div className={styles.page}>
        <Retour />
        <p className={styles.message}>
          Cet article n'existe pas ou n'est plus disponible.
        </p>
      </div>
    )
  }

  const auteur = article.fields.auteur?.fields?.nom
  const date = formatDate(article.fields.datePublication)
  const image = imageUrl(
    article.fields.photoCouverture?.fields?.file?.url,
    1200,
  )

  return (
    <article className={styles.page}>
      <Retour />

      <header className={styles.entete}>
        {article.fields.aLaUne === true && (
          <span className={styles.kicker}>À la une</span>
        )}
        <h1 className={styles.titre}>{article.fields.titre}</h1>
        {article.fields.chapo && (
          <p className={styles.chapo}>{article.fields.chapo}</p>
        )}
        {(auteur || date) && (
          <p className={styles.meta}>
            {auteur && <span>Par {auteur}</span>}
            {auteur && date && <span aria-hidden="true"> · </span>}
            {date && <span>{date}</span>}
          </p>
        )}
      </header>

      {image && (
        <figure className={styles.figure}>
          <img className={styles.image} src={image} alt="" />
        </figure>
      )}

      {article.fields.corps && (
        <div className={styles.corps}>
          {documentToReactComponents(article.fields.corps, options)}
        </div>
      )}
    </article>
  )
}

export default ArticleDetail
