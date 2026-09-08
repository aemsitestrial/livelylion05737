/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: wknd-trendsetters site-wide cleanup.
 * Removes non-authorable site chrome (skip link, navbar/header, footer).
 * All selectors verified against migration-work/cleaned.html.
 */
const TransformHook = { beforeTransform: 'beforeTransform', afterTransform: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName === TransformHook.afterTransform) {
    // Non-authorable global chrome (verified in cleaned.html):
    //   <a class="skip-link">Skip to main content</a>
    //   <div class="navbar"> ... nav-menu / mega-menu ... </div>
    //   <footer class="footer inverse-footer"> ... </footer>
    WebImporter.DOMUtils.remove(element, [
      'a.skip-link',
      '.navbar',
      'footer.footer',
    ]);
  }
}
