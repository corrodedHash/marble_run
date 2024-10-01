import Matter from "matter-js";
import { runWorld } from "./engine.mjs";
import polyDecomp from 'poly-decomp'
Matter.Common.setDecomp(polyDecomp);
window.addEventListener("load", runWorld);
