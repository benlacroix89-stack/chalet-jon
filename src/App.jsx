import { useState, useEffect } from 'react'
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth'
import { CalendarDays, ClipboardList, ListChecks, Receipt, LogOut, Inbox } from 'lucide-react'
import app from './firebase'
import PagePublique from './components/PagePublique'
import Login from './components/Login'
import Reservations from './components/Reservations'
import Taches from './components/Taches'
import Depenses from './components/Depenses'
import Calendrier from './components/Calendrier'
import Demandes from './components/Demandes'
import './App.css'

const auth = getAuth(app)

const PAGES = [
  { id: 'demandes', label: 'Demandes', icon: <Inbox size={20} /> },
  { id: 'reservations', label: 'Reservations', icon: <ClipboardList size={20} /> },
  { id: 'calendrier', label: 'Calendrier', icon: <CalendarDays size={20} /> },
  { id: 'taches', label: 'Taches', icon: <ListChecks size={20} /> },
  { id: 'depenses', label: 'Depenses', icon: <Receipt size={20} /> },
]

function App() {
  const [utilisateur, setUtilisateur] = useState(null)
  const [chargement, setChargement] = useState(true)
  const [page, setPage] = useState('demandes')
  const [vue, setVue] = useState('publique')

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      setUtilisateur(user)
      setChargement(false)
      if (user) setVue('admin')
    })
    return unsub
  }, [])

  const deconnexion = async () => {
    await signOut(auth)
    setVue('publique')
  }

  const allerAdmin = () => setVue('login')

  if (chargement) {
    return (
      <div className="loading">
        <p>Chargement...</p>
      </div>
    )
  }

  if (vue === 'publique') {
    return <PagePublique onAdmin={allerAdmin} />
  }

  if (vue === 'login' && !utilisateur) {
    return <Login onRetour={() => setVue('publique')} />
  }

  return (
    <div className="app">
      <aside className="sidebar">
        <div className="sidebar-top">
          <h1 className="sidebar-logo">Le Camp<br />du Lac</h1>
          <span className="sidebar-sub">Tableau de bord</span>
        </div>
        <nav className="sidebar-nav">
          {PAGES.map((p) => (
            <button
              key={p.id}
              className={`sidebar-link${page === p.id ? ' active' : ''}`}
              onClick={() => setPage(p.id)}
            >
              {p.icon}
              <span>{p.label}</span>
            </button>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <button className="sidebar-link sidebar-logout" onClick={deconnexion}>
            <LogOut size={20} />
            <span>Deconnexion</span>
          </button>
        </div>
      </aside>

      <main className="main">
        <div className="main-header">
          <h2 className="main-title">{PAGES.find((p) => p.id === page)?.label}</h2>
        </div>
        <div className="main-content">
          {page === 'demandes' && <Demandes />}
          {page === 'reservations' && <Reservations />}
          {page === 'calendrier' && <Calendrier />}
          {page === 'taches' && <Taches />}
          {page === 'depenses' && <Depenses />}
        </div>
      </main>
    </div>
  )
}

export default App
