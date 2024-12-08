export function getTextColorClass(isLightBackground: boolean, isActive: boolean = false): string {
  if (isLightBackground) {
    return isActive 
      ? 'text-primary border-b-2 border-primary' 
      : 'text-black/90 hover:text-primary hover:border-b-2 hover:border-primary';
  }
  return isActive 
    ? 'text-white border-b-2 border-secondary' 
    : 'text-white/90 hover:text-secondary hover:border-b-2 hover:border-secondary';
}

export function getBackgroundClass(isLightBackground: boolean, isScrolled: boolean = false): string {
  if (isScrolled) {
    return isLightBackground 
      ? 'bg-white/95 backdrop-blur-sm shadow-sm' 
      : 'bg-primary/10 backdrop-blur-sm shadow-sm';
  }
  return isLightBackground 
    ? 'bg-transparent' 
    : 'bg-primary/5 backdrop-blur-sm';
}
