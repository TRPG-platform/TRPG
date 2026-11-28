import { useLocation, useNavigate } from 'react-router';
import ForgotPasswordForm from './ForgotPasswordForm';
import './ForgotPasswordPage.css';

/** 忘記密碼頁（#42）。跟登入頁一樣不放導覽列。 */
export default function ForgotPasswordPage() {
  const location = useLocation();
  const navigate = useNavigate();

  // 關閉：站內有上一頁就返回；直接打開網址進來（沒有上一頁）就回登入頁。
  function closePage() {
    if (location.key === 'default') {
      navigate('/login');
    } else {
      navigate(-1);
    }
  }

  return (
    <main className="forgot-page">
      <button
        type="button"
        className="forgot-page__close"
        aria-label="關閉忘記密碼頁"
        onClick={closePage}
      >
        ✕
      </button>

      {/* 左邊標語：文案跟登入頁（Figma TV-4）一樣，兩頁切換時畫面不跳 */}
      <section className="forgot-page__intro" aria-label="平台介紹">
        <p className="forgot-page__eyebrow">給冒險者的共享桌面</p>
        {/* TODO：「同一張案上」是否為「同一張桌上」，等設計組員確認（跟登入頁一起改） */}
        <p className="forgot-page__slogan">
          把大家的
          <br />
          故事放在同一張
          <br />
          案上。
        </p>
        <p className="forgot-page__description">
          開一間遊戲房、放上地圖、選角色、擲骰子，筆記與骰子都在同一個地方，這裡專心讓冒險繼續。
        </p>
      </section>

      <section className="forgot-page__panel" aria-labelledby="forgot-title">
        <h1 id="forgot-title" className="forgot-page__title">
          忘記密碼？
        </h1>
        <p className="forgot-page__lead">
          輸入註冊時的 Email，我們會寄一封重設密碼的連結給你。
        </p>
        <ForgotPasswordForm />
      </section>
    </main>
  );
}
