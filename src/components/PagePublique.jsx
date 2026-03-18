import { useState, useEffect, useRef } from 'react'
import { getFirestore, collection, addDoc, serverTimestamp } from 'firebase/firestore'
import { Sailboat, Waves, Fish, Mountain, Truck, Snowflake, Anchor, Footprints, Wind, Wifi, Flame, UtensilsCrossed, Ship, Bike, Anchor as AnchorIcon, TreePine, Tv, Home, Clock, DollarSign, PawPrint } from 'lucide-react'
import app from '../firebase'
import './PagePublique.css'

const db = getFirestore(app)
const demandesRef = collection(db, 'demandes')

const iconDark = { size: 24, color: '#c9a96e', strokeWidth: 1.5 }
const iconLight = { size: 22, color: '#fdf6ec', strokeWidth: 1.5 }

const EQUIPEMENTS = [
  { icon: <Wifi {...iconDark} />, label: 'Internet' },
  { icon: <Flame {...iconDark} />, label: 'Poele a bois' },
  { icon: <UtensilsCrossed {...iconDark} />, label: 'BBQ' },
  { icon: <Sailboat {...iconDark} />, label: 'Canot' },
  { icon: <Waves {...iconDark} />, label: 'Pedalo' },
  { icon: <AnchorIcon {...iconDark} />, label: 'Quai 45 pieds' },
  { icon: <TreePine {...iconDark} />, label: 'Gazebo' },
  { icon: <Flame {...iconDark} />, label: 'Foyer exterieur' },
  { icon: <Home {...iconDark} />, label: 'Veranda' },
  { icon: <Tv {...iconDark} />, label: 'TV / Satellite' },
]

const ACTIVITES_ETE = [
  { icon: <Sailboat {...iconDark} />, label: 'Canot' },
  { icon: <Waves {...iconDark} />, label: 'Kayak' },
  { icon: <Fish {...iconDark} />, label: 'Peche' },
  { icon: <Mountain {...iconDark} />, label: 'Randonnee' },
  { icon: <Truck {...iconDark} />, label: 'Quad' },
]

const ACTIVITES_HIVER = [
  { icon: <Snowflake {...iconDark} />, label: 'Motoneige' },
  { icon: <Anchor {...iconDark} />, label: 'Peche glace' },
  { icon: <Footprints {...iconDark} />, label: 'Raquette' },
  { icon: <Wind {...iconDark} />, label: 'Ski fond' },
]

const TARIFS = [
  { label: 'Fin de semaine', prix: '450', unite: '/ 2 nuits', desc: 'Vendredi au dimanche' },
  { label: 'Semaine', prix: '850', unite: '/ 7 nuits', desc: 'Meilleure valeur', vedette: true },
  { label: 'Mois', prix: '2 500', unite: '/ mois', desc: 'Sejour prolonge' },
]

const DETAILS = [
  { valeur: '7', label: 'Personnes' },
  { valeur: '3', label: 'Chambres' },
  { valeur: '4', label: 'Saisons' },
  { valeur: '3', label: 'Etoiles CITQ' },
]

const GALLERY = [
  { src: '/images/chalet jhl1.jpg', alt: 'Vue du chalet' },
  { src: '/images/chaletjhl2.jpg', alt: 'Interieur du chalet' },
  { src: '/images/chalet jhl3.jpg', alt: 'Le lac' },
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
      { threshold: 0.12 }
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
  const [adminEmail, setAdminEmail] = useState('')
  const [adminMsg, setAdminMsg] = useState('')
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

  const verifierAdmin = (e) => {
    e.preventDefault()
    setAdminMsg('')
    const admins = ['latreille-jonathan@hotmail.com', 'ben.lacroix89@gmail.com']
    if (admins.includes(adminEmail.trim().toLowerCase())) {
      onAdmin()
    } else {
      setAdminMsg('Merci pour votre inscription !')
    }
  }

  return (
    <div className="pub">
      {/* ── Hero ── */}
      <section className="pub-hero">
        <div className="pub-hero-overlay" />
        <div className="pub-hero-content">
          <span className="pub-hero-badge">Accredite 3 etoiles CITQ</span>
          <h1 className="pub-hero-title">Le Camp du Lac</h1>
          <p className="pub-hero-loc">Notre-Dame-de-Pontmain, Laurentides</p>
          <p className="pub-hero-sub">Chalet 4 saisons sur le lac du Camp — tranquillite, nature et toutes commodites.</p>
          <div className="pub-hero-actions">
            <button className="pub-btn-primary" onClick={scrollToForm}>Reserver votre sejour</button>
          </div>
        </div>
        <div className="pub-hero-scroll">&#8595;</div>
      </section>

      {/* ── Details ── */}
      <Reveal>
        <section className="pub-stats">
          <div className="pub-stats-grid">
            {DETAILS.map((d) => (
              <div key={d.label} className="pub-stat">
                <span className="pub-stat-val">{d.valeur}</span>
                <span className="pub-stat-label">{d.label}</span>
              </div>
            ))}
          </div>
        </section>
      </Reveal>

      {/* ── Description ── */}
      <Reveal>
        <section className="pub-section pub-about">
          <div className="pub-container">
            <span className="pub-eyebrow">Bienvenue</span>
            <h2 className="pub-heading">Votre escapade nature</h2>
            <div className="pub-about-content">
              <p className="pub-text">
                Niché au bord du lac du Camp, notre chalet vous accueille toute l'année dans un cadre exceptionnel. Profitez de plus de 100 km de voie navigable, de sentiers de VTT et de motoneige à proximite. Un refuge chaleureux pour 7 personnes dans 3 chambres confortables.
              </p>
              <p className="pub-text">
                Que ce soit pour une escapade romantique, des vacances en famille ou une retraite entre amis, Le Camp du Lac offre le cadre parfait pour deconnecter et profiter de la nature des Laurentides.
              </p>
            </div>
          </div>
        </section>
      </Reveal>

      {/* ── Galerie ── */}
      <Reveal>
        <section className="pub-section pub-gallery">
          <div className="pub-container">
            <span className="pub-eyebrow">Decouvrez</span>
            <h2 className="pub-heading">Notre chalet</h2>
            <div className="pub-gallery-grid">
              {GALLERY.map((img) => (
                <div key={img.src} className="pub-gallery-item">
                  <img src={img.src} alt={img.alt} loading="lazy" />
                </div>
              ))}
            </div>
          </div>
        </section>
      </Reveal>

      {/* ── Equipements ── */}
      <Reveal>
        <section className="pub-section pub-equip">
          <div className="pub-container">
            <span className="pub-eyebrow">Commodites</span>
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
        <section className="pub-section pub-activites">
          <div className="pub-container">
            <span className="pub-eyebrow">Experiences</span>
            <h2 className="pub-heading">Activites</h2>
            <div className="pub-act-row">
              <div className="pub-act-col">
                <h3 className="pub-act-title pub-act-title--ete">Ete</h3>
                <div className="pub-act-list">
                  {ACTIVITES_ETE.map((a) => (
                    <div key={a.label} className="pub-equip-item">
                      <span className="pub-equip-icon">{a.icon}</span>
                      <span className="pub-equip-label">{a.label}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="pub-act-col">
                <h3 className="pub-act-title pub-act-title--hiver">Hiver</h3>
                <div className="pub-act-list">
                  {ACTIVITES_HIVER.map((a) => (
                    <div key={a.label} className="pub-equip-item">
                      <span className="pub-equip-icon">{a.icon}</span>
                      <span className="pub-equip-label">{a.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      </Reveal>

      {/* ── Tarifs ── */}
      <Reveal>
        <section className="pub-section pub-tarifs">
          <div className="pub-container">
            <span className="pub-eyebrow">Planifiez</span>
            <h2 className="pub-heading">Tarifs</h2>
            <p className="pub-text-sm">Duree minimum de 2 nuits</p>
            <div className="pub-tarifs-grid">
              {TARIFS.map((t) => (
                <div key={t.label} className={`pub-tarif${t.vedette ? ' vedette' : ''}`}>
                  {t.vedette && <span className="pub-tarif-badge">Meilleure valeur</span>}
                  <span className="pub-tarif-label">{t.label}</span>
                  <div className="pub-tarif-prix">
                    <span className="pub-tarif-dollar">$</span>
                    <span className="pub-tarif-montant">{t.prix}</span>
                  </div>
                  <span className="pub-tarif-unite">{t.unite}</span>
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
            <span className="pub-eyebrow">A savoir</span>
            <h2 className="pub-heading">Infos pratiques</h2>
            <div className="pub-infos-grid">
              <div className="pub-info-card">
                <Clock {...iconDark} />
                <strong>Arrivee</strong>
                <p>Apres 16h</p>
              </div>
              <div className="pub-info-card">
                <Clock {...iconDark} />
                <strong>Depart</strong>
                <p>Avant 12h</p>
              </div>
              <div className="pub-info-card">
                <DollarSign {...iconDark} />
                <strong>Depot</strong>
                <p>300 $ requis</p>
              </div>
              <div className="pub-info-card">
                <PawPrint {...iconDark} />
                <strong>Animaux</strong>
                <p>Permis avec restrictions</p>
              </div>
            </div>
          </div>
        </section>
      </Reveal>

      {/* ── Formulaire ── */}
      <Reveal>
        <section className="pub-section pub-form-section" ref={formRef}>
          <div className="pub-container">
            <span className="pub-eyebrow pub-eyebrow--light">Reservez</span>
            <h2 className="pub-heading pub-heading--light">Demande de reservation</h2>
            <p className="pub-text-light">Remplissez le formulaire et nous vous contacterons dans les 24 heures.</p>

            {envoye ? (
              <div className="pub-success">
                <span className="pub-success-icon">&#10003;</span>
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
                <button className="pub-btn-primary pub-btn-submit" type="submit" disabled={chargement}>
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
            <span className="pub-eyebrow">Trouvez-nous</span>
            <h2 className="pub-heading">Localisation</h2>
            <p className="pub-text">Notre-Dame-de-Pontmain, Laurentides, Quebec<br />GPS : 46.318, -75.623</p>
            <div className="pub-map">
              <iframe
                title="Localisation du Camp du Lac"
                src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d20000!2d-75.623!3d46.318!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sfr!2sca"
                width="100%"
                height="400"
                style={{ border: 0, borderRadius: 16 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </section>
      </Reveal>

      {/* ── Infolettre ── */}
      <Reveal>
        <section className="pub-section pub-newsletter">
          <div className="pub-container">
            <h2 className="pub-heading pub-heading--light">Restez informe</h2>
            <p className="pub-text-light" style={{ marginBottom: 28 }}>
              Inscrivez-vous pour recevoir les disponibilites et offres speciales.
            </p>
            <form className="pub-newsletter-form" onSubmit={verifierAdmin}>
              <input
                className="pub-input pub-input--dark"
                type="email"
                placeholder="Votre adresse email"
                value={adminEmail}
                onChange={(e) => setAdminEmail(e.target.value)}
                required
              />
              <button className="pub-btn-gold" type="submit">S'inscrire</button>
            </form>
            {adminMsg && <p className="pub-newsletter-msg">{adminMsg}</p>}
          </div>
        </section>
      </Reveal>

      {/* ── Footer ── */}
      <footer className="pub-footer">
        <div className="pub-footer-inner">
          <p className="pub-footer-name">Le Camp du Lac</p>
          <p className="pub-footer-loc">Notre-Dame-de-Pontmain, Laurentides, Quebec</p>
          <div className="pub-footer-divider" />
          <p className="pub-footer-copy">Tous droits reserves</p>
        </div>
      </footer>
    </div>
  )
}

export default PagePublique
