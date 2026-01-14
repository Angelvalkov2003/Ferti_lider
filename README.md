# Ecommerce Template

A modern, high-performance ecommerce store built with Next.js 15, Supabase, Cloudinary, and Stripe.

## Features

- 🛍️ Full ecommerce functionality (products, cart, checkout)
- 🗄️ Supabase for database and authentication
- 🖼️ Cloudinary for image management
- 💳 Stripe for payments
- 📧 Email notifications (contact form & new orders)
- 🎨 Modern UI with Tailwind CSS
- ⚡ Server Components and Server Actions
- 📱 Responsive design
- 🌙 Dark mode support

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Database**: Supabase (PostgreSQL)
- **Images**: Cloudinary
- **Payments**: Stripe
- **Styling**: Tailwind CSS
- **Language**: TypeScript

## Getting Started

### Prerequisites

- Node.js 18+ and pnpm
- Supabase account
- Cloudinary account
- Stripe account
- Resend account (for email notifications)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/Angelvalkov2003/ecommercetemplate.git
cd ecommercetemplate
```

2. Install dependencies:
```bash
pnpm install
```

3. Set up environment variables:
Create a `.env.local` file in the root directory:

```env
# Site Configuration
SITE_NAME=My Ecommerce Store
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Contact Email - Used for contact form submissions and new order notifications
CONTACT_EMAIL=your-email@example.com

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# Stripe Configuration
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
STRIPE_SECRET_KEY=your_stripe_secret_key

# Resend Configuration (for sending emails)
RESEND_API_KEY=your_resend_api_key

# Admin Configuration
# Admin authentication uses Supabase Auth (email/password)
# Create admin users in Supabase Dashboard -> Authentication -> Users
```

4. Set up Resend (for email notifications):

   - Create an account at [Resend](https://resend.com)
   - Get your API key from the dashboard
   - Add it to your `.env.local` file as `RESEND_API_KEY`
   - Set your `CONTACT_EMAIL` in `.env.local` (this is where you'll receive contact form submissions and new order notifications)

5. Set up Supabase database:

   Run the SQL script from `supabase_schema.sql` in your Supabase SQL Editor to create the following tables:

   - `categories` - Product categories
   - `products` - Store product information
   - `product_images` - Product images with ordering
   - `orders` - Customer orders with embedded customer information

6. Set up Admin Authentication:

   - Go to your Supabase Dashboard
   - Navigate to **Authentication** → **Users**
   - Click **"Add user"** to create a new admin user
   - Enter an email address and password for your admin account
   - ⚠️ **Important**: Save these credentials - you'll use them to log into the admin panel
   - Now you can log in at `/admin-login` using the email and password you created

7. Run the development server:
```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Database Schema

### Products Table
```sql
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  handle TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  compare_at_price DECIMAL(10,2),
  featured_image JSONB,
  images JSONB[],
  variants JSONB[],
  tags TEXT[],
  category TEXT,
  available BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### Collections Table
```sql
CREATE TABLE collections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  handle TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  image JSONB,
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### Carts Table
```sql
CREATE TABLE carts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### Cart Items Table
```sql
CREATE TABLE cart_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cart_id UUID REFERENCES carts(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  variant_id UUID,
  quantity INTEGER NOT NULL DEFAULT 1,
  price DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### Orders Table
```sql
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID,
  items JSONB NOT NULL,
  total DECIMAL(10,2) NOT NULL,
  currency TEXT DEFAULT 'USD',
  status TEXT DEFAULT 'pending',
  payment_intent_id TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

## Project Structure

```
├── app/                    # Next.js App Router pages
│   ├── admin/             # Admin panel pages
│   │   ├── login/         # Admin login page
│   │   └── page.tsx       # Admin dashboard
│   ├── api/               # API routes
│   │   └── contact/       # Contact form API endpoint
│   ├── product/           # Product pages
│   ├── search/            # Search and collection pages
│   └── layout.tsx         # Root layout
├── components/            # React components
│   ├── admin/             # Admin components
│   │   └── navbar.tsx     # Admin navigation
│   ├── cart/             # Shopping cart components
│   ├── layout/            # Layout components
│   └── product/          # Product components
├── lib/                   # Utility functions
│   ├── supabase/         # Supabase client and functions
│   │   ├── auth.ts       # Authentication helpers
│   │   ├── orders.ts     # Order management functions
│   │   └── ...
│   ├── cloudinary.ts     # Cloudinary utilities
│   ├── email.ts          # Email sending functions
│   ├── stripe.ts         # Stripe integration
│   └── types.ts          # TypeScript types
├── middleware.ts          # Next.js middleware for auth
└── public/               # Static assets
```

## Email Notifications

The project includes email notification functionality:

- **Contact Form**: When someone submits the contact form, you'll receive an email at `CONTACT_EMAIL`
- **New Orders**: When a new order is created using `createOrder()` from `lib/supabase/orders.ts`, you'll automatically receive an email notification

### Usage Examples

**Contact Form API:**
```typescript
// POST /api/contact
{
  "name": "John Doe",
  "email": "john@example.com",
  "message": "Hello!",
  "subject": "Optional subject"
}
```

**Create Order with Email Notification:**
```typescript
import { createOrder } from "lib/supabase/orders";

const order = await createOrder({
  customer_name: "John Doe",
  customer_email: "john@example.com",
  customer_phone: "+1234567890",
  customer_address: "123 Main St",
  products: [
    { id: "prod-1", name: "Product 1", price: 29.99, quantity: 2 }
  ],
  total_price: 59.98,
  comment: "Please deliver in the morning"
});
// Email notification is automatically sent to CONTACT_EMAIL
```

## Admin Panel

The admin panel is now available! Access it at `/admin-login`.

### Setting Up Admin Access

1. **Create an Admin User:**
   - Go to your Supabase Dashboard
   - Navigate to **Authentication** → **Users**
   - Click **"Add user"** to create a new admin user
   - Enter an email address and password for your admin account
   - ⚠️ **Important**: Save these credentials - you'll use them to log into the admin panel

2. **Log In to Admin Panel:**
   - Go to `http://localhost:3000/admin-login` (or your production URL)
   - Enter the email and password you created in Supabase
   - You'll be redirected to the admin dashboard

### Admin Features

- **Dashboard**: View statistics and recent orders
- **Orders Management**: View and manage customer orders
- **Products Management**: Manage products (coming soon)
- **Authentication**: Secure login using email and password (Supabase Auth)

### Admin Routes

- `/admin-login` - Admin login page
- `/admin` - Admin dashboard
- `/admin/orders` - Orders management (coming soon)
- `/admin/products` - Products management (coming soon)

All admin routes are protected and require authentication.

## Deployment

### Vercel

1. Push your code to GitHub
2. Import your repository in Vercel
3. Add your environment variables
4. Deploy!

### Other Platforms

This project can be deployed to any platform that supports Next.js:
- Netlify
- Railway
- Render
- AWS Amplify

## License

MIT

## Support

For issues and questions, please open an issue on GitHub.
