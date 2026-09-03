import { useEffect, useState } from 'react'

export default function ReadingProgress({ targetRef }) {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const update = () => {
      const target = targetRef.current
      if (!target) return

      const start = target.offsetTop
      const distance = Math.max(target.offsetHeight - window.innerHeight, 1)
      const next = ((window.scrollY - start) / distance) * 100
      setProgress(Math.min(100, Math.max(0, next)))
    }

    update()
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    return () => {
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    }
  }, [targetRef])

  return (
    <div className="fixed inset-x-0 top-0 z-[60] h-1 bg-transparent" aria-hidden="true">
      <div
        className="h-full origin-left bg-pine-700 transition-[width] duration-100"
        style={{ width: `${progress}%` }}
      />
    </div>
  )
}
