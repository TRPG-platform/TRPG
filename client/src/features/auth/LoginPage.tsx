import LoginForm from './LoginForm';
import './LoginPage.css';

// TODO(#5)：裝好 React Router 後改用 navigate(-1)
function closeLoginPage() {
  if (window.history.length > 1) {
    window.history.back();
  } else {
    window.location.assign('/');
  }
}

/** 登入頁（Figma TV-4）。這頁不放導覽列。 */
export default function LoginPage() {
  return (
    <main className="login-page">
      <button
        type="button"
        className="login-page__close"
        aria-label="關閉登入頁"
        onClick={closeLoginPage}
      >
        ✕
      </button>

      <section className="login-page__intro" aria-labelledby="login-title">
        <p className="login-page__eyebrow">給冒險者的共享桌面</p>
        {/* TODO：「同一張案上」是否為「同一張桌上」，等設計組員確認 */}
        <h1 id="login-title" className="login-page__title">
          把大家的
          <br />
          故事放在同一張
          <br />
          案上。
        </h1>
        {/* TODO：Figma 原文有錯字，正式文案等設計組員確認 */}
        <p className="login-page__description">
          開一間遊戲房、放上地圖、選角色、擲骰子，筆記與骰子都在同一個地方，這裡專心讓冒險繼續。
        </p>
      </section>

      <section className="login-page__panel" aria-label="登入">
        <LoginForm />
      </section>
    </main>
  );
}
