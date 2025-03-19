import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// 🛒 Kullanıcının sipariş geçmişini API'den al
export const fetchOrderHistory = createAsyncThunk('orders/fetchHistory', async () => {
  const response = await fetch('/api/order-history/');
  return response.json();
});

// ✅ Yeni sipariş oluşturma
export const submitOrder = createAsyncThunk('orders/submitOrder', async (orderData, { rejectWithValue }) => {
  try {
    const response = await fetch('/api/order/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderData),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Order submission failed.');
    }
    return data;
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

const orderSlice = createSlice({
  name: 'orders',
  initialState: {
    history: [],      // 📌 Sipariş geçmişi
    lastOrder: null,  // 🆕 En son oluşturulan sipariş
    status: 'idle',   // idle | loading | succeeded | failed
    error: null,
  },
  reducers: {
    clearLastOrder: (state) => {
      state.lastOrder = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // 📌 Sipariş geçmişini al
      .addCase(fetchOrderHistory.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchOrderHistory.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.history = action.payload;
      })
      .addCase(fetchOrderHistory.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })

      // ✅ Sipariş oluşturma işlemi
      .addCase(submitOrder.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(submitOrder.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.lastOrder = action.payload; // 🆕 En son siparişi sakla
      })
      .addCase(submitOrder.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export const { clearLastOrder } = orderSlice.actions;
export default orderSlice.reducer;
