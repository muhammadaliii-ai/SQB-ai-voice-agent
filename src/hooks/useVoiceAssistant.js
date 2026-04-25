import { useRef, useState } from 'react'

function getRecognitionApi() {
  return window.SpeechRecognition || window.webkitSpeechRecognition
}

function speechLang(language) {
  if (language === 'ru') return 'ru-RU'
  if (language === 'en') return 'en-US'
  return 'uz-UZ'
}

export function useVoiceAssistant(language, labels) {
  const [voiceStatus, setVoiceStatus] = useState(labels.ready)
  const [voiceError, setVoiceError] = useState('')
  const recognitionRef = useRef(null)

  function speak(text) {
    if (!text) return
    setVoiceError('')
    setVoiceStatus(labels.speaking)

    if (!('speechSynthesis' in window)) {
      setVoiceError('TTS unavailable')
      setVoiceStatus(labels.ready)
      return
    }

    window.speechSynthesis.cancel()
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = speechLang(language)
    utterance.rate = 0.96
    utterance.pitch = 1
    utterance.onend = () => setVoiceStatus(labels.ready)
    utterance.onerror = () => {
      setVoiceError('TTS unavailable')
      setVoiceStatus(labels.ready)
    }
    window.speechSynthesis.speak(utterance)
  }

  function listen(onResult) {
    const RecognitionApi = getRecognitionApi()
    setVoiceError('')

    if (!RecognitionApi) {
      setVoiceError(labels.voiceUnsupported)
      return
    }

    if (recognitionRef.current) recognitionRef.current.stop()

    const recognition = new RecognitionApi()
    recognitionRef.current = recognition
    recognition.lang = speechLang(language)
    recognition.interimResults = false
    recognition.maxAlternatives = 1
    setVoiceStatus(labels.listening)

    recognition.onresult = (event) => {
      const transcript = event.results[0]?.[0]?.transcript || ''
      if (transcript) onResult(transcript)
    }
    recognition.onerror = () => {
      setVoiceError(labels.voiceUnsupported)
      setVoiceStatus(labels.ready)
    }
    recognition.onend = () => setVoiceStatus((current) => (current === labels.listening ? labels.ready : current))
    recognition.start()
  }

  return { voiceStatus, voiceError, speak, listen, setVoiceStatus }
}
