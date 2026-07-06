import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getFeedsApi } from '../../utils/burger-api';
import { TOrdersData } from '@utils-types';
import { RootState } from '../store';

type FeedState = {
  data: TOrdersData | null;
  loading: boolean;
  error: string | null;
};

const initialState: FeedState = {
  data: null,
  loading: false,
  error: null
};

export const fetchFeeds = createAsyncThunk('feed/fetchFeeds', async () => {
  const response = await getFeedsApi();

  return response;
});

export const feedSlice = createSlice({
  name: 'feed',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFeeds.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFeeds.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchFeeds.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  }
});

export const selectFeedOrders = (state: RootState) =>
  state.feed.data?.orders || [];

export const selectFeedTotal = (state: RootState) =>
  state.feed.data?.total || 0;

export const selectFeedTotalToday = (state: RootState) =>
  state.feed.data?.totalToday || 0;

export const selectFeedLoading = (state: RootState) => state.feed.loading;

export const selectFeedError = (state: RootState) => state.feed.error;

export default feedSlice.reducer;
