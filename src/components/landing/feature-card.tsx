// Server Component - No interactivity needed
export function FeatureCard({ 
  icon, 
  title, 
  description 
}: { 
  icon: string; 
  title: string; 
  description: string;
}) {
  return (
    <article className="p-6 rounded-2xl bg-card border border-border hover:border-primary/30 transition-all hover:shadow-lg">
      <div className="text-4xl mb-4" role="img" aria-label={title}>{icon}</div>
      <h3 className="text-xl font-semibold text-foreground mb-2">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </article>
  );
}

