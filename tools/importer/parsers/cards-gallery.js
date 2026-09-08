/* eslint-disable */
/* global WebImporter */
/**
 * Parser for cards-gallery. Base block: cards (container).
 * Source: https://wknd-trendsetters.site/ (home, image gallery)
 * Structure (library): one row per card; cell 1 = image, cell 2 = text (richtext).
 * xwalk field hints: image cell -> field:image, text cell -> field:text.
 * Gallery cards are image-only, so the text cell stays empty (no hint on empty cell).
 */
export default function parse(element, { document }) {
  // Each direct grid child is an image-only card tile.
  const tiles = Array.from(element.querySelectorAll(':scope > div'));

  // Empty-block guard
  if (tiles.length === 0) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const imageCell = (img) => {
    const frag = document.createDocumentFragment();
    frag.appendChild(document.createComment(' field:image '));
    if (img) frag.appendChild(img);
    return frag;
  };

  const cells = [];
  tiles.forEach((tile) => {
    const img = tile.querySelector('img');
    if (!img) return;
    // 2 columns: [image] [text]; gallery has no card text so second cell is empty.
    cells.push([imageCell(img), '']);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-gallery', cells });
  element.replaceWith(block);
}
