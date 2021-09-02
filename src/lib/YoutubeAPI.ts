import { google, youtube_v3 } from 'googleapis'

export type VideosMeta = {
  id: string | null | undefined
  title: string | null | undefined
  description: string | null | undefined
  thumbnail: string | null | undefined
  live: string | null | undefined
  publishTime: Date
  channelId: string | null | undefined
  channelTitle: string | null | undefined
}

const callVideoAPI = async (
  youtubeToken: string,
  youtubeChannelId: string,
  pageToken: string | undefined = undefined
): Promise<youtube_v3.Schema$SearchListResponse | undefined> => {
  const service = google.youtube('v3').search
  try {
    const response = await service.list({
      key: youtubeToken,
      channelId: youtubeChannelId,
      part: ['snippet', 'id'],
      order: 'date',
      maxResults: 50,
      pageToken: pageToken
    })
    if (response.data) {
      return response.data
    } else {
      console.log('There is no result from API')
      return
    }
  } catch (err: unknown) {
    console.error(`The API returned an error: ${err}`)
    return
  }
}

export const getVideos = async (
  youtubeToken: string,
  youtubeChannelId: string
): Promise<VideosMeta[]> => {
  const videosMeta: VideosMeta[] = []
  const data = await callVideoAPI(youtubeToken, youtubeChannelId)
  const videosList = data?.items
  videosList?.map(({ id, snippet }) => {
    if (id?.kind === 'youtube#video') {
      let thumbnail: string = ''
      if (snippet?.thumbnails?.maxres?.url) {
        thumbnail = snippet.thumbnails.maxres.url
      } else if (snippet?.thumbnails?.standard?.url) {
        thumbnail = snippet.thumbnails.standard.url
      } else if (snippet?.thumbnails?.high?.url) {
        thumbnail = snippet.thumbnails.high.url
      } else if (snippet?.thumbnails?.medium?.url) {
        thumbnail = snippet.thumbnails.medium.url
      } else if (snippet?.thumbnails?.default?.url) {
        thumbnail = snippet.thumbnails.default.url
      }
      const meta: VideosMeta = {
        id: id?.videoId,
        title: snippet?.title,
        description: snippet?.description,
        thumbnail: thumbnail,
        live: snippet?.liveBroadcastContent,
        publishTime: new Date(snippet?.publishedAt || ''),
        channelId: snippet?.channelId,
        channelTitle: snippet?.channelTitle
      }
      videosMeta.push(meta)
    }
  })
  return videosMeta
}

export const getAllVideos = async (
  youtubeToken: string,
  youtubeChannelId: string
): Promise<VideosMeta[]> => {
  const videosMeta: VideosMeta[] = []
  let nextPageToken: string | undefined = undefined
  do {
    const data: youtube_v3.Schema$SearchListResponse | undefined =
      await callVideoAPI(youtubeToken, youtubeChannelId, nextPageToken)
    const videosList = data?.items
    videosList?.map(({ id, snippet }) => {
      if (id?.kind === 'youtube#video') {
        let thumbnail: string = ''
        if (snippet?.thumbnails?.maxres?.url) {
          thumbnail = snippet.thumbnails.maxres.url
        } else if (snippet?.thumbnails?.standard?.url) {
          thumbnail = snippet.thumbnails.standard.url
        } else if (snippet?.thumbnails?.high?.url) {
          thumbnail = snippet.thumbnails.high.url
        } else if (snippet?.thumbnails?.medium?.url) {
          thumbnail = snippet.thumbnails.medium.url
        } else if (snippet?.thumbnails?.default?.url) {
          thumbnail = snippet.thumbnails.default.url
        }
        const meta: VideosMeta = {
          id: id?.videoId,
          title: snippet?.title,
          description: snippet?.description,
          thumbnail: thumbnail,
          live: snippet?.liveBroadcastContent,
          publishTime: new Date(snippet?.publishedAt || ''),
          channelId: snippet?.channelId,
          channelTitle: snippet?.channelTitle
        }
        videosMeta.push(meta)
      }
    })
    if (data?.nextPageToken !== null) {
      nextPageToken = data?.nextPageToken
    }
  } while (nextPageToken)
  return videosMeta.reverse()
}

export const getLatestUpdate = async (
  youtubeToken: string,
  youtubeChannelId: string
): Promise<VideosMeta[]> => {
  const videosMeta: VideosMeta[] = []
  const service = google.youtube('v3').activities
  try {
    const response = await service.list({
      key: youtubeToken,
      channelId: youtubeChannelId,
      part: ['snippet', 'contentDetails']
    })
    if (response.data) {
      const videosList = response.data?.items
      videosList?.map(({ contentDetails, snippet }) => {
        if (snippet?.type === 'upload') {
          let thumbnail: string = ''
          if (snippet?.thumbnails?.maxres?.url) {
            thumbnail = snippet.thumbnails.maxres.url
          } else if (snippet?.thumbnails?.standard?.url) {
            thumbnail = snippet.thumbnails.standard.url
          } else if (snippet?.thumbnails?.high?.url) {
            thumbnail = snippet.thumbnails.high.url
          } else if (snippet?.thumbnails?.medium?.url) {
            thumbnail = snippet.thumbnails.medium.url
          } else if (snippet?.thumbnails?.default?.url) {
            thumbnail = snippet.thumbnails.default.url
          }
          const meta: VideosMeta = {
            id: contentDetails?.upload?.videoId,
            title: snippet?.title,
            description: snippet?.description,
            thumbnail: thumbnail,
            live: snippet.type === 'upload' ? 'none' : 'live',
            publishTime: new Date(snippet?.publishedAt || ''),
            channelId: snippet?.channelId,
            channelTitle: snippet?.channelTitle
          }
          videosMeta.push(meta)
        }
      })
    } else {
      console.log('There is no result from API')
    }
  } catch (err: unknown) {
    console.error(`The API returned an error: ${err}`)
  }
  return videosMeta
}
