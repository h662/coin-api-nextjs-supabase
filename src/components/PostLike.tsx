import { FC, useState } from "react";
import LikeButton from "./LikeButton";
import { supabaseClient } from "@/lib/supabaseClient";
import { useAuth } from "@/context/AuthContext";

interface PostLikeProps {
  postId: number;
}

const PostLike: FC<PostLikeProps> = ({ postId }) => {
  const [count, setCount] = useState<number | null>(null);
  const [userLiked, setUserLiked] = useState<boolean>(false);

  const { session } = useAuth();

  const onClickLike = async () => {
    const { data, error } = await supabaseClient
      .from("likes")
      .select("*")
      .eq("user_id", session?.user.id)
      .eq("post_id", postId);

    if (error) {
      console.error("Error creating comment: ", error);
    } else {
      if (data.length === 0) {
        await supabaseClient
          .from("likes")
          .insert({ user_id: session?.user.id, post_id: postId });

        if (count !== null) setCount(count + 1);

        setUserLiked(true);
      } else {
        await supabaseClient
          .from("likes")
          .delete()
          .eq("user_id", session?.user.id)
          .eq("post_id", postId);

        if (count !== null) setCount(count - 1);

        setUserLiked(false);
      }
    }
  };

  return (
    <LikeButton
      onClickLike={onClickLike}
      postId={postId}
      count={count}
      setCount={setCount}
      userLiked={userLiked}
      setUserLiked={setUserLiked}
    />
  );
};

export default PostLike;
