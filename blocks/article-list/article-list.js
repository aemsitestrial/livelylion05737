const AEM_AUTHOR = 'http://localhost:4502';

const QUERY_URL =
  `${AEM_AUTHOR}/graphql/execute.json/eds-project/article-list`;

export default async function decorate(block) {
  const response = await fetch(QUERY_URL, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    console.error('GraphQL request failed');
    return;
  }

  const { data } = await response.json();

  const articles = data?.articleList?.items ?? [];

  block.innerHTML = '';

  articles.forEach((article) => {
    const card = document.createElement('div');

    card.className = 'article-card';

    card.innerHTML = `
      <h3>${article.title}</h3>
      <p>${article.publishDate || ''}</p>
      <p>${article.body?.plaintext || ''}</p>
    `;

    block.append(card);
  });
}