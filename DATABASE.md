# KAIA 5.0 - Database Documentation

## Overview

This document explains how the MySQL database works as the backend for the KAIA 5.0 behavioral test platform.

## Database Schema

### 1. Users Table (`users`)
Stores all user information with authentication support.

```sql
- id: Primary key
- email: Unique user email
- name: User's full name
- password_hash: For future login authentication
- phone: Contact phone
- company: Company/organization
- role: user | admin | super_admin
- status: active | inactive | suspended | pending
- email_verified: Boolean for email verification
- verification_token: Token for email verification
- reset_token: Token for password reset
- last_login: Last login timestamp
- login_count: Number of logins
- created_at, updated_at: Timestamps
```

### 2. User Profiles (`user_profiles`)
Extended profile information.

```sql
- user_id: Foreign key to users
- avatar_url: Profile picture URL
- bio: User biography
- linkedin_url: LinkedIn profile
- position, department: Work info
- experience_years: Years of experience
- education: Education level
- skills: JSON array of skills
- preferences: JSON user preferences
```

### 3. Plans (`plans`)
Subscription/purchase plans.

```sql
- name: Plan name (e.g., "Autoconhecimento Total")
- slug: URL-friendly identifier
- price: Plan price (59.90)
- currency: BRL, USD, etc.
- interval_type: one_time | monthly | quarterly | yearly
- features: JSON with included features
- tests_included: Number of tests
- is_active: If plan is available
```

### 4. Subscriptions (`subscriptions`)
User subscriptions to plans.

```sql
- user_id: Foreign key to users
- plan_id: Foreign key to plans
- status: active | paused | cancelled | expired | pending
- starts_at, expires_at: Validity period
- tests_remaining: Remaining tests
- auto_renew: Auto-renewal flag
```

### 5. Payments (`payments`)
Complete payment history with gateway integration.

```sql
- user_id: Foreign key to users
- subscription_id: Optional FK to subscriptions
- amount: Payment amount
- currency: Payment currency
- status: pending | processing | completed | failed | refunded | cancelled
- payment_method: credit_card | debit_card | pix | boleto | paypal | stripe
- gateway: Payment gateway name
- gateway_payment_id: External payment ID
- gateway_response: Full JSON response from gateway
- invoice_url, receipt_url: Document URLs
- paid_at, refunded_at: Transaction timestamps
- metadata: Additional JSON data
```

### 6. KAIA Tokens (`kaia_tokens`)
Sequential tokens for test access.

```sql
- sequential_number: Unique sequential number (1, 2, 3...)
- user_id: Optional FK to users
- email, name: Assigned user info
- payment_id: FK to payment that generated this token
- status: available | assigned | used | expired | revoked
- assigned_at, used_at, expires_at: Lifecycle timestamps
```

### 7. KAIA Sessions (`kaia_sessions`)
Test sessions with complete data.

```sql
- token_id: FK to kaia_tokens
- user_id: FK to users
- user_name, user_email: Session user info
- language: pt-br | en | es
- current_state: idioma | auth | disc | sabotadores | qp | report | completed
- disc_answers: JSON with DISC responses
- disc_scores: JSON with calculated DISC scores
- sabotadores_answers, sabotadores_scores: Sabotadores data
- qp_answers, qp_score: QP data
- final_report: Full text report
- report_pdf_url: URL to generated PDF
- conversation_history: Full chat history JSON
- duration_minutes: Test duration
- ip_address, user_agent: Client info
```

### 8. Reports (`reports`)
Generated PDF reports.

```sql
- session_id: FK to kaia_sessions
- user_id: FK to users
- report_type: disc | sabotadores | qp | full | custom
- report_text: Full report content
- report_data: JSON structured data
- pdf_url: PDF file URL
- share_token: Unique token for sharing
- is_public: Public visibility
- view_count: Number of views
```

### 9. Webhook Logs (`webhook_logs`)
Payment gateway webhook history.

```sql
- gateway: Payment gateway name
- event_type: Webhook event type
- event_id: External event ID
- payload: Full JSON payload
- processed: Boolean if processed
- error_message: Error details if failed
```

### 10. Audit Logs (`audit_logs`)
Track all important actions.

```sql
- user_id: Who performed action
- action: Action type (login, payment, etc.)
- entity_type, entity_id: Affected entity
- old_values, new_values: Change details JSON
- ip_address, user_agent: Client info
```

### 11. Coupons (`coupons`)
Discount coupons.

```sql
- code: Unique coupon code
- discount_type: percentage | fixed
- discount_value: Discount amount
- max_uses: Maximum usage count
- used_count: Current usage
- min_purchase: Minimum purchase value
- valid_from, valid_until: Validity period
```

---

## API Endpoints

### Public Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Health check |
| GET | `/` | Landing page |
| GET | `/teste-kaia` | KAIA 5.0 test page |
| POST | `/api/kaia/validate-token` | Validate access token |
| POST | `/api/kaia/chat` | Send message to KAIA AI |
| GET | `/api/kaia/session/:id` | Get session state |

### Payment Webhook

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/payments/webhook` | Receive payment notifications |

**Webhook payload:**
```json
{
  "gateway": "stripe",
  "event": "payment.completed",
  "payment_id": "pay_abc123",
  "status": "completed",
  "amount": 59.90,
  "email": "user@email.com",
  "metadata": {
    "name": "User Name"
  }
}
```

### Admin Endpoints (require `X-Admin-Key` header)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/admin/dashboard` | Dashboard statistics |
| GET | `/api/admin/users` | List all users |
| GET | `/api/admin/users/:id` | Get user details |
| GET | `/api/admin/payments` | List all payments |
| GET | `/api/admin/tokens` | List all tokens |
| GET | `/api/admin/sessions` | List all test sessions |
| GET | `/api/admin/reports` | List all reports |
| POST | `/api/kaia/generate-tokens` | Generate new tokens |
| POST | `/api/kaia/assign-token` | Assign token to user |

---

## Environment Variables

```env
# Server
PORT=3001

# Database
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=kaia

# AI
GEMINI_API_KEY=your_gemini_api_key

# Admin
KAIA_ADMIN_KEY=your_admin_secret_key
```

---

## Integration Flow

### 1. Customer Purchase Flow

```
1. Customer clicks "Buy" on landing page
2. Redirected to payment gateway (Stripe/PagSeguro/etc.)
3. Customer completes payment
4. Gateway sends webhook to /api/payments/webhook
5. System creates:
   - User record (if new)
   - Payment record
   - Assigns next available token
6. Customer receives email with token number
7. Customer accesses /teste-kaia
8. Enters Name, Email, Token
9. Token validated → Test starts
10. After completion → PDF generated
```

### 2. Token Lifecycle

```
available → assigned (after payment) → used (after test) → expired (optional)
```

### 3. Session States

```
idioma → disc → sabotadores → qp → report → completed
```

---

## Setting Up MySQL

### Option 1: Local MySQL

```bash
# Install MySQL
sudo apt install mysql-server

# Create database
mysql -u root -p
CREATE DATABASE kaia;
CREATE USER 'kaia_user'@'localhost' IDENTIFIED BY 'strong_password';
GRANT ALL PRIVILEGES ON kaia.* TO 'kaia_user'@'localhost';
FLUSH PRIVILEGES;
```

### Option 2: PlanetScale (Recommended for Production)

1. Create account at https://planetscale.com
2. Create new database
3. Get connection string
4. Add to `.env`: `DATABASE_URL=mysql://...`

### Option 3: Railway

1. Create account at https://railway.app
2. Add MySQL plugin
3. Copy connection variables to `.env`

---

## Running Locally

```bash
# Clone repository
git clone <repo-url>
cd KaiaLPV

# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Edit .env with your values

# Start server
npm run dev

# Server runs at http://localhost:3001
```

---

## Admin Dashboard Access

To access admin endpoints, add the header:

```bash
curl -H "X-Admin-Key: your_admin_key" http://localhost:3001/api/admin/dashboard
```

Or in JavaScript:

```javascript
fetch('/api/admin/dashboard', {
  headers: {
    'X-Admin-Key': 'your_admin_key'
  }
})
```

---

## Generating Tokens (Admin)

```bash
curl -X POST http://localhost:3001/api/kaia/generate-tokens \
  -H "Content-Type: application/json" \
  -d '{"count": 100, "adminKey": "your_admin_key"}'
```

Response:
```json
{
  "success": true,
  "message": "Generated 100 tokens",
  "tokens": [1, 2, 3, ..., 100],
  "range": { "from": 1, "to": 100 }
}
```

---

## Questions?

For support, contact the development team.
