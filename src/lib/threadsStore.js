const KEY = 'lm_threads_v1';

function seed() {
  return [
    {
      id: 1,
      creator: 'Only Mail Checker (vendor)',
      messages: 0,
      subject: 'i want to update on my order',
      updatedAt: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString(),
    }
  ];
}

export function getThreads() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) {
      const initial = seed();
      localStorage.setItem(KEY, JSON.stringify(initial));
      return initial;
    }
    return JSON.parse(raw);
  } catch (e) {
    return seed();
  }
}

export function addThread({ role, user, subject }) {
  const now = new Date().toISOString();
  const all = getThreads();
  const id = all.length ? Math.max(...all.map(t => t.id)) + 1 : 1;
  const creator = `${user || 'Unknown'} (${role || 'vendor'})`;
  const t = { id, creator, messages: 0, subject, updatedAt: now };
  const next = [t, ...all];
  localStorage.setItem(KEY, JSON.stringify(next));
  return next;
}

export function clearThreads() {
  localStorage.removeItem(KEY);
}
