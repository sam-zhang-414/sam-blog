import type { Metadata } from 'next';
import Link from 'next/link';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: 'Sam 的博客',
    template: '%s · Sam 的博客'
  },
  description: '记录工程实践、AI 工具链与一些不成熟的思考。'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <body>
        <header className="site-header">
          <div className="wrap header-inner">
            <Link className="brand" href="/">
              Sam<span>.</span>的博客
            </Link>
            <nav className="nav">
              <Link href="/">首页</Link>
              <Link href="/archive">归档</Link>
              <Link href="/about">关于</Link>
            </nav>
          </div>
        </header>
        <main>
          <div className="wrap">{children}</div>
        </main>
        <footer className="site-footer">
          <div className="wrap footer-inner">
            <span>© {new Date().getFullYear()} Sam</span>
            <span>用 Next.js 构建 · 部署在 Uppcoder</span>
          </div>
        </footer>
      </body>
    </html>
  );
}
