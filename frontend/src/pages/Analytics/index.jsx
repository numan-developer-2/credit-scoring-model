import { Box, Typography, Paper, Grid } from '@mui/material';
import { TrendingUp } from '@mui/icons-material';

const Analytics = () => {
  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          Analytics
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Advanced analytics and insights
        </Typography>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper sx={{ p: 4, textAlign: 'center' }}>
            <TrendingUp sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" color="text.secondary">
              Advanced analytics coming soon
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Analytics;
