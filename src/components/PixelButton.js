"use client"

import Image from "next/image"

export function PixelButton({ onClick, src, alt, width, height }) {
  return (
    <button
      onClick={onClick}
      type="submit"
      className="bg-transparent border-0 p-0 cursor-pointer transform hover:translate-y-1 transition-transform duration-200 focus:outline-none"
      style={{ lineHeight: 0 }}
    >
      <div style={{ 
        width: width || 120, 
        height: height || 40,
        position: 'relative',
        imageRendering: 'pixelated'
      }}>
        <Image
          src={src || "/placeholder.svg"}
          alt={alt}
          fill
          sizes="100%"
          className="image-rendering-pixelated"
          unoptimized={true}
          style={{
            objectFit: 'contain'
          }}
        />
      </div>
    </button>
  )
}
