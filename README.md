# Link Management Platform - Frontend

A modern React-based frontend for the Link Management Platform, featuring a landing page, authentication system, and role-based dashboards for admins and bloggers.

## Features

### Landing Page
- **Hero Section**: Animated 3D sphere with floating elements and particle effects
- **Features Section**: Showcase of platform capabilities
- **About Section**: Company information with statistics
- **How It Works**: Step-by-step process explanation
- **Testimonials**: User reviews with carousel
- **Contact Form**: Interactive contact form with validation
- **Platform Preview**: Mock dashboard preview
- **Trust Banner**: Partner logos and community stats

### Authentication
- **Login Page**: Role-based login (Admin/Blogger)
- **Signup Page**: Registration form with user type selection
- **Demo Mode**: No backend required for showcase

### Dashboards

#### Admin Dashboard
- **Overview Stats**: Bloggers, Managers, Teams, Writers, Pending Requests
- **Withdrawal Requests Table**: Manage publisher payouts
- **Search & Notifications**: Real-time updates
- **Sidebar Navigation**: Easy access to all admin features

#### Blogger Dashboard
- **Performance Metrics**: Sites, Orders, Completion rates
- **Visual Charts**: Order performance over time
- **Wallet Management**: Earnings and payout tracking
- **Order Management**: Today's orders and status tracking

## Technology Stack

- **React 18** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** for styling
- **React Router** for navigation
- **Lucide React** for icons
- **Framer Motion** for animations
- **Chart.js** for data visualization

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## Project Structure

```
frontend/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── ui/             # Base UI components
│   │   ├── HeroSection.tsx
│   │   ├── FeaturesSection.tsx
│   │   ├── AboutSection.tsx
│   │   ├── ContactSection.tsx
│   │   └── ...
│   ├── pages/              # Page components
│   │   ├── LandingPage.tsx
│   │   ├── LoginPage.tsx
│   │   ├── SignupPage.tsx
│   │   ├── AdminDashboard.tsx
│   │   └── BloggerDashboard.tsx
│   ├── lib/                # Utility functions
│   ├── App.tsx             # Main app component with routing
│   ├── main.tsx            # Entry point
│   └── index.css           # Global styles
├── public/                 # Static assets
├── package.json
├── tailwind.config.js
├── vite.config.ts
└── tsconfig.json
```

## Routing

The application uses React Router with the following routes:

- `/` - Landing page
- `/login` - Login page
- `/signup` - Signup page
- `/admin` - Admin dashboard
- `/blogger` - Blogger dashboard

## Styling

The application uses a consistent dark theme with:
- **Primary Color**: Cyan (#6BF0FF)
- **Background**: Dark blue (#0F1724)
- **Cards**: Dark gray (#1A2233)
- **Borders**: Medium gray (#2C3445)

All animations and transitions are smooth and consistent throughout the application.

## Demo Mode

The application runs in demo mode, meaning:
- No backend authentication required
- Any email/password combination works for login
- All data is mock data for showcase purposes
- Perfect for demonstrations and presentations

## Responsive Design

The application is fully responsive and works on:
- Desktop (1024px+)
- Tablet (768px - 1023px)
- Mobile (320px - 767px)

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is for demonstration purposes.
