/* eslint-disable */
/* global WebImporter */
/**
 * Parser for tabs-testimonial. Base block: tabs.
 * Source: https://wknd-trendsetters.site/ (home, testimonials)
 * Structure (library): 2 columns, one row per tab — [tab label] [tab content].
 * The tabs base block has no UE model, so no field hints (default content in cells).
 * Source keeps labels (.tab-menu button) and panels (.tabs-content .tab-pane) in
 * separate containers; pair them by index.
 */
export default function parse(element, { document }) {
  const panels = Array.from(element.querySelectorAll('.tabs-content .tab-pane, .tab-pane'));
  const labels = Array.from(element.querySelectorAll('.tab-menu .tab-menu-link, .tab-menu button, button.tab-menu-link'));

  // Empty-block guard
  if (panels.length === 0 && labels.length === 0) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const rowCount = Math.max(panels.length, labels.length);
  const cells = [];
  for (let i = 0; i < rowCount; i += 1) {
    const label = labels[i];
    const panel = panels[i];

    // Label cell: use the button's inner content (avatar + name + role).
    const labelCell = label ? Array.from(label.childNodes) : '';
    // Content cell: the panel body (photo + name + role + quote).
    const contentCell = panel ? Array.from(panel.childNodes) : '';

    cells.push([labelCell, contentCell]);
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'tabs-testimonial', cells });
  element.replaceWith(block);
}
