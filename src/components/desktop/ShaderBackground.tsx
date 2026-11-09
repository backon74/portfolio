"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "@/os/hooks/useReducedMotion";

/**
 * Animated cyan/blue shader-ish background. WebGL fragment shader driving
 * flowing noise + plasma. Visibly moving at all times.
 */
const VS = `
attribute vec2 aPos;
varying vec2 vUv;
void main() {
  vUv = aPos * 0.5 + 0.5;
  gl_Position = vec4(aPos, 0.0, 1.0);
}
`;

const FS = `
precision highp float;
varying vec2 vUv;
uniform float uT;
uniform vec2 uRes;

// Simple hash-based noise
float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}
float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  float a = hash(i);
  float b = hash(i + vec2(1.0, 0.0));
  float c = hash(i + vec2(0.0, 1.0));
  float d = hash(i + vec2(1.0, 1.0));
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
}
float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  for (int i = 0; i < 5; i++) {
    v += a * noise(p);
    p *= 2.0;
    a *= 0.5;
  }
  return v;
}

void main() {
  vec2 uv = vUv;
  vec2 st = uv;
  st.x *= uRes.x / uRes.y;

  float t = uT * 0.05;

  // Two flow fields
  vec2 q = vec2(fbm(st * 2.0 + vec2(t, -t * 0.7)),
                fbm(st * 2.0 + vec2(-t * 0.8, t * 0.6)));
  vec2 r = vec2(fbm(st * 1.8 + q * 4.0 + vec2(t * 1.3, t * 0.9)),
                fbm(st * 1.8 + q * 4.0 + vec2(-t * 0.5, t * 1.1)));

  float n = fbm(st * 2.0 + r * 3.0);

  // Palette: sky blue → cyan highlight → violet dusk
  vec3 skyA = vec3(0.86, 0.92, 1.00);
  vec3 skyB = vec3(0.47, 0.62, 0.92);
  vec3 cyan = vec3(0.13, 0.82, 1.00);
  vec3 violet = vec3(0.60, 0.44, 0.94);
  vec3 col = mix(skyA, skyB, smoothstep(0.2, 0.9, n));
  col = mix(col, cyan, smoothstep(0.55, 0.85, n) * 0.55);
  col = mix(col, violet, smoothstep(0.15, 0.0, n) * 0.35);

  // Vignette
  float v = smoothstep(1.2, 0.3, length(uv - 0.5));
  col *= mix(0.85, 1.0, v);

  // Subtle horizontal scanline
  float sc = sin(uv.y * uRes.y * 1.5 + uT * 2.0) * 0.5 + 0.5;
  col += 0.02 * sc * vec3(0.3, 0.8, 1.0);

  gl_FragColor = vec4(col, 1.0);
}
`;

function compile(gl: WebGLRenderingContext, type: number, src: string) {
  const sh = gl.createShader(type)!;
  gl.shaderSource(sh, src);
  gl.compileShader(sh);
  if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
    console.warn(gl.getShaderInfoLog(sh));
  }
  return sh;
}

export function ShaderBackground() {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const c = ref.current;
    if (!c) return;
    const gl = c.getContext("webgl", { antialias: false, alpha: false });
    if (!gl) return;

    const prog = gl.createProgram()!;
    const vs = compile(gl, gl.VERTEX_SHADER, VS);
    const fs = compile(gl, gl.FRAGMENT_SHADER, FS);
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]), gl.STATIC_DRAW);
    const aPos = gl.getAttribLocation(prog, "aPos");
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

    const uT = gl.getUniformLocation(prog, "uT");
    const uRes = gl.getUniformLocation(prog, "uRes");

    const DPR = Math.min(2, window.devicePixelRatio || 1);
    const resize = () => {
      c.width = Math.floor(window.innerWidth * DPR * 0.5);
      c.height = Math.floor(window.innerHeight * DPR * 0.5);
      gl.viewport(0, 0, c.width, c.height);
      gl.uniform2f(uRes, c.width, c.height);
    };
    resize();
    window.addEventListener("resize", resize);

    const start = performance.now();
    let raf = 0;
    const draw = () => {
      const t = (performance.now() - start) / 1000;
      gl.uniform1f(uT, t);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
      raf = requestAnimationFrame(draw);
    };
    if (!reduced) raf = requestAnimationFrame(draw);
    else {
      gl.uniform1f(uT, 0);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
    }

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, [reduced]);

  return (
    <canvas
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 h-full w-full"
      style={{ filter: "saturate(1.1) blur(0.5px)" }}
    />
  );
}
