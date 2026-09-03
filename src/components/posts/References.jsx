export default function References({ references }) {
  if (!references?.length) return null

  const items = references.filter((item) => item.text?.trim())
  if (!items.length) return null

  return (
    <section className="mt-14 border-t border-paper-dark pt-10">
      <h2 className="font-sans text-xl font-bold tracking-[-0.015em] text-ink">References</h2>
      <ol className="mt-5 list-decimal space-y-4 pl-5 text-sm leading-6 text-ink-muted marker:font-semibold marker:text-pine-700">
        {items.map((item, index) => (
          <li key={`${item.url}-${index}`}>
            {item.url ? (
              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-sm font-medium text-pine-800 underline decoration-pine-200 underline-offset-[3px] transition-colors hover:decoration-pine-800 focus-ring"
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
