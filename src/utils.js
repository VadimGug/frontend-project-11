import * as yup from 'yup'
import i18next from 'i18next'
import ru from './locales/ru'
import { proxyFeedDataState } from './view'

i18next.init({
  lng: 'ru',
  resources: {
    ru,
  },
})

yup.setLocale({
  mixed: {
    default: i18next.t('statusMessage.error'),
    required: i18next.t('statusMessage.empty'),
  },
  string: {
    url: i18next.t('statusMessage.error'),
  },
})

const checkDuplicate = (url) => {
  let isDuplicate = false
  proxyFeedDataState.feeds.forEach((feed) => {
    if (feed.url === url) {
      isDuplicate = true
    }
  })
  return isDuplicate
}

export const schema = yup.string().required().url().trim()

export const validate = (url) => {
  return schema
    .validate(url)
    .then((validUrl) => {
      const isDuplicate = checkDuplicate(validUrl)
      if (isDuplicate) {
        return {
          status: 'duplicate',
          message: i18next.t('statusMessage.duplicate'),
        }
      }
      return { status: 'success', data: validUrl }
    })
    .catch((error) => {
      if (error.message === i18next.t('statusMessage.empty')) {
        return { status: 'empty', message: error.message }
      }
      return { status: 'error', message: error.message }
    })
}
