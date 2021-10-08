<template>
  <div class="cms-media-konva">
    <BoardToolbar
      v-bind:button.sync="buttons"
      :addText.sync="addText"
      :exportToImage.sync="exportToImage"
      :clearLayer.sync="clearLayer"
      :lineWidth.sync="lineWidth"
    ></BoardToolbar>
    <div
      id="board"
      @mouseup="handleMouseup"
      @mousemove="handleMousemove"
      @mousedown="handleMousedown"
    ></div>
    <BoardText
      :layer.sync="layer"
      :stage.sync="stage"
      :color.sync="buttons.color"
      :isPaint.sync="isPaint"
      :updateText.sync="updateText"
      ref="textBoard"
    ></BoardText>
  </div>
</template>

<script>
import BoardToolbar from "@/modules/cms/components/Media/Board/BoardToolbar.vue";
import BoardText from "@/modules/cms/components/Media/Board/BoardText.vue";
import Konva from "konva";

export default {
  name: "cms-media-konva",
  props: {
    value: {
      type: String,
      required: false,
    },
    width: {
      type: String,
      required: false,
    },
    height: {
      type: String,
      required: false,
    },
  },
  components: { Konva, BoardToolbar, BoardText },
  data() {
    return {
      buttons: {
        color: "#1d7cbf",
        typeTools: "source-over",
      },
      layer: new Object(),
      stage: new Object(),
      lastLine: "",
      isPaint: false,
      lineWidth: 5,
    };
  },
  methods: {
    handleMousedown(e) {
      this.isPaint = true;
      let pos = this.stage.getPointerPosition();
      this.lastLine = new Konva.Line({
        id: Date.now(),
        stroke: this.buttons.color,
        strokeWidth: this.lineWidth,
        globalCompositeOperation: this.buttons.typeTools,
        points: [pos.x, pos.y],
      });
      this.layer.add(this.lastLine);
    },
    handleMouseup(e) {
      this.isPaint = false;
      this.$emit("input", this.stage.toJSON());
    },
    handleMousemove(e) {
      if (!this.isPaint) return;

      let pos = this.stage.getPointerPosition();
      var newPoints = this.lastLine.points().concat([pos.x, pos.y]);
      this.lastLine.points(newPoints);
      this.layer.batchDraw();
    },
    addText() {
      this.$refs.textBoard.addText("");
      this.$emit("input", this.stage.toJSON());
    },
    exportToImage() {
      var dataURL = this.stage.toDataURL();
      this.downloadURI(dataURL, "Board.png");
    },
    downloadURI(uri, name) {
      var link = document.createElement("a");
      link.download = name;
      link.href = uri;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      link = "";
    },
    updateText(text) {
      this.$emit("input", this.stage.toJSON());
    },
    clearLayer() {
      this.layer.destroyChildren();
      this.layer.draw();
    },
    updateJsonStage(newValue) {
      if (!newValue || JSON.parse(newValue).attrs.id==this.stage.attrs.id) {
        //this.clearLayer();
        return;
      }

      var valueChildren = JSON.parse(newValue).children[0].children;

      for (let index = 0; index < valueChildren.length; index++) {
        var attrs = valueChildren[index].attrs;
        let elemSelect = this.layer.children.filter(
          (element) => element.attrs.id == attrs.id
        );
        if (elemSelect.length > 0) {
          if (elemSelect[0].attrs.text) {
            let transformer = elemSelect[0].index + 1;
            this.layer.children[transformer].destroy();
          }
          elemSelect[0].destroy();
          this.layer.draw();
        }

        if (valueChildren[index].className == "Line") {
          this.lastLine = new Konva.Line(valueChildren[index].attrs);
          this.layer.add(this.lastLine);
          this.layer.batchDraw();
        } else if (valueChildren[index].className == "Text") {
          let textDestroy = new Promise((resolve, reject) => {
            resolve(attrs);
          });
          textDestroy.then((attrs) => {
            this.$refs.textBoard.addText(attrs);
          });
        }
      }
    },
  },
  watch: {
    value: {
      handler(newValue) {
        this.updateJsonStage(newValue);
      },
    },
  },
  mounted() {
    if (this.value) {
       this.stage = Konva.Node.create(this.value, 'board');
       this.layer = this.stage.children[0];
    } else {
      this.stage = new Konva.Stage({
        id: Date.now(),
        container: "board",
        width:
          this.width == "100%"
            ? this.$el.parentNode.getBoundingClientRect().width
            : parseInt(this.width),
        height:
          this.height == "100%"
            ? this.$el.parentNode.getBoundingClientRect().height
            : parseInt(this.height),
      });

      this.layer = new Konva.Layer();
      this.stage.add(this.layer);
    }
    
  },
};
</script>
<style>
#board {
  display: flex;
  align-items: center;
  background: #ffffff;
}

.cms-media-konva {
  background: #f3f3f3;
}

.selected {
  background-color: #e7e7e7 !important;
}

.board-color {
  width: 30px;
  height: 30px;
  margin: 10px;
  cursor: pointer;
}
</style>
