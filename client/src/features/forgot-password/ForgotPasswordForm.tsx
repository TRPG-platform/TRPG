import { useState, type FormEvent } from 'react';
import { Link } from 'react-router';

const EMPTY_ERROR = '請輸入電郵或手機號碼';
// 不管帳號存不存在都顯示同一句，避免有人用這頁猜出誰有註冊
const SENT_MESSAGE = '如果這個帳號存在，我們已寄出重設密碼的說明';

/** 忘記密碼表單。目前只做畫面和假送出，真的寄信等後端的票。 */
export default function ForgotPasswordForm() {
  const [contact, setContact] = useState('');
  const [error, setError] = useState('');
  const [isSent, setIsSent] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    // 用 <form> 的 onSubmit：在欄位按 Enter 也等於按「重設密碼」
    event.preventDefault();

    if (contact.trim() === '') {
      setError(EMPTY_ERROR);
      setIsSent(false);
      return;
    }

    setError('');
    // TODO(後端重設密碼票)：改成呼叫 api/ 資料存取層，真的寄信或簡訊。
    setIsSent(true);
  }

  return (
    <form className="forgot-form" onSubmit={handleSubmit} noValidate>
      <div className="forgot-form__field">
        <label htmlFor="forgot-contact">電郵或手機號碼</label>
        <div className="forgot-form__input-wrap">
          {/* 名片小圖示，放在輸入框裡面，只是裝飾 */}
          <svg
            className="forgot-form__icon"
            viewBox="0 0 24 24"
            aria-hidden="true"
            focusable="false"
          >
            <rect x="2" y="4" width="20" height="16" rx="2" fill="currentColor" />
            <circle className="forgot-form__icon-cut" cx="8" cy="10" r="2.25" />
            <path className="forgot-form__icon-cut" d="M4.5 16a3.5 3.5 0 0 1 7 0z" />
            <path className="forgot-form__icon-line" d="M14 9h5M14 12h5M14 15h3" />
          </svg>
          <input
            id="forgot-contact"
            name="contact"
            type="text"
            inputMode="email"
            autoComplete="username"
            placeholder="例如 player@takoyaki.tw"
            value={contact}
            onChange={(event) => setContact(event.target.value)}
            aria-invalid={error ? true : undefined}
            aria-describedby={error ? 'forgot-contact-error' : undefined}
          />
        </div>
        {error && (
          <p id="forgot-contact-error" className="forgot-form__error">
            ⚠ {error}
          </p>
        )}
      </div>

      <button type="submit" className="forgot-form__submit">
        重設密碼
      </button>

      <p className="forgot-form__notice" role="status">
        {isSent ? `✓ ${SENT_MESSAGE}` : ''}
      </p>

      <p className="forgot-form__back">
        想起來了？<Link to="/login">返回登入</Link>
      </p>
    </form>
  );
}
