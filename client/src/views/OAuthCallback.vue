<template>
  <div style="padding: 1.25rem; text-align: center">Signing you in...</div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'
import Swal from 'sweetalert2'

// ...existing code...
const router = useRouter()
axios.defaults.withCredentials = true
axios.defaults.baseURL = 'http://localhost:8000'

onMounted(async () => {
  // so the new URLSearchParams creates a Object and have method like getAll() .get() .has() that are use for the  url
  // and the location.search is just a read only property that is the query string of the url
  const params = new URLSearchParams(location.search)
  const ok = params.get('ok') === '1'
  const error = params.get('error')

  // Handle error cases first
  if (error) {
    if (error === 'user_not_found') {
      await Swal.fire({
        icon: 'error',
        title: 'User not found',
        text: 'Create an account to continue.',
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 1600,
      })
      return void (await router.replace({ name: 'signup' }))
    }

    if (error === 'already_registered') {
      await Swal.fire({
        icon: 'info',
        title: 'Already registered',
        text: 'Sign in with your Google account.',
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 1600,
      })
      return void (await router.replace({ name: 'login' }))
    }

    if (error === 'unverified_email') {
      await Swal.fire({
        icon: 'warning',
        title: 'Email not verified',
        text: 'Verify your Google email and try again.',
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 1800,
      })
      return void (await router.replace({ name: 'login' }))
    }

    await Swal.fire({
      icon: 'error',
      title: 'Sign-in failed',
      text: 'Please try again.',
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 1600,
    })
    return void (await router.replace({ name: 'login' }))
  }

  if (ok) {
    try {
      /* so the route replace is that it replace the current session history so the browser
     will not remember the former url the browser history eg chrome will be the new one that replace the former one 
     so the back button will not return to the replace url


     while the route href or the assign will create a new history so the will be a previos page */
      await router.replace({ name: 'dashboard' })
    } catch {
      await router.replace({ name: 'login' })
    }
  }
})
</script>

<style scoped></style>
