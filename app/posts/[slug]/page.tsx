import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { formatDate, getAllPosts, getPost } from '@/lib/posts';

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return { title: '文章不存在' };
  return {
    title: post.title,
    description: post.summary
  };
}

export default async function PostPage({ params }: Params) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  return (
    <article>
      <header className="article-head">
        <div className="eyebrow">{post.tags.join(' · ') || 'Notes'}</div>
        <h1>{post.title}</h1>
        <div className="article-meta">
          <span>{formatDate(post.date)}</span>
          <span>{post.minutes} 分钟读完</span>
        </div>
      </header>

      <div className="prose" dangerouslySetInnerHTML={{ __html: post.html }} />

      <Link className="back-link" href="/">
        ← 返回首页
      </Link>
    </article>
  );
}
