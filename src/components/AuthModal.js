// PRINTORA Customer Authentication Modal – Direct Password & Mobile/Email Login System
// Seamless Registration (Name, Mobile, Email, Gender, Password) & Quick Sign-In (Mobile/Email + Password)
// Zero OTP friction as requested

import { renderIcon } from '../utils/icons.js';
import { store } from '../services/store.js';

let activeAuthTab = 'signin'; // 'signin' or 'register'

export function renderAuthModal() {
  return `
    <div id="auth-modal" class="hidden fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div class="relative w-full max-w-md bg-[#FAFAF7] border border-[#DDD4C4] rounded-3xl shadow-2xl overflow-hidden my-6 animate-fade-in text-[#111] font-sans">
        
        <!-- Header Banner -->
        <div class="bg-[#111111] text-white p-5 sm:p-6 text-center relative border-b border-[#222]">
          <button type="button" id="auth-modal-close-btn" class="absolute top-4 right-4 text-[#AAA] hover:text-white p-1 rounded-full hover:bg-white/10 transition-colors cursor-pointer" aria-label="Close">
            <span class="text-lg leading-none">✕</span>
          </button>
          
          <div class="inline-flex items-center gap-1.5 bg-[#222] px-3 py-0.5 rounded-full text-[10px] text-[#FF6B35] uppercase font-bold tracking-widest mb-1.5 font-heading">
            <span>Customer Portal</span>
          </div>
          <h3 class="font-heading text-xl sm:text-2xl font-bold tracking-tight text-white" id="auth-modal-title">Welcome to PRINTORA</h3>
          <p class="text-xs text-[#AAAAAA] mt-0.5" id="auth-modal-sub">Sign in or create your account</p>
        </div>

        <!-- Mode Toggle Tabs -->
        <div class="grid grid-cols-2 bg-[#EFECE4] p-1 border-b border-[#DDD4C4] text-xs font-heading font-bold">
          <button type="button" id="tab-btn-signin" class="py-2.5 rounded-xl transition-all ${activeAuthTab === 'signin' ? 'bg-white text-black shadow-sm' : 'text-[#666] hover:text-black'}">
            Sign In
          </button>
          <button type="button" id="tab-btn-register" class="py-2.5 rounded-xl transition-all ${activeAuthTab === 'register' ? 'bg-white text-black shadow-sm' : 'text-[#666] hover:text-black'}">
            Create Account
          </button>
        </div>

        <!-- Form Body -->
        <div class="p-5 sm:p-6 space-y-4">
          
          <!-- Alerts -->
          <div id="auth-error-box" class="hidden p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl font-medium"></div>
          <div id="auth-success-box" class="hidden p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs rounded-xl font-medium"></div>

          <!-- ==========================================
               SIGN IN FORM (Returning User)
               ========================================== -->
          <form id="auth-signin-form" class="${activeAuthTab === 'signin' ? 'block' : 'hidden'} space-y-3.5">
            <div>
              <label for="auth-signin-contact" class="block text-xs font-bold text-[#444] mb-1">Mobile Number or Email Address *</label>
              <input type="text" id="auth-signin-contact" required placeholder="e.g. 9876543210 or name@example.com" 
                     class="w-full bg-white border border-[#DDD4C4] focus:border-[#FF6B35] rounded-xl px-3.5 py-2.5 text-xs outline-none transition-colors font-medium">
            </div>

            <div>
              <div class="flex items-center justify-between mb-1">
                <label for="auth-signin-password" class="block text-xs font-bold text-[#444]">Password *</label>
                <button type="button" id="toggle-signin-pwd-btn" class="text-[11px] text-[#777] hover:text-black">Show</button>
              </div>
              <input type="password" id="auth-signin-password" required placeholder="Enter your account password" 
                     class="w-full bg-white border border-[#DDD4C4] focus:border-[#FF6B35] rounded-xl px-3.5 py-2.5 text-xs outline-none transition-colors font-medium">
            </div>

            <button type="submit" id="auth-signin-submit-btn" class="w-full bg-[#111111] hover:bg-[#FF6B35] text-white font-extrabold py-3.5 px-4 rounded-xl text-xs uppercase tracking-wider transition-all duration-300 shadow-md cursor-pointer flex items-center justify-center gap-2">
              <span>Sign In to Account</span>
            </button>

            <div class="text-center pt-2">
              <span class="text-xs text-[#777]">New to Printora?</span>
              <button type="button" id="switch-to-register-link" class="text-xs font-bold text-[#FF6B35] hover:underline ml-1 cursor-pointer">
                Create an account
              </button>
            </div>
          </form>

          <!-- ==========================================
               REGISTER FORM (New User)
               ========================================== -->
          <form id="auth-register-form" class="${activeAuthTab === 'register' ? 'block' : 'hidden'} space-y-3">
            <div>
              <label for="auth-reg-name" class="block text-xs font-bold text-[#444] mb-1">Full Name *</label>
              <input type="text" id="auth-reg-name" required placeholder="e.g. Rahul Varma" 
                     class="w-full bg-white border border-[#DDD4C4] focus:border-[#FF6B35] rounded-xl px-3.5 py-2 text-xs outline-none transition-colors font-medium">
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div>
                <label for="auth-reg-phone" class="block text-xs font-bold text-[#444] mb-1">Mobile Number *</label>
                <div class="flex">
                  <span class="inline-flex items-center px-2.5 text-xs font-bold text-[#666] bg-[#EFEAE0] border border-r-0 border-[#DDD4C4] rounded-l-xl">+91</span>
                  <input type="tel" id="auth-reg-phone" required pattern="[0-9]{10}" maxlength="10" placeholder="10 digits" 
                         class="w-full bg-white border border-[#DDD4C4] focus:border-[#FF6B35] rounded-r-xl px-3 py-2 text-xs outline-none transition-colors font-medium">
                </div>
              </div>

              <div>
                <label for="auth-reg-gender" class="block text-xs font-bold text-[#444] mb-1">Gender *</label>
                <select id="auth-reg-gender" required class="w-full bg-white border border-[#DDD4C4] focus:border-[#FF6B35] rounded-xl px-3 py-2 text-xs outline-none transition-colors font-bold cursor-pointer">
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>
            </div>

            <div>
              <label for="auth-reg-email" class="block text-xs font-bold text-[#444] mb-1">Email Address *</label>
              <input type="email" id="auth-reg-email" required placeholder="you@example.com" 
                     class="w-full bg-white border border-[#DDD4C4] focus:border-[#FF6B35] rounded-xl px-3.5 py-2 text-xs outline-none transition-colors font-medium">
            </div>

            <div>
              <div class="flex items-center justify-between mb-1">
                <label for="auth-reg-password" class="block text-xs font-bold text-[#444]">Set Password *</label>
                <button type="button" id="toggle-reg-pwd-btn" class="text-[11px] text-[#777] hover:text-black">Show</button>
              </div>
              <input type="password" id="auth-reg-password" required minlength="4" placeholder="Minimum 4 characters" 
                     class="w-full bg-white border border-[#DDD4C4] focus:border-[#FF6B35] rounded-xl px-3.5 py-2 text-xs outline-none transition-colors font-medium">
            </div>

            <button type="submit" id="auth-register-submit-btn" class="w-full bg-[#111111] hover:bg-[#FF6B35] text-white font-extrabold py-3.5 px-4 rounded-xl text-xs uppercase tracking-wider transition-all duration-300 shadow-md cursor-pointer flex items-center justify-center gap-2 mt-2">
              <span>Create Account & Sign In</span>
            </button>

            <div class="text-center pt-2">
              <span class="text-xs text-[#777]">Already have an account?</span>
              <button type="button" id="switch-to-signin-link" class="text-xs font-bold text-[#FF6B35] hover:underline ml-1 cursor-pointer">
                Sign In
              </button>
            </div>
          </form>

          <!-- Security note -->
          <div class="pt-2 text-center border-t border-[#EFECE4]">
            <p class="text-[11px] text-[#888]">
              🔒 256-Bit Secure Encryption • Zero Delivery Fee on All Orders
            </p>
          </div>

        </div>

      </div>
    </div>
  `;
}

export function openAuthModal(callback) {
  const modal = document.getElementById('auth-modal');
  if (modal) {
    modal.classList.remove('hidden');
    window._authSuccessCallback = callback;
  }
}

export function closeAuthModal() {
  const modal = document.getElementById('auth-modal');
  if (modal) modal.classList.add('hidden');
}

export function initAuthModalEvents() {
  const modal = document.getElementById('auth-modal');
  const closeBtn = document.getElementById('auth-modal-close-btn');
  const tabSignIn = document.getElementById('tab-btn-signin');
  const tabRegister = document.getElementById('tab-btn-register');
  const formSignIn = document.getElementById('auth-signin-form');
  const formRegister = document.getElementById('auth-register-form');
  const linkToRegister = document.getElementById('switch-to-register-link');
  const linkToSignIn = document.getElementById('switch-to-signin-link');
  const errorBox = document.getElementById('auth-error-box');
  const successBox = document.getElementById('auth-success-box');

  const switchTab = (tab) => {
    activeAuthTab = tab;
    if (errorBox) errorBox.classList.add('hidden');
    if (successBox) successBox.classList.add('hidden');

    if (tab === 'signin') {
      tabSignIn?.classList.add('bg-white', 'text-black', 'shadow-sm');
      tabSignIn?.classList.remove('text-[#666]');
      tabRegister?.classList.remove('bg-white', 'text-black', 'shadow-sm');
      tabRegister?.classList.add('text-[#666]');
      if (formSignIn) formSignIn.className = 'block space-y-3.5';
      if (formRegister) formRegister.className = 'hidden';
      const titleEl = document.getElementById('auth-modal-title');
      const subEl = document.getElementById('auth-modal-sub');
      if (titleEl) titleEl.textContent = 'Sign In to PRINTORA';
      if (subEl) subEl.textContent = 'Enter your mobile or email and password';
    } else {
      tabRegister?.classList.add('bg-white', 'text-black', 'shadow-sm');
      tabRegister?.classList.remove('text-[#666]');
      tabSignIn?.classList.remove('bg-white', 'text-black', 'shadow-sm');
      tabSignIn?.classList.add('text-[#666]');
      if (formRegister) formRegister.className = 'block space-y-3';
      if (formSignIn) formSignIn.className = 'hidden';
      const titleEl = document.getElementById('auth-modal-title');
      const subEl = document.getElementById('auth-modal-sub');
      if (titleEl) titleEl.textContent = 'Create PRINTORA Account';
      if (subEl) subEl.textContent = 'Quick registration with mobile & password';
    }
  };

  if (tabSignIn) tabSignIn.addEventListener('click', () => switchTab('signin'));
  if (tabRegister) tabRegister.addEventListener('click', () => switchTab('register'));
  if (linkToRegister) linkToRegister.addEventListener('click', () => switchTab('register'));
  if (linkToSignIn) linkToSignIn.addEventListener('click', () => switchTab('signin'));

  if (closeBtn && modal) {
    closeBtn.addEventListener('click', closeAuthModal);
  }

  // Password visibility toggles
  const toggleSignInPwd = document.getElementById('toggle-signin-pwd-btn');
  const signInPwdInput = document.getElementById('auth-signin-password');
  if (toggleSignInPwd && signInPwdInput) {
    toggleSignInPwd.addEventListener('click', () => {
      const isPwd = signInPwdInput.type === 'password';
      signInPwdInput.type = isPwd ? 'text' : 'password';
      toggleSignInPwd.textContent = isPwd ? 'Hide' : 'Show';
    });
  }

  const toggleRegPwd = document.getElementById('toggle-reg-pwd-btn');
  const regPwdInput = document.getElementById('auth-reg-password');
  if (toggleRegPwd && regPwdInput) {
    toggleRegPwd.addEventListener('click', () => {
      const isPwd = regPwdInput.type === 'password';
      regPwdInput.type = isPwd ? 'text' : 'password';
      toggleRegPwd.textContent = isPwd ? 'Hide' : 'Show';
    });
  }

  const showAuthError = (msg) => {
    if (errorBox) {
      errorBox.textContent = msg;
      errorBox.classList.remove('hidden');
    }
    if (successBox) successBox.classList.add('hidden');
  };

  const showAuthSuccess = (msg) => {
    if (successBox) {
      successBox.textContent = msg;
      successBox.classList.remove('hidden');
    }
    if (errorBox) errorBox.classList.add('hidden');
  };

  const completeAuth = (user) => {
    const firstName = user.name.split(' ')[0];
    const greetingEl = document.getElementById('nav-user-greeting');
    if (greetingEl) greetingEl.textContent = `Hi, ${firstName}`;
    const topGreetingEl = document.getElementById('top-announcement-greeting');
    if (topGreetingEl) topGreetingEl.textContent = `Hi, ${firstName}!`;
    try { localStorage.setItem('printora_customer_name', firstName); } catch (e) {}

    // Apply recommendations
    if (user.gender) {
      store.setUserGender(user.gender);
    }

    store.showToast(`Welcome ${firstName}!`, 'success');
    closeAuthModal();

    if (typeof window._authSuccessCallback === 'function') {
      window._authSuccessCallback(user);
      window._authSuccessCallback = null;
    }
  };

  // Sign In Submission
  if (formSignIn) {
    formSignIn.addEventListener('submit', (e) => {
      e.preventDefault();
      const contact = document.getElementById('auth-signin-contact')?.value.trim();
      const password = document.getElementById('auth-signin-password')?.value;

      if (!contact || !password) {
        showAuthError("Please fill in both your mobile/email and password.");
        return;
      }

      const res = store.loginUser({ contact, password });
      if (res.success) {
        showAuthSuccess("Signed in successfully!");
        setTimeout(() => completeAuth(res.user), 400);
      } else {
        showAuthError(res.message);
      }
    });
  }

  // Register Submission
  if (formRegister) {
    formRegister.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('auth-reg-name')?.value.trim();
      const phone = document.getElementById('auth-reg-phone')?.value.trim();
      const email = document.getElementById('auth-reg-email')?.value.trim();
      const gender = document.getElementById('auth-reg-gender')?.value;
      const password = document.getElementById('auth-reg-password')?.value;

      if (!name || !phone || !email || !gender || !password) {
        showAuthError("Please complete all registration fields.");
        return;
      }

      const res = store.registerUser({ name, phone, email, gender, password });
      if (res.success) {
        showAuthSuccess("Account created successfully!");
        setTimeout(() => completeAuth(res.user), 400);
      } else {
        showAuthError(res.message);
      }
    });
  }
}
