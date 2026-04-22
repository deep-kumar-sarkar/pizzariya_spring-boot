import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../store';
import { logout } from '../store/authSlice';
import { Pizza } from 'lucide-react';

export default function NavBar() {
  const { user } = useSelector((state: RootState) => state.auth);
  const { itemsByOutlet } = useSelector((state: RootState) => state.cart);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const cartCount = Object.values(itemsByOutlet).flat().reduce((sum, item) => sum + item.quantity, 0);

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2">
              <Pizza className="h-8 w-8 text-orange-500" />
              <span className="text-xl font-bold text-gray-900">Pizzariya</span>
            </Link>
          </div>
          <div className="flex items-center gap-6 sm:gap-8">
            <Link to="/" className="text-gray-700 hover:text-orange-500 font-medium">Home</Link>
            <Link to="/menu" className="text-gray-700 hover:text-orange-500 font-medium">Menu</Link>
            <Link to="/order" className="relative text-gray-700 hover:text-orange-500 font-medium">
              Order
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-3 bg-orange-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center shadow-sm">
                  {cartCount}
                </span>
              )}
            </Link>
            <Link to="/review" className="text-gray-700 hover:text-orange-500 font-medium">Review</Link>
            
            {user ? (
              <>
                <Link to="/history" className="text-gray-700 hover:text-orange-500 font-medium">History</Link>
                <div className="h-6 w-px bg-gray-200 hidden sm:block"></div>
                <div className="flex items-center gap-3">
                  <span className="text-gray-500 text-sm hidden md:block font-medium">Hi, {user.name}</span>
                  <button 
                    onClick={() => { dispatch(logout()); navigate('/login'); }}
                    className="text-red-500 hover:text-white hover:bg-red-500 border border-red-200 px-3 py-1 rounded-lg transition-all text-sm font-bold"
                  >
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="text-gray-700 hover:text-orange-500 font-medium">Login</Link>
                <Link to="/register" className="bg-orange-500 text-white px-4 py-2 rounded-xl hover:bg-orange-600 transition-all font-bold shadow-sm">Signup</Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
