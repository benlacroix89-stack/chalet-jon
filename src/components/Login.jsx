import { useState } from 'react'
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth'
import app from '../firebase'
import './Login.css'

const auth = getAuth(app)

function Login({ onRetour }) {
  const [email, setEmail] = useState('')
  const [motDePasse, setMotDePasse] = useState('')
  const [erreur, setErreur] = useState('')
  const [chargement, setChargement] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErreur('')
    setChargement(true)
    try {
      await signInWithEmailAndPassword(auth, email, motDePasse)
    } catch (err) {
      const messages = {
        'auth/invalid-credential': 'Email ou mot de passe incorrect.',
        'auth/user-not-found': 'Aucun compte avec cet email.',
        'auth/wrong-password': 'Mot de passe incorrect.',
        'auth/too-many-requests': 'Trop de tentatives. Reessayez plus tard.',
        'auth/invalid-email': 'Adresse email invalide.',
      }
      setErreur(messages[err.code] || 'Erreur de connexion.')
    } finally {
      setChargement(false)
    }
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-header">
          <h1>Chalet de Jon</h1>
          <p>Connectez-vous pour continuer</p>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          <label className="form-label">
            Email
            <input
              className="input"
              type="email"
              placeholder="votre@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </label>
          <label className="form-label">
            Mot de passe
            <input
              className="input"
              type="password"
              placeholder="Votre mot de passe"
              value={motDePasse}
              onChange={(e) => setMotDePasse(e.target.value)}
              required
              autoComplete="current-password"
            />
          </label>

          {erreur && <p className="login-erreur">{erreur}</p>}

          <button className="btn btn-primary login-btn" type="submit" disabled={chargement}>
            {chargement ? 'Connexion...' : 'Se connecter'}
          </button>
        </form>

        {onRetour && (
          <button className="login-retour" type="button" onClick={onRetour}>
            ← Retour au site
          </button>
        )}
      </div>
    </div>
  )
}

export default Login
