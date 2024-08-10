"use client";

import { supabaseClient } from "@/lib/supabaseClient";
import { FC, useEffect, useState } from "react";
import { formatDistanceToNow, parseISO } from "date-fns";
import { ko } from "date-fns/locale";

interface CommentCardProps {
  comment: Comment;
}

const CommentCard: FC<CommentCardProps> = ({ comment }) => {
  const [nickname, setNickname] = useState<string>(
    `#${comment.user_id.substring(comment.user_id.length - 4)}`
  );

  useEffect(() => {
    const fetchPostOwner = async () => {
      const { data, error } = await supabaseClient
        .from("profiles")
        .select("*")
        .eq("user_id", comment.user_id);

      if (error) {
        console.error("Error fetching profile: ", error);
      } else {
        if (data.length !== 0) setNickname(data[0].nickname);
      }
    };

    fetchPostOwner();
  }, []);

  return (
    <li>
      {comment.text} {nickname}{" "}
      {formatDistanceToNow(parseISO(comment.created_at), {
        locale: ko,
        addSuffix: true,
      })}
    </li>
  );
};

export default CommentCard;
