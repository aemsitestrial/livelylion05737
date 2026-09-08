/* eslint-disable */
/* global WebImporter */
/**
 * Parser for accordion-faq. Base block: accordion.
 * Source: https://wknd-trendsetters.site/ (home, FAQ)
 * Structure (library): 2 columns, one row per item — [title] [content].
 * The accordion base block has no UE model, so no field hints (default content in cells).
 */
export default function parse(element, { document }) {
  // Each <details> is one accordion item.
  const items = Array.from(element.querySelectorAll(':scope > details.faq-item, :scope > details, details.faq-item'));

  // Empty-block guard
  if (items.length === 0) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const cells = [];
  items.forEach((item) => {
    // Title: prefer the inner text span of the summary (excludes the toggle icon img).
    const summary = item.querySelector('summary');
    const titleSpan = summary ? summary.querySelector('span') : null;
    const titleCell = titleSpan || summary || '';

    // Content: the answer body.
    const answer = item.querySelector('.faq-answer, div');
    const contentCell = answer || '';

    cells.push([titleCell, contentCell]);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'accordion-faq', cells });
  element.replaceWith(block);
}
