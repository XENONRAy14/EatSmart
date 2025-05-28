import { Link } from 'react-router-dom';
import Map from '../components/Map';

const Home = () => {
  return (
    <div className="container mx-auto p-4">
      {/* Hero Section */}
      <div className="hero py-12">
        <div className="hero-content text-center">
          <div className="max-w-3xl">
            <h1 className="text-4xl font-bold mb-4">Bienvenue chez EatSmart</h1>
            <p className="text-xl mb-6">
              Découvrez la gastronomie française dans un cadre moderne et élégant. Notre cuisine allie tradition et innovation pour vous offrir une expérience culinaire exceptionnelle.
            </p>
            <div className="flex justify-center gap-4 flex-wrap">
              <Link to="/menu" className="btn btn-primary">Voir notre menu</Link>
              <Link to="/order" className="btn btn-outline btn-primary">Commander maintenant</Link>
            </div>
          </div>
        </div>
      </div>

      {/* Restaurant Info Section */}
      <div className="card lg:card-side bg-base-100 shadow-xl mb-12">
        <figure className="lg:w-1/2">
          <img
            src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
            alt="Restaurant interior"
            className="h-full w-full object-cover"
          />
        </figure>
        <div className="card-body lg:w-1/2">
          <h2 className="card-title text-2xl">Notre Restaurant</h2>
          <div className="space-y-2 my-4">
            <div className="flex items-center">
              
              <p>16 Bd Jeanne d'Arc, 13005 Marseille</p>
            </div>
            <div className="flex items-center">
              
              <p>Ouvert du Mardi au Dimanche, 12h-14h30 / 19h-22h30</p>
            </div>
            <div className="flex items-center">
              
              <p>06 51 36 31 92</p>
            </div>
          </div>
          <p className="mb-4">
            Notre équipe passionnée vous accueille dans un cadre chaleureux et élégant. Nous mettons un point d'honneur à sélectionner les meilleurs produits locaux et de saison pour vous offrir une cuisine authentique et savoureuse.
          </p>
          <div className="card-actions justify-end">
            <Link to="/order" className="btn btn-outline btn-primary btn-sm">
              Réserver une table 
            </Link>
          </div>
        </div>
      </div>

      {/* Menu Highlights Section */}
      <div className="mb-12">
        <h2 className="text-3xl font-bold text-center mb-6">Nos Spécialités</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="card bg-base-100 shadow-xl">
            <figure>
              <img 
                src="https://images.unsplash.com/photo-1544025162-d76694265947?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" 
                alt="Filet de Bœuf Rossini" 
                className="h-48 w-full object-cover"
              />
            </figure>
            <div className="card-body">
              <h3 className="card-title">Filet de Bœuf Rossini</h3>
              <p>Filet de bœuf, escalope de foie gras poêlée, sauce aux truffes et purée maison</p>
              <div className="card-actions justify-end">
                <Link to="/menu" className="btn btn-primary btn-sm">Voir le menu</Link>
              </div>
            </div>
          </div>
          
          <div className="card bg-base-100 shadow-xl">
            <figure>
              <img 
                src="https://images.unsplash.com/photo-1476124369491-e7addf5db371?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" 
                alt="Risotto aux Cèpes" 
                className="h-48 w-full object-cover"
              />
            </figure>
            <div className="card-body">
              <h3 className="card-title">Risotto aux Cèpes</h3>
              <p>Risotto crémeux aux cèpes et parmesan, huile de truffe</p>
              <div className="card-actions justify-end">
                <Link to="/menu" className="btn btn-primary btn-sm">Voir le menu</Link>
              </div>
            </div>
          </div>
          
          <div className="card bg-base-100 shadow-xl">
            <figure>
              <img 
                src="https://images.unsplash.com/photo-1511911063855-2bf39afa5b2e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" 
                alt="Fondant au Chocolat" 
                className="h-48 w-full object-cover"
              />
            </figure>
            <div className="card-body">
              <h3 className="card-title">Fondant au Chocolat</h3>
              <p>Fondant au chocolat noir, cœur coulant et glace vanille</p>
              <div className="card-actions justify-end">
                <Link to="/menu" className="btn btn-primary btn-sm">Voir le menu</Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Map Section */}
      <div className="mb-12">
        <h2 className="text-3xl font-bold text-center mb-6">Notre Emplacement</h2>
        <div className="card shadow-xl overflow-hidden">
          <div className="h-[400px]">
            <Map />
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="card bg-primary-content p-8 text-center mb-6">
        <div className="card-body items-center">
          
          <h2 className="card-title text-2xl">Prêt à vous régaler ?</h2>
          <p className="max-w-2xl mx-auto mb-6">
            Découvrez notre menu varié et savoureux, ou commandez directement en ligne pour déguster nos plats chez vous.
          </p>
          <div className="card-actions justify-center gap-4">
            <Link to="/menu" className="btn btn-primary">Voir le menu</Link>
            <Link to="/order" className="btn btn-outline btn-primary">Commander</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;