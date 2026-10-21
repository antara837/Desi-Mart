import { getIcon } from './icons.js';
import { deriveDisplayName, isValidEmailFormat, saveSession } from '../services/auth.js';
import { showToast } from './toast.js';

export function initAuthScreen(onSuccess) {
  const authScreenEl = document.getElementById('authScreen');
  if (!authScreenEl) return;

  authScreenEl.innerHTML = `
    <div class="auth-card">
      <div style="text-align: center; margin-bottom: 24px;">
        <h1 class="auth-title" style="font-family: var(--font-serif); font-size: 32px; font-weight: 700; letter-spacing: -0.01em; margin: 0 0 6px 0; color: #1A1A1A;">DesiMart</h1>
        <p style="font-size: 14px; color: var(--text-2); margin: 0; font-family: var(--font-sans);">Sign in to your account</p>
      </div>

      <form id="authForm" novalidate>
        <div class="form-group" style="margin-bottom: 16px;">
          <label class="form-label" for="authIdentifier">Email or username</label>
          <input
            type="text"
            id="authIdentifier"
            class="form-input"
            placeholder="e.g. rahul@example.com or rahul"
            required
            autocomplete="username"
          />
        </div>

        <div class="form-group" style="margin-bottom: 20px;">
          <label class="form-label" for="authPassword">Password</label>
          <div style="position: relative;">
            <input
              type="password"
              id="authPassword"
              class="form-input"
              placeholder="Enter password"
              required
              autocomplete="current-password"
              style="padding-right: 44px;"
            />
            <button
              type="button"
              id="authTogglePasswordBtn"
              class="btn btn--ghost btn--icon-only"
              style="position: absolute; right: 4px; top: 50%; transform: translateY(-50%); width: 36px; height: 36px; color: var(--text-2);"
              aria-label="Toggle password visibility"
            >
              ${getIcon('eye')}
            </button>
          </div>
        </div>

        <div id="authError" class="form-error" style="display: none; margin-bottom: 16px; text-align: center;"></div>

        <button type="submit" id="authSubmitBtn" class="btn btn--full" style="height: 48px;">
          Sign in
        </button>

        <p style="font-size: 13px; color: var(--text-2); text-align: center; margin-top: 16px; line-height: 1.4;">
          Demo sign-in. Any email and password will work.
        </p>
      </form>
    </div>
  `;

  const form = document.getElementById('authForm');
  const identifierInput = document.getElementById('authIdentifier');
  const passwordInput = document.getElementById('authPassword');
  const togglePassBtn = document.getElementById('authTogglePasswordBtn');
  const errorEl = document.getElementById('authError');
  const submitBtn = document.getElementById('authSubmitBtn');

  // Password visibility toggle
  let isPasswordShown = false;
  if (togglePassBtn && passwordInput) {
    togglePassBtn.addEventListener('click', () => {
      isPasswordShown = !isPasswordShown;
      passwordInput.type = isPasswordShown ? 'text' : 'password';
      togglePassBtn.innerHTML = isPasswordShown ? getIcon('eyeOff') : getIcon('eye');
    });
  }

  // Form Submit Handler
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const identifier = identifierInput ? identifierInput.value.trim() : '';
      const password = passwordInput ? passwordInput.value : '';

      errorEl.style.display = 'none';
      errorEl.textContent = '';

      if (!identifier || !password) {
        errorEl.textContent = 'Please enter both an email or username and password.';
        errorEl.style.display = 'block';

        // Error shake animation
        const card = authScreenEl.querySelector('.auth-card');
        if (card) {
          card.classList.remove('shake');
          void card.offsetWidth; // trigger reflow
          card.classList.add('shake');
        }
        return;
      }

      // Show spinner state
      submitBtn.disabled = true;
      submitBtn.innerHTML = `${getIcon('spinner')} Signing in...`;

      setTimeout(() => {
        // Clear password field immediately
        passwordInput.value = '';
        submitBtn.disabled = false;
        submitBtn.textContent = 'Sign in';

        const displayName = deriveDisplayName(identifier);
        const email = isValidEmailFormat(identifier) ? identifier : '';

        const session = saveSession({ displayName, email });

        if (!email) {
          showToast('No valid email address, email not sent');
        } else {
          showToast(`Welcome, ${session.displayName}!`);
        }

        if (typeof onSuccess === 'function') {
          onSuccess(session);
        }
      }, 700);
    });
  }
}
