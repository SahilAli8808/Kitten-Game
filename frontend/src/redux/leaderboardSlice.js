import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000';

export const fetchLeaderboard = createAsyncThunk(
  'leaderboard/fetchLeaderboard',
  async () => {
    const response = await axios.get(`${API_BASE_URL}/leader-board`);
    return response.data.map((entry, index) => ({
      rank: index + 1,
      username: entry.userName,
      score: entry.userScore
    }));
  }
);

const leaderboardSlice = createSlice({
  name: 'leaderboard',
  initialState: {
    data: [],
    status: 'idle',
    error: null
  },
  reducers: {
    updateLeaderboard: (state, action) => {
      state.data = action.payload.map((entry, index) => ({
        rank: index + 1,
        username: entry.userName,
        score: entry.userScore
      }));
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchLeaderboard.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchLeaderboard.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.data = action.payload;
      })
      .addCase(fetchLeaderboard.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  }
});

export const { updateLeaderboard } = leaderboardSlice.actions;
export default leaderboardSlice.reducer;
