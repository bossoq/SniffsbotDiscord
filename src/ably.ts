import { subMessage } from './lib/AblySub'
import {
  preparedLiveNotify,
  preparedCoinFlip,
  preparedLottoBuy,
  preparedLottoDraw,
  preparedRaffleBuy,
  preparedRaffleDraw
} from './lib/PreparedMessage'
import { sendMessage } from './app'
import { announceChannel, allowChannel } from './config.json'
import type { Types } from 'ably'

export const ablyMessage = () => {
  subMessage('webfeed', async (message: Types.Message) => {
    switch (message.name) {
      case 'livemessage':
        await sendMessage(
          announceChannel,
          preparedLiveNotify(JSON.parse(message.data))
        )
        break
      case 'coinflip':
        await sendMessage(
          allowChannel,
          preparedCoinFlip(JSON.parse(message.data))
        )
        break
      case 'lottobuy':
        await sendMessage(
          allowChannel,
          preparedLottoBuy(JSON.parse(message.data))
        )
        break
      case 'lottodraw':
        await sendMessage(
          allowChannel,
          preparedLottoDraw(JSON.parse(message.data))
        )
        break
      case 'rafflebuy':
        await sendMessage(
          allowChannel,
          preparedRaffleBuy(JSON.parse(message.data))
        )
        break
      case 'raffledraw':
        await sendMessage(
          allowChannel,
          preparedRaffleDraw(JSON.parse(message.data))
        )
        break
      default:
        break
    }
  })
}
