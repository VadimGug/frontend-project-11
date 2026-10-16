export const createState = () => {
  return {
    formState: {
      url: null,
      status: null, // success, dublicate, error
    },
    processState: {
      isLoading: 'false', // "processing", "failed", "success"
      processError: null,
    },
  }
}

export const createFeedDataState = () => {
  return {
    feeds: [],
    posts: [],
  }
}
