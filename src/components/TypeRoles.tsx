import { useEffect, useRef, useState } from 'react'
import { prefersReducedMotion } from '../lib/motion'

const ROLES = ['Robotics', 'Embedded Systems', 'Machine Learning']

/**
 * Monospace role line that types each word out, holds, deletes, and cycles —
 * with a blinking cursor block for a terminal feel. Under reduced motion it
 * just shows the roles joined statically.
 */
export default function TypeRoles() {
  const [text, setText] = useState(prefersReducedMotion() ? ROLES.join(' · ') : '')
  const timer = useRef<number>()

  useEffect(() => {
    if (prefersReducedMotion()) return
    let role = 0
    let char = 0
    let deleting = false

    const tick = () => {
      const word = ROLES[role]
      char += deleting ? -1 : 1
      setText(word.slice(0, char))

      let delay = deleting ? 45 : 95
      if (!deleting && char === word.length) {
        delay = 1500 // hold the full word
        deleting = true
      } else if (deleting && char === 0) {
        deleting = false
        role = (role + 1) % ROLES.length
        delay = 350
      }
      timer.current = window.setTimeout(tick, delay)
    }
    timer.current = window.setTimeout(tick, 600)
    return () => window.clearTimeout(timer.current)
  }, [])

  return (
    <span className="font-mono text-accent">
      {text}
      <span className="ml-0.5 inline-block h-[1em] w-[0.55ch] translate-y-[0.12em] animate-blink bg-accent align-middle" />
    </span>
  )
}
