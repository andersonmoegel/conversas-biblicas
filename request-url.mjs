// The Origin header is caller-controlled and must never determine the server URL.
export function requestURL(req, env = process.env, port = 3000) {
  const onVercel = env.VERCEL === '1';
  const host = (onVercel && req.headers['x-forwarded-host']) || req.headers.host || `localhost:${port}`;
  if (typeof host !== 'string' || !/^[a-z0-9.\-\[\]:]+$/i.test(host)) throw new Error('Invalid request host');
  const url = new URL(`${onVercel ? 'https' : 'http'}://${host}`);
  // Assign the path separately so a //path cannot replace the request host.
  const path = req.url || '/';
  const query = path.indexOf('?');
  url.pathname = query < 0 ? path : path.slice(0, query);
  url.search = query < 0 ? '' : path.slice(query);
  return url;
}
