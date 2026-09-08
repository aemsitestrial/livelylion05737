/* eslint-disable */
/* global WebImporter */
/**
 * Parser for columns-article. Base block: columns.
 * Source: https://wknd-trendsetters.site/ (home, article intro)
 * Structure (library): multi-column; row 2 = one cell per column.
 * xwalk note: Columns blocks do NOT use field hints — cells hold default content only.
 */
export default function parse(element, { document }) {
  // Two side-by-side columns: image column + text (breadcrumbs + heading + byline) column.
  const columnDivs = Array.from(element.querySelectorAll(':scope > div'));

  // Empty-block guard
  if (columnDivs.length === 0) {
    element.replaceWith(...element.childNodes);
    return;
  }

  // Each direct child div becomes one column cell (no field hints for columns).
  const row = columnDivs.map((col) => col);

  const cells = [row];

  const block = WebImporter.Blocks.createBlock(document, { name: 'columns-article', cells });
  element.replaceWith(block);
}
