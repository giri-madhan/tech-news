import '@testing-library/jest-dom';
import { RenderResult } from '@testing-library/react';
import { Store } from '@reduxjs/toolkit';
import { RootState } from '../redux/store';

export interface RenderWithProvidersResult extends RenderResult {
  store: Store<RootState>;
}
