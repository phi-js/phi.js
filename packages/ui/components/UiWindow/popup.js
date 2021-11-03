import { createApp, h } from 'vue'
import PopupContents from './PopupContents.vue'

export default async function openWindow(vueInstance, onClose = null) {
  let width = 1024
  let height = 768
  let left = (screen.width / 2) - (width / 2)
  let top = (screen.height / 2) - (height / 2)

  const windowPath = window.location.origin + window.location.pathname + '_window'

  var frog = window.open(
    windowPath,
    '',
    `top=${top},left=${left},width=${width},height=${height},scrollbars=1,resizable=1`,
  )

  const movedEl = vueInstance.$refs.refBridge.$el
  const originalDad = movedEl.parentNode

  frog.addEventListener('load', () => {
    frog.document.body.innerHTML = ''
    frog.document.title = 'Phi.popup'

    // const app = document.createElement('div')
    // app.className = 'ui-theme-dark'
    // app.id = 'app'
    // app.style.height = '100%'

    // const box = document.createElement('div')
    // box.className = 'ui__box'
    // box.style.height = '100%'
    // box.style.borderRadius = '0'

    // box.appendChild(movedEl)
    // app.appendChild(box)
    // frog.document.body.appendChild(app)

    // Instanciar componente de vue dentro de la ventana
    createApp(PopupContents, {
      uiWindow: vueInstance,
      onClose() {
        frog.close()
      },
    }).mount(frog.document.body)

    // Copiar estilos (mmm)
    const allStyles = document.querySelectorAll('style')
    allStyles.forEach((styleNode) => frog.document.head.appendChild(styleNode.cloneNode(true)))

  }, false)

  // Detectar cuando la ventana se ha cerrado
  var popupTick = setInterval(function() {
    if (frog.closed) {
      clearInterval(popupTick)
      // originalDad.appendChild(movedEl)
      if (onClose) {
        onClose()
      }
    }
  }, 500)


}