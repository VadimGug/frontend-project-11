import './style.css'

const app = document.querySelector('#app')

app.innerHTML = `
  <section class="py-12 px-4 bg-slate-900 text-white">
    <div class="max-w-2xl mx-auto">
      <h1 class="text-4xl font-bold mb-2">RSS агрегатор</h1>
      <p class="text-slate-400 mb-6">Начните читать RSS сегодня! Это легко, это красиво.</p>
      <form class="flex gap-2">
        <input 
          type="url" 
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
    </div>
  </section>
`;
