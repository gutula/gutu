/** DKIM public-key input normalisation. Operators routinely paste the
 *  full PEM-armored block (`-----BEGIN PUBLIC KEY-----…-----END PUBLIC
 *  KEY-----`) even though the DKIM TXT record wants the raw base64 body.
 *  This helper accepts either form and validates that what's left is
 *  legitimately base64. Lives in its own file so the UI can use it AND
 *  unit tests can pin the format. */

export type NormalizeResult =
  | { ok: true; value: string }
  | { ok: false; error: string };

export function normalizeDkimPublicKey(raw: string): NormalizeResult {
  const stripped = raw
    .replace(/-----BEGIN [^-]+-----/g, "")
    .replace(/-----END [^-]+-----/g, "")
    .replace(/\s+/g, "");
  if (!stripped) return { ok: false, error: "Public key is empty." };
  if (stripped.length < 100) return { ok: false, error: "Public key looks too short — paste the full key." };
  if (!/^[A-Za-z0-9+/]+={0,2}$/.test(stripped)) {
    return { ok: false, error: "Public key contains characters that aren't base64. Did you paste the wrong block?" };
  }
  return { ok: true, value: stripped };
}
