import { Box, Container, Typography, Button, Grid, Card, useTheme, alpha, Fade, Grow, Slide } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import {
  Assessment,
  Speed,
  Security,
  TrendingUp,
  ArrowForward,
} from '@mui/icons-material';

const features = [
  {
    icon: Speed,
    title: 'Instant Analysis',
    description: 'Get credit scores in seconds with our AI-powered engine',
  },
  {
    icon: Security,
    title: 'Bank-Grade Security',
    description: 'Your data is protected with enterprise-level encryption',
  },
  {
    icon: TrendingUp,
    title: 'Predictive Insights',
    description: 'Advanced ML models predict credit risk with 95% accuracy',
  },
  {
    icon: Assessment,
    title: 'Detailed Reports',
    description: 'Comprehensive analysis with actionable recommendations',
  },
];

const stats = [
  { value: '10M+', label: 'Credit Scores Processed' },
  { value: '95%', label: 'Accuracy Rate' },
  { value: '50K+', label: 'Active Users' },
  { value: '<2s', label: 'Average Response Time' },
];

function LandingPage() {
  const navigate = useNavigate();
  const theme = useTheme();

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      {/* Hero Section */}
      <Box
        sx={{
          background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
          color: 'white',
          pt: 8,
          pb: 12,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Animated Background */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            opacity: 0.1,
            background: 'radial-gradient(circle at 20% 50%, white 0%, transparent 50%), radial-gradient(circle at 80% 80%, white 0%, transparent 50%)',
            animation: 'pulse 8s ease-in-out infinite',
            '@keyframes pulse': {
              '0%, 100%': { opacity: 0.1 },
              '50%': { opacity: 0.2 },
            },
          }}
        />

        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          {/* Navigation */}
          <Fade in timeout={800}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 8 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Assessment sx={{ fontSize: 40 }} />
                <Typography variant="h5" fontWeight={700}>
                  CreditScore AI
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button
                  variant="text"
                  sx={{ color: 'white' }}
                  onClick={() => navigate('/login')}
                >
                  Login
                </Button>
                <Button
                  variant="contained"
                  sx={{
                    bgcolor: 'white',
                    color: theme.palette.primary.main,
                    '&:hover': { bgcolor: alpha('#fff', 0.9), transform: 'translateY(-2px)' },
                    transition: 'all 0.3s ease',
                  }}
                  onClick={() => navigate('/register')}
                >
                  Get Started
                </Button>
              </Box>
            </Box>
          </Fade>

          {/* Hero Content */}
          <Grid container spacing={6} alignItems="center">
            <Grid item xs={12} md={6}>
              <Slide direction="right" in timeout={1000}>
                <Box>
                  <Typography
                    variant="h2"
                    fontWeight={800}
                    gutterBottom
                    sx={{
                      fontSize: { xs: '2.5rem', md: '3.5rem' },
                      lineHeight: 1.2,
                    }}
                  >
                    AI-Powered Credit Scoring Platform
                  </Typography>
                  <Typography
                    variant="h6"
                    sx={{ mb: 4, opacity: 0.95, fontWeight: 400 }}
                  >
                    Make smarter lending decisions with machine learning. Assess credit risk instantly with 95% accuracy.
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                    <Button
                      variant="contained"
                      size="large"
                      endIcon={<ArrowForward />}
                      onClick={() => navigate('/register')}
                      sx={{
                        bgcolor: 'white',
                        color: theme.palette.primary.main,
                        px: 4,
                        py: 1.5,
                        fontSize: '1.1rem',
                        '&:hover': { 
                          bgcolor: alpha('#fff', 0.9),
                          transform: 'translateY(-4px)',
                          boxShadow: '0 12px 24px rgba(0,0,0,0.2)',
                        },
                        transition: 'all 0.3s ease',
                      }}
                    >
                      Start Free Trial
                    </Button>
                    <Button
                      variant="outlined"
                      size="large"
                      onClick={() => navigate('/login')}
                      sx={{
                        borderColor: 'white',
                        color: 'white',
                        px: 4,
                        py: 1.5,
                        fontSize: '1.1rem',
                        '&:hover': { 
                          borderColor: 'white', 
                          bgcolor: alpha('#fff', 0.1),
                          transform: 'translateY(-4px)',
                        },
                        transition: 'all 0.3s ease',
                      }}
                    >
                      Watch Demo
                    </Button>
                  </Box>
                </Box>
              </Slide>
            </Grid>
            <Grid item xs={12} md={6}>
              <Grow in timeout={1200}>
                <Box
                  sx={{
                    position: 'relative',
                    height: 400,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Box
                    sx={{
                      width: '100%',
                      height: '100%',
                      background: alpha('#fff', 0.1),
                      borderRadius: 4,
                      backdropFilter: 'blur(10px)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      border: `2px solid ${alpha('#fff', 0.2)}`,
                      animation: 'float 6s ease-in-out infinite',
                      '@keyframes float': {
                        '0%, 100%': { transform: 'translateY(0px)' },
                        '50%': { transform: 'translateY(-20px)' },
                      },
                    }}
                  >
                    <Assessment sx={{ fontSize: 200, opacity: 0.3 }} />
                  </Box>
                </Box>
              </Grow>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Stats Section */}
      <Container maxWidth="lg" sx={{ mt: -6, position: 'relative', zIndex: 2 }}>
        <Grid container spacing={3}>
          {stats.map((stat, index) => (
            <Grid item xs={6} md={3} key={index}>
              <Grow in timeout={1000 + index * 200}>
                <Card
                  sx={{
                    textAlign: 'center',
                    py: 3,
                    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                    '&:hover': { 
                      transform: 'translateY(-12px) scale(1.05)',
                      boxShadow: '0 12px 40px rgba(0,0,0,0.15)',
                    },
                  }}
                >
                  <Typography variant="h3" fontWeight={700} color="primary.main">
                    {stat.value}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    {stat.label}
                  </Typography>
                </Card>
              </Grow>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ py: 12 }}>
        <Fade in timeout={1500}>
          <Box sx={{ textAlign: 'center', mb: 8 }}>
            <Typography variant="h3" fontWeight={700} gutterBottom>
              Why Choose CreditScore AI?
            </Typography>
            <Typography variant="h6" color="text.secondary">
              Industry-leading features powered by advanced machine learning
            </Typography>
          </Box>
        </Fade>

        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Grow in timeout={1200 + index * 200}>
                <Card
                  sx={{
                    height: '100%',
                    p: 3,
                    textAlign: 'center',
                    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                    '&:hover': {
                      transform: 'translateY(-12px) rotate(2deg)',
                      boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
                    },
                  }}
                >
                  <Box
                    sx={{
                      width: 80,
                      height: 80,
                      borderRadius: '50%',
                      bgcolor: alpha(theme.palette.primary.main, 0.1),
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mx: 'auto',
                      mb: 2,
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'scale(1.1) rotate(360deg)',
                        bgcolor: alpha(theme.palette.primary.main, 0.2),
                      },
                    }}
                  >
                    <feature.icon sx={{ fontSize: 40, color: 'primary.main' }} />
                  </Box>
                  <Typography variant="h6" fontWeight={600} gutterBottom>
                    {feature.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {feature.description}
                  </Typography>
                </Card>
              </Grow>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* CTA Section */}
      <Box
        sx={{
          bgcolor: alpha(theme.palette.primary.main, 0.05),
          py: 8,
        }}
      >
        <Container maxWidth="md">
          <Fade in timeout={2000}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h3" fontWeight={700} gutterBottom>
                Ready to Get Started?
              </Typography>
              <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
                Join thousands of businesses making smarter credit decisions
              </Typography>
              <Button
                variant="contained"
                size="large"
                endIcon={<ArrowForward />}
                onClick={() => navigate('/register')}
                sx={{
                  px: 6,
                  py: 2,
                  fontSize: '1.1rem',
                  '&:hover': {
                    transform: 'translateY(-4px) scale(1.05)',
                    boxShadow: '0 12px 40px rgba(0,0,0,0.2)',
                  },
                  transition: 'all 0.3s ease',
                }}
              >
                Start Your Free Trial
              </Button>
            </Box>
          </Fade>
        </Container>
      </Box>

      {/* Footer */}
      <Box sx={{ bgcolor: 'background.paper', py: 4, borderTop: 1, borderColor: 'divider' }}>
        <Container maxWidth="lg">
          <Typography variant="body2" color="text.secondary" align="center">
            © 2026 CreditScore AI. All rights reserved.
          </Typography>
        </Container>
      </Box>
    </Box>
  );
}

export default LandingPage;
