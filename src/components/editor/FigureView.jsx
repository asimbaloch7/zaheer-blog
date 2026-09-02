import { NodeViewWrapper } from '@tiptap/react'

export default function FigureView({ node, updateAttributes, selected }) {
  const { src, alt, caption } = node.attrs

  return (
    <NodeViewWrapper className={`my-4 ${selected ? 'ring-2 ring-pine-700/40 rounded' : ''}`}>
      <figure className="post-figure m-0" data-drag-handle>
        <img src={src} alt={alt} className="mx-auto max-h-[28rem] w-auto max-w-full rounded" />
        <input
          type="text"
          value={caption}
          placeholder="Caption (microscopy, gel, chart…)"
          className="mt-2 w-full border-0 bg-transparent text-center font-sans text-sm italic text-ink-muted outline-none placeholder:not-italic placeholder:text-ink-faint"
          onMouseDown={(event) => event.stopPropagation()}
          onChange={(event) => updateAttributes({ caption: event.target.value })}
        />
      </figure>
    </NodeViewWrapper>
  )
}
