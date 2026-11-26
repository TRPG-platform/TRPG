import type { Script } from '@takoyaki/shared';

interface ScriptCardData {
  cover: string;
  title: string;
  rule: string;
  players: string;
  scenes: number;
  tags: string[];
  status: Script['status'];
}

export const scriptSamples: ScriptCardData[] = [
  {
    cover: 'library',
    title: '夜行的圖書館',
    rule: 'CoC 7e',
    players: '4–6',
    scenes: 6,
    tags: ['現代', '懸疑', '調查'],
    status: 'in-progress',
  },
  {
    cover: 'greenhouse',
    title: '玻璃溫室的花',
    rule: 'CoC 7e',
    players: '3–4',
    scenes: 4,
    tags: ['現代', '日常', '情感'],
    status: 'draft',
  },
  {
    cover: 'snow',
    title: '白雪之下',
    rule: 'CoC 6e',
    players: '3–5',
    scenes: 5,
    tags: ['奇幻', '冒險', '生存'],
    status: 'completed',
  },
  {
    cover: 'station',
    title: '終點站的來信',
    rule: 'CoC 7e',
    players: '2–4',
    scenes: 3,
    tags: ['現代', '推理', '信件'],
    status: 'draft',
  },
  {
    cover: 'ocean',
    title: '海底的觀測者',
    rule: 'CoC 7e',
    players: '3–5',
    scenes: 4,
    tags: ['調查', '懸疑'],
    status: 'in-progress',
  },
  {
    cover: 'stage',
    title: '最後的舞台',
    rule: 'CoC 7e',
    players: '4–6',
    scenes: 5,
    tags: ['表演', '懸疑'],
    status: 'completed',
  },
];
