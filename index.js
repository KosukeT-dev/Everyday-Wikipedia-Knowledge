const apiUrl = 'https://en.wikipedia.org/w/api.php';

function getRandomArticle() {
  const params = new URLSearchParams({
    action: 'query',
    format: 'json',
    list: 'random',
    rnnamespace: 0, // Only get articles, not talk pages or user pages
    rnlimit: 1, // Only get one article at a time
    origin: '*', // Needed to avoid CORS error
  });

  return fetch(`${apiUrl}?${params}`).then(response => response.json()).then(data => data.query.random[0]);
}

function getArticleContent(title) {
  const params = new URLSearchParams({
    action: 'query',
    format: 'json',
    prop: 'extracts',
    exintro: '', // Only get introductory section
    explaintext: '', // Get plain text, not HTML
    titles: title,
    origin: '*', // Needed to avoid CORS error
  });

  return fetch(`${apiUrl}?${params}`).then(response => response.json()).then(data => {
    const page = Object.values(data.query.pages)[0];
    return {
      title: page.title,
      content: page.extract,
    };
  });
}

const randomInfoBtn = document.getElementById('random-info-btn');
const randomWikipediaInfo = document.getElementById('random-wikipedia-info');

async function displayRandomArticle() {
  const article = await getRandomArticle();
  const articleContent = await getArticleContent(article.title);
  randomWikipediaInfo.innerHTML = `
    <h2>${articleContent.title}</h2>
    <p>${articleContent.content}</p>
  `;
}

randomInfoBtn.addEventListener('click', displayRandomArticle);

displayRandomArticle();
