import onChange from 'on-change'
import i18next from 'i18next'
import { createState, createFeedDataState } from './state'
import { createContentSection, createFeedListItem, createPostListItem } from './ui-components'
import { pollFeedsForUpdates, stopPollingFeed } from './rss-service'

export const elements = {
  submitButton: document.querySelector('button[type="submit"]'),
  input: document.querySelector('#url-input'),
  feedback: document.querySelector('.feedback'),
  mainPage: document.querySelector('.flex-grow-1'),
}

const state = createState()
export const feedDataState = createFeedDataState()

export const proxyState = onChange(state, (path) => {
  if (path === 'formState.status' || path === 'processState.isLoading') {
    renderForm(proxyState, elements)
  }
})

export const proxyFeedDataState = onChange(feedDataState, (path) => {
  if (path === 'feeds') {
    feedDataState.feeds.forEach((feed) => {
      stopPollingFeed(feed.feedId)
      pollFeedsForUpdates(feed.url, feed.feedId)
    },
    )
  }

  renderContent()
})

// Рендер формы
const renderForm = (proxyState, elements) => {
  if (proxyState.formState.status) {
    elements.submitButton.disabled = proxyState.processState.isLoading
    elements.feedback.textContent = i18next.t(
      `statusMessage.${proxyState.formState.status}`,
    )

    const isSuccess = proxyState.formState.status === 'success'
    elements.feedback.classList.toggle('text-success', isSuccess)
    elements.feedback.classList.toggle('text-danger', !isSuccess)
    elements.input.classList.toggle('is-invalid', !isSuccess)
    // console.log(feedDataState)

    if (isSuccess) {
      elements.input.focus()
      elements.input.value = ''
    }
  }
}

// рендер списка фидов и постов
const renderContent = () => {
  let contentSection = elements.mainPage.querySelector('.container-xxl')

  if (!contentSection) {
    contentSection = createContentSection()
    updateContent(contentSection)
    elements.mainPage.append(contentSection)
  }
  else {
    updateContent(contentSection)
  }
}

const updateContent = (contentSection) => {
  const feedsList = contentSection.querySelector('.feeds ul')
  const postsList = contentSection.querySelector('.posts ul')

  feedsList.innerHTML = ''
  postsList.innerHTML = ''

  proxyFeedDataState.feeds.forEach((feed) => {
    createFeedListItem(feed, feedsList)
  })
  proxyFeedDataState.posts.forEach((post) => {
    createPostListItem(post, postsList)
  })
}
