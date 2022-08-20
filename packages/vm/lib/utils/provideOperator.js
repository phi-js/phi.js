import { provide } from 'vue'

export default function provideOperator(operators) {
  if (!Array.isArray(operators)) {
    operators = [operators]
  }
  provide('$_vm_operators', operators)
}