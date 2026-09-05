import { useState } from 'react';
import BorrowerForm from './components/BorrowerForm';
import NegotiationCard from './components/NegotiationCard';
import { 
  processInputsAndConfidence,
  calcLoanLimits, 
  calcFairRateAndApr, 
  calcEmiCeilAndStress, 
  calculateVerdict, 
  generateNegotiationCardReasons 
} from './utils/rulesEngine';

function App() {
  const [cardData, setCardData] = useState(null);

  const handleFormComplete = (rawFormData) => {
    const processed = processInputsAndConfidence(rawFormData);
    const data = processed.safeData;

    const tenureMonths = data.tenureYears * 12;

    const limits = calcLoanLimits(data.netIncome, data.employmentType, data.existingEmis || 0, data.livingExp, 12.0, tenureMonths); 
    const rateData = calcFairRateAndApr(data.loanType, data.creditScore, data.employmentType, data.requestedAmount, tenureMonths);
    const emiData = calcEmiCeilAndStress(data.netIncome, data.existingEmis || 0, data.livingExp, data.requestedAmount, rateData.rateBand[0], tenureMonths);
    const verdict = calculateVerdict(data.requestedAmount, limits.borrSafeAmt, emiData.strsMaxEmi, data.recentBounces);
    
    const reasons = generateNegotiationCardReasons(limits, rateData, emiData, verdict);

    setCardData({
      processedInputs: processed,
      limits,
      rateData,
      emiData,
      verdict,
      reasons
    });

    console.log("FULL CARD DATA:", { reasons, warnings: processed.warnings, confidence: processed.confidenceLevel });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-12 px-4 font-sans text-gray-900">
      
      {!cardData ? (
        <>
          <header className="mb-8 text-center max-w-xl">
            <p className="text-xs font-bold tracking-widest uppercase text-gray-500 mb-2">Lokta Challenge</p>
            <h1 className="text-4xl font-serif font-medium mb-3">Borrower Copilot</h1>
            <p className="text-gray-600">Find out your true eligibility and get a fair rate before you walk into a branch.</p>
          </header>
          <BorrowerForm onComplete={handleFormComplete} />
        </>
      ) : (
        <NegotiationCard data={cardData} onRestart={() => setCardData(null)} />
      )}
      
    </div>
  );
}

export default App;
