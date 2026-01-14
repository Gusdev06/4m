"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Play, ChevronRight, Quote } from "lucide-react"
import Image from "next/image"

const testimonials = [
  {
    id: 1,
    name: "Amanda",
    role: "Designer @ Google",
    quote: "I used to freeze in meetings. Now I lead international projects.",
    image: "/images/depoi1.jpeg",
  },
  {
    id: 2,
    name: "Michelle",
    role: "Software Engineer",
    quote: "I stopped studying grammar. I started living in English.",
    image: "/images/depoi2.jpeg",
  },
  {
    id: 3,
    name: "Jessica",
    role: "Product Manager",
    quote: "Fluency isn't about words. It's about confidence.",
    image: "/images/depoi3.jpeg",
  },
  {
    id: 4,
    name: "Victoria",
    role: "McKinsey Consultant",
    quote: "The method changed my relationship with the language. Now I exist in English.",
    image: "/images/depoi5.jpeg",
  },
]

export default function Depoimentos() {
  const router = useRouter()
  const [visibleCards, setVisibleCards] = useState<number[]>([])
  const [isMounted, setIsMounted] = useState(false)
  const [isTransitioning, setIsTransitioning] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setIsMounted(true), 100)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (!isMounted) return

    testimonials.forEach((_, index) => {
      setTimeout(() => {
        setVisibleCards((prev) => [...prev, index])
      }, index * 600)
    })
  }, [isMounted])

  const handleCTA = () => {
    setIsTransitioning(true)
    setTimeout(() => router.push("/sales"), 300)
  }

  return (
    <div
      className={`h-screen w-screen overflow-x-hidden bg-gradient-to-b from-[#0a0a0a] to-[#1a1a1a] transition-opacity duration-300 ${isMounted && !isTransitioning ? "opacity-100" : "opacity-0"
        }`}
    >
      <div className="w-full max-w-[375px] md:max-w-[414px] lg:max-w-[768px] mx-auto min-h-screen flex flex-col px-4 md:px-6 lg:px-8 py-8 md:py-12">
        <div className="text-center mb-6 md:mb-10">
          <h1 className="text-white text-xl md:text-2xl lg:text-3xl xl:text-4xl font-bold mb-2">People like you</h1>
          <p className="text-[#a0a0a0] text-sm md:text-base lg:text-lg">who decided to stop studying and start living</p>
        </div>

        {/* Testimonial Cards */}
        <div className="flex-1 space-y-3 md:space-y-4">
          {testimonials.map((testimonial, index) => (
            <div
              key={testimonial.id}
              className={`bg-[#1c1c1e] rounded-2xl p-4 md:p-5 transition-all duration-500 ${visibleCards.includes(index) ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                }`}
            >
              <div className="flex items-start gap-3 md:gap-4">
                <div className="relative">
                  <div className="w-12 h-12 md:w-14 md:h-14 rounded-full overflow-hidden bg-[#48484a]">
                    <Image
                      src={testimonial.image || "/placeholder.svg"}
                      alt={testimonial.name}
                      width={56}
                      height={56}
                      className="w-full h-full object-cover"
                      unoptimized
                    />
                  </div>
                </div>

                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-white font-semibold text-sm md:text-base">{testimonial.name}</h3>
                    <span className="text-[#48484a]">•</span>
                    <span className="text-[#a0a0a0] text-xs md:text-sm">{testimonial.role}</span>
                  </div>

                  <div className="relative">
                    <Quote className="absolute -left-1 -top-1 w-3 h-3 md:w-4 md:h-4 text-[#34C759]/30" />
                    <p className="text-[#e0e0e0] text-sm md:text-[15px] leading-relaxed pl-3 md:pl-4">{testimonial.quote}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {visibleCards.length === testimonials.length && (
          <div className="mt-6 md:mt-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <button
              onClick={handleCTA}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-[#34C759] to-[#30D158] text-white font-bold py-3 md:py-4 lg:py-5 px-4 md:px-6 rounded-full shadow-lg shadow-[#34C759]/25 active:scale-95 transition-transform text-sm md:text-base lg:text-lg"
            >
              I want to start my transformation
              <ChevronRight className="w-4 h-4 md:w-5 md:h-5" />
            </button>

            <p className="text-center text-[#667781] text-xs md:text-sm mt-3 md:mt-4">
              More than 2,400 people have already made this choice
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
