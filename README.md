# CareOps AI - Healthcare Operations Agent

CareOps AI is a sophisticated healthcare operations platform designed to streamline administrative workflows using AI. It focuses on medical coding, claims adjudication, and prior authorization with a strong emphasis on auditable reasoning.

## Features

- **Medical Coding Agent**: AI-assisted ICD-10 and CPT code extraction from clinical documentation.
- **Claims Adjudication Agent**: Automated policy compliance and payment determination engine.
- **Prior Authorization Agent**: AI-driven medical necessity review with manual override and denial recording.
- **Patient Access & Scheduling**: Intelligent appointment management.
- **Intake & Documentation**: Digital form processing and EHR pre-filling.
- **Clinical Support**: Risk detection for readmission and sepsis.

## Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **AI Engine**: Google Gemini API (@google/genai)
- **Animations**: Motion (framer-motion)

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- A Google Gemini API Key

### Installation

1. Clone the repository:
   ```bash
   git clone <your-repo-url>
   cd careops-ai
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory and add your Gemini API key:
   ```env
   GEMINI_API_KEY=your_api_key_here
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Build for production:
   ```bash
   npm run build
   ```

## Project Structure

- `src/components/`: UI components for different operational views.
- `src/services/`: AI service integration using Gemini.
- `src/App.tsx`: Main application logic and state management.
- `metadata.json`: Application metadata and permissions.

## License

MIT
