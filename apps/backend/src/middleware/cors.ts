export function handleCors(req: Request, corsOrigin: string): Response | null {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: {
        "Access-Control-Allow-Origin": corsOrigin,
        "Access-Control-Allow-Methods": "GET, POST, PUT, PATCH, DELETE, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Request-ID",
        "Access-Control-Allow-Credentials": "true",
        "Access-Control-Max-Age": "86400",
      },
    });
  }
  return null;
}

export function setCorsHeaders(res: Response, corsOrigin: string): Response {
  res.headers.set("Access-Control-Allow-Origin", corsOrigin);
  res.headers.set("Access-Control-Allow-Credentials", "true");
  return res;
}
