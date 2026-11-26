export function LayoutHeader() {
  return (
    <header className="layout-header">
      <div className="layout-brand">
        <a href="/" aria-label="返回首頁">
          ⇤
        </a>
        <a href="/">TAKOYAKI</a>
      </div>
      <nav aria-label="主導覽">
        <a href="/">首頁</a>
        <span>我的角色</span>
        <span>教學與資源</span>
      </nav>
      <div className="layout-account" aria-hidden="true">
        ♧ ●
      </div>
    </header>
  );
}
