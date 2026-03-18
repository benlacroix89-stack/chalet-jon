import { useState, useEffect, useRef } from 'react'
import { getFirestore, collection, addDoc, serverTimestamp } from 'firebase/firestore'
import { Sailboat, Waves, Fish, Mountain, Truck, Snowflake, Anchor, Footprints, Wind } from 'lucide-react'
import app from '../firebase'
import './PagePublique.css'

const db = getFirestore(app)
const demandesRef = collection(db, 'demandes')

const svg = { width: 22, height: 22, viewBox: '0 0 24 24', fill: 'none', stroke: '#3d3530', strokeWidth: 1.6, strokeLinecap: 'round', strokeLinejoin: 'round' }

const EQUIPEMENTS = [
  { icon: <svg {...svg}><path d="M12 20h.01" /><path d="M2 8.82a15 15 0 0 1 20 0" /><path d="M5 12.86a10 10 0 0 1 14 0" /><path d="M8.5 16.9a5 5 0 0 1 7 0" /></svg>, label: 'Internet' },
  { icon: <svg {...svg}><path d="M12 2c1 3-2 6-2 9a4 4 0 0 0 8 0c0-3-2-5-3-7" /><path d="M12 15a2 2 0 0 0 2-2c0-1.5-2-3-2-3s-2 1.5-2 3a2 2 0 0 0 2 2z" /></svg>, label: 'Poele a bois' },
  { icon: <svg {...svg}><path d="M4 10h16" /><path d="M4 10c0 3 2 5 4 6l-1 6" /><path d="M20 10c0 3-2 5-4 6l1 6" /><path d="M8 6V4" /><path d="M12 6V2" /><path d="M16 6V4" /></svg>, label: 'BBQ' },
  { icon: <svg {...svg}><path d="M2 21c.6-.5 1.2-1 2.5-1 2.5 0 2.5 1 5 1s2.5-1 5-1 2.5 1 5 1c1.3 0 1.9-.5 2.5-1" /><path d="M4 16l6-10 6 10" /><line x1="12" y1="6" x2="12" y2="16" /></svg>, label: 'Canot' },
  { icon: <svg {...svg}><circle cx="8" cy="14" r="3" /><circle cx="16" cy="14" r="3" /><path d="M8 11V6l4 3 4-3v5" /><path d="M2 21c.6-.5 1.2-1 2.5-1 2.5 0 2.5 1 5 1s2.5-1 5-1 2.5 1 5 1c1.3 0 1.9-.5 2.5-1" /></svg>, label: 'Pedalo' },
  { icon: <svg {...svg}><rect x="3" y="6" width="18" height="4" rx="1" /><path d="M5 10v8" /><path d="M19 10v8" /><path d="M2 21c.6-.5 1.2-1 2.5-1 2.5 0 2.5 1 5 1s2.5-1 5-1 2.5 1 5 1c1.3 0 1.9-.5 2.5-1" /></svg>, label: 'Quai 45 pieds' },
  { icon: <svg {...svg}><path d="M3 21h18" /><path d="M5 21V10" /><path d="M19 21V10" /><path d="M12 3l9 7H3l9-7z" /><path d="M9 21v-5h6v5" /></svg>, label: 'Gazebo' },
  { icon: <svg {...svg}><path d="M12 2c1 3-2 6-2 9a4 4 0 0 0 8 0c0-3-2-5-3-7" /><path d="M2 21h20" /><path d="M5 21l2-6h10l2 6" /></svg>, label: 'Foyer exterieur' },
  { icon: <svg {...svg}><rect x="2" y="4" width="20" height="16" rx="2" /><path d="M2 10h20" /><path d="M8 10v10" /><path d="M16 10v10" /></svg>, label: 'Veranda' },
  { icon: <svg {...svg}><rect x="2" y="4" width="20" height="13" rx="2" /><path d="M8 21h8" /><path d="M12 17v4" /></svg>, label: 'Television / Satellite' },
]

const lucideProps = { size: 20, color: '#1a1613', strokeWidth: 1.6 }

const ACTIVITES_ETE = [
  { icon: <Sailboat {...lucideProps} />, label: 'Canot' },
  { icon: <Waves {...lucideProps} />, label: 'Kayak' },
  { icon: <Fish {...lucideProps} />, label: 'Peche' },
  { icon: <Mountain {...lucideProps} />, label: 'Randonnee' },
  { icon: <Truck {...lucideProps} />, label: 'Quad' },
]

const ACTIVITES_HIVER = [
  { icon: <Snowflake {...lucideProps} />, label: 'Motoneige' },
  { icon: <Anchor {...lucideProps} />, label: 'Peche glace' },
  { icon: <Footprints {...lucideProps} />, label: 'Raquette' },
  { icon: <Wind {...lucideProps} />, label: 'Ski fond' },
]

const TARIFS = [
  { label: 'Fin de semaine', prix: '450', unite: '/ 2 nuits', desc: 'Vendredi au dimanche', vedette: true },
  { label: 'Semaine', prix: '850', unite: '/ 7 nuits', desc: 'Meilleure valeur' },
  { label: 'Mois', prix: '2 500', unite: '/ mois', desc: 'Sejour prolonge' },
]

const DETAILS = [
  { valeur: '7', label: 'Personnes' },
  { valeur: '3', label: 'Chambres' },
  { valeur: '4', label: 'Saisons' },
  { valeur: '3', label: 'Etoiles CITQ' },
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
          <p className="pub-hero-tag">Notre-Dame-de-Pontmain, Laurentides</p>
          <h1 className="pub-hero-title">Le Camp du Lac</h1>
          <p className="pub-hero-sub">Chalet 4 saisons sur le lac du Camp — tranquillite, nature et toutes commodites au coeur des Laurentides.</p>
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
              Chalet 4 saisons sur le lac du Camp a Notre-Dame-de-Pontmain dans les Laurentides. Profitez de la tranquillite et de toutes les commodites avec acces a plus de 100 km de voie navigable. Sentiers de VTT et de motoneige a proximite. Accredite 3 etoiles CITQ. Capacite de 7 personnes dans 3 chambres confortables.
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

      {/* ── Activites ── */}
      <Reveal>
        <section className="pub-section pub-equip">
          <div className="pub-container">
            <h2 className="pub-heading">Activites</h2>
            <h3 className="pub-saison pub-saison--ete">Ete</h3>
            <div className="pub-equip-grid">
              {ACTIVITES_ETE.map((a) => (
                <div key={a.label} className="pub-equip-item">
                  <span className="pub-equip-icon">{a.icon}</span>
                  <span className="pub-equip-label">{a.label}</span>
                </div>
              ))}
            </div>
            <h3 className="pub-saison pub-saison--hiver">Hiver</h3>
            <div className="pub-equip-grid">
              {ACTIVITES_HIVER.map((a) => (
                <div key={a.label} className="pub-equip-item">
                  <span className="pub-equip-icon">{a.icon}</span>
                  <span className="pub-equip-label">{a.label}</span>
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
            <p className="pub-text" style={{ marginBottom: 32 }}>Duree minimum de 2 nuits</p>
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

      {/* ── Infos pratiques ── */}
      <Reveal>
        <section className="pub-section pub-infos">
          <div className="pub-container">
            <h2 className="pub-heading">Infos pratiques</h2>
            <div className="pub-infos-grid">
              <div className="pub-info-item">
                <span className="pub-info-icon">🕓</span>
                <div>
                  <strong>Arrivee</strong>
                  <p>Apres 16h</p>
                </div>
              </div>
              <div className="pub-info-item">
                <span className="pub-info-icon">🕛</span>
                <div>
                  <strong>Depart</strong>
                  <p>Avant 12h</p>
                </div>
              </div>
              <div className="pub-info-item">
                <span className="pub-info-icon">💰</span>
                <div>
                  <strong>Depot</strong>
                  <p>300 $ requis</p>
                </div>
              </div>
              <div className="pub-info-item">
                <span className="pub-info-icon">🐾</span>
                <div>
                  <strong>Animaux</strong>
                  <p>Permis avec restrictions</p>
                </div>
              </div>
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
                    <input className="pub-input" type="number" min="1" max="7" value={form.personnes} onChange={update('personnes')} required />
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
            <p className="pub-text">Notre-Dame-de-Pontmain, Laurentides, Quebec<br />GPS : 46.318, -75.623</p>
            <div className="pub-map">
              <iframe
                title="Localisation du Camp du Lac"
                src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d20000!2d-75.623!3d46.318!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sfr!2sca"
                width="100%"
                height="350"
                style={{ border: 0, borderRadius: 12 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </section>
      </Reveal>

      {/* ── Footer ── */}
      <footer className="pub-footer">
        <p>Le Camp du Lac — Notre-Dame-de-Pontmain, Laurentides — Tous droits reserves</p>
      </footer>
    </div>
  )
}

export default PagePublique
