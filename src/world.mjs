import { Body, Bodies, Svg } from "matter-js";

import FunnelSVG from "./assets/funnel.svg?raw";

const WORLD_WIDTH = 1200;
const BORDER_OVERLAP = -1;
const WORLD_HEIGHT = 600;
const WALL_WIDTH = 20;
const FORCEFIELD_WIDTH = 50;

export function forceFields() {
  const result = [
    Bodies.rectangle(
      BORDER_OVERLAP * (WALL_WIDTH / 2) + FORCEFIELD_WIDTH / 2,
      WORLD_HEIGHT / 2,
      FORCEFIELD_WIDTH,
      WORLD_HEIGHT,
      {
        isSensor: true,
        isStatic: true,
        label: "forcefield_left",
        render: { fillStyle: "green", lineWidth: 0, opacity: 0.3 },
      }
    ),
    Bodies.rectangle(
      WORLD_WIDTH - BORDER_OVERLAP * (WALL_WIDTH / 2) - FORCEFIELD_WIDTH / 2,
      WORLD_HEIGHT / 2,
      FORCEFIELD_WIDTH,
      WORLD_HEIGHT,
      {
        isSensor: true,
        isStatic: true,
        label: "forcefield_right",
        render: { fillStyle: "green", lineWidth: 0, opacity: 0.3 },
      }
    ),
  ];
  return result;
}

function walls() {
  const result = [
    Bodies.rectangle(
      WORLD_WIDTH / 2,
      BORDER_OVERLAP * (WALL_WIDTH / 2),
      WORLD_WIDTH,
      WALL_WIDTH,
      {
        isStatic: true,
      }
    ),
    Bodies.rectangle(
      WORLD_WIDTH / 2,
      WORLD_HEIGHT - BORDER_OVERLAP * (WALL_WIDTH / 2),
      WORLD_WIDTH,
      WALL_WIDTH,
      {
        isStatic: true,
      }
    ),
    Bodies.rectangle(
      BORDER_OVERLAP * (WALL_WIDTH / 2),
      WORLD_HEIGHT / 2,
      WALL_WIDTH,
      WORLD_HEIGHT,
      {
        isStatic: true,
      }
    ),
    Bodies.rectangle(
      WORLD_WIDTH - BORDER_OVERLAP * (WALL_WIDTH / 2),
      WORLD_HEIGHT / 2,
      WALL_WIDTH,
      WORLD_HEIGHT,
      {
        isStatic: true,
      }
    ),
  ];
  return result;
}

function spikes() {
  const result = [
    Body.create({
      position: { x: WORLD_WIDTH / 2, y: WORLD_HEIGHT - 35 },
      vertices: [
        { x: WORLD_WIDTH / 2 - 20, y: WORLD_HEIGHT },
        { x: WORLD_WIDTH / 2, y: WORLD_HEIGHT - 70 },
        { x: WORLD_WIDTH / 2 + 20, y: WORLD_HEIGHT },
      ],
      render: { fillStyle: "blue", opacity: 1, lineWidth: 0 },
      isStatic: true,
    }),
    Body.create({
      position: { x: WORLD_WIDTH / 2, y: WORLD_HEIGHT + 30 },
      vertices: [
        { x: 0, y: WORLD_HEIGHT + 100 },
        { x: 0, y: WORLD_HEIGHT },
        { x: WORLD_WIDTH / 2, y: WORLD_HEIGHT - 30 },
        { x: WORLD_WIDTH, y: WORLD_HEIGHT },
        { x: WORLD_WIDTH, y: WORLD_HEIGHT + 100 },
      ],
      render: { fillStyle: "blue" },
      isStatic: true,
    }),
  ];
  result.forEach((v) => {
    v.friction = 0;
  });
  return result;
}

function topRamp() {
  const result = [
    Bodies.fromVertices(
      10,
      10,
      [
        [
          { x: -20, y: 50 },
          { x: -20, y: -10 },
          { x: 70, y: -10 },
        ],
      ],
      {
        isStatic: true,
        render: { fillStyle: "gray" },
      }
    ),
    Bodies.fromVertices(
      WORLD_WIDTH - 10,
      10,
      [
        [
          { x: 20, y: 50 },
          { x: -70, y: -10 },
          { x: 20, y: -10 },
        ],
      ],
      {
        isStatic: true,
        render: { fillStyle: "gray" },
      }
    ),
  ];
  return result;
}

export async function funnels() {
  /**
   *
   * @param {string} url
   * @returns {Promise<Document>}
   */
  const loadSvg = async function (url) {
    const raw = FunnelSVG;
    return new window.DOMParser().parseFromString(raw, "image/svg+xml");
  };
  const f = await loadSvg("./assets/funnel.svg");
  const paths = Array.from(f.querySelectorAll("path"));
  console.log(paths);
  const vertices = paths.map((v) => Svg.pathToVertices(v, 30));
  console.log(vertices);

  return Bodies.fromVertices(70, 90, vertices, {
    isStatic: true,
    render: {
      fillStyle: "blue",
      // strokeStyle: color,
      lineWidth: 0,
    },
  });
}

export function buildWorld() {
  return [...walls(), ...spikes(), ...topRamp()];
}
