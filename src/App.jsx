import { useMemo, useState } from 'react'
import './App.css'
import { CallSummary } from './components/CallSummary'
import { CopilotPanel } from './components/CopilotPanel'
import { Sidebar } from './components/Sidebar'
import { TopBar } from './components/TopBar'
import { Transcript } from './components/Transcript'
import { useVoiceAssistant } from './hooks/useVoiceAssistant'
import { getAIResponse } from './services/aiService'
import { translations } from './services/translations'

function makeMessage(role, text) {
  return { id: crypto.randomUUID(), role, text }
}

const openingMessage = 'HUMO kartamdan men qilmagan to‘lov yechildi. Juda xavotirdaman.'

function App() {
  const [language, setLanguage] = useState('uz')
  const [theme, setTheme] = useState('light')
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState([makeMessage('customer', openingMessage)])
  const [aiResult, setAiResult] = useState(() => getAIResponse(openingMessage, 'uz'))
  const [isThinking, setIsThinking] = useState(false)

  const labels = translations[language]
  const voiceLabels = useMemo(
    () => ({
      ready: labels.ready,
      listening: labels.listening,
      thinking: labels.thinking,
      speaking: labels.speaking,
      voiceUnsupported: labels.voiceUnsupported,
    }),
    [labels],
  )
  const { voiceStatus, voiceError, speak, listen, setVoiceStatus } = useVoiceAssistant(language, voiceLabels)

  function switchLanguage(nextLanguage) {
    setLanguage(nextLanguage)
    const lastCustomer = [...messages].reverse().find((message) => message.role === 'customer')
    setAiResult(getAIResponse(lastCustomer?.text || openingMessage, nextLanguage))
  }

  function playMessageSound() {
    try {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext
      const audioContext = new AudioContextClass()
      const oscillator = audioContext.createOscillator()
      const gain = audioContext.createGain()
      oscillator.frequency.value = 620
      gain.gain.value = 0.025
      oscillator.connect(gain)
      gain.connect(audioContext.destination)
      oscillator.start()
      oscillator.stop(audioContext.currentTime + 0.08)
    } catch {
      // Sound is a small enhancement; unsupported browsers can ignore it.
    }
  }

  function analyzeMessage(message) {
    setMessages((current) => [...current, makeMessage('customer', message)])
    setInput('')
    setIsThinking(true)
    setVoiceStatus(labels.thinking)

    window.setTimeout(() => {
      const result = getAIResponse(message, language)
      setAiResult(result)
      setIsThinking(false)
      setVoiceStatus(labels.ready)
      playMessageSound()
      speak(result.response)
    }, 1200 + Math.random() * 700)
  }

  function handleAnalyze(event) {
    event.preventDefault()
    const clean = input.trim()
    if (clean && !isThinking) analyzeMessage(clean)
  }

  function useResponse() {
    if (!aiResult.response || isThinking) return
    setMessages((current) => [...current, makeMessage('ai', aiResult.response)])
    playMessageSound()
  }

  function addSystemMessage(text) {
    setMessages((current) => [...current, makeMessage('system', text)])
    playMessageSound()
  }

  return (
    <main className={`bank-shell ${theme}`}>
      <Sidebar labels={labels} />
      <section className="workspace">
        <TopBar
          labels={labels}
          language={language}
          onLanguageChange={switchLanguage}
          theme={theme}
          onThemeChange={() => setTheme((current) => (current === 'dark' ? 'light' : 'dark'))}
        />
        <section className="dashboard-grid">
          <CallSummary labels={labels} result={aiResult} />
          <Transcript
            labels={labels}
            messages={messages}
            input={input}
            setInput={setInput}
            onAnalyze={handleAnalyze}
            isThinking={isThinking}
            quickPrompts={labels.quickPrompts}
            onPrompt={setInput}
            onMic={() => listen((transcript) => analyzeMessage(transcript))}
            voiceStatus={voiceStatus}
          />
          <CopilotPanel
            labels={labels}
            result={aiResult}
            onUseResponse={useResponse}
            onLockCard={() => addSystemMessage(labels.systemMessages.cardLocked)}
            onOpenDispute={() => addSystemMessage(labels.systemMessages.disputeOpened)}
            isThinking={isThinking}
          />
        </section>
        {voiceError && <div className="toast">{voiceError}</div>}
      </section>
    </main>
  )
}

export default App
