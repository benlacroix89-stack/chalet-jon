import { useState, useEffect, useRef } from 'react'
import { getFirestore, collection, addDoc, serverTimestamp } from 'firebase/firestore'
import app from '../firebase'
import './PagePublique.css'

const db = getFirestore(app)
const demandesRef = collection(db, 'demandes')

const EQUIPEMENTS = [
  { icon: '📶', label: 'Wifi haute vitesse' },
  { icon: '🛁', label: 'Spa / Bain tourbillon' },
  { icon: '🔥', label: 'Foyer interieur' },
  { icon: '🛶', label: 'Kayaks inclus' },
  { icon: '🍖', label: 'BBQ exterieur' },
  { icon: '🅿️', label: 'Stationnement gratuit' },
]

const TARIFS = [
  { label: 'Semaine', prix: '250', unite: '/ nuit', desc: 'Dimanche au jeudi' },
  { label: 'Weekend', prix: '350', unite: '/ nuit', desc: 'Vendredi et samedi', vedette: true },
  { label: 'Semaine complete', prix: '2 000', unite: '/ 7 nuits', desc: 'Meilleure valeur' },
]

const DETAILS = [
  { valeur: '4', label: 'Chambres' },
  { valeur: '10', label: 'Personnes' },
  { valeur: '4', label: 'Saisons' },
  { valeur: '1', label: 'Lac prive' },
]

function useReveal() {
  const ref = useRef(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('visible')
          observer.unobserve(el)
        }
      },
      { threshold: 0.15 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])
  return ref
}

function Reveal({ children, className = '' }) {
  const ref = useReveal()
  return (
    <div ref={ref} className={`reveal ${className}`}>
      {children}
    </div>
  )
}

function PagePublique({ onAdmin }) {
  const [form, setForm] = useState({
    nom: '', email: '', telephone: '', arrivee: '', depart: '', personnes: '', message: '',
  })
  const [envoye, setEnvoye] = useState(false)
  const [chargement, setChargement] = useState(false)
  const formRef = useRef(null)

  const update = (champ) => (e) => setForm({ ...form, [champ]: e.target.value })

  const envoyer = async (e) => {
    e.preventDefault()
    setChargement(true)
    await addDoc(demandesRef, { ...form, creeLe: serverTimestamp() })
    setEnvoye(true)
    setChargement(false)
  }

  const scrollToForm = () => {
    formRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div className="pub">
      {/* ── Hero ── */}
      <section className="pub-hero">
        <div className="pub-hero-overlay" />
        <div className="pub-hero-content">
          <p className="pub-hero-tag">Laurentides, Quebec</p>
          <h1 className="pub-hero-title">Chalet des Laurentides</h1>
          <p className="pub-hero-sub">Un refuge d'exception au bord du lac, pour des moments inoubliables en famille ou entre amis.</p>
          <div className="pub-hero-actions">
            <button className="pub-btn pub-btn-hero" onClick={scrollToForm}>Reserver maintenant</button>
            <button className="pub-btn pub-btn-outline" onClick={onAdmin}>Espace admin</button>
          </div>
        </div>
      </section>

      {/* ── Details ── */}
      <Reveal>
        <section className="pub-section pub-details">
          <div className="pub-details-grid">
            {DETAILS.map((d) => (
              <div key={d.label} className="pub-detail">
                <span className="pub-detail-val">{d.valeur}</span>
                <span className="pub-detail-label">{d.label}</span>
              </div>
            ))}
          </div>
        </section>
      </Reveal>

      {/* ── Description ── */}
      <Reveal>
        <section className="pub-section pub-desc">
          <div className="pub-container">
            <h2 className="pub-heading">Votre escapade nature</h2>
            <p className="pub-text">
              Niché au coeur des Laurentides, notre chalet de 4 chambres vous accueille toute l'année au bord d'un lac privé. Profitez d'un espace chaleureux pouvant accueillir jusqu'à 10 personnes, idéal pour les vacances en famille, les retraites entre amis ou les séjours romantiques. En été, le lac et les kayaks vous attendent. En hiver, le spa et le foyer créent l'ambiance parfaite.
            </p>
          </div>
        </section>
      </Reveal>

      {/* ── Equipements ── */}
      <Reveal>
        <section className="pub-section pub-equip">
          <div className="pub-container">
            <h2 className="pub-heading">Equipements</h2>
            <div className="pub-equip-grid">
              {EQUIPEMENTS.map((eq) => (
                <div key={eq.label} className="pub-equip-item">
                  <span className="pub-equip-icon">{eq.icon}</span>
                  <span className="pub-equip-label">{eq.label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      </Reveal>

      {/* ── Tarifs ── */}
      <Reveal>
        <section className="pub-section pub-tarifs">
          <div className="pub-container">
            <h2 className="pub-heading">Tarifs</h2>
            <div className="pub-tarifs-grid">
              {TARIFS.map((t) => (
                <div key={t.label} className={`pub-tarif${t.vedette ? ' vedette' : ''}`}>
                  {t.vedette && <span className="pub-tarif-badge">Populaire</span>}
                  <span className="pub-tarif-label">{t.label}</span>
                  <div className="pub-tarif-prix">
                    <span className="pub-tarif-dollar">$</span>
                    <span className="pub-tarif-montant">{t.prix}</span>
                    <span className="pub-tarif-unite">{t.unite}</span>
                  </div>
                  <span className="pub-tarif-desc">{t.desc}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      </Reveal>

      {/* ── Formulaire ── */}
      <Reveal>
        <section className="pub-section pub-form-section" ref={formRef}>
          <div className="pub-container">
            <h2 className="pub-heading">Demande de reservation</h2>
            <p className="pub-text" style={{ marginBottom: 28 }}>
              Remplissez le formulaire et nous vous contacterons dans les 24 heures.
            </p>

            {envoye ? (
              <div className="pub-success">
                <span className="pub-success-icon">✓</span>
                <h3>Demande envoyee !</h3>
                <p>Merci pour votre interet. Nous vous recontacterons tres bientot.</p>
              </div>
            ) : (
              <form className="pub-form" onSubmit={envoyer}>
                <div className="pub-form-row">
                  <label className="pub-label">
                    Nom complet
                    <input className="pub-input" type="text" value={form.nom} onChange={update('nom')} required />
                  </label>
                  <label className="pub-label">
                    Email
                    <input className="pub-input" type="email" value={form.email} onChange={update('email')} required />
                  </label>
                </div>
                <div className="pub-form-row">
                  <label className="pub-label">
                    Telephone
                    <input className="pub-input" type="tel" value={form.telephone} onChange={update('telephone')} />
                  </label>
                  <label className="pub-label">
                    Nombre de personnes
                    <input className="pub-input" type="number" min="1" max="10" value={form.personnes} onChange={update('personnes')} required />
                  </label>
                </div>
                <div className="pub-form-row">
                  <label className="pub-label">
                    Date d'arrivee
                    <input className="pub-input" type="date" value={form.arrivee} onChange={update('arrivee')} required />
                  </label>
                  <label className="pub-label">
                    Date de depart
                    <input className="pub-input" type="date" value={form.depart} onChange={update('depart')} required />
                  </label>
                </div>
                <label className="pub-label">
                  Message (optionnel)
                  <textarea className="pub-input pub-textarea" rows="4" value={form.message} onChange={update('message')} />
                </label>
                <button className="pub-btn pub-btn-hero pub-btn-submit" type="submit" disabled={chargement}>
                  {chargement ? 'Envoi en cours...' : 'Envoyer la demande'}
                </button>
              </form>
            )}
          </div>
        </section>
      </Reveal>

      {/* ── Localisation ── */}
      <Reveal>
        <section className="pub-section pub-loc">
          <div className="pub-container">
            <h2 className="pub-heading">Localisation</h2>
            <p className="pub-text">Region des Laurentides, Quebec — a seulement 1h30 de Montreal. Acces facile par l'autoroute 15 Nord.</p>
          </div>
        </section>
      </Reveal>

      {/* ── Footer ── */}
      <footer className="pub-footer">
        <p>Chalet des Laurentides — Tous droits reserves</p>
      </footer>
    </div>
  )
}

export default PagePublique
