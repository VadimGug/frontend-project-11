import * as yup from 'yup';
import axios from 'axios';
import parseRSS from './parser.js';

const generateId = () => `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

const buildProxyUrl = (url) => `https://allorigins.hexlet.app/get?disableCache=true&url=${encodeURIComponent(url)}`;

const extractXmlString = (data) => {
  let xmlString;
  if (typeof data === 'string') {
    try {
      const parsed = JSON.parse(data);
      xmlString = parsed.contents || data;
    } catch {
      xmlString = data;
    }
  } else if (data && typeof data === 'object') {
    xmlString = data.contents || data.data || JSON.stringify(data);
  }
  return typeof xmlString === 'object' ? JSON.stringify(xmlString) : xmlString;
};

const initController = (state, elements) => {
  const { form, appContainer, dialogElement } = elements;

  const checkUpdates = () => {
    if (state.urls.length === 0) {
      setTimeout(checkUpdates, 5000);
      return;
    }

    const promises = state.urls.map((url, index) => axios.get(buildProxyUrl(url))
      .then((response) => {
        const finalXml = extractXmlString(response.data);
        const { posts } = parseRSS(finalXml);
        const currentPostLinks = state.posts.map((p) => p.link);
        const newPostsFromNetwork = posts.filter((post) => !currentPostLinks.includes(post.link));

        if (newPostsFromNetwork.length > 0) {
          const postsWithId = newPostsFromNetwork.map((post) => ({
            id: generateId(),
            feedId: state.feeds[index].id,
            title: post.title,
            link: post.link,
            description: post.description,
          }));
          state.posts = [...postsWithId, ...state.posts];
        }
      })
      .catch((err) => {
        console.error('Ошибка обновления фида:', err);
      }));

    Promise.all(promises).finally(() => {
      setTimeout(checkUpdates, 5000);
    });
  };

  setTimeout(checkUpdates, 5000);

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const currentUrl = formData.get('url');
    const schema = yup.string().url().required().notOneOf(state.urls);

    schema.validate(currentUrl)
      .then(() => {
        state.form.status = 'loading';
        return axios.get(buildProxyUrl(currentUrl));
      })
      .then((response) => {
        const finalXml = extractXmlString(response.data);
        const { feed, posts } = parseRSS(finalXml);
        const feedId = generateId();

        const newFeed = {
          id: feedId,
          title: feed.title,
          description: feed.description,
        };

        const newPosts = posts.map((post) => ({
          id: generateId(),
          feedId,
          title: post.title,
          link: post.link,
          description: post.description,
        }));

        state.feeds = [...state.feeds, newFeed];
        state.posts = [...state.posts, ...newPosts];
        state.urls = [...state.urls, currentUrl];

        state.form.error = '';
        state.form.status = 'finished';

        form.reset();
        const inputElement = form.querySelector('input[name="url"]');
        if (inputElement) {
          inputElement.focus();
        }
      })
      .catch((err) => {
        state.form.status = 'failed';
        if (err.name === 'ValidationError') {
          state.form.error = err.message;
        } else if (err.isAxiosError) {
          state.form.error = 'feedback.network';
        } else {
          state.form.error = 'feedback.invalidRss';
        }
      });
  });

  appContainer.addEventListener('click', (e) => {
    const { id } = e.target.dataset;
    if (id) {
      if (!state.uiState.viewedPostIds.includes(id)) {
        state.uiState.viewedPostIds = [...state.uiState.viewedPostIds, id];
      }
      if (e.target.tagName === 'BUTTON') {
        state.uiState.previewPostId = id;
      }
    }
  });

  if (dialogElement) {
    dialogElement.addEventListener('close', () => {
      state.uiState.previewPostId = null;
    });
  }
};

export default initController;
