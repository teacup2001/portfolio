'use client'

import { useEffect, useRef } from 'react'

interface AudioEmbedProps {
  embedCode: string
  title?: string
}

export default function AudioEmbed({ embedCode, title }: AudioEmbedProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return
    
    // 找到所有 iframe
    const iframes = containerRef.current.querySelectorAll('iframe')
    iframes.forEach(iframe => {
      const src = iframe.getAttribute('src')
      if (!src) return
      
      // 移除自动播放参数（支持多种格式）
      let newSrc = src
        // 处理 auto=1 (网易云音乐)
        .replace(/auto=1/g, 'auto=0')
        .replace(/auto="1"/g, 'auto="0"')
        // 处理 autoplay=1 (通用)
        .replace(/autoplay=1/g, 'autoplay=0')
        .replace(/autoplay="1"/g, 'autoplay="0"')
        // 清理多余的参数
        .replace(/&auto=0&/g, '&')
        .replace(/&auto=0$/g, '')
        .replace(/\?auto=0&/g, '?')
        .replace(/\?auto=0$/g, '')
        .replace(/&autoplay=0&/g, '&')
        .replace(/&autoplay=0$/g, '')
        .replace(/\?autoplay=0&/g, '?')
        .replace(/\?autoplay=0$/g, '')
      
      // 确保没有自动播放参数
      if (newSrc.includes('?')) {
        if (!newSrc.includes('auto=0') && !newSrc.includes('autoplay=0') && 
            !newSrc.includes('auto=1') && !newSrc.includes('autoplay=1')) {
          newSrc += '&auto=0'
        }
      } else {
        newSrc += '?auto=0'
      }
      
      iframe.setAttribute('src', newSrc)
      
      // 移除 autoplay 属性
      iframe.removeAttribute('autoplay')
    })

    // 找到所有 audio 标签
    const audios = containerRef.current.querySelectorAll('audio')
    audios.forEach(audio => {
      audio.pause()
      audio.removeAttribute('autoplay')
    })
  }, [embedCode])

  return (
    <div className="w-full">
      {title && (
        <p className="text-[13px] text-[#888] mb-2">{title}</p>
      )}
      <div 
        ref={containerRef}
        className="audio-embed-wrapper"
        dangerouslySetInnerHTML={{ __html: embedCode }}
      />
    </div>
  )
}
