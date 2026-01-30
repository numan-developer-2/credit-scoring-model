import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  applications: [],
  selectedApplication: null,
  filters: {
    status: 'all',
    riskLevel: 'all',
    dateRange: 'all',
  },
  loading: false,
  error: null,
  pagination: {
    page: 1,
    pageSize: 25,
    total: 0,
  },
};

const applicationSlice = createSlice({
  name: 'applications',
  initialState,
  reducers: {
    setApplications: (state, action) => {
      state.applications = action.payload;
    },
    addApplication: (state, action) => {
      state.applications.unshift(action.payload);
    },
    updateApplication: (state, action) => {
      const index = state.applications.findIndex(app => app.id === action.payload.id);
      if (index !== -1) {
        state.applications[index] = { ...state.applications[index], ...action.payload };
      }
    },
    setSelectedApplication: (state, action) => {
      state.selectedApplication = action.payload;
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    setPagination: (state, action) => {
      state.pagination = { ...state.pagination, ...action.payload };
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const {
  setApplications,
  addApplication,
  updateApplication,
  setSelectedApplication,
  setFilters,
  setPagination,
  setLoading,
  setError,
} = applicationSlice.actions;

export default applicationSlice.reducer;