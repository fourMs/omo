/**
 * Simple genetic algorithm for 16-step drum grooves (one drum per step, 8 pads + rest).
 */

export const EVO_STEPS = 16;
/** Pad index 0–7, or REST (no hit). */
export const EVO_REST = 8;

const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));

export function randomGenes(rand = Math.random) {
  const g = new Uint8Array(EVO_STEPS);
  for (let i = 0; i < EVO_STEPS; i++) {
    g[i] = rand() < 0.55 ? EVO_REST : (rand() * 8) | 0;
  }
  return g;
}

/** Quantize pad hits into one bar of sixteenth steps. */
export function quantizeHits(hits, bpm = 96) {
  const stepDur = 60 / bpm / 4;
  const genes = new Uint8Array(EVO_STEPS);
  genes.fill(EVO_REST);
  for (const { t, pad } of hits) {
    const s = clamp(Math.floor(t / stepDur), 0, EVO_STEPS - 1);
    genes[s] = pad;
  }
  return genes;
}

/**
 * @param {Uint8Array} genes
 * @param {Uint8Array | null} target
 * @param {number} userBonus 0–1 from 👍 on last candidate
 */
export function patternFitness(genes, target, userBonus = 0) {
  if (!target) return 0.15 + userBonus;
  let score = 0;
  let max = 0;
  for (let i = 0; i < EVO_STEPS; i++) {
    max += 3;
    if (genes[i] === target[i]) score += 3;
    else if (genes[i] !== EVO_REST && target[i] !== EVO_REST) score += 0.4;
    else if (genes[i] === EVO_REST && target[i] === EVO_REST) score += 2;
  }
  return clamp(score / max + userBonus, 0, 1);
}

export function genesToTracks(genes, tracks = 4) {
  const rows = Array.from({ length: tracks }, () => Array(EVO_STEPS).fill(false));
  for (let s = 0; s < EVO_STEPS; s++) {
    const p = genes[s];
    if (p < tracks) rows[p][s] = true;
  }
  return rows;
}

function tournament(pop, k = 3, rand = Math.random) {
  let best = pop[(rand() * pop.length) | 0];
  for (let i = 1; i < k; i++) {
    const c = pop[(rand() * pop.length) | 0];
    if (c.fitness > best.fitness) best = c;
  }
  return best;
}

function crossover(a, b, rand = Math.random) {
  const child = new Uint8Array(EVO_STEPS);
  const point = 1 + ((rand() * (EVO_STEPS - 1)) | 0);
  for (let i = 0; i < EVO_STEPS; i++) child[i] = i < point ? a[i] : b[i];
  return child;
}

function mutate(genes, rate, rand = Math.random) {
  for (let i = 0; i < EVO_STEPS; i++) {
    if (rand() > rate) continue;
    if (rand() < 0.35) genes[i] = EVO_REST;
    else genes[i] = (rand() * 8) | 0;
  }
}

/**
 * @param {{ genes: Uint8Array, fitness: number }[]} population
 * @param {Uint8Array | null} target
 * @param {{ popSize?: number, elite?: number, mutRate?: number, userBonus?: number }} opts
 */
export function evolveGeneration(population, target, opts = {}) {
  const popSize = opts.popSize ?? 20;
  const elite = opts.elite ?? 3;
  const mutRate = opts.mutRate ?? 0.12;
  const rand = opts.rand ?? Math.random;

  population.forEach((ind) => {
    ind.fitness = patternFitness(ind.genes, target, 0);
  });
  population.sort((a, b) => b.fitness - a.fitness);

  const next = population.slice(0, elite).map((ind) => ({
    genes: Uint8Array.from(ind.genes),
    fitness: patternFitness(ind.genes, target, 0),
  }));

  while (next.length < popSize) {
    const p1 = tournament(population, 3, rand);
    const p2 = tournament(population, 3, rand);
    const child = crossover(p1.genes, p2.genes, rand);
    mutate(child, mutRate, rand);
    next.push({
      genes: child,
      fitness: patternFitness(child, target, 0),
    });
  }

  next.sort((a, b) => b.fitness - a.fitness);
  return next;
}

export function createPopulation(size, target, rand = Math.random) {
  return Array.from({ length: size }, () => {
    const genes = randomGenes(rand);
    return { genes, fitness: patternFitness(genes, target, 0) };
  });
}
