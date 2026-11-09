/**
 * HamzaOS lo-fi sounds — vinyl crackle + muted wood thunks + tape hiss.
 */
import { writeFileSync, mkdirSync } from "node:fs";
import { resolve, dirname } from "node:path";

const SR = 44100;

type Env = { attack: number; decay: number };
function env(t: number, dur: number, e: Env): number {
  if (t < 0 || t > dur) return 0;
  if (t < e.attack) return t / e.attack;
  const rel = (dur - t) / Math.max(0.0001, dur - e.attack);
  return Math.max(0, Math.min(1, rel)) ** e.decay;
}

type Osc = "sine" | "triangle" | "saw" | "square" | "noise";
type Layer = {
  freq?: number | ((t: number, dur: number) => number);
  dur: number;
  start: number;
  gain: number;
  env?: Env;
  type?: Osc;
  lpf?: number | ((t: number, dur: number) => number);
  hpf?: number;
  // crackle: random amplitude spikes
  crackle?: number;
};

function osc(type: Osc, phase: number): number {
  switch (type) {
    case "sine": return Math.sin(phase);
    case "triangle": return (2 / Math.PI) * Math.asin(Math.sin(phase));
    case "saw": return 2 * ((phase / (2 * Math.PI)) % 1) - 1;
    case "square": return Math.sin(phase) >= 0 ? 1 : -1;
    case "noise": return Math.random() * 2 - 1;
  }
}

function render(layers: Layer[], totalDur: number): Float32Array {
  const n = Math.round(totalDur * SR);
  const out = new Float32Array(n);
  for (const t of layers) {
    const e = t.env ?? { attack: 0.008, decay: 2 };
    const startSample = Math.round(t.start * SR);
    const samples = Math.round(t.dur * SR);
    let phase = 0;
    let lpState = 0;
    let hpPrev = 0, hpOut = 0;
    const hpCoef = t.hpf ? Math.exp((-2 * Math.PI * t.hpf) / SR) : 0;
    for (let i = 0; i < samples; i++) {
      const tt = i / SR;
      const f = typeof t.freq === "function" ? t.freq(tt, t.dur) : (t.freq ?? 0);
      phase += (2 * Math.PI * f) / SR;
      let v = osc(t.type ?? "sine", phase);
      if (t.lpf) {
        const cutoff = typeof t.lpf === "function" ? t.lpf(tt, t.dur) : t.lpf;
        const coef = Math.exp((-2 * Math.PI * cutoff) / SR);
        lpState = v * (1 - coef) + lpState * coef;
        v = lpState;
      }
      if (t.hpf) {
        hpOut = hpCoef * (hpOut + v - hpPrev);
        hpPrev = v;
        v = hpOut;
      }
      // Vinyl crackle: random pops on top of the tone
      if (t.crackle && Math.random() < t.crackle) {
        v += (Math.random() * 2 - 1) * 0.6;
      }
      const a = t.gain * env(tt, t.dur, e);
      const idx = startSample + i;
      if (idx < n) out[idx] += v * a;
    }
  }
  // Soft clip + normalize
  let peak = 0;
  for (let i = 0; i < n; i++) {
    out[i] = Math.tanh(out[i] * 1.1);
    if (Math.abs(out[i]) > peak) peak = Math.abs(out[i]);
  }
  if (peak > 0) {
    const g = 0.78 / peak;
    for (let i = 0; i < n; i++) out[i] *= g;
  }
  return out;
}

function encodeWav(samples: Float32Array, sampleRate = SR): Buffer {
  const dataSize = samples.length * 2;
  const buf = Buffer.alloc(44 + dataSize);
  let o = 0;
  buf.write("RIFF", o); o += 4;
  buf.writeUInt32LE(36 + dataSize, o); o += 4;
  buf.write("WAVE", o); o += 4;
  buf.write("fmt ", o); o += 4;
  buf.writeUInt32LE(16, o); o += 4;
  buf.writeUInt16LE(1, o); o += 2;
  buf.writeUInt16LE(1, o); o += 2;
  buf.writeUInt32LE(sampleRate, o); o += 4;
  buf.writeUInt32LE(sampleRate * 2, o); o += 4;
  buf.writeUInt16LE(2, o); o += 2;
  buf.writeUInt16LE(16, o); o += 2;
  buf.write("data", o); o += 4;
  buf.writeUInt32LE(dataSize, o); o += 4;
  for (let i = 0; i < samples.length; i++) {
    const s = Math.max(-1, Math.min(1, samples[i]));
    buf.writeInt16LE(Math.round(s * 32767), o);
    o += 2;
  }
  return buf;
}

function save(name: string, samples: Float32Array) {
  const file = resolve(process.cwd(), "public/audio", name);
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, encodeWav(samples));
  console.log(`wrote ${file} (${(samples.length / SR).toFixed(2)}s, ${Math.round(samples.length * 2 / 1024)} KB)`);
}

// --- Boot: warm vinyl crackle + low tape hiss + soft piano-ish note --------
save(
  "boot.wav",
  render(
    [
      // Vinyl crackle layer (filtered white noise + random pops)
      {
        type: "noise",
        dur: 1.0,
        start: 0,
        gain: 0.18,
        env: { attack: 0.08, decay: 1.5 },
        hpf: 2500,
        lpf: 6500,
        crackle: 0.002,
      },
      // Warm sub hum
      { freq: 110, dur: 1.0, start: 0.05, gain: 0.22, env: { attack: 0.15, decay: 2 }, type: "sine", lpf: 400 },
      // Muted piano-ish (triangle thunk + lowpass)
      { freq: 329.6, dur: 0.55, start: 0.25, gain: 0.16, env: { attack: 0.003, decay: 3 }, type: "triangle", lpf: 1800 },
      { freq: 440, dur: 0.55, start: 0.45, gain: 0.12, env: { attack: 0.003, decay: 3 }, type: "triangle", lpf: 1800 },
    ],
    1.1,
  ),
);

// --- Open: woody tap + brief crackle ---------------------------------------
save(
  "open.wav",
  render(
    [
      // Wood thunk (lowpassed triangle, short)
      { freq: 520, dur: 0.07, start: 0, gain: 0.5, env: { attack: 0.002, decay: 3 }, type: "triangle", lpf: 1200 },
      { freq: 260, dur: 0.1, start: 0, gain: 0.25, env: { attack: 0.003, decay: 3 }, type: "sine" },
      // Crackle tail
      { type: "noise", dur: 0.09, start: 0.02, gain: 0.08, env: { attack: 0.01, decay: 2 }, hpf: 2500, lpf: 7000, crackle: 0.015 },
    ],
    0.15,
  ),
);

// --- Close: softer woody tap (lower pitch) ---------------------------------
save(
  "close.wav",
  render(
    [
      { freq: 360, dur: 0.08, start: 0, gain: 0.45, env: { attack: 0.002, decay: 3 }, type: "triangle", lpf: 1000 },
      { freq: 180, dur: 0.1, start: 0, gain: 0.22, env: { attack: 0.003, decay: 3 }, type: "sine" },
    ],
    0.14,
  ),
);

// --- Minimise: tape-stop-ish downward glide ---------------------------------
save(
  "minimise.wav",
  render(
    [
      { freq: (t, d) => 480 * Math.pow(0.4, t / d), dur: 0.2, start: 0, gain: 0.35, env: { attack: 0.004, decay: 2 }, type: "triangle", lpf: 1400 },
      { type: "noise", dur: 0.18, start: 0, gain: 0.08, env: { attack: 0.02, decay: 2 }, hpf: 1200, lpf: 3000 },
    ],
    0.25,
  ),
);

// --- Click: muted paper tap --------------------------------------------------
save(
  "click.wav",
  render(
    [
      { freq: 1600, dur: 0.01, start: 0, gain: 0.3, env: { attack: 0.0008, decay: 3 }, type: "sine", lpf: 2000 },
      { type: "noise", dur: 0.012, start: 0, gain: 0.12, env: { attack: 0.0005, decay: 3 }, hpf: 1800, lpf: 4000 },
    ],
    0.05,
  ),
);
