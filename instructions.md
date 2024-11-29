---

### **Updated Goals for Lammy's Dry Cleaning Project**
1. **Public Website**:
   - Pages for Home, Services, Booking, Contact Us, FAQs.
   - Mobile-friendly, fast-loading, and SEO-optimized.

2. **Admin Dashboard**:
   - **Full CRUD Access**:
     - Manage services (e.g., add, update, delete dry cleaning offerings).
     - Manage items (e.g., inventory or specific service items).
   - **Sales Analytics**:
     - Beautiful, responsive UI with detailed sales charts using data from Stripe and bookings.
     - Visualizations include revenue trends, top services, and user activity.

3. **Authentication**:
   - Admin and user roles using Firebase Authentication.

4. **Payment Handling**:
   - Use Stripe for secure payment processing.
   - Display real-time sales data from Stripe webhook events.

5. **Hosting**:
   - Use Vercel for hosting the frontend and serverless functions.
   - Minimize infrastructure management with a scalable architecture.

---

### **Tech Stack**

#### **1. Hosting and Backend**
- **Vercel**:
  - Host the Next.js app and deploy serverless functions for backend tasks like:
    - Handling Stripe webhooks for payment events.
    - CRUD operations for services and items.

#### **2. Authentication**
- **Firebase Authentication**:
  - Manage user sign-up/login and admin roles.

#### **3. Database**
- **Firebase Firestore**:
  - Store structured data for:
    - Users.
    - Services and items.
    - Bookings.
    - Payment and sales data (e.g., amounts, timestamps).

#### **4. Frontend Framework**
- **Next.js**:
  - Build a fast, SEO-optimized website with server-side rendering (SSR).
  - Create dynamic admin dashboard pages for CRUD operations and analytics.

#### **5. Payment Handling**
- **Stripe**:
  - Use serverless functions to handle Stripe webhook events.
  - Automatically log payment data to Firestore (e.g., user ID, payment amount, timestamp).

#### **6. Admin Dashboard**
- **Chart.js**:
  - Build detailed, interactive charts for sales and analytics.
  - Example chart types:
    - **Line Chart**: Daily/weekly/monthly revenue trends.
    - **Bar Chart**: Breakdown of top-selling services or items.
    - **Pie Chart**: Distribution of sales by category.
    - **Table View**: List of recent transactions with filtering options.
- **Tailwind CSS**:
  - Create a beautiful, responsive UI for the admin portal.

---

### **Updated Architecture**

1. **Frontend**:
   - **Public Pages**: Home, Services, Booking, Contact Us, FAQs.
   - **User Pages**: Dashboard, Profile, Order History.
   - **Admin Pages**:
     - Manage Services: CRUD for services and items.
     - Sales Analytics: Visual charts and data tables.

2. **Backend**:
   - **Serverless Functions**:
     - Handle Stripe webhooks.
     - CRUD operations for services and items via API routes.
   - **Firestore**:
     - Store all structured data (e.g., services, bookings, payments).

3. **Admin Role Management**:
   - Secure admin routes using Firebase claims.

---

### **Implementation Details**

#### **Admin Dashboard**
- Build pages using **Next.js dynamic routes**:
  - `/admin/dashboard`: Overview with charts for revenue, bookings, and user activity.
  - `/admin/services`: List, add, update, or delete services.
  - `/admin/items`: Manage specific inventory or service items.

#### **Stripe Webhooks**
1. Create a serverless function in `pages/api/webhooks.js`:
   ```javascript
   import { buffer } from "micro";
   import Stripe from "stripe";
   import { getFirestore } from "firebase-admin/firestore";

   const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

   export const config = {
       api: { bodyParser: false },
   };

   export default async function handler(req, res) {
       if (req.method === "POST") {
           const buf = await buffer(req);
           const sig = req.headers["stripe-signature"];
           const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

           let event;

           try {
               event = stripe.webhooks.constructEvent(buf, sig, webhookSecret);
           } catch (err) {
               return res.status(400).send(`Webhook Error: ${err.message}`);
           }

           if (event.type === "payment_intent.succeeded") {
               const paymentIntent = event.data.object;
               const db = getFirestore();

               // Save payment data to Firestore
               await db.collection("payments").add({
                   userId: paymentIntent.metadata.user_id,
                   amount: paymentIntent.amount_received,
                   createdAt: new Date(),
               });
           }

           res.status(200).send("Event received");
       } else {
           res.setHeader("Allow", "POST");
           res.status(405).end("Method Not Allowed");
       }
   }
   ```

2. Add the function's URL as a webhook endpoint in Stripe's dashboard.

#### **Sales Analytics Charts**
- Fetch payment data from Firestore:
   ```javascript
   const { data: payments, error } = await supabase
       .from("payments")
       .select("amount, createdAt");
   ```

- Generate charts with Chart.js:
   ```javascript
   import { Line } from "react-chartjs-2";

   const data = {
       labels: payments.map(payment => new Date(payment.createdAt).toLocaleDateString()),
       datasets: [
           {
               label: "Daily Revenue",
               data: payments.map(payment => payment.amount),
               fill: false,
               borderColor: "rgba(75, 192, 192, 1)",
           },
       ],
   };

   return <Line data={data} />;
   ```

---

### **Deployment**
1. **Vercel**:
   - Deploy the frontend and serverless functions.
   - Add environment variables for Firebase and Stripe:
     - `NEXT_PUBLIC_FIREBASE_API_KEY`, `NEXT_PUBLIC_FIREBASE_PROJECT_ID`, etc.
     - `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`.

2. **Firestore**:
   - Configure database rules to allow admin-only access to sensitive data.

3. **Domain Setup**:
   - Point `lammys.au` to Vercel for live deployment.

---

### **How Detailed Can the Charts Be?**
With **Chart.js**, you can make charts as detailed as your data allows. For example:
- **Filterable Time Periods**: Daily, weekly, monthly revenue trends.
- **Comparative Views**: Compare revenue by services or categories.
- **Custom Metrics**: Display metrics like average order value, total users, or repeat customers.

---

### **Summary**
- Hosting: **Vercel** (frontend + serverless functions).
- Backend: **Firebase Firestore** for CRUD and Stripe webhook data.
- Authentication: **Firebase Authentication** for user and admin roles.
- Payment: **Stripe** for transactions and webhooks.
- Admin Dashboard: **Next.js** with **Chart.js** and **Tailwind CSS**.