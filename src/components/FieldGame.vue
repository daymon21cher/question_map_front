<template>

  <ModalWindowGame v-if="closed_at" :time="diffTime"/>

  <div class='d-flex justify-content-center'>
    <GameTimer v-if="created_at"
               :created_at="created_at"
               :isEndGameResponse="isEndGameResponse"
               :staticTime="diffTime"/>
  </div>


  <div v-if="!isLoggedIn">
    <div class="row">
      <div class="col">
        <main class="form-signin">
          <form @submit.prevent="handleLogin">
            <h1 class="h3 mb-3 fw-normal">Пожалуйста, войдите</h1>

            <div class="form-floating">
              <input class="form-control" id="floatingInput" v-model="field_key">
              <label for="floatingInput">Секретный ключ</label>
            </div>

            <br>
            <button class="w-100 btn btn-lg btn-primary btn-purple" type="submit">Войти</button>
          </form>
        </main>

      </div>
    </div>
  </div>
  <div v-else>
    <div class="row">
      <div class="float-left col">
        <H3>Пазлов собрано: {{countPuzzle}}</H3>
      </div>
      <div class="float-right col">

      </div>
    </div>
    <div class="container">
      <div class="row">
        <div class="col">
          <GridWrapper
              :key="reloadGrid"
              :cells="cells"
              @question-selected="handleQuestionSelected"
              :is-submit-button-clicked="isSubmitButtonClicked"
          />
        </div>
        <div class="col">
          <form class="form-inline" id="answerForm" @submit.prevent="handleAnswerSubmit">
            <div class="text-wrap">
              {{ selectedQuestion }}
            </div>
            <div class="form-group">
              <input type="text" id="answerForm1" class="form-control mr-2" v-model="textAnswer">
              <br>
              <button type="submit" class="btn btn-primary btn-purple">Отправить</button>
            </div>
          </form>
        </div>
        <div class="row">
          <div class="col">
            <div v-if="showImage">
              <img src="../assets/test.png" alt="My Image" STYLE="width: 70%; height: 70%;">
            </div>
            <br>
            <yandex-map-widget :coordinates="coordinates" :zoom="15"/>
          </div>
        </div>
      </div>
    </div>
  </div>

</template>


<script>
import axios from 'axios'
import GridWrapper from './GridWrapper.vue';
import GameTimer from './GameTimer.vue';
import ModalWindowGame from './ModalWindowGame.vue';
import YandexMapWidget from "@/components/YandexMapWidget";
//axios.defaults.withCredentials = true;
export default {
  components: {
    GridWrapper,
    GameTimer,
    ModalWindowGame,
    YandexMapWidget

  },
  data() {
    return {

      created_at: '',
      closed_at: '',
      diffTime: '',
      isLoggedIn: false,
      isEndGameResponse: false,
      cells: [],
      field_key: '',
      formValue: '',
      textAnswer: '',
      selectedQuestion: 'Выберите вопрос',
      isSubmitButtonClicked: false,
      reloadGrid: false, // Добавляем состояние reloadGrid
      clickedCellId: null,
      coordinates: '',
      showImage: false,
      countPuzzle: 0,

    };
  },

  methods: {

    handleLogin() {
      const data = {
        field_key: this.field_key
      };

      console.log(data);
      axios.post('https://puzzlequest.space/api/field/login/', data, {
        withCredentials: true,
      })
          .then(res => {
            console.log(res);
            this.isLoggedIn = true;
            this.loadCells(); // Вызов функции для загрузки ячеек после успешной авторизации
          })
          .catch(err => {
            console.log(err);
          });
    },
    loadCells() {
      axios.get('https://tabquest.ru/api/field/custom_action/', {
        withCredentials: true,
      })
          .then(res => {
            this.cells = res.data.cell_set;
            console.log(this.cells);
            for (let i = 0; i < this.cells.length; i++) {
              if (this.cells[i].status === "IN_PROGRESS") {
                this.clickedCellId = this.cells[i].id;
                this.selectedQuestion = this.cells[i].question.text;
                this.coordinates = this.cells[i].question.location;
                this.showImage = false;
                if (this.cells[i].question.name === "f_five") {
                  this.showImage = true;
                }
                break; // Если элемент найден, прерываем цикл
              }
            }
            this.countPuzzle = this.countOpenCellsWithId8(res.data);
            this.reloadGrid = !this.reloadGrid;
            this.created_at = res.data.created_at;
            this.closed_at = res.data.closed_at;
            this.isLoggedIn = true;

            this.diffTime = this.getTimeDifference(this.created_at, this.closed_at);
            console.log(this.getTimeDifference(this.closed_at, this.created_at));
            if (this.closed_at) {
              this.isEndGameResponse = true;
            }
            return res.data;
          })
          .catch(err => {
            console.log(sessionStorage.getItem('session_id'));
            console.log(err);
          });
    },
    handleQuestionSelected(question, cellId) {
      this.selectedQuestion = question;
      this.clickedCellId = cellId
      console.log(question)
      this.loadCells();
      this.isSubmitButtonClicked = true;
    },
    handleAnswerSubmit() {
      // обработка отправки формы
      this.isSubmitButtonClicked = false;
      const data = {
        text: this.textAnswer,
      };
      axios.post('https://tabquest.ru/api/cell/' + this.clickedCellId + '/take_answer/', data, {
        withCredentials: true,
      })
          .then(res => {
            this.selectedQuestion = "";
            this.textAnswer = "";
            console.log(res);
            this.loadCells();
            if (res.status === 201) {

              //alert('Пупа получил за Лупу за ' + this.closed_at  + this.created_at)
            }

          })
          .catch(err => {
            console.log(err);
            console.log(data);
          });

    },
    countOpenCellsWithId8(data) {
      let count = 0;
      data.cell_set.forEach((cell) => {
        if (cell.status === "OPEN" && cell.cell_type.id === 8) {
          count++;
        }
      });
      return count;
    },
    getTimeDifference(startTime, endTime) {
      // Шаг 1: Преобразовать строки в объекты Date
      const startDateObj = new Date(startTime);
      const endDateObj = new Date(endTime);

      // Шаг 2: Вычислить разницу в миллисекундах
      const timeDifferenceInMs = endDateObj - startDateObj;

      // Шаг 3: Преобразовать разницу в формат "чч:мм:сс"
      const hours = String(Math.floor(timeDifferenceInMs / (1000 * 60 * 60))).padStart(2, '0');
      const minutes = String(Math.floor((timeDifferenceInMs % (1000 * 60 * 60)) / (1000 * 60))).padStart(2, '0');
      const seconds = String(Math.floor((timeDifferenceInMs % (1000 * 60)) / 1000)).padStart(2, '0');

      // Сформировать строку с разницей времени
      const timeDifference = `${hours}:${minutes}:${seconds}`;

      return timeDifference;
    }
  },
  computed: {
    isSubmitButtonClickedComputed() {
      return this.formValue !== '';
    },
  },
  mounted() {
    this.loadCells(); // Вызов функции для загрузки ячеек при монтировании компонента

  }
};
</script>

<style>

.header {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  /* Другие стили для шапки */
}

.container {
  max-width: 600px; /* Установите желаемую максимальную ширину */
  width: 100%;
}

.bd-placeholder-img {
  font-size: 1.125rem;
  text-anchor: middle;
  -webkit-user-select: none;
  -moz-user-select: none;
  user-select: none;
}

@media (min-width: 768px) {
  .bd-placeholder-img-lg {
    font-size: 3.5rem;
  }
}

html,
body {
  height: 100%;
}

body {
  display: flex;
  align-items: center;
  padding-top: 40px;
  padding-bottom: 40px;
  background-color: #f5f5f5;
}

.form-signin {
  width: 100%;
  max-width: 330px;
  padding: 15px;
  margin: auto;
}

.form-signin .checkbox {
  font-weight: 400;
}

.form-signin .form-floating:focus-within {
  z-index: 2;
}

.form-signin input[type="email"] {
  margin-bottom: -1px;
  border-bottom-right-radius: 0;
  border-bottom-left-radius: 0;
}

.form-signin input[type="password"] {
  margin-bottom: 10px;
  border-top-left-radius: 0;
  border-top-right-radius: 0;
}


.item {
  position: relative;
  width: 50px;
  height: 50px;
  background: #ccc;
  margin: 5px;
  display: inline-block;
  cursor: pointer;

  transition: .4s;
  transform-style: preserve-3d;
}

.item.active {
  background: #42b983cc;
  transform: rotateX(180deg);
}

.item.error {
  background-color: #ff000055;
  transform: rotateX(180deg);
}

.btn-purple {
  background-color: #090735;
  border-color: #090735;
}
</style>
