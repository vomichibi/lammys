'use client'

import { useEffect, useState, useCallback, useRef } from 'react'
import Image from 'next/image'

interface ParallaxHeroProps {
  imageUrl: string
  children: React.ReactNode
}

export function ParallaxHero({ imageUrl, children }: ParallaxHeroProps) {
  const [scrollPosition, setScrollPosition] = useState(0)
  const heroRef = useRef<HTMLDivElement>(null)

  const handleScroll = useCallback(() => {
    if (!heroRef.current) return

    const rect = heroRef.current.getBoundingClientRect()
    const windowHeight = window.innerHeight
    const scrollPercentage = Math.min(
      Math.max(0, -rect.top) / windowHeight * 100,
      100
    )
    
    setScrollPosition(scrollPercentage)
  }, [])

  useEffect(() => {
    if (typeof window === 'undefined') return

    // Initial position
    handleScroll()

    // Add scroll listener with throttling
    let ticking = false
    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          handleScroll()
          ticking = false
        })
        ticking = true
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', handleScroll, { passive: true })

    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', handleScroll)
    }
  }, [handleScroll])

  const parallaxStyle = {
    transform: `translate3d(0, ${scrollPosition * 1.2}px, 0)`,
    willChange: 'transform',
  }

  return (
    <div ref={heroRef} className="relative bg-white overflow-hidden h-screen">
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
