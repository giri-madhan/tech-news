import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { Article, GuardianResponse } from '../../types/guardian';
import axiosInstance from '../../api/config/axios';

const API_KEY = process.env.REACT_APP_GUARDIAN_API_KEY || '';

export interface ArticlesState {
  items: Article[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  currentPage: number;
  hasMore: boolean;
}

const initialState: ArticlesState = {
  items: [],
  status: 'idle',
  error: null,
  currentPage: 1,
  hasMore: true,
};

export const fetchArticles = createAsyncThunk<GuardianResponse, number>(
  'articles/fetchArticles',
  async (page: number) => {
    const config = {
      method: 'GET',
      url: '/search',
      params: {
        section: 'technology',
        page: page.toString(),
        'api-key': API_KEY,
        'show-fields': 'thumbnail,trailText',
      },
    };

    const response = await axiosInstance(config);
    return response.data;
  }
);

const articlesSlice = createSlice({
  name: 'articles',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchArticles.pending, state => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchArticles.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.error = null;

        if (!action.payload?.response?.results) {
          return;
        }

        if (action.meta.arg === 1) {
          state.items = action.payload.response.results;
        } else {
          state.items = [...state.items, ...action.payload.response.results];
        }

        state.currentPage = action.meta.arg;
        state.hasMore = action.payload.response.results.length > 0;
      })
      .addCase(fetchArticles.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to fetch articles';
      });
  },
});

export default articlesSlice.reducer;
