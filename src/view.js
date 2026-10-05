import { subscribe } from "valtio/vanilla";

export default (state) => {
  const input = document.querySelector('input[name="url"]');
  const feedback = document.querySelector('.feedback');

  subscribe(state, () => {
    if (state.form.status === 'failed') {
      input.classList.add('ring-2', 'ring-red-500', 'border-transparent');
      feedback.textContent = state.form.error; 
    }

    if (state.form.status === 'filling' && state.form.error === '') {
      input.classList.remove('ring-2', 'ring-red-500', 'border-transparent');
      feedback.textContent = '';
    }
  });
};
