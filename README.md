# Vibe Form 🚀

A modern, open-source AI-powered form builder platform with a marketplace for respondents and a credit-based economy. Create professional surveys in seconds using natural language, get quality responses from an engaged community, and gain AI-powered insights.

![Vibe Form Landing Page](https://raw.githubusercontent.com/alanqoudif/vibe-form-v2/main/public/image.png)

## ✨ Features

### 🤖 AI-Powered Form Creation
- Generate professional surveys from natural language descriptions
- Powered by OpenAI GPT-4
- Instant form generation in seconds
- Smart question suggestions and structure optimization

### 📝 Advanced Form Builder
- Drag & drop question ordering
- 7 question types: Short Text, Long Text, Multiple Choice, Checkbox, Likert Scale, Rating, Dropdown
- Real-time preview (desktop & mobile views)
- Customizable themes and branding
- Publish/Draft workflow

### 📊 Analytics Dashboard
- Views, starts, and submissions tracking
- Completion rate monitoring
- Response visualization with interactive charts
- CSV export functionality
- AI-powered insights and recommendations

### 💰 Credit Economy
- Earn credits by completing surveys
- Spend credits to boost your forms
- Quality-based rewards system
- Transparent transaction history

### 🌐 Marketplace
- Discover public forms to complete
- "Needs Responses", "Trending", "New", "For You" feeds
- Answer & Earn system
- Community-driven response quality

### 🌍 Internationalization
- Full Arabic (RTL) and English support
- Automatic locale detection
- Seamless language switching
- Culturally-aware UI components

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| **Next.js 15** | App Router, Server Components, SSR |
| **TypeScript** | Type safety and developer experience |
| **Tailwind CSS** | Utility-first styling |
| **shadcn/ui** | Beautiful, accessible UI components |
| **Three.js + GSAP** | Hero wave animation |
| **Supabase** | Database, Auth, Row Level Security |
| **OpenAI** | AI form generation |
| **next-intl** | Internationalization |
| **Zustand** | Lightweight state management |
| **React Query** | Server state and caching |
| **Recharts** | Analytics charts |
| **@dnd-kit** | Drag & Drop functionality |

## 🚀 Quick Start

### Prerequisites

- **Node.js** 20.9.0 or higher
- **npm** or **yarn** package manager
- **Supabase** account and project
- **OpenAI** API key

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/alanqoudif/vibe-form-v2.git
   cd vibe-form-v2
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   
   Create a `.env.local` file in the root directory:
   ```env
   # Supabase Configuration
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   
   # OpenAI Configuration
   OPENAI_API_KEY=sk-your-openai-key
   ```

   > **Note:** Get your Supabase credentials from your [Supabase Dashboard](https://app.supabase.com) → Project Settings → API. Get your OpenAI API key from [OpenAI Platform](https://platform.openai.com/api-keys).

4. **Set up the database:**
   
   You'll need to set up your Supabase database schema. Check the `vibe_form_prd_supabase.md` file for the complete database schema and migration scripts.

5. **Run the development server:**
   ```bash
   npm run dev
   ```

6. **Open your browser:**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📦 Deployment

### Deploy to Vercel (Recommended)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/alanqoudif/vibe-form-v2)

1. **Click the deploy button above** or visit [Vercel](https://vercel.com)
2. **Import your repository** from GitHub
3. **Add environment variables:**
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `OPENAI_API_KEY`
4. **Click Deploy** - Vercel will automatically build and deploy your app

### Deploy to Netlify

1. **Connect your repository** to [Netlify](https://www.netlify.com)
2. **Configure build settings:**
   - Build command: `npm run build`
   - Publish directory: `.next`
3. **Add environment variables** in Netlify dashboard
4. **Deploy** - Netlify will handle the rest

### Deploy to Other Platforms

This is a standard Next.js application, so it can be deployed to any platform that supports Next.js:

- **Railway** - Connect your GitHub repo and deploy
- **Render** - Connect your repository and configure environment variables
- **DigitalOcean App Platform** - Deploy with one-click
- **AWS Amplify** - Connect your repository
- **Self-hosted** - Use Docker or run directly with Node.js

## 📁 Project Structure

```
vibe-form-v2/
├── src/
│   ├── app/                      # Next.js App Router
│   │   ├── [locale]/             # Localized routes (en, ar)
│   │   │   ├── (auth)/           # Authentication pages
│   │   │   │   ├── login/
│   │   │   │   └── signup/
│   │   │   ├── (dashboard)/      # Protected dashboard routes
│   │   │   │   ├── forms/        # Form management
│   │   │   │   │   └── [id]/
│   │   │   │   │       ├── builder/
│   │   │   │   │       └── analytics/
│   │   │   │   ├── feed/         # Marketplace
│   │   │   │   └── credits/      # Credits wallet
│   │   │   ├── f/[slug]/         # Public form response page
│   │   │   └── page.tsx          # Landing page
│   │   └── api/                  # API routes
│   │       └── ai/               # AI endpoints
│   ├── components/               # React components
│   │   ├── ui/                   # shadcn/ui components
│   │   ├── forms/                # Form builder components
│   │   ├── landing/              # Landing page components
│   │   ├── providers/            # Context providers
│   │   └── seo/                  # SEO components
│   ├── lib/                      # Utility functions
│   │   ├── supabase/             # Supabase clients
│   │   ├── stores/               # Zustand stores
│   │   ├── hooks/                # Custom React hooks
│   │   └── utils.ts              # Helper functions
│   ├── i18n/                     # Internationalization config
│   ├── types/                    # TypeScript type definitions
│   └── middleware.ts              # Next.js middleware
├── messages/                     # Translation files
│   ├── en.json                   # English translations
│   └── ar.json                   # Arabic translations
├── public/                       # Static assets
├── package.json                  # Dependencies
├── tsconfig.json                 # TypeScript config
├── next.config.ts                # Next.js config
└── README.md                     # This file
```

## 🗄️ Database Schema

The Supabase database includes the following main tables:

- **`profiles`** - User profiles with credits balance
- **`forms`** - Form definitions and metadata
- **`form_questions`** - Question definitions
- **`responses`** - Form response records
- **`response_answers`** - Individual answer values
- **`form_events`** - Analytics events (views, starts, etc.)
- **`credits_ledger`** - Credit transaction history
- **`boost_products`** - Boost options and pricing
- **`boost_purchases`** - Boost purchase records

For detailed schema information, see `vibe_form_prd_supabase.md`.

## 🛣️ Key Routes

| Route | Description | Auth Required |
|-------|-------------|---------------|
| `/` | Landing page with AI prompt | No |
| `/login` | User login | No |
| `/signup` | User registration | No |
| `/forms` | My forms list | Yes |
| `/forms/[id]/builder` | Form builder interface | Yes |
| `/forms/[id]/analytics` | Analytics dashboard | Yes |
| `/f/[slug]` | Public form (respondent view) | No |
| `/feed` | Marketplace feed | No |
| `/credits` | Credits wallet | Yes |
| `/settings` | User settings | Yes |

## 🔌 API Endpoints

### `POST /api/ai/generate-form`

Generates a form from a natural language prompt.

**Request:**
```json
{
  "prompt": "Create a customer satisfaction survey"
}
```

**Response:**
```json
{
  "formId": "uuid",
  "redirectUrl": "/forms/uuid/builder"
}
```

### `POST /api/ai/insights`

Generates AI-powered insights from form responses.

**Request:**
```json
{
  "formId": "uuid"
}
```

**Response:**
```json
{
  "themes": ["theme1", "theme2"],
  "sentiment": "positive",
  "recommendations": ["rec1", "rec2"]
}
```

## 📜 Available Scripts

```bash
# Development
npm run dev          # Start development server on http://localhost:3000

# Production
npm run build        # Build for production
npm run start        # Start production server

# Code Quality
npm run lint         # Run ESLint
```

## 🔐 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL | Yes |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous/public key | Yes |
| `OPENAI_API_KEY` | OpenAI API key for form generation | Yes |

## 🤝 Contributing

We welcome contributions! Here's how you can help:

1. **Fork the repository**
2. **Create a feature branch:**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Make your changes** and test thoroughly
4. **Commit your changes:**
   ```bash
   git commit -m 'Add some amazing feature'
   ```
5. **Push to the branch:**
   ```bash
   git push origin feature/amazing-feature
   ```
6. **Open a Pull Request**

### Contribution Guidelines

- Follow the existing code style
- Write meaningful commit messages
- Add tests for new features
- Update documentation as needed
- Be respectful and constructive in discussions

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) for the amazing framework
- [Supabase](https://supabase.com/) for the backend infrastructure
- [OpenAI](https://openai.com/) for AI capabilities
- [shadcn/ui](https://ui.shadcn.com/) for beautiful UI components
- All the amazing open-source contributors

## 📞 Support

- **Documentation:** Check this README and code comments
- **Issues:** [GitHub Issues](https://github.com/alanqoudif/vibe-form-v2/issues)
- **Discussions:** [GitHub Discussions](https://github.com/alanqoudif/vibe-form-v2/discussions)

---

<div align="center">

**Made with ❤️ by [Faisal Al-Anqoudi](https://github.com/alanqoudif) from [nuqta ai](https://nuqta.ai)**

[⭐ Star us on GitHub](https://github.com/alanqoudif/vibe-form-v2) • [🐛 Report Bug](https://github.com/alanqoudif/vibe-form-v2/issues) • [💡 Request Feature](https://github.com/alanqoudif/vibe-form-v2/issues)

</div>
