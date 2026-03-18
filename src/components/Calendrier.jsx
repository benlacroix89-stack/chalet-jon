import { useState, useEffect } from 'react'
import Calendar from 'react-calendar'
import { getFirestore, collection, onSnapshot, query, orderBy } from 'firebase/firestore'
import app from '../firebase'
import 'react-calendar/dist/Calendar.css'
import './Calendrier.css'

const db = getFirestore(app)
const reservationsRef = collection(db, 'reservations')

function Calendrier() {
  const [reservations, setReservations] = useState([])
  const [dateSelectionnee, setDateSelectionnee] = useState(null)
  const [resaSelectionnee, setResaSelectionnee] = useState(null)

  useEffect(() => {
    const q = query(reservationsRef, orderBy('arrivee', 'asc'))
    const unsub = onSnapshot(q, (snapshot) => {
      setReservations(snapshot.docs.map((d) => ({ id: d.id, ...d.data() })))
    })
    return unsub
  }, [])

  const trouverResa = (date) => {
    const str = date.toLocaleDateString('en-CA')
    return reservations.find((r) => str >= r.arrivee && str <= r.depart)
  }

  const tileClassName = ({ date, view }) => {
    if (view !== 'month') return null
    const resa = trouverResa(date)
    if (!resa) return null
    const str = date.toLocaleDateString('en-CA')
    const classes = ['cal-reserve']
    if (str === resa.arrivee) classes.push('cal-debut')
    if (str === resa.depart) classes.push('cal-fin')
    return classes.join(' ')
  }

  const handleClick = (date) => {
    const resa = trouverResa(date)
    setDateSelectionnee(date)
    setResaSelectionnee(resa || null)
  }

  const formaterDate = (d) => {
    if (!d) return ''
    const [annee, mois, jour] = d.split('-')
    return `${jour}/${mois}/${annee}`
  }

  const fermer = () => {
    setDateSelectionnee(null)
    setResaSelectionnee(null)
  }

  return (
    <div className="card">
      <div className="card-header">
        <h2>Calendrier</h2>
      </div>

      <div className="cal-wrapper">
        <Calendar
          onClickDay={handleClick}
          tileClassName={tileClassName}
          locale="fr-CA"
          minDetail="month"
          prev2Label={null}
          next2Label={null}
        />
      </div>

      {dateSelectionnee && (
        <div className="cal-detail">
          {resaSelectionnee ? (
            <>
              <div className="cal-detail-header">
                <strong className="cal-detail-nom">{resaSelectionnee.nom}</strong>
                <button className="btn btn-ghost" onClick={fermer}>Fermer</button>
              </div>
              <div className="cal-detail-dates">
                {formaterDate(resaSelectionnee.arrivee)} &rarr; {formaterDate(resaSelectionnee.depart)}
              </div>
              {resaSelectionnee.note && (
                <div className="cal-detail-note">{resaSelectionnee.note}</div>
              )}
            </>
          ) : (
            <div className="cal-detail-header">
              <span className="cal-detail-libre">Aucune reservation pour le {dateSelectionnee.toLocaleDateString('fr-CA')}</span>
              <button className="btn btn-ghost" onClick={fermer}>Fermer</button>
            </div>
          )}
        </div>
      )}

      <div className="cal-legende">
        <span className="cal-legende-item">
          <span className="cal-legende-dot cal-legende-reserve" />
          Reserve
        </span>
        <span className="cal-legende-item">
          <span className="cal-legende-dot cal-legende-libre" />
          Disponible
        </span>
      </div>
    </div>
  )
}

export default Calendrier
