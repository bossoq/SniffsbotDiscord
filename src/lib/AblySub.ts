import Ably from 'ably/promises'
import { ablyKey } from '../config.json'
import type { Types } from 'ably'

const ably = new Ably.Realtime(ablyKey)

export const subMessage = (
  channelName: string,
  callbackonMessage: CallableFunction
): Types.RealtimeChannelPromise => {
  const channel: Types.RealtimeChannelPromise = ably.channels.get(channelName)

  channel.subscribe((msg: Types.Message) => {
    callbackonMessage(msg)
  })

  process.on('beforeExit', () => {
    channel.unsubscribe()
  })

  return channel
}
