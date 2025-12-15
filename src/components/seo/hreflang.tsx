import { generateHreflangTags } from '@/lib/seo/metadata';

interface HreflangProps {
  path: string;
}

export function Hreflang({ path }: HreflangProps) {
  const tags = generateHreflangTags(path);

  return (
    <>
      {tags.map((tag) => (
        <link
          key={tag.hreflang}
          rel={tag.rel}
          hrefLang={tag.hreflang}
          href={tag.href}
        />
      ))}
    </>
  );
}

