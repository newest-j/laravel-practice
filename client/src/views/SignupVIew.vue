<template>
  <div class="signup-container">
    <div class="form-card">
      <h2>Create an Account</h2>
      <form @submit.prevent="onSubmit">
        <div class="form-group">
          <label for="name">Full Name</label>
          <input
            id="name"
            type="text"
            placeholder="John Doe"
            v-model="userAuth.name"
            autocomplete="name"
            @blur="userAuth.validateName"
          />
          <small v-if="userAuth.error.name" class="err">{{ userAuth.error.name }}</small>
        </div>

        <div class="form-group">
          <label for="email">Email Address</label>
          <input
            id="email"
            type="email"
            placeholder="you@example.com"
            v-model.trim="userAuth.email"
            autocomplete="email"
            @blur="userAuth.validateEmail"
          />
          <small v-if="userAuth.error.email" class="err">{{ userAuth.error.email }}</small>
        </div>

        <div class="form-group">
          <label for="password">Password</label>
          <input
            id="password"
            type="password"
            placeholder="Test1234#"
            v-model="userAuth.password"
            autocomplete="new-password"
            @blur="userAuth.validatePassword"
          />
          <small v-if="userAuth.error.password" class="err">{{ userAuth.error.password }}</small>
        </div>

        <div class="form-group">
          <label for="confirmPassword">Confirm Password</label>
          <input
            id="confirmPassword"
            name="password_confirmation"
            type="password"
            placeholder="••••••••"
            v-model="userAuth.confirmPassword"
            autocomplete="new-password"
            @blur="userAuth.validateConfirmPassword"
          />
          <small v-if="userAuth.error.confirmPassword" class="err">{{
            userAuth.error.confirmPassword
          }}</small>
        </div>

        <button type="submit" class="signup-btn" :disabled="userAuth.isLoading">
          <span v-if="!userAuth.isLoading">Sign Up</span>
          <span v-else>Processing...</span>
        </button>

        <p class="login-link">
          Already have an account?
          <router-link :to="{ name: 'login' }">Log in</router-link>
        </p>

        <button type="button" @click="continueWithGoogle">Signup with Google</button>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
// No logic yet — you’ll handle that yourself
import { userAuthStore } from '../stores/UserStore'
import { useRouter } from 'vue-router'

const userAuth = userAuthStore()
const router = useRouter()

const onSubmit = async () => {
  await userAuth.handleSubmit(router)
}

const continueWithGoogle = () => {
  // this window.location gets the read only object property of the currecnt location and the href route to the url provide
  // so basically this get the current url and replace it with the provided url routing it there
  window.location.href = 'http://localhost:8000/auth/google/redirect/signup'
}
</script>

<style scoped>
.signup-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: #f5f7fa;
  padding: 1rem;
}

.form-card {
  background: #fff;
  padding: 2rem;
  border-radius: 12px;
  max-width: 400px;
  width: 100%;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.08);
}

h2 {
  text-align: center;
  margin-bottom: 1.5rem;
  color: #333;
}

.form-group {
  margin-bottom: 1rem;
}

label {
  display: block;
  margin-bottom: 0.4rem;
  font-weight: 600;
  color: #444;
}

input {
  width: 100%;
  padding: 0.7rem;
  border: 1px solid #ccc;
  border-radius: 8px;
  outline: none;
  transition: border 0.3s;
}

input:focus {
  border-color: #4f46e5;
}

.signup-btn {
  width: 100%;
  padding: 0.8rem;
  background: #4f46e5;
  color: #fff;
  font-weight: 600;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.3s;
}

.signup-btn:hover {
  background: #4338ca;
}

.login-link {
  text-align: center;
  margin-top: 1rem;
  font-size: 0.9rem;
  color: #555;
}

.login-link a {
  color: #4f46e5;
  text-decoration: none;
}

.login-link a:hover {
  text-decoration: underline;
}

.err {
  color: #d93025;
  font-size: 0.75rem;
  display: block;
  margin-top: 0.25rem;
}
button[disabled] {
  opacity: 0.7;
  cursor: not-allowed;
}
</style>
