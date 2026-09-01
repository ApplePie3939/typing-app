const KEY = 'fullsta-player-id';

export function getPlayerId(): string {
  const existing = localStorage.getItem(KEY);
  if (existing && /^[0-9a-f-]{36}$/i.test(existing)) return existing;
  const id = crypto.randomUUID();
  localStorage.setItem(KEY, id);
  return id;
}
