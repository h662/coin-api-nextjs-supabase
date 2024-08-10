"use client";

import CoinCard from "@/components/CoinCard";
import { NextPage } from "next";
import { useEffect, useState } from "react";

const Home: NextPage = () => {
  const [coins, setCoins] = useState<Coin[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 10;

  const visibleCoins = coins.slice(0, currentPage * itemsPerPage);

  useEffect(() => {
    const fetchCoins = async () => {
      try {
        const res = await fetch("/api/coins");
        if (!res.ok) {
          throw new Error("Failed to fetch coins");
        }
        const data = await res.json();
        setCoins(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCoins();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="flex flex-col items-center my-8">
      <ul className="flex flex-col items-center max-w-xl gap-2 mx-auto">
        {visibleCoins.map((v, i) => (
          <CoinCard key={i} coin={v} />
        ))}
      </ul>
      {visibleCoins.length < coins.length && (
        <button
          onClick={() => setCurrentPage(currentPage + 1)}
          className="mt-4 p-2 bg-blue-500 text-white rounded"
        >
          더보기
        </button>
      )}
    </div>
  );
};

export default Home;
