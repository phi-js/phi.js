<template>
  <div class="ecommerce-provider-redsys"></div>
</template>

<script>
import * as popup from "@/modules/ecommerce/helpers/popupWindow.js";

export default {
  name: "ecommerce-provider-redsys",

  props: {
    transaction: {
      type: Object,
      required: true
    }
  },

  data() {
    return {
      isDone: false
    };
  },

  mounted() {
    this.openPopup();
  },

  methods: {
    openPopup() {
      this.isDone = false;
      let form = this.createForm();

      popup.submit(
        form,
        "height=768,width=1024,resizable=yes,toolbar=no,status=yes",
        this.onPopupMessage,
        this.onPopupClose
      );
    },

    onPopupMessage(message) {
      this.isDone = true;

      if (message && typeof message.ok != "undefined") {
        this.result = message.ok;

        if (this.result) {
          this.$emit("success", message);
        } else {
          this.$emit("error", message);
        }
      }
    },

    onPopupClose() {
      if (!this.isDone) {
        this.$emit("error");
      }
    },

    createForm() {
      let uid = new Date().getTime();

      let form = document.createElement("form");
      form.setAttribute("id", `redsys_${uid}`);
      form.setAttribute("method", "post");
      form.setAttribute("action", this.transaction.clientData.url);

      ["Ds_MerchantParameters", "Ds_Signature", "Ds_SignatureVersion"].forEach(
        fieldName => {
          let hiddenField = document.createElement("input");
          hiddenField.setAttribute("type", "hidden");
          hiddenField.setAttribute("name", fieldName);
          hiddenField.setAttribute(
            "value",
            this.transaction.clientData[fieldName]
          );
          form.appendChild(hiddenField);
        }
      );

      document.body.appendChild(form);
      return form;
    }
  }
};
</script>