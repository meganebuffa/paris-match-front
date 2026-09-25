import { useEffect, useRef, useState } from 'react'

/**
 * Révèle un élément quand il entre dans le champ de vision.
 *
 * Renvoie une ref à poser sur l'élément, et un booléen `visible`.
 * IntersectionObserver est une API du navigateur : elle prévient quand
 * l'élément croise l'écran, sans écouter le scroll en continu (ce qui
 * serait coûteux).
 *
 * L'observation s'arrête dès le premier passage : on révèle une fois,
 * l'élément ne doit pas disparaître si on remonte.
 */
export function useReveal() {
  const ref = useRef(null)

  // Si la personne a demandé moins d'animations, l'élément est visible dès le
  // départ. La fonction passée à useState n'est évaluée qu'au premier rendu —
  // c'est ce qui évite un setState dans l'effet, et donc un rendu en plus.
  const [visible, setVisible] = useState(
    () => window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  )

  useEffect(() => {
    const element = ref.current
    if (!element || visible) return

    const observateur = new IntersectionObserver(
      ([entree]) => {
        if (entree.isIntersecting) {
          setVisible(true)
          observateur.disconnect()
        }
      },
      { threshold: 0.15 },
    )

    observateur.observe(element)

    // Nettoyage : sans ça, l'observateur survivrait au démontage du composant.
    return () => observateur.disconnect()
  }, [visible])

  return [ref, visible]
}
