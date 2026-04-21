Edited PaymentTransferForm.tsx
Edited PaymentTransferForm.tsx
Edited PaymentTransferForm.tsx
Viewed .env:1-24

# System Overview – Banking App

## 1. Purpose
A **React‑based personal‑banking web application** that lets users:

* **Link external bank accounts** via Plaid.
* **View balances & transaction history**.
* **Create and send transfers** (Dwolla funding sources → Dwolla customers).
* **Manage accounts** stored in **Appwrite** (backend‑as‑a‑service).

The UI is built with **Next.js** (client‑side rendering), **shadcn/ui** components, and **react‑hook‑form** for robust form handling.

---

## 2. High‑Level Architecture

| Layer | Technology | Responsibility |
|-------|------------|-----------------|
| **Frontend** | Next.js (React), TypeScript, Tailwind CSS, shadcn/ui, react‑select, lucide‑react | UI, routing, form validation, state |
| **Auth / Data Store** | **Appwrite** (DB, auth, storage) | User accounts, collections for banks, transactions |
| **Bank Linking** | **Plaid** (client SDK) | Securely fetch account metadata from external banks |
| **Payments** | **Dwolla** (sandbox) | Create funding sources, execute ACH transfers |
| **Environment** | `.env` (NEXT_PUBLIC_*, secret keys) | Configurable endpoints and API keys for each service |

All data flows **client → Appwrite** (REST) → **Plaid/Dwolla** where needed; UI reacts to the responses.

---

## 3. Key Project Structure (relevant parts)

```
/src
 ├─ components/
 │   └─ TransferPage/
 │        └─ PaymentTransferForm.tsx   <-- Transfer form UI & logic
 ├─ types/
 │   └─ index.d.ts                    <-- Global TypeScript types
 ├─ app/…
 └─ ... (other pages, layout, UI components)
```

---

## 4. Data Flow Example – Transfer

1. **User selects source bank** (via the `Select` component).  
2. Form values are validated (Zod) → `onSubmit` fires.  
3. **API call** (client → Next.js API route):  
   * Reads the selected `Account` to get `appwriteItemId`.  
   * Calls **Appwrite** to fetch the related funding source URL.  
   * Sends a request to **Dwolla** to create a transaction (`CreateTransactionProps`).  
4. On success, the UI updates the transaction list (via `TransactionHistoryTableProps`).

---



### TL;DR

* **Frontend:** Next.js + TypeScript + Tailwind + shadcn/ui, forms validated by Zod.  
* **Backend services:** Appwrite (DB, auth), Plaid (bank linking), Dwolla (ACH payments).  
* **Core component:** `PaymentTransferForm` handles account selection & transfer submission.  
* **Configuration:** All keys/endpoints live in `.env`; public keys are prefixed with `NEXT_PUBLIC_`.  
* **Extensibility:** Add new types, API routes, or UI components following the existing patterns; keep secrets server‑side only.  
