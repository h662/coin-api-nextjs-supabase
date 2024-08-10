import { NextRequest, NextResponse } from "next/server";

export const GET = async (request: NextRequest) => {
  try {
    const res = await fetch(
      `${process.env.COINGECKO_API_URL}?vs_currency=krw&order=market_cap_desc&per_page=250&page=1&sparkline=false`,
      {
        headers: {
          accept: "application/json",
          "x-cg-demo-api-key": process.env.COINGECKO_API_KEY!,
        },
      }
    );

    if (!res.ok) {
      return NextResponse.error();
    }

    const data = await res.json();

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching coin data: ", error);

    return NextResponse.error();
  }
};
