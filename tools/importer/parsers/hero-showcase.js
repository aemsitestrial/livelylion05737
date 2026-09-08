/* eslint-disable */
/* global WebImporter */
/**
 * Parser for hero-showcase. Base block: hero.
 * Source: https://wknd-trendsetters.site/ (home)
 * Structure (library): 1 column, up to 3 rows — [block name], [image], [text].
 * xwalk field hints: image cell -> field:image, text cell -> field:text (imageAlt collapses to attr).
 */
export default function parse(element, { document }) {
  // --- Extract content (selectors validated against source.html) ---
  const heading = element.querySelector('h1, .h1-heading, h2');
  const subheading = element.querySelector('.subheading, p');
  const buttons = Array.from(element.querySelectorAll('.button-group a, a.button'));
  // Hero showcase carries an image cluster; keep all cover images.
  const images = Array.from(element.querySelectorAll('img.cover-image, img'));

  // Empty-block guard
  if (!heading && !subheading && images.length === 0) {
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

  // Row 2: background/hero image(s) — optional
  if (images.length) {
    cells.push([cellWithHint('image', images)]);
  }

  // Row 3: text content (heading + subheading + CTAs)
  const textNodes = [];
  if (heading) textNodes.push(heading);
  if (subheading) textNodes.push(subheading);
  textNodes.push(...buttons);
  cells.push([cellWithHint('text', textNodes)]);

  const block = WebImporter.Blocks.createBlock(document, { name: 'hero-showcase', cells });
  element.replaceWith(block);
}
