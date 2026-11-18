import { proxy } from 'valtio/vanilla';
import './style.css';
import * as yup from 'yup';
import i18next from 'i18next';
import ru from './locales/ru.js';
import watch from './view.js';
import initController from './controller.js';

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
  uiState: {
    viewedPostIds: [],
    previewPostId: null,
  },
});

i18next.init({
  lng: 'ru',
  debug: false,
  resources: { ru },
}).then(() => {
  const app = document.querySelector('#app');

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
    <dialog class="rounded-lg border border-slate-200 shadow-xl p-6 max-w-md w-full backdrop:bg-slate-900/50">
      <div class="flex flex-col gap-4 text-slate-900">
        <h2 class="modal-title text-xl font-bold"></h2>
        <p class="modal-body text-slate-600 text-sm" data-test="modal-body"></p>
        <div class="flex justify-end gap-2 mt-2">
          <a class="full-link bg-blue-600 text-white px-4 py-2 rounded text-sm font-medium hover:bg-blue-700" target="_blank" rel="noopener noreferrer">
            ${i18next.t('modal.readMore')}
          </a>
          <form method="dialog">
            <button class="bg-slate-100 text-slate-700 px-4 py-2 rounded text-sm font-medium hover:bg-slate-200">
              ${i18next.t('modal.close')}
            </button>
          </form>
        </div>
      </div>
    </dialog>
  `;

  const elements = {
    form: document.querySelector('form'),
    appContainer: app,
    dialogElement: document.querySelector('dialog'),
  };

  watch(state);
  initController(state, elements);
});
