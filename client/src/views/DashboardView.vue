<template>
  <div>
    <div>
      Welcome {{ userAuth.currentUser?.name }}

      <button @click="onLogout" class="btn">Logout</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { userAuthStore } from '../stores/UserStore'
import { useRouter } from 'vue-router'
const userAuth = userAuthStore()
const router = useRouter()

const onLogout = async () => {
  await userAuth.logout(router)
}

//logic
</script>

<style scoped></style>
