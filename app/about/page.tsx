export const metadata = {
  title: '关于'
};

export default function AboutPage() {
  return (
    <>
      <h1 className="page-title">关于</h1>
      <p className="page-lead">一个后端工程师的公开笔记。</p>

      <div className="prose">
        <p>
          我是 Sam，主要写 .NET / C#，这两年在补前端、容器化和 AI 工具链。这个博客用来记录真实项目里
          遇到的问题、做过的取舍，以及事后觉得应该早点知道的事。
        </p>
        <p>这里不会有多少“教程感”，更多是工作笔记：能复现的命令、能解释的现象、能回滚的方案。</p>
        <p>
          如果你也在搭多租户服务、把 AI 接进工程流程，或者只是路过，欢迎交流。
        </p>
        <hr />
        <p>
          本站用 Next.js 构建，文章是仓库里的 Markdown 文件，推送到 GitHub 后自动构建，部署在
          Uppcoder。
        </p>
      </div>
    </>
  );
}
