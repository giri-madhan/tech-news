import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { getArticleById } from '../../api/services/newsService';
import { Article } from '../../types/guardian';

export interface ArticleDetailState {
  article: Article | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: ArticleDetailState = {
  article: null,
  status: 'idle',
  error: null,
};

export const fetchArticleById = createAsyncThunk(
  'articleDetail/fetchArticleById',
  async (id: string) => {
    const article = await getArticleById(id);
    return article;
  }
);

export const setCurrentArticle = createAsyncThunk(
  'articleDetail/setCurrentArticle',
  async (article: Article) => article
);

const articleDetailSlice = createSlice({
  name: 'articleDetail',
  initialState,
  reducers: {
    clearArticle: state => {
      state.article = null;
      state.status = 'idle';
      state.error = null;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(setCurrentArticle.pending, state => {
        state.status = 'loading';
      })
      .addCase(setCurrentArticle.fulfilled, (state, action: PayloadAction<Article>) => {
        state.status = 'succeeded';
        state.article = action.payload;
      })
      .addCase(setCurrentArticle.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to set article';
      })
      .addCase(fetchArticleById.pending, state => {
        state.status = 'loading';
      })
      .addCase(fetchArticleById.fulfilled, (state, action: PayloadAction<Article>) => {
        state.status = 'succeeded';
        state.article = action.payload;
      })
      .addCase(fetchArticleById.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to fetch article';
      });
  },
});

export const { clearArticle } = articleDetailSlice.actions;
export default articleDetailSlice.reducer;
