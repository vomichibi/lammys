'use client'

import { useEffect, useState, useCallback } from 'react'
import Image from 'next/image'

interface ParallaxHeroProps {
  imageUrl: string
  children: React.ReactNode
}

export function ParallaxHero({ imageUrl, children }: ParallaxHeroProps) {
  const [scrollPosition, setScrollPosition] = useState(0)

  const handleScroll = useCallback(() => {
    if (typeof window !== 'undefined') {
      const position = window.scrollY
      const windowHeight = window.innerHeight
      const scrollPercentage = (position / windowHeight) * 100
      setScrollPosition(Math.min(scrollPercentage, 100))
    }
  }, [])

  useEffect(() => {
    if (typeof window !== 'undefined') {
      handleScroll() // Initial position
      window.addEventListener('scroll', handleScroll, { passive: true })

      return () => {
        window.removeEventListener('scroll', handleScroll)
      }
    }
  }, [handleScroll])

  return (
    <div className="relative bg-white overflow-hidden h-screen">
      <div 
        className="absolute inset-0 scale-[1.5]"
        style={{
          transform: `translate3d(0, ${scrollPosition * 2}px, 0)`,
          transition: 'transform 0.1s cubic-bezier(0.33, 1, 0.68, 1)',
          willChange: 'transform',
        }}
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
