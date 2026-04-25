import { useRef, useState } from 'react'

function speechLang(lang) {
  if (lang === 'ru') return 'ru-RU'
  if (lang === 'en') return 'en-US'
  return 'uz-UZ'
}

export function useVoiceAssistant(lang) {
  const [voiceStatus, setVoiceStatus] = useState('Ready')
  const recognitionRef = useRef(null)

  function startVoiceInput(onTranscript) {
    try {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition

      if (!SpeechRecognition) {
        setVoiceStatus('Voice input is not supported in this browser. Please type instead.')
        return
      }

      if (recognitionRef.current) {
        recognitionRef.current.stop()
      }

      const recognition = new SpeechRecognition()
      recognitionRef.current = recognition
      recognition.lang = speechLang(lang)
      recognition.interimResults = false
      recognition.maxAlternatives = 1
      setVoiceStatus('Listening...')

      recognition.onresult = (event) => {
        const transcript = event.results?.[0]?.[0]?.transcript || ''
        if (transcript) onTranscript(transcript)
      }
      recognition.onerror = () => {
        setVoiceStatus('Voice input is not supported in this browser. Please type instead.')
      }
      recognition.onend = () => {
        setVoiceStatus((current) => (current === 'Listening...' ? 'Ready' : current))
      }
      recognition.start()
    } catch {
      setVoiceStatus('Voice input is not supported in this browser. Please type instead.')
    }
  }

  function speakAnswer(aiAnswer) {
    try {
      if (!('speechSynthesis' in window) || !aiAnswer) {
        setVoiceStatus('Voice output is not available. Please read the answer on screen.')
        return
      }

      window.speechSynthesis.cancel()
      const utterance = new SpeechSynthesisUtterance(aiAnswer)
      utterance.lang = speechLang(lang)

      const voices = window.speechSynthesis.getVoices()
      const targetVoice = voices.find((voice) => voice.lang === utterance.lang)
      if (targetVoice) {
        utterance.voice = targetVoice
      }

      utterance.onstart = () => setVoiceStatus('Speaking...')
      utterance.onend = () => setVoiceStatus('Ready')
      utterance.onerror = () => setVoiceStatus('Voice output failed. Please read the answer on screen.')
      window.speechSynthesis.speak(utterance)
    } catch {
      setVoiceStatus('Voice output failed. Please read the answer on screen.')
    }
  }

  return { voiceStatus, setVoiceStatus, startVoiceInput, speakAnswer }
}
