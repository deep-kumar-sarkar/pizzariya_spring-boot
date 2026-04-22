import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../store';
import { removeFromCart, clearCart } from '../store/cartSlice';
import { logout } from '../store/authSlice';
import api from '../api/axios';
import { useNavigate, Link } from 'react-router-dom';
import { Trash2, CreditCard, ShoppingBag, LogIn } from 'lucide-react';

export default function Cart() {
  const { itemsByOutlet } = useSelector((state: RootState) => state.cart);
  const { user } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleCheckout = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    // Transform data to match backend OrderItemDto
    const payload = {
      itemsByOutlet: Object.keys(itemsByOutlet).reduce((acc: any, outletId: any) => {
        acc[outletId] = itemsByOutlet[Number(outletId)].map(item => ({
          menuItemId: item.id,
          price: item.price,
          quantity: item.quantity
        }));
        return acc;
      }, {})
    };

    try {
      await api.post('/orders', payload);
      alert('Payment Successful! Order placed.');
      dispatch(clearCart());
      navigate('/history');
    } catch (error: any) {
      console.error('Order Error:', error);
      if (error.response?.status === 403) {
        alert('Your session has expired. Please login again.');
        dispatch(logout());
        navigate('/login');
      } else {
        alert('Payment failed. Please try again.');
      }
    }
  };

  const hasItems = Object.keys(itemsByOutlet).length > 0;
  const totalAmount = Object.values(itemsByOutlet).flat().reduce((sum, i) => sum + (i.price * i.quantity), 0);

  return (
    <div className="max-w-4xl mx-auto space-y-8 px-4">
      <div className="flex items-center gap-3">
        <ShoppingBag className="h-8 w-8 text-orange-500" />
        <h1 className="text-3xl font-bold text-gray-900">Your Order</h1>
      </div>

      {!hasItems ? (
        <div className="bg-white p-16 rounded-3xl shadow-xl border border-gray-100 text-center space-y-6">
          <div className="bg-orange-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto">
            <ShoppingBag className="h-10 w-10 text-orange-300" />
          </div>
          <div className="space-y-2">
            <p className="text-2xl font-bold text-gray-900">No items selected</p>
            <p className="text-gray-500">Add some delicious pizzas to your order!</p>
          </div>
          <Link to="/menu" className="inline-block bg-orange-500 text-white px-8 py-3 rounded-2xl font-bold hover:bg-orange-600 transition-all shadow-lg">
            View Menu
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {Object.entries(itemsByOutlet).map(([outletId, items]) => (
            <div key={outletId} className="bg-white rounded-3xl shadow-lg overflow-hidden border border-gray-100">
              <div className="p-4 bg-gray-50 border-b border-gray-100 flex justify-between items-center">
                <span className="font-bold text-gray-600 uppercase tracking-wider text-xs">Outlet Items</span>
                <span className="bg-orange-100 text-orange-700 text-xs font-bold px-2 py-1 rounded">ID: {outletId}</span>
              </div>
              <div className="divide-y divide-gray-50">
                {items.map((item) => (
                  <div key={item.id} className="p-6 flex items-center justify-between hover:bg-gray-50 transition-colors">
                    <div className="space-y-1">
                      <h4 className="font-bold text-gray-900 text-lg">{item.name}</h4>
                      <p className="text-gray-500 font-medium">₹{item.price} × {item.quantity}</p>
                    </div>
                    <div className="flex items-center gap-6">
                      <span className="font-black text-xl text-gray-900">₹{item.price * item.quantity}</span>
                      <button 
                        onClick={() => dispatch(removeFromCart({ outletId: Number(outletId), itemId: item.id }))}
                        className="text-gray-300 hover:text-red-500 transition-colors p-2 hover:bg-red-50 rounded-xl"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                ))}
                </div>
                </div>
                ))}

                <div className="bg-white p-8 rounded-3xl shadow-2xl border border-orange-100 flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="text-center md:text-left">
                <p className="text-gray-500 font-medium">Grand Total</p>
                <p className="text-4xl font-black text-gray-900">₹{totalAmount}</p>
                </div>
            
            {user ? (
              <button 
                onClick={handleCheckout}
                className="w-full md:w-auto px-12 py-4 rounded-2xl font-bold transition-all flex items-center justify-center gap-3 text-lg shadow-xl bg-orange-500 text-white hover:bg-orange-600 active:scale-95"
              >
                <CreditCard className="h-6 w-6" />
                Pay Now
              </button>
            ) : (
              <button 
                onClick={() => navigate('/login')}
                className="w-full md:w-auto px-12 py-4 rounded-2xl font-bold transition-all flex items-center justify-center gap-3 text-lg shadow-xl bg-gray-900 text-white hover:bg-black active:scale-95"
              >
                <LogIn className="h-6 w-6" />
                Login to Checkout
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
