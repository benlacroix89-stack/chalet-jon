import { useState, useEffect } from 'react'
import { getFirestore, collection, addDoc, deleteDoc, doc, onSnapshot, query, orderBy } from 'firebase/firestore'
import app from '../firebase'
import './Reservations.css'

const db = getFirestore(app)
const reservationsRef = collection(db, 'reservations')

function Reservations() {
  const [reservations, setReservations] = useState([])
  const [nom, setNom] = useState('')
  const [arrivee, setArrivee] = useState('')
  const [depart, setDepart] = useState('')
  const [note, setNote] = useState('')

  useEffect(() => {
    const q = query(reservationsRef, orderBy('arrivee', 'asc'))
    const unsub = onSnapshot(q, (snapshot) => {
      setReservations(snapshot.docs.map((d) => ({ id: d.id, ...d.data() })))
    })
    return unsub
  }, [])

  const ajouterReservation = async (e) => {
    e.preventDefault()
    if (!nom.trim() || !arrivee || !depart) return
    await addDoc(reservationsRef, {
      nom: nom.trim(),
      arrivee,
      depart,
      note: note.trim(),
    })
    setNom('')
    setArrivee('')
    setDepart('')
    setNote('')
  }

  const supprimerReservation = async (id) => {
    await deleteDoc(doc(db, 'reservations', id))
  }

  const formaterDate = (d) => {
    if (!d) return ''
    const [annee, mois, jour] = d.split('-')
    return `${jour}/${mois}/${annee}`
  }

  return (
    <div className="card">
      <div className="card-header">
        <h2>Reservations</h2>
        {reservations.length > 0 && (
          <span className="resa-badge">{reservations.length}</span>
        )}
      </div>

      <form className="form-stack resa-form" onSubmit={ajouterReservation}>
        <input
          className="input"
          type="text"
          placeholder="Nom de la personne"
          value={nom}
          onChange={(e) => setNom(e.target.value)}
          required
        />
        <div className="form-row">
          <label className="form-label">
            Arrivee
            <input className="input" type="date" value={arrivee} onChange={(e) => setArrivee(e.target.value)} required />
          </label>
          <label className="form-label">
            Depart
            <input className="input" type="date" value={depart} onChange={(e) => setDepart(e.target.value)} required />
          </label>
        </div>
        <input
          className="input"
          type="text"
          placeholder="Note (optionnel)"
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />
        <button className="btn btn-primary" type="submit">Ajouter</button>
      </form>

      {reservations.length === 0 ? (
        <p className="empty">Aucune reservation pour le moment.</p>
      ) : (
        <ul className="list">
          {reservations.map((r) => (
            <li key={r.id} className="list-item">
              <div className="resa-info">
                <strong className="resa-nom">{r.nom}</strong>
                <span className="resa-dates">
                  {formaterDate(r.arrivee)} &rarr; {formaterDate(r.depart)}
                </span>
                {r.note && <span className="resa-note">{r.note}</span>}
              </div>
              <button className="btn btn-ghost" onClick={() => supprimerReservation(r.id)}>
                Supprimer
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default Reservations
