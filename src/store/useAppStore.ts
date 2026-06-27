import { create } from 'zustand';
import type { AppContextType } from '../context/AppStateContext';

export const useAppStore = create<{
  value: AppContextType | null;
}>(() => ({
  value: null
}));
