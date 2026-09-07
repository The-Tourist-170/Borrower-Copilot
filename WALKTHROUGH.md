## Borrower Copilot: Project Walkthrough & Reflection

### 1. The Build: What We Achieved

The goal was to build a zero-backend tool that arms Indian borrowers with their true financial standing before they negotiate with a lender.

From an engineering perspective, the biggest achievement is the **strict decoupling of the rules engine from the UI**. The math lives entirely in `utils/rulesEngine.js`. The React components merely collect state and render the output.

Key product highlights include:

* **The Absolute Affordability Cap:** We bypassed standard bank logic (FOIR) and implemented a strict 50% net-income cap. This prevents the engine from accidentally advising high-income/low-expense users to take on astronomical EMIs that make them "house-poor."
* **Adaptive Flow:** The questionnaire dynamically shifts based on employment type. A salaried worker is asked about emergency savings, while a gig worker is asked about bounced EMIs.
* **Defensive Fallbacks ("Unknown is never zero"):** If a user refuses to enter their living expenses, the engine doesn't break or assume ₹0. It mathematically assumes a 40% subsistence baseline, calculates the safe limit, and visibly lowers the "Confidence Score" on the final card to tell the user exactly why their limit shrank.

### 2. What I Would Add Next

If we had another week to build out version 2.0, I would prioritize these features:

* **PDF Export / Print View:** The primary use case of the Negotiation Card is leverage. Adding a `window.print()` formatted stylesheet or a PDF generator so the borrower can physically hand the card to a loan officer would massively increase the tool's utility.
* **Amortization Visualizer:** A simple chart (using Recharts or Chart.js) showing how much of their EMI goes to interest versus principal in the first 3 years. This visually reinforces why they shouldn't take the longest possible tenure.
* **Vernacular Support:** To truly serve the "informal" persona (like Anita, the delivery rider), the UI needs a language toggle for Hindi and regional languages. Financial terminology is intimidating enough in English.

### 3. What I Would Cut

To ruthlessly optimize the funnel and reduce user friction, I would cut inputs that don't mathematically alter the output:

* **The "Age" Input:** While standard on bank forms, our current engine relies on the user's inputted tenure rather than calculating max retirement age. Unless we add logic to cap home loan tenures at age 60, this field is dead weight.
* **The "Loan Purpose" Input:** Whether the user wants a personal loan for a wedding or a medical emergency doesn't change the underlying interest rate band or risk profile—the "Loan Type" dropdown already handles that. Cutting this removes one extra click from Step 1.
