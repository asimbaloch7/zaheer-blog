import SEO from '../components/seo/SEO'
import TagBadge from '../components/posts/TagBadge'
import { author } from '../config/author'
import { site } from '../config/site'

const socialLabels = {
  orcid: 'ORCID',
  googleScholar: 'Google Scholar',
  researchGate: 'ResearchGate',
  linkedin: 'LinkedIn',
  twitter: 'X / Twitter',
}

export default function About() {
  const links = Object.entries(author.social).filter(([, url]) => url)

  return (
    <div className="page-wrap py-12 md:py-20">
      <SEO
        title="About"
        description={`About ${author.name}, ${author.role}.`}
        path="/about"
      />

      <div className="grid items-start gap-10 md:grid-cols-[minmax(0,17rem)_1fr] md:gap-16">
        <aside className="md:sticky md:top-28">
          <img
            src={author.photo}
            alt={author.name}
            className="w-full max-w-xs rounded-2xl border border-paper-dark bg-pine-50 object-cover shadow-sm"
          />
          <p className="mt-4 text-sm text-ink-muted">
            {author.affiliation}
            {author.location ? ` · ${author.location}` : ''}
          </p>
        </aside>

        <div className="max-w-[68ch]">
          <p className="text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-pine-700">{site.shortTitle}</p>
          <h1 className="mt-3 font-serif text-4xl font-semibold tracking-[-0.025em] text-ink sm:text-5xl">
            {author.name}
            {author.credentials ? `, ${author.credentials}` : ''}
          </h1>
          <p className="mt-3 text-lg text-ink-muted">{author.role}</p>

          <div className="mt-9 space-y-5 font-serif text-[1.0625rem] leading-8 text-ink">
            {author.bio.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>

          <h2 className="mt-12 font-sans text-xl font-bold tracking-[-0.015em] text-ink">Research interests</h2>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {author.researchInterests.map((tag) => (
              <TagBadge key={tag} tag={tag} to={`/?tag=${encodeURIComponent(tag)}`} />
            ))}
          </div>

          <h2 className="mt-12 font-sans text-xl font-bold tracking-[-0.015em] text-ink">Contact</h2>
          <ul className="mt-3 space-y-2 text-sm">
            <li>
              <a className="text-pine-800 hover:underline" href={`mailto:${author.email}`}>
                {author.email}
              </a>
            </li>
            {links.map(([key, url]) => (
              <li key={key}>
                <a
                  className="text-pine-800 hover:underline"
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {socialLabels[key] || key}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}
