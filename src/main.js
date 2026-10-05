import { proxy } from 'valtio/vanilla';
import './style.css';
import * as yup from 'yup';

const state = proxy({
  form: {
    status: 'filling',
    error: '',
  },
  urls: [], 
});

const schema = yup.string()
  .url('Ссылка должна быть валидным URL')
  .required('Не должно быть пустым')
  .notOneOf(state.urls, 'RSS уже существует'); 
  
const app = document.querySelector('#app')

app.innerHTML = `
  <section class="py-12 px-4 bg-slate-900 text-white">
    <div class="max-w-2xl mx-auto">
      <h1 class="text-4xl font-bold mb-2">RSS агрегатор</h1>
      <p class="text-slate-400 mb-6">Начните читать RSS сегодня! Это легко, это красиво.</p>
      <form class="flex gap-2" novalidate>
        <input 
          type="url" 
          name="url"
          placeholder="Ссылка RSS" 
          class="flex-grow p-3 rounded bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-blue-500"
          required
        />
        <button 
          type="submit" 
          class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded font-medium transition-colors"
        >
          Добавить
        </button>
      </form>
      <p class="feedback mt-2 text-sm text-red-500"></p>
    </div>
  </section>
`;


const form = document.querySelector('form');

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const formData = new FormData(e.target);
  const currentUrl = formData.get('url');

  schema.validate(currentUrl)
    .then(() => {
      state.urls.push(currentUrl);
      state.form.status = 'filling';
      state.form.error = '';
      
      e.target.reset();
    })
    .catch((err) => {
      state.form.status = 'failed';
      state.form.error = err.message; 
    });
});

import watch from './view.js';

watch(state);
