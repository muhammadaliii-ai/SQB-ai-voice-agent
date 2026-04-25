import express from 'express'
import { existsSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'

const app = express()
const port = Number(process.env.PORT ?? 3001)
const defaultVoiceId = '21m00Tcm4TlvDq8ikWAM'

loadLocalEnv()

app.use(express.json({ limit: '64kb' }))

app.get('/api/health', (_request, response) => {
  response.json({ ok: true })
})

app.post('/api/speak', async (request, response) => {
  const { text, lang } = request.body ?? {}
  const apiKey = process.env.ELEVENLABS_API_KEY
  const voiceId = process.env.ELEVENLABS_VOICE_ID || defaultVoiceId

  if (!apiKey) {
    return response.status(500).json({ error: 'ELEVENLABS_API_KEY is not configured on the backend.' })
  }

  if (typeof text !== 'string' || text.trim().length === 0) {
    return response.status(400).json({ error: 'Text is required.' })
  }

  try {
    const elevenLabsResponse = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
      method: 'POST',
      headers: {
        Accept: 'audio/mpeg',
        'Content-Type': 'application/json',
        'xi-api-key': apiKey,
      },
      body: JSON.stringify({
        text: text.trim(),
        model_id: 'eleven_multilingual_v2',
        voice_settings: {
          stability: 0.48,
          similarity_boost: 0.78,
          style: lang === 'ru' ? 0.18 : 0.08,
          use_speaker_boost: true,
        },
      }),
    })

    if (!elevenLabsResponse.ok) {
      const errorText = await elevenLabsResponse.text()
      return response.status(elevenLabsResponse.status).json({
        error: 'ElevenLabs TTS request failed.',
        detail: errorText.slice(0, 500),
      })
    }

    const audioBuffer = Buffer.from(await elevenLabsResponse.arrayBuffer())
    response.setHeader('Content-Type', 'audio/mpeg')
    response.setHeader('Cache-Control', 'no-store')
    return response.send(audioBuffer)
  } catch (error) {
    return response.status(500).json({
      error: 'Unable to generate ElevenLabs audio.',
      detail: error instanceof Error ? error.message : 'Unknown error',
    })
  }
})

app.listen(port, () => {
  console.log(`SQB AI Voice Agent backend listening on http://localhost:${port}`)
})

function loadLocalEnv() {
  const envPath = resolve(process.cwd(), '.env')

  if (!existsSync(envPath)) return

  const rows = readFileSync(envPath, 'utf8').split(/\r?\n/)
  for (const row of rows) {
    const trimmed = row.trim()
    if (!trimmed || trimmed.startsWith('#')) continue

    const separatorIndex = trimmed.indexOf('=')
    if (separatorIndex === -1) continue

    const key = trimmed.slice(0, separatorIndex).trim()
    const rawValue = trimmed.slice(separatorIndex + 1).trim()
    const value = rawValue.replace(/^["']|["']$/g, '')

    if (key && process.env[key] === undefined) {
      process.env[key] = value
    }
  }
}
