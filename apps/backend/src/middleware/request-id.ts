export function getOrGenerateRequestId(req: Request): string {
  const existing = req.headers.get("x-request-id");
  if (existing) return existing;
  return `req_${crypto.randomUUID().replace(/-/g, "").slice(0, 16)}`;
}
