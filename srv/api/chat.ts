import { Router } from 'express'
import { assertValid } from 'frisker'
import { store } from '../db'
import { generateResponse } from './adapter'
import { handle } from './handle'

const router = Router()

router.get(
  '/:id/chats',
  handle(async (req) => {
    const character = await store.characters.getCharacter(req.params.id)
    const list = await store.chats.listByCharacter(req.params.id)
    return { character, chats: list }
  })
)

router.get(
  '/:id',
  handle(async ({ params }) => {
    const id = params.id
    const chat = await store.chats.getChat(id)
    const character = await store.characters.getCharacter(chat.characterId)
    const messages = await store.chats.getMessages(id)
    return { chat, messages, character }
  })
)

router.put(
  '/:id',
  handle(async ({ params, body }) => {
    assertValid({ name: 'string' }, body)
    const id = params.id
    const chat = await store.chats.update(id, body.name)
    return chat
  })
)

router.post(
  '/',
  handle(async ({ body }) => {
    assertValid(
      {
        characterId: 'string',
        name: 'string',
        greeting: 'string',
        scenario: 'string',
        sampleChat: 'string',
      },
      body
    )
    const chat = await store.chats.create(body.characterId, body)
    return chat
  })
)

router.post('/:id/message', async ({ body, params }, res) => {
  const id = params.id
  assertValid({ message: 'string', history: 'any' }, body)

  const chat = await store.chats.getChat(id)
  const char = await store.characters.getCharacter(chat.characterId)

  const userMsg = await store.chats.createChatMessage(id, body.message)
  res.write(JSON.stringify(userMsg))

  const stream = await generateResponse('kobold', chat, char, body.message, body.history).catch(
    (err: Error) => err
  )

  if (stream instanceof Error) {
    res.status(500).send({ message: stream.message })
    return
  }

  let generated = ''

  for await (const msg of stream) {
    if (typeof msg !== 'string') {
      res.status(500)
      res.write(JSON.stringify(msg))
      res.send()
      return
    }

    generated += msg
    res.write(msg)
    res.write('\n\n')
    await wait(1.5)
  }

  const msg = await store.chats.createChatMessage(id, generated, chat.characterId)
  res.write(JSON.stringify(msg))
  res.end()
})

router.delete(
  '/:id/message',
  handle(async (req) => {
    const id = req.params.id
    await store.chats.deleteMessage(id)
    return { success: true }
  })
)

router.put(
  '/:id/message',
  handle(async ({ body, params }) => {
    assertValid({ message: 'string' }, body)
    const message = await store.chats.editMessage(params.id, body.message)
    return message
  })
)

export default router

function wait(secs = 1) {
  return new Promise((resolve) => setTimeout(resolve, secs * 1000))
}