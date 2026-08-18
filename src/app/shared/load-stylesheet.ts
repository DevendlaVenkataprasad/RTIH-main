/** Injects a <link rel="stylesheet"> once per href, for CSS too large to ship as a global or component style. */
export function loadStylesheetOnce(href: string): void {
  if (typeof document === 'undefined' || document.querySelector(`link[href="${href}"]`)) {
    return;
  }

  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = href;
  document.head.appendChild(link);
}
