"use client";

import CommentCard from "@/components/CommentCard";
import LikeButton from "@/components/LikeButton";
import PostLike from "@/components/PostLike";
import { useAuth } from "@/context/AuthContext";
import { supabaseClient } from "@/lib/supabaseClient";
import { NextPage } from "next";
import Image from "next/image";
import { useParams } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";

const Post: NextPage = () => {
  const [post, setPost] = useState<Post>();
  const [parsedCoin, setParsedCoin] = useState<Coin>();
  const [nickname, setNickname] = useState<string>("");
  const [text, setText] = useState<string>("");
  const [comments, setComments] = useState<Comment[]>([]);

  const { id } = useParams();

  const { session } = useAuth();

  const onSubmitCreateComment = async (e: FormEvent) => {
    e.preventDefault();

    const { error } = await supabaseClient
      .from("comments")
      .insert({ text, user_id: session?.user.id, post_id: id });

    if (error) {
      console.error("Error creating comment: ", error);
    } else {
      const { data } = await supabaseClient
        .from("comments")
        .select("*")
        .eq("post_id", id)
        .order("id", { ascending: false })
        .limit(1)
        .single();

      setComments([...comments, data]);
      setText("");
    }
  };

  useEffect(() => {
    const fetchPost = async () => {
      const { data, error } = await supabaseClient
        .from("posts")
        .select("*")
        .eq("id", id);

      if (error) {
        console.error("Error fetching post: ", error);
      } else {
        setPost(data[0]);
      }
    };

    const fetchComments = async () => {
      const { data, error } = await supabaseClient
        .from("comments")
        .select("*")
        .eq("post_id", id);

      if (error) {
        console.error("Error fetching comments: ", error);
      } else {
        setComments(data);
      }
    };

    fetchPost();
    fetchComments();
  }, []);

  useEffect(() => {
    if (!post) return;

    setParsedCoin(JSON.parse(post.coin));
    setNickname(`#${post.user_id.substring(post.user_id.length - 4)}`);
  }, [post]);

  useEffect(() => {
    if (!nickname || !post) return;

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
  }, [nickname]);

  return (
    post &&
    parsedCoin &&
    nickname && (
      <div className="w-full flex flex-col gap-1 justify-between m-4">
        <div className="flex">
          <span className="font-bold">{nickname}</span>님의 의견{" "}
          <span className="ml-2">
            <PostLike postId={Number(id)} />
          </span>
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
            {parsedCoin.price_change_percentage_24h > 0 ? "+" : ""}
            {parsedCoin.price_change_percentage_24h.toFixed(2)}%
          </span>
        </div>
        <form className="mt-4 flex gap-2" onSubmit={onSubmitCreateComment}>
          <input
            className="border-2 focus:outline-none focus:border-blue-400 px-2 py-1"
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <input
            className="p-1 text-xs bg-blue-100 text-blue-500 rounded"
            type="submit"
            value="댓글남기기"
          />
        </form>
        <ul className="flex flex-col mt-4 gap-2">
          {comments.map((v) => (
            <CommentCard key={v.id} comment={v} />
          ))}
        </ul>
      </div>
    )
  );
};

export default Post;
