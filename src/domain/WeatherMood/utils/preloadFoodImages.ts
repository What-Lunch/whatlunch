const preloaded = new Set<string>();

export function preloadFoodImages(imageSources: string[]): void {
  imageSources.forEach(src => {
    if (preloaded.has(src)) return;
    preloaded.add(src);
    const img = new Image();
    img.src = src;
  });
}
