// Util functions and helpers

/**
 * requestAnimationFrame Polyfill
 * @type {((callback: FrameRequestCallback) => number) | *}
 */
window.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
  window.webkitRequestAnimationFrame || window.msRequestAnimationFrame

/**
 * Returns a random integer between min (inclusive) and max (inclusive)
 * Using Math.round() will give you a non-uniform distribution!
 */
export const getRandomInt = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export const colorGenerator = path => {
  const random = 32;
  const ratio = (path.x * path.y) / (path.cols * path.lines)
  const code = Math.floor(255 - (ratio * (255-random)) - Math.random()*random).toString(16)
  return '#'+code+code+code;
}

export const average = (list = []) => {
  return Math.round(list.reduce((total = 0, num) => {
    return total + num
  }, 0) / list.length)
}