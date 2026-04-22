import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { MapPin, ArrowRight, Pizza, Clock, ShieldCheck, Loader2 } from 'lucide-react';

interface CityStat {
  city: string;
  count: number;
}

export default function Home() {
  const navigate = useNavigate();
  const [cityStats, setCityStats] = useState<CityStat[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCityStats = async () => {
      setLoading(true);
      try {
        const response = await api.get('/outlets/cities');
        setCityStats(response.data);
      } catch (error) {
        console.error('Failed to fetch city stats', error);
      } finally {
        setLoading(false);
      }
    };
    fetchCityStats();
  }, []);

  const features = [
    { icon: <Pizza className="h-6 w-6" />, title: "Fresh Ingredients", desc: "Our dough is handmade daily with the finest Italian flour." },
    { icon: <Clock className="h-6 w-6" />, title: "30-Min Delivery", desc: "Fast and hot delivery to your doorstep, or it's on us." },
    { icon: <ShieldCheck className="h-6 w-6" />, title: "Hygiene Guaranteed", desc: "Strict quality controls and contact-less delivery options." }
  ];

  const cityColors: Record<string, string> = {
    'Delhi': 'bg-blue-500',
    'Mumbai': 'bg-purple-500',
    'Bangalore': 'bg-green-500',
    'Chennai': 'bg-red-500'
  };

  return (
    <div className="space-y-16 pb-12">
      {/* Hero Section */}
      <div className="text-center py-20 bg-gradient-to-br from-orange-400 via-orange-500 to-red-600 rounded-[3rem] shadow-2xl text-white relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
          <div className="absolute top-10 left-10 rotate-12"><Pizza className="h-32 w-32" /></div>
          <div className="absolute bottom-10 right-10 -rotate-12"><Pizza className="h-40 w-40" /></div>
        </div>
        
        <div className="relative z-10 max-w-3xl mx-auto px-4">
          <h1 className="text-6xl md:text-7xl font-black mb-6 leading-tight">
            Deliciousness <br />
            <span className="text-orange-100">Delivered.</span>
          </h1>
          <p className="text-xl md:text-2xl mb-10 text-orange-50 font-medium">
            Discover artisanal pizzas crafted with passion and delivered with speed. 
            From classic Italian to bold fusion flavors.
          </p>
          <button 
            onClick={() => navigate('/menu')}
            className="bg-white text-orange-600 px-10 py-5 rounded-2xl hover:bg-orange-50 transition-all font-black text-xl shadow-xl flex items-center gap-3 mx-auto group active:scale-95"
          >
            Explore Our Menu
            <ArrowRight className="h-6 w-6 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>

      {/* Features Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-4">
        {features.map((f, i) => (
          <div key={i} className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 flex flex-col items-center text-center space-y-4 hover:shadow-md transition-shadow">
            <div className="bg-orange-100 p-4 rounded-2xl text-orange-500">
              {f.icon}
            </div>
            <h3 className="text-xl font-bold text-gray-900">{f.title}</h3>
            <p className="text-gray-500 leading-relaxed">{f.desc}</p>
          </div>
        ))}
      </div>

      {/* Locations Section */}
      <div className="space-y-8 px-4">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-black text-gray-900">Find Us In</h2>
          <button onClick={() => navigate('/outlets')} className="text-orange-500 font-bold hover:underline flex items-center gap-1">
            View All Locations <ArrowRight className="h-4 w-4" />
          </button>
        </div>
        
        {loading ? (
          <div className="flex items-center justify-center py-20 bg-gray-50 rounded-[2rem] border-2 border-dashed border-gray-100">
            <Loader2 className="h-8 w-8 text-orange-500 animate-spin" />
            <span className="ml-3 font-bold text-gray-400">Loading locations...</span>
          </div>
        ) : cityStats.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-in fade-in duration-700">
            {cityStats.map((loc, i) => (
              <div 
                key={i} 
                onClick={() => navigate(`/outlets?city=${loc.city}`)}
                className="group cursor-pointer relative h-48 rounded-[2rem] overflow-hidden shadow-lg"
              >
                <div className={`absolute inset-0 ${cityColors[loc.city] || 'bg-orange-500'} opacity-90 group-hover:opacity-100 transition-opacity`}></div>
                <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center">
                  <MapPin className="h-10 w-10 mb-2 opacity-80 group-hover:scale-110 transition-transform" />
                  <h3 className="text-4xl font-black mb-1">{loc.city}</h3>
                  <p className="font-bold text-white/80">{loc.count} {loc.count === 1 ? 'Outlet' : 'Outlets'}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-20 text-center bg-gray-50 rounded-[2rem] border-2 border-dashed border-gray-200">
             <MapPin className="h-12 w-12 text-gray-300 mx-auto mb-4" />
             <p className="text-xl font-bold text-gray-400">Expanding to new cities soon!</p>
             <p className="text-gray-500">In the meantime, you can browse our full menu below.</p>
             <button onClick={() => navigate('/menu')} className="mt-4 text-orange-500 font-black hover:underline">Explore Full Menu</button>
          </div>
        )}
      </div>

      {/* Bottom CTA */}
      <div className="bg-gray-900 rounded-[3rem] p-12 text-center text-white space-y-6">
        <h2 className="text-4xl font-black">Ready for a slice of heaven?</h2>
        <p className="text-gray-400 text-lg max-w-xl mx-auto">
          Join thousands of pizza lovers and order your favorite pie today.
          Fresh from our oven to your door.
        </p>
        <button 
          onClick={() => navigate('/register')}
          className="bg-orange-500 text-white px-8 py-3 rounded-xl font-bold hover:bg-orange-600 transition-all shadow-lg inline-block"
        >
          Sign Up Now
        </button>
      </div>
    </div>
  );
}
