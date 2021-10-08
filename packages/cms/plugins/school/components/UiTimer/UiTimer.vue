<template>
  <div class="ui-timer">
    <div class="timer-clock">
      <div class="hours">{{ hours }}</div>
      <div class="separator">:</div>
      <div class="minutes">{{ minutes }}</div>
      <div class="separator">:</div>
      <div class="seconds">{{ seconds }}</div>
    </div>

    <div class="timer-controls ui-row --tight">
      <button
        v-if="!!interval"
        type="button"
        class="ui-button"
        @click="pause"
      >Pause</button>
      <button
        v-if="!interval && remaining > 0"
        type="button"
        class="ui-button"
        @click="start"
      >Start</button>
      <button
        v-if="remaining < duration"
        type="button"
        class="ui-button"
        @click="reset"
      >Reset</button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ui-timer',

  props: {
    duration: {
      // duracion en segundos
      type: [String, Number],
      required: false,
      default: 60,
    },

    autoStart: {
      type: Boolean,
      required: false,
    },
  },

  data() {
    return {
      interval: null,
      remaining: this.duration,
    };
  },

  computed: {
    hours() {
      let hours = Math.floor(this.remaining / 3600);
      return hours < 10 ? '0' + hours : hours;
    },

    minutes() {
      let minutes = Math.floor(this.remaining / 60) % 60;
      return minutes < 10 ? '0' + minutes : minutes;
    },

    seconds() {
      let seconds = this.remaining % 60;
      return seconds < 10 ? '0' + seconds : seconds;
    },
  },

  mounted() {
    if (this.autoStart) {
      this.start();
    }
  },

  methods: {
    start() {
      if (this.remaining == 0) {
        return;
      }

      clearInterval(this.interval);

      this.interval = setInterval(() => {
        this.remaining--;
        this.$emit('tick', this.remaining);

        if (this.remaining == 0) {
          clearInterval(this.interval);
          this.interval = null;
          this.$emit('done');
          this.$emit('stop');
          this.$emit('update:isRunning', false);
        }
      }, 1000);

      this.$emit('start');
      this.$emit('update:isRunning', true);
    },

    reset() {
      clearInterval(this.interval);
      this.interval = null;

      this.remaining = this.duration;
      this.$emit('stop');
      this.$emit('update:isRunning', false);
    },

    pause() {
      clearInterval(this.interval);
      this.interval = null;

      this.$emit('stop');
      this.$emit('update:isRunning', false);
    },
  },
};
</script>

<style lang="scss">
.ui-timer {
  display: flex;
  flex-wrap: nowrap;
  align-items: center;

  .timer-controls {
    margin-left: 1em;
  }

  .timer-clock {
    display: flex;
    font-size: 1.4em;

    & > * {
      display: block;
      margin-right: 8px;

      &:last-child {
        margin: 0;
      }
    }
  }
}
</style>