"use client";

import { useAuth } from "@/context/AuthContext";
import { supabaseClient } from "@/lib/supabaseClient";
import { Dispatch, FC, SetStateAction, useEffect, useState } from "react";
import { FaHeart } from "react-icons/fa6";

interface LikeButtonProps {
  onClickLike: () => Promise<void>;
  postId?: number;
  commentId?: number;
  count: number | null;
  setCount: Dispatch<SetStateAction<number | null>>;
  userLiked: boolean;
  setUserLiked: Dispatch<SetStateAction<boolean>>;
}

const LikeButton: FC<LikeButtonProps> = ({
  onClickLike,
  postId,
  commentId,
  count,
  setCount,
  userLiked,
  setUserLiked,
}) => {
  const { session } = useAuth();

  useEffect(() => {
    const fetchLikes = async () => {
      let totalCountQuery = supabaseClient
        .from("likes")
        .select("*", { count: "exact" });

      if (postId) {
        totalCountQuery = totalCountQuery.eq("post_id", postId);
      } else if (commentId) {
        totalCountQuery = totalCountQuery.eq("comment_id", commentId);
      }

      const { count: totalCount, error: totalError } = await totalCountQuery;

      if (totalError) {
        console.error("Error fetching total likes: ", totalError);
      } else {
        setCount(totalCount);
      }

      if (session) {
        let userLikeQuery = supabaseClient.from("likes").select("*");

        if (postId) {
          userLikeQuery = userLikeQuery.eq("post_id", postId);
        } else if (commentId) {
          userLikeQuery = userLikeQuery.eq("comment_id", commentId);
        }

        userLikeQuery = userLikeQuery.eq("user_id", session.user.id);

        const { data: userLikes, error: userError } = await userLikeQuery;

        if (userError) {
          console.error("Error checking user like: ", userError);
        } else {
          setUserLiked(userLikes.length > 0);
        }
      }
    };

    fetchLikes();
  }, [postId, commentId, session]);

  return (
    <div className="flex items-center gap-1">
      <span onClick={onClickLike}>
        <FaHeart color={userLiked ? "red" : "black"} />
      </span>
      <span>{count}</span>
    </div>
  );
};

export default LikeButton;
