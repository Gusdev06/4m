"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { ChevronLeft, Phone, Video, MoreHorizontal, Play, Pause } from "lucide-react"

interface Message {
  id: number
  text: string
  sender: "sarah" | "system"
  timestamp: string
  type: "text" | "audio"
  audioDuration?: string
  audioSrc?: string
  isCode?: boolean
}

const conversationScript: Omit<Message, "id" | "timestamp">[] = [
  { text: "hey", sender: "sarah", type: "text" },
  { text: "it's about what I told you on the call", sender: "sarah", type: "text" },
  { text: "this couldn't fit in just text…", sender: "sarah", type: "text" },
  { text: "I'll send you a quick audio", sender: "sarah", type: "text" },
  { text: "but first, save this access code:", sender: "sarah", type: "text" },
  { text: "9383", sender: "sarah", type: "text", isCode: true },
  { text: "you'll need it 😉", sender: "sarah", type: "text" },
  { text: "the audios are encrypted for privacy 🔒", sender: "sarah", type: "text" },
  { text: "use that code to unlock them", sender: "sarah", type: "text" },
  {
    text: "when I lived abroad… whoever spoke better English… was the one who stopped trying to be perfect.",
    sender: "sarah",
    type: "audio",
    audioDuration: "0:23",
    audioSrc: "/audio1.mp3",
  },
  { text: "that changed everything for me", sender: "sarah", type: "text" },
  { text: "English stopped being a subject", sender: "sarah", type: "text" },
  { text: "it became identity", sender: "sarah", type: "text" },
  { text: "here's another encrypted message 🔐", sender: "sarah", type: "text" },
  {
    text: "fluency isn't born in the head… it's born when you start existing in the language",
    sender: "sarah",
    type: "audio",
    audioDuration: "0:18",
    audioSrc: "/audio2.mp3",
  },
  { text: "I'm going to show you a video now", sender: "sarah", type: "text" },
  { text: "this is where everything starts to make sense", sender: "sarah", type: "text" },
  { text: "This video will open your mind.", sender: "sarah", type: "text" },
]

export default function LineChatRevelacao() {
  const router = useRouter()
  const [messages, setMessages] = useState<Message[]>([])
  const [isTyping, setIsTyping] = useState(false)
  const [showButton, setShowButton] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [currentTime, setCurrentTime] = useState("")
  const [playingAudioId, setPlayingAudioId] = useState<number | null>(null)
  const [isAudioPaused, setIsAudioPaused] = useState(false)
  const [audioProgress, setAudioProgress] = useState<{ [key: number]: number }>({})
  const [audioDurations, setAudioDurations] = useState<{ [key: number]: string }>({})
  const [waitingForAudio, setWaitingForAudio] = useState(false)
  const [showUnlockPopup, setShowUnlockPopup] = useState(false)
  const [unlockCode, setUnlockCode] = useState("")
  const [pendingAudioId, setPendingAudioId] = useState<number | null>(null)
  const [pendingAudioSrc, setPendingAudioSrc] = useState<string | null>(null)
  const [isUnlocked, setIsUnlocked] = useState(false)
  const [showError, setShowError] = useState(false)
  const chatRef = useRef<HTMLDivElement>(null)
  const messageIndexRef = useRef(0)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const shouldContinueRef = useRef(true)
  const isProcessingRef = useRef(false)

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
    return () => {
      clearTimeout(timer)
      shouldContinueRef.current = false
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current.src = ""
        audioRef.current = null
      }
    }
  }, [])

  const continueMessages = () => {
    if (!shouldContinueRef.current) return
    if (isProcessingRef.current) return

    isProcessingRef.current = true
    const index = messageIndexRef.current

    if (index >= conversationScript.length) {
      isProcessingRef.current = false
      setTimeout(() => setShowButton(true), 1000)
      return
    }

    setIsTyping(true)

    // Random delay between 1-2 seconds for message typing
    const typingDelay = conversationScript[index].type === "audio"
      ? 1000 + Math.random() * 1000  // 1-2 seconds for audio messages
      : 1000 + Math.random() * 1000  // 1-2 seconds for text messages

    setTimeout(() => {
      setIsTyping(false)

      const newMessage: Message = {
        ...conversationScript[index],
        id: index + 1,
        timestamp: new Date().toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
        }),
      }

      setMessages((prev) => [...prev, newMessage])
      messageIndexRef.current++

      if (conversationScript[index].type === "audio") {
        setWaitingForAudio(true)
        isProcessingRef.current = false
        setTimeout(() => {
          if (shouldContinueRef.current) {
            playAudio(index + 1, conversationScript[index].audioSrc!)
          }
        }, 100)
      } else {
        isProcessingRef.current = false
        setTimeout(continueMessages, 400)
      }
    }, typingDelay)
  }

  useEffect(() => {
    if (!isMounted) return

    const initialDelay = setTimeout(continueMessages, 1000)
    return () => {
      clearTimeout(initialDelay)
      shouldContinueRef.current = false
    }
  }, [isMounted])

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    const chatElement = chatRef.current
    if (!chatElement) return

    // Small delay to ensure DOM is updated
    const timeout = setTimeout(() => {
      chatElement.scrollTo({
        top: chatElement.scrollHeight,
        behavior: 'smooth'
      })
    }, 100)

    return () => clearTimeout(timeout)
  }, [messages, showButton])

  const formatAudioDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const pauseAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause()
      setIsAudioPaused(true)
    }
  }

  const playAudio = (messageId: number, audioSrc: string) => {
    // Check if audio is unlocked
    if (!isUnlocked) {
      // Don't open popup if it's already open
      if (showUnlockPopup) {
        isProcessingRef.current = false
        return
      }

      setPendingAudioId(messageId)
      setPendingAudioSrc(audioSrc)
      setShowUnlockPopup(true)
      // Keep isProcessingRef as false so the popup flow can handle continuation
      isProcessingRef.current = false
      return
    }

    // If clicking on same audio that's paused, resume it
    if (playingAudioId === messageId && audioRef.current && isAudioPaused) {
      audioRef.current.play().catch((error) => {
        console.error("Error playing audio:", error)
      })
      setIsAudioPaused(false)
      return
    }

    // Stop current audio if playing
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.removeEventListener("ended", () => {})
      audioRef.current.removeEventListener("timeupdate", () => {})
      audioRef.current.removeEventListener("loadedmetadata", () => {})
      audioRef.current.src = ""
      audioRef.current = null
    }

    const audio = new Audio(audioSrc)
    audioRef.current = audio
    setPlayingAudioId(messageId)
    setIsAudioPaused(false)

    // Get real audio duration when loaded
    audio.addEventListener("loadedmetadata", () => {
      if (audio.duration && !isNaN(audio.duration) && isFinite(audio.duration)) {
        setAudioDurations((prev) => ({
          ...prev,
          [messageId]: formatAudioDuration(audio.duration),
        }))
      }
    })

    audio.addEventListener("timeupdate", () => {
      const progress = (audio.currentTime / audio.duration) * 100
      setAudioProgress((prev) => ({ ...prev, [messageId]: progress }))
    })

    audio.addEventListener("ended", () => {
      setPlayingAudioId(null)
      setIsAudioPaused(false)
      setAudioProgress((prev) => ({ ...prev, [messageId]: 100 }))
      setWaitingForAudio(false)
      isProcessingRef.current = false
      setTimeout(continueMessages, 100)
    })

    audio.play().catch((error) => {
      console.error("Error playing audio:", error)
      setWaitingForAudio(false)
      isProcessingRef.current = false
      setTimeout(continueMessages, 200)
    })
  }

  const handleUnlockSubmit = () => {
    if (unlockCode === "9383") {
      // Store values before clearing state
      const audioId = pendingAudioId
      const audioSrc = pendingAudioSrc

      // Clear all popup state first
      setShowUnlockPopup(false)
      setShowError(false)
      setUnlockCode("")
      setPendingAudioId(null)
      setPendingAudioSrc(null)

      // Set unlocked flag
      setIsUnlocked(true)

      // Reset processing lock to allow continuation
      isProcessingRef.current = false

      // Play the pending audio after state is settled
      if (audioId && audioSrc) {
        setTimeout(() => {
          playAudio(audioId, audioSrc)
        }, 100)
      }
    } else {
      setShowError(true)
      setTimeout(() => setShowError(false), 2000)
    }
  }

  const handleCTA = () => {
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.src = ""
      audioRef.current = null
    }
    shouldContinueRef.current = false
    setIsTransitioning(true)
    setTimeout(() => router.push("/tiktok-4m"), 300)
  }

  return (
    <div
      className={`h-screen w-screen overflow-x-hidden bg-white transition-opacity duration-300 ${isMounted && !isTransitioning ? "opacity-100" : "opacity-0"
        }`}
      style={{
        fontFamily: '-apple-system, "Helvetica Neue", "Hiragino Sans", sans-serif',
      }}
    >
      <div className="w-full max-w-[375px] md:max-w-[414px] lg:max-w-[768px] mx-auto h-full flex flex-col">
        <header className="w-full bg-[#07b53b] sticky top-0 z-10">
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
              </div>
            </div>
          </div>

          <div className="h-[56px] flex items-center px-1 gap-2 md:gap-3">
            <button className="p-1 md:p-2" aria-label="Back">
              <ChevronLeft className="w-5 h-5 md:w-6 md:h-6 text-white" />
            </button>

            <div className="w-9 h-9 md:w-11 md:h-11 rounded-full overflow-hidden bg-white/20 border-2 border-white/30">
              <img src="/images/mulher.jpeg" alt="Sarah" className="w-full h-full object-cover" />
            </div>

            <div className="flex-1 ml-1">
              <h1 className="text-white font-bold text-sm md:text-base lg:text-[17px]">Sarah</h1>
              <p className="text-white/80 text-xs">{isTyping ? "typing..." : "Online"}</p>
            </div>

            <button className="p-1 md:p-2" aria-label="Voice call">
              <Phone className="w-4 h-4 md:w-5 md:h-5 text-white" />
            </button>
            <button className="p-1 md:p-2" aria-label="Video">
              <Video className="w-4 h-4 md:w-5 md:h-5 text-white" />
            </button>
            <button className="p-1 md:p-2" aria-label="More options">
              <MoreHorizontal className="w-4 h-4 md:w-5 md:h-5 text-white" />
            </button>
          </div>
        </header>

        <div
          ref={chatRef}
          className={`flex-1 px-3 md:px-4 py-3 md:py-4 space-y-2 md:space-y-3 relative overflow-y-auto overflow-x-hidden ${showButton ? 'pointer-events-none' : ''}`}
          style={{
            scrollBehavior: 'smooth',
            overscrollBehavior: 'none',
            WebkitOverflowScrolling: 'touch',
            maxHeight: 'calc(100vh - 81px)',
            backgroundColor: '#F5F5F5'
          }}
        >
          {messages.map((msg) => (
            <div key={msg.id} className="flex justify-start items-start gap-2">
              <div className="w-9 h-9 md:w-10 md:h-10 rounded-full overflow-hidden flex-shrink-0">
                <img src="/images/mulher.jpeg" alt="Sarah" className="w-full h-full object-cover" />
              </div>

              <div className="flex flex-col">
                <div
                  className={`max-w-[80%] md:max-w-[75%] px-3 py-2 md:px-4 md:py-3 ${msg.type === "audio" ? "min-w-[180px] md:min-w-[200px]" : ""}`}
                  style={{
                    backgroundColor: "#07b53b",
                    borderRadius: "18px",
                    color: "white",
                    boxShadow: "0 1px 2px rgba(0, 0, 0, 0.1)",
                  }}
                >
                  {msg.type === "text" ? (
                    msg.isCode ? (
                      <div className="flex flex-col items-center gap-1 py-2">
                        <p className="text-3xl md:text-4xl font-bold font-mono tracking-widest text-white">{msg.text}</p>
                        <p className="text-xs text-white/70">🔐 Access Code</p>
                      </div>
                    ) : (
                      <p className="text-sm md:text-[15px] text-white leading-[1.5]">{msg.text}</p>
                    )
                  ) : (
                    <div className="flex items-center gap-2 md:gap-3">
                      <button
                        onClick={() => {
                          // Prevent manual clicks if popup is open
                          if (showUnlockPopup) {
                            return
                          }

                          if (playingAudioId === msg.id && !isAudioPaused) {
                            // Pause the currently playing audio
                            pauseAudio()
                          } else if (msg.audioSrc) {
                            // Play or resume audio
                            playAudio(msg.id, msg.audioSrc)
                          }
                        }}
                        className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-white flex items-center justify-center flex-shrink-0"
                      >
                        {playingAudioId === msg.id && !isAudioPaused ? (
                          <Pause className="w-4 h-4 md:w-5 md:h-5 text-[#07b53b]" />
                        ) : (
                          <Play className="w-4 h-4 md:w-5 md:h-5 text-[#07b53b] ml-0.5" />
                        )}
                      </button>
                      <div className="flex-1">
                        <div className="h-1 md:h-1.5 bg-gray-300 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-[#07b53b] rounded-full transition-all duration-100"
                            style={{ width: `${audioProgress[msg.id] || 0}%` }}
                          />
                        </div>
                      </div>
                      <span className="text-xs text-gray-500 flex-shrink-0">
                        {audioDurations[msg.id] || msg.audioDuration || "0:00"}
                      </span>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-1 mt-1">
                  <span className="text-[10px] md:text-[11px] text-gray-500">{msg.timestamp}</span>
                </div>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex justify-start items-start gap-2">
              <div className="w-9 h-9 md:w-10 md:h-10 rounded-full overflow-hidden flex-shrink-0">
                <img src="/images/mulher.jpeg" alt="Sarah" className="w-full h-full object-cover" />
              </div>
              <div
                className="px-4 py-3 md:px-5 md:py-4"
                style={{
                  backgroundColor: "#EDEDED",
                  borderRadius: "18px",
                  boxShadow: "0 1px 2px rgba(0, 0, 0, 0.1)",
                }}
              >
                <div className="flex items-center gap-2">
                  <div className="flex gap-1 md:gap-1.5">
                    <div className="w-2 h-2 md:w-2.5 md:h-2.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                    <div
                      className="w-2 h-2 md:w-2.5 md:h-2.5 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: "150ms" }}
                    />
                    <div
                      className="w-2 h-2 md:w-2.5 md:h-2.5 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: "300ms" }}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {showButton && (
            <div className="flex justify-center pt-6 pb-2 animate-in fade-in duration-500 relative z-20">
              <button
                onClick={handleCTA}
                className="flex items-center gap-2 bg-gradient-to-r from-[#07b53b] to-[#00A550] text-white font-bold py-3 px-6 md:py-4 md:px-8 lg:py-5 lg:px-10 rounded-full shadow-2xl active:scale-95 transition-all duration-200 animate-pulse hover:animate-none hover:shadow-3xl text-sm md:text-base lg:text-lg pointer-events-auto"
              >
                <Play className="w-4 h-4 md:w-5 md:h-5 lg:w-6 lg:h-6" />
                Watch the method presentation
              </button>
            </div>
          )}
        </div>

        <div className="h-12 md:h-14 bg-white border-t flex items-center px-3 md:px-4 gap-2 md:gap-3 flex-shrink-0" style={{ borderColor: '#EDEDED' }}>
          <button className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-[#07b53b] flex items-center justify-center flex-shrink-0">
            <span className="text-white text-base md:text-xl font-bold leading-none">+</span>
          </button>
          <div className="flex-1 h-8 md:h-9 rounded-full px-3 md:px-4 flex items-center" style={{ backgroundColor: '#F5F5F5' }}>
            <span className="text-gray-400 text-xs md:text-sm">Message</span>
          </div>
          <button className="w-7 h-7 md:w-8 md:h-8 flex items-center justify-center flex-shrink-0">
            <span className="text-gray-500 text-base md:text-xl">😊</span>
          </button>
        </div>
      </div>

      {/* Unlock Popup */}
      {showUnlockPopup && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in duration-300"
          style={{
            backgroundColor: "rgba(0, 0, 0, 0.85)",
            backdropFilter: "blur(8px)",
          }}
        >
          <div
            className="w-full max-w-sm bg-gradient-to-br from-gray-900 via-gray-800 to-black rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in duration-300"
            style={{
              border: "1px solid rgba(7, 181, 59, 0.3)",
              boxShadow: "0 0 40px rgba(7, 181, 59, 0.2), 0 20px 60px rgba(0, 0, 0, 0.5)",
            }}
          >
            {/* Header */}
            <div className="relative px-6 pt-8 pb-6 text-center">
              <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-[#07b53b]/20 to-transparent" />
              <div className="relative">
                <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-[#07b53b] to-[#059631] flex items-center justify-center shadow-lg" style={{ boxShadow: "0 0 30px rgba(7, 181, 59, 0.4)" }}>
                  <span className="text-4xl">🔒</span>
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">Encrypted Audio</h2>
                <p className="text-gray-400 text-sm">Enter the access code to unlock</p>
              </div>
            </div>

            {/* Input Area */}
            <div className="px-6 pb-8">
              <div className="mb-6">
                <input
                  type="text"
                  value={unlockCode}
                  onChange={(e) => setUnlockCode(e.target.value.replace(/\D/g, "").slice(0, 4))}
                  onKeyPress={(e) => e.key === "Enter" && handleUnlockSubmit()}
                  placeholder="• • • •"
                  className="w-full px-6 py-4 text-center text-2xl font-mono tracking-widest rounded-2xl bg-gray-800/50 border-2 text-white placeholder-gray-600 focus:outline-none focus:border-[#07b53b] transition-all duration-300"
                  style={{
                    borderColor: showError ? "#ef4444" : "rgba(107, 114, 128, 0.3)",
                    boxShadow: showError ? "0 0 20px rgba(239, 68, 68, 0.3)" : "0 4px 12px rgba(0, 0, 0, 0.3)",
                  }}
                  maxLength={4}
                  autoFocus
                />
                {showError && (
                  <p className="text-red-400 text-sm text-center mt-3 animate-in slide-in-from-top duration-300">
                    ❌ Invalid code. Try again.
                  </p>
                )}
              </div>

              <button
                onClick={handleUnlockSubmit}
                className="w-full py-4 rounded-2xl font-bold text-white text-lg transition-all duration-300 active:scale-95"
                style={{
                  background: "linear-gradient(135deg, #07b53b 0%, #059631 100%)",
                  boxShadow: "0 8px 24px rgba(7, 181, 59, 0.3)",
                }}
              >
                🔓 Unlock Audio
              </button>

              <button
                onClick={() => {
                  setShowUnlockPopup(false)
                  setUnlockCode("")
                  setShowError(false)
                  setPendingAudioId(null)
                  setPendingAudioSrc(null)

                  if (audioRef.current) {
                    audioRef.current.pause()
                    audioRef.current.src = ""
                    audioRef.current = null
                  }

                  // Reset processing lock
                  isProcessingRef.current = false

                  // Only continue if we were waiting for audio in the automatic flow
                  if (waitingForAudio) {
                    setWaitingForAudio(false)
                    setTimeout(continueMessages, 100)
                  } else {
                    setWaitingForAudio(false)
                  }
                }}
                className="w-full mt-3 py-3 rounded-2xl font-medium text-gray-400 text-sm transition-all duration-300 hover:text-white hover:bg-gray-800/30"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
