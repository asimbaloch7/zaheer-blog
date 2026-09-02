export default function References({ references }) {
  if (!references?.length) return null

  const items = references.filter((item) => item.text?.trim())
  if (!items.length) return null

  return (
    <section className="mt-14 border-t border-paper-dark pt-8">
      <h2 className="font-serif text-2xl text-ink">References</h2>
      <ol className="mt-4 list-decimal space-y-3 pl-5 text-sm leading-relaxed text-ink-muted">
        {items.map((item, index) => (
          <li key={`${item.url}-${index}`}>
            {item.url ? (
              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-pine-800 underline decoration-pine-200 underline-offset-2 hover:decoration-pine-800"
              >
                {item.text}
              </a>
            ) : (
              item.text
            )}
          </li>
        ))}
      </ol>
    </section>
  )
}
