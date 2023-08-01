<template>
  <!-- Обертка для модального окна -->
  <div class="modal-wrapper">
    <!-- Само модальное окно -->
    <div class="modal-dialog">
      <div class="modal-content">
        <!-- Заголовок модального окна -->
        <div class="modal-header">
          <h5 class="modal-title">Поздравляю вы собрали все пазлы!</h5>
          <button type="button" class="btn-close" @click="closeModal"></button>
        </div>

        <!-- Тело модального окна с информацией о времени -->
        <div class="modal-body">
          <p>Ваше время: {{ time }}.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    time: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      isOpen: false,
    };
  },
  methods: {
    showModal() {
      this.isOpen = true;
    },
    closeModal() {
      this.isOpen = false;
    },
  },
};
</script>

<style>
/* Стили для компонента модального окна */
.modal-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  z-index: 999;
}

.modal-dialog {
  background-color: #fcff52;
  box-shadow: 0 3px 9px rgba(0, 0, 0, 0.5);
  border-radius: 5px;
  padding: 20px;
  max-width: 400px;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #9c3cf0;
  padding-bottom: 10px;
}

.modal-title {
  margin: 0;
  font-size: 18px;
  color: #9c3cf0;
}

.btn-close {
  border: none;
  background: transparent;
  cursor: pointer;
  font-size: 20px;
  color: #9c3cf0;
  padding: 0;
  margin: 0;
}

.modal-body {
  padding-top: 10px;
  color: #000;
}

/* Определите другие стили, если необходимо, для модального окна */
</style>
