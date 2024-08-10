import Image from "next/image";
import { FC } from "react";

interface CoinCardProps {
  coin: Coin;
}

const CoinCard: FC<CoinCardProps> = ({ coin }) => {
  console.log(coin);

  return (
    <li className="border-2 border-black w-full flex items-center gap-2 p-2">
      <span>{coin.market_cap_rank}</span>
      <Image src={coin.image} alt={coin.symbol} width={24} height={24} />
      <span>{coin.name}</span>
      <span>{coin.current_price.toLocaleString()}원</span>
      <span
        className={
          coin.price_change_percentage_24h >= 0
            ? "text-red-500"
            : "text-blue-500"
        }
      >
        {coin.price_change_percentage_24h.toFixed(2)}%
      </span>
    </li>
  );
};

export default CoinCard;
