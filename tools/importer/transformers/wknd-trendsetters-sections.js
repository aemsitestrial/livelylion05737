/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: wknd-trendsetters section breaks and section metadata.
 * The "home" template has 7 sections, each with a style. Inserts an <hr>
 * before every section except the first, and a Section Metadata block after
 * every section that has a style.
 *
 * Section selectors come directly from page-templates.json (DOM-verified
 * boundaries from page analysis).
 *
 * Breaks are inserted in beforeTransform (while every section element still
 * exists, before block parsers replace them), using a marker attribute so the
 * metadata block can be anchored in afterTransform.
 */
const SECTION_MARKER_ATTR = 'data-excat-section-id';

export default function transform(hookName, element, payload) {
  const sections = (payload.template && payload.template.sections) || [];

  if (hookName === 'beforeTransform') {
    // Insert breaks now, before parsers can replace any section element.
    for (let i = sections.length - 1; i >= 0; i -= 1) {
      const section = sections[i];
      if (i === 0 && !section.style) continue; // first section: no leading break
      const sectionEl = element.querySelector(section.selector);
      if (!sectionEl) continue; // selector didn't match — skip, never guess

      const hr = document.createElement('hr');
      if (section.style) hr.setAttribute(SECTION_MARKER_ATTR, section.id);
      sectionEl.before(hr);
    }
  }

  if (hookName === 'afterTransform') {
    // Parsers have run and may have replaced section elements. Anchor each
    // styled section's Section Metadata block to the marker <hr> placed above,
    // or (first section, no marker inserted) the original element itself.
    for (let i = sections.length - 1; i >= 0; i -= 1) {
      const section = sections[i];
      if (!section.style) continue;

      const marker = element.querySelector(`[${SECTION_MARKER_ATTR}="${section.id}"]`);
      const anchor = marker || element.querySelector(section.selector);
      if (!anchor) continue; // neither survived — skip, never guess

      const metadataBlock = WebImporter.Blocks.createBlock(document, {
        name: 'Section Metadata',
        cells: { style: section.style },
      });
      anchor.after(metadataBlock);

      if (marker) {
        marker.removeAttribute(SECTION_MARKER_ATTR);
        if (i === 0) marker.remove(); // section 0 never gets a real leading break
      }
    }
  }
}
