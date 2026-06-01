/**
 * Tiny in-browser classifier — no server, educational k-NN + optional 2-layer net.
 * Features are normalized vectors; labels are strings.
 */

export class KNNClassifier {
  constructor(k = 3) {
    this.k = k;
    this.samples = [];
  }

  addSample(features, label) {
    this.samples.push({ features: features.slice(), label });
  }

  clear() {
    this.samples = [];
  }

  get labels() {
    return [...new Set(this.samples.map((s) => s.label))];
  }

  predict(features) {
    if (this.samples.length === 0) return { label: null, confidence: 0 };
    const dists = this.samples.map((s) => ({
      label: s.label,
      d: euclidean(features, s.features),
    }));
    dists.sort((a, b) => a.d - b.d);
    const votes = {};
    const k = Math.min(this.k, dists.length);
    for (let i = 0; i < k; i++) {
      votes[dists[i].label] = (votes[dists[i].label] || 0) + 1;
    }
    let best = null;
    let bestCount = 0;
    for (const [label, count] of Object.entries(votes)) {
      if (count > bestCount) {
        bestCount = count;
        best = label;
      }
    }
    return { label: best, confidence: bestCount / k };
  }
}

function euclidean(a, b) {
  let s = 0;
  const n = Math.min(a.length, b.length);
  for (let i = 0; i < n; i++) s += (a[i] - b[i]) ** 2;
  return Math.sqrt(s);
}

/** Running mean/std for feature normalization */
export class FeatureNormalizer {
  constructor(dim) {
    this.dim = dim;
    this.count = 0;
    this.mean = new Float32Array(dim);
    this.m2 = new Float32Array(dim);
  }

  push(features) {
    this.count++;
    for (let i = 0; i < this.dim; i++) {
      const x = features[i];
      const d = x - this.mean[i];
      this.mean[i] += d / this.count;
      const d2 = x - this.mean[i];
      this.m2[i] += d * d2;
    }
  }

  normalize(features) {
    if (this.count < 2) return features.slice();
    const out = new Float32Array(this.dim);
    for (let i = 0; i < this.dim; i++) {
      const v = this.m2[i] / (this.count - 1);
      const std = Math.sqrt(v) || 1;
      out[i] = (features[i] - this.mean[i]) / std;
    }
    return Array.from(out);
  }
}

export function extractMotionFeatures({ x, y, z }, history = []) {
  const { mag } = { mag: Math.sqrt(x * x + y * y + z * z) };
  const hist = history.slice(-8);
  let variance = 0;
  if (hist.length > 1) {
    const m = hist.reduce((a, b) => a + b, 0) / hist.length;
    variance = hist.reduce((a, b) => a + (b - m) ** 2, 0) / hist.length;
  }
  return [x / 10, y / 10, z / 10, mag / 10, Math.sqrt(variance) / 5];
}

/** @typedef {{ version: number, app: string, k: number, featureDim: number, normalizer: object, samples: { label: string, features: number[] }[] }} TrainingSetExport */

export function exportTrainingSet(classifier, normalizer, extra = {}) {
  return {
    version: 1,
    app: "omo-train-shake",
    k: classifier.k,
    featureDim: normalizer.dim,
    normalizer: {
      count: normalizer.count,
      mean: Array.from(normalizer.mean),
      m2: Array.from(normalizer.m2),
    },
    samples: classifier.samples.map((s) => ({
      label: s.label,
      features: s.features.slice(),
    })),
    exportedAt: new Date().toISOString(),
    ...extra,
  };
}

/**
 * @param {unknown} data
 * @param {KNNClassifier} classifier
 * @param {FeatureNormalizer} normalizer
 * @returns {string|null} Error message, or null on success
 */
export function importTrainingSet(data, classifier, normalizer) {
  if (!data || typeof data !== "object") return "Invalid file";
  const d = /** @type {TrainingSetExport} */ (data);
  if (d.app !== "omo-train-shake" || d.version !== 1) return "Not a Train & Shake dataset";
  if (!Array.isArray(d.samples) || d.samples.length === 0) return "No samples in file";
  if (!d.normalizer || d.normalizer.count < 2) return "Missing normalizer stats";

  classifier.k = typeof d.k === "number" ? d.k : classifier.k;
  classifier.clear();
  normalizer.count = d.normalizer.count;
  normalizer.mean = new Float32Array(d.normalizer.mean);
  normalizer.m2 = new Float32Array(d.normalizer.m2);

  for (const s of d.samples) {
    if (!s.label || !Array.isArray(s.features) || s.features.length !== normalizer.dim) {
      return "Bad sample in file";
    }
    classifier.addSample(s.features, s.label);
  }
  return null;
}

export const MOTION_FEATURE_NAMES = ["ax", "ay", "az", "mag", "jitter"];

const LABEL_COLORS = {
  still: "#38bdf8",
  sway: "#a78bfa",
  shake: "#fb923c",
};

export function labelColor(label) {
  return LABEL_COLORS[label] || "#94a3b8";
}

/** Leave-one-out confusion matrix on stored training samples. */
export function confusionMatrix(classifier, labels) {
  const matrix = {};
  for (const t of labels) {
    matrix[t] = {};
    for (const p of labels) matrix[t][p] = 0;
  }
  if (classifier.samples.length === 0) return matrix;

  for (let i = 0; i < classifier.samples.length; i++) {
    const hold = classifier.samples[i];
    const temp = new KNNClassifier(classifier.k);
    for (let j = 0; j < classifier.samples.length; j++) {
      if (j === i) continue;
      temp.addSample(classifier.samples[j].features, classifier.samples[j].label);
    }
    const pred = temp.predict(hold.features).label || hold.label;
    matrix[hold.label][pred] = (matrix[hold.label][pred] || 0) + 1;
  }
  return matrix;
}

/**
 * Draw 2D scatter of feature[3] (mag) vs feature[4] (jitter).
 * @param {HTMLCanvasElement} canvas
 * @param {{ label: string, features: number[] }[]} samples
 * @param {{ features: number[] } | null} live
 */
export function drawFeatureScatter(canvas, samples, live = null) {
  const box = canvas.getBoundingClientRect();
  const dpr = devicePixelRatio || 1;
  canvas.width = Math.max(1, Math.floor(box.width * dpr));
  canvas.height = Math.max(1, Math.floor(box.height * dpr));
  const g = canvas.getContext("2d");
  const w = canvas.width;
  const h = canvas.height;
  const pad = 22 * dpr;

  g.fillStyle = "#0f172a";
  g.fillRect(0, 0, w, h);

  const xs = samples.map((s) => s.features[3] ?? 0);
  const ys = samples.map((s) => s.features[4] ?? 0);
  if (live) {
    xs.push(live.features[3] ?? 0);
    ys.push(live.features[4] ?? 0);
  }
  let xMin = Math.min(...xs, 0);
  let xMax = Math.max(...xs, 1.5);
  let yMin = Math.min(...ys, 0);
  let yMax = Math.max(...ys, 1.5);
  const xR = xMax - xMin || 1;
  const yR = yMax - yMin || 1;

  const toX = (v) => pad + ((v - xMin) / xR) * (w - pad * 2);
  const toY = (v) => h - pad - ((v - yMin) / yR) * (h - pad * 2);

  g.strokeStyle = "#334155";
  g.lineWidth = dpr;
  g.beginPath();
  g.moveTo(pad, h - pad);
  g.lineTo(w - pad, h - pad);
  g.moveTo(pad, pad);
  g.lineTo(pad, h - pad);
  g.stroke();

  g.fillStyle = "#64748b";
  g.font = `${9 * dpr}px system-ui,sans-serif`;
  g.fillText("mag →", pad, h - 6 * dpr);
  g.save();
  g.translate(8 * dpr, h - pad);
  g.rotate(-Math.PI / 2);
  g.fillText("jitter →", 0, 0);
  g.restore();

  const r = 5 * dpr;
  for (const s of samples) {
    g.fillStyle = labelColor(s.label);
    g.globalAlpha = 0.85;
    g.beginPath();
    g.arc(toX(s.features[3]), toY(s.features[4]), r, 0, Math.PI * 2);
    g.fill();
  }
  g.globalAlpha = 1;

  if (live) {
    g.strokeStyle = "#f8fafc";
    g.lineWidth = 2 * dpr;
    g.beginPath();
    g.arc(toX(live.features[3]), toY(live.features[4]), r + 3 * dpr, 0, Math.PI * 2);
    g.stroke();
  }
}

function relu(x) {
  return x > 0 ? x : 0;
}

function reluDeriv(x) {
  return x > 0 ? 1 : 0;
}

function softmax(logits) {
  const max = Math.max(...logits);
  const ex = logits.map((z) => Math.exp(z - max));
  const sum = ex.reduce((a, b) => a + b, 0);
  return ex.map((e) => e / sum);
}

/** 2-layer MLP (educational stand-in for a tiny TF.js model). Trains on normalized feature vectors. */
export class TinyGestureNet {
  constructor(inputDim = 5, hiddenSize = 14, classLabels = ["still", "sway", "shake"]) {
    this.inputDim = inputDim;
    this.hiddenSize = hiddenSize;
    this.classLabels = classLabels.slice();
    this.trained = false;
    this.W1 = [];
    this.b1 = [];
    this.W2 = [];
    this.b2 = [];
    this.resetWeights();
  }

  resetWeights() {
    const rand = () => (Math.random() - 0.5) * 0.6;
    this.W1 = Array.from({ length: this.hiddenSize }, () =>
      Array.from({ length: this.inputDim }, rand)
    );
    this.b1 = Array.from({ length: this.hiddenSize }, rand);
    this.W2 = Array.from({ length: this.classLabels.length }, () =>
      Array.from({ length: this.hiddenSize }, rand)
    );
    this.b2 = Array.from({ length: this.classLabels.length }, rand);
    this.trained = false;
  }

  forward(x) {
    const h = new Array(this.hiddenSize);
    const hPre = new Array(this.hiddenSize);
    for (let i = 0; i < this.hiddenSize; i++) {
      let s = this.b1[i];
      for (let j = 0; j < this.inputDim; j++) s += this.W1[i][j] * x[j];
      hPre[i] = s;
      h[i] = relu(s);
    }
    const logits = new Array(this.classLabels.length);
    for (let k = 0; k < this.classLabels.length; k++) {
      let s = this.b2[k];
      for (let i = 0; i < this.hiddenSize; i++) s += this.W2[k][i] * h[i];
      logits[k] = s;
    }
    const probs = softmax(logits);
    return { h, hPre, logits, probs };
  }

  /**
   * @param {{ features: number[], label: string }[]} samples
   */
  train(samples, { epochs = 100, lr = 0.12 } = {}) {
    if (samples.length < 6) {
      this.trained = false;
      return false;
    }
    for (let ep = 0; ep < epochs; ep++) {
      const order = samples.map((_, i) => i);
      for (let i = order.length - 1; i > 0; i--) {
        const j = (Math.random() * (i + 1)) | 0;
        [order[i], order[j]] = [order[j], order[i]];
      }
      for (const idx of order) {
        const s = samples[idx];
        const y = this.classLabels.indexOf(s.label);
        if (y < 0) continue;
        const x = s.features;
        const { h, hPre, probs } = this.forward(x);

        const dLogits = probs.slice();
        dLogits[y] -= 1;

        for (let k = 0; k < this.classLabels.length; k++) {
          for (let i = 0; i < this.hiddenSize; i++) {
            this.W2[k][i] -= lr * dLogits[k] * h[i];
          }
          this.b2[k] -= lr * dLogits[k];
        }

        const dH = new Array(this.hiddenSize).fill(0);
        for (let i = 0; i < this.hiddenSize; i++) {
          for (let k = 0; k < this.classLabels.length; k++) {
            dH[i] += dLogits[k] * this.W2[k][i];
          }
          dH[i] *= reluDeriv(hPre[i]);
        }

        for (let i = 0; i < this.hiddenSize; i++) {
          for (let j = 0; j < this.inputDim; j++) {
            this.W1[i][j] -= lr * dH[i] * x[j];
          }
          this.b1[i] -= lr * dH[i];
        }
      }
    }
    this.trained = true;
    return true;
  }

  predict(features) {
    if (!this.trained) return { label: null, confidence: 0 };
    const { probs } = this.forward(features);
    let best = 0;
    for (let i = 1; i < probs.length; i++) {
      if (probs[i] > probs[best]) best = i;
    }
    return {
      label: this.classLabels[best],
      confidence: probs[best],
    };
  }
}
