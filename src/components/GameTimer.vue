<template>
  <div className="game-timer">
    <div v-if="isEndGameResponse">
      <h1> {{ staticTime }}</h1>
    </div>
    <!-- Показывать динамическое значение времени, если isEndGameResponse равен false -->
    <div v-else>
      <h1> {{ timeElapsed }}</h1>
      <br>
    </div>


  </div>
</template>

<script>
export default {

  props: {
    isEndGameResponse: {
      type: Boolean,
      default: false,
    },
    staticTime: {
      type: String,
      required: false,
    },
    created_at:{
      type: String,
      required: true,
    },
  },
  data() {
    return {
      startTime: null,
      currentTime: null,
      intervalId: null,
    };
  },
  computed: {
    timeElapsed() {
      if (this.startTime && this.currentTime) {
        const diff = this.currentTime - this.startTime;
        const minutes = Math.floor(diff / 60000);
        const seconds = ((diff % 60000) / 1000).toFixed(0);
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
      }
      return '00:00';
    },
  },
  mounted() {
    this.startTime = new Date(this.$props.created_at);
    console.log(this.created_at)
    this.currentTime = new Date();
    this.intervalId = setInterval(() => {
      this.currentTime = new Date();
    }, 1000);
  },
  beforeUnmount() {
    clearInterval(this.intervalId);
  },
};
</script>

<style scoped>
.game-timer {
  font-size: 18px;
  font-weight: bold;
}
</style>
