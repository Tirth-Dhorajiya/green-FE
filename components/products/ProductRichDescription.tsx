type ProductRichDescriptionProps = {
  content?: string | null;
};

export default function ProductRichDescription({ content }: ProductRichDescriptionProps) {
  const description = String(content || '').trim();
  if (!description) return null;

  const hasFormattedContent = /<\/?[a-z][\s\S]*>/i.test(description);

  return (
    <section className="mb-8" aria-labelledby="product-description-heading">
      <h2 id="product-description-heading" className="mb-3 text-xl font-black text-foreground">
        Description
      </h2>
      <div className="max-w-none break-words text-gray-700 dark:text-gray-300 [&_a]:font-bold [&_a]:text-primary [&_a]:underline [&_a]:underline-offset-2 [&_blockquote]:my-5 [&_blockquote]:border-l-4 [&_blockquote]:border-primary/30 [&_blockquote]:pl-4 [&_blockquote]:italic [&_code]:rounded [&_code]:bg-black/5 [&_code]:px-1.5 [&_code]:py-0.5 dark:[&_code]:bg-white/10 [&_h2]:mb-3 [&_h2]:mt-6 [&_h2]:text-2xl [&_h2]:font-black [&_h2]:text-foreground [&_h3]:mb-2 [&_h3]:mt-5 [&_h3]:text-xl [&_h3]:font-black [&_h3]:text-foreground [&_hr]:my-6 [&_hr]:border-black/10 dark:[&_hr]:border-white/10 [&_li]:my-1.5 [&_ol]:my-4 [&_ol]:list-decimal [&_ol]:pl-6 [&_p]:my-4 [&_p]:leading-7 [&_pre]:my-4 [&_pre]:max-w-full [&_pre]:overflow-x-auto [&_pre]:rounded-lg [&_pre]:bg-black/5 [&_pre]:p-4 dark:[&_pre]:bg-white/10 [&_s]:opacity-70 [&_strike]:opacity-70 [&_ul]:my-4 [&_ul]:list-disc [&_ul]:pl-6">
        {hasFormattedContent
          ? <div dangerouslySetInnerHTML={{ __html: description }} />
          : <p>{description}</p>}
      </div>
    </section>
  );
}
