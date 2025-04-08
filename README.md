# EQCoach Debate

EQCoach Debate is an AI-powered platform that combines emotional intelligence coaching with debate training. The application helps users develop both their debate skills and emotional intelligence through interactive sessions with an AI coach powered by Google's Gemini AI.

## 🌟 Features

### Debate Coaching
- **Structured Debate Format**: Engage in formal debates with clear stages (opening statements, rebuttals, closing statements)
- **Real-time Feedback**: Receive immediate responses from an AI debate opponent
- **Topic Selection**: Choose from curated debate topics or create your own
- **Comprehensive Analysis**: Get detailed feedback on argument strength, logical reasoning, and persuasive techniques
- **Speech-to-Text**: Practice verbal debate skills with voice input capabilities
- **Timer System**: Develop time management skills with integrated debate timers

### Emotional Intelligence Development
- **EQ Assessment**: Complete interactive exercises to gauge your emotional intelligence
- **Personalized Insights**: Receive analysis of your emotional awareness, expression, empathy, and self-regulation
- **Structured Journey**: Follow a guided path to develop various EQ competencies
- **Emotional Vocabulary Building**: Expand your ability to identify and express emotions
- **Strength & Weakness Analysis**: Understand your EQ strengths and areas for improvement
- **Progress Tracking**: Monitor your emotional intelligence development over time

## 🚀 Getting Started

### Prerequisites
- Node.js (v16+)
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/EQCoachDebate.git
cd EQCoachDebate
```

2. Install dependencies
```bash
npm install
# or 
yarn install
```

3. Set up environment variables
Create a `.env` file in the root directory with your API key:
```
VITE_GEMINI_API_KEY=your_gemini_api_key
```

4. Start the development server
```bash
npm run dev
# or
yarn dev
```

## 💻 Tech Stack

- **Frontend**: React with TypeScript
- **Styling**: Tailwind CSS
- **Animation**: Framer Motion
- **AI**: Google Gemini API
- **Speech Recognition**: Web Speech API
- **Backend Functions**: Supabase Edge Functions (Deno)
- **Face Detection**: face-api.js (for facial emotion analysis)

## 📋 Project Structure

- `src/components/` - React components for the UI
  - `Chat.tsx` - Debate interface component
  - `Dashboard.tsx` - Main dashboard
  - `Journey.tsx` - Emotional intelligence journey component
  - `Navbar.tsx` - Navigation component
- `src/lib/` - Utility functions and service modules
  - `gemini-service.ts` - Google Gemini API interaction logic
  - `utils.ts` - General utility functions
- `public/models/` - Face detection and emotion analysis models
- `supabase/functions/` - Backend serverless functions

## 🔑 API Keys

This project requires a Google Gemini API key to function. You can get one from [Google AI Studio](https://ai.google.dev/).

## 🧠 How It Works

### Debate Flow
1. User selects a debate topic or creates their own
2. User chooses which side to argue (for/against)
3. The debate progresses through structured stages:
   - Opening statements
   - Rebuttals
   - Closing statements
4. AI provides analysis of debate performance

### Emotional Intelligence Assessment
1. AI asks a series of questions to assess emotional intelligence
2. User responses are analyzed for emotional vocabulary and patterns
3. AI generates personalized feedback and insights
4. User receives an EQ score with specific category breakdowns

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the [MIT License](LICENSE).

## 🙏 Acknowledgements

- Google Gemini API for powering the AI capabilities
- Face-api.js for facial emotion detection
- Tailwind CSS for styling components
- Framer Motion for animations
