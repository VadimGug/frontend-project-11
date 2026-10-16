import { validate } from './utils'
import { elements, proxyState, proxyFeedDataState, feedDataState } from './view'
import { fetchRSS, parseFeedData } from './rss-service'
import i18next from 'i18next'

export default () => {
  const { submitButton, input } = elements

  input.addEventListener('input', (e) => {
    e.preventDefault()
    const inputData = input.value.trim()
    proxyState.formState.url = inputData
    proxyState.formState.status = null
  })

  submitButton.addEventListener('click', (e) => {
    e.preventDefault()

    proxyState.processState.isLoading = true
    proxyState.processState.processError = null

    validate(proxyState.formState.url)
      .then((result) => {
        proxyState.formState.status = result.status

        if (result.status === 'success') {
          return fetchRSS(proxyState.formState.url)
            .then((data) => {
              try {
                const feedData = parseFeedData(data, proxyState.formState.url)
                console.log('Данные распарсены:', feedData)

                proxyFeedDataState.feeds = [
                  feedData.feed,
                  ...proxyFeedDataState.feeds,
                ]
                proxyFeedDataState.posts.unshift(...feedData.posts)

                console.log('Состояние обновлено: ', feedDataState)
              }
              catch (parseError) {
                console.error('Ошибка парсинга:', parseError)
                if (parseError.message === i18next.t('statusMessage.invalidRSS')) {
                  proxyState.processState.processError = 'invalidRSS'
                  proxyState.formState.status = 'invalidRSS'
                }
                else {
                  throw parseError
                }
              }
            })
            .catch(() => {
              console.log('Ошибка сети')
              proxyState.processState.processError = 'networkError'
              proxyState.formState.status = 'networkError'
            })
        }
        else {
          console.log('Ошибка: ', result.message)
        }
      })
      .catch((error) => {
        proxyState.formState.status = error.name
        proxyState.processState.processError = error.message
        console.log('Непредвиденная ошибка')
      })
      .finally(() => {
        proxyState.processState.isLoading = false
      })
  })
}
