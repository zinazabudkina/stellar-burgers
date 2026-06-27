import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { orderBurgerApi, getOrderByNumberApi } from '../../utils/burger-api';
import { TOrder } from '@utils-types';
import { RootState } from '../store';

export const createOrder = createAsyncThunk(
  'order/createOrder',
  async (ingredients: string[]) => {
    const response = await orderBurgerApi(ingredients);

    return {
      ...response,
      ingredients
    };
  }
);

export const fetchOrderByNumber = createAsyncThunk(
  'order/fetchByNumber',
  async (number: number) => {
    const response = await getOrderByNumberApi(number);

    return response.orders[0];
  }
);

type OrderState = {
  order: TOrder | null;
  currentOrder: TOrder | null;
  name: string | null;
  loading: boolean;
  error: string | null;
};

const initialState: OrderState = {
  order: null,
  currentOrder: null,
  name: null,
  loading: false,
  error: null
};

export const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    clearOrder(state) {
      state.order = null;
      state.name = null;
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.loading = false;

        // приводим к TOrder
        state.order = {
          ...action.payload.order,
          ingredients: action.payload.ingredients
        };
        state.name = action.payload.name;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchOrderByNumber.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrderByNumber.fulfilled, (state, action) => {
        state.loading = false;
        state.currentOrder = action.payload;
      })
      .addCase(fetchOrderByNumber.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  }
});

export const selectOrder = (state: RootState) => state.order.order;
export const selectCurrentOrder = (state: RootState) =>
  state.order.currentOrder;
export const selectOrderName = (state: RootState) => state.order.name;
export const selectOrderLoading = (state: RootState) => state.order.loading;
export const selectOrderError = (state: RootState) => state.order.error;

export const { clearOrder } = orderSlice.actions;
export default orderSlice.reducer;
