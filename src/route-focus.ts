const FOCUS_KEY = 'revision-receipts:focus-route';

function visibleHeading(): HTMLElement | null {
  return [...document.querySelectorAll<HTMLElement>('h1')].find((heading) => heading.offsetParent !== null) ?? null;
}

function focusRouteHeading(): void {
  const heading = visibleHeading();
  if (!heading) return;
  heading.tabIndex = -1;
  heading.focus({ preventScroll: true });

  let status = document.getElementById('route-status');
  if (!status) {
    status = document.createElement('p');
    status.id = 'route-status';
    status.className = 'sr-only';
    status.setAttribute('aria-live', 'polite');
    document.body.append(status);
  }
  status.textContent = heading.textContent?.trim() ?? document.title;
}

document.addEventListener('click', (event) => {
  const link = (event.target as Element).closest<HTMLAnchorElement>('a[href]');
  if (!link || link.target || link.hasAttribute('download')) return;
  const destination = new URL(link.href, window.location.href);
  if (destination.origin !== window.location.origin) return;
  const current = new URL(window.location.href);
  if (destination.pathname === current.pathname && destination.search === current.search) return;
  sessionStorage.setItem(FOCUS_KEY, '1');
});

queueMicrotask(() => {
  if (sessionStorage.getItem(FOCUS_KEY) !== '1') return;
  sessionStorage.removeItem(FOCUS_KEY);
  focusRouteHeading();
});

window.addEventListener('pageshow', (event) => {
  if (!event.persisted && sessionStorage.getItem(FOCUS_KEY) !== '1') return;
  sessionStorage.removeItem(FOCUS_KEY);
  queueMicrotask(focusRouteHeading);
});

window.addEventListener('pagehide', () => sessionStorage.setItem(FOCUS_KEY, '1'));
