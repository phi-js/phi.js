/*
Refactor de
https://multicobros.banorte.com/orquestador/lightbox/checkout.js
*/

export default function getPaymentLibrary(baseBanorteUrl, $) {
  let me, modal;
  let BanPaymentConfig = { "endpoint": "" };

  let Payment = new function () {
    try {
      let scrollingLockStyle = document.createElement("style");
      scrollingLockStyle.innerHTML = "html.BanPaymentHostLocked {" +
        " width: 100%; height: 100%; overflow: hidden; }" +
        " html.BanPaymentHostLocked body { " +
        "width: 100%; height: 100%; overflow: visible; position: fixed; }";

      document.getElementsByTagName('head')[0].appendChild(scrollingLockStyle);
    }
    catch (ignore) {
    }

    let jQueryAlt = $;
    // let jQueryAlt = null;
    let dataTx = {};
    let pK = '';

    function urlenv(pa) {
      jQueryAlt.ajax({
        url: getUrl() + '/gP',
        data: JSON.stringify({}),
        async: false,
        headers: {
          "Content-Type": "application/json",
          "Accept": "text/plain; charset=utf-8;"
        },
        crossDomain: true,
        type: 'POST',
        success: function (jsonResp) {
          let resOrig = JSON.parse(jsonResp);
          let re2 = JSON.parse(resOrig.env);
          BanPaymentConfig.endpoint = re2[pa];

        },
        error: function () {
          alert('Error Get Urls');
        }
      });
    }

    function autheticate(p) {

      let res = {};
      dataTx =
      {
        "idAfiliacion": p.params.MerchantID,
        "usuario": p.params.User,
        "clave": p.params.Password,
        "numeroControl": p.params.ControlNumber
      };

      let data = {
        crypt: encrypt(dataTx, pK)
      };


      jQueryAlt.ajax({
        url: getUrl() + '/authenticate',
        data: JSON.stringify(data),
        async: false,
        headers: {
          "Content-Type": "application/json",
          "Accept": "text/plain; charset=utf-8;"
        },
        crossDomain: true,
        type: 'POST',
        success: function (jsonResp) {
          res._code = jsonResp;
        },
        error: function (error) {
          res._code = false;
          res._num = error.responseJSON.numeroControl
        }
      });
      return res;
    }

    this.setEnv = function (pa) {
      return new Promise((resolve) => {
        urlenv(pa);
        getPk();
        $('head').append($('<link rel="stylesheet" type="text/css" />').attr('href', BanPaymentConfig.endpoint + '/orquestador/lightbox/jquery.modal.css'));

        jQueryAlt.when(
          jQueryAlt.getScript(BanPaymentConfig.endpoint + "/orquestador/resources/js/sec/crypto-js.min.js"),
          jQueryAlt.getScript(BanPaymentConfig.endpoint + "/orquestador/resources/js/sec/pbkdf2.js"),
          jQueryAlt.getScript(BanPaymentConfig.endpoint + "/orquestador/resources/js/sec/AesUtil.js"),
          jQueryAlt.getScript(BanPaymentConfig.endpoint + "/orquestador/resources/js/sec/securityutils.js"),
          jQueryAlt.getScript(BanPaymentConfig.endpoint + "/orquestador/resources/js/sec/rsa/forge.all.min.js"),
          jQueryAlt.getScript(BanPaymentConfig.endpoint + "/orquestador/lightbox/jquery.modal.js"),

          jQueryAlt.Deferred(function (deferred) {
            $(deferred.resolve);
          })
        ).done(() => {
          resolve();
        });
      });
    };

    this.encrypt = function (paramsM) {
      let res = autheticate(paramsM);
      if (!res._code) {
        let FAuth = {
          'id': 4,
          'message': "Ha ocurrido un error al autenticar usuario, contacte a su administrador Banorte",
          'numeroControl': res._num,
          'ev': "_auth"
        };
        window.postMessage(FAuth, '*');
        return;
      }
      window.sessionStorage.setItem("token", res._code.token);
      let _jQuery = getJQuery();
      let paramsE = {};
      if (paramsE !== undefined)
        _jQuery.extend(paramsE, {
          // Merchant Params
          merchantId: paramsM.params.MerchantID,
          mode: paramsM.params.Mode,
          controlNumber: paramsM.params.ControlNumber,
          terminalId: paramsM.params.TerminalID,
          amount: paramsM.params.Amount,
          merchantName: paramsM.params.MerchantName,
          merchantCity: paramsM.params.MerchantCity,
          lang: paramsM.params.Language,
          customerRef1: paramsM.params.CustomerRef1,
          customerRef2: paramsM.params.CustomerRef2,
          customerRef3: paramsM.params.CustomerRef3,
          customerRef4: paramsM.params.CustomerRef4,
          customerRef5: paramsM.params.CustomerRef5,

          // Merchant Cyb Params
          billToFirstName: paramsM.params.FirstName,
          billToLastName: paramsM.params.LastName,
          billToStreet: paramsM.params.Street,
          billToStreetNumber: paramsM.params.StreetNumberInt,
          billToStreetNumbe2: paramsM.params.StreetNumberExt,
          billToStreet2Col: paramsM.params.Col,
          billToStreet2Del: paramsM.params.Del,
          billToCity: paramsM.params.City,
          billToState: paramsM.params.State,
          billToCountry: paramsM.params.Country,
          billToPhoneNumber: paramsM.params.PhoneNumber,
          billToPostalCode: paramsM.params.PostalCode,
          billToEmail: paramsM.params.Email,
          billToCustomerId: paramsM.params.CustomerID,
          billToCustomerPassword: paramsM.params.CustomerPassword,
          billToDateOfBirth: paramsM.params.DateOfBirth,
          billToHostname: paramsM.params.Hostname,
          billToHttpBrowserEmail: paramsM.params.BrowserEmail,
          billToIpAddress: paramsM.params.IpAddress,
          comments: paramsM.params.Comments,

          // Merchant Ship Params
          shipToFirstName: paramsM.params.ShipFirstName,
          shipToLastName: paramsM.params.ShipToLastName,
          shipToStreetNumber: paramsM.params.ShipStreetNumberInt,
          shipToStreetNumber2: paramsM.params.ShipStreetNumberExt,
          shipToStreet2Col: paramsM.params.ShipCol,
          shipToStreet2Del: paramsM.params.ShipDel,
          shipToCity: paramsM.params.ShipCity,
          shipToState: paramsM.params.ShipState,
          shipToCountry: paramsM.params.ShipCountry,
          shipToPostalCode: paramsM.params.ShipPostalCode,
          shipToPhoneNumber: paramsM.params.ShipPhoneNumber,
          shipToShippingMethod: paramsM.params.ShipShippingMethod,

          // MerchantDataFields Params
          merchantDefinedDataField1: paramsM.params.CustomDataField1,
          merchantDefinedDataField2: paramsM.params.CustomDataField2,
          merchantDefinedDataField3: paramsM.params.CustomDataField3,
          merchantDefinedDataField4: paramsM.params.CustomDataField4,
          merchantDefinedDataField5: paramsM.params.CustomDataField5,
          merchantDefinedDataField8: paramsM.params.CustomDataField8
        });

      let data = encrypt(paramsE, pK);
      return data;
    };


    this.setJQuery = function (newJQuery) {
      jQueryAlt = newJQuery;
    };

    this.startPayment = function (config) {
      if (window.addEventListener) {
        window.addEventListener('message', windowEventHandler);
      } else if (window.attachEvent) {
        window.attachEvent('message', windowEventHandler);
      }

      let cypher = config.params.crypt;

      toggleLockHostpage();
      let _jQuery = getJQuery();

      if (config.opened instanceof Function) {
        config.opened();
      }

      _jQuery(config.form).submit(function (e) {
        e.preventDefault();
      });

      let action = BanPaymentConfig.endpoint + "/orquestador/";

      let paymentForm = _jQuery("<form/>").attr("id", "BanPaymentForm").attr("method", "POST").css("display", "none");

      paymentForm.attr({ "action": action, "target": "orquestadorFrame" });
      paymentForm.append(_jQuery("<input/>").attr({ "type": "hidden", "name": "cryptMer" }).val(cypher));
      paymentForm.append(_jQuery("<input/>").attr({ "type": "hidden", "name": "cryptAdq" }).val(encrypt(dataTx, pK)));
      paymentForm.append(_jQuery("<input/>").attr({ "type": "hidden", "name": "token" }).val(sessionStorage.getItem("token")));

      let paymentFrameWrapper = _jQuery("<div/>").attr("id", "myModal").addClass("modal");
      let container = document.createElement("iframe");

      $(container).attr("id", "pluginFrame")
        .attr("name", "orquestadorFrame");

      paymentFrameWrapper.append(container);

      $("body").append(paymentForm);

      modal = paymentFrameWrapper.modal({
        clickClose: false,
        fadeDuration: 100,
        fadeDelay: 0.50,
        onClose: function () {
          paymentFrameWrapper.remove();
          paymentForm.remove();
          logout(BanPaymentConfig.endpoint);
          sessionStorage.clear();
        },
        onShow: function () {
          paymentForm.submit();
          paymentForm.remove();
        }

      });

      function windowEventHandler(event) {
        if (event.data === "closingPayment") {
          if (config.onClosed instanceof Function) {
            let closingModal = {
              'id': 0,
              'message': "frameClosedbyUser"
            };
            config.onClosed(closingModal);
          }
          cleanup();
        }
        if (event.data.ev === "Error") {
          if (config.onError instanceof Function) {
            let r = {};
            for (let name in event.data) {
              if (name.substr(0, 2) !== "ev") {
                r[name] = event.data[name];
              }
            }
            config.onError(r);
          }
        }

        if (event.data.ev === "cancelPayment") {
          if (config.onCancel instanceof Function) {
            let r = {};
            for (let name in event.data) {
              if (name.substr(0, 2) !== "ev") {
                r[name] = event.data[name];
              }
            }
            config.onCancel(r);
          }
          cleanup();
          jQueryAlt.modal.close();

        }

        if (event.data.ev == "_auth") {
          if (config.onError instanceof Function) {
            let r = {};
            for (let name in event.data) {
              if (name.substr(0, 2) !== "ev") {
                r[name] = event.data[name];
              }
            }
            config.onError(r);
          }
          cleanup();
          jQueryAlt.modal.close();

        }

        if (event.data.ev === "Success") {
          if (config.onSuccess instanceof Function) {
            let r = {};
            let b = {};
            for (let name in event.data) {
              if (name.substr(0, 2) !== "ev") {
                r[name] = event.data[name];
              }
            }
            for (let name in r) {
              if (r[name] != null) {
                b[name] = r[name];
              }
            }
            config.onSuccess(b);
          }
        }

        if (event.data === "Close") {
          cleanup();
          jQueryAlt.modal.close();
        }

        if (event.data === "frameloaded") {
          if (config.loaded instanceof Function) {
            config.loaded();
          }
        }
        if (event.data !== undefined && event.data.type === "error") {
          if (config.error instanceof Function) {

            let errorData = {
              'message': event.data.message,
              'detail': event.data.detail
            };
            config.error(errorData);
          }
          cleanup();
        }
      }

      function cleanup() {
        toggleLockHostpage(false);
        paymentForm.remove();
        paymentFrameWrapper.remove();
        if (window.removeEventListener) {
          window.removeEventListener('message', windowEventHandler);
        } else if (window.detachEvent) {
          window.detachEvent('message', windowEventHandler);
        }
      }

    };

    function getJQuery() {
      if (jQueryAlt != null)
        return jQueryAlt;
      else
        if (typeof jQuery != 'undefined')
          return jQuery;
        else
          return null;
    }

    function getPk() {
      jQueryAlt.ajax({
        url: BanPaymentConfig.endpoint + '/orquestador/rsa',
        data: JSON.stringify({}),
        async: false,
        headers: {
          "Accept": "text/plain; charset=utf-8",
          "Content-Type": "application/json"
        },
        crossDomain: true,
        type: 'POST',
        success: function (res) {
          pK = JSON.parse(res).pK;
        },
        error: function () {
          alert('Error Get PK');
        }
      });
      return pK;
    }

    function toggleLockHostpage(doActivate) {
      let _jQuery = getJQuery();
      let html = _jQuery('html');
      let body = _jQuery('body');
      doActivate = (doActivate == null ? (!html.hasClass('BanPaymentHostLocked')) : !!doActivate);
      let scrollPos;

      if (doActivate) {
        scrollPos = body.scrollTop();
        html.addClass('BanPaymentHostLocked');
        body.css('top', (scrollPos * -1));
      } else {
        scrollPos = (parseInt(body.css('top'), 10) * -1);

        html.removeClass('BanPaymentHostLocked');
        body
          .scrollTop(scrollPos)
          .css('top', '');
      }
    }


    function logout(host) {
      sessionStorage.clear();
      jQueryAlt.ajax({
        url: host + '/orquestador/logout',
        data: JSON.stringify({}),
        async: false,
        headers: {
          "Content-Type": "application/json",
          "Accept": "text/plain; charset=utf-8;"
        },
        crossDomain: true,
        type: 'POST',
        success: function () {
          // console.log("Sucesslogout");
        },
        error: function () {
          // alert('Error on logout');
          console.error('Error on logout');
        }
      });
    }

    function getUrl() {
      return baseBanorteUrl;
      // let aTagScript = document.getElementsByTagName("script");
      // let strSrc;
      // let urlHost2;
      // let n;
      // for (key in aTagScript) {
      //   strSrc = aTagScript[key].src;
      //   n = strSrc.search("checkout.js");
      //   if (n > 0) {
      //     urlHost2 = strSrc.split("orquestador")[0] + "orquestador";
      //     break;
      //   }

      // }
      // return urlHost2;
    }

  };

  return Payment;
}