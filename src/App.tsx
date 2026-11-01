import { useEffect, useRef, useState } from 'react'

const email = 'hello@mainframe.co'
const intro = 'Every big adventure starts with courage. Ready to explore with Doraemon?'
const videoSource =
  './nobita.mp4'

function useTypewriter(text: string, speed = 38, startDelay = 600) {
  const [displayed, setDisplayed] = useState('')
  const [done, setDone] = useState(false)

  useEffect(() => {
    let position = 0
    let intervalId: number | undefined
    const delayId = window.setTimeout(() => {
      intervalId = window.setInterval(() => {
        position += 1
        setDisplayed(text.slice(0, position))
        if (position >= text.length) {
          window.clearInterval(intervalId)
          setDone(true)
        }
      }, speed)
    }, startDelay)

    return () => {
      window.clearTimeout(delayId)
      if (intervalId !== undefined) window.clearInterval(intervalId)
    }
  }, [speed, startDelay, text])

  return { displayed, done }
}

const navigation = [
  { label: 'Doraemon', href: '#labs' },
  { label: 'Magic Gadgets', href: '#studio' },
  { label: "Nobita's Friends", href: '#openings' },
  { label: 'Adventures', href: '#shop' },
]

function App() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const previousX = useRef<number | null>(null)
  const targetTime = useRef(0)
  const seekInFlight = useRef(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [pillsVisible, setPillsVisible] = useState(false)
  const { displayed, done } = useTypewriter(intro)

  useEffect(() => {
    const timer = window.setTimeout(() => setPillsVisible(true), 400)
    return () => window.clearTimeout(timer)
  }, [])

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const seekToTarget = () => {
      if (seekInFlight.current || !Number.isFinite(video.duration)) return
      if (Math.abs(video.currentTime - targetTime.current) < 0.015) return
      seekInFlight.current = true
      video.currentTime = targetTime.current
    }

    const handleMouseMove = (event: MouseEvent) => {
      const currentX = event.clientX
      if (previousX.current === null) {
        previousX.current = currentX
        return
      }

      const delta = currentX - previousX.current
      previousX.current = currentX
      if (!Number.isFinite(video.duration) || video.duration <= 0) return

      targetTime.current = Math.max(
        0,
        Math.min(
          video.duration,
          targetTime.current + (delta / window.innerWidth) * 0.8 * video.duration,
        ),
      )
      seekToTarget()
    }

    const handleSeeked = () => {
      seekInFlight.current = false
      seekToTarget()
    }

    const handleLoadedMetadata = () => {
      targetTime.current = video.currentTime
    }

    window.addEventListener('mousemove', handleMouseMove)
    video.addEventListener('seeked', handleSeeked)
    video.addEventListener('loadedmetadata', handleLoadedMetadata)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      video.removeEventListener('seeked', handleSeeked)
      video.removeEventListener('loadedmetadata', handleLoadedMetadata)
    }
  }, [])

  const handleCopyEmail = () => {
    void navigator.clipboard.writeText(email)
  }

  return (
    <>
      <video
        ref={videoRef}
        className="fixed inset-0 z-0 h-full w-full object-cover object-[70%_center]"
        src={videoSource}
        muted
        playsInline
        preload="auto"
        aria-hidden="true"
      />

      <div
        className={`fixed inset-0 z-[9] flex flex-col justify-center gap-8 bg-white/95 px-8 backdrop-blur-sm transition-opacity duration-300 md:hidden ${menuOpen ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'}`}
        aria-hidden={!menuOpen}
      >
        {navigation.map((item) => (
          <a
            key={item.label}
            href={item.href}
            className="text-[32px] font-medium text-black"
            tabIndex={menuOpen ? 0 : -1}
            onClick={() => setMenuOpen(false)}
          >
            {item.label}
          </a>
        ))}
        <a
          href={`mailto:${email}`}
          className="text-[32px] font-medium text-black underline underline-offset-4"
          tabIndex={menuOpen ? 0 : -1}
          onClick={() => setMenuOpen(false)}
        >
          Say hello
        </a>
      </div>

      <header className="fixed inset-x-0 top-0 z-10 flex items-center justify-between px-5 py-4 sm:px-8 sm:py-5">
        <a href="#home" className="flex items-center gap-3 text-black">
          <span className="font-[var(--font-heading)] text-[21px] tracking-tight sm:text-[26px]">
            Nobita
          </span>
          <span className="select-none text-[25px] leading-none tracking-[-0.02em] sm:text-[30px]">
            ✳︎
          </span>
        </a>

        <nav className="absolute left-1/2 hidden -translate-x-1/2 items-center text-[23px] text-black md:flex">
          {navigation.map((item, index) => (
            <span key={item.label} className="whitespace-pre">
              {index > 0 && ', '}
              <a href={item.href} className="transition-opacity hover:opacity-60">
                {item.label}
              </a>
            </span>
          ))}
        </nav>

        <a
          href={`mailto:${email}`}
          className="hidden text-[23px] text-black underline underline-offset-2 transition-opacity hover:opacity-60 md:block"
        >
          Get in touch
        </a>

        <button
          type="button"
          className="z-10 flex h-8 w-8 flex-col items-center justify-center gap-[5px] md:hidden"
          aria-label={menuOpen ? 'Close Nobita menu' : 'Open Nobita menu'}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span className={`h-[2px] w-6 bg-black transition-transform duration-300 ${menuOpen ? 'translate-y-[7px] rotate-45' : ''}`} />
          <span className={`h-[2px] w-6 bg-black transition-opacity duration-300 ${menuOpen ? 'opacity-0' : ''}`} />
          <span className={`h-[2px] w-6 bg-black transition-transform duration-300 ${menuOpen ? '-translate-y-[7px] -rotate-45' : ''}`} />
        </button>
      </header>

      <main id="home" className="relative z-[1] flex h-screen min-h-[560px] flex-col justify-end overflow-hidden px-5 pb-12 sm:px-8 md:justify-center md:px-10 md:pb-0">
        <div className="relative z-10 max-w-xl">
          <p className="pointer-events-none mb-5 select-none whitespace-pre-line text-[clamp(18px,4vw,26px)] font-normal leading-[1.3] text-black blur-[4px] sm:mb-6">
            Hi, I&apos;m Nobita,{ '\n' }A big dreamer ready for a new adventure
          </p>

          <p className="mb-5 min-h-[54px] text-[clamp(18px,4vw,26px)] font-normal leading-[1.35] text-black sm:mb-6">
            {displayed}
            {!done && <span className="ml-[2px] inline-block h-[1.1em] w-[2px] animate-[blink_1s_step-end_infinite] bg-black align-middle" />}
          </p>

          <div
            className={`flex flex-wrap gap-y-1 transition-[opacity,transform] duration-[400ms] ease-out ${pillsVisible ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0'}`}
          >
            {['Start an adventure', 'Find a gadget', 'Call Doraemon', 'Meet my friends'].map((label) => (
              <a
                key={label}
                href={`mailto:${email}`}
                className="mx-[0.2em] mb-[0.4em] inline-flex items-center justify-center whitespace-nowrap rounded-full border border-black/10 bg-white px-4 py-[0.3em] text-[13px] text-black transition-colors duration-200 hover:bg-black hover:text-white sm:px-5 sm:text-[15px]"
              >
                {label}
              </a>
            ))}
            <button
              type="button"
              onClick={handleCopyEmail}
              className="cursor-pointer mx-[0.2em] mb-[0.4em] inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full border border-black/10 bg-white px-4 py-[0.3em] text-[13px] text-black transition-colors duration-200 hover:bg-black hover:text-white sm:gap-3 sm:px-5 sm:text-[15px]"
              aria-label="Copy Nobita contact email"
            >
              <span>Say hello: <span className="underline underline-offset-1">{email}</span></span>
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                <rect x="3.5" y="1.5" width="7" height="8" rx="0.5" stroke="currentColor" />
                <path d="M8.5 10.5H2a.5.5 0 0 1-.5-.5V3.5" stroke="currentColor" />
              </svg>
            </button>
          </div>
        </div>
      </main>
    </>
  )
}

export default App
