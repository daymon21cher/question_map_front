<template>
  <div class="grid-wrapper">
    <div
        v-for="cell in cells"
        :key="cell.field_number"
        class="cell"
        :class="[cell.status, { active: cell.field_number === activeCellNumber, disabled: isSubmitButtonClicked && cell.field_number !== activeCellNumber }]"
        @click="handleCellClick(cell)"

    >
      <i :class="getRandomIcon()"></i>
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
      availableIcons: [
        'fas fa-heart',
        'fas fa-star',
        'fas fa-sun',
        'fas fa-moon',
        'fas fa-leaf',
        'fas fa-cloud',
        'fas fa-tree',
        'fas fa-mountain',
        'fas fa-anchor',
        'fa-solid fa-seedling',
        'fas fa-globe',
        'fas fa-crown',
        'fas fa-bolt',
        'fas fa-feather',
        'fas fa-umbrella',
        'fas fa-ship',
        // Добавьте другие иконки, если необходимо
      ],
      activeCellNumber: null,
      selectedQuestion: '',
    };
  },
  methods: {
    getRandomIcon() {
      const randomIndex = Math.floor(Math.random() * this.availableIcons.length);
      return this.availableIcons[randomIndex];
    },
    handleCellClick(clickedCell) {
      if (!this.isSubmitButtonClicked) {
        this.activeCellNumber = clickedCell.field_number;
        console.log(this.activeCellNumber);
        this.handleSubmit(clickedCell.question, clickedCell.id);
        this.inProgress(clickedCell.id);
        console.log('click');

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
      axios.get('https://tabquest.ru/api/question/' + id + '/')
          .then(res => {
            this.selectedQuestion = res.data.text;
            this.$emit('question-selected', res.data.text, clickedCellId);
          })
          .catch(err => {
            console.log(err);
          });
    },
    inProgress(cellId){
      axios.put('https://tabquest.ru/api/cell/' + cellId + '/in_progress/', {
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
  background-color: #208D1C;
  /*background-image: url("../assets/puzzle.png");*/
  background-size: cover;
}

.CLOSE {
  background-color: #090735;
}

.IN_PROGRESS {
  /*pointer-events: none; /* Отключает обработчики событий на неактивных ячейках */
  background-color: #198756;
  transform: scale(0.98);
  opacity: 0.7;
}
.cell.CLOSE i {
  color: #208D1C; /* Желтый цвет */
}

.cell.IN_PROGRESS i {
  color: black; /* Желтый цвет */
}

.cell.OPEN i {
  color: #090735; /* Желтый цвет */
}

.cell.DISABLED i {
  color: #f5f5f5; /* Желтый цвет */
}


/* Стили для кнопки отправки формы */
.submit-button {
  margin-top: 20px;
}

/* Определите другие стили, если необходимо, для различных статусов ячеек */
</style>
