/**
 * Demo Authentication & Session Management Service.
 * Manages user session state using sessionStorage.
 * Security Note: This is a front-end demo only and provides no real backend security.
 */

const SESSION_KEY = 'desimart_session';

/**
 * Gets the current active session from sessionStorage.
 * @returns {{ displayName: string, email: string, signedInAt: string } | null}
 */
export function getSession() {
  try {
    const data = sessionStorage.getItem(SESSION_KEY);
    if (!data) return null;
    return JSON.parse(data);
  } catch (e) {
    return null;
  }
}

/**
 * Saves user session to sessionStorage.
 * Password is NEVER stored or logged.
 */
export function saveSession({ displayName, email }) {
  const session = {
    displayName: displayName || 'Guest',
    email: email || '',
    signedInAt: new Date().toISOString()
  };
  sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
  return session;
}

/**
 * Clears user session on sign-out.
 */
export function clearSession() {
  sessionStorage.removeItem(SESSION_KEY);
}

/**
 * Hand-written derivation of display name from sign-in identifier.
 * - If contains '@', uses the part before '@', otherwise uses the identifier.
 * - Trims whitespace, caps length at 24 characters.
 * - Capitalizes the first letter.
 * - Falls back to "Guest".
 */
export function deriveDisplayName(identifier) {
  if (!identifier || typeof identifier !== 'string') return 'Guest';

  let raw = identifier.trim();
  if (!raw) return 'Guest';

  if (raw.includes('@')) {
    raw = raw.split('@')[0];
  }

  raw = raw.trim();
  if (!raw) return 'Guest';

  raw = raw.slice(0, 24);
  return raw.charAt(0).toUpperCase() + raw.slice(1);
}

/**
 * Hand-written initials extractor for user avatars.
 * Max 2 uppercase letters.
 */
export function getInitials(name) {
  if (!name || typeof name !== 'string') return 'GU';
  const clean = name.trim();
  if (!clean) return 'GU';

  const parts = clean.split(/\s+/).filter(Boolean);
  if (parts.length === 0) return 'GU';

  if (parts.length === 1) {
    const str = parts[0];
    if (str.length >= 2) {
      return str.slice(0, 2).toUpperCase();
    }
    return str.charAt(0).toUpperCase();
  }

  const firstInitial = parts[0].charAt(0).toUpperCase();
  const lastInitial = parts[parts.length - 1].charAt(0).toUpperCase();
  return (firstInitial + lastInitial).slice(0, 2);
}

/**
 * Simple email format validator (something@something.tld).
 */
export function isValidEmailFormat(str) {
  if (!str || typeof str !== 'string') return false;
  const trimmed = str.trim();
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed);
}
