import { Bodies, Body, Vector } from "matter-js";

/**
 * @param {Vector}  position
 * @returns {Body[]}
 */
export function buildCore(position) {
  /**
   *
   * @param {number} radius
   * @param {number} sidelength
   * @returns {number}
   */
  function sidesForCircle(radius, sidelength) {
    sidelength /= radius;
    let current_try = 3;
    while (2 * Math.sin(Math.PI / current_try) > sidelength) {
      current_try += 1;
    }
    if (current_try == 3) {
      return 3;
    }
    return current_try - 1;
  }

  /**
   *
   * @param {number} radius
   * @param {Vector}  position
   * @param {number} sidelength
   * @param {number} height
   * @returns {Body[]}
   */
  function buildRing(radius, position, sidelength, height) {
    const sides = sidesForCircle(radius, sidelength);
    const result = [];
    for (let s = 0; s < sides; s += 1) {
      const b = Bodies.rectangle(
        position.x + radius * Math.sin((s * (2 * Math.PI)) / sides),
        position.y + radius * Math.cos((s * (2 * Math.PI)) / sides),
        sidelength,
        height,
        {
          isStatic: true,
          render: {
            lineWidth: 0,
            fillStyle: "limegreen",
          },
        }
      );
      Body.rotate(b, -(s * 2 * Math.PI) / sides);
      result.push(b);
    }
    return result;
  }
  /** @type {Body[]} */
  const result = [];
  for (let i = 0; i < 10; i += 1) {
    const c = buildRing(30 + i * 7, position, 10, 5);
    result.push(...c);
  }
  return result;
}
