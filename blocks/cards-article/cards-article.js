import { createOptimizedPicture } from '../../scripts/aem.js';

export default function decorate(block) {
  /* change to ul, li */
  const ul = document.createElement('ul');
  [...block.children].forEach((row) => {
    const li = document.createElement('li');
    while (row.firstElementChild) li.append(row.firstElementChild);
    [...li.children].forEach((div) => {
      if (div.children.length === 1 && div.querySelector('picture')) div.className = 'cards-article-card-image';
      else div.className = 'cards-article-card-body';
    });

    // Clean up the title: EDS auto-decorates the standalone <p><a> into a
    // .button-container/.button pill and the imported text carries a leading
    // markdown heading marker ("### "). Undo both so it renders as a card title.
    const body = li.querySelector('.cards-article-card-body');
    if (body) {
      // Split the "<category><date>" meta paragraph (e.g. "Casual CoolMay 12")
      // into a category tag + date so each can be styled like the source.
      const meta = body.querySelector('p:not(.button-container)');
      if (meta && !meta.querySelector('a')) {
        const text = meta.textContent.trim();
        const m = text.match(/(January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{1,2}$/);
        meta.className = 'cards-article-card-meta';
        meta.textContent = '';
        if (m) {
          const cat = document.createElement('span');
          cat.className = 'cards-article-card-category';
          cat.textContent = text.slice(0, m.index).trim();
          const date = document.createElement('span');
          date.className = 'cards-article-card-date';
          date.textContent = m[0].trim();
          meta.append(cat, date);
        } else {
          meta.textContent = text;
        }
      }

      const titleLink = body.querySelector('a');
      if (titleLink) {
        titleLink.textContent = titleLink.textContent.replace(/^#+\s*/, '').trim();
        titleLink.classList.remove('button');
        titleLink.classList.add('cards-article-card-title');
        const container = titleLink.closest('.button-container');
        if (container) container.classList.remove('button-container');
      }
    }

    ul.append(li);
  });
  ul.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    img.closest('picture').replaceWith(optimizedPic);
  });
  block.textContent = '';
  block.append(ul);
}
