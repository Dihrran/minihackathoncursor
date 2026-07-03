export function createBadge(text, variant = 'open') {
  const span = document.createElement('span');
  span.className = `ds-badge ds-badge-${variant}`;
  span.textContent = text;
  return span;
}

export function badgeVariantForRecruitment(status) {
  if (status === 'Open') return 'recruit-open';
  if (status === 'Coming Soon') return 'recruit-soon';
  return 'recruit-closed';
}
