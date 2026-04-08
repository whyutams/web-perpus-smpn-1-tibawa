'use client'

import { useEffect, useRef, useState } from "react"
import { useInView, useMotionValue, useSpring } from "framer-motion"

interface AnimatedCounterProps {
  value: number | string
  className?: string
  delay?: number,
  start?: number
}

export default function AnimatedCounter({ value, className, delay = 0.5, start = 0 }: AnimatedCounterProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const motionValue = useMotionValue(0)
  const springValue = useSpring(motionValue, {
    damping: 30,
    stiffness: 100,
  })

  const isInView = useInView(ref, { once: true })

  const [hasStarted, setHasStarted] = useState(false)
  const suffix = value.toString().replace(/[0-9]/g, "")

  useEffect(() => {
    if (isInView) {
      const timeout = setTimeout(() => {
        const numericValue = parseInt(value.toString().replace(/[^0-9]/g, ""), 10) || 0
        motionValue.set(numericValue)
        setHasStarted(true)
      }, delay * 1000)

      return () => clearTimeout(timeout)
    }
  }, [isInView, delay, value, motionValue])

  useEffect(() => {
    const unsubscribe = springValue.on("change", (latest) => {
      if (ref.current && hasStarted) {
        ref.current.textContent = Math.round(latest).toLocaleString('id-ID') + suffix
      }
    })
    return () => unsubscribe()
  }, [springValue, suffix, hasStarted])

  return (
    <span className={className} ref={ref}>
      {start}{suffix}
    </span>
  )
}