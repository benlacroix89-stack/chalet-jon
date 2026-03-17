import { useState, useEffect } from 'react'
import { getFirestore, collection, addDoc, deleteDoc, doc, onSnapshot, query, orderBy, serverTimestamp } from 'firebase/firestore'
import app from '../firebase'
import './Depenses.css'

const db = getFirestore(app)
const depensesRef = collection(db, 'depenses')

const CATEGORIES = ['Entretien', 'Nourriture', 'Equipement', 'Autre']

function Depenses() {
  const [depenses, setDepenses] = useState([])
  const [description, setDescription] = useState('')
  const [montant, setMontant] = useState('')
  const [categorie, setCategorie] = useState(CATEGORIES[0])

  useEffect(() => {
    const q = query(depensesRef, orderBy('creeLe', 'desc'))
    const unsub = onSnapshot(q, (snapshot) => {
      setDepenses(snapshot.docs.map((d) => ({ id: d.id, ...d.data() })))
    })
    return unsub
  }, [])

  const ajouterDepense = async (e) => {
    e.preventDefault()
    if (!description.trim() || !montant) return
    await addDoc(depensesRef, {
      description: description.trim(),
      montant: parseFloat(montant),
      categorie,
      creeLe: serverTimestamp(),
    })
    setDescription('')
    setMontant('')
    setCategorie(CATEGORIES[0])
  }

  const supprimerDepense = async (id) => {
    await deleteDoc(doc(db, 'depenses', id))
  }

  const total = depenses.reduce((sum, d) => sum + (d.montant || 0), 0)

  return (
    <div className="card">
      <div className="card-header">
        <h2>Depenses</h2>
      </div>

      <form className="form-stack dep-form" onSubmit={ajouterDepense}>
        <input
          className="input"
          type="text"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
        <div className="form-row">
          <input
            className="input"
            type="number"
            placeholder="Montant ($)"
            min="0"
            step="0.01"
            value={montant}
            onChange={(e) => setMontant(e.target.value)}
            required
          />
          <select className="select" value={categorie} onChange={(e) => setCategorie(e.target.value)}>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
        <button className="btn btn-primary" type="submit">Ajouter</button>
      </form>

      {depenses.length === 0 ? (
        <p className="empty">Aucune depense pour le moment.</p>
      ) : (
        <>
          <ul className="list">
            {depenses.map((d) => (
              <li key={d.id} className="list-item">
                <div className="dep-info">
                  <div className="dep-top">
                    <strong className="dep-desc">{d.description}</strong>
                    <span className="dep-montant">{d.montant?.toFixed(2)} $</span>
                  </div>
                  <span className="dep-cat">{d.categorie}</span>
                </div>
                <button className="btn btn-ghost" onClick={() => supprimerDepense(d.id)}>
                  Supprimer
                </button>
              </li>
            ))}
          </ul>
          <div className="dep-total">
            <span>Total</span>
            <strong>{total.toFixed(2)} $</strong>
          </div>
        </>
      )}
    </div>
  )
}

export default Depenses
