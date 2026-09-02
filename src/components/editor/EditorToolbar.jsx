function IconButton({ active, disabled, onClick, label, children }) {
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      aria-pressed={Boolean(active)}
      disabled={disabled}
      onClick={onClick}
      className={`rounded p-1.5 text-sm transition disabled:opacity-40 ${
        active ? 'bg-pine-800 text-paper' : 'text-ink-muted hover:bg-paper-dark hover:text-ink'
      }`}
    >
      {children}
    </button>
  )
}

export default function EditorToolbar({ editor, onInsertFigure }) {
  if (!editor) return null

  const setLink = () => {
    const previous = editor.getAttributes('link').href || ''
    const url = window.prompt('Link URL', previous)
    if (url === null) return
    if (url === '') {
      editor.chain().focus().unsetLink().run()
      return
    }
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
  }

  return (
    <div className="flex flex-wrap items-center gap-0.5 border-b border-paper-dark bg-paper px-2 py-1.5">
      <IconButton
        label="Heading 2"
        active={editor.isActive('heading', { level: 2 })}
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
      >
        H2
      </IconButton>
      <IconButton
        label="Heading 3"
        active={editor.isActive('heading', { level: 3 })}
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
      >
        H3
      </IconButton>
      <span className="mx-1 h-5 w-px bg-paper-dark" />
      <IconButton
        label="Bold"
        active={editor.isActive('bold')}
        onClick={() => editor.chain().focus().toggleBold().run()}
      >
        <strong>B</strong>
      </IconButton>
      <IconButton
        label="Italic (species names)"
        active={editor.isActive('italic')}
        onClick={() => editor.chain().focus().toggleItalic().run()}
      >
        <em>I</em>
      </IconButton>
      <IconButton
        label="Underline"
        active={editor.isActive('underline')}
        onClick={() => editor.chain().focus().toggleUnderline().run()}
      >
        <span className="underline">U</span>
      </IconButton>
      <IconButton
        label="Subscript (H₂O₂)"
        active={editor.isActive('subscript')}
        onClick={() => editor.chain().focus().toggleSubscript().run()}
      >
        X<sub className="text-[0.65em]">2</sub>
      </IconButton>
      <IconButton
        label="Superscript (10⁶ CFU/mL)"
        active={editor.isActive('superscript')}
        onClick={() => editor.chain().focus().toggleSuperscript().run()}
      >
        X<sup className="text-[0.65em]">n</sup>
      </IconButton>
      <span className="mx-1 h-5 w-px bg-paper-dark" />
      <IconButton
        label="Blockquote"
        active={editor.isActive('blockquote')}
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
      >
        “ ”
      </IconButton>
      <IconButton
        label="Bullet list"
        active={editor.isActive('bulletList')}
        onClick={() => editor.chain().focus().toggleBulletList().run()}
      >
        •
      </IconButton>
      <IconButton
        label="Numbered list"
        active={editor.isActive('orderedList')}
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
      >
        1.
      </IconButton>
      <IconButton
        label="Insert table"
        onClick={() =>
          editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()
        }
      >
        ⊞
      </IconButton>
      {editor.isActive('table') && (
        <>
          <IconButton label="Add column" onClick={() => editor.chain().focus().addColumnAfter().run()}>
            +col
          </IconButton>
          <IconButton label="Add row" onClick={() => editor.chain().focus().addRowAfter().run()}>
            +row
          </IconButton>
          <IconButton label="Delete table" onClick={() => editor.chain().focus().deleteTable().run()}>
            ×tbl
          </IconButton>
        </>
      )}
      <span className="mx-1 h-5 w-px bg-paper-dark" />
      <IconButton label="Insert figure with caption" onClick={onInsertFigure}>
        Fig
      </IconButton>
      <IconButton label="Link" active={editor.isActive('link')} onClick={setLink}>
        Link
      </IconButton>
      <span className="mx-1 h-5 w-px bg-paper-dark" />
      <IconButton label="Undo" onClick={() => editor.chain().focus().undo().run()}>
        ↺
      </IconButton>
      <IconButton label="Redo" onClick={() => editor.chain().focus().redo().run()}>
        ↻
      </IconButton>
    </div>
  )
}
