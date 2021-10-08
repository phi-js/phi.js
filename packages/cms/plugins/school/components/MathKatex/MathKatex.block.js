const MathKatex = () => import('./MathKatex.vue')
const MathKatexPicker = () => import('./MathKatexPicker.vue')

export default {
  "id": "CmsMediaMath",

  "name": "MathKatex",
  "tags": ["academia"],
  "title": "Fórmula",
  "icon": "mdi:variable",

  "block": {
    "component": MathKatex,
    "props": {
      "value": "x = \\frac { -b \\pm \\sqrt{ b^2-4ac } } { 2a }"
    }
  },

  "editor": {
    "face": {
      "component": MathKatexPicker,
      "v-model": "block.props.value"
    }
  }
}