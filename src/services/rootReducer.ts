import { combineReducers } from '@reduxjs/toolkit';
import { ingredientsSlice } from './slices/ingredientsSlice';
import { constructorSlice } from './slices/constructorSlice';
import { orderSlice } from './slices/orderSlice';
import { feedSlice } from './slices/feedSlice';
import { userSlice } from './slices/userSlice';
import { ordersSlice } from './slices/ordersSlice';

export const rootReducer = combineReducers({
  ingredients: ingredientsSlice.reducer,
  burgerconstructor: constructorSlice.reducer,
  order: orderSlice.reducer,
  orders: ordersSlice.reducer,
  user: userSlice.reducer,
  feed: feedSlice.reducer
});
