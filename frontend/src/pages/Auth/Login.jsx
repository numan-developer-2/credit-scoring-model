import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  IconButton,
  InputAdornment,
  Divider,
  Checkbox,
  FormControlLabel,
  alpha,
  useTheme,
  Grid
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Assessment,
  Google,
  GitHub,
  ArrowBack,
} from '@mui/icons-material';
import { loginSuccess } from '../../stores/slices/authSlice';
import toast from 'react-hot-toast';

function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const theme = useTheme();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Mock login - replace with actual API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const mockUser = {
        id: 1,
        name: 'John Doe',
        email: formData.email,
        role: 'admin',
        avatar: null,
      };

      dispatch(
        loginSuccess({
          user: mockUser,
          token: 'mock-jwt-token-' + Date.now(),
        })
      );

      toast.success('Welcome back! 🎉');
      navigate('/app/dashboard');
    } catch (error) {
      toast.error('Invalid credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Back Button - Fixed Z-Index & Contrast */}
      <IconButton
        onClick={() => navigate('/')}
        sx={{
          position: 'absolute',
          top: 24,
          left: 24,
          color: 'white',
          bgcolor: 'rgba(255, 255, 255, 0.15)',
          zIndex: 10,
          '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.25)' },
        }}
      >
        <ArrowBack />
      </IconButton>

      {/* Login Form Container */}
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          p: 3,
          position: 'relative',
          zIndex: 1,
        }}
      >
        <Paper
          elevation={4}
          sx={{
            p: 5,
            maxWidth: 480,
            width: '100%',
            borderRadius: 4,
            bgcolor: 'background.paper', // Ensure solid background for readability
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
          }}
        >
          {/* Header */}
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Box
              sx={{
                width: 64,
                height: 64,
                borderRadius: 2,
                bgcolor: alpha(theme.palette.primary.main, 0.1),
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mx: 'auto',
                mb: 2,
                color: 'primary.main',
              }}
            >
              <Assessment sx={{ fontSize: 32 }} />
            </Box>
            <Typography variant="h4" fontWeight={700} color="text.primary" gutterBottom>
              Welcome Back
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Sign in to continue to CreditScore AI
            </Typography>
          </Box>

          {/* Social Login Buttons - Explicit Colors */}
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={6}>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<Google />}
                sx={{
                  py: 1.5,
                  color: 'text.primary',
                  borderColor: 'divider',
                  textTransform: 'none',
                  fontSize: '0.95rem',
                  '&:hover': {
                    borderColor: 'primary.main',
                    bgcolor: alpha(theme.palette.primary.main, 0.05),
                  },
                }}
              >
                Google
              </Button>
            </Grid>
            <Grid item xs={6}>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<GitHub />}
                sx={{
                  py: 1.5,
                  color: 'text.primary',
                  borderColor: 'divider',
                  textTransform: 'none',
                  fontSize: '0.95rem',
                  '&:hover': {
                    borderColor: 'primary.main',
                    bgcolor: alpha(theme.palette.primary.main, 0.05),
                  },
                }}
              >
                GitHub
              </Button>
            </Grid>
          </Grid>

          <Divider sx={{ my: 3 }}>
            <Typography variant="caption" color="text.secondary" sx={{ px: 1 }}>
              OR CONTINUE WITH EMAIL
            </Typography>
          </Divider>

          {/* Form */}
          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Email Address"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              margin="normal"
              required
              autoFocus
              sx={{ mb: 2 }}
              InputLabelProps={{ shrink: true }} // Force label visibility
            />

            <TextField
              fullWidth
              label="Password"
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              margin="normal"
              required
              InputLabelProps={{ shrink: true }} // Force label visibility
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                      size="small"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{ mb: 1 }}
            />

            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                mb: 3,
              }}
            >
              <FormControlLabel
                control={
                  <Checkbox
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    color="primary"
                    size="small"
                  />
                }
                label={
                  <Typography variant="body2" color="text.secondary">
                    Remember me
                  </Typography>
                }
              />
              <Link
                to="/forgot-password"
                style={{
                  textDecoration: 'none',
                  color: theme.palette.primary.main,
                  fontSize: '0.875rem',
                  fontWeight: 600,
                }}
              >
                Forgot Password?
              </Link>
            </Box>

            <Button
              fullWidth
              type="submit"
              variant="contained"
              size="large"
              disabled={loading}
              sx={{
                py: 1.5,
                fontSize: '1rem',
                fontWeight: 600,
                textTransform: 'none',
                borderRadius: 2,
                boxShadow: '0 4px 12px rgba(25, 118, 210, 0.3)',
                '&:hover': {
                  boxShadow: '0 6px 16px rgba(25, 118, 210, 0.4)',
                  transform: 'translateY(-1px)',
                },
                transition: 'all 0.2s',
              }}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>

            {/* Footer */}
          <Box sx={{ mt: 4, textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              Don't have an account?{' '}
              <Link
                to="/register"
                style={{
                  textDecoration: 'none',
                  color: theme.palette.primary.main,
                  fontWeight: 700,
                }}
              >
                Create Account
              </Link>
            </Typography>
          </Box>
        </Paper>
      </Box>

      {/* Right Side Branding */}
      <Box
        sx={{
          flex: 1,
          display: { xs: 'none', md: 'flex' },
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          p: 6,
        }}
      >
        <Typography variant="h3" fontWeight={800} gutterBottom align="center">
          CreditScore AI
        </Typography>
        <Typography variant="h6" sx={{ opacity: 0.9, textAlign: 'center', maxWidth: 480, fontWeight: 400 }}>
          Join the platform trusted by thousands for accurate credit risk assessment and faster lending decisions.
        </Typography>
      </Box>
    </Box>
  );
}

export default Login;