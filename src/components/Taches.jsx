import { useState, useEffect } from 'react'
import { getFirestore, collection, addDoc, updateDoc, deleteDoc, doc, onSnapshot, serverTimestamp, query, orderBy } from 'firebase/firestore'
import app from '../firebase'
import './Taches.css'

const db = getFirestore(app)
const tachesRef = collection(db, 'taches')

function Taches() {
  const [taches, setTaches] = useState([])
  const [titre, setTitre] = useState('')

  useEffect(() => {
    const q = query(tachesRef, orderBy('creeLe', 'desc'))
    const unsub = onSnapshot(q, (snapshot) => {
      setTaches(snapshot.docs.map((d) => ({ id: d.id, ...d.data() })))
    })
    return unsub
  }, [])

  const ajouterTache = async (e) => {
    e.preventDefault()
    const texte = titre.trim()
    if (!texte) return
    await addDoc(tachesRef, { titre: texte, fait: false, creeLe: serverTimestamp() })
    setTitre('')
  }

  const basculerStatut = async (tache) => {
    await updateDoc(doc(db, 'taches', tache.id), { fait: !tache.fait })
  }

  const supprimerTache = async (id) => {
    await deleteDoc(doc(db, 'taches', id))
  }

  const faites = taches.filter((t) => t.fait).length

  return (
    <div className="card">
      <div className="card-header">
        <h2>Taches</h2>
        {taches.length > 0 && (
          <span className="tache-compteur">{faites}/{taches.length} completees</span>
        )}
      </div>

      <form className="form-row tache-form" onSubmit={ajouterTache}>
        <input
          className="input"
          type="text"
          placeholder="Nouvelle tache..."
          value={titre}
          onChange={(e) => setTitre(e.target.value)}
        />
        <button className="btn btn-primary" type="submit">Ajouter</button>
      </form>

      {taches.length === 0 ? (
        <p className="empty">Aucune tache pour le moment.</p>
      ) : (
        <ul className="list">
          {taches.map((tache) => (
            <li key={tache.id} className={`list-item tache-item${tache.fait ? ' fait' : ''}`}>
              <label className="tache-label">
                <input
                  type="checkbox"
                  className="tache-check"
                  checked={tache.fait}
                  onChange={() => basculerStatut(tache)}
                />
                <span className="tache-titre">{tache.titre}</span>
              </label>
              <button className="btn btn-ghost" onClick={() => supprimerTache(tache.id)}>
                Supprimer
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default Taches
