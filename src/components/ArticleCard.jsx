import { Link } from 'react-router-dom'

function ArticleCard({ slug, titre, chapo, auteur, image }) {
  return (
    <article>
      <img src={image} alt="" width="400" />
      <h2>
        <Link to={`/article/${slug}`}>{titre}</Link>
      </h2>
      <p>{chapo}</p>
      <p>Par {auteur}</p>
    </article>
  )
}

export default ArticleCard