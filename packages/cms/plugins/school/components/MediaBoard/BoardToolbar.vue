<template>
  <div class="BoardToolbar ui-toolbar --light">
    <input
      type="color"
      class="board-color"
      v-on:input="$emit('update:button', {typeTools:'source-over',color:$event.target.value})"
      v-bind:value="button.color"
    />
    <ui-icon
      value="mdi:brush"
      v-bind:class="[button.typeTools == 'source-over' ? 'selected' : '']"
      class="ui--clickable"
      @click="$emit('update:button', {typeTools:'source-over',color:button.color})"
    ></ui-icon>
    <ui-icon
      value="mdi:eraser"
      v-bind:class="[button.typeTools == 'destination-out' ? 'selected' : '']"
      class="ui--clickable"
      @click="$emit('update:button', {typeTools:'destination-out',color:button.color})"
    ></ui-icon>
    <ui-icon value="mdi:text" class="ui--clickable" @click="addText" repli></ui-icon>
    <ui-icon value="mdi:content-save" class="ui--clickable" @click="exportToImage"></ui-icon>
    <ui-icon value="mdi:broom" class="ui--clickable" @click="clearLayer"></ui-icon>
    <input type="range" min="5" max="15" v-model="lineWidthToolbar" />
  </div>
</template>

<script>
import { UiItem, UiIcon } from "@/modules/ui/components";

export default {
  name: "BoardToolbar",
  components: { UiIcon },
  data() {
    return {
      lineWidthToolbar: this.lineWidth,
    };
  },
  props: {
    button: {
      type: Object,
      required: true,
    },
    lineWidth: {
      type: Number,
      required: true,
    },
    addText: {
      type: Function,
      required: true,
    },
    exportToImage: {
      type: Function,
      required: true,
    },
    clearLayer: {
      type: Function,
      required: true,
    },
  },
  watch: {
    lineWidthToolbar: {
      immediate: true,
      handler(newValue) {
        this.$emit("update:lineWidth", parseInt(newValue));
      },
    },
  },
};
</script>