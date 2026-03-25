export interface AppShortcut {
  id: string;
  name: string;
  url: string;
  color: string;
  icon?: string;
}

export const DEFAULT_APPS: AppShortcut[] = [
  {
    id: '1',
    name: 'Google',
    url: 'https://google.com',
    color: 'bg-blue-500',
  },
  {
    id: '2',
    name: 'GitHub',
    url: 'https://github.com',
    color: 'bg-zinc-800',
  },
  {
    id: '3',
    name: 'YouTube',
    url: 'https://youtube.com',
    color: 'bg-red-600',
  },
  {
    id: '4',
    name: 'Gmail',
    url: 'https://mail.google.com',
    color: 'bg-red-500',
  },
  {
    id: '5',
    name: 'ChatGPT',
    url: 'https://chat.openai.com',
    color: 'bg-emerald-600',
  },
];
