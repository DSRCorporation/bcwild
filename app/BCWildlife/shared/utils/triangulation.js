/*
 * Solving triangulation using the algorithm of
 * Lenth, Russell V. “On Finding the Source of a Signal.” Technometrics, vol.
 * 23, no. 2, 1981, pp. 149–54.
 *
 * An alternative definition for $\overline C$ is also available.
 */

// Linear algebra utils

/**
 * Solve a linear system of order 2.
 * @param a Coefficient matrix represented as array in row-major order
 * @param b Constant terms
 * @return Array of solutions
 */
const linsolve2 = (a, b) => {
  const [a11, a12, a21, a22] = a;
  const [b1, b2] = b;
  const delta = a11 * a22 - a12 * a21;
  const deltaX = b1 * a22 - b2 * a12;
  const deltaY = a11 * b2 - a21 * b1;
  return [deltaX / delta, deltaY / delta];
};

/**
 * Dot product of two vectors
 */
const dotprod = (xs, ys) => {
  const n = Math.min(xs.length, ys.length);
  let prod = 0;
  for (let i = 0; i < n; ++i) {
    prod += xs[i] * ys[i];
  }
  return prod;
};

const sum = xs => xs.reduce((acc, val) => acc + val, 0);

const mulByScalar = (scalar, vector) => vector.map(x => x * scalar);

/**
 * Inverse of a 2nd order matrix.
 * @param a Matrix represented as array in row-major order.
 */
const inv2 = a => {
  const [a11, a12, a21, a22] = a;
  const delta = a11 * a22 - a12 * a21;
  const b11 = a22 / delta;
  const b22 = a11 / delta;
  const b12 = -a21 / delta;
  const b21 = -a12 / delta;
  return [b11, b12, b21, b22];
};

const map = (f, ...vectors) => {
  if (vectors.length === 0) {
    return [];
  }
  let n = vectors[0].length;
  const nVectors = vectors.length;
  for (let i = 1; i < nVectors; ++i) {
    const len = vectors[i].length;
    if (len < n) {
      n = len;
    }
  }
  const result = new Array(n);
  for (let i = 0; i < n; ++i) {
    const args = vectors.map(vector => vector[i]);
    result[i] = f(...args);
  }
  return result;
};

const maxDistance = (xs, ys) => {
  const distances = map((xi, yi) => Math.abs(xi - yi), xs, ys);
  const n = distances.length;
  if (n === 0) {
    return 0;
  }
  let max = distances[0];
  for (let i = 1; i < n; ++i) {
    if (distances[i] > maxDistance) {
      max = distances[i];
    }
  }
  return max;
};

// Algorithm implementation
// Naming follows the paper as closely as possible.  By convention, vectorial
// variables have the suffix -s.

// Given bearing angles, compute $s_i$ and $c_i$.
const thetaToS = thetas => map(Math.sin, thetas);
const thetaToC = thetas => map(Math.cos, thetas);

// Given observation points and one more point, compute $s_i^*$ and $c_i^*$ as defined before (2.6).
const stars = (xs, ys, x, y) => {
  const ds = map((xi, yi) => Math.sqrt((xi - x) * (xi - x) + (yi - y) * (yi - y)), xs, ys);
  const sStars = map((yi, di) => (y - yi)/(di * di * di), ys, ds);
  const cStars = map((xi, di) => (x - xi)/(di * di * di), xs, ds);
  return {sStars, cStars};
}

// Compute $z_i$ as defined before (2.6).
const xyscToZ = (xs, ys, ss, cs) => map((si, xi, ci, yi) => si * xi - ci * yi, ss, xs, cs, ys);

// $mu_i$ according to the formula after (2.4).
const locationToMus = (xs, ys, x, y) => map((xi, yi) => Math.atan2(y - yi, x - xi), xs, ys);

// Given observations, compute auxiliary quantities.
const computeBearingData = (xs, ys, thetas, angleError) => {
  const ss = thetaToS(thetas);
  const cs = thetaToC(thetas);
  const zs = xyscToZ(xs, ys, ss, cs);
  return {xs, ys, thetas, ss, cs, zs, angleError};
};

// Solve (2.6).
const solveMLE = (ss, cs, zs, sStars, cStars) => {
  const a11 = dotprod(ss, sStars);
  const a12 = -dotprod(cs, sStars);
  const a21 = -dotprod(ss, cStars);
  const a22 = dotprod(cs, cStars);
  const b1 = dotprod(sStars, zs);
  const b2 = -dotprod(cStars, zs);
  const a = [a11, a12, a21, a22];
  const b = [b1, b2];
  return linsolve2(a, b);
};

// Initial approximation for the position as explained after (2.6).
const startingEstimateForBearingData = bearingData => {
  const {ss, cs, zs} = bearingData;
  return solveMLE(ss, cs, zs, ss, cs);
};

// Compute the next iteration.
const solutionReviser = bearingData => approximation => {
  const [xAppr, yAppr] = approximation;
  const {xs, ys, ss, cs, zs} = bearingData;
  const {sStars, cStars} = stars(xs, ys, xAppr, yAppr);
  return solveMLE(ss, cs, zs, sStars, cStars);
};

// Approximation for $\hat \kappa^{-1}$ as defined by (2.10).
const invKappaApprox = c =>
  2 * (1 - c) +
  ((1 - c) * (1 - c) * (0.48794 - 0.82905 * c - 1.3915 * c * c)) / c;

// $\overline C$ as defined before (2.10).
const muToCBar = (thetas, mus) => {
  const n = Math.min(thetas.length, mus.length);
  const coss = map((thetai, mui) => Math.cos(thetai - mui), thetas, mus);
  return sum(coss) / n;
};

// Alternative definition for $\overline C$ using sd as in
// https://github.com/barryrowlingson/telemetr/blob/054b54a3ac610b0a4b590dc2da20b8efc4f23aa7/src/trimle.f#L63
// (Don't be mislead by naming, `kappa` in this line is actually $\overline C$.)
const angleErrorToCBar = angleError => Math.exp((-angleError * angleError) / 2);

// Approximation of the covariance matrix given by (2.9).
const qEstimate = (ss, cs, sStars, cStars, invKappa) => {
  const a11 = dotprod(sStars, ss);
  const a22 = dotprod(cStars, cs);
  const a12 = -(dotprod(sStars, cs) + dotprod(cStars, ss)) / 2;
  const a21 = a12;
  const a = [a11, a12, a21, a22];
  const invA = inv2(a);
  return mulByScalar(invKappa, invA);
};

// Convenience function for covariance matrix.
const covarianceEstimate = (bearingData, approximation) => {
  const {xs, ys, thetas, ss, cs, angleError} = bearingData;
  // sStars and cStars correspond to variables with hats in (2.9), because the
  // hats mean that the quantities are computed for the approximation, just as
  // we do it here.
  const {sStars, cStars} = stars(xs, ys, approximation[0], approximation[1]);
  let cBarApprox;
  if (angleError == null) {
    const muHats = locationToMus(xs, ys, approximation[0], approximation[1]);
    cBarApprox = muToCBar(thetas, muHats);
  } else {
    cBarApprox = angleErrorToCBar(angleError);
  }
  const invKappaHat = invKappaApprox(cBarApprox);
  const covariance = qEstimate(ss, cs, sStars, cStars, invKappaHat);
  return covariance;
};

// Iterative algorithm. May throw errors!
const createOptimalLocationFinder =
  ({maxIterations, epsilon, angleError}) =>
  (xs, ys, thetas) => {
    const bearingData = computeBearingData(xs, ys, thetas, angleError);
    const reviseSolution = solutionReviser(bearingData);
    const initialLocation = startingEstimateForBearingData(bearingData);
    let approximation = initialLocation;
    let nIteration = 0;
    let distance;
    do {
      nIteration += 1;
      if (nIteration > maxIterations) {
        throw new Error(
          'Cannot compute triangulation: number of iterations exceeded',
        );
      }
      const newApproximation = reviseSolution(approximation);
      distance = maxDistance(approximation, newApproximation);
      approximation = newApproximation;
      // console.debug('distance', distance);
    } while (distance > epsilon);
    const covariance = covarianceEstimate(bearingData, approximation);
    return {
      location: approximation,
      covariance,
    };
  };

// Triangulation

// Error area more or less according to
// https://github.com/barryrowlingson/telemetr/blob/054b54a3ac610b0a4b590dc2da20b8efc4f23aa7/src/elarea.f
// Specifically, in the repo the area is computed as follows:
// - compute the determinant of the covariance matrix
// - take the square root (if it's nonnegative)
// - multiply by an obscure constant coefficient
// We proceed in the same manner, except that the coefficient is different.
// It's chosen empirically so as to fit test data.
const errorAreaCoefficient = 18.81010718;
const covarianceToErrorArea = covariance => {
  const [vc11, vc12, vc21, vc22] = covariance;
  const delta = vc11 * vc22 - vc12 * vc21;
  return delta > 0 ? errorAreaCoefficient * Math.sqrt(delta) : 0;
};

// createTriangulationSolver: (params: {maxIterations: number; epsilon: number; angleError?: number}) =>
//   (observations: Array<{northing: number; easting: number; bearing: number}>) => ...
export const createTriangulationSolver = ({
  maxIterations,
  epsilon,
  angleError,
}) => {
  let angleErrorRad;
  if (angleError != null) {
    angleErrorRad = (angleError * Math.PI) / 180;
  }
  const optimalLocationFinder = createOptimalLocationFinder({
    maxIterations,
    epsilon,
    angleError: angleErrorRad,
  });
  return observations => {
    const xs = observations.map(({northing}) => northing);
    const ys = observations.map(({easting}) => easting);
    const thetas = observations.map(({bearing}) => (bearing * Math.PI) / 180);
    const {location, covariance} = optimalLocationFinder(xs, ys, thetas);
    const [vc11, vc12, , vc22] = covariance;
    const northingError = Math.sqrt(vc11);
    const eastingError = Math.sqrt(vc22);
    const correlation = vc12 / (northingError * eastingError);
    const errorArea = covarianceToErrorArea(covariance);
    const numbers = [
      ...location,
      ...covariance,
      northingError,
      eastingError,
      correlation,
      errorArea,
    ];
    if (numbers.some(Number.isNaN)) {
      throw new Error('Cannot compute triangulation');
    }
    return {
      northing: location[0],
      easting: location[1],
      northingError,
      eastingError,
      correlation,
      errorArea,
      angleError,
      nBearings: thetas.length,
    };
  };
};
