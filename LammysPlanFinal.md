### **LammysPlan.md**

```markdown
# Lammy’s Dry Cleaning Website Plan

Lammy’s Dry Cleaning Website is a user-friendly platform designed to streamline online bookings for dry cleaning services. The site caters to customers and administrators, providing efficient tools for managing bookings, services, payments, and business metrics.

---

## Key Features

1. **Public Pages**:
   - Showcase services, prices, and store information.
   - Enable users to book appointments seamlessly.

2. **User Dashboard**:
   - Track upcoming bookings, payment history, and personal details.

3. **Admin Portal**:
   - Full CRUD (Create, Read, Update, Delete) access to manage services and items.
   - View bookings and monitor business metrics via detailed analytics charts.

4. **Payment Integration**:
   - Secure payment processing through Stripe API.
   - Real-time data from Stripe webhooks to display sales analytics.

5. **Email Automation**:
   - Send booking confirmations and reminders via Gmail

---

## Site Map

### Public Pages

1. **Home**
   - Introduction to Lammy’s.
   - Highlights services and special offers.

2. **Services**
   - List of dry cleaning services.
   - Prices and descriptions.

3. **Booking**
   - Service selection.
   - Appointment scheduling.
   - Payment processing via Stripe.

4. **Login/Register**
   - User authentication.
   - Option to continue as a guest.

5. **Contact Us**
   - Contact form.
   - Store location and operating hours.

6. **FAQs**
   - Common questions and answers.

---

### User Account Pages

1. **Dashboard**
   - View upcoming bookings.
   - Access booking history.
   - Update personal information.

2. **Profile Settings**
   - Update personal details.
   - Change password.

3. **Order History**
   - View past services and payments.
   - Option to re-book previous services.

---

### Admin Portal (Secured Access)

1. **Dashboard**
   - Display graphs and charts showing business metrics.
   - Analytics include revenue trends, top services, and user activity.

2. **Manage Services**
   - Perform CRUD operations for services.
   - Add or update descriptions, prices, and availability.

3. **Manage Items**
   - CRUD operations for inventory or specific service items.

4. **Manage Bookings**
   - View, update, or cancel customer bookings.

5. **User Management**
   - Manage customer accounts.
   - Assign roles and permissions.

6. **Settings**
   - Update business information.
   - Configure payment and email settings.

---

## Technical Highlights

1. **Authentication & Database**
   - Supabase for user authentication and data storage
   - Row Level Security (RLS) for fine-grained access control
   - Real-time subscriptions for live updates

2. **Frontend**
   - Next.js 13+ with App Router
   - TypeScript for type safety
   - Tailwind CSS for styling
   - React Query for data fetching

3. **Backend**
   - Supabase Edge Functions for serverless computing
   - PostgreSQL database with Supabase's real-time capabilities
   - Stripe integration for payments
   - SendGrid/Mailgun for email notifications

4. **Security**
   - Role-based access control via Supabase RLS
   - Secure environment variables
   - HTTPS encryption
   - CSRF protection
   - Rate limiting

5. **Performance**
   - Server-side rendering with Next.js
   - Image optimization
   - Edge caching
   - Lazy loading components

---

## Supabase Integration Architecture

### 1. Supabase Services Integration
- **Authentication**:
  - Email/Password authentication.
  - Role-based access control for user and admin roles.
  - Protected route management.

- **Database**:
  - Collections:
    ```
    /users
      |- userId
         |- profile
         |- preferences
         |- role
    /bookings
      |- bookingId
         |- userId
         |- services
         |- status
         |- payment
    /services
      |- serviceId
         |- name
         |- price
         |- description
    /orders
      |- orderId
         |- userId
         |- items
         |- status
         |- payment
    ```

- **Storage**:
  - Service images.
  - Receipt documents (if required).

---

### 2. Stripe Webhooks
1. Handle Stripe payment events using Supabase Edge Functions.
2. Automatically log successful payments in Supabase.
3. Real-time updates ensure accurate sales analytics in the admin dashboard.

Example Webhook Function:
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
                    userId: paymentIntent.metadata.user_id,
                    amount: paymentIntent.amount_received,
                    createdAt: new Date(),
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
  - Bar charts showing top-performing services by sales volume.
- **User Activity**:
  - Pie charts or tables for user sign-ups and active customers.
- **Filtering**:
  - Admins can filter data by date range or service category.

---

## Deployment and Maintenance

1. **Deployment**:
   - Host on **Vercel** for frontend and backend (serverless functions).
   - Add environment variables for Supabase and Stripe configuration.

2. **Domain Setup**:
   - Point `lammys.au` to Vercel for live deployment.

3. **Monitoring**:
   - Use Supabase Analytics for user behavior and performance tracking.
   - Enable error tracking with tools like Sentry.

4. **Backup**:
   - Enable Supabase database backups for data safety.

## Key Updates

1. **Authentication**:
   - Supabase authentication uses email/password with RLS.
   - Admin accounts are identified with an `is_admin` flag in the `users` table.
   - Email confirmation is enabled through Supabase.

2. **Database Schema**:
   - The database is designed with strict UUID-based relationships and fine-grained RLS policies.

3. **Role-Based Policies**:
   - Admins have full access to manage users, services, and bookings.
   - Customers can only view and update their data.

---


## Updated Database Schema

### **Users Table**
Tracks all users, including customers and admins.

```sql
CREATE TABLE users (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email VARCHAR(150) UNIQUE NOT NULL,
    name VARCHAR(100),
    is_admin BOOLEAN DEFAULT FALSE,
    password_hash TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);
```

### **Bookings Table**
Tracks customer appointments and associated services.

```sql
CREATE TABLE bookings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    service_id UUID REFERENCES services(id),
    pickup_time TIMESTAMP,
    dropoff_time TIMESTAMP,
    special_instructions TEXT,
    status VARCHAR(20) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT NOW()
);
```

### **Services Table**
Lists all available services.

```sql
CREATE TABLE services (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    price NUMERIC(10, 2) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);
```

### **Payments Table**
Tracks all payment transactions.

```sql
CREATE TABLE payments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    order_id UUID REFERENCES bookings(id) ON DELETE CASCADE,
    amount NUMERIC(10, 2) NOT NULL,
    payment_method VARCHAR(50),
    status VARCHAR(20) DEFAULT 'successful',
    created_at TIMESTAMP DEFAULT NOW()
);
```

---


## Authentication Enhancements

1. **Admin Role Setup**:
   - Admins are identified by the `is_admin` flag in the `users` table.

2. **Email Confirmation**:
   - Enabled in Supabase to ensure verified users.
   - SMTP configuration required for email delivery.

3. **Error Handling**:
   - Logs are monitored for failed sign-ups and email issues.

---


## Stripe Integration

1. Payments are processed through the Stripe API.
2. Payment success is recorded in the `payments` table via webhooks.
3. Refunds and failed payments are tracked for analytics.

---


## Supabase Edge Functions

1. **Webhook Handling**:
   Supabase Edge Functions are used to handle Stripe webhooks for real-time updates.

---
