/** Redirect legacy app URLs to a consolidated instrument (?mode= optional). */
export function redirectTo(relativePath, mode) {
  const u = new URL(relativePath, location.href);
  if (mode) u.searchParams.set("mode", mode);
  location.replace(`${u.pathname}${u.search}${u.hash}`);
}
