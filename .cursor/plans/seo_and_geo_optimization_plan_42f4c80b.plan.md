---
name: SEO and GEO Optimization Plan
overview: خطة شاملة لتحسين SEO وGEO للموقع vibeform.pro تشمل تحسينات تقنية ومحتوى وعلامات جغرافية متعددة اللغات
todos: []
---

# خطة تحسين SEO وGEO للموقع vibeform.pro

## نظرة عامة

الموقع مبني على Next.js 16 مع دعم متعدد اللغات (العربية والإنجليزية). الخطة تشمل تحسينات تقنية ومحتوى وعلامات جغرافية.

## 1. تحسينات Metadata الأساسية

### 1.1 تحديث Root Layout Metadata

- **الملف**: `src/app/layout.tsx`
- إضافة metadata ديناميكي حسب اللغة
- تحسين Open Graph وTwitter Cards
- إضافة canonical URLs
- إضافة metadata للغة والمنطقة

### 1.2 Metadata ديناميكي للصفحات

- **الملف**: `src/app/[locale]/layout.tsx`
- إضافة metadata محلي لكل لغة
- إضافة hreflang tags للصفحات
- تحسين titles وdescriptions لكل لغة

### 1.3 Metadata لصفحات النماذج العامة

- **الملف**: `src/app/[locale]/f/[slug]/page.tsx`
- إضافة generateMetadata function
- metadata ديناميكي لكل نموذج (title, description, image)
- Open Graph محسّن للنماذج

## 2. ملفات SEO الأساسية

### 2.1 robots.txt

- **الملف**: `public/robots.txt`
- السماح لمحركات البحث بالوصول
- تحديد موقع sitemap
- منع صفحات غير مهمة

### 2.2 Sitemap.xml ديناميكي

- **الملف**: `src/app/sitemap.ts` (Next.js App Router)
- إنشاء sitemap ديناميكي يشمل:
- الصفحات الثابتة (home, login, signup)
- النماذج المنشورة
- دعم متعدد اللغات (en, ar)
- تحديث تلقائي

### 2.3 Structured Data (JSON-LD)

- **الملف**: مكون جديد `src/components/seo/structured-data.tsx`
- إضافة Schema.org markup:
- Organization schema
- WebSite schema
- SoftwareApplication schema
- BreadcrumbList schema
- FAQPage schema (إذا لزم الأمر)

## 3. تحسينات GEO (Geographic SEO)

### 3.1 hreflang Tags

- **الملف**: `src/components/seo/hreflang.tsx`
- إضافة hreflang tags لكل صفحة
- ربط النسخ العربية والإنجليزية
- تحديد اللغة الافتراضية

### 3.2 Geographic Targeting

- إضافة metadata للاستهداف الجغرافي
- تحديد المناطق المستهدفة (الشرق الأوسط، العالم)
- تحسين metadata للمحتوى العربي

## 4. تحسينات المحتوى

### 4.1 تحسين Titles وDescriptions

- **الملفات**: 
- `src/app/[locale]/page.tsx`
- `src/app/[locale]/forms/page.tsx`
- `src/app/[locale]/feed/page.tsx`
- titles محسّنة لكل صفحة
- descriptions جذابة ومحتوية على keywords
- دعم متعدد اللغات

### 4.2 Semantic HTML

- مراجعة واستخدام semantic tags
- تحسين heading hierarchy (h1, h2, h3)
- إضافة ARIA labels حيث لزم

### 4.3 Alt Text للصور

- **الملفات**: جميع الملفات التي تستخدم Image
- إضافة alt text وصفية لجميع الصور
- دعم متعدد اللغات للـ alt text

## 5. تحسينات الأداء (Core Web Vitals)

### 5.1 Image Optimization

- التأكد من استخدام Next.js Image component
- إضافة lazy loading
- تحسين أحجام الصور

### 5.2 Font Optimization

- **الملف**: `src/app/layout.tsx`
- تحسين تحميل الخطوط العربية
- إضافة font-display: swap

## 6. Open Graph وSocial Media

### 6.1 Open Graph محسّن

- **الملف**: مكون جديد `src/components/seo/og-tags.tsx`
- صور OG ديناميكية
- دعم متعدد اللغات
- صور مخصصة لكل نوع صفحة

### 6.2 Twitter Cards

- تحسين Twitter Card metadata
- صور مخصصة للتويتر

## 7. تحسينات إضافية

### 7.1 Canonical URLs

- إضافة canonical URLs لكل صفحة
- تجنب duplicate content
- دعم متعدد اللغات

### 7.2 Breadcrumbs

- **الملف**: `src/components/seo/breadcrumbs.tsx`
- إضافة breadcrumbs للصفحات
- Structured data للـ breadcrumbs

### 7.3 Analytics وTracking

- التأكد من إعداد Google Analytics/Search Console
- إضافة tracking للـ SEO metrics

## 8. ملفات التكوين

### 8.1 next.config.ts

- **الملف**: `next.config.ts`
- إضافة headers للـ SEO
- تحسين security headers
- إضافة compression

## 9. اختبارات ومراجعة

### 9.1 أدوات التحقق

- Google Search Console setup
- Google Rich Results Test
- Schema Markup Validator
- PageSpeed Insights

### 9.2 Checklist

- جميع الصفحات لها titles فريدة
- جميع الصفحات لها meta descriptions
- hreflang tags صحيحة
- Structured data صحيحة
- Sitemap محدث
- robots.txt موجود

## الملفات التي سيتم إنشاؤها/تعديلها

### ملفات جديدة:

1. `public/robots.txt`
2. `src/app/sitemap.ts`
3. `src/components/seo/structured-data.tsx`
4. `src/components/seo/hreflang.tsx`
5. `src/components/seo/og-tags.tsx`
6. `src/components/seo/breadcrumbs.tsx`
7. `src/lib/seo/metadata.ts` (utility functions)

### ملفات معدلة:

1. `src/app/layout.tsx`
2. `src/app/[locale]/layout.tsx`
3. `src/app/[locale]/page.tsx`
4. `src/app/[locale]/f/[slug]/page.tsx`
5. `src/app/[locale]/forms/page.tsx`
6. `src/app/[locale]/feed/page.tsx`
7. `next.config.ts`

## ملاحظات مهمة

1. **اللغة العربية**: التأكد من دعم RTL بشكل صحيح في جميع metadata
2. **الأداء**: جميع التحسينات يجب ألا تؤثر على أداء الموقع
3. **التحديثات**: Sitemap يجب أن يتحدث تلقائياً عند نشر نماذج جديدة
4. **الخصوصية**: التأكد من عدم كشف معلومات حساسة في metadata