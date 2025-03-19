import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Kullanıcı bilgilerini API'den al (async action)
export const fetchUser = createAsyncThunk('user/fetchUser', async () => {
  const response = await fetch('/api/user/');
  return response.json();
});

// Kullanıcı giriş yapma (login)
export const loginUser = createAsyncThunk('user/loginUser', async (credentials, { rejectWithValue }) => {
  try {
    const response = await fetch('/api/login/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "Login failed.");
    }
    return data; // Backend'den gelen kullanıcı verisi
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

// Kullanıcı çıkış yapma (logout)
export const logoutUser = createAsyncThunk('user/logoutUser', async () => {
  await fetch('/api/logout/', { method: 'POST' });
  return null; // Redux state'ini sıfırlamak için null dönüyoruz
});

// Kullanıcı kaydı (signup)
export const signupUser = createAsyncThunk('user/signupUser', async (userData, { rejectWithValue }) => {
  try {
    const response = await fetch('/api/signup/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "Signup failed.");
    }
    return data; // Backend yeni kullanıcıyı döndürmeli
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

// Kullanıcı bilgilerini güncelleme (Update User Details)
export const updateUserDetails = createAsyncThunk('user/updateDetails', async (updatedData, { rejectWithValue }) => {
  try {
    const response = await fetch('/api/update-user/', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedData),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "Update failed.");
    }
    return data; // Güncellenmiş kullanıcı bilgileri dönmeli
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

// Kullanıcı şifre değiştirme (Change Password)
export const changePassword = createAsyncThunk('user/changePassword', async (passwordData, { rejectWithValue }) => {
  try {
    const response = await fetch('/api/change-password/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(passwordData),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "Password change failed.");
    }
    return data; // Backend başarılı mesaj döndürmeli
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

const userSlice = createSlice({
  name: 'user',
  initialState: {
    user: null,
    status: 'idle', // idle | loading | succeeded | failed
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUser.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload;
      })
      .addCase(fetchUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(loginUser.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload; // Kullanıcı bilgilerini güncelle
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload; // Hata mesajını kaydet
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null; // Kullanıcı çıkış yaptı, state sıfırlanıyor
        state.status = 'idle';
      })
      .addCase(signupUser.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(signupUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload.user; // Backend yeni kullanıcıyı döndürmeli
      })
      .addCase(signupUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(updateUserDetails.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(updateUserDetails.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = { ...state.user, ...action.payload }; // Güncellenen bilgileri state'e ekle
      })
      .addCase(updateUserDetails.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(changePassword.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(changePassword.fulfilled, (state) => {
        state.status = 'succeeded';
      })
      .addCase(changePassword.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export default userSlice.reducer;
