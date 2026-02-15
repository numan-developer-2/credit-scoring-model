import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  CircularProgress,
  Alert,
  useTheme,
  Card,
  CardContent,
} from '@mui/material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  ZAxis,
  Cell,
  PieChart,
  Pie,
} from 'recharts';
import analyticsService from '../../services/analyticsService';
import api from '../../services/api';

const Analytics = () => {
  const theme = useTheme();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({
    stats: {},
    incomeVsScore: [],
    purposeDistribution: [],
  });

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [statsData, appsResponse] = await Promise.all([
          analyticsService.getDashboardStats(),
          api.get('/applications/?limit=100')
        ]);

        const apps = appsResponse.data;

        // Process data for charts
        // Income vs Score Scatter
        const incomeVsScore = apps.map(app => ({
          income: app.annual_income,
          score: app.credit_score,
          risk: app.risk_level,
          name: app.full_name
        }));

        // Purpose Distribution
        const purposeCounts = apps.reduce((acc, app) => {
          acc[app.loan_purpose] = (acc[app.loan_purpose] || 0) + 1;
          return acc;
        }, {});
        
        const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];
        const purposeDistribution = Object.entries(purposeCounts).map(([name, value], index) => ({
          name,
          value,
          color: COLORS[index % COLORS.length]
        }));

        setData({
          stats: statsData,
          incomeVsScore,
          purposeDistribution
        });
      } catch (error) {
        console.error('Failed to fetch analytics data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          Advanced Analytics
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Deep dive into credit scoring trends and population metrics
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* Loan Purpose Distribution */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: 450 }}>
            <Typography variant="h6" fontWeight="600" gutterBottom>
              Loan Purpose Distribution
            </Typography>
            <ResponsiveContainer width="100%" height="90%">
              <PieChart>
                <Pie
                  data={data.purposeDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {data.purposeDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Risk Breakdown */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: 450 }}>
            <Typography variant="h6" fontWeight="600" gutterBottom>
              Risk Level Summary
            </Typography>
            <ResponsiveContainer width="100%" height="90%">
              <BarChart data={data.stats.risk_distribution}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={theme.palette.divider} />
                <XAxis dataKey="name" stroke={theme.palette.text.secondary} />
                <YAxis stroke={theme.palette.text.secondary} />
                <Tooltip 
                  cursor={{ fill: 'transparent' }}
                  contentStyle={{ backgroundColor: theme.palette.background.paper, borderRadius: 8 }}
                />
                <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                  {data.stats.risk_distribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Income vs Credit Score */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3, height: 500 }}>
            <Typography variant="h6" fontWeight="600" gutterBottom>
              Income vs. Credit Score Correlation
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Analyzing how applicant income relates to the assigned credit score
            </Typography>
            <ResponsiveContainer width="100%" height="80%">
              <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} />
                <XAxis 
                  type="number" 
                  dataKey="income" 
                  name="Annual Income" 
                  unit="$" 
                  stroke={theme.palette.text.secondary}
                  label={{ value: 'Annual Income', position: 'insideBottom', offset: -10 }}
                />
                <YAxis 
                  type="number" 
                  dataKey="score" 
                  name="Credit Score" 
                  domain={[300, 850]}
                  stroke={theme.palette.text.secondary}
                  label={{ value: 'Credit Score', angle: -90, position: 'insideLeft' }}
                />
                <ZAxis type="category" dataKey="risk" />
                <Tooltip 
                  cursor={{ strokeDasharray: '3 3' }}
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <Paper sx={{ p: 2, border: `1px solid ${theme.palette.divider}`, borderRadius: 2 }}>
                          <Typography variant="subtitle2" fontWeight="bold">{data.name}</Typography>
                          <Typography variant="body2">Income: ${data.income.toLocaleString()}</Typography>
                          <Typography variant="body2">Score: {data.score}</Typography>
                          <Typography variant="body2" sx={{ color: data.risk === 'Low' ? 'success.main' : data.risk === 'High' ? 'error.main' : 'warning.main' }}>
                            Risk: {data.risk}
                          </Typography>
                        </Paper>
                      );
                    }
                    return null;
                  }}
                />
                <Scatter name="Applicants" data={data.incomeVsScore}>
                  {data.incomeVsScore.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={entry.risk === 'Low' ? '#2e7d32' : entry.risk === 'High' ? '#d32f2f' : '#ed6c02'} 
                    />
                  ))}
                </Scatter>
              </ScatterChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Analytics;
