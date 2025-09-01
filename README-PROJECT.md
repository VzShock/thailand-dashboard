# Thailand Adventure Dashboard

A Next.js dashboard for planning a 56-day trip to Thailand with interactive features and data management.

## Features

- **Interactive Dashboard**: Navigate between different sections using a modern UI
- **Data-Driven**: All content is stored in JSON files for easy maintenance
- **Currency Converter**: Real-time conversion between THB, EUR, and USD
- **Interactive Checklist**: Pre-departure checklist with localStorage persistence
- **Trip Progress Tracking**: Track your progress across all activities:
  - ✅ **Food Tracking**: Mark dishes you've tried with visual progress
  - ✅ **Activity Tracking**: Check off completed experiences and adventures
  - ✅ **Shopping Tracking**: Track visited markets and shopping locations
  - ✅ **Health Tracking**: Monitor vaccination progress and health preparations
  - 📊 **Overall Progress**: See your total trip completion percentage
- **Persistent Storage**: All tracking data saved locally in your browser
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Modern Stack**: Built with Next.js 15, TypeScript, and Tailwind CSS

## Project Structure

```
src/
├── app/
│   ├── globals.css          # Global styles and animations
│   └── page.tsx             # Main dashboard page
├── components/
│   ├── Header.tsx           # Dashboard header
│   ├── Navigation.tsx       # Section navigation
│   ├── CurrencyConverter.tsx # Currency conversion widget
│   └── sections/            # Dashboard sections
│       ├── Overview.tsx     # Trip overview with progress tracking
│       ├── Itinerary.tsx    # 56-day itinerary
│       ├── Food.tsx         # Food guide with try-it tracking
│       ├── Activities.tsx   # Activities with completion tracking
│       ├── Shopping.tsx     # Shopping guide with visit tracking
│       ├── Health.tsx       # Health info with vaccination tracking
│       ├── Budget.tsx       # Budget breakdown
│       ├── Checklist.tsx    # Pre-departure checklist
│       └── WorkSchedule.tsx # Work schedule
├── hooks/
│   └── useTracker.tsx       # Custom hook for progress tracking
└── data/                    # JSON data files
    ├── trip-overview.json
    ├── itinerary.json
    ├── activities.json
    ├── food.json
    ├── shopping.json
    ├── health.json
    ├── budget.json
    ├── checklist.json
    └── work-schedule.json
```

## Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

Open [http://localhost:3000](http://localhost:3000) to view the dashboard.

## Key Improvements from Original

1. **Modular Architecture**: Separated into reusable React components
2. **Type Safety**: Full TypeScript implementation
3. **Data Management**: JSON files for easy content updates
4. **Modern Styling**: Tailwind CSS with responsive design
5. **Interactive Features**: Preserved original functionality (currency converter, checklist)
6. **Trip Progress Tracking**: New feature to track completion across all sections
7. **Persistent Storage**: LocalStorage integration for maintaining user progress
8. **Performance**: Next.js optimization and static generation

## Progress Tracking Features

The dashboard now includes comprehensive progress tracking:

- **Visual Progress Bars**: Each section shows completion percentage
- **Smart Checkboxes**: Mark items as completed with persistent state
- **Color-coded Cards**: Completed items change appearance for easy identification
- **Overall Progress**: Overview section displays total completion across all categories
- **LocalStorage Persistence**: All progress data saved locally in your browser

## Customization

To update trip data, simply edit the JSON files in the `data/` directory. The dashboard will automatically reflect the changes.

## Technologies Used

- **Next.js 15**: React framework with App Router
- **TypeScript**: Type safety and better developer experience
- **Tailwind CSS**: Utility-first CSS framework
- **React Hooks**: State management and side effects
- **Local Storage**: Persistent checklist state