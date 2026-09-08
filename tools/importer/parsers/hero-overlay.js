/* eslint-disable */
/* global WebImporter */
/**
 * Parser for hero-overlay. Base block: hero.
 * Source: https://wknd-trendsetters.site/ (home, closing section)
 * Structure (library): 1 column, up to 3 rows — [block name], [image], [text].
 * xwalk field hints: image cell -> field:image, text cell -> field:text (imageAlt collapses to attr).
 */
export default function parse(element, { document }) {
  // --- Extract content (selectors validated against source.html) ---
  const bgImage = element.querySelector('img.cover-image, img');
  const heading = element.querySelector('h1, h2, .h1-heading');
  const subheading = element.querySelector('.subheading, .card-body p, p');
  const buttons = Array.from(element.querySelectorAll('.button-group a, a.button'));

  // Empty-block guard
  if (!heading && !subheading && !bgImage) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const cellWithHint = (field, nodes) => {
    const frag = document.createDocumentFragment();
    frag.appendChild(document.createComment(` field:${field} `));
    nodes.filter(Boolean).forEach((n) => frag.appendChild(n));
    return frag;
  };

  const cells = [];

  // Row 2: background image — optional
  if (bgImage) {
    cells.push([cellWithHint('image', [bgImage])]);
  }

  // Row 3: overlaid text content (heading + subheading + CTA)
  const textNodes = [];
  if (heading) textNodes.push(heading);
  if (subheading) textNodes.push(subheading);
  textNodes.push(...buttons);
  cells.push([cellWithHint('text', textNodes)]);

  const block = WebImporter.Blocks.createBlock(document, { name: 'hero-overlay', cells });
  element.replaceWith(block);
}
