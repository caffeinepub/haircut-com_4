export function setPageTitle(title: string) {
  document.title = title;
}

export function setMetaDescription(description: string) {
  let meta = document.querySelector<HTMLMetaElement>('meta[name="description"]');
  if (!meta) {
    meta = document.createElement('meta');
    meta.name = 'description';
    document.head.appendChild(meta);
  }
  meta.content = description;
}

export function setOpenGraphTags(title: string, description: string, imageUrl?: string) {
  const setOgTag = (property: string, content: string) => {
    let meta = document.querySelector<HTMLMetaElement>(`meta[property="${property}"]`);
    if (!meta) {
      meta = document.createElement('meta');
      meta.setAttribute('property', property);
      document.head.appendChild(meta);
    }
    meta.content = content;
  };
  setOgTag('og:title', title);
  setOgTag('og:description', description);
  if (imageUrl) setOgTag('og:image', imageUrl);
}

export function injectJsonLd(schema: object) {
  const existing = document.querySelector('script[data-jsonld]');
  if (existing) existing.remove();
  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.setAttribute('data-jsonld', 'true');
  script.textContent = JSON.stringify(schema);
  document.head.appendChild(script);
}

export function usePageSEO({
  title,
  description,
  ogImage,
  jsonLdSchema,
}: {
  title: string;
  description: string;
  ogImage?: string;
  jsonLdSchema?: object;
}) {
  // Called as a regular function inside useEffect in components
  setPageTitle(title);
  setMetaDescription(description);
  setOpenGraphTags(title, description, ogImage);
  if (jsonLdSchema) injectJsonLd(jsonLdSchema);
}
