import { useState, useEffect } from 'react';
import { getTotalOrdersCount, getTotalRevenue, getPopularItems, getOrdersByDayOfWeek } from '../firebase';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, Users, DollarSign, Award } from 'lucide-react';

// Couleurs pour les graphiques
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const Dashboard = () => {
  const [totalOrders, setTotalOrders] = useState<number>(0);
  const [totalRevenue, setTotalRevenue] = useState<number>(0);
  const [popularItems, setPopularItems] = useState<{name: string, count: number}[]>([]);
  const [ordersByDay, setOrdersByDay] = useState<{name: string, value: number}[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // Récupérer toutes les statistiques
        const ordersCount = await getTotalOrdersCount();
        const revenue = await getTotalRevenue();
        const topItems = await getPopularItems(5);
        const ordersDayData = await getOrdersByDayOfWeek();
        
        // Mettre à jour les états
        setTotalOrders(ordersCount);
        setTotalRevenue(revenue);
        setPopularItems(topItems);
        
        // Convertir les données par jour en format pour le graphique
        const formattedOrdersByDay = Object.entries(ordersDayData).map(([name, value]) => ({
          name,
          value
        }));
        setOrdersByDay(formattedOrdersByDay);
        
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchDashboardData();
  }, []);

  // Formater les données pour le graphique en camembert
  const pieChartData = popularItems.map(item => ({
    name: item.name,
    value: item.count
  }));

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-6">Tableau de Bord</h2>
      
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <span className="loading loading-spinner loading-lg text-primary"></span>
        </div>
      ) : (
        <>
          {/* Cartes de statistiques */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="stats shadow">
              <div className="stat">
                <div className="stat-figure text-primary">
                  <Users className="h-8 w-8" />
                </div>
                <div className="stat-title">Commandes Totales</div>
                <div className="stat-value">{totalOrders}</div>
              </div>
            </div>
            
            <div className="stats shadow">
              <div className="stat">
                <div className="stat-figure text-secondary">
                  <DollarSign className="h-8 w-8" />
                </div>
                <div className="stat-title">Revenu Total</div>
                <div className="stat-value">{totalRevenue.toFixed(2)} €</div>
              </div>
            </div>
            
            <div className="stats shadow">
              <div className="stat">
                <div className="stat-figure text-accent">
                  <Award className="h-8 w-8" />
                </div>
                <div className="stat-title">Plat le Plus Populaire</div>
                <div className="stat-value text-lg">{popularItems.length > 0 ? popularItems[0].name : 'Aucun'}</div>
              </div>
            </div>
            
            <div className="stats shadow">
              <div className="stat">
                <div className="stat-figure text-info">
                  <TrendingUp className="h-8 w-8" />
                </div>
                <div className="stat-title">Commandes Moyennes par Jour</div>
                <div className="stat-value">
                  {totalOrders > 0 ? (totalOrders / 7).toFixed(1) : '0'}
                </div>
              </div>
            </div>
          </div>
          
          {/* Graphiques */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Graphique des commandes par jour */}
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h3 className="card-title">Commandes par Jour</h3>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={ordersByDay}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="value" name="Nombre de commandes" fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
            
            {/* Graphique des plats populaires */}
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h3 className="card-title">Plats les Plus Populaires</h3>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieChartData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {pieChartData.map((_, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => [`${value} commandes`, 'Quantité']} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;
