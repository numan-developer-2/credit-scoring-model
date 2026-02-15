import api from './api';

export const scoringService = {
  calculateScore: async (applicationData) => {
    // Map frontend fields (e.g. annualIncome) to backend fields (e.g. annual_income)
    const payload = {
      full_name: applicationData.applicantName,
      email: applicationData.email,
      phone_number: applicationData.phoneNumber || "N/A",
      address: applicationData.address || "N/A",
      annual_income: Number(applicationData.annualIncome) || 0,
      employment_status: applicationData.employmentStatus || "Employed", 
      loan_amount: Number(applicationData.creditAmount) || 0,
      loan_purpose: applicationData.loanPurpose || "Personal",
      monthly_debt: Number(applicationData.monthlyDebt) || 0,
      age: Number(applicationData.age) || 0,
      years_employed: Number(applicationData.employmentYears) || 0,
      existing_credits: Number(applicationData.existingCredits) || 0,
      dependents: Number(applicationData.dependents) || 0
    };
    
    const response = await api.post('/applications/', payload);
    return response.data;
  },
};

export default scoringService;
