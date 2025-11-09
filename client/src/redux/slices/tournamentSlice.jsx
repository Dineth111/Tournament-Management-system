import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Initial state
const initialState = {
  tournaments: [],
  tournament: null,
  isLoading: false,
  error: null,
};

// Async thunks
export const getTournaments = createAsyncThunk(
  'tournaments/getTournaments',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/tournaments`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to get tournaments');
    }
  }
);

export const getTournamentById = createAsyncThunk(
  'tournaments/getTournamentById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/tournaments/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to get tournament');
    }
  }
);

// Tournament slice
const tournamentSlice = createSlice({
  name: 'tournaments',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get all tournaments
      .addCase(getTournaments.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getTournaments.fulfilled, (state, action) => {
        state.isLoading = false;
        state.tournaments = action.payload.tournaments;
      })
      .addCase(getTournaments.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Get tournament by ID
      .addCase(getTournamentById.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getTournamentById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.tournament = action.payload.tournament;
      })
      .addCase(getTournamentById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError } = tournamentSlice.actions;
export default tournamentSlice.reducer;
