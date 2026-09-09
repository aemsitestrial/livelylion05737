const QUERY_URL = 'http://localhost:4502/graphql/execute.json/eds-project/article-list';

function createElement(tag, className, text) {
  const element = document.createElement(tag);

  if (className) {
    element.className = className;
  }

  if (text) {
    element.textContent = text;
  }

  return element;
}

export default async function decorate(block) {
  block.textContent = 'Loading articles...';

  try {
    const response = await fetch(QUERY_URL, {
      method: 'GET',
      credentials: 'include',
    });

    if (response.redirected || response.url.includes('/login.html')) {
      throw new Error(
        'Please sign in to your local AEM Author instance.',
      );
    }

    if (!response.ok) {
      throw new Error(
        `GraphQL request failed with status ${response.status}.`,
      );
    }

    const contentType = response.headers.get('content-type') || '';

    if (!contentType.includes('application/json')) {
      throw new Error('AEM did not return a JSON response.');
    }

    const result = await response.json();

    if (result.errors?.length) {
      throw new Error(
        result.errors.map((error) => error.message).join(', '),
      );
    }

    const articles = result.data?.articleList?.items ?? [];

    block.textContent = '';

    if (articles.length === 0) {
      block.textContent = 'No articles found.';
      return;
    }

    articles.forEach((article) => {
      const card = createElement('article', 'article-card');

      const title = createElement(
        'h3',
        'article-card-title',
        article.title || 'Untitled article',
      );

      card.append(title);

      if (article.publishDate) {
        const formattedDate = new Date(
          article.publishDate,
        ).toLocaleDateString();

        const date = createElement(
          'p',
          'article-card-date',
          formattedDate,
        );

        card.append(date);
      }

      const body = createElement(
        'p',
        'article-card-body',
        article.body?.plaintext || '',
      );

      card.append(body);
      block.append(card);
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Article List error:', error);

    block.textContent = error.message;
    block.classList.add('article-list-error');
  }
}
