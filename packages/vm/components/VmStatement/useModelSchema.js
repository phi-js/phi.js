import { getCurrentInstance, provide, inject } from 'vue'

export default function useModelSchema() {
  const instance = getCurrentInstance()
  if (instance?.props?.modelSchema) {
    provide('$_vm_modelSchema', instance.props.modelSchema)
    return instance.props.modelSchema
  }

  return inject('$_vm_modelSchema', null)
}