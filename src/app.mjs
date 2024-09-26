import {
  Engine,
  Render,
  Runner,
  Events,
  Composite,
  Bodies,
  Body,
  Query,
} from "matter-js";
import { buildWorld, forceFields } from "./world.mjs";

function spawnMarble() {
  const v = 0.0001 * (Math.random() - 0.5);
  const vy = 0.001 * Math.random();
  const result = Bodies.circle(400, 200, 5, { force: { x: v, y: -vy } });
  // Body.setMass(result, Math.random() / 10 + 0.01)
  return result;
}

function runWorld() {
  // create engine
  var engine = Engine.create({}),
    world = engine.world;

  // create renderer
  var render = Render.create({
    element: document.body,
    engine: engine,
    options: {
      width: 800,
      height: 600,
      // showAngleIndicator: true,
      // showCollisions: true,
      // showVelocity: true,
      // showIds: true,
      // showPerformance: true,
      // showDebug: true,
      wireframes: false,
    },
  });
  Render.run(render);

  // create runner
  var runner = Runner.create();
  Runner.run(runner, engine);

  const f = forceFields();
  Composite.add(world, f);
  Composite.add(world, buildWorld());

  let nextBallSpawn = 40;

  /** @type {Body[]} */
  const marbles = [];

  Events.on(runner, "tick", ({ timestamp, source, name }) => {
    if (nextBallSpawn <= timestamp) {
      nextBallSpawn += 200;
      const m = spawnMarble();
      marbles.push(m);
      Composite.add(world, m);
    }
  });
  Events.on(engine, "beforeUpdate", ({ source, name }) => {
    const x_margin = 7.5;
    const x_correction = 0.1;
    const y_max_vel = 10
    for (const fe of f) {

      Query.region(marbles, fe.bounds).forEach((v) => {
        // Body.applyForce(v, v.position, {
        //   x: -v.mass * engine.gravity.x,
        //   y: -v.mass * engine.gravity.y,
        // });
        if (v.velocity.y < -y_max_vel) {
          Body.setVelocity(v, { x: v.velocity.x, y: -y_max_vel });
        } else {
          Body.applyForce(v, v.position, { x: 0, y: -0.0001 });
        }
        if (v.position.x - fe.position.x > x_margin && v.velocity.x > -x_correction) {
          Body.setVelocity(v,{x: -x_correction, y: v.velocity.y})
        } else if (v.position.x - fe.position.x < -x_margin && v.velocity.x < x_correction) {
          Body.setVelocity(v,{x: x_correction, y: v.velocity.y})
        }
      });
    }
  });

  Render.lookAt(render, {
    min: { x: 0, y: 0 },
    max: { x: 800, y: 600 },
  });
}

window.addEventListener("load", runWorld);
