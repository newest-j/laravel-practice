import { defineStore } from 'pinia'
import Swal from 'sweetalert2'
import type UserSignup from '@/UserData/UserSignup'
import { authuser } from '@/services/api.js'

export const userAuthStore = defineStore('authstore', {
  state: () => ({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    isLoading: false,
    currentUser: null as null | { id: number; name: string; email: string },

    error: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  }),
  getters: {
    isPasswordMatching(state): boolean {
      return state.password === state.confirmPassword
    },
    isAuthenticated(state): boolean {
      // the !! is to make the value return a Boolean
      return !!state.currentUser
    },
  },
  actions: {
    validateName() {
      const fullNameRegex: RegExp = /^[A-Za-z]{2,}(?: [A-Za-z]{2,})+$/
      if (!this.name.trim()) {
        this.error.name = 'Name is required'
      } else if (!fullNameRegex.test(this.name.trim())) {
        this.error.name = 'Please enter your full name (first and last name, letters only)'
      } else {
        this.error.name = ''
      }
    },

    validateEmail() {
      const emailReg: RegExp =
        /^((\+?[0-9\s\-().]{7,})|([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}))$/

      if (!this.email.trim()) {
        this.error.email = 'Email is required'
      } else if (!emailReg.test(this.email.trim())) {
        this.error.email = 'Please enter a valid email address'
      } else {
        this.error.email = ''
      }
    },

    validatePassword() {
      const passwordReg: RegExp =
        /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,20}$/

      if (!this.password.trim()) {
        this.error.password = 'Password is required'
      } else if (!passwordReg.test(this.password.trim())) {
        this.error.password =
          'Password min 8 and max 20 character at least one uppercase,lowercase,digit,and special character'
      } else {
        this.error.password = ''
      }
    },

    validateConfirmPassword() {
      if (!this.confirmPassword.trim()) {
        this.error.confirmPassword = 'Please confirm your password'
      } else if (!this.isPasswordMatching) {
        this.error.confirmPassword = 'The passwords do not match'
      } else {
        this.error.confirmPassword = ''
      }
    },

    async fetchCurrentUser() {
      try {
        const data = await authuser.me()
        this.currentUser = data
        return data
      } catch {
        this.currentUser = null
        return null
      }
    },

    async createUser(userData: UserSignup, router: any) {
      this.isLoading = true
      try {
        const postResponse = await authuser.signup(userData)

        if (postResponse) {
          this.currentUser = postResponse
          Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: 'Account created successfully!',
            showConfirmButton: false,
            timer: 1000,
            toast: true,
          })

          //   reset the form
          this.name = ''
          this.password = ''
          this.email = ''
          this.confirmPassword = ''

          // Reset all error messages
          Object.keys(this.error).forEach((key) => {
            ;(this.error as any)[key] = ''
          })

          if (router) {
            router.push('/dashboard')
          }

          return postResponse
        }
      } catch (error: any) {
        console.error('Error creating user:', error)
        Swal.fire({
          position: 'top-end',
          icon: 'error',
          title: 'Failed to create user',
          text: error.message,
          showConfirmButton: false,
          timer: 3000,
          toast: true,
        })
        return false
      } finally {
        this.isLoading = false
      }
    },

    async handleSubmit(router: any) {
      this.isLoading = true
      try {
        this.validateName()
        this.validateEmail()
        this.validatePassword()
        this.validateConfirmPassword()

        if (
          !this.error.name &&
          !this.error.email &&
          !this.error.password &&
          !this.error.confirmPassword
        ) {
          const result = await this.createUser(
            {
              name: this.name,
              email: this.email,
              password: this.password,
              password_confirmation: this.confirmPassword,
            },
            router,
          )
          return result ? true : false
        } else {
          // If validation fails, show error
          Swal.fire({
            position: 'top-end',
            icon: 'error',
            title: 'Please fix the validation errors',
            showConfirmButton: false,
            timer: 3000,
            toast: true,
          })
          return false
        }
      } catch (error: any) {
        console.error('Handle submit error:', error)
        Swal.fire({
          position: 'top-end',
          icon: 'error',
          title: 'Something went wrong',
          text: error.message || 'Please try again',
          showConfirmButton: false,
          timer: 3000,
          toast: true,
        })
        return false
      } finally {
        this.isLoading = false
      }
    },

    async loginUser(userData: UserSignup, router: any) {
      this.isLoading = true
      try {
        const postResponse = await authuser.login(userData)
        if (postResponse) {
          this.currentUser = postResponse
          Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: 'Login successful!',
            showConfirmButton: false,
            timer: 1000,
            toast: true,
          })

          //   reset the form
          this.email = ''
          this.password = ''

          // Reset all error messages
          Object.keys(this.error).forEach((key) => {
            ;(this.error as any)[key] = ''
          })

          if (router) {
            router.push('/dashboard')
          }

          return postResponse
        }
      } catch (error: any) {
        console.error('Error logging in:', error)
        Swal.fire({
          position: 'top-end',
          icon: 'error',
          title: 'Login failed',
          text: error.message,
          showConfirmButton: false,
          timer: 3000,
          toast: true,
        })
        return false
      } finally {
        this.isLoading = false
      }
    },

    async handleLogin(router: any) {
      this.isLoading = true
      try {
        // Validate all fields
        this.validateEmail()
        this.validatePassword()

        if (!this.error.email && !this.error.password) {
          const result = await this.loginUser(
            {
              email: this.email,
              password: this.password,
            },
            router,
          )
          return result ? true : false
        } else {
          // If validation fails, show error
          Swal.fire({
            position: 'top-end',
            icon: 'error',
            title: 'Please fix the validation errors',
            showConfirmButton: false,
            timer: 3000,
            toast: true,
          })
          return false
        }
      } catch (error: any) {
        console.error('Handle login error:', error)
        Swal.fire({
          position: 'top-end',
          icon: 'error',
          title: 'Something went wrong',
          text: error.message || 'Please try again',
          showConfirmButton: false,
          timer: 3000,
          toast: true,
        })
        return false
      } finally {
        this.isLoading = false
      }
    },

    async logout(router: any) {
      try {
        const response = await authuser.logout()
        if (response) {
          Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: response,
            showConfirmButton: false,
            timer: 1000,
            toast: true,
          })

          // Clear client auth state
          this.currentUser = null

          if (router) router.push('/login')

          return response
        }
      } catch (error) {
        console.error('logout failed', error)
        return false
      }
    },
  },

  // async logout(router: any) {
  //   try {
  //     const response = await authuser.logout()
  //     if (response) {

  //       return response
  //     }
  //   } catch (error) {
  //     console.error('logout failed', error)
  //   }
  // },
})
