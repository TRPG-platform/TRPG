import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router';
import googleLogo from './google-logo.svg';
import discordLogo from './discord-logo.svg';

type Field = 'account' | 'password';
type Errors = Partial<Record<Field, string>>;

const ERROR_MESSAGES: Record<Field, string> = {
  account: '請輸入帳號',
  password: '請輸入密碼',
};

/** 登入框（Figma TV-4 右側）。目前只做畫面和假登入，真的登入等後端登入票。 */
export default function LoginForm() {
  const [account, setAccount] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const [errors, setErrors] = useState<Errors>({});
  const [isSocialNoticeShown, setIsSocialNoticeShown] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    // 用 <form> 的 onSubmit：在任一欄按 Enter 都等於按「立即登入」
    event.preventDefault();

    const nextErrors: Errors = {};
    if (account.trim() === '') nextErrors.account = ERROR_MESSAGES.account;
    if (password === '') nextErrors.password = ERROR_MESSAGES.password;
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    // TODO(#10)：把假登入開關切成「已登入」，再導回原本被擋下來的頁面。
    // TODO(後端登入票)：改成呼叫 api/ 資料存取層的登入。
    navigate('/');
  }

  return (
    <form className="login-form" onSubmit={handleSubmit} noValidate>
      <div className="login-form__field">
        <label htmlFor="login-account">帳號</label>
        <input
          id="login-account"
          name="account"
          type="text"
          autoComplete="username"
          placeholder="請輸入帳號"
          value={account}
          onChange={(event) => setAccount(event.target.value)}
          aria-invalid={errors.account ? true : undefined}
          aria-describedby={errors.account ? 'login-account-error' : undefined}
        />
        {errors.account && (
          <p id="login-account-error" className="login-form__error">
            ⚠ {errors.account}
          </p>
        )}
      </div>

      <div className="login-form__field">
        <label htmlFor="login-password">密碼</label>
        <input
          id="login-password"
          name="password"
          type="password"
          autoComplete="current-password"
          placeholder="請輸入密碼"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          aria-invalid={errors.password ? true : undefined}
          aria-describedby={errors.password ? 'login-password-error' : undefined}
        />
        {errors.password && (
          <p id="login-password-error" className="login-form__error">
            ⚠ {errors.password}
          </p>
        )}
      </div>

      <button type="submit" className="login-form__submit">
        立即登入
      </button>

      {/* Google／Discord 登入要不要做、哪一階段做，開會再決定；先放按鈕 */}
      <div className="login-form__social">
        <button
          type="button"
          className="login-form__social-button"
          onClick={() => setIsSocialNoticeShown(true)}
        >
          <img className="login-form__social-logo" src={googleLogo} alt="" />
          使用 Google 帳號
        </button>
        <button
          type="button"
          className="login-form__social-button"
          onClick={() => setIsSocialNoticeShown(true)}
        >
          <img className="login-form__social-logo" src={discordLogo} alt="" />
          使用 Discord 帳號
        </button>
      </div>
      <p className="login-form__notice" role="status">
        {isSocialNoticeShown ? '這個登入方式尚未開放' : ''}
      </p>

      <p className="login-form__register">
        沒有帳號嗎？<a href="/register">立即註冊</a>
      </p>
    </form>
  );
}
