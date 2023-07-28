<template>
  <div class="grid-wrapper">
    <div
        v-for="cell in cells"
        :key="cell.field_number"
        class="cell"
        :class="[cell.status, { active: cell.field_number === activeCellNumber, disabled: isSubmitButtonClicked && cell.field_number !== activeCellNumber }]"
        @click="handleCellClick(cell)"

    >
      {{ cell.field_number }}
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  props: {
    cells: {
      type: Array,
      required: true,
    },
    isSubmitButtonClicked: {
      type: Boolean,
      required: true,
    },
  },
  data() {
    return {
      activeCellNumber: null,
      selectedQuestion: '',
    };
  },
  methods: {
    handleCellClick(clickedCell) {
      if (!this.isSubmitButtonClicked) {
        this.activeCellNumber = clickedCell.field_number;
        console.log(this.activeCellNumber);
        this.handleSubmit(clickedCell.question, clickedCell.id);
        this.inProgress(clickedCell.id);

      }
    },
    handleSubmit(questionId, clickedCellId) {
      let id = null;
      if(questionId instanceof Object){
        id = questionId.id;

      }else{
        id = questionId;
      }
      console.log(questionId)
      axios.get('http://tabquest.ru:8000/question/' + id + '/')
          .then(res => {
            this.selectedQuestion = res.data.text;
            this.$emit('question-selected', res.data.text, clickedCellId);
          })
          .catch(err => {
            console.log(err);
          });
    },
    inProgress(cellId){
      axios.put('http://tabquest.ru:8000/cell/' + cellId + '/in_progress/', {
        withCredentials: true,
      })
          .then(res => {
            console.log(res);
          })
          .catch(err => {
            console.log(err);
          });
    }
  },
};
</script>

<style scoped>
/* Стили для компонента */
.grid-wrapper {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-gap: 10px;
}

.cell {
  padding: 20px;
  background-color: lightgray;
  cursor: pointer;
  transition: transform 0.3s, opacity 0.3s;
}

.cell.active {
  transform: scale(0.98);
  opacity: 0.7;
}

.DISABLED {
  pointer-events: none; /* Отключает обработчики событий на неактивных ячейках */
  background-color: gray;
}

/* Стили для разных статусов ячеек */
.OPEN {
  pointer-events: none; /* Отключает обработчики событий на неактивных ячейках */
  background-color: #fcff52;
}

.CLOSE {
  background-color: #9c3cf0;
}

.IN_PROGRESS {
  /*pointer-events: none; /* Отключает обработчики событий на неактивных ячейках */
  background-color: blue;
  transform: scale(0.98);
  opacity: 0.7;
}

/* Стили для кнопки отправки формы */
.submit-button {
  margin-top: 20px;
}

/* Определите другие стили, если необходимо, для различных статусов ячеек */
</style>
