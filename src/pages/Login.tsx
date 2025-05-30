import { useState } from 'react';                    // Hook React pour gérer l'état local des composants
import { useNavigate } from 'react-router-dom';       // Hook pour la navigation programmatique
import { loginWithEmailAndPassword } from '../firebase'; // Fonction d'authentification Firebase
import { Lock, Mail, LogIn } from 'lucide-react';     // Icônes pour l'interface utilisateur

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
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center p-4">
      {/* Carte de connexion avec effet de profondeur */}
      <div className="card w-full max-w-md bg-white shadow-xl hover:shadow-2xl transition-all duration-300">
        {/* En-tête avec dégradé */}
        <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-6 rounded-t-2xl">
          <h1 className="text-3xl font-bold text-white text-center">Connexion Admin</h1>
          <p className="text-white/80 text-center mt-2">Accédez au panneau d'administration</p>
        </div>
        
        {/* Formulaire avec espacement amélioré */}
        <form className="card-body pt-6" onSubmit={handleSubmit}>
          {/* Champ Email avec animation au focus */}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium text-gray-700">Email</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500">
                <Mail className="h-5 w-5" />
              </div>
              <input
                type="email"                            // Validation email HTML5
                placeholder="votre@email.com"
                className="input input-bordered w-full pl-10 bg-gray-50 focus:bg-white transition-colors duration-200 focus:ring-2 focus:ring-green-500/50 focus:border-green-500"   // Icone intégrée + effet focus
                value={email}                           // Controlled component React
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>
          
          {/* Champ Mot de passe avec animation au focus */}
          <div className="form-control mt-4">
            <label className="label">
              <span className="label-text font-medium text-gray-700">Mot de passe</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500">
                <Lock className="h-5 w-5" />
              </div>
              <input
                type="password"                         // Masque les caractères
                placeholder="••••••••"
                className="input input-bordered w-full pl-10 bg-gray-50 focus:bg-white transition-colors duration-200 focus:ring-2 focus:ring-green-500/50 focus:border-green-500"   // Icone intégrée + effet focus
                value={password}                        // Controlled component React
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>
          
          {/* Bouton de connexion avec effet hover et animation */}
          <div className="form-control mt-8">
            <button 
              type="submit"                           // Déclenche l'onSubmit
              className="btn bg-green-600 hover:bg-emerald-700 transition-all duration-300 gap-2 text-white shadow-md hover:shadow-lg border-0"  // Animation de couleur + ombre
            >
              <LogIn className="h-5 w-5" /> Se connecter
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
