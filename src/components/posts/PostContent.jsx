export default function PostContent({ html }) {
  return (
    <div
      className="post-content"
      dangerouslySetInnerHTML={{ __html: html || '' }}
    />
  )
}
