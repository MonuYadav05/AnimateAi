# AnimateAI - AI-Powered Animation Generator

A modern web application that allows users to create mathematical animations using natural language commands. Built with Next.js, Supabase, and integrates with Manim (Mathematical Animation Engine) through AI assistance.

## Features

- 🎨 **AI-Powered Animation Generation**: Describe animations in natural language and get Manim Python code
- 💬 **Interactive Chat Interface**: Modern chat UI for conversing with AI about your animation ideas
- 📁 **Project Management**: Organize your animations into projects with persistent chat history
- 🎬 **Video Rendering**: Automated rendering pipeline for Manim animations
- 🔐 **Secure Authentication**: User authentication and session management with Supabase
- 🌙 **Dark/Light Mode**: Responsive design with theme switching
- 📱 **Responsive Design**: Works seamlessly on desktop and mobile devices

## Tech Stack

- **Frontend**: Next.js 13+ with App Router, TypeScript, Tailwind CSS
- **UI Components**: Shadcn/ui with Radix UI primitives
- **Authentication**: Supabase Auth
- **Database**: Supabase PostgreSQL
- **State Management**: Zustand
- **LLM Integration**: OpenAI GPT-4 (configurable for other providers)
- **Animation Engine**: Manim (Python)

## Quick Start

### Prerequisites

- Node.js 18+ 
- A Supabase project
- OpenAI API key (or your preferred LLM provider)

### Installation

1. **Clone and install dependencies**:
```bash
git clone <repository-url>
cd ai-animation-generator
npm install
```

2. **Set up environment variables**:
```bash
cp .env.example .env.local
```

Fill in your environment variables:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
OPENAI_API_KEY=your_openai_api_key
```

3. **Set up Supabase database**:

Run the migrations in your Supabase SQL editor in this order:
- `supabase/migrations/create_projects_table.sql`
- `supabase/migrations/create_messages_table.sql` 
- `supabase/migrations/create_animations_table.sql`

4. **Start the development server**:
```bash
npm run dev
```

Visit `http://localhost:3000` to see the application.

## Project Structure

```
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   │   ├── chat/          # LLM integration
│   │   └── animations/    # Animation rendering
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Main application page
├── components/            # React components
│   ├── auth/              # Authentication components
│   ├── chat/              # Chat interface components
│   ├── layout/            # Layout components
│   ├── providers/         # Context providers
│   ├── ui/                # Shadcn UI components
│   └── video/             # Video player components
├── hooks/                 # Custom React hooks
├── lib/                   # Utilities and configurations
│   ├── store/             # Zustand state management
│   └── supabase/          # Supabase client and types
└── supabase/
    └── migrations/        # Database migrations
```

## Usage

1. **Sign up/Sign in**: Create an account or sign in with existing credentials
2. **Create a Project**: Click "New Project" in the sidebar to create your first animation project
3. **Chat with AI**: Describe your animation idea in natural language
4. **Review Generated Code**: The AI will generate Manim Python code for your animation
5. **Watch Rendering**: The system will automatically render your animation (simulated in demo)
6. **Preview Video**: View your completed animation in the video player

### Example Prompts

- "Create a bouncing ball animation"
- "Show a sine wave transforming into a cosine wave"
- "Animate the Pythagorean theorem"
- "Create a visualization of sorting algorithms"
- "Draw a rotating 3D cube with changing colors"

## Configuration

### LLM Provider

The application is configured to use OpenAI GPT-4 by default. To use a different provider:

1. Update the API call in `app/api/chat/route.ts`
2. Modify the request format according to your provider's API
3. Update environment variables accordingly

### Rendering Pipeline

The current implementation includes a simulated rendering pipeline. To integrate with actual Manim rendering:

1. Set up a backend service that can execute Manim code securely
2. Update `app/api/animations/render/route.ts` to trigger your rendering pipeline
3. Configure file storage for generated videos (Supabase Storage, AWS S3, etc.)

## Database Schema

### Projects
- User's animation projects with metadata

### Messages  
- Chat conversation history linked to projects

### Animations
- Generated Manim code and video artifacts with rendering status

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

### Environment Variables for Production

```env
NEXT_PUBLIC_SUPABASE_URL=your_production_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_production_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_production_supabase_service_role_key
OPENAI_API_KEY=your_openai_api_key
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

For questions or issues:
- Create an issue in the GitHub repository
- Check the documentation
- Review the example implementations in the code

---

Built with ❤️ using Next.js, Supabase, and AI