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
  const pourcent = taches.length > 0 ? Math.round((faites / taches.length) * 100) : 0

  return (
    <div className="card">
      <div className="card-header">
        <h2>Taches</h2>
        {taches.length > 0 && (
          <span className="tache-compteur">{faites}/{taches.length}</span>
        )}
      </div>

      {taches.length > 0 && (
        <div className="tache-progress-wrap">
          <div className="tache-progress-bar">
            <div className="tache-progress-fill" style={{ width: `${pourcent}%` }} />
          </div>
          <span className="tache-progress-pct">{pourcent}%</span>
        </div>
      )}

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
                <span className={`tache-checkbox${tache.fait ? ' checked' : ''}`} onClick={() => basculerStatut(tache)}>
                  {tache.fait && (
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                      <path d="M2 6l3 3 5-5" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </span>
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
