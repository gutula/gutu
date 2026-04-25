/** Server-side helper for building signed image-proxy URLs.
 *
 *  Used by the sanitizer when rewriting <img src> on inbound HTML so the
 *  client renders through `/api/mail/image-proxy?u=&h=` (HMAC-verified). */

import { hmacHex } from "./crypto/at-rest";

export function buildImageProxyUrl(remoteUrl: string): string {
  const sig = hmacHex(remoteUrl, "image-proxy");
  const enc = Buffer.from(remoteUrl).toString("base64");
  return `/api/mail/image-proxy?u=${encodeURIComponent(enc)}&h=${sig}`;
}
