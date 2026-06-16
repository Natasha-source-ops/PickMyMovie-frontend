<template>
  <main class="login-page">
    <RouterLink to="/" class="back-link">← Zurück</RouterLink>

    <section class="login-layout">
      <div
        class="illustration"
        :class="{
          hidden: passwordVisible,
          active: passwordFocused,
          scattered: isScattered,
        }"
      >
        <div class="orb orb-one"></div>
        <div class="orb orb-two"></div>

        <div class="character big-character" :class="{ wrong: passwordWrong }">
          <div class="eye left"></div>
          <div class="eye right"></div>
          <div class="mouth"></div>
          <div class="arm left-arm"></div>
          <div class="arm right-arm"></div>
        </div>

        <div class="character small-character">
          <div class="eye left"></div>
          <div class="eye right"></div>
        </div>

        <div class="shape triangle"></div>
        <div class="shape square"></div>
        <div class="shape circle"></div>
      </div>

      <div class="container" :class="{ active: isRegisterActive }">
        <div class="form-container sign-up">
          <form @submit.prevent="handleRegister">
            <h1>Create Account</h1>

            <input v-model="registerName" type="text" placeholder="Name" />
            <input v-model="registerEmail" type="email" placeholder="Email" />

            <div class="password-field">
              <input
                v-model="registerPassword"
                :type="passwordVisible ? 'text' : 'password'"
                placeholder="Password"
                autocomplete="new-password"
                @focus="passwordFocused = true"
                @blur="passwordFocused = false"
              />

              <button type="button" class="show-button" @click="togglePassword">
                {{ passwordVisible ? 'Hide' : 'Show' }}
              </button>
            </div>

            <button class="submit-button" type="submit">Sign Up</button>
          </form>
        </div>

        <div class="form-container sign-in">
          <form @submit.prevent="handleLogin">
            <h1>Sign In</h1>

            <input v-model="loginUsername" type="text" placeholder="Username" />

            <div class="password-field">
              <input
                v-model="loginPassword"
                :type="passwordVisible ? 'text' : 'password'"
                placeholder="Password"
                autocomplete="new-password"
                @focus="passwordFocused = true"
                @blur="passwordFocused = false"
              />

              <button type="button" class="show-button" @click="togglePassword">
                {{ passwordVisible ? 'Hide' : 'Show' }}
              </button>
            </div>

            <button class="submit-button" type="submit">Sign In</button>
          </form>
        </div>

        <div class="toggle-container">
          <div class="toggle">
            <div class="toggle-panel toggle-left">
              <h1>Welcome Back!</h1>
              <p>Log in to continue managing your watchlist and ratings.</p>

              <button type="button" @click="showSignIn">
                Sign In
              </button>
            </div>

            <div class="toggle-panel toggle-right">
              <h1>Hello Movie Fan!</h1>
              <p>Create an account to save movies and build your personal watchlist.</p>

              <button type="button" @click="showSignUp">
                Sign Up
              </button>
            </div>
          </div>
        </div>
      </div>
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
const isScattered = ref(false)

const loginUsername = ref('')
const loginPassword = ref('')

const registerName = ref('')
const registerEmail = ref('')
const registerPassword = ref('')

const passwordVisible = ref(false)
const passwordFocused = ref(false)
const passwordWrong = ref(false)

const message = ref('')

function scatterCharacters() {
  isScattered.value = true
}

function showSignIn() {
  isRegisterActive.value = false
  message.value = ''
  scatterCharacters()
}

function showSignUp() {
  isRegisterActive.value = true
  message.value = ''
  scatterCharacters()
}

function togglePassword() {
  passwordVisible.value = !passwordVisible.value
  isScattered.value = passwordVisible.value
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

  if (!response.ok) {
    showWrongPasswordAnimation()
    message.value = 'Login failed.'
    return
  }

  const user = (await response.json()) as User | null

  if (!user || !user.id) {
    showWrongPasswordAnimation()
    message.value = 'Username or password is incorrect.'
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
  padding: 32px;
  position: relative;
  overflow: hidden;
}

.back-link {
  position: absolute;
  top: 28px;
  left: 32px;
  color: #facc15;
  text-decoration: none;
  font-weight: 800;
  z-index: 50;
}

.login-layout {
  width: 1150px;
  max-width: 100%;
  display: grid;
  grid-template-columns: 0.8fr 1.2fr;
  gap: 48px;
  align-items: center;
}

.illustration {
  position: relative;
  min-height: 560px;
}

.character {
  position: absolute;
  background: #facc15;
  box-shadow: 0 24px 60px rgba(250, 204, 21, 0.2);
  transition: transform 0.9s cubic-bezier(0.2, 0.8, 0.2, 1), all 0.45s ease;
}

.big-character {
  width: 220px;
  height: 245px;
  border-radius: 55% 45% 52% 48% / 42% 42% 58% 58%;
  left: 80px;
  top: 125px;
  animation: floatBig 4s ease-in-out infinite;
}

.small-character {
  width: 115px;
  height: 115px;
  border-radius: 50%;
  left: 275px;
  top: 300px;
  background: #8b5e34;
  animation: floatSmall 3.4s ease-in-out infinite;
}

.eye {
  position: absolute;
  width: 22px;
  height: 22px;
  background: #1c1308;
  border-radius: 50%;
  top: 76px;
  transition: all 0.3s ease;
}

.big-character .eye.left {
  left: 60px;
}

.big-character .eye.right {
  right: 60px;
}

.small-character .eye {
  width: 13px;
  height: 13px;
  top: 42px;
  background: #facc15;
}

.small-character .eye.left {
  left: 34px;
}

.small-character .eye.right {
  right: 34px;
}

.mouth {
  position: absolute;
  left: 50%;
  top: 132px;
  width: 46px;
  height: 20px;
  border-bottom: 5px solid #1c1308;
  border-radius: 0 0 40px 40px;
  transform: translateX(-50%);
  transition: all 0.25s ease;
}

.big-character.wrong .eye.left {
  transform: rotate(25deg) scaleY(0.35);
}

.big-character.wrong .eye.right {
  transform: rotate(-25deg) scaleY(0.35);
}

.big-character.wrong .mouth {
  width: 38px;
  height: 28px;
  border-bottom: none;
  border-top: 5px solid #1c1308;
  border-radius: 40px 40px 0 0;
  top: 142px;
}

.big-character.wrong {
  animation: wrongShake 0.25s ease-in-out 4;
}

.arm {
  position: absolute;
  width: 78px;
  height: 28px;
  background: #8b5e34;
  border-radius: 40px;
  top: 160px;
  transition: all 0.45s ease;
}

.left-arm {
  left: -48px;
  transform: rotate(20deg);
}

.right-arm {
  right: -48px;
  transform: rotate(-20deg);
}

.illustration.active .big-character .eye {
  transform: translateY(14px);
}

.illustration.hidden .big-character .eye {
  transform: scaleY(0.15);
}

.illustration.hidden .left-arm {
  left: 40px;
  top: 70px;
  transform: rotate(-18deg);
}

.illustration.hidden .right-arm {
  right: 40px;
  top: 70px;
  transform: rotate(18deg);
}

.orb,
.shape {
  position: absolute;
  opacity: 0.9;
  transition: transform 0.9s cubic-bezier(0.2, 0.8, 0.2, 1);
}

.orb-one {
  width: 105px;
  height: 105px;
  border-radius: 50%;
  background: #5a3825;
  left: 30px;
  top: 70px;
  animation: floatSmall 5s ease-in-out infinite;
}

.orb-two {
  width: 68px;
  height: 68px;
  border-radius: 50%;
  background: #facc15;
  right: 40px;
  top: 110px;
  animation: floatBig 4.5s ease-in-out infinite;
}

.triangle {
  width: 0;
  height: 0;
  border-left: 42px solid transparent;
  border-right: 42px solid transparent;
  border-bottom: 78px solid #facc15;
  left: 35px;
  bottom: 75px;
  animation: rotateShape 7s linear infinite;
}

.square {
  width: 72px;
  height: 72px;
  background: #8b5e34;
  right: 70px;
  bottom: 100px;
  border-radius: 16px;
  animation: floatSmall 4.2s ease-in-out infinite;
}

.circle {
  width: 34px;
  height: 34px;
  background: #f8f1e7;
  border-radius: 50%;
  left: 250px;
  top: 70px;
}

.illustration.scattered .big-character {
  transform: translate(-115px, -85px) rotate(-12deg);
}

.illustration.scattered .small-character {
  transform: translate(105px, 85px) rotate(18deg);
}

.illustration.scattered .orb-one {
  transform: translate(-70px, -45px);
}

.illustration.scattered .orb-two {
  transform: translate(80px, -75px);
}

.illustration.scattered .triangle {
  transform: translate(-80px, 75px) rotate(-25deg);
}

.illustration.scattered .square {
  transform: translate(85px, 80px) rotate(20deg);
}

.illustration.scattered .circle {
  transform: translate(65px, -90px);
}

.container {
  background: #f8f1e7;
  border-radius: 32px;
  box-shadow: 0 30px 80px rgba(250, 204, 21, 0.18);
  position: relative;
  overflow: hidden;
  width: 760px;
  max-width: 100%;
  min-height: 520px;
}

.form-container {
  position: absolute;
  top: 0;
  height: 100%;
  width: 50%;
  transition: all 0.65s ease-in-out;
}

.sign-in {
  left: 0;
  z-index: 2;
}

.sign-up {
  left: 0;
  opacity: 0;
  z-index: 1;
}

.container.active .sign-in {
  transform: translateX(100%);
  opacity: 0;
}

.container.active .sign-up {
  transform: translateX(100%);
  opacity: 1;
  z-index: 5;
}

form {
  height: 100%;
  padding: 0 38px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

form h1 {
  color: #1c1308;
  margin-bottom: 22px;
  font-size: 34px;
}

input {
  width: 100%;
  background: #fffaf0;
  border: 1px solid #8b5e34;
  margin: 8px 0;
  padding: 14px 16px;
  border-radius: 14px;
  outline: none;
  color: #1c1308;
}

input:focus {
  border-color: #facc15;
  box-shadow: 0 0 0 3px rgba(250, 204, 21, 0.25);
}

.password-field {
  width: 100%;
  position: relative;
}

.password-field input {
  padding-right: 86px;
}

.password-field input::-ms-reveal,
.password-field input::-ms-clear {
  display: none;
}

.password-field input::-webkit-credentials-auto-fill-button,
.password-field input::-webkit-caps-lock-indicator,
.password-field input::-webkit-textfield-decoration-container {
  display: none;
  visibility: hidden;
}

.show-button {
  position: absolute;
  right: 8px;
  top: 15px;
  border: none;
  border-radius: 18px;
  background: #1c1308;
  color: #facc15;
  font-weight: 900;
  padding: 10px 16px;
  cursor: pointer;
  margin: 0;
}

.submit-button {
  margin-top: 18px;
  border: none;
  border-radius: 24px;
  background: #facc15;
  color: #1c1308;
  font-weight: 900;
  padding: 12px 34px;
  cursor: pointer;
  transition: transform 0.2s ease, background 0.2s ease;
}

.submit-button:hover,
.show-button:hover {
  transform: translateY(-2px);
  background: #e0a93b;
}

.toggle-container {
  position: absolute;
  left: 50%;
  width: 50%;
  height: 100%;
  overflow: hidden;
  transition: all 0.65s ease-in-out;
  border-radius: 120px 0 0 120px;
  z-index: 10;
}

.container.active .toggle-container {
  transform: translateX(-100%);
  border-radius: 0 120px 120px 0;
}

.toggle {
  background: linear-gradient(135deg, #1c1308, #5a3825, #050505);
  color: white;
  position: relative;
  left: -100%;
  width: 200%;
  height: 100%;
  transform: translateX(0);
  transition: all 0.65s ease-in-out;
}

.container.active .toggle {
  transform: translateX(50%);
}

.toggle-panel {
  position: absolute;
  width: 50%;
  height: 100%;
  padding: 0 34px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  transition: all 0.65s ease-in-out;
}

.toggle-panel h1 {
  color: #facc15;
  font-size: 32px;
}

.toggle-panel p {
  color: #f8f1e7;
  line-height: 1.5;
}

.toggle-panel button {
  margin-top: 18px;
  background: transparent;
  color: #facc15;
  border: 1px solid #facc15;
  border-radius: 24px;
  padding: 12px 34px;
  font-weight: 900;
  cursor: pointer;
}

.toggle-panel button:hover {
  background: #facc15;
  color: #1c1308;
}

.toggle-left {
  transform: translateX(-200%);
}

.container.active .toggle-left {
  transform: translateX(0);
}

.toggle-right {
  right: 0;
  transform: translateX(0);
}

.container.active .toggle-right {
  transform: translateX(200%);
}

@keyframes floatBig {
  0%, 100% {
    margin-top: 0;
  }
  50% {
    margin-top: -18px;
  }
}

@keyframes floatSmall {
  0%, 100% {
    margin-top: 0;
  }
  50% {
    margin-top: 16px;
  }
}

@keyframes rotateShape {
  from {
    rotate: 0deg;
  }
  to {
    rotate: 360deg;
  }
}

@keyframes wrongShake {
  0%, 100% {
    margin-left: 0;
  }
  25% {
    margin-left: -8px;
  }
  75% {
    margin-left: 8px;
  }
}

@media (max-width: 1000px) {
  .login-layout {
    grid-template-columns: 1fr;
  }

  .illustration {
    min-height: 340px;
  }

  .container {
    margin: 0 auto;
  }
}
</style>
