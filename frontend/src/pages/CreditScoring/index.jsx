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
  Select,
  MenuItem,
  FormControl,
  InputLabel,
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
import scoringService from '../../services/scoringService';

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
      phoneNumber: '',
      address: '',
      age: '',
      annualIncome: '',
      employmentStatus: 'Employed',
      employmentYears: '',
      creditAmount: '',
      loanPurpose: 'Personal',
      monthlyDebt: '',
      existingCredits: '',
      dependents: '',
    },
    validationSchema,
    onSubmit: async (values) => {
      setLoading(true);
      try {
        const application = await scoringService.calculateScore(values);
        
        setResult({
          score: application.credit_score,
          riskLevel: {
            level: application.risk_level,
            color: application.risk_level === 'Low' ? 'success' : application.risk_level === 'Medium' ? 'warning' : 'error'
          },
          approvalProbability: Math.round(application.approval_probability * 100),
          factors: (application.risk_factors || []).map(f => ({ text: f, impact: 'negative' })),
          modelUsed: application.model_version
        });
        
        toast.success('Credit application submitted and scored!');
      } catch (error) {
        console.error(error);
        toast.error(error.response?.data?.detail || 'Failed to calculate credit score');
      } finally {
        setLoading(false);
      }
    },
  });



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
                    label="Phone Number"
                    name="phoneNumber"
                    value={formik.values.phoneNumber}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Residential Address"
                    name="address"
                    value={formik.values.address}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
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
                  <FormControl fullWidth>
                    <InputLabel>Employment Status</InputLabel>
                    <Select
                      name="employmentStatus"
                      value={formik.values.employmentStatus}
                      label="Employment Status"
                      onChange={formik.handleChange}
                    >
                      <MenuItem value="Employed">Employed</MenuItem>
                      <MenuItem value="Self-Employed">Self-Employed</MenuItem>
                      <MenuItem value="Unemployed">Unemployed</MenuItem>
                      <MenuItem value="Student">Student</MenuItem>
                    </Select>
                  </FormControl>
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
                  <FormControl fullWidth>
                    <InputLabel>Loan Purpose</InputLabel>
                    <Select
                      name="loanPurpose"
                      value={formik.values.loanPurpose}
                      label="Loan Purpose"
                      onChange={formik.handleChange}
                    >
                      <MenuItem value="Personal">Personal</MenuItem>
                      <MenuItem value="Education">Education</MenuItem>
                      <MenuItem value="Home Improvement">Home Improvement</MenuItem>
                      <MenuItem value="Debt Consolidation">Debt Consolidation</MenuItem>
                      <MenuItem value="Business">Business</MenuItem>
                    </Select>
                  </FormControl>
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

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Number of Dependents"
                    name="dependents"
                    type="number"
                    value={formik.values.dependents}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
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