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

      <section className="forgot-page__panel" aria-labelledby="forgot-title">
        <h1 id="forgot-title" className="forgot-page__title">
          忘記密碼？
        </h1>
        <ForgotPasswordForm />
      </section>
    </main>
  );
}
