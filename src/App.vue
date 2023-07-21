<template>
  <div class="container">
    <div class="row">
      <div class="col-sm">
        <main class="form-signin">
          <form @submit.prevent="handleLogin">
            <h1 class="h3 mb-3 fw-normal">Пожалуйста, войдите</h1>

            <div class="form-floating">
              <input class="form-control" id="floatingInput" v-model="field_key">
              <label for="floatingInput">Адрес эл. почты</label>
            </div>

            <br>
            <button class="w-100 btn btn-lg btn-primary" type="submit">Войти</button>
            <p class="mt-5 mb-3 text-muted">&copy; 2017–2021</p>
          </form>
        </main>
      </div>
      <div class="col-sm">
        <GridWrapper :cells="cells"/>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import GridWrapper from './components/GridWrapper.vue';
//axios.defaults.withCredentials = true;
export default {
  data() {
    return {
      cells: [],
      field_key: ''
    };
  },
  methods: {
    handleLogin() {
      const data = {
        field_key: this.field_key
      };
      console.log(data);
      axios.get('http://127.0.0.1:8000/field/login?field_key=' + data['field_key'], {
        withCredentials: true,
      })
          .then(res => {
            console.log(res);
            this.loadCells(); // Вызов функции для загрузки ячеек после успешной авторизации
          })
          .catch(err => {
            console.log(err);
          });
    },
    loadCells() {
      axios.get('http://127.0.0.1:8000/field/custom_action/', {
        withCredentials: true,
      })
          .then(res => {
            this.cells = res.data.cell_set;
          })
          .catch(err => {
            console.log(sessionStorage.getItem('session_id'));
            console.log(err);
          });
    }
  },
  mounted() {
    this.loadCells(); // Вызов функции для загрузки ячеек при монтировании компонента
  },
  components: {
    GridWrapper
  }
};
</script>

<style>
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
</style>
