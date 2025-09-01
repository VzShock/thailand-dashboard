# Thailand Adventure Dashboard 🇹🇭

A comprehensive Next.js dashboard application for planning and tracking a 56-day adventure in Thailand. Features interactive progress tracking, itinerary management, budget planning, and practical travel tools.

![Next.js](https://img.shields.io/badge/Next.js-15.4.2-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-38B2AC)
![License](https://img.shields.io/badge/license-MIT-green)

## ✨ Features

### 📊 Interactive Dashboard
- **Progress Tracking**: Monitor completion across multiple categories (food, activities, shopping, health)
- **Real-time Statistics**: Visual progress bars and completion percentages
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices

### 🗓️ Trip Management
- **56-Day Itinerary**: Detailed day-by-day planning with locations and activities
- **Activity Tracking**: Comprehensive list of must-do activities with completion status
- **Food Journey**: Track Thai dishes and restaurants to try
- **Shopping List**: Organized shopping goals and souvenirs

### 🛠️ Practical Tools
- **Currency Converter**: Real-time conversion between THB, EUR, and USD
- **Interactive Checklist**: Pre-departure checklist with persistent state
- **Budget Tracker**: Monitor expenses and stay within budget
- **Health Reminders**: Track medications, vaccinations, and health tips

### 💾 Data Persistence
- **Local Storage**: All progress saved locally in browser
- **Offline Support**: Works without internet connection
- **Data Backup**: Automatic backup to prevent data loss

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/thailand-dashboard.git
cd thailand-dashboard
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## 🏗️ Project Structure

```
thailand-dashboard/
├── src/
│   ├── app/              # Next.js app router pages
│   │   ├── activities/   # Activities tracking page
│   │   ├── budget/       # Budget management
│   │   ├── checklist/    # Pre-departure checklist
│   │   ├── currency/     # Currency converter
│   │   ├── food/         # Food tracking
│   │   ├── health/       # Health reminders
│   │   ├── itinerary/    # Trip itinerary
│   │   ├── shopping/     # Shopping list
│   │   └── work/         # Work schedule
│   ├── components/       # Reusable React components
│   ├── hooks/           # Custom React hooks
│   ├── types/           # TypeScript type definitions
│   └── utils/           # Utility functions
├── data/                # JSON data files
│   ├── activities.json  # Activities data
│   ├── budget.json      # Budget information
│   ├── checklist.json   # Checklist items
│   ├── food.json        # Food items
│   ├── health.json      # Health information
│   ├── itinerary.json   # Trip itinerary
│   └── shopping.json    # Shopping items
└── public/              # Static assets
```

## 🎨 Technology Stack

- **Framework**: [Next.js 15](https://nextjs.org/) with App Router
- **Language**: [TypeScript](https://www.typescriptlang.org/) for type safety
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) for utility-first styling
- **Animation**: [Framer Motion](https://www.framer.com/motion/) for smooth animations
- **Icons**: [React Icons](https://react-icons.github.io/react-icons/) for UI icons
- **State Management**: React hooks with localStorage persistence

## 📝 Available Scripts

```bash
# Development
npm run dev          # Start development server with Turbopack

# Production
npm run build        # Build for production
npm run start        # Start production server

# Code Quality
npm run lint         # Run ESLint
```

## 🌐 Deployment

### Deploy to Netlify

1. Push your code to GitHub
2. Connect your GitHub repository to Netlify
3. Configure build settings:
   - Build command: `npm run build`
   - Publish directory: `.next`
4. Deploy!

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions.

### Important Notes on Data Persistence

- **Production (Netlify)**: User interactions are saved in browser localStorage only
- **Local Development**: Changes are saved to JSON files and can be committed
- Static data files serve as initial content for all users

## 🔧 Configuration

### Environment Variables

No environment variables required for basic functionality. For API integrations, create a `.env.local` file:

```env
# Optional: Currency API (if implementing real-time rates)
NEXT_PUBLIC_CURRENCY_API_KEY=your_api_key
```

## 📱 Features by Page

- **Dashboard** (`/`): Overview with progress statistics and quick navigation
- **Itinerary** (`/itinerary`): 56-day travel plan with daily activities
- **Activities** (`/activities`): Track adventures and experiences
- **Food** (`/food`): Thai cuisine checklist
- **Shopping** (`/shopping`): Shopping goals and souvenir list
- **Health** (`/health`): Medical reminders and health tips
- **Budget** (`/budget`): Expense tracking and budget management
- **Currency** (`/currency`): THB/EUR/USD converter
- **Checklist** (`/checklist`): Pre-departure preparation list
- **Work** (`/work`): Remote work schedule management

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/) by Vercel
- Styled with [Tailwind CSS](https://tailwindcss.com/)
- Animations powered by [Framer Motion](https://www.framer.com/motion/)

## 📧 Contact

For questions or suggestions, please open an issue on GitHub.

---

Made with ❤️ for an amazing Thailand adventure!