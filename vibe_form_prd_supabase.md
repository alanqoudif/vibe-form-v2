# Vibe Form — Product Requirements Document (PRD)

## 1) ملخص المنتج
**Vibe Form** منصة لإنشاء الاستبيانات والنماذج بطريقة ذكية وسريعة عبر “Prompt → Form”، مع تحليلات مرنة (Dashboards) وسوق داخلي لجلب مشاركين (Marketplace) بنظام نقاط/Credits، بالإضافة إلى AI Insights لتلخيص الإجابات واستخراج الأنماط.

الفكرة الأساسية: بدل “فورم أفضل من Google Forms” فقط، تكون **منصة نتائج**: إنشاء أسرع + جودة ردود أعلى + وصول أسهل لمجيبين + تحليلات قابلة للتخصيص.

---

## 2) المشكلة والفرصة
### المشاكل الحالية
- إنشاء الفورم سهل، لكن **الحصول على ردود كافية وجودتها** أصعب.
- التحليلات في أدوات كثيرة تكون محدودة أو غير مرنة.
- الباحث/الطالب يحتاج وقت طويل لتجميع الردود وتلخيص النصوص المفتوحة.

### الفرصة
منتج يجمع بين:
1) **AI Form Builder (Prompt-based)**
2) **Marketplace للمجيبين**
3) **AI Insights**
4) **Dashboards مرنة**

---

## 3) الأهداف (Goals)
### أهداف نسخة MVP
- تحويل Prompt إلى Form قابل للنشر خلال أقل من 60 ثانية.
- نظام مشاركة عام/خاص + رابط مشاركة.
- تتبع Analytics أساسي (views/starts/submits).
- Dashboard بسيطة + Charts أساسية.
- AI Summary للإجابات المفتوحة.
- نظام Credits بسيط: “جاوب → اكسب → روّج فورمك”.

### أهداف لاحقة (V1+)
- Marketplace متقدم: فلترة مشاركين + جودة + مكافآت.
- قوالب بحثية جاهزة (Likert/Consent/Demographics).
- Question bank + Form score.
- فريق/مؤسسة + صلاحيات.
- Boost to Target (ترويج بهدف ردود) + تعريف Qualified response.
- Matching Engine (For You) عالمي.
- Global-first readiness (i18n + RTL + خصوصية/حذف/تصدير بيانات).

---

## 4) الشريحة المستهدفة (Target Users)
1) **طلاب/باحثين**: مشاريع تخرج، دراسات، تقييمات.
2) **شركات صغيرة/متوسطة**: رضا العملاء (NPS/CSAT)، أبحاث سوق.
3) **منظمات/فعاليات**: تسجيل، تقييم فعاليات.

---

## 5) Use Cases
- طالب يكتب: “سوي استبيان عن إدمان السوشال ميديا وتأثيره على التواصل الواقعي، 18 سؤال، Likert 1-5، مع أسئلة ديموغرافيا” → يولد الفورم → يعدل الأسئلة/الترتيب → ينشر → يطلب 100 رد عبر Marketplace.
- شركة تعمل NPS + Dashboard تقارير أسبوعية.

---

## 6) تجربة المستخدم (User Journey)
### 6.1 إنشاء فورم عبر الـ Prompt
1) يدخل المستخدم صفحة **Vibe Prompt**.
2) يكتب وصف الفورم.
3) النظام يولد **Draft Form**.
4) ينتقل تلقائياً إلى **Form Builder** مع الأسئلة جاهزة.
5) المستخدم يعدل: نص السؤال، نوعه، الخيارات، المنطق (Logic)، الواجهة.
6) Preview.
7) Publish.

### 6.2 الحصول على ردود
- نشر عام داخل المنصة (Feed) أو رابط خاص.
- المستخدم يختار هدف ردود (مثلاً 100).
- إذا يريد ردود أسرع: يصرف Credits للترويج أو لطلب مشاركين.

### 6.3 النتائج
- Dashboard: Views/Starts/Submits + Completion Rate.
- Charts للأسئلة المغلقة.
- AI Insights للنصوص المفتوحة.

---

## 7) المتطلبات الوظيفية (Functional Requirements)

### 7.1 الحسابات والمستخدمين
- تسجيل دخول (Email/OTP أو OAuth) عبر Supabase Auth.
- ملف مستخدم: الاسم، الاهتمامات، اللغة، مستوى المشاركة.

### 7.2 إنشاء الفورم (Form Builder)
- أنواع أسئلة MVP:
  - Short text
  - Long text
  - Multiple choice
  - Checkbox
  - Likert scale (1-5 / 1-7)
  - Rating (stars)
  - Dropdown
- خصائص:
  - Required
  - Placeholder/description
  - ترتيب بالسحب والإفلات
  - صفحات/Sections (اختياري في MVP)

### 7.3 إنشاء عبر AI (Prompt → Form)
- Prompt box
- زر Generate
- Output: عنوان + وصف + قائمة أسئلة + أنواعها + خياراتها
- حفظ كـ Draft
- إعادة توليد جزئي: “Regenerate this question”

### 7.4 نشر ومشاركة
- حالة الفورم: Draft / Published / Archived
- Visibility:
  - Public (يظهر بالـ Feed)
  - Unlisted (رابط فقط)
  - Private (فريق فقط — لاحقاً)
- رابط مشاركة + QR

### 7.5 تجربة المجيب (Respondent)
- فتح الفورم من الرابط أو من Feed.
- Progress indicator.
- Submit.
- Optional: صفحة شكر + CTA “جاوب فورمات ثانية واكسب Credits”.

### 7.6 Analytics (القياس)
أحداث (Events):
- impression (ظهر في Feed)
- view (فتح صفحة)
- start (أول تفاعل)
- submit (تم الإرسال)
مقاييس:
- Unique views (تقريبي)
- Completion rate
- Avg time to complete
- Drop-off per question (V1)

### 7.7 Dashboard & Charts
- Overview cards: views/starts/submits/completion rate
- Charts:
  - Bar/Pie للأسئلة الاختيارية
  - Distribution لليكرت
- Filters: date range

### 7.8 AI Insights
- تلخيص للإجابات النصية المفتوحة:
  - Top themes
  - Sentiment (اختياري)
  - Key quotes
  - Recommendations
- مخرجات: نص + نقاط + (اختياري) جراف

### 7.9 Marketplace + Credits
- نظام Credits:
  - Earn: عند إكمال فورم (مع شروط جودة)
  - Spend: Promote form / Request respondents
- Feed Views:
  - Needs responses
  - Trending
  - New
  - For you (matching interests)
- Quality checks MVP:
  - time threshold
  - completion required
  - basic anti-duplicate (device/session)

### 7.10 اقتصاد الكريدت (Credit Economy)
> الهدف: تحفيز “جاوب → اكسب → روّج” بدون تلاعب أو سبام.

**قواعد الكسب (Earn)**
- يكسب المستخدم Credits عند **إرسال Response** مكتمل فقط.
- لا يتم منح Credits إلا بعد اجتياز شروط جودة (Quality Gate):
  - مدة الإكمال ≥ حد أدنى (حسب عدد الأسئلة)
  - لا يوجد تكرار واضح (device/session + rate limit)
  - (اختياري) اجتياز سؤال فخ/تحقق (Attention check)
- قيمة الكسب = Base Credits × Quality Multiplier
  - Base (مثال MVP): 10 credits لكل فورم مكتمل
  - Quality Multiplier (0.5 → 2.0) بحسب:
    - اكتمال كامل + وقت منطقي
    - تناسق الإجابات
    - تقييم صاحب الفورم (لاحقًا)
- مكافأة توازن السوق (Market Balance Bonus):
  - فورمز “Needs responses” أو التي عندها نقص كبير في الردود تعطي Bonus بسيط.
- حدود يومية/أسبوعية للكسب لتقليل farming.

**قواعد الصرف (Spend)**
- Boost/Turbo: رفع ظهور الفورم لمدة محددة داخل الـ Feed.
- Request respondents (لاحقًا): طلب عدد ردود محدد مع فلترة.
- AI add-ons: Insights أعمق / تصديرات متقدمة (اختياري).

**السمعة (Reputation)**
- كل مجيب لديه Respondent Score يؤثر على:
  - كمية Credits التي يكسبها
  - أولوية وصوله للمهام المدفوعة/الطلبات (لاحقًا)
- المستخدم ذو السمعة المنخفضة: Credits أقل + قد يُحجب من بعض الفورمز.

### 7.11 Boost / Turbo (الترويج داخل المنصة)
**الفكرة:** مثل “Turbo” في الأسواق المفتوحة: تدفع Credits فتزيد فرص ظهور فورمك لمجيبين مناسبين.

**أنواع الترويج (Placements)**
- Boost في تبويب Needs Responses
- Boost في For You (حسب الاهتمامات)
- Pin قصير في أعلى القائمة (محدود بعدد معين يوميًا)

**نموذج التسعير (MVP)**
- Fixed price per duration (سهل التنفيذ):
  - 1 يوم = X credits
  - 2 أيام = Y credits
  - 7 أيام = Z credits
- مع تقدير تقريبي داخل UI: “متوقع +N views / +M responses” (بناءً على معدل التحويل الحالي).

**التحصيل (Billing)**
- MVP: الدفع مقدمًا بالمدة.
- لاحقًا: Cost-per-qualified-response (CPQR) أو مزاد بسيط (Auction) بحسب الطلب.


### 7.12 Answer & Earn (صفحة: جاوب واكسب)
**الهدف:** خلق Loop عالمي واضح: *Answer → Earn → Boost → Get responses*.

**المتطلبات**
- تبويب/صفحة تعرض فورمز “تحتاج ردود” مع:
  - Reward (Credits)
  - Estimated time
  - Language / Category
  - Target progress (مثلاً: 32/100)
- Filters:
  - Category
  - Language
  - Reward range
  - Estimated time
- بعد الإرسال:
  - شاشة “You earned +X credits” + سبب المكافأة (Base + Quality bonus)
  - اقتراح فورمات مشابهة أو أعلى Reward

**قواعد تجربة المستخدم**
- لا يظهر Reward الكامل إلا بعد إكمال الفورم (ضد farming).
- فورمز ذات “نقص كبير بالردود” تحصل Market Balance Bonus بسيط.

### 7.13 Boost to Responses (ترويج بهدف ردود، مو بس ظهور)
**الفكرة الثورية:** المستخدم ما يدفع عشان Views—يدفع عشان **Qualified Responses**.

**وضعين للترويج**
1) **Boost by Duration (MVP):** 1 يوم / 2 أيام / 7 أيام
2) **Boost to Target (V1+):**
   - يحدد صاحب الفورم هدف ردود (مثلاً 100)
   - يحدد Max credits (مثلاً 300)
   - النظام يصرف تدريجيًا ويوقف تلقائيًا عند الوصول للهدف

**Qualified Response (تعريف)**
- Response مكتمل + اجتاز Quality Gate (وقت منطقي، بدون تكرار، (اختياري) attention check).

**تجربة UI**
- في صفحة Boost تظهر:
  - اختيار placement
  - تقدير “Expected responses” بناءً على conversion الحالي
  - خيار “Stop when target reached” (في وضع Target)

### 7.14 Matching Engine (For You) — توصية عالمية
**الهدف:** تجعل المنصة عالمية تلقائيًا عبر مطابقة الفورمز مع المجيبين.

**إشارات المطابقة (Signals)**
- لغة المستخدم + لغة الفورم
- Interests (من profile)
- سلوك سابق (categories answered, completion history)
- جودة المجيب (Respondent Score)
- Freshness + “needs responses”

**قواعد العدالة**
- Cold-start boost للفورمز الجديدة (محدود)
- Rotation لمنع احتكار نفس الفورمز

### 7.15 Global-first (جاهزية عالمية من اليوم الأول)
- دعم واجهة متعددة اللغات (على الأقل: EN/AR كبداية) + دعم RTL.
- Timezone/Locale في الحساب والتقارير.
- سياسات خصوصية جاهزة عالميًا:
  - Consent template
  - خيار إخفاء الهوية افتراضيًا
  - Export/Delete data (V1+)
- Anti-abuse عالمي:
  - rate limiting
  - email verification
  - basic device/session protections

---

## 8) متطلبات غير وظيفية (Non-Functional)
- Performance: تحميل سريع (Core Web Vitals).
- Security: RLS في Supabase لكل الجداول الحساسة.
- Privacy: إخفاء هوية المجيب افتراضياً + خيار جمع معلومات.
- Reliability: logging للأخطاء + retries.

---

## 9) نموذج البيانات (Supabase Database Schema)
> ملاحظة: هذه نسخة أولية قابلة للتطوير.

### 9.1 الجداول الأساسية
**profiles**
- id (uuid, pk, = auth.users.id)
- full_name
- username
- language
- country_code (text, nullable)
- timezone (text, nullable)
- interests (text[])
- credits_balance (int)
- created_at

**forms**
- id (uuid, pk)
- owner_id (uuid, fk profiles)
- title
- description
- status (draft/published/archived)
- visibility (public/unlisted/private)
- category (text, nullable)
- primary_language (text, default 'en')
- settings (jsonb) // theme, branding, etc.
- target_responses (int)
- created_at, updated_at, published_at

**form_questions**
- id (uuid, pk)
- form_id (uuid, fk forms)
- order_index (int)
- type (short_text/long_text/mcq/checkbox/likert/rating/dropdown)
- title
- description
- required (bool)
- options (jsonb) // choices, likert labels, etc.
- logic (jsonb) // later

**responses**
- id (uuid, pk)
- form_id
- respondent_id (uuid nullable) // if logged in
- is_anonymous (bool)
- started_at
- submitted_at
- duration_sec
- quality_score (numeric)

**response_answers**
- id (uuid, pk)
- response_id
- question_id
- answer (jsonb) // string/array/number

### 9.2 القياس والأحداث
**form_events**
- id
- form_id
- event_type (impression/view/start/submit)
- session_id
- user_id (nullable)
- created_at
- metadata (jsonb) // device, referrer

**form_saves** (لدعم ranking)
- id
- form_id
- user_id
- created_at

**form_shares** (لدعم ranking)
- id
- form_id
- user_id (nullable)
- channel (text) // copy_link / whatsapp / x / email ...
- created_at

### 9.3 Credits & Marketplace
**credits_ledger**
- id
- user_id
- amount (int) // + earn / - spend
- reason (complete_form/promote_form/request_respondents)
- related_form_id (nullable)
- related_response_id (nullable)
- created_at

**promotions**
- id
- form_id
- owner_id
- budget_credits
- start_at
- end_at
- status

**boost_products** (MVP)
- id
- code (boost_1d / boost_2d / boost_7d)
- duration_hours
- price_credits
- placement (needs_responses / for_you / pin)
- is_active

**boost_purchases** (MVP)
- id
- form_id
- buyer_id
- boost_product_id
- start_at
- end_at
- status

**respondent_reputation** (مهم للجودة)
- user_id (pk)
- score (numeric)
- completes_count
- fraud_flags_count
- updated_at

**fraud_flags** (اختياري في MVP)
- id
- user_id (nullable)
- form_id (nullable)
- response_id (nullable)
- reason
- metadata (jsonb)
- created_at

(لاحقاً) **marketplace_orders**
- id
- form_id
- buyer_id
- target_count
- filters (jsonb)
- cost_credits
- status

---

## 10) منطق الترتيب (Ranking / Feed)
الهدف: منع التلاعب + إعطاء فرصة للجديد.

### 10.1 Trending score (مقترح)
score = (submit_count * 3) + (start_count * 1) + (save_count * 2) + (share_count * 2) + freshness_bonus - fraud_penalty
- freshness_bonus يقل مع الوقت (decay)
- fraud_penalty إذا جودة الردود منخفضة أو تكرارات

### 10.2 Credits
- لا تُحتسب إلا إذا:
  - submitted
  - duration >= threshold
  - لا يوجد duplicate واضح

### 10.3 تأثير Boost/Turbo على الترتيب
- عند وجود Boost نشط لفورم:
  - يتم إضافة **Promo Weight** إلى ترتيب الفورم داخل placement المناسب.
  - Promo Weight لا يلغي الجودة: إذا الـ fraud_penalty عالي، يقل تأثير الترويج.
- سياسة العدالة:
  - حد أقصى لعدد الفورمز المروّجة في أعلى القائمة.
  - توزيع (rotation) بين أكثر من فورم مروّج لتجنب احتكار.

---

## 11) MVP Scope (النطاق)
### داخل MVP
- Auth + Profile
- Prompt → Draft Form
- Builder (أنواع أسئلة أساسية)
- Publish + Link
- Respondent flow
- Basic analytics events
- Dashboard بسيطة
- AI summary للنص المفتوح
- Credits earn/spend + Promote بسيط

### خارج MVP (Later)
- Logic branching متقدم
- Team workspace
- Payments (شراء ردود بالفلوس)
- Advanced respondent filters
- Integrations (Zapier/n8n/webhooks)

---

## 12) المتطلبات التقنية (Tech Requirements)
- Frontend: Next.js + Tailwind
- Backend: Supabase (Postgres + RLS + Edge Functions)
- AI: API (OpenAI/غيره) عبر Supabase Edge Functions
- Storage: Supabase Storage للملفات (لو أضفت upload)
- Observability: logging + error tracking

---

## 13) السياسات والخصوصية
- Default: المجيب مجهول.
- خيار داخل الفورم: “جمع البريد/الاسم” (اختياري).
- توافق مع سياسات الجامعات (Consent template).

---

## 14) KPIs (مؤشرات النجاح)
- Time-to-first-form (من تسجيل الدخول إلى نشر أول فورم)
- Completion rate
- Avg responses per form
- % of users earning credits weekly
- Marketplace conversion (later)
- Retention أسبوعي/شهري

---

## 15) اقتراحات Features إضافية (تحسينات قوية)
1) **Form Score**: يتوقع drop-off ويقترح تقليل/تعديل الأسئلة.
2) **Question Bank**: أسئلة جاهزة حسب المجال.
3) **Export Packs**: CSV/SPSS-friendly.
4) **AI “Fix my form”**: يراجع الفورم ويقترح تحسينات UX.
5) **Anti-fraud advanced**: device fingerprint + trap questions.
6) **Multi-language forms**: عربي/إنجليزي بنفس الفورم.
7) **Templates**: NPS/CSAT/Research/Registration.
8) **Proof of Contribution**: Respondent Score + مكافآت مرتبطة بالجودة (تخلي الشبكة موثوقة).
9) **Boost to Responses**: ترويج بهدف “Qualified responses” وليس مجرد Views.
10) **Matching Engine عالمي**: توصيات For You على مستوى عالمي (لغة/اهتمامات/سلوك).
11) **Research Pack**: Consent + Demographics + Methodology snippet جاهز للتقارير.

---

## 16) Open Questions (قرارات لازم تُحسم)
- هل المجيب لازم يسجل دخول ليكسب Credits؟ (مقترح: نعم)
- كيف تريد تسعير Credits لاحقاً؟ (مجاني فقط / أو شراء)
- هل تريد فورمز عامة بالكامل أم فئات (categories)؟
- هل المنصة تركّز على عمان/الجامعات أولاً؟

---

## 17) Acceptance Criteria (أمثلة)
- إذا المستخدم كتب prompt → النظام ينشئ Draft Form خلال 10–30 ثانية.
- المستخدم يقدر يعدل سؤال/يحذف/يرتب.
- نشر الفورم يعطي رابط يعمل.
- Dashboard تعرض views/starts/submits.
- إكمال فورم يعطي Credits (إذا شروط الجودة تحققت).

---

## 18) Screens (مقترح صفحات)
1) Landing
2) Auth
3) Vibe Prompt (Generate)
4) Form Builder
5) Form Preview
6) Form Public Page (Respond)
7) Dashboard (Results + AI Insights)
8) Feed (Needs Responses/Trending/New)
9) Credits + Wallet

