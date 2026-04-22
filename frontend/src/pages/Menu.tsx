import { useEffect, useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../api/axios';
import { useDispatch } from 'react-redux';
import { addToCart } from '../store/cartSlice';
import { Pizza, Leaf, Plus, Star, Check, Filter, Search, MapPin, Phone } from 'lucide-react';

export default function Menu() {
  const [searchParams] = useSearchParams();
  const outletIdFromParams = searchParams.get('outlet_id');
  const outletName = searchParams.get('name');
  
  const [items, setItems] = useState<any[]>([]);
  const [addedItems, setAddedItems] = useState<Record<number, boolean>>({});
  const [loading, setLoading] = useState(true);

  // Filter States
  const [selectedCity, setSelectedCity] = useState('All');
  const [selectedOutlet, setSelectedOutlet] = useState('All');
  const [selectedCuisine, setSelectedCuisine] = useState('All');
  const [isVegOnly, setIsVegOnly] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const dispatch = useDispatch();

  useEffect(() => {
    const fetchMenu = async () => {
      setLoading(true);
      try {
        const url = outletIdFromParams ? `/menu?outlet_id=${outletIdFromParams}` : '/menu';
        const response = await api.get(url);
        setItems(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        console.error('Failed to fetch menu', error);
      } finally {
        setLoading(false);
      }
    };
    fetchMenu();
  }, [outletIdFromParams]);

  // Derived Filter Options with useMemo for stability
  const cities = useMemo(() => {
    const uniqueCities = new Set(items.map(item => item.outlet?.city).filter(Boolean));
    return ['All', ...Array.from(uniqueCities)].sort();
  }, [items]);

  const cuisines = useMemo(() => {
    const uniqueCuisines = new Set(items.map(item => item.cuisineType).filter(Boolean));
    return ['All', ...Array.from(uniqueCuisines)].sort();
  }, [items]);

  const availableOutlets = useMemo(() => {
    const filteredByCity = items.filter(item => selectedCity === 'All' || item.outlet?.city === selectedCity);
    const uniqueOutlets = new Set(filteredByCity.map(item => item.outlet?.name).filter(Boolean));
    return ['All', ...Array.from(uniqueOutlets)].sort();
  }, [items, selectedCity]);

  // Derived Outlet Info (only if viewing a specific outlet)
  const outletInfo = useMemo(() => {
    if (outletIdFromParams && items.length > 0) {
      return items[0].outlet;
    }
    return null;
  }, [items, outletIdFromParams]);

  // Reset outlet when city changes
  useEffect(() => {
    setSelectedOutlet('All');
  }, [selectedCity]);

  // Filtering Logic
  const filteredItems = useMemo(() => {
    return items.filter(item => {
      const matchesCity = selectedCity === 'All' || item.outlet?.city === selectedCity;
      const matchesOutlet = selectedOutlet === 'All' || item.outlet?.name === selectedOutlet;
      const matchesCuisine = selectedCuisine === 'All' || item.cuisineType === selectedCuisine;
      const matchesVeg = !isVegOnly || item.isVegetarian;
      const matchesSearch = item.name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           item.description?.toLowerCase().includes(searchQuery.toLowerCase());
      
      return matchesCity && matchesOutlet && matchesCuisine && matchesVeg && matchesSearch;
    });
  }, [items, selectedCity, selectedOutlet, selectedCuisine, isVegOnly, searchQuery]);

  const handleAddToCart = (item: any) => {
    dispatch(addToCart({ 
      outletId: item.outlet.id, 
      item: { id: item.id, name: item.name, price: item.price, quantity: 1 } 
    }));
    
    setAddedItems(prev => ({ ...prev, [item.id]: true }));
    
    setTimeout(() => {
      setAddedItems(prev => ({ ...prev, [item.id]: false }));
    }, 2000);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 px-4 sm:px-0">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {outletName ? `Menu - ${outletName}` : 'Explore All Pizzas'}
          </h1>
          <p className="text-gray-500">{filteredItems.length} items found</p>
        </div>

        {/* Search Bar */}
        <div className="relative w-full md:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input 
            type="text"
            placeholder="Search pizzas..."
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-orange-500 focus:outline-none"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Outlet Details Card (Conditional) */}
      {outletInfo && (
        <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 flex flex-col md:flex-row md:items-center gap-6 animate-in fade-in slide-in-from-top-4 duration-500">
          <div className="bg-orange-100 p-4 rounded-2xl text-orange-600">
            <Pizza className="h-8 w-8" />
          </div>
          <div className="flex-1 space-y-1">
            <div className="flex items-center gap-2">
               <h2 className="text-xl font-black text-gray-900">{outletInfo.name}</h2>
               <span className="bg-green-100 text-green-700 text-[10px] font-black px-2 py-0.5 rounded-full uppercase">Verified Outlet</span>
            </div>
            <p className="text-gray-500 font-medium flex items-center gap-2">
              <MapPin className="h-4 w-4 text-gray-400" />
              {outletInfo.address}, {outletInfo.city}
            </p>
          </div>
          <div className="flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-xl border border-gray-100">
            <Phone className="h-4 w-4 text-gray-400" />
            <span className="font-bold text-gray-700">{outletInfo.phone}</span>
          </div>
        </div>
      )}

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-wrap items-center gap-6">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-gray-400" />
          <span className="text-sm font-bold text-gray-700">Filters:</span>
        </div>

        {!outletIdFromParams && (
          <>
            <div className="flex items-center gap-2">
              <label className="text-xs font-bold text-gray-500 uppercase">City</label>
              <select 
                className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
              >
                {cities.map(city => <option key={city} value={city}>{city}</option>)}
              </select>
            </div>

            <div className="flex items-center gap-2">
              <label className="text-xs font-bold text-gray-500 uppercase">Outlet</label>
              <select 
                className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                value={selectedOutlet}
                onChange={(e) => setSelectedOutlet(e.target.value)}
              >
                {availableOutlets.map(out => <option key={out} value={out}>{out}</option>)}
              </select>
            </div>
          </>
        )}

        <div className="flex items-center gap-2">
          <label className="text-xs font-bold text-gray-500 uppercase">Cuisine</label>
          <select 
            className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
            value={selectedCuisine}
            onChange={(e) => setSelectedCuisine(e.target.value)}
          >
            {cuisines.map(cuisine => <option key={cuisine} value={cuisine}>{cuisine}</option>)}
          </select>
        </div>

        <button 
          onClick={() => setIsVegOnly(!isVegOnly)}
          className={`flex items-center gap-2 px-4 py-1.5 rounded-lg border transition-all text-sm font-bold ${
            isVegOnly 
              ? 'bg-green-50 border-green-200 text-green-700' 
              : 'bg-white border-gray-200 text-gray-600 hover:border-green-200'
          }`}
        >
          <Leaf className={`h-4 w-4 ${isVegOnly ? 'text-green-600' : 'text-gray-400'}`} />
          Veg Only
        </button>

        {(selectedCity !== 'All' || selectedOutlet !== 'All' || selectedCuisine !== 'All' || isVegOnly || searchQuery) && (
          <button 
            onClick={() => {
              setSelectedCity('All');
              setSelectedOutlet('All');
              setSelectedCuisine('All');
              setIsVegOnly(false);
              setSearchQuery('');
            }}
            className="text-sm font-bold text-orange-500 hover:text-orange-600 underline"
          >
            Clear All
          </button>
        )}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredItems.map((item) => (
          <div key={item.id} className="bg-white rounded-3xl overflow-hidden shadow-lg border border-gray-100 flex flex-col group hover:shadow-xl transition-shadow">
            <div className="h-48 bg-orange-50 flex items-center justify-center relative overflow-hidden">
              <Pizza className="h-20 w-20 text-orange-200 group-hover:scale-110 transition-transform duration-500" />
              {item.isVegetarian && (
                <div className="absolute top-4 right-4 bg-white p-1 rounded-md shadow-sm">
                  <Leaf className="h-5 w-5 text-green-500" />
                </div>
              )}
              <div className="absolute bottom-3 left-3 bg-white/80 backdrop-blur-sm px-3 py-1 rounded-full flex items-center gap-1">
                <Star className="h-3 w-3 fill-orange-400 text-orange-400" />
                <span className="text-xs font-black text-gray-700">{item.averageRating > 0 ? item.averageRating.toFixed(1) : 'New'}</span>
              </div>
            </div>
            <div className="p-6 flex-1 flex flex-col">
              <div className="flex justify-between items-start mb-1">
                <h3 className="text-xl font-bold text-gray-900">{item.name}</h3>
                <span className="text-xl font-black text-orange-500">₹{item.price}</span>
              </div>
              
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <span className="text-[10px] font-bold bg-gray-100 text-gray-500 px-2 py-0.5 rounded uppercase tracking-wider">
                  {item.cuisineType}
                </span>
                <span className="text-[10px] font-bold bg-orange-50 text-orange-600 px-2 py-0.5 rounded uppercase tracking-wider">
                  {item.outlet?.city}
                </span>
              </div>

              <p className="text-gray-500 text-sm mb-6 flex-1">{item.description}</p>
              
              <button
                onClick={() => handleAddToCart(item)}
                className={`w-full py-3 rounded-xl transition-all flex items-center justify-center gap-2 font-bold ${
                  addedItems[item.id] 
                    ? 'bg-green-50 text-white' 
                    : 'bg-gray-900 text-white hover:bg-black'
                }`}
              >
                {addedItems[item.id] ? (
                  <>
                    <Check className="h-5 w-5" />
                    Added!
                  </>
                ) : (
                  <>
                    <Plus className="h-5 w-5" />
                    Add to Cart
                  </>
                )}
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredItems.length === 0 && (
        <div className="text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
          <Pizza className="h-16 w-16 text-gray-200 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-900 mb-2">No matching pizzas found</h3>
          <p className="text-gray-500">Try adjusting your filters or search query.</p>
        </div>
      )}
    </div>
  );
}
