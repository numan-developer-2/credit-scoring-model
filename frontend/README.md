# 🎨 Credit Scoring Platform - Frontend

A modern, production-ready React frontend for the Credit Scoring Platform.

## ✅ Features

- ✨ **Modern UI** - Material-UI v5 with custom theming
- 🌓 **Dark Mode** - Toggle between light and dark themes
- 📱 **Fully Responsive** - Works on desktop, tablet, and mobile
- 🔐 **Authentication** - Login/Register with JWT
- 📊 **Interactive Charts** - Recharts for data visualization
- 🎯 **Credit Scoring** - Real-time credit score calculation
- 📋 **Applications Management** - View and filter applications
- ⚡ **Fast** - Built with Vite for lightning-fast HMR
- 🔄 **State Management** - Redux Toolkit + React Query
- 🎨 **Form Validation** - Formik + Yup
- 🔔 **Toast Notifications** - React Hot Toast

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

The app will be available at `http://localhost:3000`

## 📁 Project Structure

```
src/
├── components/          # Reusable components
│   ├── common/         # Common components (Loading, Error)
│   └── layout/         # Layout components (Sidebar, Header)
├── pages/              # Page components
│   ├── Dashboard/      # Dashboard page
│   ├── CreditScoring/  # Credit scoring form
│   ├── Applications/   # Applications list
│   ├── Analytics/      # Analytics page
│   ├── Settings/       # Settings page
│   └── Auth/           # Login & Register
├── stores/             # Redux store
│   └── slices/         # Redux slices
├── hooks/              # Custom React hooks
├── services/           # API services
├── styles/             # Global styles & themes
├── App.jsx             # Main app component
└── main.jsx            # Entry point
```

## 🎯 Available Routes

| Route           | Description               |
| --------------- | ------------------------- |
| `/`             | Redirects to dashboard    |
| `/dashboard`    | Main dashboard with stats |
| `/scoring`      | Credit scoring form       |
| `/applications` | Applications list         |
| `/analytics`    | Analytics page            |
| `/settings`     | User settings             |
| `/login`        | Login page                |
| `/register`     | Register page             |

## 🎨 Customization

### Change Theme Colors

Edit `src/styles/themes/index.js`:

```javascript
primary: {
  main: '#1976d2',  // Your brand color
}
```

### Environment Variables

Create `.env` file:

```env
VITE_API_URL=http://localhost:8000/api/v1
VITE_APP_NAME=Credit Scoring Platform
```

## 📦 Tech Stack

- **React 18** - UI library
- **Vite** - Build tool
- **Material-UI** - Component library
- **Redux Toolkit** - State management
- **React Query** - Server state management
- **React Router** - Routing
- **Recharts** - Charts
- **Formik + Yup** - Forms & validation
- **Axios** - HTTP client
- **React Hot Toast** - Notifications

## 🔌 Backend Integration

The frontend is configured to connect to the backend API at `http://localhost:8000/api/v1`.

Update the API URL in `.env` file if needed.

## 📱 Responsive Breakpoints

- **Mobile**: < 768px
- **Tablet**: 768px - 1199px
- **Desktop**: ≥ 1200px

## 🎯 Key Features

### Dashboard

- 4 stat cards with trends
- Application trends chart
- Risk distribution pie chart
- Recent scores line chart

### Credit Scoring

- 8-field form with validation
- Real-time score calculation
- Risk assessment display
- Contributing factors breakdown

### Applications

- Searchable data table
- Status & risk filters
- Pagination
- Export functionality

### Settings

- Dark mode toggle
- Notification preferences
- Profile management

## 🐛 Troubleshooting

### Port already in use

```bash
# Kill process on port 3000
npx kill-port 3000
```

### Dependencies issues

```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

## 📝 License

MIT

## 👨‍💻 Author

Credit Scoring Platform Team
