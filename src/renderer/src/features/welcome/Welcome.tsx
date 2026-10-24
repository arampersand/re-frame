import { useState } from 'react'
import { rf } from '@/api'
import { Button } from '@/components/ui'
import icon from '../../../../../build/icon.png'

/** First launch: one button to connect the AI with the student's ChatGPT account. */
export function Welcome({ onDone }: { onDone: () => void }) {
  const [state, setState] = useState<'idle' | 'waiting' | 'error'>('idle')

  const connect = async () => {
    setState('waiting')
    await rf.codex.login()
    const s = await rf.codex.status()
    if (s.loggedIn) onDone()
    else setState('error')
  }

  return (
    <div className="drag flex h-full items-center justify-center bg-bg p-8">
      <div className="no-drag w-full max-w-md text-center">
        <img src={icon} alt="" className="mx-auto h-24 w-24" />
        <h1 className="mt-6 text-3xl font-bold tracking-tight">Welcome to MyBrainBook</h1>
        <p className="mt-3 text-muted">Your classes, PDFs and notes in one brain that answers back. Connect your ChatGPT account to turn it on.</p>
        <Button onClick={connect} disabled={state === 'waiting'} className="mt-8 w-full py-3 text-base">
          {state === 'waiting' ? 'Finish signing in in your browser…' : 'Connect with ChatGPT'}
        </Button>
        {state === 'error' && <p className="mt-3 text-sm text-gap">Sign-in didn't finish. Try again.</p>}
        <button onClick={onDone} className="mt-4 text-sm text-muted underline">Later</button>
        <p className="mt-10 text-xs text-muted">Your notes stay on this Mac in Documents/MyBrainBook. The AI reads them only when you ask.</p>
      </div>
    </div>
  )
}
