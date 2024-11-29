
### **LammysPlan.md**

```markdown
# Lammy’s Dry Cleaning Website Plan

Lammy’s Dry Cleaning Website is a user-friendly platform designed to streamline online bookings for dry cleaning services. The site caters to customers and administrators, providing efficient tools for managing bookings, services, and payments.

---

## Key Features

1. **Public Pages**:
   - Showcase services, prices, and store information.
   - Enable users to book appointments seamlessly.

2. **User Dashboard**:
   - Track upcoming bookings, payment history, and personal details.

3. **Admin Portal**:
   - Manage services, view bookings, and monitor business metrics via charts.

4. **Payment Integration**:
   - Support secure payments through Stripe API.

5. **Email Automation**:
   - Send booking confirmations and reminders via SendGrid or Mailgun.

---

## Site Map

### Public Pages

1. **Home**
   - Introduction to Lammys.
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
   - Option to continue as guest.

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
   - Display graphs and charts showing website activity.
   - View key metrics like total bookings, revenue, and user sign-ups.

2. **Manage Services**
   - Perform CRUD (Create, Read, Update, Delete) operations on services and prices.

3. **Manage Bookings**
   - View and modify customer bookings.

4. **User Management**
   - Manage customer accounts.
   - Assign roles and permissions.

5. **Settings**
   - Update business information.
   - Configure payment and email settings.

---

## Technical Highlights

- **Next.js Framework** for server-side rendering and static generation.
- **Tailwind CSS** for responsive and clean UI design.
- **NextAuth.js** for secure user authentication.
- **Stripe API** for payment processing.
- **Chart.js/Recharts** for admin dashboard data visualization.
- **Firebase or MongoDB** for scalable database management.

---

## Deployment and Maintenance

- Hosted on **DigitalOcean** with a droplet upgraded to 2 GB RAM.
- Secured with SSL certificates via **Let's Encrypt**.
- Monitored with analytics tools and regular database backups.

---

Lammy’s Dry Cleaning Website promises a seamless user experience for customers and administrators, simplifying the process of managing dry cleaning services online.
``````markdown
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
   - Send booking confirmations and reminders via SendGrid or Mailgun.

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

- **Next.js Framework** for server-side rendering and static generation.
- **Tailwind CSS** for responsive and clean UI design.
- **Firebase Authentication** for secure user authentication and role management.
- **Stripe API** for payment processing and webhook handling.
- **Chart.js** for admin dashboard data visualization.
- **Firebase Firestore** for scalable database management.
- **Vercel Serverless Functions** to handle Stripe webhooks and backend logic.

---

## Firebase Integration Architecture

### 1. Firebase Services Integration
- **Authentication**:
  - Email/Password authentication.
  - Role-based access control for user and admin roles.
  - Protected route management.

- **Firestore Database**:
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

- **Firebase Storage**:
  - Service images.
  - Receipt documents (if required).

---

### 2. Stripe Webhooks
1. Handle Stripe payment events using Vercel serverless functions.
2. Automatically log successful payments in Firestore.
3. Real-time updates ensure accurate sales analytics in the admin dashboard.

Example Webhook Function:
```javascript
import { buffer } from "micro";
import Stripe from "stripe";
import { getFirestore } from "firebase-admin/firestore";

export const config = {
    api: { bodyParser: false },
};

export default async function handler(req, res) {
    if (req.method === "POST") {
        const buf = await buffer(req);
        const sig = req.headers["stripe-signature"];
        const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
        const db = getFirestore();

        try {
            const event = Stripe.webhooks.constructEvent(buf, sig, webhookSecret);

            if (event.type === "payment_intent.succeeded") {
                const paymentIntent = event.data.object;
                await db.collection("payments").add({
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
   - Add environment variables for Firebase and Stripe configuration.

2. **Domain Setup**:
   - Point `lammys.au` to Vercel for live deployment.

3. **Monitoring**:
   - Use Firebase Analytics for user behavior and performance tracking.
   - Enable error tracking with tools like Sentry.

4. **Backup**:
   - Enable Firestore database backups for data safety.