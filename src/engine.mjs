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

import { buildWorld, forceFields, funnels } from "./world.mjs";
import { ForceField } from "./force_field.mjs";
import { buildCore } from "./core.mjs";

function spawnMarble() {
  const v = 0.0001 * (Math.random() - 0.5);
  const vy = 0.001 * Math.random();
  const result = Bodies.circle(600, 400, 3, {
    force: { x: v, y: -vy },
    restitution: 0.7,
    density: 0.001,
    render: {
      lineWidth: 0,
      fillStyle: "gold",
    },
  });
  // Body.setMass(result, Math.random() / 10 + 0.01)
  return result;
}

export function runWorld() {
  // create engine
  var engine = Engine.create({}),
    world = engine.world;

  // create renderer
  var render = Render.create({
    element: document.body.querySelector("#box"),
    engine: engine,
    options: {
      width: 1200,
      height: 600,
      // showConvexHulls: true,
      // showAngleIndicator: true,
      // showCollisions: true,
      // showVelocity: true,
      // showIds: true,
      // showPerformance: true,
      showDebug: true,
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
  const left_core_position = { x: 200, y: 400 };
  const right_core_position = {
    x: render.options.width - left_core_position.x,
    y: left_core_position.y,
  };

  const left_core = Composite.create({ bodies: buildCore(left_core_position) });
  const right_core = Composite.create({
    bodies: buildCore(right_core_position),
  });
  Composite.add(world, [left_core, right_core]);
  funnels().then((v) => Composite.add(world, v));

  /** @type {Body[]} */
  const marbles = [];
  let lastBallSpawn = 0;

  Events.on(runner, "tick", ({ timestamp }) => {
    Composite.rotate(
      left_core,
      -(2 * Math.PI) / 1000,
      left_core_position,
      true
    );
    Composite.rotate(
      right_core,
      (2 * Math.PI) / 1000,
      right_core_position,
      true
    );
  });
  Events.on(runner, "tick", ({ timestamp, source, name }) => {
    if (marbles.length >= 100) return;
    const deltaMs = timestamp - lastBallSpawn;
    const perSec = 0.01;
    const remainder = Math.floor(deltaMs / (perSec * 1000));
    const newTimestamp = deltaMs % (perSec * 1000);
    for (let i = 0; i < remainder; i += 1) {
      lastBallSpawn = timestamp - newTimestamp;
      const m = spawnMarble();
      marbles.push(m);
      Composite.add(world, m);
    }
  });

  Events.on(engine, "beforeUpdate", ForceField);

  Render.lookAt(render, {
    min: { x: 0, y: 0 },
    max: { x: 1200, y: 600 },
  });
}
