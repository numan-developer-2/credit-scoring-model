import { useState } from 'react';
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
} from '@mui/material';
import {
  Search,
  Visibility,
  FileDownload,
  FilterList,
} from '@mui/icons-material';

// Mock data
const mockApplications = [
  { id: 1, name: 'John Doe', email: 'john@example.com', score: 720, risk: 'Low', status: 'Approved', date: '2024-01-15' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', score: 650, risk: 'Medium', status: 'Pending', date: '2024-01-14' },
  { id: 3, name: 'Bob Johnson', email: 'bob@example.com', score: 580, risk: 'High', status: 'Rejected', date: '2024-01-13' },
  { id: 4, name: 'Alice Williams', email: 'alice@example.com', score: 740, risk: 'Low', status: 'Approved', date: '2024-01-12' },
  { id: 5, name: 'Charlie Brown', email: 'charlie@example.com', score: 620, risk: 'Medium', status: 'Pending', date: '2024-01-11' },
];

const Applications = () => {
  const theme = useTheme();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [riskFilter, setRiskFilter] = useState('all');

  const getStatusColor = (status) => {
    switch (status) {
      case 'Approved': return 'success';
      case 'Rejected': return 'error';
      case 'Pending': return 'warning';
      default: return 'default';
    }
  };

  const getRiskColor = (risk) => {
    switch (risk) {
      case 'Low': return 'success';
      case 'Medium': return 'warning';
      case 'High': return 'error';
      default: return 'default';
    }
  };

  const filteredApplications = mockApplications.filter(app => {
    const matchesSearch = app.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         app.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || app.status === statusFilter;
    const matchesRisk = riskFilter === 'all' || app.risk === riskFilter;
    return matchesSearch && matchesStatus && matchesRisk;
  });

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
              <MenuItem value="Approved">Approved</MenuItem>
              <MenuItem value="Pending">Pending</MenuItem>
              <MenuItem value="Rejected">Rejected</MenuItem>
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
              <MenuItem value="Low">Low</MenuItem>
              <MenuItem value="Medium">Medium</MenuItem>
              <MenuItem value="High">High</MenuItem>
            </Select>
          </FormControl>
          
          <Button variant="outlined" startIcon={<FileDownload />}>
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
                    <TableCell>{app.name}</TableCell>
                    <TableCell>{app.email}</TableCell>
                    <TableCell>
                      <Typography fontWeight="600" color="primary.main">
                        {app.score}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip label={app.risk} color={getRiskColor(app.risk)} size="small" />
                    </TableCell>
                    <TableCell>
                      <Chip label={app.status} color={getStatusColor(app.status)} size="small" />
                    </TableCell>
                    <TableCell>{app.date}</TableCell>
                    <TableCell>
                      <IconButton size="small" color="primary">
                        <Visibility />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
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
    </Box>
  );
};

export default Applications;