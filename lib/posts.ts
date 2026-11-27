import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import { marked } from 'marked';

export type PostMeta = {
  slug: string;
  title: string;
  date: string;
  summary: string;
  tags: string[];
  minutes: number;
};

export type Post = PostMeta & { html: string };

const contentDir = path.join(process.cwd(), 'content');

function normalizeDate(value: unknown): string {
  if (value instanceof Date) return value.toISOString().slice(0, 10);
  const text = String(value ?? '');
  const match = text.match(/\d{4}-\d{2}-\d{2}/);
  return match ? match[0] : text;
}

function readPostFile(fileName: string): Post {
  const slug = fileName.replace(/\.md$/, '');
  const raw = fs.readFileSync(path.join(contentDir, fileName), 'utf8');
  const { data, content } = matter(raw);
  const plain = content.replace(/```[\s\S]*?```/g, '').replace(/[#>*_`\-]/g, '');
  const minutes = Math.max(1, Math.round(plain.replace(/\s/g, '').length / 400));

  return {
    slug,
    title: String(data.title ?? slug),
    date: normalizeDate(data.date),
    summary: String(data.summary ?? ''),
    tags: Array.isArray(data.tags) ? data.tags.map(String) : [],
    minutes,
    html: marked.parse(content, { async: false }) as string
  };
}

export function getAllPosts(): PostMeta[] {
  if (!fs.existsSync(contentDir)) return [];
  return fs
    .readdirSync(contentDir)
    .filter((name) => name.endsWith('.md'))
    .map((name) => {
      const { html: _html, ...meta } = readPostFile(name);
      return meta;
    })
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getPost(slug: string): Post | null {
  const fileName = `${slug}.md`;
  if (!/^[a-z0-9-]+$/.test(slug)) return null;
  if (!fs.existsSync(path.join(contentDir, fileName))) return null;
  return readPostFile(fileName);
}

export function formatDate(date: string): string {
  const parsed = new Date(`${date}T00:00:00+08:00`);
  if (Number.isNaN(parsed.getTime())) return date;
  return parsed.toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' });
}
