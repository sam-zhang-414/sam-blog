import Link from 'next/link';
import { formatDate, getAllPosts } from '@/lib/posts';

export const metadata = {
  title: '归档'
};

export default function ArchivePage() {
  const posts = getAllPosts();
  const years = Array.from(new Set(posts.map((post) => post.date.slice(0, 4))));

  return (
    <>
      <h1 className="page-title">归档</h1>
      <p className="page-lead">按时间倒序，共 {posts.length} 篇。</p>

      {years.map((year) => (
        <section key={year}>
          <div className="year">{year}</div>
          <div className="post-list">
            {posts
              .filter((post) => post.date.startsWith(year))
              .map((post) => (
                <article className="post-item" key={post.slug}>
                  <div className="post-date">{formatDate(post.date)}</div>
                  <div>
                    <h2>
                      <Link href={`/posts/${post.slug}`}>{post.title}</Link>
                    </h2>
                    <p>{post.summary}</p>
                  </div>
                </article>
              ))}
          </div>
        </section>
      ))}
    </>
  );
}
