---
name: استبدال AI Model إلى GPT-5-Nano
overview: استبدال نموذج AI الحالي (gpt-4o-mini) بنموذج gpt-5-nano-2025-08-07 في جميع نقاط الاستخدام في المنصة، مع إنشاء ملف config مركزي لإدارة النموذج وتحديث الوثائق.
todos:
  - id: create-ai-config
    content: إنشاء ملف config مركزي `src/lib/config/ai-config.ts` يحتوي على AI_MODEL والإعدادات
    status: completed
  - id: update-generate-form
    content: تحديث `src/app/api/ai/generate-form/route.ts` لاستخدام AI_MODEL من config
    status: completed
    dependencies:
      - create-ai-config
  - id: update-insights
    content: تحديث `src/app/api/ai/insights/route.ts` لاستخدام AI_MODEL من config
    status: completed
    dependencies:
      - create-ai-config
  - id: update-readme
    content: تحديث README.md لتغيير الإشارات من GPT-4 إلى GPT-5-Nano
    status: completed
  - id: test-integration
    content: "اختبار التكامل: توليد نموذج جديد وتوليد insights للتأكد من عمل النموذج الجديد"
    status: completed
    dependencies:
      - update-generate-form
      - update-insights
---

# خطة استبدال AI Model إلى GPT-5-Nano

## نظرة عامة

استبدال نموذج `gpt-4o-mini` بنموذج `gpt-5-nano-2025-08-07` في جميع نقاط الاستخدام في المنصة. سيتم إنشاء ملف config مركزي لإدارة النموذج لتسهيل التحديثات المستقبلية.

## الملفات التي تحتاج تحديث

### 1. إنشاء ملف Config مركزي

**الملف الجديد:** `src/lib/config/ai-config.ts`

- إنشاء ملف config مركزي يحتوي على اسم النموذج والإعدادات
- تصدير ثابت `AI_MODEL` بقيمة `'gpt-5-nano-2025-08-07'`
- تصدير إعدادات النموذج الافتراضية (temperature, max_tokens, إلخ)
- يسهل التحديث المستقبلي للنموذج من مكان واحد

### 2. تحديث API Routes

**الملفات:**

- [`src/app/api/ai/generate-form/route.ts`](src/app/api/ai/generate-form/route.ts) - السطر 81
- [`src/app/api/ai/insights/route.ts`](src/app/api/ai/insights/route.ts) - السطر 84

**التغييرات:**

- استيراد `AI_MODEL` من ملف config الجديد
- استبدال `'gpt-4o-mini'` بـ `AI_MODEL` في استدعاءات `openai.chat.completions.create()`
- التأكد من أن جميع المعاملات متوافقة مع النموذج الجديد

### 3. تحديث الوثائق

**الملف:** [`README.md`](README.md)

- تحديث السطر 11: تغيير "Powered by OpenAI GPT-4" إلى "Powered by OpenAI GPT-5-Nano"
- تحديث أي إشارات أخرى للنموذج القديم

### 4. التحقق من التوافق

- التحقق من أن `openai` SDK (الإصدار 6.10.0) يدعم النموذج الجديد
- إضافة معالجة للأخطاء في حالة عدم توفر النموذج
- اختبار أن النموذج يعمل بشكل صحيح مع `response_format: { type: 'json_object' }`

## خطوات التنفيذ

1. **إنشاء ملف Config:**

- إنشاء `src/lib/config/ai-config.ts`
- تصدير `AI_MODEL` و `AI_CONFIG` constants

2. **تحديث generate-form route:**

- استيراد `AI_MODEL` من config
- استبدال النموذج في السطر 81

3. **تحديث insights route:**

- استيراد `AI_MODEL` من config
- استبدال النموذج في السطر 84

4. **تحديث README:**

- تحديث الإشارات للنموذج القديم

5. **الاختبار:**

- اختبار توليد نموذج جديد
- اختبار توليد insights
- التحقق من أن JSON responses تعمل بشكل صحيح

## ملاحظات مهمة

- النموذج الجديد قد يحتاج نفس المعاملات (`temperature`, `response_format`, إلخ)
- قد تختلف التكلفة والأداء - يجب مراقبة الاستخدام بعد التحديث
- إذا كان النموذج غير متاح، سيتم إرجاع خطأ من OpenAI API