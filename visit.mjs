import { getStore } from "@netlify/blobs";

const STORE_NAME = "zabian-visitor-counter";
const VISITOR_ID_PATTERN = /^[A-Za-z0-9_-]{12,100}$/;

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store, max-age=0",
      "X-Content-Type-Options": "nosniff"
    }
  });
}

export default async function handler(request) {
  if (request.method !== "POST" && request.method !== "GET") {
    return json({ error: "Method not allowed" }, 405);
  }

  try {
    const store = getStore(STORE_NAME);
    const now = new Date();
    const utcDay = now.toISOString().slice(0, 10);

    if (request.method === "POST") {
      let body;

      try {
        body = await request.json();
      } catch {
        return json({ error: "Invalid JSON body" }, 400);
      }

      const visitorId =
        typeof body?.visitorId === "string" ? body.visitorId.trim() : "";

      if (!VISITOR_ID_PATTERN.test(visitorId)) {
        return json({ error: "Invalid visitor ID" }, 400);
      }

      // These append-only records avoid double counting and update races:
      // - one lifetime record per browser
      // - one visit record per browser for each UTC day
      await Promise.all([
        store.setJSON(
          `visitors/${visitorId}`,
          { firstSeenAt: now.toISOString() },
          { onlyIfNew: true }
        ),
        store.setJSON(
          `visits/${utcDay}/${visitorId}`,
          { seenAt: now.toISOString() },
          { onlyIfNew: true }
        )
      ]);
    }

    const [allVisitRecords, todaysVisitRecords, uniqueVisitorRecords] =
      await Promise.all([
        store.list({ prefix: "visits/" }),
        store.list({ prefix: `visits/${utcDay}/` }),
        store.list({ prefix: "visitors/" })
      ]);

    return json({
      totalVisits: allVisitRecords.blobs.length,
      todayVisits: todaysVisitRecords.blobs.length,
      uniqueVisitors: uniqueVisitorRecords.blobs.length,
      countingRule: "One visit per browser per UTC day",
      utcDay
    });
  } catch (error) {
    console.error("Visitor counter error:", error);
    return json({ error: "Counter storage is temporarily unavailable" }, 500);
  }
}
