"use client";

import PostCard from "@/components/PostCard";
import { supabaseClient } from "@/lib/supabaseClient";
import { NextPage } from "next";
import { useEffect, useState } from "react";

const Posts: NextPage = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [isMore, setIsMore] = useState<boolean>(true);
  const itemsPerPage = 10;

  const fetchPosts = async () => {
    const { data, error } = await supabaseClient
      .from("posts")
      .select("*")
      .order("id", { ascending: false })
      .range(
        currentPage * itemsPerPage,
        currentPage * itemsPerPage + itemsPerPage
      );

    if (error) {
      console.error("Error fetching posts: ", error);
    } else {
      setPosts([...data, ...posts]);
      setCurrentPage(currentPage + 1);

      if (data.length !== itemsPerPage) setIsMore(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <div className="flex flex-col items-center my-8">
      <ul className="flex flex-col items-center max-w-xl gap-2 mx-auto">
        {posts.map((v) => (
          <PostCard key={v.id} post={v} />
        ))}
      </ul>
      {isMore && (
        <button
          onClick={() => fetchPosts()}
          className="mt-4 p-2 bg-blue-500 text-white rounded"
        >
          더보기
        </button>
      )}
    </div>
  );
};

export default Posts;
