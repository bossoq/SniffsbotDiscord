import {
  createClient,
  SupabaseClient,
  PostgrestResponse,
  PostgrestSingleResponse,
} from '@supabase/supabase-js'
import { supabaseUrl, supabaseKey, table } from '../config.json'

const supabase: SupabaseClient = createClient(supabaseUrl, supabaseKey)

type QueryResponse = {
  User_Name: string
  Coin: number
  Watch_Time: number
  Sub_Month: number
  Create_Time: Date
  Update_Time: Date
}

type LeaderBoard = {
  User_Name: string
  Coin: number
}

export const getCoin = async (
  username: string
): Promise<number | undefined> => {
  const { data: userInfo, error }: PostgrestSingleResponse<QueryResponse> =
    await supabase
      .from<QueryResponse>(table)
      .select('*')
      .eq('User_Name', username)
      .single()
  let coin: number
  if (userInfo) {
    coin = userInfo.Coin
    return coin
  }
}

export const getLeader = async (limit: number): Promise<LeaderBoard[]> => {
  const { data: userInfos, error }: PostgrestResponse<QueryResponse> =
    await supabase
      .from<QueryResponse>(table)
      .select('*')
      .order('Coin', { ascending: false })
      .neq('User_Name', 'sniffs_bot')
      .neq('User_Name', 'sniffslive')
      .neq('User_Name', 'moobot')
      .neq('User_Name', 'anotherttvviewer')
      .neq('User_Name', 'commanderroot')
      .neq('User_Name', 'v_and_k')
      .neq('User_Name', 'virgoproz')
      .neq('User_Name', 'federicofeliny')
      .neq('User_Name', 'aten')
      .neq('User_Name', 'discord_for_streamers')
      .neq('User_Name', 'd1sc0rdforsmallstreamers')
      .limit(limit)
  const resp: LeaderBoard[] = []
  if (userInfos) {
    userInfos.map(({ User_Name, Coin }) => {
      resp.push({ User_Name, Coin })
    })
  }
  return resp
}
