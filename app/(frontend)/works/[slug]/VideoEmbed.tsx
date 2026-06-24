'use client'

import { useEffect, useRef } from 'react'

interface VideoEmbedProps {
  embedCode: string
  title?: string
}

export default function VideoEmbed({ embedCode, title }: VideoEmbedProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return
    
    // 找到所有 iframe
    const iframes = containerRef.current.querySelectorAll('iframe')
    iframes.forEach(iframe => {
      const src = iframe.getAttribute('src')
      if (!src) return
      
      // 移除 autoplay 参数
      let newSrc = src
        .replace(/autoplay=1/g, 'autoplay=0')
        .replace(/autoplay="1"/g, 'autoplay="0"')
        .replace(/&autoplay=0/g, '')
        .replace(/\?autoplay=0&/g, '?')
        .replace(/\?autoplay=0$/g, '?')
      
      // 确保没有 autoplay
      if (newSrc.includes('?')) {
        if (!newSrc.includes('autoplay=0') && !newSrc.includes('autoplay=1')) {
          newSrc += '&autoplay=0'
        }
      } else {
        newSrc += '?autoplay=0'
      }
      
      iframe.setAttribute('src', newSrc)
      
      // 移除 autoplay 属性
      iframe.removeAttribute('autoplay')
    })
  }, [embedCode])

  return (
    <div className="w-full">
      {title && (
        <p className="text-[13px] text-[#888] mb-2">{title}</p>
      )}
      <div 
        ref={containerRef}
        className="video-embed-wrapper"
        dangerouslySetInnerHTML={{ __html: embedCode }}
      />
    </div>
  )
}
