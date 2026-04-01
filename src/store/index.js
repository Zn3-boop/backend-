import { configureStore } from '@reduxjs/toolkit';
import userReducer from './slices/userSlice';
import uiReducer from './slices/uiSlice';

// 从localStorage恢复用户信息
const loadState = () => {
  try {
    const serializedState = localStorage.getItem('reduxState');
    if (serializedState === null) {
      return undefined;
    }
    return JSON.parse(serializedState);
  } catch (err) {
    return undefined;
  }
};

// 保存状态到localStorage
const saveState = (state) => {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem('reduxState', serializedState);
  } catch (err) {
    // Ignore write errors
  }
};

const preloadedState = loadState();

export const store = configureStore({
  reducer: {
    user: userReducer,
    ui: uiReducer,
  },
  preloadedState,
});

// 订阅store变化，保存到localStorage
store.subscribe(() => {
  saveState({
    user: store.getState().user,
  });
});

// TypeScript types removed for JavaScript project
