const parseRSS = (xmlString) => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(xmlString, 'application/xml');

  const errorNode = doc.querySelector('parsererror');
  if (errorNode) {
    throw new Error('feedback.invalidRss');
  }

  const channel = doc.querySelector('channel');
  if (!channel) {
    throw new Error('feedback.invalidRss');
  }

  const feedTitle = channel.querySelector('title')?.textContent ?? '';
  const feedDescription = channel.querySelector('description')?.textContent ?? '';
  const items = doc.querySelectorAll('item');

  const posts = Array.from(items).map((item) => {
    const title = item.querySelector('title')?.textContent ?? '';
    const link = item.querySelector('link')?.textContent ?? '';
    const description = item.querySelector('description')?.textContent ?? '';
    return { title, link, description };
  });

  return {
    feed: { title: feedTitle, description: feedDescription },
    posts,
  };
};

export default parseRSS;
