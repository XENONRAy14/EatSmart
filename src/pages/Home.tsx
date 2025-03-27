import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Clock, Phone, UtensilsCrossed, ChevronRight } from 'lucide-react';
import Map from '../components/Map';

const Home = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Bienvenue chez EatSmart
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Découvrez la gastronomie française dans un cadre moderne et élégant. Notre cuisine allie tradition et innovation pour vous offrir une expérience culinaire exceptionnelle.
        </p>
        <div className="mt-8 flex justify-center gap-4">
          <Link
            to="/menu"
            className="inline-block px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
          >
            Voir notre menu
          </Link>
          <Link
            to="/order"
            className="inline-block px-6 py-3 border border-emerald-600 text-emerald-600 rounded-lg hover:bg-emerald-50 transition-colors"
          >
            Commander maintenant
          </Link>
        </div>
      </div>

      {/* Restaurant Info Section */}
      <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
        <div>
          <img
            src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
            alt="Restaurant interior"
            className="rounded-lg shadow-lg object-cover h-[400px] w-full"
          />
        </div>
        <div>
          <h2 className="text-3xl font-semibold mb-6">Notre Restaurant</h2>
          <div className="space-y-4 mb-6">
            <div className="flex items-center">
              <MapPin className="h-5 w-5 text-emerald-600 mr-2" />
              <p>16 Bd Jeanne d'Arc, 13005 Marseille</p>
            </div>
            <div className="flex items-center">
              <Clock className="h-5 w-5 text-emerald-600 mr-2" />
              <p>Ouvert du Mardi au Dimanche, 12h-14h30 / 19h-22h30</p>
            </div>
            <div className="flex items-center">
              <Phone className="h-5 w-5 text-emerald-600 mr-2" />
              <p>06 51 36 31 92</p>
            </div>
          </div>
          <p className="text-gray-600 mb-6">
            Notre équipe passionnée vous accueille dans un cadre chaleureux et élégant. Nous mettons un point d'honneur à sélectionner les meilleurs produits locaux et de saison pour vous offrir une cuisine authentique et savoureuse.
          </p>
          <Link
            to="/order"
            className="inline-flex items-center text-emerald-600 font-medium hover:text-emerald-700"
          >
            Réserver une table <ChevronRight className="h-4 w-4 ml-1" />
          </Link>
        </div>
      </div>

      {/* Menu Highlights Section */}
      <div className="mb-16">
        <h2 className="text-3xl font-semibold mb-8 text-center">Nos Spécialités</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <img 
              src="https://images.unsplash.com/photo-1544025162-d76694265947?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" 
              alt="Filet de Bœuf Rossini" 
              className="w-full h-48 object-cover"
            />
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-2">Filet de Bœuf Rossini</h3>
              <p className="text-gray-600 mb-4">Filet de bœuf, escalope de foie gras poêlée, sauce aux truffes et purée maison</p>
              <Link 
                to="/menu" 
                className="text-emerald-600 font-medium hover:text-emerald-700"
              >
                Voir le menu
              </Link>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <img 
              src="https://images.unsplash.com/photo-1476124369491-e7addf5db371?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" 
              alt="Risotto aux Cèpes" 
              className="w-full h-48 object-cover"
            />
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-2">Risotto aux Cèpes</h3>
              <p className="text-gray-600 mb-4">Risotto crémeux aux cèpes et parmesan, huile de truffe</p>
              <Link 
                to="/menu" 
                className="text-emerald-600 font-medium hover:text-emerald-700"
              >
                Voir le menu
              </Link>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <img 
              src="https://images.unsplash.com/photo-1511911063855-2bf39afa5b2e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" 
              alt="Fondant au Chocolat" 
              className="w-full h-48 object-cover"
            />
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-2">Fondant au Chocolat</h3>
              <p className="text-gray-600 mb-4">Fondant au chocolat noir, cœur coulant et glace vanille</p>
              <Link 
                to="/menu" 
                className="text-emerald-600 font-medium hover:text-emerald-700"
              >
                Voir le menu
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Map Section */}
      <div className="mb-16">
        <h2 className="text-3xl font-semibold mb-6 text-center">Notre Emplacement</h2>
        <div className="h-[400px] rounded-lg overflow-hidden shadow-lg">
          <Map />
        </div>
      </div>

      {/* Call to Action */}
      <div className="bg-emerald-50 rounded-lg p-8 text-center">
        <UtensilsCrossed className="h-12 w-12 text-emerald-600 mx-auto mb-4" />
        <h2 className="text-2xl font-semibold mb-4">Prêt à vous régaler ?</h2>
        <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
          Découvrez notre menu varié et savoureux, ou commandez directement en ligne pour déguster nos plats chez vous.
        </p>
        <div className="flex justify-center gap-4 flex-wrap">
          <Link
            to="/menu"
            className="inline-block px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
          >
            Voir le menu
          </Link>
          <Link
            to="/order"
            className="inline-block px-6 py-3 border border-emerald-600 text-emerald-600 rounded-lg hover:bg-emerald-50 transition-colors"
          >
            Commander
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;