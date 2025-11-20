# Frontend Developer Case Study

This case study outlines a small but realistic fintech-oriented frontend application scenario. The goal is to evaluate engineering practices, code structure, and overall problem-solving approach. The candidate is expected to build components and workflows that demonstrate clean architecture, maintainability, and strong UI/UX fundamentals.

---

## Scenario

You are tasked with developing a **Fintech Client Dashboard** used by internal operations teams to view and manage customer wallet data. The dashboard should communicate with a fictional REST API and showcase modern frontend development best practices.

---

## Requirements

### 1. API Call Management

- Implement a structured API layer using a service module or a custom hook.
- Ensure consistent response handling and proper separation between UI and data-fetching logic.
- Demonstrate retry logic or graceful fallback mechanisms.
- Include request cancellation (when applicable) to avoid race conditions.

### 2. Reusable Form and Table Components

- Create a reusable **Form** component for customer data input (e.g., name, wallet limits, email).
- Build a reusable **Table** component displaying customer wallet activity and balances.
- Both components should be themeable, configurable, and support different data models.

### 3. Form Validations

- Implement both client-side validations and API-level error validation.
- Support field-specific validation rules (email format, numeric values, max/min length, etc.).
- Show validation error messages clearly and consistently.

### 4. Global Error Handling

- Implement a global error boundary or global error modal/toast system.
- Handle API errors, network failures, and unexpected UI breakdowns in a consistent manner.
- Provide user-friendly error messages while safely logging technical details.

### 5. Loading States

- Show loading skeletons or spinners for API-dependent views.
- Provide inline loading states within form submissions or table updates.
- Prevent inconsistent UI states or duplicate user actions during loading.

### 6. Environment Variables Usage

- All API URLs, keys, configuration values, and environment flags should be managed using environment variables.
- Demonstrate usage for dev/stage/prod environments.

### 7. Internationalization (i18n)

- Implement a basic i18n setup (e.g., English + Turkish).
- Provide examples of translated labels, errors, and table/form fields.
- Ensure dynamic language switching is supported.

---

## Tech Stack

- **SPA Framework**: Angular or React
- **Styling Options**: Tailwind CSS, Bootstrap, SASS, or any Theme Library

## API Docs

API Documentation is available at:

**[https://frontend-case-study.onrender.com/api-docs/](https://frontend-case-study.onrender.com/api-docs/)**

Use this to explore available endpoints, request/response structures, filtering options, and schemas for Customers, Wallets, and Transactions.

---

---

## Deliverables

- A Git repository containing:
  - Project setup
  - Reusable components
  - API services
  - Example pages/screens
  - i18n configuration
  - Instructions to run the project

---

## Evaluation Criteria

- **Architecture & Code Quality**: folder structure, separation of concerns, clean code.
- **Reusability**: component abstraction, flexibility, maintainability.
- **Error & State Management**: clarity, consistency, user experience.
- **Fintech Adaptation**: data types, validations, flows should reflect financial context.
- **Documentation**: clarity of README, configuration explanation, setup instructions.

---

## Optional Bonus Tasks

- Authorization/Authentication (Google, Firebase, Supabase, or GitHub)

- Permission-based UI behavior.

- Dark/light theme support.

- Unit tests for components or services.
