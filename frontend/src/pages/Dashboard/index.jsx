import { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Paper,
  useTheme,
} from '@mui/material';
import {
  TrendingUp,
  Assessment,
  CheckCircle,
  Warning,
} from '@mui/icons-material';
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from 'recharts';

// Mock data for charts
const applicationTrends = [
  { month: 'Jan', applications: 45, approved: 32, rejected: 13 },
  { month: 'Feb', applications: 52, approved: 38, rejected: 14 },
  { month: 'Mar', applications: 61, approved: 45, rejected: 16 },
  { month: 'Apr', applications: 58, approved: 41, rejected: 17 },
  { month: 'May', applications: 67, approved: 50, rejected: 17 },
  { month: 'Jun', applications: 73, approved: 55, rejected: 18 },
];

const riskDistribution = [
  { name: 'Low Risk', value: 45, color: '#2e7d32' },
  { name: 'Medium Risk', value: 35, color: '#ed6c02' },
  { name: 'High Risk', value: 20, color: '#d32f2f' },
];

const creditScoreTrends = [
  { month: 'Jan', avgScore: 680 },
  { month: 'Feb', avgScore: 685 },
  { month: 'Mar', avgScore: 692 },
  { month: 'Apr', avgScore: 688 },
  { month: 'May', avgScore: 695 },
  { month: 'Jun', avgScore: 702 },
];

const StatCard = ({ title, value, trend, icon: Icon, color }) => {
  const theme = useTheme();
  
  return (
    <Card
      sx={{
        height: '100%',
        background: theme.palette.mode === 'dark'
          ? 'linear-gradient(135deg, rgba(25, 118, 210, 0.1) 0%, rgba(156, 39, 176, 0.05) 100%)'
          : 'linear-gradient(135deg, rgba(25, 118, 210, 0.05) 0%, rgba(156, 39, 176, 0.02) 100%)',
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: theme.shadows[8],
        },
      }}
    >
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="flex-start">
          <Box>
            <Typography color="text.secondary" variant="body2" gutterBottom>
              {title}
            </Typography>
            <Typography variant="h4" fontWeight="bold" sx={{ mb: 1 }}>
              {value}
            </Typography>
            <Typography
              variant="body2"
              color={trend >= 0 ? 'success.main' : 'error.main'}
              sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}
            >
              {trend >= 0 ? '↑' : '↓'} {Math.abs(trend)}% from last month
            </Typography>
          </Box>
          <Box
            sx={{
              backgroundColor: `${color}15`,
              borderRadius: 2,
              p: 1.5,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Icon sx={{ fontSize: 32, color }} />
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

const Dashboard = () => {
  const theme = useTheme();
  const [stats, setStats] = useState({
    totalApplications: 356,
    approvalRate: 75.3,
    avgCreditScore: 695,
    pendingReviews: 23,
  });

  return (
    <Box sx={{ p: 3 }}>
      {/* Page Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          Dashboard
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Overview of credit scoring platform analytics
        </Typography>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Applications"
            value={stats.totalApplications}
            trend={12.5}
            icon={Assessment}
            color={theme.palette.primary.main}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Approval Rate"
            value={`${stats.approvalRate}%`}
            trend={3.2}
            icon={CheckCircle}
            color={theme.palette.success.main}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Avg Credit Score"
            value={stats.avgCreditScore}
            trend={1.8}
            icon={TrendingUp}
            color={theme.palette.info.main}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Pending Reviews"
            value={stats.pendingReviews}
            trend={-5.4}
            icon={Warning}
            color={theme.palette.warning.main}
          />
        </Grid>
      </Grid>

      {/* Charts */}
      <Grid container spacing={3}>
        {/* Application Trends */}
        <Grid item xs={12} lg={8}>
          <Paper sx={{ p: 3, height: 400 }}>
            <Typography variant="h6" fontWeight="600" gutterBottom>
              Application Trends
            </Typography>
            <ResponsiveContainer width="100%" height="90%">
              <BarChart data={applicationTrends}>
                <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} />
                <XAxis dataKey="month" stroke={theme.palette.text.secondary} />
                <YAxis stroke={theme.palette.text.secondary} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: theme.palette.background.paper,
                    border: `1px solid ${theme.palette.divider}`,
                    borderRadius: 8,
                  }}
                />
                <Legend />
                <Bar dataKey="approved" fill={theme.palette.success.main} name="Approved" />
                <Bar dataKey="rejected" fill={theme.palette.error.main} name="Rejected" />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Risk Distribution */}
        <Grid item xs={12} lg={4}>
          <Paper sx={{ p: 3, height: 400 }}>
            <Typography variant="h6" fontWeight="600" gutterBottom>
              Risk Distribution
            </Typography>
            <ResponsiveContainer width="100%" height="90%">
              <PieChart>
                <Pie
                  data={riskDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {riskDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Credit Score Trends */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3, height: 350 }}>
            <Typography variant="h6" fontWeight="600" gutterBottom>
              Average Credit Score Trends
            </Typography>
            <ResponsiveContainer width="100%" height="90%">
              <LineChart data={creditScoreTrends}>
                <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} />
                <XAxis dataKey="month" stroke={theme.palette.text.secondary} />
                <YAxis domain={[650, 750]} stroke={theme.palette.text.secondary} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: theme.palette.background.paper,
                    border: `1px solid ${theme.palette.divider}`,
                    borderRadius: 8,
                  }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="avgScore"
                  stroke={theme.palette.primary.main}
                  strokeWidth={3}
                  name="Average Score"
                  dot={{ fill: theme.palette.primary.main, r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;