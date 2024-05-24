<script lang="ts" setup>
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'

const props = defineProps<{
  formInitialValues: TodoCreateForm | TodoUpdateForm
}>()

const emit = defineEmits<{
  submit: [values: TodoCreateForm | TodoUpdateForm]
}>()

const formIsUpdate = computed(() => {
  return isTodoUpdateForm(props.formInitialValues)
})
const formSchema = computed(() => {
  return formIsUpdate.value
    ? toTypedSchema(todoUpdateFormSchema)
    : toTypedSchema(todoCreateFormSchema)
})

const { meta, handleSubmit } = useForm({
  validationSchema: formSchema,
  initialValues: props.formInitialValues,
})

const onSubmit = handleSubmit((values) => {
  emit('submit', values)
})
</script>

<template>
  <form
    class="space-y-6"
    @submit="onSubmit"
  >
    <UiFormField
      v-slot="{ componentField }"
      name="title"
    >
      <UiFormItem>
        <UiFormLabel>Title</UiFormLabel>
        <UiFormControl>
          <UiInput
            type="text"
            placeholder="Todo Title"
            v-bind="componentField"
          />
        </UiFormControl>
      </UiFormItem>
    </UiFormField>
    <UiFormField
      v-slot="{ componentField }"
      name="description"
    >
      <UiFormItem>
        <UiFormLabel>Description</UiFormLabel>
        <UiFormControl>
          <UiInput
            type="text"
            placeholder="Todo Description"
            v-bind="componentField"
          />
        </UiFormControl>
        <UiFormMessage />
      </UiFormItem>
    </UiFormField>
    <UiFormField
      v-slot="{ value, handleChange }"
      name="completed"
    >
      <UiFormItem class="flex items-center gap-4">
        <UiFormLabel>Completed</UiFormLabel>
        <UiFormControl>
          <UiSwitch
            class="!mt-0"
            :checked="value"
            @update:checked="handleChange"
          />
        </UiFormControl>
        <UiFormMessage />
      </UiFormItem>
    </UiFormField>
    <UiButton
      type="submit"
      :disabled="!meta.valid"
    >
      Submit
    </UiButton>
  </form>
</template>
