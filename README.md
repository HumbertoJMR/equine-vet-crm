# Equine Veterinary CRM

A comprehensive Customer Relationship Management system for equine veterinary practices, built with Next.js, Supabase, and NextAuth.js.

## Features

- 🐎 Horse Management
- 👤 Owner Management
- 📅 Appointment Scheduling
- 📝 Medical Records
- 💊 Inventory Management
- 💰 Invoicing
- 🔐 Secure Authentication (Email/Password & Google)
- 📱 Responsive Design

## Tech Stack

- **Frontend**: Next.js 14, React, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: Supabase (PostgreSQL)
- **Authentication**: NextAuth.js
- **UI Components**: Shadcn/ui
- **Form Handling**: React Hook Form, Zod

## Prerequisites

- Node.js 18+ and npm/pnpm
- Supabase account
- Google Cloud Console account (for OAuth)

## Getting Started

1. **Clone the repository**
   ```bash
   git clone https://github.com/HumbertoJMR/equine-vet-crm.git
   cd equine-vet-crm
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   pnpm install
   ```

3. **Set up environment variables**
   - Copy `.env.example` to `.env.local`
   - Fill in the required values:
     - Supabase credentials
     - NextAuth secret
     - Google OAuth credentials

4. **Set up Supabase**
   - Create a new Supabase project
   - Run the SQL migrations from `supabase/migrations/20240415_initial_schema.sql`
   - Enable Row Level Security (RLS)
   - Set up authentication providers

5. **Set up Google OAuth**
   - Create a new project in Google Cloud Console
   - Configure OAuth consent screen
   - Create OAuth client ID and secret
   - Add authorized redirect URIs:
     - Development: `http://localhost:3000/api/auth/callback/google`
     - Production: `https://your-domain.com/api/auth/callback/google`

6. **Run the development server**
   ```bash
   npm run dev
   # or
   pnpm dev
   ```

## Database Schema

The application uses the following tables:

- `clinicas`: Veterinary clinics
- `usuarios`: System users
- `propietarios`: Horse owners
- `caballerizas`: Stables
- `caballos`: Horses
- `veterinarios`: Veterinarians
- `servicios`: Veterinary services
- `historias_clinicas`: Medical records
- `citas`: Appointments
- `facturas`: Invoices
- `inventario`: Inventory
- `eventos`: Events

## API Endpoints

- `/api/auth/*`: Authentication endpoints
- `/api/caballos/*`: Horse management
- `/api/propietarios/*`: Owner management
- `/api/historias-clinicas/*`: Medical records
- `/api/citas/*`: Appointments
- `/api/inventario/*`: Inventory management
- `/api/facturas/*`: Invoicing
- `/api/eventos/*`: Events
- `/api/servicios/*`: Services
- `/api/veterinarios/*`: Veterinarians

## Security

- Row Level Security (RLS) enabled on all tables
- Authentication required for all API endpoints
- Role-based access control
- Secure session management
- Environment variables for sensitive data

## Deployment

1. **Vercel**
   - Connect your GitHub repository
   - Add environment variables
   - Deploy

2. **Supabase**
   - Run migrations in production
   - Update environment variables
   - Configure production authentication

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

MIT License - see LICENSE file for details 