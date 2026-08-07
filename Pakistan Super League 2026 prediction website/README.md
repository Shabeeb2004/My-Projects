# PSL 2026 Prediction Website

## Overview
The **PSL 2026 Prediction Website** is an interactive web-based platform for **Pakistan Super League (PSL) cricket match predictions**. This community-driven application allows cricket enthusiasts to predict match outcomes, compete on leaderboards, and stay updated with live results, team statistics, and playoff information.

## Purpose
The platform serves multiple objectives:
- **Fan Engagement** - Allow cricket fans to participate actively in predicting PSL match outcomes
- **Community Building** - Create a competitive and interactive community of PSL supporters
- **Real-time Updates** - Keep users informed about match schedules, results, and team performance
- **Performance Tracking** - Enable users to track their prediction accuracy and ranking
- **Data Management** - Maintain comprehensive team, player, and match statistics

## Key Features

### 1. **Match Predictions**
   - Make predictions for all PSL group stage and playoff matches
   - User-friendly prediction interface with match details
   - Support for different match types (Group matches, Knockout rounds)
   - Real-time prediction updates
   - Easy-to-use prediction form with match information

### 2. **Teams & Squads**
   - Complete information on all 8 PSL teams:
     - Lahore Qalandars (LQ)
     - Karachi Kings (KK)
     - Peshawar Zalmi (PZ)
     - Quetta Gladiators (QG)
     - Rawalpindi (RP)
     - Islamabad United (IU)
     - Multan Sultans (MS)
     - Hyderabad Kingsmen (HK)
   - Team squads and player information
   - Team group classification (Group A & B)
   - Team logos and color-coded identification

### 3. **Leaderboard & Rankings**
   - Global leaderboard showing top predictors
   - User ranking based on prediction accuracy
   - Performance metrics and statistics
   - Competitive ranking system
   - User profile pages with prediction history

### 4. **Results & Match History**
   - Live match results updates
   - Historical match data
   - Outcome tracking for all predictions
   - Result verification
   - Match replay and analysis

### 5. **Statistics & Analytics**
   - Comprehensive team performance statistics
   - Player statistics and records
   - Win-loss ratios and trends
   - Venue-based performance data
   - Historical PSL data and records

### 6. **Playoffs Information**
   - Playoff bracket and structure
   - Playoff match scheduling
   - Knockout stage predictions
   - Tournament progression tracking
   - Final standings

### 7. **Community Features**
   - Community forum and discussions
   - User interaction and engagement
   - Email reminders for upcoming matches
   - Notification system for match updates
   - Admin panel for moderation and management

### 8. **Admin Panel**
   - User and data management
   - Match and results administration
   - Prediction verification
   - Community moderation
   - System maintenance and updates

## Technical Stack

- **Frontend**: HTML5, CSS3, JavaScript (Vanilla)
- **Backend**: Firebase Realtime Database
- **Authentication**: Firebase Authentication
- **Hosting**: Vercel
- **Live URL**: [https://psl-rose.vercel.app](https://psl-rose.vercel.app)

## Project Structure

```
PSL/
├── index.html                 # Main home page
├── predict.html              # Prediction page
├── leaderboard.html          # Leaderboard and rankings
├── results.html              # Match results
├── squads.html               # Team squads information
├── stats.html                # Statistics and analytics
├── playoffs.html             # Playoff information
├── community.html            # Community features
├── admin.html                # Admin dashboard
├── email-reminders.html      # Email reminder settings
├── fix-missed-predictions.html # Prediction recovery
├── index.js                  # Main application logic
├── data.js                   # Firebase config & data helpers
├── logos.js                  # Team logos and images
├── style.css                 # Application styling
└── vercel.json              # Deployment configuration
```

## Features Breakdown

### Home Page (`index.html`)
- Welcome and introduction
- Quick navigation to key features
- Featured matches and upcoming games
- User login/registration
- Email collection for match reminders

### Predict Page (`predict.html`)
- Interactive match prediction form
- Current and upcoming matches
- Team selection and prediction options
- Submission confirmation
- Prediction history

### Leaderboard (`leaderboard.html`)
- Global rankings of all users
- Prediction accuracy metrics
- User statistics and achievements
- Filter and sorting options
- Personal ranking display

### Results Page (`results.html`)
- Completed match results
- Prediction accuracy comparison
- User predictions vs. actual results
- Historical results database
- Result analysis

### Statistics Page (`stats.html`)
- Team performance statistics
- Player records and achievements
- Venue performance data
- Head-to-head comparisons
- Historical trends and analytics

### Squads Page (`squads.html`)
- All 8 PSL team rosters
- Player information
- Squad composition
- Team details and group assignment

### Playoffs Page (`playoffs.html`)
- Tournament bracket
- Playoff match schedule
- Knockout stage information
- Final standings
- Semi-finals and finals details

### Community Page (`community.html`)
- User discussions and forums
- Community engagement
- User interactions
- Shared insights and predictions
- Community events

### Admin Panel (`admin.html`)
- User management
- Prediction verification
- Match data management
- Community moderation tools
- System administration

## Getting Started

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Firebase account (for backend data)
- Internet connection

### Installation

1. **Clone the Repository**
   ```bash
   git clone https://github.com/Shabeeb2004/PSL.git
   cd PSL
   ```

2. **Navigate to Project Folder**
   ```bash
   cd PSL
   ```

3. **Open in Browser**
   - Open `index.html` in your web browser
   - Or deploy using Vercel:
   ```bash
   npm install -g vercel
   vercel
   ```

4. **Firebase Configuration** (Already configured in `data.js`)
   - Uses Firebase Realtime Database
   - Authentication automatically handled
   - Real-time data synchronization enabled

## Data Structure

### Teams (8 PSL Teams)
- Team name, abbreviation, color code
- Group classification (A or B)
- Logo and branding

### Matches
- Match ID and date/time
- Teams participating
- Venue location
- Match type (Group/Playoff)

### Users
- User profile and email
- Prediction history
- Ranking and score
- Statistics and achievements

### Predictions
- User prediction data
- Match ID reference
- Prediction timestamp
- Accuracy tracking

## Deployment

The application is deployed on **Vercel** with automatic updates from the GitHub repository.

**Live Website**: [https://psl-rose.vercel.app](https://psl-rose.vercel.app)

### Deploy Your Own
```bash
# Install Vercel CLI
npm install -g vercel

# Navigate to project
cd PSL

# Deploy
vercel
```

## Firebase Integration

The project uses Firebase Realtime Database for:
- User authentication
- Real-time data synchronization
- Match and prediction storage
- User profile management
- Leaderboard data

**Firebase Project**: psl-predictor-2026

## Key Technologies

✅ **Firebase Realtime Database** - Real-time data updates  
✅ **Firebase Authentication** - Secure user management  
✅ **Vercel Hosting** - Fast and reliable deployment  
✅ **HTML/CSS/JavaScript** - Responsive frontend  
✅ **Responsive Design** - Works on desktop, tablet, and mobile  
✅ **Real-time Updates** - Live match results and predictions  

## Use Cases

- **Cricket Fans** - Predict PSL match outcomes and compete globally
- **Community Members** - Engage with fellow cricket enthusiasts
- **Sports Analysts** - Track statistics and performance metrics
- **Tournament Organizers** - Manage and monitor community participation
- **Casual Users** - Follow matches and stay updated with results

## Features & Capabilities

✨ **User Registration & Login** - Secure account management  
✨ **Match Predictions** - Easy prediction interface  
✨ **Global Leaderboard** - Competitive rankings  
✨ **Real-time Results** - Instant match updates  
✨ **Team Statistics** - Comprehensive performance data  
✨ **Admin Dashboard** - Management and moderation  
✨ **Email Notifications** - Match reminders and alerts  
✨ **Community Forum** - User interactions and discussions  
✨ **Mobile Responsive** - Works on all devices  

## Future Enhancements

- Mobile application (iOS/Android)
- Advanced prediction algorithms
- Betting odds integration
- Live commentary and updates
- Advanced analytics and AI predictions
- Social media integration
- Push notifications
- Prediction streaks and achievements
- User achievements and badges
- Integration with official PSL data

## Support & Feedback

For issues, suggestions, or feedback, please visit the community forum or contact through the admin panel.

## License

This project is developed as part of the personal projects portfolio.

## Contributors

- **Developer**: Shabeeb2004

---

**Project Launch Date**: March 2026  
**Current Status**: Active  
**Last Updated**: August 2026

**Live Website**: [https://psl-rose.vercel.app](https://psl-rose.vercel.app)

PSL 2026 Prediction Website - Predict. Compete. Connect. 🏏
