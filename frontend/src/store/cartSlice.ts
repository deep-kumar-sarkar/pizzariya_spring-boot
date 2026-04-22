import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
}

interface CartState {
  itemsByOutlet: { [outletId: number]: CartItem[] };
}

const initialState: CartState = {
  itemsByOutlet: {},
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart(state, action: PayloadAction<{ outletId: number; item: CartItem }>) {
      const { outletId, item } = action.payload;
      if (!state.itemsByOutlet[outletId]) {
        state.itemsByOutlet[outletId] = [];
      }
      const existing = state.itemsByOutlet[outletId].find(i => i.id === item.id);
      if (existing) {
        existing.quantity += item.quantity;
      } else {
        state.itemsByOutlet[outletId].push(item);
      }
    },
    removeFromCart(state, action: PayloadAction<{ outletId: number; itemId: number }>) {
      const { outletId, itemId } = action.payload;
      if (state.itemsByOutlet[outletId]) {
        state.itemsByOutlet[outletId] = state.itemsByOutlet[outletId].filter(i => i.id !== itemId);
        if (state.itemsByOutlet[outletId].length === 0) {
          delete state.itemsByOutlet[outletId];
        }
      }
    },
    clearCart(state) {
      state.itemsByOutlet = {};
    },
  },
});

export const { addToCart, removeFromCart, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
