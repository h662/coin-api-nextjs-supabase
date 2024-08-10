interface Profile {
  id: number;
  created_at: string;
  user_id: string;
  nickname: string;
}

interface Coin {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  market_cap: number;
  market_cap_rank: number;
  total_volume: number;
  high_24h: number;
  low_24h: number;
  price_change_24h: number;
  price_change_percentage_24h: number;
}

interface Post {
  id: number;
  created_at: string;
  text: string;
  coin: string;
  user_id: string;
}
