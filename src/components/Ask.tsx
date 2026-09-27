import { useEffect, useRef, useState } from 'react'
import { answerAsk } from '../ask'
import { uid } from '../format'
import type { LatLng, Order, Place } from '../types'

type Msg = {
  id: string
  from: 'sat' | 'you'
  text: string
  places?: { id: string; name: string }[]
}

const starters = ['What’s on this road?', 'Where can I find wine?', 'How do I request something?']

export function Ask({
  places,
  here,
  route,
  dest,
  focusId,
  orders,
  signedIn,
  onOpenPlace,
}: {
  places: Place[]
  here: LatLng
  route: LatLng[]
  dest?: string
  focusId?: string | null
  orders: Order[]
  signedIn: boolean
  onOpenPlace: (id: string) => void
}) {
  const [open, setOpen] = useState(false)
  const [text, setText] = useState('')
  const [pending, setPending] = useState(false)
  const [messages, setMessages] = useState<Msg[]>([
    {
      id: 'hello',
      from: 'sat',
      text: 'Ask about a place, a price, or what is on your road.',
    },
  ])
  const logRef = useRef<HTMLDivElement>(null)
  const wait = useRef<number | null>(null)

  useEffect(() => {
    const node = logRef.current
    if (node) node.scrollTop = node.scrollHeight
  }, [messages, open, pending])

  useEffect(() => {
    return () => {
      if (wait.current) window.clearTimeout(wait.current)
    }
  }, [])

  function send(raw: string) {
    const question = raw.trim()
    if (!question || pending) return
    setMessages((prev) => [...prev, { id: uid('you'), from: 'you', text: question }])
    setText('')
    setPending(true)
    if (wait.current) window.clearTimeout(wait.current)
    wait.current = window.setTimeout(() => {
      const reply = answerAsk({ question, places, here, route, dest, focusId, orders, signedIn })
      setMessages((prev) => [...prev, { id: uid('sat'), from: 'sat', text: reply.text, places: reply.places }])
      setPending(false)
      wait.current = null
    }, 280)
  }

  return (
    <>
      {!open && (
        <button type="button" className="ask-launch" aria-label="Ask" onClick={() => setOpen(true)}>
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path
              fill="currentColor"
              d="M5 4.2h14a2.2 2.2 0 0 1 2.2 2.2v7.4A2.2 2.2 0 0 1 19 16h-7.2L6.2 20.2V16H5a2.2 2.2 0 0 1-2.2-2.2V6.4A2.2 2.2 0 0 1 5 4.2z"
            />
          </svg>
        </button>
      )}
      {open && (
        <section className="chat glass" role="dialog" aria-label="Ask">
          <header className="chat-top">
            <div>
              <p className="role-kicker">For buyers</p>
              <h2>Ask</h2>
            </div>
            <button type="button" className="text-btn" onClick={() => setOpen(false)}>
              Close
            </button>
          </header>
          <div className="chat-log" ref={logRef}>
            {messages.map((message) => (
              <div key={message.id} className={message.from === 'you' ? 'bubble you' : 'bubble sat'}>
                <p>{message.text}</p>
                {message.places && message.places.length > 0 && (
                  <div className="chat-places">
                    {message.places.map((place) => (
                      <button
                        key={place.id}
                        type="button"
                        onClick={() => {
                          onOpenPlace(place.id)
                          setOpen(false)
                        }}
                      >
                        {place.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
            {pending && <p className="muted chat-wait">Looking…</p>}
          </div>
          {messages.length < 3 && (
            <div className="chat-starters">
              {starters.map((prompt) => (
                <button key={prompt} type="button" className="chip" onClick={() => send(prompt)}>
                  {prompt}
                </button>
              ))}
            </div>
          )}
          <form
            className="chat-form"
            onSubmit={(event) => {
              event.preventDefault()
              send(text)
            }}
          >
            <label className="sr" htmlFor="ask-input">
              Your question
            </label>
            <input
              id="ask-input"
              value={text}
              placeholder="Ask about a place or a price"
              autoComplete="off"
              onChange={(event) => setText(event.target.value)}
            />
            <button type="submit" className="btn btn-primary" disabled={!text.trim() || pending}>
              Send
            </button>
          </form>
        </section>
      )}
    </>
  )
}
