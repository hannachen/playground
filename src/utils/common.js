/**
 * Get current document scroll position.
 * https://plainjs.com/javascript/styles/get-and-set-scroll-position-of-an-element-26/
 *
 * @returns {{top: number, left: number}}
 */
export const getScrollPosition = () => {
  return {
    top: window.pageYOffset || document.documentElement.scrollTop,
    left: window.pageXOffset || document.documentElement.scrollLeft
  }
}

export const getWindowSize = () => {
  const width = (window.innerWidth > 0) ? window.innerWidth : screen.width
  const height = (window.innerHeight > 0) ? window.innerHeight : screen.height
  return { width, height }
}
