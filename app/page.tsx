"use client"

import { useRouter } from "next/navigation"

export default function Home() {
  const router = useRouter()

  const handleStart = () => {
    router.push("/ligacao-diagnostico")
  }
  return (
    <div
      className="min-h-[100dvh] max-w-[100vw] overflow-x-hidden flex flex-col items-center justify-center bg-[#0A0A0B] px-6"
      style={{
        fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif',
      }}
    >
      {/* Content */}
      <div className="flex flex-col items-center text-center max-w-md">
        {/* Logo/Icon */}
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-r from-[#34C759] to-[#30D158] flex items-center justify-center mb-8 shadow-lg shadow-[#34C759]/30">
          <span className="text-white text-3xl font-bold">4M</span>
        </div>

        {/* Title */}
        <h1 className="text-white text-3xl font-bold mb-4">Method 4M</h1>

        {/* Subtitle */}
        <p className="text-white/60 text-lg mb-12 leading-relaxed">
          An immersive experience that will change your relationship with English.
        </p>

        {/* CTA Button */}
        <button
          onClick={handleStart}
          className="w-full py-4 px-8 bg-gradient-to-r from-[#34C759] to-[#30D158] rounded-xl flex items-center justify-center gap-2 active:scale-[0.98] transition-transform shadow-lg shadow-[#34C759]/20"
        >
          <span className="text-white font-semibold text-lg">Start Experience</span>
        </button>

        {/* Footer note */}
        <p className="text-white/30 text-sm mt-6">Use headphones for the best experience.</p>
      </div>
    </div>
  )
}