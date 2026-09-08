/* eslint-disable */
var CustomImportScript = (() => {
  var __defProp = Object.defineProperty;
  var __defProps = Object.defineProperties;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getOwnPropSymbols = Object.getOwnPropertySymbols;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __propIsEnum = Object.prototype.propertyIsEnumerable;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __spreadValues = (a, b) => {
    for (var prop in b || (b = {}))
      if (__hasOwnProp.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    if (__getOwnPropSymbols)
      for (var prop of __getOwnPropSymbols(b)) {
        if (__propIsEnum.call(b, prop))
          __defNormalProp(a, prop, b[prop]);
      }
    return a;
  };
  var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // tools/importer/import-home.js
  var import_home_exports = {};
  __export(import_home_exports, {
    default: () => import_home_default
  });

  // tools/importer/parsers/hero-showcase.js
  function parse(element, { document: document2 }) {
    const heading = element.querySelector("h1, .h1-heading, h2");
    const subheading = element.querySelector(".subheading, p");
    const buttons = Array.from(element.querySelectorAll(".button-group a, a.button"));
    const images = Array.from(element.querySelectorAll("img.cover-image, img"));
    if (!heading && !subheading && images.length === 0) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const cellWithHint = (field, nodes) => {
      const frag = document2.createDocumentFragment();
      frag.appendChild(document2.createComment(` field:${field} `));
      nodes.filter(Boolean).forEach((n) => frag.appendChild(n));
      return frag;
    };
    const cells = [];
    if (images.length) {
      cells.push([cellWithHint("image", images)]);
    }
    const textNodes = [];
    if (heading) textNodes.push(heading);
    if (subheading) textNodes.push(subheading);
    textNodes.push(...buttons);
    cells.push([cellWithHint("text", textNodes)]);
    const block = WebImporter.Blocks.createBlock(document2, { name: "hero-showcase", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/columns-article.js
  function parse2(element, { document: document2 }) {
    const columnDivs = Array.from(element.querySelectorAll(":scope > div"));
    if (columnDivs.length === 0) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const row = columnDivs.map((col) => col);
    const cells = [row];
    const block = WebImporter.Blocks.createBlock(document2, { name: "columns-article", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-gallery.js
  function parse3(element, { document: document2 }) {
    const tiles = Array.from(element.querySelectorAll(":scope > div"));
    if (tiles.length === 0) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const imageCell = (img) => {
      const frag = document2.createDocumentFragment();
      frag.appendChild(document2.createComment(" field:image "));
      if (img) frag.appendChild(img);
      return frag;
    };
    const cells = [];
    tiles.forEach((tile) => {
      const img = tile.querySelector("img");
      if (!img) return;
      cells.push([imageCell(img), ""]);
    });
    const block = WebImporter.Blocks.createBlock(document2, { name: "cards-gallery", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/tabs-testimonial.js
  function parse4(element, { document: document2 }) {
    const panels = Array.from(element.querySelectorAll(".tabs-content .tab-pane, .tab-pane"));
    const labels = Array.from(element.querySelectorAll(".tab-menu .tab-menu-link, .tab-menu button, button.tab-menu-link"));
    if (panels.length === 0 && labels.length === 0) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const rowCount = Math.max(panels.length, labels.length);
    const cells = [];
    for (let i = 0; i < rowCount; i += 1) {
      const label = labels[i];
      const panel = panels[i];
      const labelCell = label ? Array.from(label.childNodes) : "";
      const contentCell = panel ? Array.from(panel.childNodes) : "";
      cells.push([labelCell, contentCell]);
    }
    const block = WebImporter.Blocks.createBlock(document2, { name: "tabs-testimonial", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-article.js
  function parse5(element, { document: document2 }) {
    const cards = Array.from(element.querySelectorAll(":scope > a.article-card, :scope > a.card-link, :scope > a"));
    if (cards.length === 0) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const cells = [];
    cards.forEach((card) => {
      const img = card.querySelector("img");
      const tag = card.querySelector(".tag");
      const date = card.querySelector(".article-card-meta .paragraph-sm, .article-card-meta span:not(.tag)");
      const heading = card.querySelector('h1, h2, h3, h4, [class*="heading"]');
      const href = card.getAttribute("href");
      const imageFrag = document2.createDocumentFragment();
      imageFrag.appendChild(document2.createComment(" field:image "));
      if (img) imageFrag.appendChild(img);
      const textFrag = document2.createDocumentFragment();
      textFrag.appendChild(document2.createComment(" field:text "));
      if (tag) textFrag.appendChild(tag);
      if (date) textFrag.appendChild(date);
      if (heading) {
        if (href) {
          const link = document2.createElement("a");
          link.setAttribute("href", href);
          link.appendChild(heading);
          textFrag.appendChild(link);
        } else {
          textFrag.appendChild(heading);
        }
      }
      cells.push([imageFrag, textFrag]);
    });
    const block = WebImporter.Blocks.createBlock(document2, { name: "cards-article", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/accordion-faq.js
  function parse6(element, { document: document2 }) {
    const items = Array.from(element.querySelectorAll(":scope > details.faq-item, :scope > details, details.faq-item"));
    if (items.length === 0) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const cells = [];
    items.forEach((item) => {
      const summary = item.querySelector("summary");
      const titleSpan = summary ? summary.querySelector("span") : null;
      const titleCell = titleSpan || summary || "";
      const answer = item.querySelector(".faq-answer, div");
      const contentCell = answer || "";
      cells.push([titleCell, contentCell]);
    });
    const block = WebImporter.Blocks.createBlock(document2, { name: "accordion-faq", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/hero-overlay.js
  function parse7(element, { document: document2 }) {
    const bgImage = element.querySelector("img.cover-image, img");
    const heading = element.querySelector("h1, h2, .h1-heading");
    const subheading = element.querySelector(".subheading, .card-body p, p");
    const buttons = Array.from(element.querySelectorAll(".button-group a, a.button"));
    if (!heading && !subheading && !bgImage) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const cellWithHint = (field, nodes) => {
      const frag = document2.createDocumentFragment();
      frag.appendChild(document2.createComment(` field:${field} `));
      nodes.filter(Boolean).forEach((n) => frag.appendChild(n));
      return frag;
    };
    const cells = [];
    if (bgImage) {
      cells.push([cellWithHint("image", [bgImage])]);
    }
    const textNodes = [];
    if (heading) textNodes.push(heading);
    if (subheading) textNodes.push(subheading);
    textNodes.push(...buttons);
    cells.push([cellWithHint("text", textNodes)]);
    const block = WebImporter.Blocks.createBlock(document2, { name: "hero-overlay", cells });
    element.replaceWith(block);
  }

  // tools/importer/transformers/wknd-trendsetters-cleanup.js
  var TransformHook = { beforeTransform: "beforeTransform", afterTransform: "afterTransform" };
  function transform(hookName, element, payload) {
    if (hookName === TransformHook.afterTransform) {
      WebImporter.DOMUtils.remove(element, [
        "a.skip-link",
        ".navbar",
        "footer.footer"
      ]);
    }
  }

  // tools/importer/transformers/wknd-trendsetters-sections.js
  var SECTION_MARKER_ATTR = "data-excat-section-id";
  function transform2(hookName, element, payload) {
    const sections = payload.template && payload.template.sections || [];
    if (hookName === "beforeTransform") {
      for (let i = sections.length - 1; i >= 0; i -= 1) {
        const section = sections[i];
        if (i === 0 && !section.style) continue;
        const sectionEl = element.querySelector(section.selector);
        if (!sectionEl) continue;
        const hr = document.createElement("hr");
        if (section.style) hr.setAttribute(SECTION_MARKER_ATTR, section.id);
        sectionEl.before(hr);
      }
    }
    if (hookName === "afterTransform") {
      for (let i = sections.length - 1; i >= 0; i -= 1) {
        const section = sections[i];
        if (!section.style) continue;
        const marker = element.querySelector(`[${SECTION_MARKER_ATTR}="${section.id}"]`);
        const anchor = marker || element.querySelector(section.selector);
        if (!anchor) continue;
        const metadataBlock = WebImporter.Blocks.createBlock(document, {
          name: "Section Metadata",
          cells: { style: section.style }
        });
        anchor.after(metadataBlock);
        if (marker) {
          marker.removeAttribute(SECTION_MARKER_ATTR);
          if (i === 0) marker.remove();
        }
      }
    }
  }

  // tools/importer/import-home.js
  var PAGE_TEMPLATE = {
    name: "home",
    description: "WKND Trendsetters home page: hero showcase, article intro, image gallery, testimonial tabs, latest articles, FAQ accordion, and closing overlay hero.",
    urls: [
      "https://wknd-trendsetters.site/"
    ],
    blocks: [
      {
        name: "hero-showcase",
        instances: ["main#main-content > header.section.secondary-section .container > .grid-layout"],
        section: "grey"
      },
      {
        name: "columns-article",
        instances: ["main#main-content > section.section:nth-of-type(1) .container > .grid-layout"]
      },
      {
        name: "cards-gallery",
        instances: ["main#main-content > section.section.secondary-section:nth-of-type(2) .grid-layout.desktop-4-column"],
        section: "grey"
      },
      {
        name: "tabs-testimonial",
        instances: ["main#main-content > section.section:nth-of-type(3) .tabs-wrapper"]
      },
      {
        name: "cards-article",
        instances: ["main#main-content > section.section.secondary-section:nth-of-type(4) .grid-layout.desktop-4-column"],
        section: "grey"
      },
      {
        name: "accordion-faq",
        instances: ["main#main-content > section.section:nth-of-type(5) .faq-list"]
      },
      {
        name: "hero-overlay",
        instances: ["main#main-content > section.section.inverse-section:nth-of-type(6) .container > .grid-layout"]
      }
    ],
    sections: [
      { id: "section-1", name: "Hero showcase", selector: "main#main-content > header.section.secondary-section", style: "grey", blocks: ["hero-showcase"], defaultContent: [] },
      { id: "section-2", name: "Article intro", selector: "main#main-content > section.section:nth-of-type(1)", style: "light", blocks: ["columns-article"], defaultContent: [] },
      { id: "section-3", name: "Image gallery", selector: "main#main-content > section.section.secondary-section:nth-of-type(2)", style: "grey", blocks: ["cards-gallery"], defaultContent: ["main#main-content > section.section.secondary-section:nth-of-type(2) .utility-text-align-center"] },
      { id: "section-4", name: "Testimonials", selector: "main#main-content > section.section:nth-of-type(3)", style: "light", blocks: ["tabs-testimonial"], defaultContent: [] },
      { id: "section-5", name: "Latest articles", selector: "main#main-content > section.section.secondary-section:nth-of-type(4)", style: "grey", blocks: ["cards-article"], defaultContent: ["main#main-content > section.section.secondary-section:nth-of-type(4) .utility-text-align-center"] },
      { id: "section-6", name: "FAQ", selector: "main#main-content > section.section:nth-of-type(5)", style: "light", blocks: ["accordion-faq"], defaultContent: ["main#main-content > section.section:nth-of-type(5) .grid-layout > div:first-child"] },
      { id: "section-7", name: "Closing hero overlay", selector: "main#main-content > section.section.inverse-section:nth-of-type(6)", style: "dark", blocks: ["hero-overlay"], defaultContent: [] }
    ]
  };
  var parsers = {
    "hero-showcase": parse,
    "columns-article": parse2,
    "cards-gallery": parse3,
    "tabs-testimonial": parse4,
    "cards-article": parse5,
    "accordion-faq": parse6,
    "hero-overlay": parse7
  };
  var transformers = [
    transform,
    ...PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [transform2] : []
  ];
  function executeTransformers(hookName, element, payload) {
    const enhancedPayload = __spreadProps(__spreadValues({}, payload), {
      template: PAGE_TEMPLATE
    });
    transformers.forEach((transformerFn) => {
      try {
        transformerFn.call(null, hookName, element, enhancedPayload);
      } catch (e) {
        console.error(`Transformer failed at ${hookName}:`, e);
      }
    });
  }
  function findBlocksOnPage(document2, template) {
    const pageBlocks = [];
    template.blocks.forEach((blockDef) => {
      blockDef.instances.forEach((selector) => {
        const elements = document2.querySelectorAll(selector);
        if (elements.length === 0) {
          console.warn(`Block "${blockDef.name}" selector not found: ${selector}`);
        }
        elements.forEach((element) => {
          pageBlocks.push({
            name: blockDef.name,
            selector,
            element,
            section: blockDef.section || null
          });
        });
      });
    });
    console.log(`Found ${pageBlocks.length} block instances on page`);
    return pageBlocks;
  }
  var import_home_default = {
    transform: (payload) => {
      const {
        document: document2,
        url,
        html,
        params
      } = payload;
      const main = document2.body;
      executeTransformers("beforeTransform", main, payload);
      const pageBlocks = findBlocksOnPage(document2, PAGE_TEMPLATE);
      pageBlocks.forEach((block) => {
        if (!block.element.parentNode) return;
        const parser = parsers[block.name];
        if (parser) {
          try {
            parser(block.element, { document: document2, url, params });
          } catch (e) {
            console.error(`Failed to parse ${block.name} (${block.selector}):`, e);
          }
        } else {
          console.warn(`No parser found for block: ${block.name}`);
        }
      });
      executeTransformers("afterTransform", main, payload);
      const hr = document2.createElement("hr");
      main.appendChild(hr);
      WebImporter.rules.createMetadata(main, document2);
      WebImporter.rules.transformBackgroundImages(main, document2);
      WebImporter.rules.adjustImageUrls(main, url, params.originalURL);
      const rawPath = new URL(params.originalURL).pathname.replace(/\/$/, "").replace(/\.html?$/, "");
      const path = WebImporter.FileUtils.sanitizePath(rawPath === "" ? "/index" : rawPath);
      return [{
        element: main,
        path,
        report: {
          title: document2.title,
          template: PAGE_TEMPLATE.name,
          blocks: pageBlocks.map((b) => b.name)
        }
      }];
    }
  };
  return __toCommonJS(import_home_exports);
})();
