export function processInputsAndConfidence(formData) {
    let warnings = [];
    let confidenceLevel = "High"; 
    let data = { ...formData };

    if (data.creditScore === null || data.creditScore === undefined || data.creditScore === "" || data.creditScore === 0) {
        data.creditScore = 0; 
        warnings.push("Credit score unknown: We widened your expected interest rate band to account for potential risk.");
        confidenceLevel = "Medium";
    }

    if (data.livingExp === null || data.livingExp === undefined || data.livingExp === "") {
        data.livingExp = data.netIncome * 0.40; 
        warnings.push(`Living expenses skipped: We assumed standard expenses of ₹${Math.round(data.livingExp).toLocaleString('en-IN')} (40% of income). This lowers our confidence in your exact safe limit.`);
        confidenceLevel = "Low";
    }

    if (data.employmentType === 'salaried' && (data.savingsMonths === null || data.savingsMonths === undefined || data.savingsMonths === "")) {
        warnings.push("Savings unknown: We used a strict 10% emergency buffer. Telling us your savings could increase your safe borrowing limit.");
        if (confidenceLevel === "High") confidenceLevel = "Medium";
    }

    if (data.employmentType === 'self-employed' && (data.ownsPremises === null || data.ownsPremises === undefined || data.ownsPremises === "")) {
        warnings.push("Collateral unknown: We could not apply the potential rate discount for owning your business premises.");
        if (confidenceLevel === "High") confidenceLevel = "Medium";
    }

    return {
        safeData: data,
        confidenceLevel: confidenceLevel,
        warnings: warnings
    };
}

export function calcLoanLimits(inc, empType, existingEMI, lvngExp, intRate, tenureMon) {
    const foirLim = empType === 'salaried' ? 0.50 : 0.45;
    
    const bankMaxEmi = Math.max(0, (inc * foirLim) - existingEMI);

    const safetyBuffer = inc * 0.10;
    const cashflowMaxEmi = Math.max(0, inc - existingEMI - lvngExp - safetyBuffer);
    const absoluteMaxEmi = inc * 0.50; 
    const finalSafeEmi = Math.min(cashflowMaxEmi, absoluteMaxEmi);

    const r = (intRate / 100) / 12;
    const n = tenureMon;
    const pvFactor = ((Math.pow(1 + r, n) - 1) / (r * Math.pow(1 + r, n)));

    return {
        lenderSancAmt: Math.round(bankMaxEmi * pvFactor),
        borrSafeAmt: Math.round(finalSafeEmi * pvFactor)
    };
}

export function calcFairRateAndApr(loanType, creditScore, empType, loanAmt, tenureMon) {
    let minRate  = 12.0;
    let maxRate = 16.0;
    let procFees = 2.0;

    switch (loanType) {
        case 'home':
            minRate = 8.5; maxRate = 10.5; procFees = 0.5; break;
        case 'personal':
            minRate = 10.5; maxRate = 20.0; procFees = 2.0; break;
        case 'business':
            minRate = 11.0; maxRate = 18.0; procFees = 2.0; break;
        case 'gold':
            minRate = 9.0; maxRate = 12.0; procFees = 1.0; break;
    }

    if (!creditScore || creditScore === 0) {
        minRate += 1.0; 
        maxRate += 4.0; 
    } else if (creditScore < 650) {
        minRate += 3.0;
        maxRate += 4.0;
    } else if (creditScore >= 650 && creditScore < 700) {
        minRate += 1.5;
        maxRate += 2.0;
    } else if (creditScore >= 700 && creditScore < 800) {
        maxRate -= 1.0; 
    } else if (creditScore >= 800) {
        minRate -= 0.5; 
        maxRate -= 2.0; 
    }

    if (empType === 'informal' || empType === 'student') {
        minRate += 2.0;
        maxRate += 3.0;
    }

    const procFeesAmt = loanAmt * procFees / 100.0;
    const trueApr = minRate + (procFees * 24 / (tenureMon + 1));

    return {
        rateBand: [parseFloat(minRate.toFixed(2)), parseFloat(maxRate.toFixed(2))],
        procFeesAmt: Math.round(procFeesAmt),
        allInApr: parseFloat(trueApr.toFixed(2)),
        reason: `Your fair rate is ${minRate}% - ${maxRate}% based on your ${!creditScore ? 'unknown credit history' : 'credit profile'}, but with a ${procFees}% fee, your true APR is ${trueApr.toFixed(2)}%.`
    };
}

export function calcEmiCeilAndStress(netIncome, exisEmi, livingExp, loanAmt, IntRate, tenureMon) {
    const safetyBuffer = netIncome * 0.10; 
    const cashflowMaxEmi = Math.max(0, netIncome - exisEmi - livingExp - safetyBuffer);
    const absoluteMaxEmi = netIncome * 0.50;
    const maxSafeEmi = Math.min(cashflowMaxEmi, absoluteMaxEmi); 

    const strsInc = netIncome * 0.80;
    const strsBuffer = strsInc * 0.10;
    const strsCashflowMaxEmi = Math.max(0, strsInc - exisEmi - livingExp - strsBuffer);
    const strsAbsoluteMaxEmi = strsInc * 0.50;
    const strsMaxEmi = Math.min(strsCashflowMaxEmi, strsAbsoluteMaxEmi);

    const r = (IntRate / 100) / 12;
    const currEmi = loanAmt * (r * Math.pow(1 + r, tenureMon)) / (Math.pow(1 + r, tenureMon) - 1);
    
    const fasterTenure = Math.max(12, tenureMon - 12);
    const fasterEmi = loanAmt * (r * Math.pow(1 + r, fasterTenure)) / (Math.pow(1 + r, fasterTenure) - 1);
    const canAffordFaster = fasterEmi <= maxSafeEmi;

    let reason = `Your safe EMI ceiling is ₹${Math.round(maxSafeEmi)}, but if your income drops by 20%, you can only carry ₹${Math.round(strsMaxEmi)}. `;

    if (canAffordFaster) {
        reason += `You can safely shorten your loan to ${fasterTenure} months with an EMI of ₹${Math.round(fasterEmi)} to save on interest.`;
    } else {
        reason += `Do not shorten your loan to ${fasterTenure} months, as the ₹${Math.round(fasterEmi)} EMI breaks your safe ceiling.`;
    }

    return {
        maxSafeEmi: Math.round(maxSafeEmi),
        strsMaxEmi: Math.round(strsMaxEmi),
        currEmi: Math.round(currEmi),
        fasterTenure: fasterTenure,
        fasterEmi: Math.round(fasterEmi),
        reason: reason
    };
}

export function calculateVerdict(reqAmt, borrSafeAmt, strsMaxEmi, recBounces) {
    let verdict = "";
    let reason = "";

    if (borrSafeAmt <= 0) {
        verdict = "Don't borrow";
        reason = "Your current living expenses and existing EMIs leave no safe room for a new monthly payment.";
    } else if (recBounces > 0 && strsMaxEmi <= 0) {
        verdict = "Don't borrow";
        reason = "With recent bounced payments and zero buffer if your income drops, taking on new debt right now is highly unsafe.";
    } else if (reqAmt > borrSafeAmt) {
        verdict = "Borrow less";
        reason = `You requested ₹${reqAmt.toLocaleString('en-IN')}, but safely capping your budget means you should not borrow more than ₹${borrSafeAmt.toLocaleString('en-IN')}.`;
    } else {
        verdict = "Borrow";
        reason = `The requested ₹${reqAmt.toLocaleString('en-IN')} fits comfortably within your safe monthly budget, even if your income drops slightly.`;
    }

    return {
        verdict: verdict,
        reason: reason
    };
}

export function generateNegotiationCardReasons(aff, rateData, emiData, verData) {
    let amountReason = "";
    
    if (aff.borrSafeAmt > aff.lenderSancAmt) {
        amountReason = `The lender's strict rules will cap you at ₹${aff.lenderSancAmt.toLocaleString('en-IN')}, even though your low living expenses mean you could safely handle a loan up to ₹${aff.borrSafeAmt.toLocaleString('en-IN')}.`;
    } else {
        amountReason = `The lender will likely sanction up to ₹${aff.lenderSancAmt.toLocaleString('en-IN')}, but you should strictly cap yourself at ₹${aff.borrSafeAmt.toLocaleString('en-IN')} to protect your emergency buffer.`;
    }

    return {
        verdictWhy: verData.reason,
        amountWhy: amountReason,
        rateWhy: `Fair for your profile is ${rateData.rateBand[0]}% - ${rateData.rateBand[1]}%, but ensure you compare quotes using the all-in APR of ${rateData.allInApr}%, which includes the ₹${rateData.procFeesAmt.toLocaleString('en-IN')} processing fee.`,
        emiWhy: `Do not agree to an EMI above ₹${emiData.maxSafeEmi.toLocaleString('en-IN')}, because if your income unexpectedly drops by 20%, your safe payment capacity shrinks to just ₹${emiData.strsMaxEmi.toLocaleString('en-IN')}.`
    };
}
