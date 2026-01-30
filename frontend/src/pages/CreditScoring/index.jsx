import { useState } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Paper,
  Chip,
  LinearProgress,
  Alert,
  useTheme,
  Divider,
} from '@mui/material';
import {
  Calculate,
  CheckCircle,
  Warning,
  Error as ErrorIcon,
} from '@mui/icons-material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import toast from 'react-hot-toast';

const validationSchema = Yup.object({
  applicantName: Yup.string()
    .min(2, 'Name must be at least 2 characters')
    .required('Name is required'),
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  age: Yup.number()
    .min(18, 'Must be at least 18 years old')
    .max(100, 'Invalid age')
    .required('Age is required'),
  annualIncome: Yup.number()
    .min(0, 'Income cannot be negative')
    .required('Annual income is required'),
  creditAmount: Yup.number()
    .min(1000, 'Minimum credit amount is 1000')
    .required('Credit amount is required'),
  monthlyDebt: Yup.number()
    .min(0, 'Debt cannot be negative')
    .required('Monthly debt is required'),
  employmentYears: Yup.number()
    .min(0, 'Cannot be negative')
    .required('Employment years is required'),
  existingCredits: Yup.number()
    .min(0, 'Cannot be negative')
    .required('Existing credits is required'),
});

const CreditScoring = () => {
  const theme = useTheme();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const formik = useFormik({
    initialValues: {
      applicantName: '',
      email: '',
      age: '',
      annualIncome: '',
      creditAmount: '',
      monthlyDebt: '',
      employmentYears: '',
      existingCredits: '',
    },
    validationSchema,
    onSubmit: async (values) => {
      setLoading(true);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Calculate mock credit score
      const score = calculateCreditScore(values);
      const riskLevel = getRiskLevel(score);
      const approvalProbability = getApprovalProbability(score);
      const factors = getContributingFactors(values, score);
      
      setResult({
        score,
        riskLevel,
        approvalProbability,
        factors,
      });
      
      setLoading(false);
      toast.success('Credit score calculated successfully!');
    },
  });

  const calculateCreditScore = (values) => {
    let score = 600; // Base score
    
    // Income factor
    const income = parseFloat(values.annualIncome);
    if (income > 100000) score += 100;
    else if (income > 50000) score += 50;
    else if (income > 30000) score += 25;
    
    // Debt-to-income ratio
    const monthlyIncome = income / 12;
    const debtRatio = parseFloat(values.monthlyDebt) / monthlyIncome;
    if (debtRatio < 0.2) score += 50;
    else if (debtRatio < 0.4) score += 25;
    else if (debtRatio > 0.6) score -= 50;
    
    // Employment stability
    const empYears = parseFloat(values.employmentYears);
    if (empYears > 5) score += 40;
    else if (empYears > 2) score += 20;
    
    // Age factor
    const age = parseInt(values.age);
    if (age >= 30 && age <= 50) score += 30;
    else if (age > 50) score += 15;
    
    // Credit amount vs income
    const creditRatio = parseFloat(values.creditAmount) / income;
    if (creditRatio < 0.3) score += 30;
    else if (creditRatio > 0.8) score -= 40;
    
    // Existing credits
    const existing = parseInt(values.existingCredits);
    if (existing === 0) score += 20;
    else if (existing > 3) score -= 30;
    
    return Math.min(Math.max(score, 300), 850);
  };

  const getRiskLevel = (score) => {
    if (score >= 700) return { level: 'Low', color: 'success' };
    if (score >= 600) return { level: 'Medium', color: 'warning' };
    return { level: 'High', color: 'error' };
  };

  const getApprovalProbability = (score) => {
    if (score >= 750) return 95;
    if (score >= 700) return 85;
    if (score >= 650) return 70;
    if (score >= 600) return 50;
    if (score >= 550) return 30;
    return 15;
  };

  const getContributingFactors = (values, score) => {
    const factors = [];
    const income = parseFloat(values.annualIncome);
    const monthlyIncome = income / 12;
    const debtRatio = parseFloat(values.monthlyDebt) / monthlyIncome;
    
    if (income > 75000) {
      factors.push({ text: 'Strong annual income', impact: 'positive' });
    } else if (income < 30000) {
      factors.push({ text: 'Low annual income', impact: 'negative' });
    }
    
    if (debtRatio < 0.3) {
      factors.push({ text: 'Low debt-to-income ratio', impact: 'positive' });
    } else if (debtRatio > 0.5) {
      factors.push({ text: 'High debt-to-income ratio', impact: 'negative' });
    }
    
    if (parseFloat(values.employmentYears) > 3) {
      factors.push({ text: 'Stable employment history', impact: 'positive' });
    }
    
    if (parseInt(values.existingCredits) === 0) {
      factors.push({ text: 'No existing credits', impact: 'positive' });
    } else if (parseInt(values.existingCredits) > 2) {
      factors.push({ text: 'Multiple existing credits', impact: 'negative' });
    }
    
    return factors;
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          Credit Scoring
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Calculate credit score and assess creditworthiness
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* Form */}
        <Grid item xs={12} lg={7}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" fontWeight="600" gutterBottom>
              Applicant Information
            </Typography>
            <Divider sx={{ mb: 3 }} />
            
            <form onSubmit={formik.handleSubmit}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Full Name"
                    name="applicantName"
                    value={formik.values.applicantName}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.applicantName && Boolean(formik.errors.applicantName)}
                    helperText={formik.touched.applicantName && formik.errors.applicantName}
                  />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Email"
                    name="email"
                    type="email"
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.email && Boolean(formik.errors.email)}
                    helperText={formik.touched.email && formik.errors.email}
                  />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Age"
                    name="age"
                    type="number"
                    value={formik.values.age}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.age && Boolean(formik.errors.age)}
                    helperText={formik.touched.age && formik.errors.age}
                  />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Annual Income ($)"
                    name="annualIncome"
                    type="number"
                    value={formik.values.annualIncome}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.annualIncome && Boolean(formik.errors.annualIncome)}
                    helperText={formik.touched.annualIncome && formik.errors.annualIncome}
                  />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Credit Amount Requested ($)"
                    name="creditAmount"
                    type="number"
                    value={formik.values.creditAmount}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.creditAmount && Boolean(formik.errors.creditAmount)}
                    helperText={formik.touched.creditAmount && formik.errors.creditAmount}
                  />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Monthly Debt ($)"
                    name="monthlyDebt"
                    type="number"
                    value={formik.values.monthlyDebt}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.monthlyDebt && Boolean(formik.errors.monthlyDebt)}
                    helperText={formik.touched.monthlyDebt && formik.errors.monthlyDebt}
                  />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Years Employed"
                    name="employmentYears"
                    type="number"
                    value={formik.values.employmentYears}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.employmentYears && Boolean(formik.errors.employmentYears)}
                    helperText={formik.touched.employmentYears && formik.errors.employmentYears}
                  />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Existing Credits"
                    name="existingCredits"
                    type="number"
                    value={formik.values.existingCredits}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.existingCredits && Boolean(formik.errors.existingCredits)}
                    helperText={formik.touched.existingCredits && formik.errors.existingCredits}
                  />
                </Grid>
                
                <Grid item xs={12}>
                  <Button
                    type="submit"
                    variant="contained"
                    size="large"
                    fullWidth
                    startIcon={<Calculate />}
                    disabled={loading}
                    sx={{ mt: 2, py: 1.5 }}
                  >
                    {loading ? 'Calculating...' : 'Calculate Credit Score'}
                  </Button>
                </Grid>
              </Grid>
            </form>
          </Paper>
        </Grid>

        {/* Results */}
        <Grid item xs={12} lg={5}>
          {loading && (
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Analyzing...
              </Typography>
              <LinearProgress sx={{ my: 2 }} />
              <Typography variant="body2" color="text.secondary">
                Processing credit assessment
              </Typography>
            </Paper>
          )}
          
          {!loading && result && (
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" fontWeight="600" gutterBottom>
                Credit Assessment Results
              </Typography>
              <Divider sx={{ mb: 3 }} />
              
              {/* Credit Score */}
              <Box sx={{ textAlign: 'center', mb: 3 }}>
                <Typography variant="h2" fontWeight="bold" color="primary.main">
                  {result.score}
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Credit Score (300-850)
                </Typography>
                <Chip
                  label={`${result.riskLevel.level} Risk`}
                  color={result.riskLevel.color}
                  icon={
                    result.riskLevel.level === 'Low' ? <CheckCircle /> :
                    result.riskLevel.level === 'Medium' ? <Warning /> :
                    <ErrorIcon />
                  }
                  sx={{ mt: 1 }}
                />
              </Box>
              
              {/* Approval Probability */}
              <Box sx={{ mb: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2" fontWeight="600">
                    Approval Probability
                  </Typography>
                  <Typography variant="body2" fontWeight="600" color="primary.main">
                    {result.approvalProbability}%
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={result.approvalProbability}
                  sx={{ height: 8, borderRadius: 4 }}
                />
              </Box>
              
              {/* Contributing Factors */}
              <Box>
                <Typography variant="body2" fontWeight="600" gutterBottom>
                  Contributing Factors
                </Typography>
                {result.factors.map((factor, index) => (
                  <Alert
                    key={index}
                    severity={factor.impact === 'positive' ? 'success' : 'warning'}
                    sx={{ mb: 1 }}
                  >
                    {factor.text}
                  </Alert>
                ))}
              </Box>
            </Paper>
          )}
          
          {!loading && !result && (
            <Paper sx={{ p: 3, textAlign: 'center' }}>
              <Calculate sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h6" color="text.secondary">
                Fill the form to calculate credit score
              </Typography>
            </Paper>
          )}
        </Grid>
      </Grid>
    </Box>
  );
};

export default CreditScoring;