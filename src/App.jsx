import { useState, useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import Home from './pages/Home'
import ArticleDetail from './pages/ArticleDetail'
import { client } from './contentful'

function App() {
  const [articles, setArticles] = useState([])
  const [statut, setStatut] = useState('chargement')
  const [filtre, setFiltre] = useState('tous')

  // Le chargement vit ici, et non plus dans Home : le menu de l'en-tête et la
  // liste de la page d'accueil ont besoin des mêmes données et du même filtre.
  // Quand deux composants voisins partagent un état, on le remonte à leur
  // parent commun — c'est ce que React appelle « lifting state up ».
  useEffect(() => {
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

  // Les rubriques du menu sont déduites des données réelles : il n'y a pas de
  // champ « catégorie » dans le modèle Contentful, donc on propose ce qui
  // existe vraiment — la une, et un filtre par signature.
  const auteurs = [
    ...new Set(
      articles.map((article) => article.fields.auteur?.fields?.nom).filter(Boolean),
    ),
  ]

  const rubriques = [
    { cle: 'tous', label: 'Tous' },
    { cle: 'aLaUne', label: 'À la une' },
    ...auteurs.map((nom) => ({ cle: `auteur:${nom}`, label: nom })),
  ]

  return (
    <>
      <Header rubriques={rubriques} filtre={filtre} onFiltre={setFiltre} />
      <main>
        <Routes>
          <Route
            path="/"
            element={
              <Home
                articles={articles}
                statut={statut}
                filtre={filtre}
                onFiltre={setFiltre}
              />
            }
          />
          <Route path="/article/:slug" element={<ArticleDetail />} />
        </Routes>
      </main>
      <Footer />
    </>
  )
}

export default App
