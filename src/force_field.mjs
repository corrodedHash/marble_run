import { Body, Query, Engine } from "matter-js";

/**
 *
 * @param {Object} param0
 * @param {Engine} param0.source
 */
export function ForceField({ source }) {
  const engine = source;
  const x_margin = 7.5;
  const x_correction = 0.1;
  const y_max_vel = 10;
  const f = engine.world.bodies.filter((v) => v.label.startsWith("forcefield"));
  for (const fe of f) {
    Query.region(engine.world.bodies, fe.bounds).forEach((v) => {
      // Body.applyForce(v, v.position, {
      //   x: -v.mass * engine.gravity.x,
      //   y: -v.mass * engine.gravity.y,
      // });
      if (v.velocity.y < -y_max_vel) {
        Body.setVelocity(v, { x: v.velocity.x, y: -y_max_vel });
      } else {
        //   Body.applyForce(v, v.position, { x: 0, y: -0.0001 });
        Body.applyForce(v, v.position, {
          x: 0,
          y: -(v.mass * engine.gravity.scale),
        });
        Body.applyForce(v, v.position, { x: 0, y: -0.00001 });
      }
      // if (v.position.x - fe.position.x > x_margin && v.velocity.x > -x_correction) {
      //   Body.setVelocity(v,{x: -x_correction, y: v.velocity.y})
      // } else if (v.position.x - fe.position.x < -x_margin && v.velocity.x < x_correction) {
      //   Body.setVelocity(v,{x: x_correction, y: v.velocity.y})
      // }
    });
  }
}
