import { inject, ref } from 'vue'

export default function useModelSchema() {
  return inject('$_vm_modelSchema', ref(null))
}