import { useEffect, useState } from 'react';
import api from '../api/axios';
import { Package, Clock, CheckCircle, Truck, XCircle, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Orders() {
  const [orderItems, setOrderItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await api.get('/orders/purchased');
        setOrderItems(response.data);
      } catch (error) {
        console.error('Failed to fetch orders', error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PENDING': return <Clock className="text-yellow-500" />;
      case 'PREPARING': return <Package className="text-blue-500" />;
      case 'OUT_FOR_DELIVERY': return <Truck className="text-orange-500" />;
      case 'DELIVERED': return <CheckCircle className="text-green-500" />;
      case 'CANCELLED': return <XCircle className="text-red-500" />;
      default: return <Clock />;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8 px-4">
      <h1 className="text-3xl font-bold text-gray-900">Order History</h1>
      
      {orderItems.length === 0 ? (
        <div className="bg-white p-16 rounded-3xl shadow-md text-center space-y-4 border border-gray-100">
          <ShoppingBag className="h-12 w-12 text-gray-300 mx-auto" />
          <p className="text-xl text-gray-500 font-medium">You haven't placed any orders yet.</p>
          <Link to="/" className="inline-block bg-orange-500 text-white px-6 py-2 rounded-xl font-bold hover:bg-orange-600 transition-colors">
            Order Your First Pizza
          </Link>
        </div>
      ) : (
        <div className="grid gap-6">
          {orderItems.map((oi) => (
            <div key={oi.id} className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col sm:flex-row items-center justify-between hover:shadow-md transition-shadow gap-6">
              <div className="flex items-center gap-6">
                <div className="bg-orange-50 p-4 rounded-2xl">
                  <Package className="h-8 w-8 text-orange-400" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-gray-900">{oi.menuItem?.name || 'Unknown Pizza'}</h3>
                  <p className="text-gray-500 text-sm">Ordered on: {new Date(oi.order.orderedAt).toLocaleDateString()}</p>
                  <p className="text-orange-500 font-bold">₹{oi.price} × {oi.quantity}</p>
                  </div>
                  </div>
                  <div className="flex flex-col items-end gap-2 w-full sm:w-auto">
                <div className="flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-full border border-gray-100 w-full sm:w-auto justify-center">
                  {getStatusIcon(oi.order.status)}
                  <span className="font-bold text-sm text-gray-700">{oi.order.status}</span>
                </div>
                <span className="text-xs text-gray-400">Order ID: #{oi.order.id}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
