---
name: تحسين أداء JavaScript
overview: تحسين أداء الموقع عبر تقليل JavaScript الثقيل الذي يعمل عند التحميل، مع الحفاظ على نفس الواجهة تماماً
todos:
  - id: lazy-load-hero
    content: تحويل HeroWave إلى lazy loading في الصفحة الرئيسية
    status: completed
  - id: remove-motion
    content: إزالة مكتبة motion غير المستخدمة من package.json
    status: completed
  - id: code-split-recharts
    content: استخدام dynamic import لـ Recharts في صفحة Analytics
    status: completed
  - id: optimize-auth-store
    content: تأجيل auth bootstrap حتى بعد تفاعل الصفحة
    status: completed
  - id: optimize-next-config
    content: إضافة تحسينات إضافية في next.config.ts
    status: completed
  - id: defer-threejs-init
    content: تأجيل تهيئة Three.js في HeroWave حتى بعد render الأولي
    status: completed
    dependencies:
      - lazy-load-hero
---

# خطة تحسين أداء JavaScript

## المشاكل المحددة

1. **HeroWave Component** - يحمّل Three.js (~500KB) و GSAP (~50KB) فوراً عند فتح الصفحة الرئيسية
2. **مكتبة Motion** - غير مستخدمة (145KB من JavaScript غير مستخدم)
3. **Recharts** - محمّل في كل الصفحات رغم استخدامه فقط في صفحة Analytics
4. **Auth Store** - يعمل فوراً عند التحميل ويمكن تأجيله
5. **إعدادات Next.js** - تحتاج تحسينات إضافية

## الحلول المطلوبة

### 1. Lazy Load HeroWave Component

**الملف:** `src/app/[locale]/page.tsx`

- استخدام `next/dynamic` لتحميل HeroWave بشكل lazy
- تحميله بعد تفاعل الصفحة أو عند الحاجة فقط
- إضافة loading placeholder بسيط

### 2. إزالة مكتبة Motion غير المستخدمة

**الملف:** `package.json`

- حذف `motion` من dependencies
- التأكد من عدم استخدامها في أي مكان

### 3. Code Split Recharts

**الملف:** `src/app/[locale]/(dashboard)/forms/[id]/analytics/page.tsx`

- استخدام dynamic import لـ Recharts
- تحميله فقط عند فتح صفحة Analytics

### 4. تحسين Auth Store

**الملف:** `src/lib/stores/auth-store.ts`

- تأجيل bootstrapAuth حتى بعد تفاعل الصفحة
- استخدام `requestIdleCallback` أو `setTimeout` لتأجيل العمليات غير الحرجة

### 5. تحسين إعدادات Next.js

**الملف:** `next.config.ts`

- إضافة `swcMinify: true` لتقليل حجم JavaScript
- تفعيل `optimizePackageImports` للمكتبات الكبيرة
- إضافة bundle analyzer للتحقق من الحجم

### 6. تحسين HeroWave نفسه

**الملف:** `src/components/ui/ai-input-hero.tsx`

- تأجيل تهيئة Three.js حتى بعد render الأولي
- استخدام `requestIdleCallback` لتهيئة المشهد
- تقليل جودة الـ DPR على الأجهزة الضعيفة

## الملفات التي ستتغير

1. `src/app/[locale]/page.tsx` - Lazy load HeroWave
2. `package.json` - إزالة motion
3. `src/app/[locale]/(dashboard)/forms/[id]/analytics/page.tsx` - Dynamic import Recharts
4. `src/lib/stores/auth-store.ts` - تأجيل auth bootstrap
5. `next.config.ts` - تحسينات إضافية
6. `src/components/ui/ai-input-hero.tsx` - تأجيل تهيئة Three.js

## النتائج المتوقعة

- تقليل Total Blocking Time من 17,520ms إلى أقل من 3,000ms
- تقليل حجم JavaScript الأولي بحوالي 600KB+
- تحسين Time to Interactive بشكل كبير
- الحفاظ على نفس الواجهة تماماً