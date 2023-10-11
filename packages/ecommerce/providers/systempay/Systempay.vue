<template>
  <div class="Systempay">
    <div class="formTest" />

    <button @click="initialize">
      RECARGAR LIBRERIA
    </button>
  </div>
</template>

<script>
// import KRGlue from '@lyracom/embedded-form-glue';


export default {
  name: 'Systempay',

  props: {
    /**
     * "Public test key" de la seccion "Keys for the JavaScript client"
     * en Settings / Shop / REST API keys del backend de systempay.fr
     */
    publicKey: {
      type: String,
      required: true,
    },

    formToken: {
      type: String,
      required: true,
    },

    url: {
      type: String,
      required: false,
      default: 'https://api.systempay.fr',
    },

    transaction: {
      type: Object,
      required: false,
      default: null,
    },
  },

  data() {
    return { isDone: false }
  },

  mounted() {
    this.initialize()
  },

  methods: {
    onBrandChanged(foo) {
      console.log('onBrandChanged', foo)
    },
    onError(foo) {
      console.log('onError', foo)
    },
    onFocus(foo) {
      console.log('onFocus', foo)
    },
    onFormCreated(foo) {
      console.log('onFormCreated', foo)
    },
    onFormReady(foo) {
      console.log('onFormReady', foo)
    },
    onLoaded(foo) {
      console.log('onLoaded', foo)
    },
    onSubmit(foo) {
      console.log('onSubmit', foo)
    },
    onButtonClick(foo) {
      console.log('onButtonClick', foo)
    },

    async initialize() {
      return //////////////////
      await this.includeKrypton()

      KRGlue.loadLibrary(this.url, this.publicKey)
        .then(({ KR }) => {
          KR.onBrandChanged(this.onBrandChanged)
          KR.onError(this.onError)
          KR.onFocus(this.onFocus)
          KR.onFormCreated(this.onFormCreated)
          KR.onFormReady(this.onFormReady)
          KR.onLoaded(this.onLoaded)
          KR.onSubmit(this.onSubmit)
          KR.button.onClick(this.onButtonClick)

          return KR.setFormConfig({
            'formToken': this.formToken,
            // 'kr-language': 'en-US',
            // 'kr-language': 'fr-FR',
            // 'kr-language': 'de-GR',
            'kr-language': 'es-ES',
          })
        })
        .then(({ KR }) => KR.addForm('.formTest'))
        .then(({ KR, result }) => KR.showForm(result.formId))
    },

    includeKrypton() {
      return new Promise((resolve, reject) => {
        if (document.getElementById('script-krypton')) {
          return resolve()
        }

        var tag = document.createElement('script')
        tag.id = 'script-krypton'
        tag.src = this.url + '/static/js/krypton-client/V4.0/ext/classic.js'
        tag.onload = () => {
          resolve()
        }

        var firstScriptTag = document.getElementsByTagName('script')[0]
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag)
      })
    },

    /*
    <script
      src="https://api.systempay.fr/static/js/krypton-client/V4.0/stable/kr-payment-form.min.js"
      kr-public-key="73239078:testpublickey_Zr3fXIKKx0mLY9YNBQEan42ano2QsdrLuyb2W54QWmUJQ"
      kr-post-url-success="paid.html" ...
    */
    includeScript() {
      return new Promise((resolve, reject) => {
        if (document.getElementById('script-systempay')) {
          return resolve()
        }

        var link = document.createElement('link')
        link.href = 'https://api.systempay.fr/static/js/krypton-client/V4.0/ext/classic-reset.css'
        link.type = 'text/css'
        link.rel = 'stylesheet'
        link.media = 'screen,print'
        document.getElementsByTagName('head')[0].appendChild(link)

        var tag = document.createElement('script')
        tag.id = 'script-systempay'
        tag.src =
          'https://api.systempay.fr/static/js/krypton-client/V4.0/stable/kr-payment-form.min.js'
        tag.setAttribute('kr-public-key', this.publicKey)
        tag.setAttribute('kr-post-url-success', 'ok.html')
        tag.onload = () => {
          resolve()
        }

        var firstScriptTag = document.getElementsByTagName('script')[0]
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag)
      })
    },
  },
}
</script>