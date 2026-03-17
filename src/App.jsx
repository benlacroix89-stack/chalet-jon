import { useState, useEffect } from 'react'
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth'
import app from './firebase'
import PagePublique from './components/PagePublique'
import Login from './components/Login'
import Reservations from './components/Reservations'
import Taches from './components/Taches'
import Depenses from './components/Depenses'
import './App.css'

const auth = getAuth(app)

const PAGES = [
  { id: 'reservations', label: 'Reservations' },
  { id: 'taches', label: 'Taches' },
  { id: 'depenses', label: 'Depenses' },
]

function App() {
  const [utilisateur, setUtilisateur] = useState(null)
  const [chargement, setChargement] = useState(true)
  const [page, setPage] = useState('reservations')
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
      <header className="topbar">
        <div className="topbar-inner">
          <h1 className="logo">Chalet de Jon</h1>
          <nav className="nav">
            {PAGES.map((p) => (
              <button
                key={p.id}
                className={`nav-link${page === p.id ? ' active' : ''}`}
                onClick={() => setPage(p.id)}
              >
                {p.label}
              </button>
            ))}
            <button className="nav-link nav-logout" onClick={deconnexion}>
              Deconnexion
            </button>
          </nav>
        </div>
      </header>

      <main className="main">
        <div className="container">
          {page === 'reservations' && <Reservations />}
          {page === 'taches' && <Taches />}
          {page === 'depenses' && <Depenses />}
        </div>
      </main>
    </div>
  )
}

export default App
