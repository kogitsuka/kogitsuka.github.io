// Preserve the current section when switching between Japanese and English.
for (const link of document.querySelectorAll('[data-language-link]')) {
  link.addEventListener('click', () => {
    const destination = new URL(link.href);
    destination.hash = window.location.hash;
    link.href = destination.href;
  });
}
