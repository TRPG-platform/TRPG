import { useState, type FormEvent } from 'react';
import { Link } from 'react-router';

const EMPTY_ERROR = '請輸入 Email';
// 不管帳號存不存在都顯示同一句，避免有人用這頁猜出誰有註冊
const SENT_MESSAGE = '如果這個帳號存在，我們已寄出重設密碼的說明';

/**
 * 忘記密碼表單。目前只做畫面和假送出，真的寄信等後端的票。
 * 只收 Email：寄信幾乎免費，簡訊要錢，主流 TRPG 平台也都只用 Email。
 */
export default function ForgotPasswordForm() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isSent, setIsSent] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    // 用 <form> 的 onSubmit：在欄位按 Enter 也等於按「重設密碼」
    event.preventDefault();

    if (email.trim() === '') {
      setError(EMPTY_ERROR);
      setIsSent(false);
      return;
    }

    setError('');
    // TODO(後端重設密碼票)：改成呼叫 api/ 資料存取層，真的寄信。
    setIsSent(true);
  }

  return (
    <form className="forgot-form" onSubmit={handleSubmit} noValidate>
      <div className="forgot-form__field">
        <label htmlFor="forgot-email">Email</label>
        <input
          id="forgot-email"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="player@takoyaki.tw"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? 'forgot-email-error' : undefined}
        />
        {error && (
          <p id="forgot-email-error" className="forgot-form__error">
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
