---
name: SEO و GEO PRO Plan
overview: خطة شاملة لتحسين SEO وGEO لموقع vibeform.pro لضمان الظهور في نتائج البحث لجميع الكلمات المفتاحية المتعلقة بالاستبيانات والنماذج وGoogle Forms البدائل
todos: []
---

# خطة SEO و GEO PRO لموقع vibeform.pro

## نظرة عامة

خطة شاملة لتحسين محرك البحث (SEO) والبحث الجغرافي (GEO) لموقع **vibeform.pro** لضمان الظهور في نتائج البحث عند بحث المستخدمين عن أي شيء متعلق بالاستبيانات، النماذج، Google Forms البدائل، أو أي محتوى له علاقة بأهداف المنصة.

## الأهداف الاستراتيجية

1. **الظهور في المراكز الأولى** للكلمات المفتاحية الأساسية (منصة استبيانات، صانع نماذج، بديل Google Forms)
2. **زيادة الحركة العضوية** بنسبة 300% خلال 6 أشهر
3. **تحسين معدل التحويل** من الزوار إلى مستخدمين مسجلين
4. **بناء سلطة الموقع** (Domain Authority) من خلال محتوى عالي الجودة وروابط موثوقة
5. **الظهور في البحث المحلي** للمناطق المستهدفة (الخليج العربي، الشرق الأوسط)

---

## المرحلة الأولى: التحسينات التقنية (Technical SEO)

### 1.1 تحسين Metadata و Structured Data

**الملفات المستهدفة:**

- `src/lib/seo/metadata.ts` - تحسين دالة generateMetadata
- `src/components/seo/structured-data.tsx` - إضافة أنواع Schema إضافية
- `src/app/[locale]/page.tsx` - إضافة metadata محسّنة للصفحة الرئيسية

**التحسينات المطلوبة:**

1. **تحسين Title Tags:**

- إضافة كلمات مفتاحية طبيعية في بداية العنوان
- طول مثالي: 50-60 حرف
- أمثلة:
- AR: "صانع نماذج احترافي | Vibeform Pro - استبيانات مجانية"
- EN: "Professional Form Builder | Vibeform Pro - Free Surveys"

2. **تحسين Meta Descriptions:**

- طول مثالي: 150-160 حرف
- تضمين CTA واضح
- كلمات مفتاحية طبيعية

3. **إضافة Schema Markup إضافية:**

- `FAQPage Schema` للصفحة الرئيسية
- `HowTo Schema` للمقالات التعليمية
- `Review/Rating Schema` لصفحات المنتج
- `LocalBusiness Schema` (إذا كان هناك موقع فعلي)
- `Product Schema` مع معلومات التسعير

4. **تحسين Keywords Meta Tag:**

- إضافة كلمات مفتاحية شاملة بالعربية والإنجليزية
- التركيز على: استبيانات، نماذج، Google Forms بديل، form builder، survey platform

### 1.2 تحسين Sitemap

**الملف المستهدف:** `src/app/sitemap.ts`

**التحسينات:**

1. إضافة صفحات جديدة:

- `/ar/blog` و `/en/blog` (عند إنشائها)
- `/ar/features` و `/en/features`
- `/ar/pricing` و `/en/pricing`
- `/ar/faq` و `/en/faq`
- `/ar/templates` و `/en/templates`

2. إنشاء Sitemaps متعددة:

- `sitemap.xml` (Main sitemap index)
- `sitemap-pages.xml` (Static pages)
- `sitemap-forms.xml` (Public forms)
- `sitemap-blog.xml` (Blog posts)
- `sitemap-images.xml` (Images)

3. تحسين Priority و ChangeFrequency:

- الصفحة الرئيسية: priority 1.0, daily
- صفحات الميزات: priority 0.9, weekly
- المدونة: priority 0.8, daily
- النماذج العامة: priority 0.7, weekly

### 1.3 تحسين Robots.txt

**الملف المستهدف:** `public/robots.txt`

**التحسينات:**

1. إضافة Sitemaps متعددة
2. تحسين Disallow rules
3. إضافة Crawl-delay إذا لزم الأمر
4. إضافة User-agent specific rules

### 1.4 تحسين Core Web Vitals

**الملفات المستهدفة:**

- `next.config.ts` - تحسين Image optimization
- `src/app/[locale]/page.tsx` - Lazy loading للصور
- `src/components/ui/ai-input-hero.tsx` - تحسين تحميل Three.js

**التحسينات:**

1. **Largest Contentful Paint (LCP):**

- استخدام Next.js Image component مع priority للصور المهمة
- Preload للخطوط الحرجة
- تحسين Hero section loading

2. **First Input Delay (FID):**

- Code splitting للـ JavaScript
- Defer non-critical scripts
- تحسين React hydration

3. **Cumulative Layout Shift (CLS):**

- تحديد أبعاد الصور مسبقاً
- تجنب إدراج محتوى ديناميكي بدون حجز مساحة
- استخدام Skeleton loaders

---

## المرحلة الثانية: إنشاء صفحات SEO محسّنة

### 2.1 صفحة Features (الميزات)

**مسار الملف:** `src/app/[locale]/features/page.tsx`

**المحتوى المطلوب:**

- H1: "ميزات Vibeform Pro - منصة الاستبيانات الاحترافية"
- وصف شامل لكل ميزة مع صور
- مقارنة مع Google Forms
- Schema: Product Schema مع FeatureList

**الكلمات المفتاحية المستهدفة:**

- AR: "ميزات منصة الاستبيانات"، "مميزات صانع النماذج"
- EN: "form builder features", "survey platform features"

### 2.2 صفحة Pricing (التسعير)

**مسار الملف:** `src/app/[locale]/pricing/page.tsx`

**المحتوى المطلوب:**

- جدول مقارنة الخطط
- Schema: Product Schema مع Offer
- FAQ section عن الأسعار
- CTA واضح

**الكلمات المفتاحية المستهدفة:**

- AR: "أسعار منصة الاستبيانات"، "تكلفة صانع النماذج"
- EN: "form builder pricing", "survey platform cost"

### 2.3 صفحة FAQ (الأسئلة الشائعة)

**مسار الملف:** `src/app/[locale]/faq/page.tsx`

**المحتوى المطلوب:**

- 20-30 سؤال شائع مع إجابات مفصلة
- Schema: FAQPage Schema
- تنظيم حسب الفئات
- Internal links إلى صفحات ذات صلة

**الكلمات المفتاحية المستهدفة:**

- AR: "أسئلة شائعة عن الاستبيانات"، "كيفية استخدام صانع النماذج"
- EN: "form builder FAQ", "survey platform questions"

### 2.4 صفحة Templates (القوالب)

**مسار الملف:** `src/app/[locale]/templates/page.tsx`

**المحتوى المطلوب:**

- معرض قوالب جاهزة
- فئات: استبيانات، نماذج تسجيل، استطلاعات رأي
- Schema: CollectionPage Schema
- Internal links قوية

**الكلمات المفتاحية المستهدفة:**

- AR: "قوالب استبيانات جاهزة"، "نماذج استبيان جاهزة"
- EN: "survey templates", "form templates"

### 2.5 صفحة Comparison (المقارنة)

**مسار الملف:** `src/app/[locale]/vs-google-forms/page.tsx`

**المحتوى المطلوب:**

- مقارنة شاملة مع Google Forms
- جدول مقارنة تفصيلي
- Schema: ComparisonTable Schema
- CTA واضح للتجربة

**الكلمات المفتاحية المستهدفة:**

- AR: "بديل Google Forms"، "مقارنة مع Google Forms"
- EN: "Google Forms alternative", "vs Google Forms"

---

## المرحلة الثالثة: إنشاء محتوى المدونة (Blog)

### 3.1 هيكل المدونة

**مسار الملف:** `src/app/[locale]/blog/page.tsx` (قائمة المقالات)
**مسار الملف:** `src/app/[locale]/blog/[slug]/page.tsx` (صفحة المقال)

**المتطلبات:**

1. نظام تصنيفات (Categories)
2. نظام Tags
3. Author pages
4. Related posts
5. Schema: Article Schema لكل مقال

### 3.2 مقالات SEO محسّنة (أول 10 مقالات)

1. **"كيفية إنشاء استبيان احترافي في 5 خطوات"**

- الكلمات المفتاحية: "كيفية إنشاء استبيان"، "طريقة عمل استبيان"
- Schema: HowTo Schema
- 2000+ كلمة

2. **"Vibeform vs Google Forms: المقارنة الشاملة 2025"**

- الكلمات المفتاحية: "بديل Google Forms"، "مقارنة Google Forms"
- Schema: ComparisonTable Schema
- 2500+ كلمة

3. **"أفضل 10 ممارسات لتصميم الاستبيانات"**

- الكلمات المفتاحية: "تصميم الاستبيانات"، "أفضل ممارسات الاستبيانات"
- Schema: Article Schema
- 2000+ كلمة

4. **"كيفية زيادة معدل الاستجابة للاستبيانات"**

- الكلمات المفتاحية: "زيادة معدل الاستجابة"، "تحسين الاستبيانات"
- Schema: Article Schema
- 1800+ كلمة

5. **"دليل شامل لجمع البيانات الإلكترونية"**

- الكلمات المفتاحية: "جمع البيانات"، "استبيانات إلكترونية"
- Schema: Guide Schema
- 3000+ كلمة

6. **"الفرق بين النموذج والاستبيان والاستطلاع"**

- الكلمات المفتاحية: "الفرق بين النموذج والاستبيان"
- Schema: Article Schema
- 1500+ كلمة

7. **"كيفية تحليل نتائج الاستبيانات بذكاء اصطناعي"**

- الكلمات المفتاحية: "تحليل الاستبيانات"، "ذكاء اصطناعي للاستبيانات"
- Schema: Article Schema
- 2000+ كلمة

8. **"أفضل منصات الاستبيانات في 2025"**

- الكلمات المفتاحية: "أفضل منصة استبيانات"، "منصات الاستبيانات"
- Schema: Article Schema
- 2500+ كلمة

9. **"كيفية إنشاء استبيان تسويقي فعال"**

- الكلمات المفتاحية: "استبيان تسويقي"، "استطلاعات تسويقية"
- Schema: Article Schema
- 1800+ كلمة

10. **"دليل استخدام Vibeform Pro للمبتدئين"**

- الكلمات المفتاحية: "كيفية استخدام Vibeform"، "شرح Vibeform"
- Schema: HowTo Schema
- 2000+ كلمة

### 3.3 تحسين مقالات المدونة

**لكل مقال:**

- Title tag محسّن (50-60 حرف)
- Meta description جذاب (150-160 حرف)
- H1 واحد فقط مع الكلمة المفتاحية
- H2-H6 هرمي ومنظم
- Internal links (3-5 روابط لكل مقال)
- External links إلى مصادر موثوقة
- Images مع Alt text محسّن
- Schema markup مناسب
- Reading time
- Author bio
- Related posts

---

## المرحلة الرابعة: تحسينات GEO / Local SEO

### 4.1 إضافة LocalBusiness Schema

**الملف المستهدف:** `src/components/seo/structured-data.tsx`

**المتطلبات:**

- إضافة LocalBusiness Schema component
- معلومات الموقع الجغرافي (إذا كان متاحاً)
- ساعات العمل
- معلومات الاتصال

### 4.2 إنشاء صفحات محلية (إذا كان هناك نشاط محلي)

**مسار الملف:** `src/app/[locale]/locations/[city]/page.tsx`

**المحتوى:**

- صفحات منفصلة لكل مدينة مستهدفة
- محتوى فريد لكل صفحة
- كلمات مفتاحية محلية
- Schema: LocalBusiness Schema

### 4.3 تحسين الكلمات المفتاحية المحلية

**في المحتوى:**

- دمج كلمات مفتاحية محلية بشكل طبيعي
- أمثلة: "صانع نماذج في مسقط"، "منصة استبيانات في الخليج"
- استخدام Geo-targeting في Meta tags

---

## المرحلة الخامسة: تحسينات On-Page SEO

### 5.1 تحسين الصفحة الرئيسية

**الملف المستهدف:** `src/app/[locale]/page.tsx`

**التحسينات:**

1. إضافة H1 محسّن مع الكلمة المفتاحية
2. إضافة قسم "لماذا Vibeform Pro؟" مع محتوى SEO
3. إضافة قسم Testimonials مع Schema
4. إضافة قسم Features مع internal links
5. إضافة CTA واضح
6. تحسين محتوى Hero section

### 5.2 تحسين صفحات النماذج العامة

**الملف المستهدف:** `src/app/[locale]/f/[slug]/layout.tsx`

**التحسينات:**

1. تحسين Title tag ليشمل اسم النموذج
2. إضافة Meta description ديناميكي
3. إضافة Schema: WebPage Schema محسّن
4. إضافة Breadcrumb Schema
5. إضافة Open Graph tags محسّنة

### 5.3 تحسين Internal Linking

**الاستراتيجية:**

1. إنشاء نظام Internal linking قوي
2. ربط الصفحات ذات الصلة
3. استخدام Anchor text وصفية
4. إضافة Related posts section
5. إضافة Breadcrumb navigation

---

## المرحلة السادسة: تحسينات الأداء والسرعة

### 6.1 تحسين تحميل الصور

**التحسينات:**

1. استخدام Next.js Image component في كل مكان
2. تحويل الصور إلى WebP format
3. Lazy loading للصور غير الحرجة
4. إضافة srcset للصور Responsive

### 6.2 تحسين JavaScript

**التحسينات:**

1. Code splitting للصفحات
2. Dynamic imports للمكونات الثقيلة
3. تحسين تحميل Three.js (Hero section)
4. Defer non-critical scripts

### 6.3 تحسين CSS

**التحسينات:**

1. Critical CSS inline
2. Defer non-critical CSS
3. تحسين Tailwind CSS bundle size
4. استخدام CSS modules حيث يناسب

---

## المرحلة السابعة: بناء الروابط (Link Building)

### 7.1 استراتيجية بناء الروابط

**المصادر المستهدفة:**

1. **Guest Posts:**

- مواقع تقنية عربية
- مواقع SaaS reviews
- مدونات الأعمال

2. **Directory Listings:**

- Product Hunt
- AlternativeTo
- G2, Capterra
- Directories محلية

3. **Community Engagement:**

- Reddit (r/SaaS, r/webdev)
- HackerNews
- Product Hunt discussions
- Forums محلية

4. **Content Marketing:**

- دراسات حالة
- Infographics
- Tools مجانية
- Resources pages

### 7.2 إنشاء محتوى قابل للمشاركة

**أنواع المحتوى:**

1. **Comparison Pages:**

- Vibeform vs Google Forms
- Vibeform vs Typeform
- Vibeform vs SurveyMonkey

2. **Tools & Resources:**

- Survey templates library
- Form design guide
- Analytics calculator

3. **Case Studies:**

- كيف استخدمت شركة X Vibeform
- نتائج قابلة للقياس

---

## المرحلة الثامنة: المراقبة والتحليلات

### 8.1 إعداد Google Search Console

**المهام:**

1. إضافة الموقع إلى GSC
2. إرسال Sitemap
3. مراقبة الأخطاء
4. تتبع الكلمات المفتاحية
5. مراقبة Core Web Vitals

### 8.2 إعداد Google Analytics 4

**المهام:**

1. إضافة GA4 tracking
2. إعداد Goals و Conversions
3. تتبع Events مهمة
4. مراقبة User behavior
5. تحليل Traffic sources

### 8.3 KPIs للمراقبة

**المؤشرات الرئيسية:**

1. Organic traffic growth
2. Keyword rankings
3. Click-through rate (CTR)
4. Bounce rate
5. Conversion rate
6. Backlinks count
7. Domain Authority
8. Core Web Vitals scores

---

## جدول التنفيذ المقترح

- تحسين Metadata و Structured Data
- تحسين Sitemap و Robots.txt
- تحسين Core Web Vitals

- صفحة Features
- صفحة FAQ
- صفحة Templates
- صفحة Comparison

- إعداد نظام المدونة
- كتابة أول 10 مقالات
- تحسين المحتوى الحالي

- تحسين الصفحة الرئيسية
- تحسين صفحات النماذج
- إضافة Local SEO elements
- تحسين Internal linking

- بدء Link building campaign
- تحسين المحتوى بناءً على النتائج
- إضافة مقالات جديدة
- مراقبة وتحليل الأداء

---

## الملفات المطلوب إنشاؤها/تعديلها

### ملفات جديدة:

1. `src/app/[locale]/features/page.tsx`
2. `src/app/[locale]/faq/page.tsx`
3. `src/app/[locale]/templates/page.tsx`
4. `src/app/[locale]/vs-google-forms/page.tsx`
5. `src/app/[locale]/blog/page.tsx`
6. `src/app/[locale]/blog/[slug]/page.tsx`
7. `src/lib/seo/keywords.ts` (Keyword mapping)
8. `src/lib/seo/schema-helpers.ts` (Schema utilities)

### ملفات للتعديل:

1. `src/lib/seo/metadata.ts` - تحسينات شاملة
2. `src/components/seo/structured-data.tsx` - إضافة Schemas جديدة
3. `src/app/sitemap.ts` - تحسينات Sitemap
4. `public/robots.txt` - تحسينات Robots
5. `src/app/[locale]/page.tsx` - تحسينات SEO
6. `src/app/[locale]/f/[slug]/layout.tsx` - تحسينات Metadata
7. `next.config.ts` - تحسينات Performance

---

## النتائج المتوقعة

### بعد 3 أشهر:

- 50+ كلمة مفتاحية في أول 100 نتيجة
- 10+ كلمة مفتاحية في أول 10 نتائج
- زيادة Organic traffic بنسبة 100%

### بعد 6 أشهر:

- 100+ كلمة مفتاحية في أول 100 نتيجة
- 30+ كلمة مفتاحية في أول 10 نتائج
- زيادة Organic traffic بنسبة 300%
- Domain Authority +10 points

### بعد 12 شهر:

- 200+ كلمة مفتاحية في أول 100 نتيجة
- 50+ كلمة مفتاحية في أول 10 نتائج
- ز

صورة عامه سكرين شوت للموقع الصفحه الرئيسية
/Users/faisal/dev/vibe-form-v2/public/image.png