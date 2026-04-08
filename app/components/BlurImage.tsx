'use client'

import React, { useState, useEffect } from 'react'

const loadedImages = new Set<string>()

interface BlurImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string
  alt: string
  className?: string
}

const BlurImage: React.FC<BlurImageProps> = ({ src, alt, className = '', ...props }) => {
  const [isLoading, setIsLoading] = useState(true)

  {/* Effects */ }
  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false)
      loadedImages.add(src)
    }, 5000)

    if (src && loadedImages.has(src)) {
      setIsLoading(false)
    }
  }, [src])
  {/* Effects End */ }

  {/* Functions */ }
  const handleLoad = () => {
    setIsLoading(false)
    if (src) {
      loadedImages.add(src)
    }
  }
  const handleError = () => {
    setIsLoading(false)
  }
  {/* Functions End */ }

  return (
    <div className={`overflow-hidden bg-gray-200 ${className}`}>
      <img
        src={src}
        alt={alt}
        className={`w-full h-full object-cover transition-all duration-700 ease-in-out ${isLoading
          ? 'scale-110 blur-2xl grayscale opacity-0'
          : 'scale-100 blur-0 grayscale-0 opacity-100'
          }`}
        onLoad={handleLoad}
        onError={handleError}
        {...props}
      />
    </div>
  )
}

export default BlurImage