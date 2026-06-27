import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  loginUserApi,
  registerUserApi,
  logoutApi,
  getUserApi,
  updateUserApi
} from '../../utils/burger-api';

import { setCookie, deleteCookie } from '../../utils/cookie';
import { TUser } from '@utils-types';
import { TLoginData, TRegisterData } from '../../utils/burger-api';
import { RootState } from '../store';

type UserState = {
  user: TUser | null;
  isAuthenticated: boolean;
  isAuthChecked: boolean;
  loading: boolean;
  error: string | null;
};

const initialState: UserState = {
  user: null,
  isAuthenticated: false,
  isAuthChecked: false,
  loading: false,
  error: null
};

export const login = createAsyncThunk(
  'user/login',
  async (data: TLoginData, { rejectWithValue }) => {
    const res = await loginUserApi(data);
    if (!res?.success) {
      console.log('USER ERROR', rejectWithValue(res));
      return rejectWithValue(res);
    }

    setCookie('accessToken', res.accessToken);
    localStorage.setItem('refreshToken', res.refreshToken);
    console.log('USER OK', res.user);

    return res.user;
  }
);

export const register = createAsyncThunk(
  'user/register',
  async (data: TRegisterData, { rejectWithValue }) => {
    const res = await registerUserApi(data);
    if (!res?.success) {
      return rejectWithValue(res);
    }

    setCookie('accessToken', res.accessToken);
    localStorage.setItem('refreshToken', res.refreshToken);

    return res.user;
  }
);

export const fetchUser = createAsyncThunk(
  'user/fetchUser',
  async (_, { rejectWithValue }) => {
    const res = await getUserApi();
    if (!res?.success) {
      return rejectWithValue(res);
    }
    return res.user;
  }
);

export const updateUser = createAsyncThunk(
  'user/updateUser',
  async (data: Partial<TRegisterData>, { rejectWithValue }) => {
    const res = await updateUserApi(data);
    if (!res?.success) {
      return rejectWithValue(res);
    }
    return res.user;
  }
);

export const logout = createAsyncThunk(
  'user/logout',
  async (_, { rejectWithValue }) => {
    try {
      await logoutApi();

      deleteCookie('accessToken');
      localStorage.clear();

      return null;
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setAuthChecked(state, action) {
      state.isAuthChecked = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
        state.isAuthChecked = true;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(register.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthenticated = true;
        state.isAuthChecked = true;
      })

      .addCase(fetchUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthenticated = true;
        state.isAuthChecked = true;
      })
      .addCase(fetchUser.rejected, (state) => {
        console.log('fetchUser rejected');
        state.user = null;
        state.isAuthenticated = false;
        state.isAuthChecked = true;
      })

      .addCase(updateUser.fulfilled, (state, action) => {
        state.user = action.payload;
      })

      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.isAuthenticated = false;
        state.isAuthChecked = true;
      });
  }
});

export const selectUser = (state: RootState) => state.user.user;
export const selectIsAuth = (state: RootState) => state.user.isAuthenticated;
export const selectAuthChecked = (state: RootState) => state.user.isAuthChecked;
export const selectUserLoading = (state: RootState) => state.user.loading;
export const selectAuthError = (state: RootState) => state.user.error;
