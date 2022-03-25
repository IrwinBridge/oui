export const isElementBelowScreenCenter = (el) => {
  const { top, bottom } = el.getBoundingClientRect();
  const elHeight = bottom - top;
  const elCenter = top + (elHeight / 2);
  const viewportCenter = window.visualViewport.height / 2;
  return elCenter > viewportCenter;
};

export const positionDropdown = (container) => {
  const { top, bottom } = container.getBoundingClientRect();
  const elHeight = bottom - top;
  const elCenter = top + (elHeight / 2);
  const viewportCenter = window.visualViewport.height / 2;
  if (elCenter > viewportCenter) {
    return `bottom: calc(${elHeight}px + 12px)`;
  }
  return `top: calc(${elHeight}px + 12px)`;
};
