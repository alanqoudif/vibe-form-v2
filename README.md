# Vibe Form 🚀

A modern AI-powered form builder platform with a marketplace for respondents and a credit-based economy.

![Vibe Form Landing Page](https://via.placeholder.com/800x400?text=Vibe+Form+Landing+Page)

## Features

### 🤖 AI-Powered Form Creation
- Generate professional surveys from natural language descriptions
- Powered by OpenAI GPT-4
- Instant form generation in seconds

### 📝 Form Builder
- Drag & drop question ordering
- 7 question types: Short Text, Long Text, Multiple Choice, Checkbox, Likert Scale, Rating, Dropdown
- Real-time preview
- Publish/Draft workflow

### 📊 Analytics Dashboard
- Views, starts, and submissions tracking
- Completion rate monitoring
- Response visualization with charts
- CSV export functionality

### 💰 Credit Economy
- Earn credits by completing surveys
- Spend credits to boost your forms
- Quality-based rewards

### 🌐 Marketplace
- Discover public forms to complete
- "Needs Responses", "Trending", "New", "For You" feeds
- Answer & Earn system

### 🌍 Internationalization
- Full Arabic (RTL) and English support
- Automatic locale detection

## Tech Stack

| Technology | Purpose |
|------------|---------|
| Next.js 15 | App Router, Server Components |
| TypeScript | Type safety |
| Tailwind CSS | Styling |
| shadcn/ui | UI Components |
| Three.js + GSAP | Hero wave animation |
| Supabase | Database, Auth, RLS |
| OpenAI | Form generation |
| next-intl | Internationalization |
| Zustand | State management |
| React Query | Server state |
| Recharts | Analytics charts |
| @dnd-kit | Drag & Drop |

## Getting Started

### Prerequisites
- Node.js 18+
- Supabase project
- OpenAI API key

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd vibe-form
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

Edit `.env.local` with your credentials:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
OPENAI_API_KEY=sk-your-openai-key
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000)

## Project Structure

```
src/
├── app/
│   ├── [locale]/              # Localized routes
│   │   ├── (auth)/            # Auth pages
│   │   ├── (dashboard)/       # Dashboard pages
│   │   │   ├── forms/         # Form management
│   │   │   ├── feed/          # Marketplace
│   │   │   └── credits/       # Credits wallet
│   │   ├── f/[slug]/          # Public form response
│   │   └── page.tsx           # Landing page
│   └── api/                   # API routes
│       └── ai/                # AI endpoints
├── components/
│   ├── ui/                    # shadcn components
│   ├── forms/                 # Form builder components
│   ├── landing/               # Landing page components
│   └── providers/             # Context providers
├── lib/
│   ├── supabase/              # Supabase clients
│   └── stores/                # Zustand stores
├── i18n/                      # Internationalization
├── types/                     # TypeScript types
└── messages/                  # Translation files
```

## Database Schema

The Supabase database includes:
- `profiles` - User profiles with credits balance
- `forms` - Form definitions
- `form_questions` - Question definitions
- `responses` - Form responses
- `response_answers` - Individual answers
- `form_events` - Analytics events
- `credits_ledger` - Credit transactions
- `boost_products` - Boost options
- `boost_purchases` - Boost purchases
- And more...

## Key Pages

| Route | Description |
|-------|-------------|
| `/` | Landing page with AI prompt |
| `/login` | Login page |
| `/signup` | Signup page |
| `/forms` | My forms list |
| `/forms/[id]/builder` | Form builder |
| `/forms/[id]/analytics` | Analytics dashboard |
| `/f/[id]` | Public form (respondent view) |
| `/feed` | Marketplace feed |
| `/credits` | Credits wallet |

## API Endpoints

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

## Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

## Environment Variables

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon/public key |
| `OPENAI_API_KEY` | OpenAI API key |

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## License

MIT License - see LICENSE file for details

---

Built with ❤️ using Next.js, Supabase, and OpenAI
