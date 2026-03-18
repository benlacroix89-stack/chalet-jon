import { useState, useEffect } from 'react'
import { getFirestore, collection, addDoc, deleteDoc, doc, onSnapshot, query, orderBy } from 'firebase/firestore'
import app from '../firebase'
import './Demandes.css'

const db = getFirestore(app)
const demandesRef = collection(db, 'demandes')
const reservationsRef = collection(db, 'reservations')

function calculerNuits(arrivee, depart) {
  if (!arrivee || !depart) return 0
  const a = new Date(arrivee)
  const d = new Date(depart)
  const diff = Math.round((d - a) / (1000 * 60 * 60 * 24))
  return diff > 0 ? diff : 0
}

function formaterDate(d) {
  if (!d) return ''
  const [annee, mois, jour] = d.split('-')
  return `${jour}/${mois}/${annee}`
}

function Demandes() {
  const [demandes, setDemandes] = useState([])

  useEffect(() => {
    const q = query(demandesRef, orderBy('creeLe', 'desc'))
    const unsub = onSnapshot(q, (snap) => {
      setDemandes(snap.docs.map((d) => ({ id: d.id, ...d.data() })))
    })
    return unsub
  }, [])

  const approuver = async (dem) => {
    await addDoc(reservationsRef, {
      nom: dem.nom,
      arrivee: dem.arrivee,
      depart: dem.depart,
      note: dem.email,
    })
    await deleteDoc(doc(db, 'demandes', dem.id))
  }

  const refuser = async (id) => {
    await deleteDoc(doc(db, 'demandes', id))
  }

  const supprimer = async (id) => {
    await deleteDoc(doc(db, 'demandes', id))
  }

  return (
    <div className="adm-card">
      <div className="adm-card-header">
        <h2 className="adm-card-title">Demandes</h2>
        {demandes.length > 0 && (
          <span className="dem-badge">{demandes.length}</span>
        )}
      </div>

      {demandes.length === 0 ? (
        <p className="empty">Aucune demande en attente.</p>
      ) : (
        <div className="dem-list">
          {demandes.map((dem) => {
            const nuits = calculerNuits(dem.arrivee, dem.depart)
            return (
              <div key={dem.id} className="dem-card">
                <div className="dem-top">
                  <span className="dem-nom">{dem.nom}</span>
                  {nuits > 0 && (
                    <span className="dem-nuits">{nuits} nuit{nuits > 1 ? 's' : ''}</span>
                  )}
                </div>
                <div className="dem-info-row">
                  <span className="dem-info"><strong>Email</strong> {dem.email}</span>
                  {dem.telephone && <span className="dem-info"><strong>Tel.</strong> {dem.telephone}</span>}
                  {dem.personnes && <span className="dem-info"><strong>Personnes</strong> {dem.personnes}</span>}
                </div>
                <div className="dem-info-row">
                  <span className="dem-info">
                    <strong>Arrivee</strong> {formaterDate(dem.arrivee)}
                  </span>
                  <span className="dem-info">
                    <strong>Depart</strong> {formaterDate(dem.depart)}
                  </span>
                </div>
                {dem.message && (
                  <div className="dem-message">{dem.message}</div>
                )}
                <div className="dem-actions">
                  <button className="dem-btn-approuver" onClick={() => approuver(dem)}>Approuver</button>
                  <button className="dem-btn-refuser" onClick={() => refuser(dem.id)}>Refuser</button>
                  <button className="btn btn-ghost" onClick={() => supprimer(dem.id)}>Supprimer</button>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default Demandes
