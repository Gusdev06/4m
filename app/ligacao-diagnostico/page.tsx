"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { useRouter } from "next/navigation"
import { MicOff, Grid3x3, Volume2, Plus, Video, Users, Phone, X, User } from "lucide-react"

export default function LigacaoDiagnostico() {
  const router = useRouter()
  const [callState, setCallState] = useState<"incoming" | "active" | "ended">("incoming")
  const [callDuration, setCallDuration] = useState(0)
  const [isMounted, setIsMounted] = useState(false)
  const [currentTime, setCurrentTime] = useState("")
  const [audioEnabled, setAudioEnabled] = useState(true)
  const audioContextRef = useRef<AudioContext | null>(null)
  const voiceAudioRef = useRef<HTMLAudioElement | null>(null)

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
    if (callState !== "incoming" || !audioEnabled) {
      if (audioContextRef.current && audioContextRef.current.state !== "closed") {
        audioContextRef.current.close().catch(() => {
          // Ignore errors if already closed
        })
        audioContextRef.current = null
      }
      return
    }

    const audioContext = new (
      window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
    )()
    audioContextRef.current = audioContext

    // Resume AudioContext if suspended (browser autoplay policy)
    if (audioContext.state === "suspended") {
      audioContext.resume()
    }

    let isPlaying = true

    const playVibrationSound = async () => {
      if (!isPlaying || !audioContextRef.current || audioContextRef.current.state === "closed") return

      const currentContext = audioContextRef.current

      // iOS vibration uses two quick pulses then silence
      const createBuzz = (startTime: number, duration: number) => {
        const oscillator1 = currentContext.createOscillator()
        const oscillator2 = currentContext.createOscillator()
        const noiseGain = currentContext.createGain()
        const filterNode = currentContext.createBiquadFilter()
        const masterGain = currentContext.createGain()

        // Low-pass filter for muffled motor sound
        filterNode.type = "lowpass"
        filterNode.frequency.setValueAtTime(180, startTime)
        filterNode.Q.setValueAtTime(1, startTime)

        // Primary motor frequency - iPhone haptic motor runs around 150-200Hz
        oscillator1.type = "sine"
        oscillator1.frequency.setValueAtTime(155, startTime)

        // Secondary harmonic for texture
        oscillator2.type = "triangle"
        oscillator2.frequency.setValueAtTime(205, startTime)

        oscillator1.connect(filterNode)
        oscillator2.connect(noiseGain)
        noiseGain.connect(filterNode)
        filterNode.connect(masterGain)
        masterGain.connect(currentContext.destination)

        // Noise gain lower than main oscillator
        noiseGain.gain.setValueAtTime(0.8, startTime)

        // Quick attack, sustain, quick release - like real motor
        masterGain.gain.setValueAtTime(0, startTime)
        masterGain.gain.linearRampToValueAtTime(0.95, startTime + 0.015)
        masterGain.gain.setValueAtTime(0.95, startTime + duration - 0.050)
        masterGain.gain.linearRampToValueAtTime(0, startTime + duration)

        oscillator1.start(startTime)
        oscillator2.start(startTime)
        oscillator1.stop(startTime + duration)
        oscillator2.stop(startTime + duration)

        return { oscillator1, oscillator2, filterNode, masterGain, noiseGain }
      }

      const t = currentContext.currentTime

      // iOS pattern: buzz-buzz (pause) buzz-buzz (long pause)
      // First double buzz
      createBuzz(t, 0.2)
      createBuzz(t + 0.3, 0.2)

      // Second double buzz after short pause
      createBuzz(t + 1.2, 0.2)
      createBuzz(t + 1.5, 0.2)

      // Trigger vibration with sound for better compatibility
      triggerVibration()
    }

    const triggerVibration = () => {
      try {
        // Standard Vibration API
        if ("vibrate" in navigator && typeof navigator.vibrate === "function") {
          navigator.vibrate([200, 100, 200, 700, 200, 100, 200, 1500])
        }

        // Haptic Feedback API for iOS (experimental)
        if ('vibrate' in navigator || (window as any).webkit?.messageHandlers?.vibrate) {
          try {
            (window as any).webkit?.messageHandlers?.vibrate?.postMessage?.({
              duration: 200,
              pattern: [200, 100, 200, 700, 200, 100, 200, 1500]
            })
          } catch (e) {
            // Fallback silently
          }
        }
      } catch (error) {
        // Vibration not supported
        console.log('Vibration not supported')
      }
    }

    // Initial vibration
    triggerVibration()

    // Start sound
    playVibrationSound()

    // Repeat pattern every 3 seconds
    const interval = setInterval(() => {
      playVibrationSound()
      triggerVibration()
    }, 3000)

    return () => {
      isPlaying = false
      clearInterval(interval)
      if (audioContextRef.current && audioContextRef.current.state !== "closed") {
        audioContextRef.current.close().catch(() => {
          // Ignore errors if already closed
        })
        audioContextRef.current = null
      }
      if ("vibrate" in navigator) {
        try {
          navigator.vibrate(0)
        } catch (e) {
          // Ignore
        }
      }
    }
  }, [callState, audioEnabled])

  useEffect(() => {
    if (callState === "active") {
      const audio = new Audio("/vozFinalDaLigacao.mp3")
      voiceAudioRef.current = audio
      audio.play().catch(() => {
        // Fallback se autoplay for bloqueado
      })

      audio.onended = () => {
        setCallState("ended")
        setTimeout(() => router.push("/whatsapp-revelacao"), 500)
      }
    }

    return () => {
      if (voiceAudioRef.current) {
        voiceAudioRef.current.pause()
        voiceAudioRef.current = null
      }
    }
  }, [callState, router])

  useEffect(() => {
    if (callState !== "active") return

    const timer = setInterval(() => {
      setCallDuration((prev) => prev + 1)
    }, 1000)
    return () => clearInterval(timer)
  }, [callState])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const handleAnswer = useCallback(() => {
    if ("vibrate" in navigator) {
      navigator.vibrate(0)
    }
    setCallState("active")
  }, [])

  const handleDecline = useCallback(() => {
    // Botão desabilitado - usuário deve escutar o áudio até o final
    // Não faz nada
  }, [])

  const handleHangup = () => {
    if (voiceAudioRef.current) {
      voiceAudioRef.current.pause()
      voiceAudioRef.current = null
    }
    setCallState("ended")
    setTimeout(() => router.push("/whatsapp-revelacao"), 500)
  }

  const actionButtons = [
    { icon: MicOff, label: "mute" },
    { icon: Grid3x3, label: "keypad" },
    { icon: Volume2, label: "audio" },
    { icon: Plus, label: "add call" },
    { icon: Video, label: "FaceTime" },
    { icon: Users, label: "contacts" },
  ]

  // Tela inicial para habilitar áudio
  if (!audioEnabled) {
    return (
      <div
        className={`min-h-screen max-w-[100vw] overflow-x-hidden transition-opacity duration-500 ${isMounted ? "opacity-100" : "opacity-0"
          }`}
        style={{
          background: "linear-gradient(180deg, #1C1C1E 0%, #000000 100%)",
          fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif',
        }}
      >
        <div className="w-full max-w-[375px] md:max-w-[414px] lg:max-w-[768px] mx-auto min-h-screen flex flex-col items-center justify-center px-6">
          <div className="text-center mb-8">
            <h1 className="text-white text-3xl font-semibold mb-4">Chamada Importante</h1>
            <p className="text-white/70 text-lg">Toque no botão abaixo para começar</p>
          </div>

          <button
            onClick={() => {
              // Trigger vibration immediately on user interaction
              try {
                if ("vibrate" in navigator && typeof navigator.vibrate === "function") {
                  navigator.vibrate(200)
                }
              } catch (e) {
                // Ignore if not supported
              }
              setAudioEnabled(true)
            }}
            className="px-8 py-4 bg-[#34C759] text-white text-xl font-semibold rounded-full active:bg-[#2db84e] transition-colors"
          >
            Começar
          </button>
        </div>
      </div>
    )
  }

  if (callState === "incoming") {
    return (
      <div
        className={`min-h-screen max-w-[100vw] overflow-x-hidden transition-opacity duration-500 ${isMounted ? "opacity-100" : "opacity-0"
          }`}
        style={{
          background: "linear-gradient(180deg, #1C1C1E 0%, #000000 100%)",
          fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif',
        }}
      >
        <div
          className="w-full max-w-[375px] md:max-w-[414px] lg:max-w-[768px] mx-auto min-h-screen flex flex-col"
          style={{
            animation: "vibrate-frenetic 0.08s linear infinite",
          }}
        >
          <div className="h-11 flex items-center justify-between px-6 text-white text-sm font-medium">
            <span>{currentTime}</span>
            <div className="flex items-center gap-1">
              <div className="flex gap-[2px]">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="w-[3px] rounded-sm bg-white" style={{ height: `${8 + i * 2}px` }} />
                ))}
              </div>
              <span className="ml-1 text-xs">5G</span>
              <div className="ml-1 w-6 h-3 border border-white rounded-sm relative">
                <div className="absolute left-[1px] top-[1px] bottom-[1px] right-[3px] bg-white rounded-[1px]" />
                <div className="absolute -right-[2px] top-1/2 -translate-y-1/2 w-[2px] h-[4px] bg-white rounded-r-sm" />
              </div>
            </div>
          </div>

          <div className="flex-1 flex flex-col items-center pt-16 pb-8 px-6">
            <div className="relative mb-6">
              <div className="w-24 h-24 md:w-28 md:h-28 lg:w-32 lg:h-32 rounded-full overflow-hidden bg-[#48484a] flex items-center justify-center">
                <User className="w-12 h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 text-[#8e8e93]" />
              </div>
              <div className="absolute inset-0 w-24 h-24 md:w-28 md:h-28 lg:w-32 lg:h-32 rounded-full border-2 border-white/30 animate-ping" />
            </div>

            <h1 className="text-white text-[28px] md:text-3xl lg:text-4xl font-semibold mb-1 text-center" style={{ letterSpacing: "-0.5px" }}>
              Unknown Number
            </h1>

            <p className="text-[#a0a0a0] text-lg mb-2">mobile</p>
            <p className="text-white/80 text-base animate-pulse">Incoming call...</p>

            <div className="flex-1" />

            <div className="flex items-center justify-center gap-12 md:gap-16 mb-12">
              <div className="flex flex-col items-center gap-2">
                <button
                  onClick={handleDecline}
                  disabled
                  className="w-16 h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 rounded-full bg-[#FF3B30]/50 flex items-center justify-center cursor-not-allowed opacity-50 transition-colors"
                  aria-label="Decline"
                >
                  <X className="w-6 h-6 md:w-7 md:h-7 lg:w-8 lg:h-8 text-white" />
                </button>
                <span className="text-white text-sm opacity-50">Decline</span>
              </div>

              <div className="flex flex-col items-center gap-2">
                <button
                  onClick={handleAnswer}
                  className="w-16 h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 rounded-full bg-[#34C759] flex items-center justify-center active:bg-[#2db84e] transition-colors"
                  aria-label="Answer"
                >
                  <Phone className="w-6 h-6 md:w-7 md:h-7 lg:w-8 lg:h-8 text-white" />
                </button>
                <span className="text-white text-sm">Answer</span>
              </div>
            </div>
          </div>
        </div>

        <style jsx>{`
          @keyframes vibrate-frenetic {
            0% { transform: translateX(15px); }
            10% { transform: translateX(-25px); }
            20% { transform: translateX(20px); }
            30% { transform: translateX(-30px); }
            40% { transform: translateX(25px); }
            50% { transform: translateX(-20px); }
            60% { transform: translateX(28px); }
            70% { transform: translateX(-18px); }
            80% { transform: translateX(22px); }
            90% { transform: translateX(-26px); }
            100% { transform: translateX(15px); }
          }
        `}</style>
      </div>
    )
  }

  return (
    <div
      className={`h-screen w-screen overflow-x-hidden transition-opacity duration-500 ${callState === "active" ? "opacity-100" : "opacity-0"
        }`}
      style={{
        background: "linear-gradient(180deg, #1C1C1E 0%, #000000 100%)",
        fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif',
      }}
    >
      <div className="w-full max-w-[375px] md:max-w-[414px] lg:max-w-[768px] mx-auto min-h-screen flex flex-col">
        <div className="h-11 flex items-center justify-between px-6 text-white text-sm font-medium">
          <span>{currentTime}</span>
          <div className="flex items-center gap-1">
            <div className="flex gap-[2px]">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="w-[3px] rounded-sm bg-white" style={{ height: `${8 + i * 2}px` }} />
              ))}
            </div>
            <span className="ml-1 text-xs">5G</span>
            <div className="ml-1 w-6 h-3 border border-white rounded-sm relative">
              <div className="absolute left-[1px] top-[1px] bottom-[1px] right-[3px] bg-white rounded-[1px]" />
              <div className="absolute -right-[2px] top-1/2 -translate-y-1/2 w-[2px] h-[4px] bg-white rounded-r-sm" />
            </div>
          </div>
        </div>

        <div className="flex-1 flex flex-col items-center pt-12 pb-8 px-6">
          <div className="w-24 h-24 md:w-28 md:h-28 lg:w-32 lg:h-32 rounded-full overflow-hidden mb-4 bg-[#48484a] flex items-center justify-center">
            <User className="w-12 h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 text-[#8e8e93]" />
          </div>

          <h1 className="text-white text-[28px] font-semibold mb-1 text-center" style={{ letterSpacing: "-0.5px" }}>
            Unknown Number
          </h1>

          <p className="text-[#a0a0a0] text-base mb-2">mobile</p>

          <p className="text-white text-xl font-light mb-12" style={{ fontVariantNumeric: "tabular-nums" }}>
            {formatTime(callDuration)}
          </p>

          <div className="flex-1" />

          <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-x-6 gap-y-4 md:gap-x-8 md:gap-y-6 lg:gap-x-10 lg:gap-y-8 mb-12">
            {actionButtons.map(({ icon: Icon, label }) => (
              <div key={label} className="flex flex-col items-center gap-2">
                <button
                  className="w-12 h-12 md:w-16 md:h-16 lg:w-20 lg:h-20 rounded-full bg-[#48484a] flex items-center justify-center active:bg-[#5c5c5e] transition-colors"
                  aria-label={label}
                >
                  <Icon className="w-5 h-5 md:w-6 md:h-6 lg:w-7 lg:h-7 text-white" />
                </button>
                <span className="text-white text-xs">{label}</span>
              </div>
            ))}
          </div>

          <button
            onClick={handleHangup}
            disabled
            className="w-16 h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 rounded-full bg-[#FF3B30]/50 flex items-center justify-center cursor-not-allowed opacity-50 transition-colors"
            aria-label="End call"
          >
            <Phone className="w-6 h-6 md:w-7 md:h-7 lg:w-8 lg:h-8 text-white rotate-[135deg]" />
          </button>
        </div>
      </div>
    </div>
  )
}
