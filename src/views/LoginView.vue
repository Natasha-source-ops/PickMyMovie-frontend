<template>
  <main class="login-page">
    <RouterLink to="/" class="back-link">← Back</RouterLink>

    <section class="auth-card">
      <div class="brand">
        <p class="brand-name">PickMyMovie</p>
        <p class="brand-subtitle">Find your next favorite movie.</p>
      </div>

      <form v-if="!isRegisterActive" @submit.prevent="handleLogin">
        <h1>Log In</h1>
        <p class="auth-description">Welcome back. Continue managing your movies.</p>

        <input v-model="loginUsername" type="text" placeholder="Username or Email" />

        <div class="password-field">
          <input
            v-model="loginPassword"
            :type="passwordVisible ? 'text' : 'password'"
            placeholder="Password"
          />

          <button type="button" class="show-button" @click="togglePassword">
            {{ passwordVisible ? 'Hide' : 'Show' }}
          </button>
        </div>

        <button class="submit-button" type="submit">Log In</button>

        <p class="switch-text">
          New here?
          <button type="button" @click="showSignUp">Create an account</button>
        </p>
      </form>

      <form v-else @submit.prevent="handleRegister">
        <h1>Create Account</h1>
        <p class="auth-description">Save movies, write reviews and build your watchlist.</p>

        <input v-model="registerName" type="text" placeholder="Username" />
        <input v-model="registerEmail" type="email" placeholder="Email" />

        <div class="password-field">
          <input
            v-model="registerPassword"
            :type="passwordVisible ? 'text' : 'password'"
            placeholder="Password"
          />

          <button type="button" class="show-button" @click="togglePassword">
            {{ passwordVisible ? 'Hide' : 'Show' }}
          </button>
        </div>

        <button class="submit-button" type="submit">Sign Up</button>

        <p class="switch-text">
          Already have an account?
          <button type="button" @click="showSignIn">Log in</button>
        </p>
      </form>

      <p v-if="message" class="message">{{ message }}</p>
    </section>
  </main>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink, useRouter } from 'vue-router'

interface User {
  id: number
  username: string
  email: string
  password?: string
}

const router = useRouter()

const apiBaseUrl =
  import.meta.env.VITE_API_BASE_URL ||
  'https://pickmymovie-backend-reem-natasha-4.onrender.com'

const isRegisterActive = ref(false)

const loginUsername = ref('')
const loginPassword = ref('')

const registerName = ref('')
const registerEmail = ref('')
const registerPassword = ref('')

const passwordVisible = ref(false)
const passwordWrong = ref(false)

const message = ref('')

function showSignIn() {
  isRegisterActive.value = false
  message.value = ''
  passwordVisible.value = false
}

function showSignUp() {
  isRegisterActive.value = true
  message.value = ''
  passwordVisible.value = false
}

function togglePassword() {
  passwordVisible.value = !passwordVisible.value
}

async function handleRegister() {
  message.value = ''

  const response = await fetch(`${apiBaseUrl}/users`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      username: registerName.value,
      email: registerEmail.value,
      password: registerPassword.value
    })
  })

  if (!response.ok) {
    message.value = 'Registration failed.'
    return
  }

  message.value = 'Account created. You can now sign in.'
  isRegisterActive.value = false

  loginUsername.value = registerName.value
  loginPassword.value = ''
}

async function handleLogin() {
  message.value = ''

  const response = await fetch(`${apiBaseUrl}/users/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      username: loginUsername.value,
      password: loginPassword.value
    })
  })

  if (response.status === 400) {
    showWrongPasswordAnimation()
    message.value = 'Please enter username/email and password.'
    return
  }

  if (response.status === 404) {
    showWrongPasswordAnimation()
    message.value = 'User does not exist.'
    return
  }

  if (response.status === 401) {
    showWrongPasswordAnimation()
    message.value = 'Username/email or password is incorrect.'
    return
  }

  if (!response.ok) {
    showWrongPasswordAnimation()
    message.value = 'Login failed. Please try again.'
    return
  }

  const user = (await response.json()) as User | null

  if (!user || !user.id) {
    showWrongPasswordAnimation()
    message.value = 'Login failed. Please try again.'
    return
  }

  localStorage.setItem('currentUser', JSON.stringify(user))
  localStorage.setItem('currentUserId', String(user.id))

  message.value = 'Login successful.'
  await router.push('/')
}

function showWrongPasswordAnimation() {
  passwordWrong.value = true

  setTimeout(() => {
    passwordWrong.value = false
  }, 1200)
}
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  background: #050505;
  color: white;
  font-family: Inter, sans-serif;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
}

.back-link {
  position: absolute;
  top: 24px;
  left: 24px;
  color: #facc15;
  text-decoration: none;
  font-weight: 800;
}

.auth-card {
  width: 100%;
  max-width: 430px;
  background: #111827;
  border: 1px solid rgba(250, 204, 21, 0.3);
  border-radius: 24px;
  padding: 32px;
  box-shadow: 0 30px 80px rgba(250, 204, 21, 0.14);
}

.brand {
  text-align: center;
  margin-bottom: 28px;
}

.brand-name {
  color: #facc15;
  font-size: 28px;
  font-weight: 900;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  margin: 0;
}

.brand-subtitle {
  color: #9ca3af;
  margin: 8px 0 0;
  font-size: 15px;
}

h1 {
  color: #f8f1e7;
  margin: 0 0 8px;
  text-align: center;
}

.auth-description {
  color: #d1d5db;
  text-align: center;
  margin-bottom: 24px;
  line-height: 1.5;
}

form {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

input {
  width: 100%;
  box-sizing: border-box;
  background: #050505;
  border: 1px solid #facc15;
  color: white;
  padding: 14px 16px;
  border-radius: 14px;
  outline: none;
}

input:focus {
  border-color: #e0a93b;
  box-shadow: 0 0 0 3px rgba(250, 204, 21, 0.18);
}

.password-field {
  position: relative;
}

.password-field input {
  padding-right: 86px;
}

.show-button {
  position: absolute;
  right: 8px;
  top: 8px;
  border: none;
  border-radius: 18px;
  background: #facc15;
  color: #1c1308;
  font-weight: 900;
  padding: 8px 12px;
  cursor: pointer;
}

.submit-button {
  margin-top: 8px;
  border: none;
  border-radius: 24px;
  background: #facc15;
  color: #1c1308;
  font-weight: 900;
  padding: 13px 24px;
  cursor: pointer;
}

.submit-button:hover,
.show-button:hover {
  background: #e0a93b;
}

.switch-text {
  color: #d1d5db;
  text-align: center;
  margin: 4px 0 0;
}

.switch-text button {
  border: none;
  background: transparent;
  color: #facc15;
  font-weight: 900;
  cursor: pointer;
}

.switch-text button:hover {
  color: #e0a93b;
}

.message {
  color: #facc15;
  font-weight: 800;
  text-align: center;
  margin-top: 16px;
}

@media (max-width: 480px) {
  .auth-card {
    padding: 24px;
  }

  .back-link {
    position: static;
    margin-bottom: 18px;
  }

  .login-page {
    align-items: flex-start;
    padding-top: 24px;
    flex-direction: column;
  }

  .brand-name {
    font-size: 23px;
  }
}
</style>
