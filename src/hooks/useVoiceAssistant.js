import { useCallback, useRef, useState } from 'react'

function speechLang(lang) {
  if (lang === 'ru') return 'ru-RU'
  if (lang === 'en') return 'en-US'
  return 'uz-UZ'
}

const statusText = {
  uz: {
    ready: 'Tayyor',
    listening: 'Tinglanmoqda...',
    recorded: 'Ovoz yozib olindi. Brauzer transkripsiyani qo‘llamadi.',
    unsupported: 'Brauzer transkripsiyani qo‘llamadi, audio yozuv fallback ishladi.',
    denied: 'Mikrofonga ruxsat berilmadi.',
    speaking: 'Javob o‘qilmoqda...',
    failed: 'Ovoz tizimi ishlamadi.',
  },
  ru: {
    ready: 'Готово',
    listening: 'Слушаю...',
    recorded: 'Голос записан. Браузер не поддержал транскрипцию.',
    unsupported: 'Браузер не поддержал транскрипцию, сработала резервная аудиозапись.',
    denied: 'Нет доступа к микрофону.',
    speaking: 'Озвучиваю ответ...',
    failed: 'Голосовая система недоступна.',
  },
  en: {
    ready: 'Ready',
    listening: 'Listening...',
    recorded: 'Voice recorded. Browser transcription was not available.',
    unsupported: 'Browser transcription was unavailable; fallback audio recording captured.',
    denied: 'Microphone permission was denied.',
    speaking: 'Speaking response...',
    failed: 'Voice system is unavailable.',
  },
}

export function useVoiceAssistant(lang) {
  const [voiceStatus, setVoiceStatus] = useState(statusText[lang]?.ready || 'Ready')
  const [recordingUrl, setRecordingUrl] = useState('')
  const recognitionRef = useRef(null)
  const mediaRecorderRef = useRef(null)

  async function startRecorderFallback(onTranscript, onComplete) {
    const copy = statusText[lang] || statusText.en

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const chunks = []
      const recorder = new MediaRecorder(stream)
      mediaRecorderRef.current = recorder

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) chunks.push(event.data)
      }
      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: recorder.mimeType || 'audio/webm' })
        const url = URL.createObjectURL(blob)
        setRecordingUrl(url)
        setVoiceStatus(copy.recorded)
        stream.getTracks().forEach((track) => track.stop())
        const transcript = copy.unsupported
        onTranscript(transcript)
        onComplete?.(transcript)
      }

      setVoiceStatus(copy.listening)
      recorder.start()
      window.setTimeout(() => {
        if (recorder.state === 'recording') recorder.stop()
      }, 4200)
    } catch {
      setVoiceStatus(copy.denied)
    }
  }

  function startVoiceInput(onTranscript, onComplete) {
    const copy = statusText[lang] || statusText.en

    try {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition

      if (!SpeechRecognition) {
        startRecorderFallback(onTranscript, onComplete)
        return
      }

      if (recognitionRef.current) recognitionRef.current.stop()

      const recognition = new SpeechRecognition()
      recognitionRef.current = recognition
      recognition.lang = speechLang(lang)
      recognition.interimResults = true
      recognition.continuous = false
      recognition.maxAlternatives = 1
      setVoiceStatus(copy.listening)

      let finalTranscript = ''

      recognition.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map((result) => result[0]?.transcript || '')
          .join(' ')
          .trim()
        if (transcript) {
          finalTranscript = transcript
          onTranscript(transcript)
        }
      }
      recognition.onerror = () => {
        startRecorderFallback(onTranscript, onComplete)
      }
      recognition.onend = () => {
        setVoiceStatus(copy.ready)
        if (finalTranscript) onComplete?.(finalTranscript)
      }
      recognition.start()
    } catch {
      startRecorderFallback(onTranscript, onComplete)
    }
  }

  const speakAnswer = useCallback((aiAnswer) => {
    const copy = statusText[lang] || statusText.en

    try {
      if (!('speechSynthesis' in window) || !aiAnswer) {
        setVoiceStatus(copy.failed)
        return
      }

      window.speechSynthesis.cancel()
      const utterance = new SpeechSynthesisUtterance(aiAnswer)
      utterance.lang = speechLang(lang)

      const voices = window.speechSynthesis.getVoices()
      const targetVoice = voices.find((voice) => voice.lang === utterance.lang || voice.lang.startsWith(lang))
      if (targetVoice) utterance.voice = targetVoice

      utterance.onstart = () => setVoiceStatus(copy.speaking)
      utterance.onend = () => setVoiceStatus(copy.ready)
      utterance.onerror = () => setVoiceStatus(copy.failed)
      window.speechSynthesis.speak(utterance)
    } catch {
      setVoiceStatus(copy.failed)
    }
  }, [lang])

  return { voiceStatus, setVoiceStatus, recordingUrl, startVoiceInput, speakAnswer }
}
