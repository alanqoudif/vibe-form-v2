// Server Component - SEO content doesn't need interactivity
export function SEOContent({ locale }: { locale: string }) {
  const isRTL = locale === 'ar';
  
  return (
    <section className="py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-transparent to-muted/20">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold mb-4 text-center">
          {isRTL
            ? 'صانع نماذج احترافي | Vibeform Pro - استبيانات مجانية'
            : 'Professional Form Builder | Vibeform Pro - Free Surveys'}
        </h1>
        <p className="text-lg text-muted-foreground mb-6 text-center">
          {isRTL
            ? 'أنشئ نماذج واستبيانات احترافية بالذكاء الاصطناعي في ثوانٍ. بديل Google Forms مع ميزات متقدمة، مجتمع مجيبين، وتحليلات ذكية. ابدأ مجاناً الآن!'
            : 'Create professional forms and surveys with AI in seconds. Google Forms alternative with advanced features, respondent community, and smart analytics. Start free now!'}
        </p>
        
        {/* SEO Content - Rich keywords and internal links */}
        <div className="mt-8 space-y-4 text-muted-foreground">
          <p>
            {isRTL ? (
              <>
                <strong className="text-foreground">Vibeform Pro</strong> هو أفضل{' '}
                <strong className="text-foreground">بديل Google Forms</strong> مع{' '}
                <strong className="text-foreground">صانع نماذج</strong> مدعوم بالذكاء الاصطناعي.{' '}
                أنشئ <strong className="text-foreground">استبيانات احترافية</strong> في دقائق مع{' '}
                <strong className="text-foreground">منصة استبيانات</strong> متقدمة توفر{' '}
                <strong className="text-foreground">أداة جمع البيانات</strong> الاحترافية.
              </>
            ) : (
              <>
                <strong className="text-foreground">Vibeform Pro</strong> is the best{' '}
                <strong className="text-foreground">Google Forms alternative</strong> with an{' '}
                <strong className="text-foreground">AI-powered form builder</strong>. Create{' '}
                <strong className="text-foreground">professional surveys</strong> in minutes with an{' '}
                <strong className="text-foreground">advanced survey platform</strong> that provides{' '}
                <strong className="text-foreground">professional data collection tools</strong>.
              </>
            )}
          </p>
          <div className="flex flex-wrap gap-4 justify-center mt-6">
            <a 
              href={isRTL ? '/ar/features' : '/features'}
              className="text-primary hover:underline"
            >
              {isRTL ? 'الميزات' : 'Features'}
            </a>
            <a 
              href={isRTL ? '/ar/pricing' : '/pricing'}
              className="text-primary hover:underline"
            >
              {isRTL ? 'الأسعار' : 'Pricing'}
            </a>
            <a 
              href={isRTL ? '/ar/vs-google-forms' : '/vs-google-forms'}
              className="text-primary hover:underline"
            >
              {isRTL ? 'مقارنة مع Google Forms' : 'vs Google Forms'}
            </a>
            <a 
              href={isRTL ? '/ar/blog' : '/blog'}
              className="text-primary hover:underline"
            >
              {isRTL ? 'المدونة' : 'Blog'}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

