export default {
  async fetch(request) {
    const TARGET =
      "https://script.google.com/macros/s/AKfycbzSWcWLGCAoZAqhbbO3RZDgrxd44fCOuW5IjUYRWTDjciDFFvENzXo60qm2KI1bajED0g/exec";

    // CORS preflight
    if (request.method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type",
        },
      });
    }

    const incomingUrl = new URL(request.url);
    const targetUrl = new URL(TARGET);

    // барлық query параметрлерді өткізу
    incomingUrl.searchParams.forEach((v, k) => {
      targetUrl.searchParams.set(k, v);
    });

    const options = {
      method: request.method,
      headers: { "Content-Type": "application/json" },
    };

    if (request.method === "POST") {
      options.body = await request.text();
    }

    const resp = await fetch(targetUrl.toString(), options);
    const text = await resp.text();

    return new Response(text, {
      status: resp.status,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
      },
    });
  },
};
