"use client"

import { useState } from "react"
import { ChevronDown, Check, Star, Shield, Clock, Zap } from "lucide-react"
import Image from "next/image"

const faqs = [
  {
    question: "Does the method work for beginners?",
    answer:
      "Yes! The 4M System was created for any level. The focus is transforming your relationship with the language, not memorizing rules.",
  },
  {
    question: "How much time do I need to dedicate per day?",
    answer:
      "The method integrates into your routine. It's not about studying for hours, it's about living moments in English.",
  },
  {
    question: "How long do I have access for?",
    answer: "Lifetime access. The content is yours forever, including all future updates.",
  },
  {
    question: "What if it doesn't work for me?",
    answer: "7-day guarantee. If it doesn't make sense for you, we refund 100% of the value.",
  },
]

const benefits = [
  "Access to the complete 4M System",
  "Exclusive Discord community",
  "Weekly lives with Daniel",
  "Daily immersion materials",
  "Certificate of completion",
  "Lifetime updates",
]

export default function SalesPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  return (
    <div className="h-screen w-screen overflow-x-hidden bg-gradient-to-b from-[#0a0a0a] to-[#1a1a1a]">
      <div className="w-full max-w-[375px] md:max-w-[414px] lg:max-w-[768px] mx-auto px-4 md:px-6 lg:px-8 py-8 md:py-12">
        {/* Hero Section */}
        <section className="text-center mb-12 md:mb-16">
          <div className="inline-flex items-center gap-2 bg-[#34C759]/10 text-[#34C759] px-3 py-1 md:px-4 md:py-2 rounded-full text-xs md:text-sm font-medium mb-4 md:mb-6">
            <Zap className="w-3 h-3 md:w-4 md:h-4" />
            Limited spots
          </div>

          <h1 className="text-white text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold mb-3 md:mb-4 leading-tight">下班後的國際人生</h1>
          <p className="text-[#a0a0a0] text-base md:text-lg lg:text-xl mb-2">The International Life After Work</p>
          <p className="text-[#667781] text-sm md:text-base max-w-md mx-auto">Stop studying English. Start existing in it.</p>
        </section>

        <section className="mb-12 md:mb-16">
          <div className="bg-[#1c1c1e] rounded-2xl p-4 md:p-6">
            <h2 className="text-white text-lg md:text-xl font-bold mb-3 md:mb-4">Have you ever felt like this?</h2>
            <ul className="space-y-2 md:space-y-3">
              {[
                "Studied for years and still freeze in conversations",
                "Know grammar but can't express yourself",
                "Afraid of looking ridiculous when speaking",
                "Feel like English is a barrier, not a bridge",
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-[#e0e0e0] text-sm md:text-base">
                  <span className="text-[#FF3B30] mt-1">✕</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="mb-12 md:mb-16 text-center">
          <h2 className="text-white text-xl md:text-2xl font-bold mb-3 md:mb-4">The problem isn't you.</h2>
          <p className="text-[#a0a0a0] text-base md:text-lg mb-4 md:mb-6">It's the method they taught you.</p>
          <p className="text-[#667781] leading-relaxed text-sm md:text-base">
            Fluency isn't born in the head. It's born when you start to{" "}
            <span className="text-[#34C759] font-semibold">exist</span> in the language.
          </p>
        </section>

        <section className="mb-12 md:mb-16">
          <h2 className="text-white text-xl md:text-2xl font-bold text-center mb-6 md:mb-8">The 4M System</h2>

          <div className="grid md:grid-cols-2 gap-3 md:gap-4">
            {[
              { m: "M1", title: "Mindset", desc: "Reprogram your relationship with the language" },
              { m: "M2", title: "Meaning", desc: "Connect words to real experiences" },
              { m: "M3", title: "Context", desc: "Learn through situations, not rules" },
              { m: "M4", title: "Momentum", desc: "Create consistency without effort" },
            ].map((item, i) => (
              <div key={i} className="bg-[#1c1c1e] rounded-xl p-4 md:p-5 flex items-center gap-3 md:gap-4">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-gradient-to-br from-[#34C759] to-[#30D158] flex items-center justify-center text-white font-bold text-sm md:text-base">
                  {item.m}
                </div>
                <div>
                  <h3 className="text-white font-semibold text-sm md:text-base">{item.title}</h3>
                  <p className="text-[#a0a0a0] text-xs md:text-sm">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-12 md:mb-16">
          <div className="flex items-center justify-center gap-1 mb-3 md:mb-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <Star key={i} className="w-4 h-4 md:w-5 md:h-5 fill-[#FFD700] text-[#FFD700]" />
            ))}
          </div>
          <p className="text-center text-white font-semibold mb-2 text-sm md:text-base">4.9/5 rating</p>
          <p className="text-center text-[#667781] text-xs md:text-sm">Based on 847 reviews</p>

          <div className="flex justify-center gap-3 md:gap-4 mt-4 md:mt-6">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="w-8 h-8 md:w-10 md:h-10 rounded-full overflow-hidden border-2 border-[#1c1c1e] -ml-2 first:ml-0"
              >
                <Image
                  src={`/professional-person-headshot-.jpg?height=40&width=40&query=professional person headshot ${i}`}
                  alt="Student"
                  width={40}
                  height={40}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
            <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-[#34C759] flex items-center justify-center text-white text-xs font-bold -ml-2">
              +2.4k
            </div>
          </div>
        </section>

        <section className="mb-12 md:mb-16">
          <div className="bg-gradient-to-b from-[#1c1c1e] to-[#252525] rounded-2xl p-4 md:p-6 border border-[#34C759]/20">
            <div className="text-center mb-4 md:mb-6">
              <div className="inline-block bg-[#FF3B30] text-white text-xs md:text-sm font-bold px-3 py-1 md:px-4 rounded-full mb-3 md:mb-4">
                OFERTA
              </div>
              <p className="text-[#a0a0a0] text-xs md:text-sm line-through mb-1">Real value: US$228</p>
              <div className="flex items-center justify-center gap-2">
                <span className="text-[#667781] text-base md:text-lg">Today:</span>
                <span className="text-white text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold">US$148</span>
              </div>
              <p className="text-[#34C759] text-xs md:text-sm font-medium mt-2 md:mt-3">7-day full guarantee</p>
            </div>

            <ul className="space-y-2 md:space-y-3 mb-4 md:mb-6">
              {benefits.map((benefit, i) => (
                <li key={i} className="flex items-center gap-3 text-[#e0e0e0] text-sm md:text-base">
                  <Check className="w-4 h-4 md:w-5 md:h-5 text-[#34C759] flex-shrink-0" />
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>

            <button className="w-full bg-gradient-to-r from-[#34C759] to-[#30D158] text-white font-bold py-3 md:py-4 lg:py-5 px-4 md:px-6 rounded-full shadow-lg shadow-[#34C759]/25 active:scale-95 transition-transform mb-3 md:mb-4 text-sm md:text-base lg:text-lg">
              I want to live my life internationally.
            </button>

            <div className="flex items-center justify-center gap-3 md:gap-4 text-[#667781] text-xs">
              <div className="flex items-center gap-1">
                <Shield className="w-3 h-3 md:w-4 md:h-4" />
                <span>Secure purchase</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-3 h-3 md:w-4 md:h-4" />
                <span>7-day guarantee</span>
              </div>
            </div>
          </div>
        </section>

        <section className="mb-12 md:mb-16">
          <h2 className="text-white text-xl md:text-2xl font-bold text-center mb-6 md:mb-8">Frequently Asked Questions</h2>

          <div className="space-y-2 md:space-y-3">
            {faqs.map((faq, i) => (
              <div key={i} className="bg-[#1c1c1e] rounded-xl overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between p-4 md:p-5 text-left"
                >
                  <span className="text-white font-medium pr-4 text-sm md:text-base">{faq.question}</span>
                  <ChevronDown
                    className={`w-4 h-4 md:w-5 md:h-5 text-[#a0a0a0] flex-shrink-0 transition-transform ${openFaq === i ? "rotate-180" : ""
                      }`}
                  />
                </button>

                {openFaq === i && (
                  <div className="px-4 md:px-5 pb-4 md:pb-5">
                    <p className="text-[#a0a0a0] leading-relaxed text-sm md:text-base">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        <section className="text-center pb-6 md:pb-8">
          <h2 className="text-white text-lg md:text-xl font-bold mb-3 md:mb-4">Ready to exist in English?</h2>

          <button className="w-full bg-gradient-to-r from-[#34C759] to-[#30D158] text-white font-bold py-3 md:py-4 lg:py-5 px-4 md:px-6 rounded-full shadow-lg shadow-[#34C759]/25 active:scale-95 transition-transform mb-3 md:mb-4 text-sm md:text-base lg:text-lg">
            I want to live my life internationally.
          </button>

          <p className="text-[#48484a] text-xs">Immediate access after payment confirmation</p>
        </section>
      </div>
    </div>
  )
}
