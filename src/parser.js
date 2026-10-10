const parseRSS = (xmlString) => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(xmlString, 'application/xml');

  const errorNode = doc.querySelector('parsererror');
  if (errorNode) {
    throw new Error('feedback.invalidRss'); 
  }
  const feedTitle = doc.querySelector('channel > title').textContent;
  const feedDescription = doc.querySelector('channel > description').textContent;
  const items = doc.querySelectorAll('item');
  const posts = Array.from(items).map((item) => {
    const title = item.querySelector('title').textContent;
    const link = item.querySelector('link').textContent;
    return { title, link };
  });

  return {
    feed: { title: feedTitle, description: feedDescription },
    posts,
  };
};

export default parseRSS;
