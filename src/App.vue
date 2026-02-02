<script setup lang="ts">
import { useDark, useToggle } from '@vueuse/core'
import { MoonIcon, SunIcon } from 'lucide-vue-next'
import { Toaster } from 'vue-sonner'
import FindDeposits from './components/FindDeposits.vue'
import { Button } from './components/ui/button'

import 'vue-sonner/style.css'

const isDark = useDark()
const toggleDark = useToggle(isDark)
</script>

<template>
  <div>
    <Toaster />
    <div class="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div class="w-full max-w-2xl">
        <FindDeposits />
      </div>
    </div>
    <Button class="fixed right-2 bottom-2" @click="() => toggleDark()">
      <MoonIcon v-if="!isDark" />
      <SunIcon v-else />
    </Button>
  </div>
</template>
