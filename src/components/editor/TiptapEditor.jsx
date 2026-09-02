import { useCallback, useEffect, useRef } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import Subscript from '@tiptap/extension-subscript'
import Superscript from '@tiptap/extension-superscript'
import { TableKit } from '@tiptap/extension-table'
import { Figure } from './Figure'
import EditorToolbar from './EditorToolbar'

export default function TiptapEditor({ content, onChange, onUploadImage }) {
  const fileRef = useRef(null)
  const editorRef = useRef(null)
  const uploadRef = useRef(onUploadImage)

  useEffect(() => {
    uploadRef.current = onUploadImage
  }, [onUploadImage])

  const insertImageFile = useCallback(async (file) => {
    if (!file || !uploadRef.current) return
    const url = await uploadRef.current(file)
    if (!url) return
    editorRef.current?.chain().focus().setFigure({ src: url, alt: '', caption: '' }).run()
  }, [])

  const editor = useEditor({
    immediatelyRender: true,
    shouldRerenderOnTransaction: true,
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3, 4] },
        link: {
          openOnClick: false,
          autolink: true,
          HTMLAttributes: {
            rel: 'noopener noreferrer',
            target: '_blank',
          },
        },
      }),
      Placeholder.configure({
        placeholder:
          'Write the note… Italicize binomial names (Escherichia coli). Use sub/superscript for H₂O₂ or 10⁶ CFU/mL.',
      }),
      Subscript,
      Superscript,
      TableKit.configure({
        table: { resizable: true },
      }),
      Figure,
    ],
    content: content || '',
    editorProps: {
      attributes: {
        class: 'tiptap-editor min-h-[28rem] px-4 py-3 focus:outline-none',
      },
      handlePaste: (_view, event) => {
        const items = Array.from(event.clipboardData?.items || [])
        const image = items.find((item) => item.type.startsWith('image/'))
        if (!image) return false
        event.preventDefault()
        insertImageFile(image.getAsFile())
        return true
      },
      handleDrop: (_view, event) => {
        const file = event.dataTransfer?.files?.[0]
        if (!file?.type.startsWith('image/')) return false
        event.preventDefault()
        insertImageFile(file)
        return true
      },
    },
    onUpdate: ({ editor: instance }) => {
      onChange(instance.getHTML())
    },
  })

  useEffect(() => {
    editorRef.current = editor
  }, [editor])

  return (
    <div className="overflow-hidden rounded-md border border-paper-dark bg-paper-card">
      <EditorToolbar editor={editor} onInsertFigure={() => fileRef.current?.click()} />
      <EditorContent editor={editor} />
      <input
        ref={fileRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        className="hidden"
        onChange={async (event) => {
          const file = event.target.files?.[0]
          event.target.value = ''
          await insertImageFile(file)
        }}
      />
    </div>
  )
}
