<script lang="ts" setup>
import { UploadIcon } from 'lucide-vue-next'
import { ref } from 'vue'

interface Props {
  accept?: string
}

const props = withDefaults(defineProps<Props>(), {
  accept: ''
})

const emit = defineEmits<{
  (e: 'change', value: File | null): void
}>()

const inputRef = ref<HTMLInputElement>()
const file = ref<File | null>(null)
const isDragging = ref(false)

function setFile(newFile: File | null) {
  file.value = newFile
  emit('change', newFile)
}

function onChange(e: Event) {
  const target = e.target as HTMLInputElement

  if (!target.files || target.files.length === 0) {
    setFile(null)
    return
  }

  setFile(target.files[0]!)
}

function onDrop(e: DragEvent) {
  e.preventDefault()
  isDragging.value = false

  if (!e.dataTransfer?.files || e.dataTransfer.files.length === 0) {
    setFile(null)
    return
  }

  setFile(e.dataTransfer.files[0]!)
}

function onDragOver(e: DragEvent) {
  e.preventDefault()
  isDragging.value = true
}

function onDragLeave() {
  isDragging.value = false
}

function openFileDialog() {
  inputRef.value?.click()
}
</script>

<template>
  <div
    class="relative flex cursor-pointer flex-col items-center justify-center rounded-md border border-dashed p-6 text-center transition-colors"
    :class="[
      isDragging
        ? 'border-primary bg-primary/10'
        : 'border-muted text-muted-foreground'
    ]"
    @click="openFileDialog"
    @dragover="onDragOver"
    @dragleave="onDragLeave"
    @drop="onDrop"
  >
    <input
      ref="inputRef"
      type="file"
      class="hidden"
      :accept="accept"
      @change="onChange"
    />

    <template v-if="!file">
      <div class="flex flex-col gap-1">
        <div class="flex flex-row gap-2">
          <UploadIcon />
          <span class="text-foreground font-medium">
            Click o arrastra el archivo aquí
          </span>
        </div>
        <span class="text-muted-foreground text-xs">
          {{ accept || 'Cualquier tipo de archivo' }}
        </span>
      </div>
    </template>

    <template v-else>
      <div class="flex flex-col gap-1">
        <span class="text-foreground font-medium">
          {{ file.name }}
        </span>
        <span class="text-muted-foreground text-xs">
          Archivo seleccionado
        </span>
      </div>
    </template>
  </div>
</template>
