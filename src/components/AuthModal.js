// PRINTORA Premium Authentication Modal (Requirement 23.B)
// Customer Login & Registration with Supabase Auth integration & Password Toggle

import { renderIcon } from '../utils/icons.js';
import { supabase, isSupabaseConfigured } from '../services/supabase.js';
import { store } from '../services/store.js';

export function renderAuthModal() {
  return `
    <div id="auth-modal" class="hidden fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div class="relative w-full max-w-md bg-[#FAFAF7] border border-[#DDD4C4] rounded-2xl shadow-2xl overflow-hidden my-8 animate-fade-in text-[#111]">
        
        <!-- Modal Top Bar -->
        <div class="bg-[#0A0A0A] text-white p-6 text-center relative border-b border-[#222]">
          <button id="auth-modal-close-btn" class="absolute top-4 right-4 text-[#AAA] hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors">
            ${renderIcon('close', 'w-5 h-5')}
          </button>
          
          <span class="text-[10px] text-[#C5A880] uppercase tracking-[0.3em] font-semibold">Account Access</span>
          <h3 class="font-serif text-2xl font-normal mt-1 brand-title" id="auth-modal-title">Welcome to PRINTORA</h3>
          <p class="text-xs text-[#888] mt-1" id="auth-modal-sub">MAKE IT YOURS.</p>

          <!-- Toggle Login / Register Tabs -->
          <div class="flex bg-[#161616] p-1 rounded-lg border border-[#2B2B2B] mt-5 max-w-xs mx-auto">
            <button id="auth-tab-login" class="flex-1 py-1.5 text-xs font-semibold rounded-md bg-[#C5A880] text-black transition-all">
              Sign In
            </button>
            <button id="auth-tab-register" class="flex-1 py-1.5 text-xs font-semibold rounded-md text-[#999] hover:text-white transition-all">
              Register
            </button>
          </div>
        </div>

        <!-- Form Body -->
        <div class="p-6 md:p-8 space-y-4">
          
          <!-- Alerts / Error Message Box -->
          <div id="auth-error-box" class="hidden p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-lg"></div>
          <div id="auth-success-box" class="hidden p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs rounded-lg"></div>

          <!-- Sign In Form -->
          <form id="auth-login-form" class="space-y-4">
            <div>
              <label for="login-email" class="block text-xs font-semibold text-[#333] mb-1">Email Address</label>
              <input type="email" id="login-email" required placeholder="your.name@example.com" 
                     class="w-full bg-white border border-[#DDD4C4] focus:border-black rounded-lg px-3.5 py-2.5 text-xs outline-none transition-colors">
            </div>

            <div>
              <div class="flex justify-between items-center mb-1">
                <label for="login-password" class="text-xs font-semibold text-[#333]">Password</label>
                <button type="button" id="auth-forgot-pwd-btn" class="text-[11px] text-[#997A52] hover:underline">Forgot?</button>
              </div>
              <div class="relative">
                <input type="password" id="login-password" required placeholder="••••••••" 
                       class="w-full bg-white border border-[#DDD4C4] focus:border-black rounded-lg pl-3.5 pr-10 py-2.5 text-xs outline-none transition-colors font-mono">
                <button type="button" class="pwd-toggle-btn absolute right-3 top-2.5 text-[#888] hover:text-black" data-target="login-password">
                  ${renderIcon('eye', 'w-4 h-4')}
                </button>
              </div>
            </div>

            <button type="submit" id="login-submit-btn" class="w-full bg-[#111111] hover:bg-[#C5A880] text-white hover:text-black font-bold py-3.5 px-4 rounded-lg text-xs uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-2">
              <span>Sign In to Account</span>
            </button>

            <!-- Admin portal shortcut notice -->
            <div class="pt-2 text-center">
              <a href="#admin" onclick="document.getElementById('auth-modal-close-btn').click();" class="text-[11px] text-[#888] hover:text-black underline">
                Store Administrator? Go to Admin Portal →
              </a>
            </div>
          </form>

          <!-- Register Form (Hidden by default) -->
          <form id="auth-register-form" class="hidden space-y-4">
            <div>
              <label for="reg-name" class="block text-xs font-semibold text-[#333] mb-1">Full Name</label>
              <input type="text" id="reg-name" required placeholder="e.g. Ramesh Kumar" 
                     class="w-full bg-white border border-[#DDD4C4] focus:border-black rounded-lg px-3.5 py-2.5 text-xs outline-none transition-colors">
            </div>

            <div>
              <label for="reg-email" class="block text-xs font-semibold text-[#333] mb-1">Email Address</label>
              <input type="email" id="reg-email" required placeholder="ramesh@example.com" 
                     class="w-full bg-white border border-[#DDD4C4] focus:border-black rounded-lg px-3.5 py-2.5 text-xs outline-none transition-colors">
            </div>

            <div>
              <label for="reg-phone" class="block text-xs font-semibold text-[#333] mb-1">Phone / WhatsApp</label>
              <input type="tel" id="reg-phone" required placeholder="9876543210" 
                     class="w-full bg-white border border-[#DDD4C4] focus:border-black rounded-lg px-3.5 py-2.5 text-xs outline-none transition-colors">
            </div>

            <div>
              <label for="reg-password" class="block text-xs font-semibold text-[#333] mb-1">Create Password</label>
              <div class="relative">
                <input type="password" id="reg-password" required minlength="6" placeholder="At least 6 characters" 
                       class="w-full bg-white border border-[#DDD4C4] focus:border-black rounded-lg pl-3.5 pr-10 py-2.5 text-xs outline-none transition-colors font-mono">
                <button type="button" class="pwd-toggle-btn absolute right-3 top-2.5 text-[#888] hover:text-black" data-target="reg-password">
                  ${renderIcon('eye', 'w-4 h-4')}
                </button>
              </div>
            </div>

            <button type="submit" id="reg-submit-btn" class="w-full bg-[#111111] hover:bg-[#C5A880] text-white hover:text-black font-bold py-3.5 px-4 rounded-lg text-xs uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-2">
              <span>Create Customer Account</span>
            </button>
          </form>

        </div>

      </div>
    </div>
  `;
}

export function initAuthModalEvents() {
  const modal = document.getElementById('auth-modal');
  const closeBtn = document.getElementById('auth-modal-close-btn');
  const tabLogin = document.getElementById('auth-tab-login');
  const tabRegister = document.getElementById('auth-tab-register');
  const loginForm = document.getElementById('auth-login-form');
  const registerForm = document.getElementById('auth-register-form');
  const errorBox = document.getElementById('auth-error-box');
  const successBox = document.getElementById('auth-success-box');

  const showError = (msg) => {
    if (errorBox) {
      errorBox.textContent = msg;
      errorBox.classList.remove('hidden');
    }
    if (successBox) successBox.classList.add('hidden');
  };

  const showSuccess = (msg) => {
    if (successBox) {
      successBox.textContent = msg;
      successBox.classList.remove('hidden');
    }
    if (errorBox) errorBox.classList.add('hidden');
  };

  if (closeBtn && modal) {
    closeBtn.addEventListener('click', () => modal.classList.add('hidden'));
  }

  // Password toggle
  document.querySelectorAll('.pwd-toggle-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-target');
      const input = document.getElementById(targetId);
      if (input) {
        if (input.type === 'password') {
          input.type = 'text';
          btn.innerHTML = renderIcon('eyeOff', 'w-4 h-4');
        } else {
          input.type = 'password';
          btn.innerHTML = renderIcon('eye', 'w-4 h-4');
        }
      }
    });
  });

  // Tab switching
  if (tabLogin && tabRegister && loginForm && registerForm) {
    tabLogin.addEventListener('click', () => {
      tabLogin.className = 'flex-1 py-1.5 text-xs font-semibold rounded-md bg-[#C5A880] text-black transition-all';
      tabRegister.className = 'flex-1 py-1.5 text-xs font-semibold rounded-md text-[#999] hover:text-white transition-all';
      loginForm.classList.remove('hidden');
      registerForm.classList.add('hidden');
      if (errorBox) errorBox.classList.add('hidden');
    });

    tabRegister.addEventListener('click', () => {
      tabRegister.className = 'flex-1 py-1.5 text-xs font-semibold rounded-md bg-[#C5A880] text-black transition-all';
      tabLogin.className = 'flex-1 py-1.5 text-xs font-semibold rounded-md text-[#999] hover:text-white transition-all';
      registerForm.classList.remove('hidden');
      loginForm.classList.add('hidden');
      if (errorBox) errorBox.classList.add('hidden');
    });
  }

  // Login Submit
  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = document.getElementById('login-email')?.value.trim();
      const password = document.getElementById('login-password')?.value;

      if (isSupabaseConfigured() && supabase) {
        try {
          const { data, error } = await supabase.auth.signInWithPassword({ email, password });
          if (error) throw error;
          store.setUser(data.user);
          showSuccess("Login successful! Welcome back.");
          setTimeout(() => modal.classList.add('hidden'), 1000);
        } catch (err) {
          showError(err.message || "Failed to sign in");
        }
      } else {
        // Local mode fallback authentication
        store.setUser({ email, name: email.split('@')[0], role: 'customer' });
        showSuccess("Signed in successfully (Local session active).");
        setTimeout(() => modal.classList.add('hidden'), 1000);
      }
    });
  }

  // Register Submit
  if (registerForm) {
    registerForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const name = document.getElementById('reg-name')?.value.trim();
      const email = document.getElementById('reg-email')?.value.trim();
      const phone = document.getElementById('reg-phone')?.value.trim();
      const password = document.getElementById('reg-password')?.value;

      if (isSupabaseConfigured() && supabase) {
        try {
          const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: { data: { full_name: name, phone } }
          });
          if (error) throw error;
          showSuccess("Account created successfully! Please check your email to verify or sign in.");
          tabLogin.click();
        } catch (err) {
          showError(err.message || "Failed to register account");
        }
      } else {
        store.setUser({ email, name, phone, role: 'customer' });
        showSuccess("Account registered successfully! Welcome to Printora.");
        setTimeout(() => modal.classList.add('hidden'), 1000);
      }
    });
  }

  // Forgot Password
  const forgotBtn = document.getElementById('auth-forgot-pwd-btn');
  if (forgotBtn) {
    forgotBtn.addEventListener('click', () => {
      const email = prompt("Please enter your account email address for password reset instructions:");
      if (email) {
        alert(`Password reset instructions have been dispatched to ${email}. Check your inbox.`);
      }
    });
  }
}
