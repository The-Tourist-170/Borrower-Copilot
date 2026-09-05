// Reusable Tooltip/Explanation Box for the "Whys"
function ExplanationBox({ text }) {
  return (
    <div className="mt-4 bg-slate-50 border-l-4 border-indigo-500 p-3.5 rounded-r-lg shadow-sm flex items-start gap-3">
      <svg className="w-5 h-5 text-indigo-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
      </svg>
      <p className="text-sm text-slate-700 font-medium leading-relaxed">{text}</p>
    </div>
  );
}

export default function NegotiationCard({ data, onRestart }) {
  const { processedInputs, limits, rateData, emiData, verdict, reasons } = data;
  
  const verdictColor = 
    verdict.verdict === 'Borrow' ? 'bg-green-100 text-green-900 border-green-300' :
    verdict.verdict === 'Borrow less' ? 'bg-yellow-100 text-yellow-900 border-yellow-300' : 
    'bg-red-100 text-red-900 border-red-300';

  return (
    <div className="w-full max-w-3xl mx-auto space-y-6 animate-fadeIn pb-12">
      
      {processedInputs.warnings.length > 0 && (
        <div className="bg-orange-50 border-l-4 border-orange-500 p-4 rounded-r-lg shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-bold text-orange-800">Confidence: {processedInputs.confidenceLevel}</h3>
          </div>
          <ul className="text-sm text-orange-700 space-y-1 list-disc pl-5">
            {processedInputs.warnings.map((warn, i) => (
              <li key={i}>{warn}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="bg-white shadow-2xl rounded-2xl overflow-hidden border border-gray-200">
        
        {/* O1: The Verdict Header */}
        <div className={`${verdictColor} p-6 border-b text-center`}>
          <p className="text-xs font-bold tracking-widest uppercase mb-1 opacity-80">Final Verdict</p>
          <h2 className="text-4xl font-serif font-bold mb-3">{verdict.verdict}</h2>
          <p className="max-w-xl mx-auto text-sm opacity-90">{reasons.verdictWhy}</p>
        </div>

        <div className="p-6 md:p-8 space-y-8">
          
          {/* O2: Maximum Amount */}
          <div>
            <h3 className="text-lg font-bold text-gray-900 border-b pb-2 mb-4">Borrowing Capacity</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <p className="text-sm text-gray-500 font-medium">Lender Will Sanction</p>
                <p className="text-2xl font-mono text-gray-900">₹{limits.lenderSancAmt.toLocaleString('en-IN')}</p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                <p className="text-sm text-purple-700 font-medium">Your Safe Limit</p>
                <p className="text-2xl font-mono text-purple-900 font-bold">₹{limits.borrSafeAmt.toLocaleString('en-IN')}</p>
              </div>
            </div>
            <ExplanationBox text={reasons.amountWhy} />
          </div>

          {/* O3: Fair Rate & APR */}
          <div>
            <h3 className="text-lg font-bold text-gray-900 border-b pb-2 mb-4">Fair Rate & True Cost</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <p className="text-sm text-gray-500 font-medium">Expected Rate Band</p>
                <p className="text-2xl font-mono text-gray-900">{rateData.rateBand[0]}% - {rateData.rateBand[1]}%</p>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <p className="text-sm text-blue-700 font-medium">All-In APR (Incl. Fees)</p>
                <p className="text-2xl font-mono text-blue-900 font-bold">{rateData.allInApr}%</p>
              </div>
            </div>
            <ExplanationBox text={reasons.rateWhy} />
          </div>

          {/* O4: EMI Stress Test */}
          <div>
            <h3 className="text-lg font-bold text-gray-900 border-b pb-2 mb-4">Monthly EMI Ceiling</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <p className="text-sm text-gray-500 font-medium">Max Safe EMI</p>
                <p className="text-2xl font-mono text-gray-900">₹{emiData.maxSafeEmi.toLocaleString('en-IN')}</p>
              </div>
              <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                <p className="text-sm text-red-700 font-medium">Stressed Capacity (-20% Income)</p>
                <p className="text-2xl font-mono text-red-900 font-bold">₹{emiData.strsMaxEmi.toLocaleString('en-IN')}</p>
              </div>
            </div>
            <ExplanationBox text={reasons.emiWhy} />
          </div>

        </div>
      </div>
      
      <div className="text-center pt-4">
        <button onClick={onRestart} className="text-gray-500 font-medium hover:text-gray-800 transition underline underline-offset-4">
          Start a new assessment
        </button>
      </div>
    </div>
  );
}
