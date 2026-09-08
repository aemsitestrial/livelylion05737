/* eslint-disable */
/* global WebImporter */
/**
 * Parser for cards-article. Base block: cards (container).
 * Source: https://wknd-trendsetters.site/ (home, latest articles)
 * Structure (library): one row per card; cell 1 = image, cell 2 = text (richtext: tag, date, title, CTA).
 * xwalk field hints: image cell -> field:image, text cell -> field:text.
 */
export default function parse(element, { document }) {
  // Each direct anchor is one article card.
  const cards = Array.from(element.querySelectorAll(':scope > a.article-card, :scope > a.card-link, :scope > a'));

  // Empty-block guard
  if (cards.length === 0) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const cells = [];
  cards.forEach((card) => {
    const img = card.querySelector('img');
    const tag = card.querySelector('.tag');
    const date = card.querySelector('.article-card-meta .paragraph-sm, .article-card-meta span:not(.tag)');
    const heading = card.querySelector('h1, h2, h3, h4, [class*="heading"]');
    const href = card.getAttribute('href');

    // Cell 1: image
    const imageFrag = document.createDocumentFragment();
    imageFrag.appendChild(document.createComment(' field:image '));
    if (img) imageFrag.appendChild(img);

    // Cell 2: text (tag, date, title as a link preserving the card href)
    const textFrag = document.createDocumentFragment();
    textFrag.appendChild(document.createComment(' field:text '));
    if (tag) textFrag.appendChild(tag);
    if (date) textFrag.appendChild(date);
    if (heading) {
      if (href) {
        const link = document.createElement('a');
        link.setAttribute('href', href);
        // Preserve heading semantics inside the link.
        link.appendChild(heading);
        textFrag.appendChild(link);
      } else {
        textFrag.appendChild(heading);
      }
    }

    cells.push([imageFrag, textFrag]);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-article', cells });
  element.replaceWith(block);
}
