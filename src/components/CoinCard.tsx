import { useAuth } from "@/context/AuthContext";
import { supabaseClient } from "@/lib/supabaseClient";
import Image from "next/image";
import { FC, FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

interface CoinCardProps {
  coin: Coin;
}

const CoinCard: FC<CoinCardProps> = ({ coin }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [text, setText] = useState<string>("");

  const { session } = useAuth();

  const router = useRouter();

  const onSubmitCreatePost = async (e: FormEvent) => {
    e.preventDefault();

    const { error } = await supabaseClient
      .from("posts")
      .insert({ text, coin: JSON.stringify(coin), user_id: session?.user.id });

    if (error) {
      console.error("Error creating post: ", error);
    } else {
      router.push("/posts");
    }
  };

  return (
    <>
      <li className="border-2 border-black w-full flex items-center justify-between p-2">
        <div className="flex gap-2">
          <span>{coin.market_cap_rank}</span>
          <Image src={coin.image} alt={coin.symbol} width={24} height={224} />
          <span>{coin.name}</span>
          <span>{coin.current_price.toLocaleString()}원</span>
          <span
            className={
              coin.price_change_percentage_24h >= 0
                ? "text-red-500"
                : "text-blue-500"
            }
          >
            {coin.price_change_percentage_24h > 0 ? "+" : ""}
            {coin.price_change_percentage_24h.toFixed(2)}%
          </span>
        </div>
        {session && (
          <button
            className="p-1 text-xs bg-blue-100 text-blue-500 rounded"
            onClick={() => setIsOpen(!isOpen)}
          >
            의견남기기
          </button>
        )}
      </li>
      {isOpen && (
        <form className="flex gap-2" onSubmit={onSubmitCreatePost}>
          <input
            className="border-2 focus:outline-none focus:border-blue-400 px-2 py-1"
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <input
            className="p-1 text-xs bg-blue-100 text-blue-500 rounded"
            type="submit"
            value="작성"
          />
        </form>
      )}
    </>
  );
};

export default CoinCard;
