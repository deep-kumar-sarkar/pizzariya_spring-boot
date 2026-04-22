import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import { Star, MessageSquare, Package, User as UserIcon } from 'lucide-react';
import { useSelector } from 'react-redux';
import type { RootState } from '../store';

export default function Review() {
  const { user } = useSelector((state: RootState) => state.auth);
  const [purchasedItems, setPurchasedItems] = useState<any[]>([]);
  const [selectedItem, setSelectedItem] = useState<number | null>(null);
  const [existingReviews, setExistingReviews] = useState<any[]>([]);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchPurchased = async () => {
      try {
        const response = await api.get('/orders/purchased');
        const uniqueItems = Array.from(new Map(response.data.map((item: any) => [item.menuItem.id, item.menuItem])).values());
        setPurchasedItems(uniqueItems);
      } catch (error) {
        console.error('Failed to fetch purchased items', error);
      }
    };
    fetchPurchased();
  }, []);

  useEffect(() => {
    const fetchReviews = async () => {
      if (!selectedItem) return;
      try {
        const response = await api.get(`/reviews?menuItemId=${selectedItem}`);
        setExistingReviews(response.data);
      } catch (error) {
        console.error('Failed to fetch reviews', error);
      }
    };
    fetchReviews();
  }, [selectedItem]);

  const hasUserReviewed = existingReviews.some(r => r.user.email === user?.email);

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedItem || hasUserReviewed) return;
    setLoading(true);
    try {
      await api.post('/reviews', { menuItemId: selectedItem, rating, comment });
      alert('Review submitted! Thank you for your feedback.');
      setComment('');
      // Refresh reviews
      const response = await api.get(`/reviews?menuItemId=${selectedItem}`);
      setExistingReviews(response.data);
    } catch (error: any) {
      alert(error.response?.data || 'Failed to submit review');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 px-4 pb-12">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900">Review Your Pizza</h1>
        <p className="text-gray-500 mt-2">Share your thoughts on the pizzas you've enjoyed.</p>
      </div>

      {purchasedItems.length === 0 ? (
        <div className="bg-white p-16 rounded-3xl shadow-md text-center border border-gray-100">
          <Package className="h-16 w-16 text-gray-200 mx-auto mb-4" />
          <p className="text-xl text-gray-500 font-medium">No purchased items found.</p>
          <p className="text-gray-400">Order something delicious to leave a review!</p>
        </div>
      ) : (
        <div className="grid gap-8">
          <div className="bg-white p-6 rounded-3xl shadow-lg border border-gray-100">
            <label className="block text-sm font-black text-gray-700 mb-4 uppercase tracking-wider">Select a Pizza to Review</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {purchasedItems.map((item: any) => (
                <div 
                  key={item.id}
                  onClick={() => setSelectedItem(item.id)}
                  className={`cursor-pointer p-5 rounded-2xl border-2 transition-all group ${
                    selectedItem === item.id ? 'border-orange-500 bg-orange-50 shadow-md' : 'border-gray-50 hover:border-orange-200 hover:bg-gray-50'
                  }`}
                >
                  <p className="font-bold text-gray-900 group-hover:text-orange-600 transition-colors">{item.name}</p>
                  <p className="text-xs text-gray-500 font-medium">{item.cuisineType}</p>
                </div>
              ))}
            </div>
          </div>

          {selectedItem && (
            <div className="space-y-8 animate-in fade-in duration-500">
              {/* Existing Reviews Section */}
              <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100">
                <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <MessageSquare className="h-5 w-5 text-orange-500" />
                  What others say
                </h3>
                
                {existingReviews.length === 0 ? (
                  <p className="text-gray-400 italic text-center py-4 border-2 border-dashed border-gray-100 rounded-2xl">No reviews yet for this pizza. Be the first!</p>
                ) : (
                  <div className="space-y-4">
                    {existingReviews.map((r: any) => (
                      <div key={r.id} className={`p-5 rounded-2xl border ${r.user.email === user?.email ? 'bg-orange-50 border-orange-100' : 'bg-gray-50 border-gray-100'}`}>
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex items-center gap-2">
                            <div className="bg-white p-1.5 rounded-full shadow-sm">
                              <UserIcon className="h-4 w-4 text-gray-400" />
                            </div>
                            <span className="font-bold text-gray-800 text-sm">{r.user.name} {r.user.email === user?.email && "(You)"}</span>
                          </div>
                          <div className="flex gap-0.5">
                            {[1, 2, 3, 4, 5].map(s => (
                              <Star key={s} className={`h-4 w-4 ${s <= r.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200'}`} />
                            ))}
                          </div>
                        </div>
                        <p className="text-gray-600 text-sm leading-relaxed">{r.comment}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Submission Form (Only if user hasn't reviewed) */}
              {!hasUserReviewed ? (
                <div className="bg-white p-8 rounded-3xl shadow-2xl border-2 border-orange-100 relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-4 opacity-5">
                    <Star className="h-24 w-24 text-orange-500 fill-orange-500" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-8">Your Experience</h3>
                  <form onSubmit={handleSubmitReview} className="space-y-6">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-4 text-center">How would you rate it?</label>
                      <div className="flex justify-center gap-3">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star 
                            key={star}
                            onClick={() => setRating(star)}
                            className={`h-10 w-10 cursor-pointer transition-all hover:scale-110 active:scale-95 ${
                              star <= rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200'
                            }`}
                          />
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2 font-medium">Detailed Feedback</label>
                      <textarea
                        className="w-full px-5 py-4 rounded-2xl border-2 border-gray-100 focus:border-orange-500 focus:ring-0 focus:outline-none min-h-[140px] transition-colors bg-gray-50 focus:bg-white"
                        placeholder="Tell us about the crust, toppings, and delivery..."
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        required
                      />
                    </div>

                    <button 
                      type="submit"
                      disabled={loading}
                      className="w-full bg-orange-500 text-white py-4 rounded-2xl font-black text-lg hover:bg-orange-600 transition-all flex items-center justify-center gap-3 shadow-xl active:scale-95 disabled:opacity-50"
                    >
                      {loading ? "Submitting..." : (
                        <>
                          <MessageSquare className="h-6 w-6" />
                          Post Review
                        </>
                      )}
                    </button>
                  </form>
                </div>
              ) : (
                <div className="bg-green-50 border-2 border-green-100 p-8 rounded-3xl text-center space-y-2 shadow-sm">
                  <div className="bg-green-500 w-12 h-12 rounded-full flex items-center justify-center mx-auto text-white mb-2">
                    <Star className="h-6 w-6 fill-white" />
                  </div>
                  <h4 className="text-xl font-bold text-green-800">Review Submitted!</h4>
                  <p className="text-green-600 font-medium">You have already shared your thoughts on this pizza. Thank you!</p>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
