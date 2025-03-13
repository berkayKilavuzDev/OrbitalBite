import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// API'den sepeti çek
export const fetchBasket = createAsyncThunk("cart/fetchBasket", async () => {
  const response = await fetch("/api/basket/");
  return response.json();
});

const initialState = {
  items: [],
  totalPrice: 0,
  status: "idle",
  error: null,
  editingItem: null,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addItem: (state, action) => {
      const { id, name, price, options, quantity } = action.payload;

      // Aynı ürün + seçenekler sepette varsa, sadece miktarı artır
      const existingItem = state.items.find(
        (item) => item.id === id && JSON.stringify(item.options) === JSON.stringify(options)
      );

      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        state.items.push({ id, name, price, options, quantity });
      }

      state.totalPrice = state.items.reduce((total, item) => total + item.price * item.quantity, 0);
    },

    removeItem: (state, action) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
      state.totalPrice = state.items.reduce((total, item) => total + item.price * item.quantity, 0);
    },

    updateItem: (state, action) => {
      const { id, newOptions, newQuantity } = action.payload;

      const itemToUpdate = state.items.find((item) => item.id === id);
      if (itemToUpdate) {
        itemToUpdate.options = newOptions;
        itemToUpdate.quantity = newQuantity;
      }

      state.totalPrice = state.items.reduce((total, item) => total + item.price * item.quantity, 0);
    },

    increaseQuantity: (state, action) => {
      const item = state.items.find((item) => item.id === action.payload);
      if (item) item.quantity += 1;
      state.totalPrice = state.items.reduce((total, item) => total + item.price * item.quantity, 0);
    },

    setEditingItem: (state, action) => {
      state.editingItem = action.payload;
    },

    decreaseQuantity: (state, action) => {
      const item = state.items.find((item) => item.id === action.payload);
      if (item && item.quantity > 1) item.quantity -= 1;
      state.totalPrice = state.items.reduce((total, item) => total + item.price * item.quantity, 0);
    },

    clearCart: (state) => {
      state.items = [];
      state.totalPrice = 0;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchBasket.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchBasket.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload.items;
        state.totalPrice = action.payload.checkout_price;
      })
      .addCase(fetchBasket.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export const {
  addItem,
  removeItem,
  updateItem,
  increaseQuantity,
  decreaseQuantity,
  setEditingItem,
  clearCart,
} = cartSlice.actions;

export default cartSlice.reducer;
