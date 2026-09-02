import { Node, mergeAttributes } from '@tiptap/core'
import { ReactNodeViewRenderer } from '@tiptap/react'
import FigureView from './FigureView'

export const Figure = Node.create({
  name: 'figure',
  group: 'block',
  atom: true,
  draggable: true,
  selectable: true,

  addAttributes() {
    return {
      src: { default: null },
      alt: { default: '' },
      caption: { default: '' },
    }
  },

  parseHTML() {
    return [
      {
        tag: 'figure',
        getAttrs: (element) => {
          const img = element.querySelector?.('img')
          if (!img) return false
          return {
            src: img.getAttribute('src'),
            alt: img.getAttribute('alt') || '',
            caption: element.querySelector('figcaption')?.textContent || '',
          }
        },
      },
      {
        tag: 'img[src]',
        getAttrs: (element) => {
          if (element.closest?.('figure')) return false
          return {
            src: element.getAttribute('src'),
            alt: element.getAttribute('alt') || '',
            caption: element.getAttribute('title') || '',
          }
        },
      },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    const { src, alt, caption } = HTMLAttributes
    const children = [
      ['img', { src, alt, loading: 'lazy', decoding: 'async' }],
    ]
    if (caption) {
      children.push(['figcaption', {}, caption])
    }
    return ['figure', mergeAttributes({ class: 'post-figure' }), ...children]
  },

  addCommands() {
    return {
      setFigure:
        (attrs) =>
        ({ commands }) =>
          commands.insertContent({
            type: this.name,
            attrs,
          }),
    }
  },

  addNodeView() {
    return ReactNodeViewRenderer(FigureView)
  },
})
