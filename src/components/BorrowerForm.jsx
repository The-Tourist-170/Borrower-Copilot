import { useState } from 'react';

const INITIAL_STATE = {
  loanPurpose: '',
  loanType: 'personal',
  requestedAmount: '',
  tenureYears: 3,
  netIncome: '',
  employmentType: 'salaried',
  existingEmis: '',
  livingExp: '',
  age: '',
  creditScore: '',
  recentBounces: 0,
  savingsMonths: '',
  ownsPremises: null
};

export default function BorrowerForm({ onComplete }) {
  const [formData, setFormData] = useState(INITIAL_STATE);
  const [step, setStep] = useState(1);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    const parsedValue = (type === 'number' && value !== '') ? Number(value) : value;
    
    setFormData(prev => ({
      ...prev,
      [name]: parsedValue
    }));
  };

  const nextStep = (e) => {
    e.preventDefault();
    setStep(prev => prev + 1);
  };

  const submitForm = (e) => {
    e.preventDefault();
    onComplete(formData);
  };

  return (
    <div className="w-full max-w-2xl mx-auto bg-white shadow-xl rounded-2xl p-6 md:p-8 border border-gray-100">
      <div className="mb-6 flex justify-between items-center text-sm font-medium text-gray-500">
        <span>Step {step} of 3</span>
        {step > 1 && (
          <button onClick={() => setStep(prev => prev - 1)} className="hover:text-purple-700">
            &larr; Back
          </button>
        )}
      </div>

      <form onSubmit={step === 3 ? submitForm : nextStep} className="space-y-6">
        
        {step === 1 && (
          <div className="animate-fadeIn space-y-4">
            <h2 className="text-2xl font-serif font-semibold text-gray-900 mb-6">The Basics</h2>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Employment Type</label>
              <select name="employmentType" value={formData.employmentType} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500">
                <option value="salaried">Salaried (e.g., IT, Corporate)</option>
                <option value="self-employed">Self-Employed (e.g., Shop Owner, Freelance)</option>
                <option value="informal">Informal (e.g., Daily Wage, Gig Worker)</option>
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Loan Type</label>
                <select name="loanType" value={formData.loanType} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-lg">
                  <option value="personal">Personal Loan</option>
                  <option value="home">Home Loan</option>
                  <option value="business">Business Loan</option>
                  <option value="gold">Gold Loan</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Amount Wanted (₹)</label>
                <input type="number" name="requestedAmount" required value={formData.requestedAmount} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-lg" placeholder="e.g. 500000" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Age</label>
                <input type="number" name="age" required value={formData.age} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-lg" placeholder="e.g. 29" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Loan Tenure (Years)</label>
                <input type="number" name="tenureYears" required value={formData.tenureYears} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-lg" placeholder="e.g. 3" />
              </div>
            </div>
            
            <button type="submit" className="w-full bg-gray-900 text-white p-4 rounded-lg font-semibold hover:bg-gray-800 transition mt-4">
              Next: Financials
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="animate-fadeIn space-y-4">
            <h2 className="text-2xl font-serif font-semibold text-gray-900 mb-6">Your Income & Outgoings</h2>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Net Monthly Income (₹)</label>
              <input type="number" name="netIncome" required value={formData.netIncome} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-lg" placeholder="Take-home pay" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Total Existing EMIs (₹) <span className="text-gray-400 font-normal">(Optional)</span></label>
              <input type="number" name="existingEmis" value={formData.existingEmis} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-lg" placeholder="Leave blank if 0" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Monthly Living Expenses (₹) <span className="text-gray-400 font-normal">(Optional)</span></label>
              <input type="number" name="livingExp" value={formData.livingExp} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-lg" placeholder="If unknown, we will estimate 40%" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Credit Score <span className="text-gray-400 font-normal">(Optional)</span></label>
              <input type="number" name="creditScore" value={formData.creditScore} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-lg" placeholder="Leave blank if you don't know" />
              <p className="text-xs text-gray-500 mt-1">We never assume zero if you skip this, but ranges will widen.</p>
            </div>

            <button type="submit" className="w-full bg-gray-900 text-white p-4 rounded-lg font-semibold hover:bg-gray-800 transition mt-4">
              Next: Final Details
            </button>
          </div>
        )}

        {step === 3 && (
          <div className="animate-fadeIn space-y-4">
            <h2 className="text-2xl font-serif font-semibold text-gray-900 mb-6">A Few More Details</h2>
            
            {formData.employmentType === 'salaried' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Emergency Savings <span className="text-gray-400 font-normal">(Optional)</span></label>
                <select name="savingsMonths" value={formData.savingsMonths} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-lg">
                  <option value="">I'd rather not say</option>
                  <option value="2">0 - 2 months of expenses</option>
                  <option value="4">3 - 5 months of expenses</option>
                  <option value="6">6+ months of expenses</option>
                </select>
                <p className="text-xs text-gray-500 mt-1">Knowing this helps us shrink your required safety buffer.</p>
              </div>
            )}

            {formData.employmentType === 'self-employed' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Do you own your business premises debt-free?</label>
                <select name="ownsPremises" value={formData.ownsPremises === null ? "" : formData.ownsPremises} onChange={(e) => setFormData(prev => ({...prev, ownsPremises: e.target.value === "true"}))} className="w-full p-3 border border-gray-300 rounded-lg">
                  <option value="">Select an option...</option>
                  <option value="true">Yes, I own it</option>
                  <option value="false">No, I rent or have a mortgage</option>
                </select>
              </div>
            )}

            {formData.employmentType === 'informal' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Have you bounced any EMIs in the last 6 months?</label>
                <select name="recentBounces" value={formData.recentBounces} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-lg">
                  <option value="0">No bounces</option>
                  <option value="1">1 bounce</option>
                  <option value="2">2 or more bounces</option>
                </select>
              </div>
            )}

            <button type="submit" className="w-full bg-purple-700 text-white p-4 rounded-lg font-semibold hover:bg-purple-800 transition mt-6 text-lg shadow-lg">
              Generate Negotiation Card
            </button>
          </div>
        )}
      </form>
    </div>
  );
}
