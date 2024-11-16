### **Instructions.md**

```markdown
# Instructions for Building Lammy’s Dry Cleaning Website

This file provides detailed step-by-step instructions for you to help build the project. Follow this guide to implement all required features and ensure compatibility with the specified dependencies.

---

## Setup and Configuration

### 1. Upgrade Droplet
- Upgrade the DigitalOcean droplet to at least **2 GB RAM**.
- Verify the upgrade:
  ```bash
  free -m
  ```

### 2. Domain Setup
- Point `lammys.au` domain to the DigitalOcean droplet using the DNS settings.

### 3. Install Dependencies on the Server
- Install Node.js (v18 or higher):
  ```bash
  curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
  sudo apt-get install -y nodejs
  ```
- Install Git, PM2, and Nginx:
  ```bash
  sudo apt update
  sudo apt install git nginx -y
  npm install -g pm2@latest
  ```

### 4. SSL Setup
- Install Certbot and secure the domain using Let's Encrypt:
  ```bash
  sudo apt install certbot python3-certbot-nginx -y
  sudo certbot --nginx -d lammys.au
  ```

---

## Frontend Development

### 1. Framework
- Set up a Next.js project:
  ```bash
  npx create-next-app@latest lammys
  cd lammys
  ```

### 2. Dependencies
- Install React and React DOM:
  ```bash
  npm install react@latest react-dom@latest
  ```
- Install Tailwind CSS and its dependencies:
  ```bash
  npm install tailwindcss@latest postcss@latest autoprefixer@latest
  npx tailwindcss init
  ```

### 3. State Management
- Install Redux Toolkit if Redux is chosen for state management:
  ```bash
  npm install @reduxjs/toolkit@latest react-redux@latest
  ```

### 4. Routing
- Use Next.js dynamic routing for public and private pages:
  - **Public Pages**: Home, Services, Booking, Login/Register, Contact Us, FAQs.
  - **User Pages**: Dashboard, Profile Settings, Order History.
  - **Admin Portal**: Dashboard, Manage Services, Manage Bookings, User Management, Settings.

### 5. Styling
- Use Tailwind CSS for responsive and clean UI.

---

## Backend Development

### 1. API Development
- Create API routes within the `pages/api` directory to handle:
  - Booking management.
  - User authentication.
  - Service listings.
  - Payments using Stripe.

### 2. Authentication
- Install and configure NextAuth.js:
  ```bash
  npm install next-auth@latest
  ```
- Use email/password providers with JWT or session-based authentication.

### 3. Database Setup
- **Cloud Database** (Preferred):
  - Install Firebase SDK:
    ```bash
    npm install firebase@latest
    ```
  - Configure Firestore in the Firebase console.
  - For MongoDB:
    ```bash
    npm install mongoose@latest
    ```
    - Configure MongoDB Atlas.

- **SQLite** (Alternative for lightweight use):
  ```bash
  npm install sqlite3@latest
  ```

### 4. Payment Integration
- Install Stripe SDK and set up payment processing:
  ```bash
  npm install stripe@latest
  ```
- Create webhook routes for handling payment events.

### 5. Email Service
- Install and configure SendGrid or Mailgun:
  ```bash
  npm install @sendgrid/mail@latest
  ```
  or
  ```bash
  npm install mailgun-js@latest
  ```

---

## Admin Portal Development

### 1. Secure Routes
- Implement role-based access control (RBAC) for admin pages.

### 2. Dashboard
- Use Chart.js or Recharts for data visualization:
  ```bash
  npm install chart.js@latest
  ```
  or
  ```bash
  npm install recharts@latest
  ```

### 3. CRUD Operations
- Build interfaces for managing services, bookings, and users.

---

## Testing

### 1. Unit Testing
- Test frontend components and backend API routes.

### 2. Integration Testing
- Test the complete user flow: booking, authentication, payments, and email automation.

### 3. Performance Testing
- Ensure fast load times on mobile and desktop devices.

---

## Deployment

### 1. Setup Nginx
- Configure Nginx as a reverse proxy for the Next.js application.

### 2. Process Management
- Use PM2 to manage the application processes:
  ```bash
  pm2 start npm --name "lammys" -- start
  ```

### 3. CI/CD Pipeline
- Optional: Set up GitHub Actions for automated deployments.

---

## Monitoring and Maintenance

### 1. Error Logging
- Implement error tracking using tools like Sentry.

### 2. Analytics
- Integrate Google Analytics to monitor user behavior.

### 3. Backup Strategy
- Schedule regular backups for the database and critical data.
```

---
