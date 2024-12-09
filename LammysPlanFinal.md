```markdown
# Lammy’s Multi Service Website Plan

Lammy’s Multi Service Website aims to streamline online bookings for a variety of services offered. The platform accommodates **registered customers**, **guest users**, and **administrators**, offering tools for managing bookings, services, payments, and analytics.

---

## Key Features

1. **Public Pages**:
   - Display services, prices, and store details.
   - Allow both registered and guest users to book appointments seamlessly.

2. **User & Guest Experience**:
   - **Registered Users**: Access dashboards, track bookings, manage personal info, and view payment history.
   - **Guest Users**: Quickly schedule services without creating an account, receive confirmation emails, and have the option to convert to a registered account later.

3. **Admin Portal**:
   - Comprehensive CRUD (Create, Read, Update, Delete) operations for managing services, items, and bookings.
   - Detailed analytics on sales, user activity, and service performance.

4. **Payment Integration**:
   - Secure payment processing through Stripe.
   - Real-time data synced with Stripe webhooks for accurate sales analytics.

5. **Email Automation**:
   - Booking confirmations and reminders sent via Gmail (or another email provider).
   - Guest users receive temporary booking confirmation links to view and manage their appointments.

---

## Site Map

### Public Pages

1. **Home**
   - Introduction to Lammy’s Multi Service.
   - Highlights of services, promotions, and special offers.

2. **Services**
   - Complete list of offered services.
   - Prices, descriptions, and any relevant service-specific FAQs.

3. **Booking**
   - Service selection.
   - Appointment scheduling (date, time, additional instructions).
   - Payment processing via Stripe.
   - **Guest Booking Flow**: Guest users can book without registering. After payment confirmation, they receive a unique URL to review or modify the booking.

4. **Login/Register**
   - User authentication for registered customers.
   - Option for quick guest checkout.

5. **Contact Us**
   - Contact form to reach the store.
   - Store location, operating hours, and phone number.

6. **FAQs**
   - Common questions and their answers.
   - Includes a section addressing guest bookings, payment, and cancellation policies.

---

### User Account Pages (For Registered Users Only)

1. **Dashboard**
   - View upcoming bookings.
   - Access booking and payment history.
   - Quick re-book options for previously used services.

2. **Profile Settings**
   - Update personal details (name, email, contact number).
   - Change password.
   - Convert from guest to full account if not already registered.

3. **Order History**
   - Access past services and their payment records.
   - Quickly replicate a past service selection and schedule.

---

### Guest User Experience

- **Create a Booking Without an Account**:
  - Guest users select services, date, and time.
  - Securely pay via Stripe.
  - Post-payment, guests receive a booking confirmation email containing a unique link to view or modify their appointment.
  
- **Manage Guest Bookings**:
  - Using the unique booking link sent via email, guests can:
    - View appointment details.
    - Add special instructions or reschedule (if allowed).
    - Cancel the booking (subject to store policies).
  
- **Convert to a Registered Account**:
  - At any point, a guest user can choose to register for a full account.
  - Registration grants them:
    - Access to a dashboard.
    - A complete booking history.
    - Faster checkout for future orders.

---

### Admin Portal (Secured Access)

1. **Dashboard**
   - Overview of business metrics.
   - Graphs/charts for revenue trends, top services, and user activity (including guest traffic vs. registered user bookings).

2. **Manage Services**
   - Full CRUD operations for services.
   - Update service names, descriptions, prices, and availability.

3. **Manage Items**
   - Handle inventory or detailed service item lists.
   - Add, update, or remove items as needed.

4. **Manage Bookings**
   - View, modify, or cancel bookings (including those from guest users).
   - Assign special instructions or notes for pickup/dropoff.
   - Handle disputes or requests for changes.

5. **User Management**
   - Manage both registered customers and guest users who convert.
   - Edit user roles, reset passwords, or assist with account issues.

6. **Settings**
   - Update business information.
   - Configure payment methods, email settings, and notification templates.

---

## Technical Highlights

1. **Authentication & Database**
   - **Supabase** for user authentication and data storage.
   - Role-Based Access Control (RLS) to differentiate between guests, registered users, and admins.
   - Real-time database subscriptions to reflect live updates (e.g., guest booking confirmations).

2. **Frontend**
   - Built with **Next.js 13+** and the App Router.
   - Written in **TypeScript** for type safety.
   - Styled with **Tailwind CSS** for a responsive UI.
   - **React Query** for efficient data fetching and state management.

3. **Backend**
   - **Supabase Edge Functions** for serverless logic (e.g., handling Stripe webhooks).
   - **PostgreSQL** database (through Supabase).
   - **Stripe** integration for secure payments.
   - **SendGrid/Mailgun** for email notifications (guest booking confirmations, reminders, and updates).

4. **Security**
   - Strict RLS policies to ensure that guest users can only access their own bookings via unique links.
   - HTTPS encryption and secure environment variables.
   - CSRF protection and rate limiting to prevent abuse.

5. **Performance**
   - Server-Side Rendering (SSR) for initial page load optimization.
   - Image optimization and caching via the Next.js Image component.
   - Lazy loading of non-critical components.

---

## Supabase Integration Architecture

### 1. Supabase Services Integration

- **Authentication**:
  - Email/Password for registered users.
  - Guest users are represented by a record linked to a booking but not assigned login credentials, ensuring they have restricted yet secure access via a unique token-based URL.
  - Admins identified by an `is_admin` flag.

- **Database Collections**:
  ```text
  /users
    |- userId
       |- profile
       |- preferences
       |- role (is_admin)
  /bookings
    |- bookingId
       |- userId (nullable for guests, replaced by a guest_token)
       |- services
       |- status
       |- payment
  /services
    |- serviceId
       |- name
       |- price
       |- description
  /payments
    |- paymentId
       |- bookingId
       |- amount
       |- timestamp
  ```

- **Storage**:
  - Storing service images, receipts, and relevant documents.

---

### 2. Stripe Webhooks

**Workflow**:
1. Customers (guest or registered) complete payments via Stripe.
2. Stripe triggers a webhook on successful payment.
3. A Supabase Edge Function processes the webhook event and records the payment in the `payments` table.
4. Real-time updates display accurate sales analytics to admins and confirm bookings for guest users.

**Example Webhook Function**:
```javascript
import { buffer } from "micro";
import Stripe from "stripe";
import { getSupabase } from "@supabase/auth-helpers-nextjs";

export const config = {
  api: { bodyParser: false },
};

export default async function handler(req, res) {
  if (req.method === "POST") {
    const buf = await buffer(req);
    const sig = req.headers["stripe-signature"];
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    const supabase = getSupabase();

    try {
      const event = Stripe.webhooks.constructEvent(buf, sig, webhookSecret);

      if (event.type === "payment_intent.succeeded") {
        const paymentIntent = event.data.object;
        await supabase.from("payments").insert({
          booking_id: paymentIntent.metadata.booking_id,
          amount: paymentIntent.amount_received / 100,
          created_at: new Date(),
        });
      }

      res.status(200).json({ received: true });
    } catch (err) {
      console.error(err.message);
      res.status(400).send(`Webhook Error: ${err.message}`);
    }
  } else {
    res.status(405).send("Method Not Allowed");
  }
}
```

---

## Detailed Sales Analytics

- **Revenue Trends**:
  - Line charts for daily, weekly, or monthly revenue.
  
- **Top Services**:
  - Bar charts for best-selling services.
  
- **User Activity & Guest Conversion**:
  - Pie charts or metrics showing the ratio of guest bookings vs. registered user bookings.
  - Trend lines for guest-to-registered user conversions.

- **Filtering & Segmentation**:
  - Date range filters.
  - Service category breakdowns.
  - User type segmentation (guest vs. registered).

---

## Deployment and Maintenance

1. **Deployment**:
   - Host frontend and Edge Functions on **Vercel**.
   - Environment variables configured for Supabase, Stripe, and email providers.

2. **Domain Setup**:
   - Primary domain: `lammys.au`.
   - Deployed via Vercel for quick rollbacks and continuous deployment.

3. **Monitoring**:
   - Supabase Analytics for user behavior, including guest user booking flows.
   - Error tracking tools (Sentry) for prompt issue resolution.

4. **Backup & Recovery**:
   - Regular Supabase database backups.
   - Disaster recovery plan in place.

---

## Key Updates for Guest Users

1. **Database Schema**:
   - `bookings` table allows `user_id` to be null for guests.
   - Introduce a `guest_token` column or a unique lookup field to identify guest bookings.

2. **Guest Access Control**:
   - RLS ensures that guest bookings can only be accessed via a unique token.
   - Guest users cannot view or modify other users’ bookings.

3. **Conversion to Registered User**:
   - Guest booking confirmation emails include a link to register.
   - Once registered, the new account is associated with past guest bookings for continuity.

---

## Updated Database Schema

### Users Table
```sql
CREATE TABLE users (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email VARCHAR(150) UNIQUE,
    name VARCHAR(100),
    is_admin BOOLEAN DEFAULT FALSE,
    password_hash TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    -- Note: For guest users, this record may not be created until conversion.
    -- Email and password_hash can be NULL for non-registered guests.
);
```

### Bookings Table
```sql
CREATE TABLE bookings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    guest_token TEXT,  -- Unique token for guest bookings
    service_id UUID REFERENCES services(id),
    pickup_time TIMESTAMP,
    dropoff_time TIMESTAMP,
    special_instructions TEXT,
    status VARCHAR(20) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT NOW(),
    -- If user_id is NULL, guest_token is required.
    -- RLS ensures guests can only see their own bookings via guest_token.
);
```

### Services Table
```sql
CREATE TABLE services (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    price NUMERIC(10, 2) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);
```

### Payments Table
```sql
CREATE TABLE payments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    booking_id UUID REFERENCES bookings(id) ON DELETE CASCADE,
    amount NUMERIC(10, 2) NOT NULL,
    payment_method VARCHAR(50),
    status VARCHAR(20) DEFAULT 'successful',
    created_at TIMESTAMP DEFAULT NOW()
);
```

---

## Authentication Enhancements

1. **Admin Role**:
   - `is_admin` field in `users` table determines admin privileges.

2. **Email Confirmation**:
   - Enabled via Supabase for full account creation.
   - Guest bookings do not require confirmed emails, but confirmation is required when converting to a registered user.

3. **Guest Booking Security**:
   - Unique guest_token and secure URLs ensure that only the guest can access their booking details.

---

## Stripe Integration

1. Payments processed securely through Stripe.
2. Webhooks update `payments` table for real-time analytics.
3. Support for partial refunds or cancellations.

---

## Supabase Edge Functions

1. **Webhook Handling**:
   - Edge Functions process Stripe webhooks.
   - Immediate database updates ensure the admin dashboard and guest booking links reflect the latest information.

---

Lammy’s Multi Service Website thereby provides a seamless, user-friendly platform for both one-time guest users and loyal registered customers, backed by secure, efficient, and scalable technologies.
```