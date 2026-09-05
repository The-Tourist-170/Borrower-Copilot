# Borrower Copilot

Borrower Copilot is an adaptive, zero-backend React web application designed to help Indian borrowers self-assess their true loan eligibility before walking into a bank.

Unlike standard bank calculators that maximize lending based on FOIR (Fixed Obligation to Income Ratio), this Copilot separates the **Lender's Sanction Limit** from the **Borrower's Safe Limit**, factoring in living expenses, emergency buffers, and income stress tests to prevent over-leveraging.

## Installation & Running the App

You can run this project locally using either **npm** or **Bun** for a faster development experience.

### 1. Clone the repository

```bash
git clone <your-repository-url>
cd borrower-copilot

```

### 2. Install dependencies & Run

**Using npm:**

```bash
npm install
npm run dev

```

**Using Bun:**

```bash
bun install
bun dev

```

Open your browser and navigate to `http://localhost:5173` (or the port provided by Vite in your terminal) to view the application.

---

## Tech Stack

* **Framework:** React 18
* **Build Tool:** Vite
* **Styling:** Tailwind CSS
* **Language:** JavaScript (ES6+)
* **Architecture:** Strictly decoupled UI (`/components`) and Business Logic (`/utils/rulesEngine.js`).

## Key Features

* **Adaptive Questionnaire:** The UI dynamically changes branching questions based on employment type (Salaried, Self-Employed, Informal).
* **"Unknown is Never Zero" Engine:** The app safely handles missing data. If a user skips living expenses, it assumes a 40% survival baseline. If they don't know their credit score, it widens the rate bands instead of assuming zero risk.
* **Negotiation Card:** A final, one-screen dashboard that generates a definitive verdict (Borrow, Borrow Less, Don't Borrow) backed by transparent, one-sentence mathematical explanations.

---

## The Rules Engine: Formulas & Mathematical Logic

The core logic resides entirely in `src/utils/rulesEngine.js`. Below is a detailed breakdown of the exact formulas used to calculate the outputs on the Negotiation Card.

### 1. Lender's Sanction Limit (The Bank's View)

Banks rely on the Fixed Obligation to Income Ratio (FOIR) to determine the maximum EMI they will allow, ignoring actual living expenses.

* **FOIR Cap:** 50% for Salaried, 45% for Self-Employed/Informal.
* **Max Bank EMI** = `(Net Income × FOIR) - Existing EMIs`
* **Lender Sanction Amount** = Calculated using the Present Value (PV) of an Annuity formula:
`Max Bank EMI × [ ((1 + r)^n - 1) / (r × (1 + r)^n) ]`
*(Where `r` is the monthly interest rate and `n` is the tenure in months).*

### 2. Borrower's Safe Limit (The Reality Check)

We calculate actual affordability by looking at cash flow, strictly capping it to prevent the borrower from becoming house-poor.

* **Cashflow Safe EMI** = `Net Income - Existing EMIs - Living Expenses - (10% Emergency Buffer)`
* **Absolute Affordability Cap** = `Net Income × 50%` *(A hard ceiling based on the 50/30/20 rule).*
* **Final Safe EMI** = `Minimum(Cashflow Safe EMI, Absolute Affordability Cap)`
* **Borrower Safe Amount** = `Final Safe EMI × PV Factor`

### 3. True APR (Annual Percentage Rate)

Banks quote a "base rate" and charge a flat processing fee. We use the **Constant Ratio Method** (a standard actuarial approximation) to convert that flat fee into an annualized percentage, revealing the true cost of the loan.

* **Formula:** `Base Rate + (Processing Fee % × 24 / (Tenure in Months + 1))`
* *Description:* This guarantees the APR displayed is mathematically sound and always higher than the base interest rate.

### 4. Stress-Tested Capacity

To protect against job losses or pay cuts, the engine simulates a 20% drop in net income and recalculates the safe EMI ceiling.

* **Stressed Income** = `Net Income × 0.80`
* **Stressed Buffer** = `Stressed Income × 0.10`
* **Stressed Safe EMI** = `Minimum((Stressed Income - Existing EMIs - Living Expenses - Stressed Buffer), Stressed Income × 0.50)`

---

## Defensive Design: Handling Missing Data

The application is designed to degrade gracefully and prioritize borrower safety when data is missing:

1. **Missing Living Expenses:** If the borrower leaves this blank, the engine assumes **40% of their net income** goes toward basic survival. It never assumes ₹0.
2. **Missing Credit Score:** If skipped, the engine defaults the score to `0` internally, which triggers a risk penalty that widens the expected Interest Rate Band by +1% to +4%.
3. **Missing Emergency Savings:** If a salaried worker skips the optional savings question, the engine enforces a strict 10% cash flow buffer instead of offering a 5% discounted buffer.

*Whenever the engine has to make one of these fallback assumptions, it lowers the "Confidence Level" on the final Negotiation Card and outputs explicit warnings detailing exactly what was guessed.*
