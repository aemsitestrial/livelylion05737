/* eslint-disable */
/* global WebImporter */

// PARSER IMPORTS
import heroShowcaseParser from './parsers/hero-showcase.js';
import columnsArticleParser from './parsers/columns-article.js';
import cardsGalleryParser from './parsers/cards-gallery.js';
import tabsTestimonialParser from './parsers/tabs-testimonial.js';
import cardsArticleParser from './parsers/cards-article.js';
import accordionFaqParser from './parsers/accordion-faq.js';
import heroOverlayParser from './parsers/hero-overlay.js';

// TRANSFORMER IMPORTS
import cleanupTransformer from './transformers/wknd-trendsetters-cleanup.js';
import sectionsTransformer from './transformers/wknd-trendsetters-sections.js';

// PAGE TEMPLATE CONFIGURATION - Embedded from page-templates.json
const PAGE_TEMPLATE = {
  name: 'home',
  description: 'WKND Trendsetters home page: hero showcase, article intro, image gallery, testimonial tabs, latest articles, FAQ accordion, and closing overlay hero.',
  urls: [
    'https://wknd-trendsetters.site/'
  ],
  blocks: [
    {
      name: 'hero-showcase',
      instances: ['main#main-content > header.section.secondary-section .container > .grid-layout'],
      section: 'grey'
    },
    {
      name: 'columns-article',
      instances: ['main#main-content > section.section:nth-of-type(1) .container > .grid-layout']
    },
    {
      name: 'cards-gallery',
      instances: ['main#main-content > section.section.secondary-section:nth-of-type(2) .grid-layout.desktop-4-column'],
      section: 'grey'
    },
    {
      name: 'tabs-testimonial',
      instances: ['main#main-content > section.section:nth-of-type(3) .tabs-wrapper']
    },
    {
      name: 'cards-article',
      instances: ['main#main-content > section.section.secondary-section:nth-of-type(4) .grid-layout.desktop-4-column'],
      section: 'grey'
    },
    {
      name: 'accordion-faq',
      instances: ['main#main-content > section.section:nth-of-type(5) .faq-list']
    },
    {
      name: 'hero-overlay',
      instances: ['main#main-content > section.section.inverse-section:nth-of-type(6) .container > .grid-layout']
    }
  ],
  sections: [
    { id: 'section-1', name: 'Hero showcase', selector: 'main#main-content > header.section.secondary-section', style: 'grey', blocks: ['hero-showcase'], defaultContent: [] },
    { id: 'section-2', name: 'Article intro', selector: 'main#main-content > section.section:nth-of-type(1)', style: 'light', blocks: ['columns-article'], defaultContent: [] },
    { id: 'section-3', name: 'Image gallery', selector: 'main#main-content > section.section.secondary-section:nth-of-type(2)', style: 'grey', blocks: ['cards-gallery'], defaultContent: ['main#main-content > section.section.secondary-section:nth-of-type(2) .utility-text-align-center'] },
    { id: 'section-4', name: 'Testimonials', selector: 'main#main-content > section.section:nth-of-type(3)', style: 'light', blocks: ['tabs-testimonial'], defaultContent: [] },
    { id: 'section-5', name: 'Latest articles', selector: 'main#main-content > section.section.secondary-section:nth-of-type(4)', style: 'grey', blocks: ['cards-article'], defaultContent: ['main#main-content > section.section.secondary-section:nth-of-type(4) .utility-text-align-center'] },
    { id: 'section-6', name: 'FAQ', selector: 'main#main-content > section.section:nth-of-type(5)', style: 'light', blocks: ['accordion-faq'], defaultContent: ['main#main-content > section.section:nth-of-type(5) .grid-layout > div:first-child'] },
    { id: 'section-7', name: 'Closing hero overlay', selector: 'main#main-content > section.section.inverse-section:nth-of-type(6)', style: 'dark', blocks: ['hero-overlay'], defaultContent: [] }
  ]
};

// PARSER REGISTRY
const parsers = {
  'hero-showcase': heroShowcaseParser,
  'columns-article': columnsArticleParser,
  'cards-gallery': cardsGalleryParser,
  'tabs-testimonial': tabsTestimonialParser,
  'cards-article': cardsArticleParser,
  'accordion-faq': accordionFaqParser,
  'hero-overlay': heroOverlayParser,
};

// TRANSFORMER REGISTRY - cleanup first, then sections (afterTransform section breaks/metadata)
const transformers = [
  cleanupTransformer,
  ...(PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [sectionsTransformer] : []),
];

/**
 * Execute all page transformers for a specific hook
 */
function executeTransformers(hookName, element, payload) {
  const enhancedPayload = {
    ...payload,
    template: PAGE_TEMPLATE,
  };

  transformers.forEach((transformerFn) => {
    try {
      transformerFn.call(null, hookName, element, enhancedPayload);
    } catch (e) {
      console.error(`Transformer failed at ${hookName}:`, e);
    }
  });
}

/**
 * Find all blocks on the page based on the embedded template configuration
 */
function findBlocksOnPage(document, template) {
  const pageBlocks = [];

  template.blocks.forEach((blockDef) => {
    blockDef.instances.forEach((selector) => {
      const elements = document.querySelectorAll(selector);
      if (elements.length === 0) {
        console.warn(`Block "${blockDef.name}" selector not found: ${selector}`);
      }
      elements.forEach((element) => {
        pageBlocks.push({
          name: blockDef.name,
          selector,
          element,
          section: blockDef.section || null,
        });
      });
    });
  });

  console.log(`Found ${pageBlocks.length} block instances on page`);
  return pageBlocks;
}

// EXPORT DEFAULT CONFIGURATION
export default {
  transform: (payload) => {
    const {
      document, url, html, params,
    } = payload;

    const main = document.body;

    // 1. beforeTransform (initial cleanup)
    executeTransformers('beforeTransform', main, payload);

    // 2. Find blocks on page
    const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);

    // 3. Parse each block using registered parsers
    pageBlocks.forEach((block) => {
      if (!block.element.parentNode) return; // Already replaced by earlier parser
      const parser = parsers[block.name];
      if (parser) {
        try {
          parser(block.element, { document, url, params });
        } catch (e) {
          console.error(`Failed to parse ${block.name} (${block.selector}):`, e);
        }
      } else {
        console.warn(`No parser found for block: ${block.name}`);
      }
    });

    // 4. afterTransform (final cleanup + section breaks/metadata)
    executeTransformers('afterTransform', main, payload);

    // 5. WebImporter built-in rules
    const hr = document.createElement('hr');
    main.appendChild(hr);
    WebImporter.rules.createMetadata(main, document);
    WebImporter.rules.transformBackgroundImages(main, document);
    WebImporter.rules.adjustImageUrls(main, url, params.originalURL);

    // 6. Generate sanitized path (map root URL to /index)
    const rawPath = new URL(params.originalURL).pathname
      .replace(/\/$/, '')
      .replace(/\.html?$/, '');
    const path = WebImporter.FileUtils.sanitizePath(rawPath === '' ? '/index' : rawPath);

    return [{
      element: main,
      path,
      report: {
        title: document.title,
        template: PAGE_TEMPLATE.name,
        blocks: pageBlocks.map((b) => b.name),
      },
    }];
  },
};
