---
name: تحسين أداء JavaScript وتقليل Total Blocking Time
overview: تحسين أداء الموقع من خلال تقليل JavaScript الثقيل في التحميل الأولي، استخدام lazy loading و code splitting، وتأجيل تنفيذ الكود غير الضروري حتى بعد التفاعل الأولي.
todos:
  - id: lazy-load-hero-wave
    content: تحويل HeroWave إلى dynamic import في الصفحة الرئيسية مع loading skeleton
    status: completed
  - id: dynamic-import-three-gsap
    content: تحويل Three.js و GSAP imports إلى dynamic imports داخل HeroWave component
    status: completed
    dependencies:
      - lazy-load-hero-wave
  - id: optimize-three-init
    content: تحسين Three.js initialization باستخدام requestIdleCallback وتقسيم العمل إلى chunks
    status: completed
    dependencies:
      - dynamic-import-three-gsap
  - id: lazy-load-motion
    content: تحويل Motion library إلى dynamic import في hover-footer component
    status: completed
  - id: code-split-recharts
    content: تحويل Recharts إلى dynamic import في analytics page
    status: completed
  - id: optimize-next-config
    content: إضافة optimizePackageImports وتحسين webpack config في next.config.ts
    status: completed
---

# خطة تحسين أداء JavaScript وتقليل Total Blocking Time

## المشكلة الحالية

- **Total Blocking Time**: 17,520ms (ديسكتوب) / 4,210ms (موبايل)
- **34 ثانية عمل على Main Thread**
- **20 مهمة طويلة (Long Tasks)**
- **145 KB JavaScript غير مستخدم**

## الأسباب الرئيسية

### 1. HeroWave Component (المشكلة الأكبر)

- **الموقع**: `src/components/ui/ai-input-hero.tsx`
- **المشكلة**: 
- Three.js + GSAP محملان بشكل static (import مباشر)
- كل الكود الثقيل (~800 سطر) ينفذ في `useEffect` عند mount
- Three.js scene كامل + post-processing + shaders + animations
- يتم تحميله فوراً في الصفحة الرئيسية

### 2. عدم وجود Code Splitting

- كل المكتبات محملة في bundle واحد
- لا يوجد dynamic imports للمكونات الثقيلة

### 3. Motion Library

- محمّل في `hover-footer.tsx` بشكل static
- قد يكون في bundle الرئيسي حتى لو غير مستخدم

### 4. Recharts

- محمّل في analytics page
- قد يكون في bundle الرئيسي

## الحلول المطلوبة

### المرحلة 1: Lazy Load HeroWave Component

**الملفات للتعديل:**

- `src/app/[locale]/page.tsx`
- `src/components/ui/ai-input-hero.tsx`

**التغييرات:**

1. تحويل HeroWave إلى dynamic import مع `next/dynamic`
2. إضافة `ssr: false` لمنع SSR
3. إضافة loading skeleton بسيط
4. تأجيل تحميل Three.js حتى بعد hydration

### المرحلة 2: Dynamic Import للمكتبات الثقيلة في HeroWave

**الملفات للتعديل:**

- `src/components/ui/ai-input-hero.tsx`

**التغييرات:**

1. تحويل Three.js imports إلى dynamic imports داخل useEffect
2. تحويل GSAP import إلى dynamic import
3. تأجيل initialization حتى بعد:

- hydration
- requestIdleCallback (إذا متوفر)
- أو بعد 100ms delay

### المرحلة 3: تحسين Three.js Initialization

**الملفات للتعديل:**

- `src/components/ui/ai-input-hero.tsx`

**التغييرات:**

1. تقسيم initialization إلى chunks صغيرة
2. استخدام `requestIdleCallback` أو `setTimeout` لتأجيل العمل الثقيل
3. تقليل DPR على الموبايل (موجود لكن يمكن تحسينه)
4. إيقاف animation loop عند عدم visibility

### المرحلة 4: Lazy Load Motion Library

**الملفات للتعديل:**

- `src/components/ui/hover-footer.tsx`

**التغييرات:**

1. تحويل motion import إلى dynamic import
2. تحميله فقط عند الحاجة

### المرحلة 5: Code Splitting لـ Recharts

**الملفات للتعديل:**

- `src/app/[locale]/(dashboard)/forms/[id]/analytics/page.tsx`

**التغييرات:**

1. تحويل Recharts imports إلى dynamic import
2. تحميله فقط عند فتح صفحة Analytics

### المرحلة 6: تحسين Next.js Config

**الملفات للتعديل:**

- `next.config.ts`

**التغييرات:**

1. إضافة `experimental.optimizePackageImports` لـ Radix UI
2. إضافة bundle analyzer (اختياري)
3. تحسين webpack config لـ Three.js

### المرحلة 7: تحسين Auth Store (اختياري)

**الملفات للتعديل:**

- `src/lib/stores/auth-store.ts`

**التغييرات:**

1. تأجيل bootstrap حتى بعد hydration
2. استخدام `requestIdleCallback` للتحقق من session

## الترتيب التنفيذي

1. **أولاً**: Lazy load HeroWave (أكبر تأثير)
2. **ثانياً**: Dynamic import للمكتبات داخل HeroWave
3. **ثالثاً**: تحسين Three.js initialization
4. **رابعاً**: Lazy load Motion
5. **خامساً**: Code splitting لـ Recharts
6. **سادساً**: تحسين Next.js config

## النتائج المتوقعة

- **تقليل Total Blocking Time** من 17,520ms إلى < 300ms
- **تقليل Long Tasks** من 20 إلى < 3
- **تحسين Performance Score** من 60 إلى 90+
- **تقليل JavaScript Bundle Size** بنسبة 40-50%

## ملاحظات مهمة

- الحفاظ على تجربة المستخدم (لا تظهر loading spinners طويلة)
- التأكد من عمل animations بعد التحميل
- اختبار