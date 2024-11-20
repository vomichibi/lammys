'use client'

import { useEffect, useState, useCallback, useRef } from 'react'
import Image from 'next/image'

interface ParallaxHeroProps {
  imageUrl: string
  children: React.ReactNode
}

export function ParallaxHero({ imageUrl, children }: ParallaxHeroProps) {
  const [scrollPosition, setScrollPosition] = useState(0)
  const ticking = useRef(false)
  const lastScrollY = useRef(0)

  const handleScroll = useCallback(() => {
    lastScrollY.current = window.scrollY

    if (!ticking.current) {
      requestAnimationFrame(() => {
        const windowHeight = window.innerHeight
        const scrollPercentage = (lastScrollY.current / windowHeight) * 100
        setScrollPosition(Math.min(scrollPercentage, 100))
        ticking.current = false
      })

      ticking.current = true
    }
  }, [])

  useEffect(() => {
    if (typeof window === 'undefined') return

    handleScroll() // Initial position
    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [handleScroll])

  const parallaxStyle = {
    transform: `translate3d(0, ${scrollPosition * 2.5}px, 0)`,
    willChange: 'transform',
  }

  return (
    <div className="relative bg-white overflow-hidden h-screen">
      <div 
        className="absolute inset-0 scale-[1.5]"
        style={parallaxStyle}
      >
        <Image
          className="object-cover object-center"
          src={imageUrl}
          alt="Hero background"
          fill
          priority
          sizes="100vw"
          quality={90}
        />
        <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px]"></div>
      </div>
      <div className="relative z-10 max-w-7xl mx-auto h-full">
        {children}
      </div>
    </div>
  )
}
