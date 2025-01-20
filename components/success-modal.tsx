"use client"

import { useEffect, useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { motion, AnimatePresence } from "framer-motion"

interface SuccessModalProps {
  isOpen: boolean
  onClose: () => void
}

interface Particle {
  id: number
  x: number
  y: number
  color: string
  tx: number
  ty: number
}

export function SuccessModal({ isOpen, onClose }: SuccessModalProps) {
  const [particles, setParticles] = useState<Particle[]>([])
  
  useEffect(() => {
    if (!isOpen) return
    
    const audio = new Audio('https://www.soundjay.com/misc/sounds/bell-ringing-05.mp3')
    audio.play().catch(e => console.log("Audio playback failed:", e))
    
    const colors = ['#FFD700', '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEEAD']
    const createParticle = (): Particle => ({
      id: Math.random(),
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      color: colors[Math.floor(Math.random() * colors.length)],
      tx: Math.random() * 200 - 100,
      ty: Math.random() * -200 - 100
    })

    const initialParticles = Array.from({ length: 50 }, () => createParticle())
    setParticles(initialParticles)
    
    const interval = setInterval(() => {
      setParticles(prev => {
        if (prev.length >= 100) return prev
        return [...prev, createParticle()]
      })
    }, 200)
    
    return () => {
      clearInterval(interval)
      setParticles([])
    }
  }, [isOpen])

  return (
    <>
      <style jsx global>{`
        .celebration-particle {
          position: fixed;
          pointer-events: none;
          z-index: 9999;
          border-radius: 50%;
        }

        .firework {
          --initialSize: 0.5vmin;
          --finalSize: 45vmin;
          --particleSize: 0.2vmin;
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, var(--y));
          width: var(--initialSize);
          aspect-ratio: 1;
          animation: firework 2s infinite;
          background: 
            radial-gradient(circle, yellow var(--particleSize), #0000 0) 0% 0%,
            radial-gradient(circle, khaki var(--particleSize), #0000 0) 100% 0%,
            radial-gradient(circle, white var(--particleSize), #0000 0) 100% 100%,
            radial-gradient(circle, lime var(--particleSize), #0000 0) 0% 100%,
            radial-gradient(circle, gold var(--particleSize), #0000 0) 50% 0%,
            radial-gradient(circle, mediumseagreen var(--particleSize), #0000 0) 50% 100%,
            radial-gradient(circle, yellow var(--particleSize), #0000 0) 0% 50%,
            radial-gradient(circle, khaki var(--particleSize), #0000 0) 100% 50%,
            radial-gradient(circle, white var(--particleSize), #0000 0) 50% 50%;
          background-size: 0.5vmin 0.5vmin;
          background-repeat: no-repeat;
        }

        @keyframes firework {
          0% { 
            transform: translate(var(--x), 60vmin);
            width: var(--initialSize);
            opacity: 1;
          }
          50% { 
            width: 0.5vmin;
            opacity: 1;
          }
          100% { 
            width: var(--finalSize);
            opacity: 0;
          }
        }
      `}</style>

      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center text-2xl">
              Application Submitted Successfully! 🎉
            </DialogTitle>
            <DialogDescription className="text-center text-lg">
              We're excited to review your application for Innovix Solutions.
            </DialogDescription>
          </DialogHeader>
          <div className="text-center space-y-4 py-4">
            <p className="text-lg">
              Thank you for applying to Innovix Solutions. We've received your application and will review it shortly.
            </p>
            <p className="text-lg">
              You will receive a confirmation email soon with further details.
            </p>
          </div>
        </DialogContent>
      </Dialog>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Floating particles */}
            {particles.map((particle) => (
              <motion.div
                key={particle.id}
                className="celebration-particle"
                animate={{
                  x: [0, particle.tx],
                  y: [0, particle.ty],
                  rotate: [0, 360],
                  opacity: [1, 0]
                }}
                transition={{ 
                  duration: 3,
                  ease: "linear"
                }}
                style={{
                  left: `${particle.x}px`,
                  top: `${particle.y}px`,
                  background: particle.color,
                  width: `${Math.random() * 10 + 5}px`,
                  height: `${Math.random() * 10 + 5}px`,
                }}
                initial={{ opacity: 0, scale: 0 }}
                exit={{ opacity: 0, scale: 0 }}
              />
            ))}
            
            {/* Fireworks */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
              {[-30, 0, 30].map((x, index) => (
                <div
                  key={index}
                  className="firework"
                  style={{ 
                    '--x': `${x}vmin`,
                    '--y': '-30vmin'
                  } as React.CSSProperties}
                />
              ))}
            </div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}