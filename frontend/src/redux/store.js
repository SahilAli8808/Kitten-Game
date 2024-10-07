import { configureStore } from '@reduxjs/toolkit';
import leaderboardReducer from './leaderboardSlice';

export const store = configureStore({
  reducer: {
    leaderboard: leaderboardReducer
  }
});

export default store;