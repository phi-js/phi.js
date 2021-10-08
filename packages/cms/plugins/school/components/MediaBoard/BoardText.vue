<template>
  <div class="BoardText">
    <textarea v-model="valueText" v-bind:style="editTextStyle" @blur="removeTextarea"></textarea>
  </div>
</template>
<script>
export default {
  name: "BoardText",
  props: {
    layer: {
      type: Object,
      required: true,
    },
    updateText: {
      type: Function,
      required: true,
    },
    stage: {
      type: Object,
      required: true,
    },
    color: {
      type: String,
      required: true,
    },
    isPaint: {
      type: Boolean,
      required: true,
    },
  },
  data() {
    return {
      editTextStyle: {
        display: "none",
      },
      text: "",
      transform: "",
      replicate: true,
      valueText: "",
    };
  },
  methods: {
    addText(textAttrs) {
      if (!textAttrs) {
        var textAttrs = {
          x: 10,
          y: 15,
          id: Date.now(),
          text: "...Texto",
          fontSize: 40,
          draggable: true,
          fontFamily: "Calibri",
          ellipsis: true,
          fill: this.color,
        };
      }

      var text = new Konva.Text(textAttrs);
      this.layer.add(text);
      this.layer.batchDraw();

      var tr = new Konva.Transformer({
        nodes: [text],
        rotateEnabled: false,
        enabledAnchors: [
          "top-left",
          "top-right",
          "bottom-left",
          "bottom-right",
        ],
        boundBoxFunc: function (oldBox, newBox) {
          newBox.width = Math.max(30, newBox.width);
          return newBox;
        },
      });

      text.on("transform", function () {
        text.setAttrs({
          width: text.width() * text.scaleX(),
          height: text.height() * text.scaleY(),
          scaleX: 1,
        });
      });

      this.layer.add(tr);
      this.layer.draw();

      text.on("mousemove", () => {
        this.$emit("update:isPaint", false);
      });
      tr.on("mousemove", () => {
        this.$emit("update:isPaint", false);
      });

      text.on("mouseup", () => {
        this.updateText(text);
      });


      text.on("dblclick", () => {
        text.hide();
        tr.hide();
        this.text = text;
        this.transform = tr;
        this.layer.draw();
        this.editText();
      });
    },
    editText() {
      var textPosition = this.text.absolutePosition();
      var stageBox = this.stage.container().parentNode.getBoundingClientRect();
      var areaPosition = {
        x: stageBox.left + textPosition.x,
        y: stageBox.top + textPosition.y,
      };

      this.editTextStyle = {
        display: "block",
        position: "absolute",
        top: areaPosition.y - 15 + "px",
        left: areaPosition.x + "px",
        width: this.text.width() - this.text.padding() * 2 + 30 + "px",
        height: this.text.height() - this.text.padding() * 2 + "px",
        fontSize: this.text.fontSize() + "px",
        border: "none",
        overflow: "hidden",
        background: "none",
        resize: "none",
        lineHeight: this.text.lineHeight(),
        fontFamily: this.text.fontFamily(),
        color: this.text.fill(),
      };

      this.valueText = this.text.text();
    },
    removeTextarea() {
      this.editTextStyle = {
        display: "none",
      };

      this.text.setAttr("text", this.valueText);
      this.text.show();
      this.transform.show();
      this.transform.forceUpdate();
      this.updateText(this.text);
      this.layer.draw();
    },
  },
};
</script>