/*
El plugin 'inAppBrowser' de cordova no expone la propiedad "window.opener"
asi que no se puede usar window.opener.postMessage dentro de la ventana abierta

Tampoco reacciona a window.close().

Este polyfill emplea herramientas del plugin para inyectar "window.opener" y "window.close"
en la ventana abierta


Desde el padre (opener):

let onMessage = message => {
    console.log("la ventana ha enviado ", message);
}

let onClose = () => {
    console.log("la ventana fue cerrada");
}

let miVentana = open('miprueba.htm', '_blank', '', onMessage, onClose)


Desde la ventana abierta (miprueba.htm)

<html>
  .....

  <body>
    <button type="button" onclick="emit(true, 'todo bien')">Emitir OK</button>

    <script type="text/javascript">
    function emit(ok, msg) {
      var result = {
        ok: ok,
        msg: msg
      };

      window.opener.postMessage({popup: result}, "*");
    }
    </script>

  </body>
</html>


*/

function open(url, windowName, windowFeatures, messageHandler = () => { }, closeHandler = () => { }) {

  var isCordova = typeof cordova != "undefined" && typeof cordova.InAppBrowser != "undefined";

  var windowHandleMessage = function (event) {
    if (event && event.data && event.data.popup) {
      messageHandler(event.data.popup);
    }
  }
  window.addEventListener('message', windowHandleMessage);

  var ref = isCordova ? cordova.InAppBrowser.open(url, windowName, windowFeatures) : window.open(url, windowName, windowFeatures);

  // Window rejected by popup blocker (?)
  if (ref == null) {
    return;
  }

  /* Loop to check when the window has been closed */
  var intervalCheckClose = setInterval(function () {
    if (ref.closed) {
      clearInterval(intervalCheckClose);
      window.removeEventListener('message', windowHandleMessage);
      closeHandler();
    }

    // Check inside inAppBrowser
    if (isCordova) {
      ref.executeScript({ code: "window._iab_shouldClose" },
        function (values) {
          if (values[0]) {
            ref.close();
            clearInterval(intervalCheckClose);
            window.removeEventListener('message', windowHandleMessage);
            closeHandler();
          }
        }
      );
    }

  }, 500);


  // Polyfills para inAppBrowser

  ref.addEventListener("exit", function () {
    if (typeof closeHandler == 'function') {
      clearInterval(intervalCheckClose);
      window.removeEventListener('message', windowHandleMessage);
      closeHandler();
    }
  });

  ref.addEventListener("message", windowHandleMessage);

  ref.addEventListener("loadstop", function () {
    ref.executeScript({
      code: `
      if (!window.opener) {
        window.opener = {
          postMessage: function(message) {
            webkit.messageHandlers.cordova_iab.postMessage(JSON.stringify(message));
          }
        };

        window.close = function() {
          window._iab_shouldClose = true;
        }
      }`
    });

  });

}


function submit(form, windowFeatures, messageHandler, closeHandler) {
  var windowName = 'formWindow' + (new Date().getTime());

  var ref = open("", windowName, windowFeatures, messageHandler, closeHandler);
  form.setAttribute("target", windowName);
  form.submit();

  return ref;
}

export { open, submit }