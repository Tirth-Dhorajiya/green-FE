const decodeCommonEntities = (value: string) => value
  .replace(/&nbsp;/gi, ' ')
  .replace(/&amp;/gi, '&')
  .replace(/&lt;/gi, '<')
  .replace(/&gt;/gi, '>')
  .replace(/&quot;/gi, '"')
  .replace(/&#(?:39|x27);/gi, "'");

export const productDescriptionText = (value?: string | null) => {
  if (!value) return '';

  return decodeCommonEntities(value
    .replace(/<br\s*\/?>/gi, ' ')
    .replace(/<\/(?:p|h[1-6]|li|blockquote)>/gi, ' ')
    .replace(/<[^>]*>/g, ' '))
    .replace(/\s+/g, ' ')
    .trim();
};
