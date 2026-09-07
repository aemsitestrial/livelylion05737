export default function decorate(block) {
  block.classList.add('teaser');

  const rows = [...block.children];

  if (rows.length >= 2) {
    rows[0].classList.add('teaser-image');
    rows[1].classList.add('teaser-content');
  }

  const link = block.querySelector('a');

  if (link) {
    link.classList.add('button');
  }
}
