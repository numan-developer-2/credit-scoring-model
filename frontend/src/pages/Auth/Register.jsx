import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
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
  Grid,
  LinearProgress,
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Assessment,
  Google,
  GitHub,
  ArrowBack,
  CheckCircle,
} from '@mui/icons-material';
import toast from 'react-hot-toast';

function Register() {
  const navigate = useNavigate();
  const theme = useTheme();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    company: '',
    password: '',
    confirmPassword: '',
  });

  const getPasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength += 25;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength += 25;
    if (/\d/.test(password)) strength += 25;
    if (/[^a-zA-Z\d]/.test(password)) strength += 25;
    return strength;
  };

  const passwordStrength = getPasswordStrength(formData.password);
  const getStrengthColor = () => {
    if (passwordStrength <= 25) return 'error';
    if (passwordStrength <= 50) return 'warning';
    if (passwordStrength <= 75) return 'info';
    return 'success';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match!');
      return;
    }

    if (!acceptTerms) {
      toast.error('Please accept the terms and conditions');
      return;
    }

    setLoading(true);

    try {
      // Mock registration - replace with actual API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      toast.success('Account created successfully! 🎉');
      navigate('/login');
    } catch (error) {
      toast.error('Registration failed. Please try again.');
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

      {/* Register Form Container */}
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
            maxWidth: 600,
            width: '100%',
            borderRadius: 4,
            bgcolor: 'background.paper',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
            maxHeight: '90vh',
            overflowY: 'auto', // Handle overflow on smaller screens
          }}
        >
          {/* Header */}
          <Box sx={{ textAlign: 'center', mb: 3 }}>
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
              Get Started
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Create your free account in seconds
            </Typography>
          </Box>

          {/* Social Register */}
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
              OR REGISTER WITH EMAIL
            </Typography>
          </Divider>

          {/* Form */}
          <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Full Name"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  required
                  autoFocus
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Company Name"
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Email Address"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                  InputLabelProps={{ shrink: true }}
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
                />
                {formData.password && (
                  <Box sx={{ mt: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                      <LinearProgress
                        variant="determinate"
                        value={passwordStrength}
                        color={getStrengthColor()}
                        sx={{ flex: 1, height: 6, borderRadius: 3 }}
                      />
                      <Typography variant="caption" color="text.secondary" fontWeight={500}>
                        {passwordStrength <= 25 && 'Weak'}
                        {passwordStrength > 25 && passwordStrength <= 50 && 'Fair'}
                        {passwordStrength > 50 && passwordStrength <= 75 && 'Good'}
                        {passwordStrength > 75 && 'Strong'}
                      </Typography>
                    </Box>
                  </Box>
                )}
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Confirm Password"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={(e) =>
                    setFormData({ ...formData, confirmPassword: e.target.value })
                  }
                  required
                  InputLabelProps={{ shrink: true }}
                  error={
                    formData.confirmPassword &&
                    formData.password !== formData.confirmPassword
                  }
                  helperText={
                    formData.confirmPassword &&
                    formData.password !== formData.confirmPassword
                      ? 'Passwords do not match'
                      : ''
                  }
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          edge="end"
                          size="small"
                        >
                          {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
            </Grid>

            <FormControlLabel
              control={
                <Checkbox
                  checked={acceptTerms}
                  onChange={(e) => setAcceptTerms(e.target.checked)}
                  color="primary"
                  size="small"
                />
              }
              label={
                <Typography variant="body2" color="text.secondary">
                  I agree to the{' '}
                  <Link
                    to="/terms"
                    style={{ color: theme.palette.primary.main, textDecoration: 'none', fontWeight: 600 }}
                  >
                    Terms of Service
                  </Link>{' '}
                  and{' '}
                  <Link
                    to="/privacy"
                    style={{ color: theme.palette.primary.main, textDecoration: 'none', fontWeight: 600 }}
                  >
                    Privacy Policy
                  </Link>
                </Typography>
              }
              sx={{ mt: 2, mb: 3 }}
            />

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
              {loading ? 'Creating Account...' : 'Create Account'}
            </Button>
          </form>

          {/* Footer */}
          <Box sx={{ mt: 3, textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              Already have an account?{' '}
              <Link
                to="/login"
                style={{
                  textDecoration: 'none',
                  color: theme.palette.primary.main,
                  fontWeight: 700,
                }}
              >
                Sign In
              </Link>
            </Typography>
          </Box>
        </Paper>
      </Box>

      {/* Right Side - Benefits (Visible on Desktop) */}
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
        <Typography variant="h3" fontWeight={800} gutterBottom sx={{ mb: 4 }}>
          Why Join Us?
        </Typography>
        <Box sx={{ maxWidth: 450 }}>
          {[
            'Access to advanced AI credit scoring models',
            'Real-time risk assessment & decisioning',
            'Comprehensive analytics dashboard & reports',
            'Enterprise-grade security & data protection',
            '24/7 dedicated customer support team',
          ].map((benefit, index) => (
            <Box
              key={index}
              sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}
            >
              <CheckCircle sx={{ fontSize: 28, opacity: 0.9 }} />
              <Typography variant="h6" fontWeight={400} sx={{ opacity: 0.95 }}>
                {benefit}
              </Typography>
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
}

export default Register;
