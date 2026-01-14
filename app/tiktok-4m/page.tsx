"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { Heart, MessageCircle, Share2, Bookmark, Music2, ChevronRight } from "lucide-react"
import Image from "next/image"

export default function TikTok4M() {
  const router = useRouter()
  const videoRef = useRef<HTMLVideoElement>(null)
  const [showCTA, setShowCTA] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [currentTime, setCurrentTime] = useState("")
  const [hasPlayedOnce, setHasPlayedOnce] = useState(false)

  useEffect(() => {
    const updateTime = () => {
      const now = new Date()
      setCurrentTime(
        now.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
        }),
      )
    }
    updateTime()
    const interval = setInterval(updateTime, 1000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => setIsMounted(true), 100)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    const playWithSound = () => {
      if (videoRef.current) {
        videoRef.current.muted = false
        videoRef.current.play().catch(() => {
          // Fallback: se não conseguir tocar com som, toca mudo primeiro
          if (videoRef.current) {
            videoRef.current.muted = true
            videoRef.current.play()
          }
        })
      }
    }

    // Tentar tocar com som imediatamente
    if (videoRef.current) {
      videoRef.current.muted = false
      videoRef.current.play().catch(() => {
        // Se falhar, aguardar interação do usuário
        document.addEventListener("click", playWithSound, { once: true })
        document.addEventListener("touchstart", playWithSound, { once: true })
      })
    }

    return () => {
      document.removeEventListener("click", playWithSound)
      document.removeEventListener("touchstart", playWithSound)
    }
  }, [])

  const handleVideoEnd = () => {
    if (!hasPlayedOnce) {
      setHasPlayedOnce(true)
      setShowCTA(true)
    }
  }

  const handleCTA = () => {
    setIsTransitioning(true)
    setTimeout(() => router.push("/depoimentos"), 300)
  }

  return (
    <div
      className={`h-screen w-screen overflow-x-hidden bg-black transition-opacity duration-300 ${isMounted && !isTransitioning ? "opacity-100" : "opacity-0"
        }`}
    >
      {/* Container para simular iPhone em desktop */}
      <div className="w-full max-w-[375px] md:max-w-[414px] lg:max-w-[768px] mx-auto min-h-screen relative overflow-hidden">
        <div className="absolute inset-0">
          <video
            ref={videoRef}
            src="/VideoTikTok.mp4"
            className="w-full h-screen object-cover"
            autoPlay
            playsInline
            onEnded={handleVideoEnd}
          />
          {/* Overlay escuro leve */}
          <div className="absolute inset-0 bg-black/20" />
        </div>

        {/* Content Overlay */}
        <div className="absolute inset-0 z-10 min-h-screen flex flex-col">
          <div className="h-11 flex items-center justify-between px-4 md:px-6 lg:px-8 xl:px-12 text-white text-sm font-medium">
            <span>{currentTime}</span>
            <div className="flex items-center gap-1">
              <span className="text-xs">5G</span>
              <div className="w-6 h-3 border border-white rounded-sm relative">
                <div className="absolute left-[1px] top-[1px] bottom-[1px] right-[3px] bg-white rounded-[1px]" />
              </div>
            </div>
          </div>

          {/* Main Content - CTA only */}
          <div className="flex-1 flex items-end justify-center px-4 md:px-6 lg:px-8 xl:px-12 pb-24 md:pb-32">
            {/* CTA Button - appears after video ends once */}
            {showCTA && (
              <button
                onClick={handleCTA}
                className="flex items-center gap-2 mx-auto bg-white text-black font-bold py-3 md:py-4 lg:py-5 px-6 md:px-8 lg:px-10 rounded-full shadow-2xl active:scale-95 transition-transform animate-in fade-in slide-in-from-bottom-4 duration-500 text-sm md:text-base lg:text-lg xl:text-xl"
              >
                see who already lives this
                <ChevronRight className="w-4 h-4 md:w-5 md:h-5" />
              </button>
            )}
          </div>

          <div className="absolute right-2 md:right-3 lg:right-4 xl:right-6 bottom-20 md:bottom-24 flex flex-col items-center gap-4 md:gap-6">
            <div className="flex flex-col items-center gap-1">
              <button className="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center">
                <Heart className="w-5 h-5 md:w-6 md:h-6 text-white/90" strokeWidth={1.5} />
              </button>
              <span className="text-white/80 text-[10px] md:text-[11px] font-light">24.5K</span>
            </div>

            <div className="flex flex-col items-center gap-1">
              <button className="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center">
                <MessageCircle className="w-5 h-5 md:w-6 md:h-6 text-white/90" strokeWidth={1.5} />
              </button>
              <span className="text-white/80 text-[10px] md:text-[11px] font-light">1,234</span>
            </div>

            <div className="flex flex-col items-center gap-1">
              <button className="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center">
                <Bookmark className="w-5 h-5 md:w-6 md:h-6 text-white/90" strokeWidth={1.5} />
              </button>
              <span className="text-white/80 text-[10px] md:text-[11px] font-light">8,901</span>
            </div>

            <div className="flex flex-col items-center gap-1">
              <button className="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center">
                <Share2 className="w-5 h-5 md:w-6 md:h-6 text-white/90" strokeWidth={1.5} />
              </button>
              <span className="text-white/80 text-[10px] md:text-[11px] font-light">Share</span>
            </div>
          </div>

          {/* Bottom Info - removed caption/description */}
          <div className="px-3 md:px-4 lg:px-6 xl:px-8 pb-4 md:pb-6">
            <div className="flex items-center gap-2 mb-2 md:mb-3">
              <div className="w-8 h-8 md:w-10 md:h-10 rounded-full overflow-hidden border-2 border-white">
                <Image
                  src="/images/mulher.jpeg"
                  alt="afterwork.global"
                  width={40}
                  height={40}
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="text-white font-bold text-sm md:text-base">@afterwork.global</span>
              <button className="ml-1 md:ml-2 px-2 md:px-3 py-0.5 md:py-1 border border-white/50 rounded text-white text-xs md:text-sm font-medium">
                Follow
              </button>
            </div>

            <div className="flex items-center gap-2 text-white/80 text-xs md:text-sm">
              <Music2 className="w-3 h-3 md:w-4 md:h-4" />
              <span className="truncate">Original Sound - afterwork.global</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
