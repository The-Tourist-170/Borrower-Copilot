# RULES.md - Borrower Copilot Logic & Assumptions

This document outlines the mathematical rules, domain assumptions, and penalty bands used in the Borrower Copilot Rules Engine (`utils/rulesEngine.js`). The engine separates the lender's rigid internal math from the borrower's actual safe reality.

## 1. Affordability & Limits

| Rule / Metric | Value / Threshold | Application / Context | Source / Justification |
| --- | --- | --- | --- |
| **FOIR (Fixed Obligation to Income Ratio)** | Salaried: **50%**<br>

<br>Self-Employed: **45%** | Calculates the `lenderSancAmt`. Lenders cap total EMIs at this percentage of income. | **Standard Indian Retail Banking Norms** (e.g., SBI and HDFC typical FOIR limits for mid-tier incomes). |
| **Absolute EMI Cap** | **Max 50% of Net Income** | Hard cap on safe EMI. Prevents high-income/low-expense borrowers from becoming "house-poor." | **50/30/20 Financial Rule** (Needs and debt obligations should never exceed 50% of net take-home pay). |
| **Standard Safety Buffer** | **10% of Net Income** | Subtracted from cash flow to determine the borrower's safe EMI limit. | **CFP (Certified Financial Planner) Guidelines** for monthly liquidity and emergency buffering. |
| **Living Expenses Fallback** | **40% of Net Income** | Applied if the borrower leaves "Living Expenses" blank. | **Retail Lending Underwriting Norms** (Minimum Subsistence Level assumptions used when declared expenses are missing or unrealistically low). |
| **Stress Test Impact** | **-20% of Net Income** | Calculates `strsMaxEmi` to show the borrower what happens if they face a job loss or pay cut. | **NBFC Income Shock Models** (Standard risk-management stress tests for unsecured retail lending). |

## 2. Interest Rate & Fee Bands

Base rates and processing fees reflect actual Indian lending market averages.

| Loan Type | Base Rate Band | Processing Fee | Source / Justification |
| --- | --- | --- | --- |
| **Home Loan** | 8.5% - 10.5% | 0.5% | **Market Average** (Pegged to RBI Repo-Linked Lending Rates / RLLR). |
| **Personal Loan** | 10.5% - 20.0% | 2.0% | **Market Average** (Standard unsecured lending rates from major Private Banks/NBFCs). |
| **Business Loan** | 11.0% - 18.0% | 2.0% | **Market Average** (MSME and unsecured business loan averages). |
| **Gold Loan** | 9.0% - 12.0% | 1.0% | **Market Average** (Secured retail lending averages e.g., Muthoot, SBI). |

### 2.1 Risk Modifiers (Credit & Profile)

These modifiers adjust the base rates dynamically based on borrower profile.

| Rule / Metric | Modifier | Application / Context | Source / Justification |
| --- | --- | --- | --- |
| **Unknown/No Credit Score** | Min: **+1.0%**, Max: **+4.0%** | Widens the band massively. Enforces "Unknown is never zero." | **Challenge Brief Requirement** & **NBFC New-To-Credit (NTC) Premiums**. |
| **Poor Credit (< 650)** | Min: **+3.0%**, Max: **+4.0%** | Heavy penalty for subprime borrowers. | **TransUnion CIBIL Risk Tier Pricing** (Scores below 650 represent high historical default probability). |
| **Fair Credit (650 - 699)** | Min: **+1.5%**, Max: **+2.0%** | Moderate penalty. | **TransUnion CIBIL Risk Tier Pricing** (Near-prime borrower segment). |
| **Good Credit (700 - 799)** | Max: **-1.0%** | Shrinks the upper band limit. | **TransUnion CIBIL Risk Tier Pricing** (Standard prime segment threshold is typically 750+). |
| **Excellent Credit (800+)** | Min: **-0.5%**, Max: **-2.0%** | Discounted rates for top-tier prime borrowers. | **TransUnion CIBIL Risk Tier Pricing** (Super-prime segment pricing power). |
| **Informal Employment** | Min: **+2.0%**, Max: **+3.0%** | Risk premium for volatile cash flows (e.g., daily wage earners, gig workers). | **Microfinance (MFI) Risk Premiums** (Compensating for lack of formal income documentation). |

### 2.2 APR Math

| Rule / Metric | Formula | Context | Source / Justification |
| --- | --- | --- | --- |
| **True APR Approximation** | `Base Rate + (Proc Fee % * 24 / (Tenure in Months + 1))` | Transforms a flat processing fee into an annualized percentage rate impact. | **The Constant Ratio Method** (A standard actuarial formula used in finance to approximate APR without complex iterative calculus). |

## 3. Verdict Logic (O1)

The verdict engine forces a definitive answer based strictly on cash flow math.

| Verdict | Trigger Condition | Rationale | Source / Justification |
| --- | --- | --- | --- |
| **Don't Borrow** | `borrSafeAmt <= 0` | Current expenses and existing EMIs leave absolutely zero room for a new loan. | **Challenge Brief Requirement** |
| **Don't Borrow (High Risk)** | `recBounces > 0` AND `strsMaxEmi <= 0` | Borrower has a recent track record of default AND no financial buffer to absorb shocks. | **Strict Underwriting Policy** (Recent bounces are automatic rejection criteria for most algorithmic lending). |
| **Borrow Less** | `reqAmt > borrSafeAmt` | The borrower requested an amount that breaks their safe limits. | **Responsible Lending/Copilot Logic** |
| **Borrow** | `reqAmt <= borrSafeAmt` | The requested loan fits perfectly within their safe monthly cash flow. | **Responsible Lending/Copilot Logic** |
