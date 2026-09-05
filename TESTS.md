# Persona Testing & Outputs

## 1. Persona A: Priya (The Perfect Profile)

**Scenario:** A salaried professional with excellent credit, stable income, and full transparency. She answers every question.

### Inputs & Adaptive Flow

* **Step 1 (Basics):** Employment: `Salaried`, Loan: `Personal`, Amount: `₹8,00,000`, Age: `29`, Tenure: `3 Years`
* **Step 2 (Financials):** Net Income: `₹1,10,000`, Existing EMIs: `₹14,000`, Living Exp: `₹28,000`, Credit Score: `780`
* **Step 3 (Adaptive):** Because she is salaried, she is asked about *Emergency Savings*. She selects: `6+ months of expenses`.

### The Negotiation Card (Outputs)

* **Confidence Level:** **High** (No warnings generated. All data provided).
* **O1 - Final Verdict:** **Borrow**
* *Why:* "The requested ₹8,00,000 fits comfortably within your safe monthly budget, even if your income drops slightly."


* **O2 - Borrowing Capacity:** Lender Sanction: `₹12,34,408` | Safe Limit: `₹16,95,313`
* *Why:* "The lender's strict rules will cap you at ₹12,34,408, even though your low living expenses mean you could safely handle a loan up to ₹16,95,313."


* **O3 - Fair Rate & True Cost:** Expected Band: `10.5% - 19.0%` | All-In APR: `11.8%`
* *Why:* "Fair for your profile is 10.5% - 19%, but ensure you compare quotes using the all-in APR of 11.8%, which includes the ₹16,000 processing fee."


* **O4 - Monthly EMI Ceiling:** Max Safe EMI: `₹55,000` | Stressed Capacity: `₹37,200`
* *Why:* "Do not agree to an EMI above ₹55,000, because if your income unexpectedly drops by 20%, your safe payment capacity shrinks to just ₹37,200." *
* (Note: The absolute 50% cap successfully caught her EMI limit here).*

---

## 2. Persona B: Ravi (The Silent Self-Employed)

**Scenario:** A rushed business owner who skips all the optional fields to see what the app will do.

### Inputs & Adaptive Flow

* **Step 1 (Basics):** Employment: `Self-Employed`, Loan: `Business`, Amount: `₹5,00,000`, Age: `34`, Tenure: `3 Years`
* **Step 2 (Financials):** Net Income: `₹60,000`, Existing EMIs: `0`, Living Exp: `[Skipped]`, Credit Score: `[Skipped]`
* **Step 3 (Adaptive):** Because he is self-employed, he is asked about *Premises Ownership*. He leaves the dropdown on: `[Select an option...]`

### The Negotiation Card (Outputs)

* **Confidence Level:** **Low**
* *Warnings Displayed:*
1. "Credit score unknown: We widened your expected interest rate band to account for potential risk."
2. "Living expenses skipped: We assumed standard expenses of ₹24,000 (40% of income). This lowers our confidence in your exact safe limit."
3. "Collateral unknown: We could not apply the potential rate discount for owning your business premises."

* **O1 - Final Verdict:** **Borrow**
* *Why:* "The requested ₹5,00,000 fits comfortably within your safe monthly budget, even if your income drops slightly."


* **O2 - Borrowing Capacity:** Lender Sanction: `₹8,12,903` | Safe Limit: `₹9,03,225`
* *Why:* "The lender's strict rules will cap you at ₹8,12,903, even though your low living expenses mean you could safely handle a loan up to ₹9,03,225."


* **O3 - Fair Rate & True Cost:** Expected Band: `12.0% - 22.0%` | All-In APR: `13.3%`
* *Why:* "Fair for your profile is 12% - 22%, but ensure you compare quotes using the all-in APR of 13.3%, which includes the ₹10,000 processing fee."


* **O4 - Monthly EMI Ceiling:** Max Safe EMI: `₹30,000` | Stressed Capacity: `₹19,200`
* *Why:* "Your safe EMI ceiling is ₹30,000, but if your income drops by 20%, you can only carry ₹19,200."

---

## 3. Persona C: Anita (The High-Risk Informal Worker)

**Scenario:** A gig worker (delivery rider) with highly volatile income, poor credit, and a recent bounced payment history.

### Inputs & Adaptive Flow

* **Step 1 (Basics):** Employment: `Informal`, Loan: `Personal`, Amount: `₹1,00,000`, Age: `25`, Tenure: `2 Years`
* **Step 2 (Financials):** Net Income: `₹25,000`, Existing EMIs: `₹5,000`, Living Exp: `₹15,000`, Credit Score: `620`
* **Step 3 (Adaptive):** Because she is informal, she is asked about *Recent EMI Bounces*. She selects: `1 bounce`.

### The Negotiation Card (Outputs)

* **Confidence Level:** **High** (All requested data was provided, no fallbacks required).
* **O1 - Final Verdict:** **Don't Borrow**
* *Why:* "With recent bounced payments and zero buffer if your income drops, taking on new debt right now is highly unsafe."


* **O2 - Borrowing Capacity:** Lender Sanction: `₹1,32,771` | Safe Limit: `₹53,108`
* *Why:* "Fair for your profile is 12% - 22%, but ensure you compare quotes using the all-in APR of 13.3%, which includes the ₹10,000 processing fee."


* **O3 - Fair Rate & True Cost:** Expected Band: `15.5% - 27.0%` | All-In APR: `17.42%`
* *Why:* "Fair for your profile is 12% - 22%, but ensure you compare quotes using the all-in APR of 13.3%, which includes the ₹10,000 processing fee." 
* (Note: High base rate triggered by Informal + Poor Credit penalties).


* **O4 - Monthly EMI Ceiling:** Max Safe EMI: `₹2,500` | Stressed Capacity: `₹0`
* *Why:* "Do not agree to an EMI above ₹2,500, because if your income unexpectedly drops by 20%, your safe payment capacity shrinks to just ₹0." 
* (Note: The 20% income stress test completely wiped out her remaining cash flow).
