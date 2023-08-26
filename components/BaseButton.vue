<script lang="ts" setup>
const props = withDefaults(defineProps<{
  color?: 'primary' | 'secondary' | 'danger' | 'warning'
}>(), {
  color: 'primary',
})

const colorToClass = new Map([
  ['primary', 'bg-blue-500 hover:bg-blue-600 text-white'],
  ['secondary', 'bg-gray-500 hover:bg-gray-600 text-white'],
  ['danger', 'bg-red-500 hover:bg-red-600 text-white'],
  ['warning', 'bg-yellow-500 hover:bg-yellow-600 text-white'],
])
</script>

<template>
  <button :class="colorToClass.get(props.color)" class="transition rounded px-2 py-1 w-full">
    <slot />
  </button>
</template>
