import { useEffect, useState, useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { MapPin, Phone, ArrowRight, Pizza } from 'lucide-react';

export default function Outlets() {
  const [searchParams] = useSearchParams();
  const cityQuery = searchParams.get('city');
  const [outlets, setOutlets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOutlets = async () => {
      setLoading(true);
      try {
        const url = cityQuery ? `/outlets?city=${cityQuery}` : '/outlets';
        const response = await api.get(url);
        setOutlets(response.data);
      } catch (error) {
        console.error('Failed to fetch outlets', error);
      } finally {
        setLoading(false);
      }
    };
    fetchOutlets();
  }, [cityQuery]);

  // Group outlets by city if viewing all
  const groupedOutlets = useMemo(() => {
    if (cityQuery) return null;
    return outlets.reduce((acc: any, outlet: any) => {
      const city = outlet.city;
      if (!acc[city]) acc[city] = [];
      acc[city].push(outlet);
      return acc;
    }, {});
  }, [outlets, cityQuery]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  const renderOutletCard = (outlet: any) => (
    <div 
      key={outlet.id} 
      onClick={() => navigate(`/menu?outlet_id=${outlet.id}&name=${outlet.name}`)}
      className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100 hover:shadow-xl transition-all group cursor-pointer flex flex-col justify-between"
    >
      <div className="space-y-4">
        <div className="flex justify-between items-start">
          <div className="bg-orange-100 p-4 rounded-2xl text-orange-600">
            <Pizza className="h-6 w-6" />
          </div>
          <span className="bg-green-100 text-green-700 text-xs font-black px-3 py-1 rounded-full uppercase">Open Now</span>
        </div>
        
        <div>
          <h3 className="text-2xl font-black text-gray-900 group-hover:text-orange-500 transition-colors mb-2">
            {outlet.name}
          </h3>
          <p className="text-gray-500 font-medium flex items-start gap-2">
            <MapPin className="h-5 w-5 text-gray-400 shrink-0" />
            {outlet.address}
          </p>
        </div>
      </div>

      <div className="mt-8 pt-6 border-t border-gray-50 flex items-center justify-between">
        <div className="flex items-center gap-2 text-gray-500 font-bold text-sm">
          <Phone className="h-4 w-4" />
          {outlet.phone}
        </div>
        <div className="text-orange-50 font-black flex items-center gap-1 group-hover:translate-x-1 transition-transform">
           <span className="text-orange-500">View Menu</span> <ArrowRight className="h-5 w-5 text-orange-500" />
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-12 px-4 sm:px-0">
      <div className="flex items-center gap-3">
        <MapPin className="h-8 w-8 text-orange-500" />
        <div>
          <h1 className="text-3xl font-black text-gray-900">
            {cityQuery ? `Pizzariya in ${cityQuery}` : 'All Our Locations'}
          </h1>
          <p className="text-gray-500">
            {cityQuery ? 'Discover our branches in your area' : 'Find a Pizzariya outlet near you'}
          </p>
        </div>
      </div>

      {cityQuery ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {outlets.length > 0 ? (
            outlets.map(renderOutletCard)
          ) : (
            <div className="col-span-full py-20 text-center space-y-4 bg-gray-50 rounded-[2rem] border-2 border-dashed border-gray-200">
               <MapPin className="h-12 w-12 text-gray-300 mx-auto" />
               <p className="text-xl font-bold text-gray-500">No outlets found in {cityQuery} yet.</p>
               <button onClick={() => navigate('/')} className="text-orange-500 font-black hover:underline">Go Back Home</button>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-16">
          {Object.entries(groupedOutlets || {}).map(([city, cityOutlets]: [string, any]) => (
            <div key={city} className="space-y-6">
              <div className="flex items-center gap-4">
                <h2 className="text-2xl font-black text-gray-800">{city}</h2>
                <div className="flex-1 h-px bg-gray-100"></div>
                <span className="text-gray-400 font-bold text-sm uppercase tracking-widest">{cityOutlets.length} Outlets</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {cityOutlets.map(renderOutletCard)}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
