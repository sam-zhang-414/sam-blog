import Link from 'next/link';
import { formatDate, getAllPosts } from '@/lib/posts';

export default function HomePage() {
  const posts = getAllPosts();

  return (
    <>
      <section className="hero">
        <div className="eyebrow">Notes · Code · AI</div>
        <h1>
          把踩过的坑，
          <br />
          写成能复用的路。
        </h1>
        <p>工程实践、AI 工具链、以及一些还没想清楚的判断。更新不固定，但每篇都尽量能落地。</p>
      </section>

      <section className="post-list" aria-label="文章列表">
        {posts.map((post) => (
          <article className="post-item" key={post.slug}>
            <div className="post-date">{formatDate(post.date)}</div>
            <div>
              <h2>
                <Link href={`/posts/${post.slug}`}>{post.title}</Link>
              </h2>
              <p>{post.summary}</p>
              {post.tags.length > 0 && (
                <div className="tag-row">
                  {post.tags.map((tag) => (
                    <span className="tag" key={tag}>
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </article>
        ))}
      </section>
    </>
  );
}
