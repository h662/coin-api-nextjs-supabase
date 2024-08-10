import { supabaseClient } from "@/lib/supabaseClient";
import Image from "next/image";
import { FC, useEffect, useState } from "react";

interface PostCardProps {
  post: Post;
}

const PostCard: FC<PostCardProps> = ({ post }) => {
  const parsedCoin = JSON.parse(post.coin);

  const [nickname, setNickname] = useState<string>(
    `#${post.user_id.substring(post.user_id.length - 4)}`
  );

  useEffect(() => {
    const fetchPostOwner = async () => {
      const { data, error } = await supabaseClient
        .from("profiles")
        .select("*")
        .eq("user_id", post.user_id);

      if (error) {
        console.error("Error fetching profile: ", error);
      } else {
        if (data.length !== 0) setNickname(data[0].nickname);
      }
    };

    fetchPostOwner();
  }, []);

  return (
    <li className="border-2 border-black w-full flex flex-col gap-1 justify-between p-2">
      <div>
        <span className="font-bold">{nickname}</span>님의 의견
      </div>
      <div>{post.text}</div>
      <div className="flex gap-2">
        <Image
          src={parsedCoin.image}
          alt={parsedCoin.symbol}
          width={24}
          height={224}
        />
        <span>{parsedCoin.name}</span>
        <span>{parsedCoin.current_price.toLocaleString()}원</span>
        <span
          className={
            parsedCoin.price_change_percentage_24h >= 0
              ? "text-red-500"
              : "text-blue-500"
          }
        >
          {parsedCoin.price_change_percentage_24h.toFixed(2)}%
        </span>
      </div>
    </li>
  );
};

export default PostCard;
