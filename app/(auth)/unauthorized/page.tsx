// app/(auth)/unauthorized/page.tsx

'use client'

import { useEffect, useState, useRef } from 'react'
import Link from 'next/link'
import { ShieldAlert, ArrowLeft, Lock, AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { motion, AnimatePresence } from 'framer-motion'
import confetti from 'canvas-confetti'

export default function UnauthorizedPage() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [showEasterEgg, setShowEasterEgg] = useState(false)
  const [clickCount, setClickCount] = useState(0)
  const [isClient, setIsClient] = useState(false)
  const confettiRef = useRef<HTMLCanvasElement>(null)

  // This ensures we only render certain elements on the client to avoid hydration errors
  useEffect(() => {
    setIsClient(true)
  }, [])

  // Track mouse movement for interactive background effect
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  // Function to trigger confetti
  const fireConfetti = () => {
    if (!confettiRef.current) return

    const confettiCanvas = confetti.create(confettiRef.current, {
      resize: true
    })

    const colors = ['#00cc88', '#1a85ff', '#ff3333', '#ffcc00']

    // Left bottom corner burst
    confettiCanvas({
      particleCount: 80,
      spread: 70,
      origin: { x: 0.1, y: 0.9 }, // Left bottom
      angle: 60, // Shoot upward and right
      colors,
      disableForReducedMotion: true
    })

    // Right bottom corner burst
    setTimeout(() => {
      confettiCanvas({
        particleCount: 80,
        spread: 70,
        origin: { x: 0.9, y: 0.9 }, // Right bottom
        angle: 120, // Shoot upward and left
        colors,
        disableForReducedMotion: true
      })
    }, 100)

    // Additional bursts for more excitement
    setTimeout(() => {
      // Left bottom again
      confettiCanvas({
        particleCount: 60,
        spread: 80,
        origin: { x: 0.2, y: 0.95 },
        angle: 80,
        colors,
        disableForReducedMotion: true
      })
    }, 300)

    setTimeout(() => {
      // Right bottom again
      confettiCanvas({
        particleCount: 60,
        spread: 80,
        origin: { x: 0.8, y: 0.95 },
        angle: 100,
        colors,
        disableForReducedMotion: true
      })
    }, 400)
  }

  // Easter egg trigger
  const handleShieldClick = () => {
    const newCount = clickCount + 1
    setClickCount(newCount)
    if (newCount >= 5) {
      setShowEasterEgg(true)
      fireConfetti()
    }
  }

  return (
    <div className='relative flex h-screen w-full items-center justify-center overflow-hidden pt-0 pb-16'>
      {/* Confetti canvas */}
      <canvas
        ref={confettiRef}
        className='pointer-events-none absolute inset-0 z-50 h-full w-full'
      />
      {/* Dynamic interaction elements that move with cursor */}
      <motion.div
        className='pointer-events-none absolute inset-0 opacity-30'
        style={{
          backgroundImage: `radial-gradient(circle 100px at ${mousePosition.x}px ${mousePosition.y}px, rgba(220, 20, 60, 0.15), transparent)`
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.3 }}
        transition={{ duration: 1 }}
      />

      {/* Floating particles - client-side only to avoid hydration errors */}
      {isClient &&
        Array.from({ length: 20 }).map((_, i) => {
          const randomX = Math.random() * 100
          const randomY = Math.random() * 100
          const duration = Math.random() * 10 + 15

          return (
            <motion.div
              key={i}
              className='absolute h-1 w-1 rounded-full bg-red-500/30'
              initial={{
                x: `${randomX}%`,
                y: `${randomY}%`,
                opacity: Math.random() * 0.5 + 0.3,
                scale: Math.random() * 0.5 + 0.5
              }}
              animate={{
                x: [`${randomX}%`, `${(randomX + 10) % 100}%`, `${randomX}%`],
                y: [`${randomY}%`, `${(randomY + 10) % 100}%`, `${randomY}%`],
                opacity: [0.3, 0.6, 0.3],
                scale: [1, 1.5, 1]
              }}
              transition={{
                duration: duration,
                repeat: Infinity,
                ease: 'easeInOut'
              }}
            />
          )
        })}

      {/* Main content */}
      <motion.div
        className='relative z-10 mx-auto -mt-12 flex max-w-xl flex-col items-center justify-center px-4'
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        {/* Alert Icon */}
        <motion.div
          className='mb-8 cursor-pointer'
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleShieldClick}
        >
          <div className='relative'>
            <motion.div
              className='absolute inset-0 rounded-full bg-red-500/80'
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.5, 0.2, 0.5]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut'
              }}
            />
            <div className='relative flex items-center justify-center p-6'>
              <ShieldAlert className='text-primary relative z-10 h-16 w-16' />
            </div>
            {/* Shield alert glow effect when easter egg is activated */}
            {showEasterEgg && (
              <motion.div
                className='absolute inset-0 rounded-full bg-emerald-500/30'
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{
                  scale: [0.8, 1.3, 1],
                  opacity: [0, 0.6, 0.4]
                }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  repeatType: 'reverse'
                }}
              />
            )}
          </div>
        </motion.div>

        {/* Message */}
        <motion.div
          className='mb-8 text-center'
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <h1 className='mb-2 text-4xl font-bold tracking-tight'>
            {showEasterEgg ? 'You Found The Easter Egg!' : 'Access Denied'}
          </h1>
          <div className='relative overflow-hidden rounded-lg bg-black/40 p-6 backdrop-blur-md'>
            <div className='absolute top-0 left-0 h-1 w-full bg-gradient-to-r from-red-500/50 to-orange-500/50' />
            <div className='absolute top-0 left-0 h-full w-1 bg-gradient-to-b from-red-500/50 to-transparent' />

            <div className='mb-4 flex items-center gap-3'>
              <AlertTriangle className='h-5 w-5 text-amber-500' />
              <p className='font-semibold text-amber-500'>
                Unauthorized Access
              </p>
            </div>

            <p className='mb-4 text-gray-300'>
              You do not have permission to access this page. The area
              you&apos;re trying to reach requires
              {showEasterEgg
                ? ' special clearance, but at least you found a hidden secret! 🎮'
                : ' proper authorization.'}
            </p>

            <div className='mt-4 flex items-center gap-2 text-sm text-gray-400'>
              <Lock className='h-3 w-3' />
              <span>Error Code: 403-UNAUTHORIZED</span>
            </div>
          </div>
        </motion.div>

        {/* Button */}
        <motion.div
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          className='w-full max-w-xs'
        >
          <Button
            asChild
            className='relative w-full overflow-hidden bg-gradient-to-r from-emerald-600 to-teal-600 shadow-lg hover:from-emerald-500 hover:to-teal-500'
            size='lg'
          >
            <Link href='/' className='flex items-center justify-center gap-2'>
              <ArrowLeft className='h-4 w-4' />
              <span>Return to Safety</span>
            </Link>
          </Button>
        </motion.div>

        {/* Easter egg message */}
        <AnimatePresence>
          {showEasterEgg && (
            <motion.p
              className='mt-4 text-center text-sm text-emerald-500'
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ delay: 0.5 }}
            >
              Easter egg found! You clicked the shield 5 times. Your curiosity
              is commendable!
            </motion.p>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}
