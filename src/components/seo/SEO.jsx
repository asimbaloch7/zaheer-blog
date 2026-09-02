import { Helmet } from 'react-helmet-async'
import { site } from '../../config/site'

export default function SEO({
  title,
  description = site.description,
  path = '',
  image,
  type = 'website',
  noIndex = false,
}) {
  const pageTitle = title ? `${title} · ${site.title}` : site.title
  const url = site.url ? `${site.url.replace(/\/$/, '')}${path}` : undefined

  return (
    <Helmet>
      <title>{pageTitle}</title>
      <meta name="description" content={description} />
      {noIndex && <meta name="robots" content="noindex, nofollow" />}
      <meta property="og:site_name" content={site.title} />
      <meta property="og:title" content={pageTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={type} />
      {url && <meta property="og:url" content={url} />}
      {image && <meta property="og:image" content={image} />}
      <meta name="twitter:card" content={image ? 'summary_large_image' : 'summary'} />
      <meta name="twitter:title" content={pageTitle} />
      <meta name="twitter:description" content={description} />
      {image && <meta name="twitter:image" content={image} />}
    </Helmet>
  )
}
