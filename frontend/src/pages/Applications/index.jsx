import { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Chip,
  IconButton,
  TextField,
  InputAdornment,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Button,
  useTheme,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  Divider,
} from '@mui/material';
import {
  Search,
  Visibility,
  FileDownload,
  Close,
} from '@mui/icons-material';
import { useQuery } from 'react-query';
import api from '../../services/api';
import { format } from 'date-fns';

const Applications = () => {
  const theme = useTheme();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [riskFilter, setRiskFilter] = useState('all');
  const [selectedApp, setSelectedApp] = useState(null);
  const [detailsOpen, setDetailsOpen] = useState(false);

  // Fetch applications from API
  const { data: applications = [], isLoading, error, refetch } = useQuery(
    'applications',
    async () => {
      try {
        const response = await api.get('/applications/');
        return response.data || [];
      } catch (err) {
        console.error('Failed to fetch applications:', err);
        // If it's a 401, the interceptor will handle redirect
        // For other errors, throw to show error state
        if (err.response?.status !== 401) {
          throw err;
        }
        return [];
      }
    },
    {
      retry: 1, // Only retry once
      refetchOnWindowFocus: false, // Don't refetch on window focus
      refetchInterval: false, // Disable auto-refresh for now
      staleTime: 10000, // Consider data fresh for 10 seconds
      onError: (err) => {
        console.error('Applications query error:', err);
      }
    }
  );

  // Debug logging
  useEffect(() => {
    console.log('Applications State:', {
      isLoading,
      hasError: !!error,
      dataCount: applications?.length || 0,
      applications: applications
    });
  }, [isLoading, error, applications]);

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'approved': return 'success';
      case 'rejected': return 'error';
      case 'pending': return 'warning';
      default: return 'default';
    }
  };

  const getRiskColor = (risk) => {
    switch (risk?.toLowerCase()) {
      case 'low': return 'success';
      case 'medium': return 'warning';
      case 'high': return 'error';
      default: return 'default';
    }
  };

  const filteredApplications = applications.filter(app => {
    const matchesSearch = app.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         app.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || app.status?.toLowerCase() === statusFilter.toLowerCase();
    const matchesRisk = riskFilter === 'all' || app.risk_level?.toLowerCase() === riskFilter.toLowerCase();
    return matchesSearch && matchesStatus && matchesRisk;
  });

  const handleViewDetails = (app) => {
    setSelectedApp(app);
    setDetailsOpen(true);
  };

  const handleExport = () => {
    // Export to CSV
    const csvContent = [
      ['ID', 'Name', 'Email', 'Credit Score', 'Risk Level', 'Status', 'Model', 'Date'],
      ...filteredApplications.map(app => [
        app.id,
        app.full_name,
        app.email,
        app.credit_score,
        app.risk_level,
        app.status,
        app.model_version,
        format(new Date(app.created_at), 'yyyy-MM-dd HH:mm')
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `applications_${format(new Date(), 'yyyy-MM-dd')}.csv`;
    a.click();
  };

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert 
          severity="error"
          action={
            <Button color="inherit" size="small" onClick={() => refetch()}>
              Retry
            </Button>
          }
        >
          Failed to load applications. {error?.response?.data?.detail || error.message || 'Please try again.'}
        </Alert>
      </Box>
    );
  }

  // Check if no applications
  if (!isLoading && (!applications || applications.length === 0)) {
    return (
      <Box sx={{ p: 3 }}>
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No Applications Found
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Submit a credit application from the Credit Scoring page to see results here.
          </Typography>
          <Button variant="contained" onClick={() => window.location.href = '/app/scoring'}>
            Create Application
          </Button>
        </Paper>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          Applications
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Manage and review credit applications
        </Typography>
      </Box>

      <Paper sx={{ p: 3 }}>
        {/* Filters */}
        <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
          <TextField
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
            }}
            sx={{ flexGrow: 1, minWidth: 250 }}
          />
          
          <FormControl sx={{ minWidth: 150 }}>
            <InputLabel>Status</InputLabel>
            <Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              label="Status"
            >
              <MenuItem value="all">All Status</MenuItem>
              <MenuItem value="approved">Approved</MenuItem>
              <MenuItem value="pending">Pending</MenuItem>
              <MenuItem value="rejected">Rejected</MenuItem>
            </Select>
          </FormControl>
          
          <FormControl sx={{ minWidth: 150 }}>
            <InputLabel>Risk Level</InputLabel>
            <Select
              value={riskFilter}
              onChange={(e) => setRiskFilter(e.target.value)}
              label="Risk Level"
            >
              <MenuItem value="all">All Risks</MenuItem>
              <MenuItem value="low">Low</MenuItem>
              <MenuItem value="medium">Medium</MenuItem>
              <MenuItem value="high">High</MenuItem>
            </Select>
          </FormControl>
          
          <Button variant="outlined" startIcon={<FileDownload />} onClick={handleExport}>
            Export
          </Button>
        </Box>

        {/* Table */}
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><strong>ID</strong></TableCell>
                <TableCell><strong>Name</strong></TableCell>
                <TableCell><strong>Email</strong></TableCell>
                <TableCell><strong>Credit Score</strong></TableCell>
                <TableCell><strong>Risk Level</strong></TableCell>
                <TableCell><strong>Status</strong></TableCell>
                <TableCell><strong>Date</strong></TableCell>
                <TableCell><strong>Actions</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredApplications
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((app) => (
                  <TableRow key={app.id} hover>
                    <TableCell>{app.id}</TableCell>
                    <TableCell>{app.full_name}</TableCell>
                    <TableCell>{app.email}</TableCell>
                    <TableCell>
                      <Typography fontWeight="600" color="primary.main">
                        {app.credit_score || 'N/A'}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      {app.risk_level ? (
                        <Chip label={app.risk_level} color={getRiskColor(app.risk_level)} size="small" />
                      ) : (
                        <Typography variant="body2" color="text.secondary">N/A</Typography>
                      )}
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={app.status || 'pending'} 
                        color={getStatusColor(app.status)} 
                        size="small" 
                      />
                    </TableCell>
                    <TableCell>
                      {app.created_at ? format(new Date(app.created_at), 'MMM dd, yyyy HH:mm') : 'N/A'}
                    </TableCell>
                    <TableCell>
                      <IconButton size="small" color="primary" onClick={() => handleViewDetails(app)}>
                        <Visibility />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              {filteredApplications.length === 0 && (
                <TableRow>
                  <TableCell colSpan={8} align="center">
                    <Typography variant="body2" color="text.secondary" py={3}>
                      No applications found
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          component="div"
          count={filteredApplications.length}
          page={page}
          onPageChange={(e, newPage) => setPage(newPage)}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={(e) => {
            setRowsPerPage(parseInt(e.target.value, 10));
            setPage(0);
          }}
        />
      </Paper>

      {/* Details Dialog */}
      <Dialog open={detailsOpen} onClose={() => setDetailsOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6">Application Details</Typography>
            <IconButton onClick={() => setDetailsOpen(false)}>
              <Close />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent dividers>
          {selectedApp && (
            <Grid container spacing={3}>
              {/* Personal Information */}
              <Grid item xs={12}>
                <Typography variant="subtitle1" fontWeight="600" gutterBottom>
                  Personal Information
                </Typography>
                <Divider sx={{ mb: 2 }} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="text.secondary">Full Name</Typography>
                <Typography variant="body1">{selectedApp.full_name}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="text.secondary">Email</Typography>
                <Typography variant="body1">{selectedApp.email}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="text.secondary">Phone</Typography>
                <Typography variant="body1">{selectedApp.phone_number || 'N/A'}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="text.secondary">Age</Typography>
                <Typography variant="body1">{selectedApp.age}</Typography>
              </Grid>

              {/* Financial Information */}
              <Grid item xs={12}>
                <Typography variant="subtitle1" fontWeight="600" gutterBottom sx={{ mt: 2 }}>
                  Financial Information
                </Typography>
                <Divider sx={{ mb: 2 }} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="text.secondary">Annual Income</Typography>
                <Typography variant="body1">${selectedApp.annual_income?.toLocaleString()}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="text.secondary">Monthly Debt</Typography>
                <Typography variant="body1">${selectedApp.monthly_debt?.toLocaleString()}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="text.secondary">Loan Amount</Typography>
                <Typography variant="body1">${selectedApp.loan_amount?.toLocaleString()}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="text.secondary">Loan Purpose</Typography>
                <Typography variant="body1">{selectedApp.loan_purpose}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="text.secondary">Employment Status</Typography>
                <Typography variant="body1">{selectedApp.employment_status}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="text.secondary">Years Employed</Typography>
                <Typography variant="body1">{selectedApp.years_employed}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="text.secondary">Existing Credits</Typography>
                <Typography variant="body1">{selectedApp.existing_credits || 0}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="text.secondary">Dependents</Typography>
                <Typography variant="body1">{selectedApp.dependents || 0}</Typography>
              </Grid>

              {/* Credit Scoring Results */}
              <Grid item xs={12}>
                <Typography variant="subtitle1" fontWeight="600" gutterBottom sx={{ mt: 2 }}>
                  Credit Scoring Results
                </Typography>
                <Divider sx={{ mb: 2 }} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="text.secondary">Credit Score</Typography>
                <Typography variant="h4" color="primary.main" fontWeight="bold">
                  {selectedApp.credit_score || 'N/A'}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="text.secondary">Risk Level</Typography>
                <Box sx={{ mt: 1 }}>
                  <Chip 
                    label={selectedApp.risk_level || 'N/A'} 
                    color={getRiskColor(selectedApp.risk_level)} 
                  />
                </Box>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="text.secondary">Approval Probability</Typography>
                <Typography variant="body1">
                  {selectedApp.approval_probability 
                    ? `${(selectedApp.approval_probability * 100).toFixed(1)}%` 
                    : 'N/A'}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="text.secondary">Status</Typography>
                <Box sx={{ mt: 1 }}>
                  <Chip 
                    label={selectedApp.status || 'pending'} 
                    color={getStatusColor(selectedApp.status)} 
                  />
                </Box>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="body2" color="text.secondary">Model Version</Typography>
                <Typography variant="body1">{selectedApp.model_version || 'N/A'}</Typography>
              </Grid>
              {selectedApp.risk_factors && selectedApp.risk_factors.length > 0 && (
                <Grid item xs={12}>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Risk Factors
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {selectedApp.risk_factors.map((factor, index) => (
                      <Chip key={index} label={factor} color="warning" size="small" variant="outlined" />
                    ))}
                  </Box>
                </Grid>
              )}
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDetailsOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Applications;