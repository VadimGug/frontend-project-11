import { subscribe } from "valtio/vanilla";
import i18next from "i18next";

export default (state) => {
  const input = document.querySelector('input[name="url"]');
  const feedback = document.querySelector('.feedback');

  subscribe(state, () => {
    const postsContainer = document.querySelector('.posts-container');
    const feedsContainer = document.querySelector('.feeds-container');

    if (state.form.status === 'failed') {
      feedback.classList.remove('text-green-500');
      feedback.classList.add('text-red-500');
      input.classList.add('ring-2', 'ring-red-500', 'border-transparent');
      feedback.textContent = i18next.t(state.form.error);
    }

    if (state.form.status === 'filling' && state.form.error === '') {
      input.classList.remove('ring-2', 'ring-red-500', 'border-transparent');
      if (state.feeds.length > 0) {
        feedback.classList.remove('text-red-500');
        feedback.classList.add('text-green-500');
        feedback.textContent = i18next.t('feedback.success');
      } else {
      feedback.textContent = '';
    }
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
    };

    if (postsContainer && state.posts.length > 0) {
      const postsHtml = state.posts.map((post) => {
        const isViewed = state.uiState.viewedPostIds.includes(post.id);
        const fontClass = isViewed ? 'font-normal text-slate-600' : 'font-bold text-slate-900';
        return `
        <li class="py-3 border-b border-slate-100 last:border-none flex justify-between items-center gap-4">
          <a href="${post.link}" target="_blank" rel="noopener noreferrer" class="${fontClass} hover:text-blue-600 transition-colors" data-id="${post.id}">
            ${post.title}
          </a>
          <button type="button" class="bg-blue-50 text-blue-600 px-3 py-1.5 rounded text-sm font-medium hover:bg-blue-100 transition-colors shrink-0" data-id="${post.id}">
            ${i18next.t('form.preview')}
          </button>
        </li>
      `;
    }).join('');

    postsContainer.innerHTML = `
      <div class="p-4 bg-white border border-slate-200 rounded-lg shadow-sm">
        <h2 class="text-xl font-bold mb-4 text-slate-900">${i18next.t('posts')}</h2>
        <ul class="list-none p-0 m-0">${postsHtml}</ul>
      </div>
    `;
    };
    if (state.uiState.previewPostId) {
      const dialog = document.querySelector('dialog');
      const currentPost = state.posts.find((p) => p.id === state.uiState.previewPostId);
      
      if (currentPost && dialog) {
        dialog.querySelector('.modal-title').textContent = currentPost.title;
        dialog.querySelector('.modal-body').textContent = currentPost.description;
        dialog.querySelector('.full-link').setAttribute('href', currentPost.link);
        dialog.showModal();
        dialog.onclose = () => {
          state.uiState.previewPostId = null;
        };
      };
    };
  });
};
