---
name: Vibe Form Full Build
overview: "بناء منصة Vibe Form كاملة مع HeroWave Landing Page ديناميكية: كتابة prompt تنقل للـ Builder مباشرة، والسكرول يعرض الفورمز السابقة."
todos:
  - id: setup
    content: تهيئة Next.js 15 + Tailwind + shadcn/ui + three + gsap + Supabase + next-intl
    status: completed
  - id: hero-components
    content: إضافة HeroWave + mini-navbar components مع تعديلات Vibe Form
    status: completed
    dependencies:
      - setup
  - id: landing-page
    content: بناء Landing page مع HeroWave + MyFormsSection + dynamic prompt submit
    status: completed
    dependencies:
      - hero-components
  - id: auth
    content: بناء Auth pages + Middleware + تعديل Navbar للحالة
    status: completed
    dependencies:
      - landing-page
  - id: ai-generation
    content: بناء API route لتوليد الفورم بـ OpenAI + حفظ في Supabase
    status: completed
    dependencies:
      - auth
  - id: form-builder
    content: بناء Form Builder UI كامل مع Drag & Drop + Question types + Preview
    status: completed
    dependencies:
      - ai-generation
  - id: public-form
    content: بناء صفحة الاستجابة العامة + Events tracking + Credits
    status: completed
    dependencies:
      - form-builder
  - id: dashboard
    content: بناء Dashboard + Analytics + AI Insights
    status: completed
    dependencies:
      - public-form
  - id: marketplace
    content: بناء Feed + Answer & Earn + Credits wallet + Boost
    status: completed
    dependencies:
      - dashboard
  - id: polish
    content: Loading states + Error handling + SEO + Performance + RTL polish
    status: completed
    dependencies:
      - marketplace
---

# Vibe Form - خطة البناء الكاملة (محدثة)

## نظرة عامة

بناء منصة **Vibe Form** - Micro SaaS لإنشاء الاستبيانات بالذكاء الاصطناعي مع Landing Page تفاعلية (HeroWave)، Marketplace للمجيبين، ونظام Credits.

```mermaid
graph TB
    subgraph landing [Landing Experience]
        HeroWave[HeroWave + Prompt Input]
        MyForms[My Forms Section - Scroll]
    end
    
    subgraph app [App Flow]
        Auth[Auth]
        Builder[Form Builder]
        Dashboard[Dashboard]
        Feed[Marketplace]
    end
    
    subgraph backend [Supabase Backend]
        EdgeFn[Edge Functions]
        DB[(PostgreSQL)]
        OpenAI[OpenAI gpt-5-nano]
    end
    
    HeroWave -->|Submit Prompt| EdgeFn
    EdgeFn -->|Generate Form| OpenAI
    EdgeFn -->|Save Draft| DB
    EdgeFn -->|Redirect| Builder
    MyForms -->|Load| DB
    Builder --> Dashboard
    Dashboard --> Feed
```

---

## Stack التقني

| Component | Technology |

|-----------|------------|

| Framework | Next.js 15 (App Router) |

| Styling | Tailwind CSS + shadcn/ui |

| 3D/Animation | Three.js + GSAP |

| Backend | Supabase (DB جاهز) |

| AI | OpenAI gpt-5-nano-2025-08-07 via API Routes |

| i18n | next-intl (AR/EN + RTL) |

| State | Zustand + React Query |

| Forms | React Hook Form + Zod |

| Charts | Recharts |

| DnD | @dnd-kit |

---

## هيكل المشروع

```
src/
├── app/
│   ├── [locale]/
│   │   ├── page.tsx (Landing with HeroWave)
│   │   ├── (auth)/login, signup
│   │   ├── (dashboard)/
│   │   │   ├── forms/
│   │   │   │   ├── page.tsx (My Forms)
│   │   │   │   ├── new/page.tsx (Create from prompt)
│   │   │   │   └── [id]/
│   │   │   │       ├── builder/page.tsx
│   │   │   │       ├── analytics/page.tsx
│   │   │   │       └── settings/page.tsx
│   │   │   ├── feed/page.tsx
│   │   │   ├── credits/page.tsx
│   │   │   └── settings/page.tsx
│   │   └── f/[slug]/page.tsx (Public form)
│   └── api/
│       └── ai/generate-form/route.ts
├── components/
│   ├── ui/
│   │   ├── ai-input-hero.tsx (HeroWave)
│   │   ├── mini-navbar.tsx
│   │   └── ... (shadcn components)
│   ├── landing/
│   │   └── my-forms-section.tsx
│   ├── forms/
│   │   ├── question-types/
│   │   ├── builder-sidebar.tsx
│   │   └── form-preview.tsx
│   └── dashboard/
├── lib/
│   ├── supabase/
│   ├── ai/
│   └── utils/
├── locales/ (ar.json, en.json)
└── types/
```

---

## تدفق Landing Page الديناميكي

```mermaid
sequenceDiagram
    participant User
    participant HeroWave
    participant API
    participant OpenAI
    participant DB
    participant Builder

    User->>HeroWave: يكتب prompt ويرسل
    HeroWave->>API: POST /api/ai/generate-form
    API->>OpenAI: Generate form structure (gpt-5-nano-2025-08-07)
    OpenAI-->>API: Form JSON
    API->>DB: Save as Draft
    DB-->>API: form_id
    API-->>HeroWave: Redirect URL
    HeroWave->>Builder: router.push(/forms/[id]/builder)
    
    Note over User,HeroWave: إذا سكرول...
    User->>HeroWave: Scroll down
    HeroWave->>DB: Fetch user forms
    DB-->>HeroWave: Forms list
    HeroWave->>User: عرض الفورمز السابقة
```

---

## المراحل التفصيلية

### المرحلة 1: Setup (الأساسيات)

- تهيئة Next.js 15 + Tailwind + TypeScript
- إعداد shadcn/ui (dark theme)
- تثبيت: `three`, `gsap`, `@types/three`
- تكامل Supabase Client + Types generation
- إعداد next-intl (AR/EN + RTL)

### المرحلة 2: Landing Page + HeroWave

**المكونات:**

- `components/ui/ai-input-hero.tsx` - HeroWave component
- `components/ui/mini-navbar.tsx` - Navbar component
- `components/landing/my-forms-section.tsx` - قسم الفورمز السابقة

**السلوك الديناميكي:**

```tsx
// app/[locale]/page.tsx
const handlePromptSubmit = async (prompt: string) => {
  // 1. Show loading state
  // 2. Call API to generate form
  // 3. Redirect to /forms/[newFormId]/builder
}
```

**قسم My Forms (عند السكرول):**

- Grid من الفورمز السابقة
- كل كارد يعرض: title, status, responses count, created_at
- زر "View" للـ Analytics و "Edit" للـ Builder
- Infinite scroll أو pagination

### المرحلة 3: Auth System

- Login/Signup pages (Email + OAuth)
- Middleware للحماية
- Auto-create profile on signup
- تعديل Navbar ليعرض حالة المستخدم

### المرحلة 4: AI Form Generation

**Model:** `gpt-5-nano-2025-08-07` (fast + cost-effective)

**API Route:**

```typescript
// POST /api/ai/generate-form
// Input: { prompt: string }
// Output: { formId: string, redirectUrl: string }

// Steps:
// 1. Validate user session
// 2. Call OpenAI gpt-5-nano-2025-08-07 with structured output
// 3. Parse response to form structure
// 4. Insert into forms + form_questions tables
// 5. Return formId for redirect
```

**OpenAI Configuration:**

```typescript
const response = await openai.chat.completions.create({
  model: "gpt-5-nano-2025-08-07",
  messages: [...],
  response_format: { type: "json_object" }
});
```

**Prompt Template:**

- System prompt يشرح الـ form structure
- Output: JSON with title, description, questions[]
- كل سؤال: type, title, description, required, options

### المرحلة 5: Form Builder UI

- Sidebar: قائمة الأسئلة + Add question
- Main area: تحرير السؤال المحدد
- Drag & Drop لترتيب الأسئلة
- Question types components
- Live Preview panel
- Publish/Save Draft buttons
- Settings (visibility, target_responses)

### المرحلة 6: Public Form (Respondent)

- صفحة `/f/[slug]` عامة
- Progress bar
- Question-by-question أو صفحة كاملة
- Submit + Thank you page
- Events tracking (view, start, submit)
- Credits award logic

### المرحلة 7: Dashboard + Analytics

- Overview cards
- Charts (Recharts)
- Responses table
- Export CSV
- AI Insights section

### المرحلة 8: Marketplace + Credits

- Feed page with tabs
- Answer & Earn flow
- Credits wallet
- Boost purchase

### المرحلة 9: Polish

- Loading states + Skeletons
- Error boundaries
- SEO + OG images
- Performance optimization
- Responsive design final pass

---

## ملفات المكونات الرئيسية

### HeroWave Component

الملف: `components/ui/ai-input-hero.tsx`

- Three.js wave animation
- Typing placeholder animation
- Form submission handler
- يستقبل `onPromptSubmit` callback

### Mini Navbar

الملف: `components/ui/mini-navbar.tsx`

- تعديل الروابط لتناسب Vibe Form
- إضافة حالة المستخدم (logged in/out)
- تعديل Logo

### My Forms Section

الملف: `components/landing/my-forms-section.tsx`

- Fetch forms من Supabase
- Grid layout
- Form cards with stats
- Empty state

---

## Supabase Integration Points

| Feature | Table | Operation |

|---------|-------|-----------|

| Generate Form | forms, form_questions | INSERT |

| My Forms | forms | SELECT with analytics |

| Save Draft | forms, form_questions | UPDATE |

| Publish | forms | UPDATE status |

| Submit Response | responses, response_answers | INSERT |

| Credits | credits_ledger, profiles | INSERT, UPDATE |

---

## Environment Variables Required

```env
NEXT_PUBLIC_SUPABASE_URL=https://gsfjwoskaabjjydsgwpd.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...
OPENAI_API_KEY=sk-...
```