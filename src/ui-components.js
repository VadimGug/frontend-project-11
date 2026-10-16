import { Modal } from 'bootstrap'
import { proxyFeedDataState } from './view'
import i18next from 'i18next'

export const createContentSection = () => {
  const contentSection = document.createElement('section')
  contentSection.classList.add('container-fluid', 'container-xxl', 'p-5')
  const row = document.createElement('div')
  row.classList.add('row')
  contentSection.append(row)

  row.append(createListContainer('post'))
  row.append(createListContainer('feed'))

  return contentSection
}

const createListContainer = (contentType) => {
  const mainContainer = document.createElement('div')
  mainContainer.classList.add(
    'col-md-10',
    'mx-auto',
    'order-lg-1',
  )
  contentType === 'feed'
    ? mainContainer.classList.add('feeds', 'col-lg-4', 'order-0')
    : mainContainer.classList.add('posts', 'col-lg-8', 'order-1')

  const cardContainer = document.createElement('div')
  cardContainer.classList.add('card', 'border-0')
  mainContainer.append(cardContainer)

  const cardBody = document.createElement('div')
  cardBody.classList.add('card-body')
  cardContainer.append(cardBody)
  const cardTitle = document.createElement('h2')

  cardTitle.classList.add('card-title', 'h4')
  contentType === 'feed'
    ? (cardTitle.textContent = 'Фиды')
    : (cardTitle.textContent = 'Посты')
  cardBody.append(cardTitle)

  const contentList = document.createElement('ul')
  contentList.classList.add('list-group', 'border-0')
  contentType === 'feed'
    ? contentList.classList.add('border-end-0')
    : contentList.classList.add('rounded-0')

  cardBody.append(contentList)
  return mainContainer
}

export const createFeedListItem = (feed, list) => {
  const listItem = document.createElement('li')
  listItem.classList.add('list-group-item', 'border-0', 'border-end-0')
  listItem.setAttribute('data-id', feed.feedId)

  const itemTitle = document.createElement('h3')
  itemTitle.classList.add('h6', 'm-0')
  itemTitle.textContent = feed.title

  const itemDescription = document.createElement('p')
  itemDescription.classList.add('m-0', 'small', 'text-black-50')
  itemDescription.textContent = feed.description

  listItem.append(itemTitle, itemDescription)

  list.append(listItem)
}

export const createPostListItem = (post, list) => {
  const listItem = document.createElement('li')
  listItem.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-start', 'border-0', 'border-end-0')

  const postLink = document.createElement('a')
  post.opened ? postLink.classList.add('fw-normal', 'link-secondary') : postLink.classList.add('fw-bold')
  postLink.setAttribute('href', post.link)
  postLink.setAttribute('data-id', post.id)
  postLink.setAttribute('data-feed-id', post.feedId)
  postLink.setAttribute('target', '_blank')
  postLink.setAttribute('rel', 'noopener noreferrer')
  postLink.textContent = post.title

  const postButton = document.createElement('button')
  postButton.setAttribute('type', 'button')
  postButton.setAttribute('data-feed-id', post.feedId)
  postButton.setAttribute('data-id', post.id)
  postButton.setAttribute('data-bs-toggle', 'modal')
  postButton.setAttribute('data-bs-target', '#modal')
  postButton.classList.add('btn', 'btn-outline-primary', 'btn-sm')
  postButton.textContent = i18next.t('buttonText.view')

  listItem.append(postLink, postButton)
  list.append(listItem)

  postButton.addEventListener('click', (e) => {
    const postId = e.target.getAttribute('data-id')
    handlePostButton(postId)
  })
}

const handlePostButton = (postId) => {
  const post = proxyFeedDataState.posts.find(post => post.id === postId)
  if (post) {
    post.opened = true
  }
  updatePostLinkStyle(postId)
  openPostModal(post)
}

const updatePostLinkStyle = (postId) => {
  const postLink = document.querySelector(`a[data-id="${postId}"]`)
  postLink.classList.remove('fw-bold')
  postLink.classList.add('fw-normal')
  postLink.classList.add('link-secondary')
}

const openPostModal = (post) => {
  const modalElement = document.querySelector('.modal')
  const modalTitle = modalElement.querySelector('.modal-title')
  const modalDescription = modalElement.querySelector('.modal-body p')
  const readButton = modalElement.querySelector('.modal-footer .btn-primary')

  modalTitle.textContent = post.title
  modalDescription.textContent = post.description
  readButton.setAttribute('href', post.link)

  const myModal = new Modal(modalElement)
  myModal.show()
}
