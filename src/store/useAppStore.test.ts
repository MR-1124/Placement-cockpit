import { describe, it, expect } from 'vitest';
import { useAppStore } from './useAppStore';
import type { AppContextType } from '../context/AppStateContext';

describe('useAppStore Bridge', () => {
  it('initializes with a null value', () => {
    const state = useAppStore.getState();
    expect(state.value).toBeNull();
  });

  it('allows setting the context value', () => {
    const mockContext = {
      state: { version: 1, xp: 100 }
    } as unknown as AppContextType;
    
    useAppStore.setState({ value: mockContext });
    
    const state = useAppStore.getState();
    expect(state.value).toBeDefined();
    expect(state.value?.state.xp).toBe(100);
  });
});
