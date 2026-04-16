import { NextRequest, NextResponse } from "next/server";
import { fetchRedditThread } from "@/lib/reddit";

export const runtime = "nodejs";
// Revalidate cached response every 5 minutes
export const revalidate = 300;

export async function GET(
  _req: NextRequest,
  { params }: { params: { threadId: string } }
) {
  const { threadId } = params;

  if (!threadId || !/^[a-z0-9]+$/i.test(threadId)) {
    return NextResponse.json({ error: "Invalid thread ID" }, { status: 400 });
  }

  const thread = await fetchRedditThread(threadId);
  if (!thread) {
    return NextResponse.json({ error: "Thread not found" }, { status: 404 });
  }

  return NextResponse.json(thread, {
    headers: {
      "Cache-Control": "public, s-maxage=300, stale-while-revalidate=60",
    },
  });
}
