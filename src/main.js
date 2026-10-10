import { proxy } from 'valtio/vanilla';
import './style.css';
import * as yup from 'yup';
import watch from './view.js';
import i18next from 'i18next';
import parseRSS from './parser.js';
import axios from 'axios';

const resources = {
  ru: {
    translation: {
      logo: 'RSS агрегатор',
      description: 'Начните читать RSS сегодня! Это легко, это красиво.',
      form: {
        placeholder: 'Ссылка RSS',
        button: 'Добавить',
      },
      feedback: {
        invalidRss: 'Ссылка не содержит валидный RSS',
        required: 'Не должно быть пустым',
        exists: 'RSS уже существует',
        success: 'RSS успешно добавлен',
        network: 'Ошибка сети',
      },
    },
  },
};

yup.setLocale({
  string: {
    url: 'feedback.invalidUrl',
  },
  mixed: {
    required: 'feedback.required',
    notOneOf: 'feedback.exists',
  },
});

const state = proxy({
  form: {
    status: 'filling',
    error: '',
  },
  urls: [], 
  feeds: [],
  posts: [],
});

const schema = yup.string().url().required().notOneOf(state.urls); 

i18next.init({
  lng: 'ru',
  debug: false,
  resources,
}).then(() => {

  const app = document.querySelector('#app')

  app.innerHTML = `
      <section class="py-12 px-4 bg-slate-900 text-white">
        <div class="max-w-2xl mx-auto">
          <h1 class="text-4xl font-bold mb-2">${i18next.t('logo')}</h1>
          <p class="text-slate-400 mb-6">${i18next.t('description')}</p>
          
          <form class="flex gap-2" novalidate>
            <input 
              type="url" name="url" 
              placeholder="${i18next.t('form.placeholder')}" 
              class="flex-grow p-3 rounded bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-blue-500"
              required
            />
            <button type="submit" class="bg-blue-600 text-white px-6 py-3 rounded">
              ${i18next.t('form.button')}
            </button>
          </form>
          <p class="feedback mt-2 text-sm text-red-500"></p>
        </div>       
      </section>
      <div class="container-fluid container-xxl my-5 font-sans">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 text-slate-900">
          <div class="md:col-span-2 posts-container"></div>
          <div class="feeds-container"></div>
        </div>
      </div>
    `;

    watch(state);

  const form = document.querySelector('form');

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const currentUrl = formData.get('url');

    schema.validate(currentUrl)
      .then(() => {
        const proxyUrl = `https://allorigins.hexlet.app/get?disableCache=true&url=${encodeURIComponent(currentUrl)}`;
        state.form.status = 'loading';
        
        return axios.get(proxyUrl);
      })
      .then((response) => {
        const xmlString = response.data.contents;
        const { feed, posts } = parseRSS(xmlString);
        const feedId = crypto.randomUUID();
        
        const newFeed = {
          id: feedId,
          title: feed.title,
          description: feed.description,
        };

        const newPosts = posts.map((post) => ({
          id: crypto.randomUUID(),
          feedId: feedId,
          title: post.title,
          link: post.link,
        }));

        state.feeds = [...state.feeds, newFeed];
        state.posts = [...state.posts, ...newPosts];
        state.urls = [...state.urls, currentUrl];
        state.form.status = 'filling';
        state.form.error = '';
        form.reset();
      })
      .catch((err) => {
        state.form.status = 'failed';
        if (err.isAxiosError) {
          state.form.error = 'feedback.network';
        } else { 
          state.form.error = err.message;
        }
      });
  });
});
