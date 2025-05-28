import { useState } from 'react';                    // Hook React pour gérer l'état local des composants
import { useNavigate } from 'react-router-dom';       // Hook pour la navigation programmatique
import { loginWithEmailAndPassword } from '../firebase'; // Fonction d'authentification Firebase
import { Lock, Mail } from 'lucide-react';            // Icônes pour l'interface utilisateur

const Login = () => {
  const [email, setEmail] = useState('');              // État pour stocker l'email saisi
  const [password, setPassword] = useState('');        // État pour stocker le mot de passe saisi
  const navigate = useNavigate();                      // Hook pour rediriger après connexion

  const handleSubmit = async (e: React.FormEvent) => {  // Fonction asynchrone appelée lors de la soumission du formulaire
    e.preventDefault();                                // Empêche le rechargement de la page
    if (!email || !password) return;                  // Validation basique des champs
    const user = await loginWithEmailAndPassword(email, password); // Appel à Firebase Authentication
    if (user) navigate('/admin');                     // Redirection vers /admin si connexion réussie
  };

  return (
    <div className="hero min-h-screen bg-base-200">
      <div className="hero-content flex-col">
        <div className="text-center">
          <h1 className="text-3xl font-bold">Connexion Administrateur</h1>
          <p className="py-2">Accédez au panneau d'administration</p>
        </div>
        
        <div className="card w-full max-w-sm shadow-lg bg-base-100">
          <form className="card-body" onSubmit={handleSubmit}>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Email</span>
              </label>
              <div className="input-group">
                <span>
                  <Mail className="h-5 w-5" />
                </span>
                <input
                  type="email"                            // Champ de type email pour validation HTML5
                  placeholder="Adresse email"
                  className="input input-bordered w-full"   // Classes Tailwind/DaisyUI
                  value={email}                           // Liaison à l'état React (controlled component)
                  onChange={(e) => setEmail(e.target.value)} // Mise à jour de l'état à chaque frappe
                  required                                // Validation HTML5 obligatoire
                />
              </div>
            </div>
            
            <div className="form-control">
              <label className="label">
                <span className="label-text">Mot de passe</span>
              </label>
              <div className="input-group">
                <span>
                  <Lock className="h-5 w-5" />
                </span>
                <input
                  type="password"                         // Masque les caractères saisis
                  placeholder="Mot de passe"
                  className="input input-bordered w-full"   // Classes Tailwind/DaisyUI
                  value={password}                        // Liaison à l'état React (controlled component)
                  onChange={(e) => setPassword(e.target.value)} // Mise à jour de l'état à chaque frappe
                  required                                // Validation HTML5 obligatoire
                />
              </div>
            </div>
            
            <div className="form-control mt-6">
              <button 
                type="submit"                           // Déclenche l'événement onSubmit du formulaire
                className="btn btn-primary"               // Style DaisyUI pour le bouton
              >
                Se connecter
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
