'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'

interface ParallaxHeroProps {
  imageUrl: string
  children: React.ReactNode
}

export function ParallaxHero({ imageUrl, children }: ParallaxHeroProps) {
  const [scrollPosition, setScrollPosition] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      const position = window.scrollY
      setScrollPosition(position)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  return (
    <div className="relative bg-white overflow-hidden h-screen">
      <div 
        className="absolute inset-0"
        style={{
          transform: `translateY(${scrollPosition * 0.5}px)`,
        }}
      >
        <Image
          className="object-cover"
          src={imageUrl}
          alt="Hero background"
          fill
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-black/40"></div>
      </div>
      <div className="relative z-10 max-w-7xl mx-auto h-full">
        {children}
      </div>
    </div>
  )
}
