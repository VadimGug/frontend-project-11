import { subscribe } from "valtio/vanilla";
import i18next from "i18next";

export default (state) => {
  const input = document.querySelector('input[name="url"]');
  const feedback = document.querySelector('.feedback');

  subscribe(state, () => {
    const postsContainer = document.querySelector('.posts-container');
    const feedsContainer = document.querySelector('.feeds-container');

    if (state.form.status === 'failed') {
      input.classList.add('ring-2', 'ring-red-500', 'border-transparent');
      feedback.textContent = i18next.t(state.form.error);
    }

    if (state.form.status === 'filling' && state.form.error === '') {
      input.classList.remove('ring-2', 'ring-red-500', 'border-transparent');
      feedback.textContent = '';
    }

    if (feedsContainer && state.feeds.length > 0) {
      const feedsHtml = state.feeds.map((feed) => `
      <li class="py-3 border-b border-slate-100 last:border-none">
          <h3 class="font-bold text-slate-800">${feed.title}</h3>
          <p class="text-sm text-slate-500">${feed.description}</p>
      </li>
      `).join('');
      feedsContainer.innerHTML = `
        <div class="p-4 bg-white border border-slate-200 rounded-lg shadow-sm">
          <h2 class="text-xl font-bold mb-4 text-slate-900">${i18next.t('feeds')}</h2>
          <ul class="list-none p-0 m-0">${feedsHtml}</ul>
        </div>
      `;
    }

    if (postsContainer && state.posts.length > 0) {
      const postsHtml = state.posts.map((post) => `
        <li class="py-3 border-b border-slate-100 last:border-none">
          <a href="${post.link}" target="_blank" rel="noopener noreferrer" class="font-medium text-blue-600 hover:text-blue-800">
            ${post.title}
          </a>
        </li>
      `).join('');

      postsContainer.innerHTML = `
        <div class="p-4 bg-white border border-slate-200 rounded-lg shadow-sm">
          <h2 class="text-xl font-bold mb-4 text-slate-900">${i18next.t('posts')}</h2>
          <ul class="list-none p-0 m-0">${postsHtml}</ul>
        </div>
      `;
    }
  });
};
