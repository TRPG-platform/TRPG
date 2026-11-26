import { useLocation, useNavigate } from 'react-router';
import LoginForm from './LoginForm';
import './LoginPage.css';

/** 登入頁（Figma TV-4）。這頁不放導覽列。 */
export default function LoginPage() {
  const location = useLocation();
  const navigate = useNavigate();

  // 關閉：站內有上一頁就返回；直接打開網址進來（沒有上一頁）就回首頁。
  function closeLoginPage() {
    if (location.key === 'default') {
      navigate('/');
    } else {
      navigate(-1);
    }
  }

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
