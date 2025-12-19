import { W as tt, e as Pt } from "./constants-BPcXltxX.js";
import { MathUtils as x, Spherical as mt, Vector3 as m, Matrix4 as A, Sphere as Mt, Ray as pt, Euler as gt, Box3 as Et, Plane as St, TextureUtils as Ft } from "three";
import { estimateBytesUsed as _t } from "three/examples/jsm/utils/BufferGeometryUtils.js";
const z = new mt(), et = new m(), wt = {};
function ut(r) {
  const { x: t, y: e, z: n } = r;
  r.x = n, r.y = t, r.z = e;
}
function Tt(r) {
  const { x: t, y: e, z: n } = r;
  r.z = t, r.x = e, r.y = n;
}
function dt(r) {
  return -(r - Math.PI / 2);
}
function H(r) {
  return -r + Math.PI / 2;
}
function Rt(r, t, e = {}) {
  return z.theta = t, z.phi = H(r), et.setFromSpherical(z), z.setFromVector3(et), e.lat = dt(z.phi), e.lon = z.theta, e;
}
function nt(r, t = "E", e = "W") {
  const n = r < 0 ? e : t;
  r = Math.abs(r);
  const s = ~~r, o = (r - s) * 60, i = ~~o, c = ~~((o - i) * 60);
  return `${s}° ${i}' ${c}" ${n}`;
}
function zt(r, t, e = !1) {
  const n = Rt(r, t, wt);
  let s, o;
  return e ? (s = `${(x.RAD2DEG * n.lat).toFixed(4)}°`, o = `${(x.RAD2DEG * n.lon).toFixed(4)}°`) : (s = nt(x.RAD2DEG * n.lat, "N", "S"), o = nt(x.RAD2DEG * n.lon, "E", "W")), `${s} ${o}`;
}
const It = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  latitudeToSphericalPhi: H,
  sphericalPhiToLatitude: dt,
  swapToGeoFrame: ut,
  swapToThreeFrame: Tt,
  toLatLonString: zt
}, Symbol.toStringTag, { value: "Module" })), ot = new mt(), S = new m(), p = new m(), X = new m(), y = new A(), f = new A(), st = new A(), Y = new Mt(), u = new gt(), it = new m(), rt = new m(), at = new m(), T = new m(), B = new pt(), bt = 1e-12, vt = 0.1, I = 0, ct = 1, L = 2;
class yt {
  constructor(t = 1, e = 1, n = 1) {
    this.name = "", this.radius = new m(t, e, n);
  }
  intersectRay(t, e) {
    return y.makeScale(...this.radius).invert(), Y.center.set(0, 0, 0), Y.radius = 1, B.copy(t).applyMatrix4(y), B.intersectSphere(Y, e) ? (y.makeScale(...this.radius), e.applyMatrix4(y), e) : null;
  }
  // returns a frame with Z indicating altitude, Y pointing north, X pointing east
  getEastNorthUpFrame(t, e, n, s) {
    return n.isMatrix4 && (s = n, n = 0, console.warn('Ellipsoid: The signature for "getEastNorthUpFrame" has changed.')), this.getEastNorthUpAxes(t, e, it, rt, at), this.getCartographicToPosition(t, e, n, T), s.makeBasis(it, rt, at).setPosition(T);
  }
  // returns a frame with z indicating altitude and az, el, roll rotation within that frame
  // - azimuth: measured off of true north, increasing towards "east" (z-axis)
  // - elevation: measured off of the horizon, increasing towards sky (x-axis)
  // - roll: rotation around northern axis (y-axis)
  getOrientedEastNorthUpFrame(t, e, n, s, o, i, a) {
    return this.getObjectFrame(t, e, n, s, o, i, a, I);
  }
  // returns a frame similar to the ENU frame but rotated to match three.js object and camera conventions
  // OBJECT_FRAME: oriented such that "+Y" is up and "+Z" is forward.
  // CAMERA_FRAME: oriented such that "+Y" is up and "-Z" is forward.
  getObjectFrame(t, e, n, s, o, i, a, c = L) {
    return this.getEastNorthUpFrame(t, e, n, y), u.set(o, i, -s, "ZXY"), a.makeRotationFromEuler(u).premultiply(y), c === ct ? (u.set(Math.PI / 2, 0, 0, "XYZ"), f.makeRotationFromEuler(u), a.multiply(f)) : c === L && (u.set(-Math.PI / 2, 0, Math.PI, "XYZ"), f.makeRotationFromEuler(u), a.multiply(f)), a;
  }
  getCartographicFromObjectFrame(t, e, n = L) {
    return n === ct ? (u.set(-Math.PI / 2, 0, 0, "XYZ"), f.makeRotationFromEuler(u).premultiply(t)) : n === L ? (u.set(-Math.PI / 2, 0, Math.PI, "XYZ"), f.makeRotationFromEuler(u).premultiply(t)) : f.copy(t), T.setFromMatrixPosition(f), this.getPositionToCartographic(T, e), this.getEastNorthUpFrame(e.lat, e.lon, 0, y).invert(), f.premultiply(y), u.setFromRotationMatrix(f, "ZXY"), e.azimuth = -u.z, e.elevation = u.x, e.roll = u.y, e;
  }
  getEastNorthUpAxes(t, e, n, s, o, i = T) {
    this.getCartographicToPosition(t, e, 0, i), this.getCartographicToNormal(t, e, o), n.set(-i.y, i.x, 0).normalize(), s.crossVectors(o, n).normalize();
  }
  // azimuth: measured off of true north, increasing towards "east"
  // elevation: measured off of the horizon, increasing towards sky
  // roll: rotation around northern axis
  getAzElRollFromRotationMatrix(t, e, n, s, o = I) {
    return console.warn('Ellipsoid: "getAzElRollFromRotationMatrix" is deprecated. Use "getCartographicFromObjectFrame", instead.'), this.getCartographicToPosition(t, e, 0, T), st.copy(n).setPosition(T), this.getCartographicFromObjectFrame(st, s, o), delete s.height, delete s.lat, delete s.lon, s;
  }
  getRotationMatrixFromAzElRoll(t, e, n, s, o, i, a = I) {
    return console.warn('Ellipsoid: "getRotationMatrixFromAzElRoll" function has been deprecated. Use "getObjectFrame", instead.'), this.getObjectFrame(t, e, 0, n, s, o, i, a), i.setPosition(0, 0, 0), i;
  }
  getFrame(t, e, n, s, o, i, a, c = I) {
    return console.warn('Ellipsoid: "getFrame" function has been deprecated. Use "getObjectFrame", instead.'), this.getObjectFrame(t, e, i, n, s, o, a, c);
  }
  getCartographicToPosition(t, e, n, s) {
    this.getCartographicToNormal(t, e, S);
    const o = this.radius;
    p.copy(S), p.x *= o.x ** 2, p.y *= o.y ** 2, p.z *= o.z ** 2;
    const i = Math.sqrt(S.dot(p));
    return p.divideScalar(i), s.copy(p).addScaledVector(S, n);
  }
  getPositionToCartographic(t, e) {
    this.getPositionToSurfacePoint(t, p), this.getPositionToNormal(t, S);
    const n = X.subVectors(t, p);
    return e.lon = Math.atan2(S.y, S.x), e.lat = Math.asin(S.z), e.height = Math.sign(n.dot(t)) * n.length(), e;
  }
  getCartographicToNormal(t, e, n) {
    return ot.set(1, H(t), e), n.setFromSpherical(ot).normalize(), ut(n), n;
  }
  getPositionToNormal(t, e) {
    const n = this.radius;
    return e.copy(t), e.x /= n.x ** 2, e.y /= n.y ** 2, e.z /= n.z ** 2, e.normalize(), e;
  }
  getPositionToSurfacePoint(t, e) {
    const n = this.radius, s = 1 / n.x ** 2, o = 1 / n.y ** 2, i = 1 / n.z ** 2, a = t.x * t.x * s, c = t.y * t.y * o, l = t.z * t.z * i, h = a + c + l, R = Math.sqrt(1 / h), _ = p.copy(t).multiplyScalar(R);
    if (h < vt)
      return isFinite(R) ? e.copy(_) : null;
    const $ = X.set(
      _.x * s * 2,
      _.y * o * 2,
      _.z * i * 2
    );
    let g = (1 - R) * t.length() / (0.5 * $.length()), D = 0, w, O, P, M, E, q, V, W, J, K, Q;
    do {
      g -= D, P = 1 / (1 + g * s), M = 1 / (1 + g * o), E = 1 / (1 + g * i), q = P * P, V = M * M, W = E * E, J = q * P, K = V * M, Q = W * E, w = a * q + c * V + l * W - 1, O = a * J * s + c * K * o + l * Q * i;
      const xt = -2 * O;
      D = w / xt;
    } while (Math.abs(w) > bt);
    return e.set(
      t.x * P,
      t.y * M,
      t.z * E
    );
  }
  calculateHorizonDistance(t, e) {
    const n = this.calculateEffectiveRadius(t);
    return Math.sqrt(2 * n * e + e ** 2);
  }
  calculateEffectiveRadius(t) {
    const e = this.radius.x, s = 1 - this.radius.z ** 2 / e ** 2, o = t * x.DEG2RAD, i = Math.sin(o) ** 2;
    return e / Math.sqrt(1 - s * i);
  }
  getPositionElevation(t) {
    this.getPositionToSurfacePoint(t, p);
    const e = X.subVectors(t, p);
    return Math.sign(e.dot(t)) * e.length();
  }
  // Returns an estimate of the closest point on the ellipsoid to the ray. Returns
  // the surface intersection if they collide.
  closestPointToRayEstimate(t, e) {
    return this.intersectRay(t, e) ? e : (y.makeScale(...this.radius).invert(), B.copy(t).applyMatrix4(y), p.set(0, 0, 0), B.closestPointToPoint(p, e).normalize(), y.makeScale(...this.radius), e.applyMatrix4(y));
  }
  copy(t) {
    return this.radius.copy(t.radius), this;
  }
  clone() {
    return new this.constructor().copy(this);
  }
}
const At = new yt(tt, tt, Pt);
At.name = "WGS84 Earth";
const U = new m(), j = new m(), d = new m(), k = new pt();
class Lt {
  constructor(t = new Et(), e = new A()) {
    this.box = t.clone(), this.transform = e.clone(), this.inverseTransform = new A(), this.points = new Array(8).fill().map(() => new m()), this.planes = new Array(6).fill().map(() => new St());
  }
  copy(t) {
    return this.box.copy(t.box), this.transform.copy(t.transform), this.update(), this;
  }
  clone() {
    return new this.constructor().copy(this);
  }
  /**
   * Clamps the given point within the bounds of this OBB
   * @param {Vector3} point
   * @param {Vector3} result
   * @returns {Vector3}
   */
  clampPoint(t, e) {
    return e.copy(t).applyMatrix4(this.inverseTransform).clamp(this.box.min, this.box.max).applyMatrix4(this.transform);
  }
  /**
   * Returns the distance from any edge of this OBB to the specified point.
   * If the point lies inside of this box, the distance will be 0.
   * @param {Vector3} point
   * @returns {number}
   */
  distanceToPoint(t) {
    return this.clampPoint(t, d).distanceTo(t);
  }
  containsPoint(t) {
    return d.copy(t).applyMatrix4(this.inverseTransform), this.box.containsPoint(d);
  }
  // returns boolean indicating whether the ray has intersected the obb
  intersectsRay(t) {
    return k.copy(t).applyMatrix4(this.inverseTransform), k.intersectsBox(this.box);
  }
  // Sets "target" equal to the intersection point.
  // Returns "null" if no intersection found.
  intersectRay(t, e) {
    return k.copy(t).applyMatrix4(this.inverseTransform), k.intersectBox(this.box, e) ? (e.applyMatrix4(this.transform), e) : null;
  }
  update() {
    const { points: t, inverseTransform: e, transform: n, box: s } = this;
    e.copy(n).invert();
    const { min: o, max: i } = s;
    let a = 0;
    for (let c = -1; c <= 1; c += 2)
      for (let l = -1; l <= 1; l += 2)
        for (let h = -1; h <= 1; h += 2)
          t[a].set(
            c < 0 ? o.x : i.x,
            l < 0 ? o.y : i.y,
            h < 0 ? o.z : i.z
          ).applyMatrix4(n), a++;
    this.updatePlanes();
  }
  updatePlanes() {
    U.copy(this.box.min).applyMatrix4(this.transform), j.copy(this.box.max).applyMatrix4(this.transform), d.set(0, 0, 1).transformDirection(this.transform), this.planes[0].setFromNormalAndCoplanarPoint(d, U), this.planes[1].setFromNormalAndCoplanarPoint(d, j).negate(), d.set(0, 1, 0).transformDirection(this.transform), this.planes[2].setFromNormalAndCoplanarPoint(d, U), this.planes[3].setFromNormalAndCoplanarPoint(d, j).negate(), d.set(1, 0, 0).transformDirection(this.transform), this.planes[4].setFromNormalAndCoplanarPoint(d, U), this.planes[5].setFromNormalAndCoplanarPoint(d, j).negate();
  }
  intersectsSphere(t) {
    return this.clampPoint(t.center, d), d.distanceToSquared(t.center) <= t.radius * t.radius;
  }
  intersectsFrustum(t) {
    return this._intersectsPlaneShape(t.planes, t.points);
  }
  intersectsOBB(t) {
    return this._intersectsPlaneShape(t.planes, t.points);
  }
  // takes a series of 6 planes that define and enclosed shape and the 8 points that lie at the corners
  // of that shape to determine whether the OBB is intersected with.
  _intersectsPlaneShape(t, e) {
    const n = this.points, s = this.planes;
    for (let o = 0; o < 6; o++) {
      const i = t[o];
      let a = -1 / 0;
      for (let c = 0; c < 8; c++) {
        const l = n[c], h = i.distanceToPoint(l);
        a = a < h ? h : a;
      }
      if (a < 0)
        return !1;
    }
    for (let o = 0; o < 6; o++) {
      const i = s[o];
      let a = -1 / 0;
      for (let c = 0; c < 8; c++) {
        const l = e[c], h = i.distanceToPoint(l);
        a = a < h ? h : a;
      }
      if (a < 0)
        return !1;
    }
    return !0;
  }
}
const F = Math.PI, G = F / 2, N = new m(), b = new m(), v = new m(), lt = new A();
let C = 0;
const Z = [];
function Nt(r = !1) {
  return r ? (Z[C] || (Z[C] = new m()), C++, Z[C - 1]) : new m();
}
function ht() {
  C = 0;
}
class Ut extends yt {
  constructor(t, e, n, s = -G, o = G, i = 0, a = 2 * F, c = 0, l = 0) {
    super(t, e, n), this.latStart = s, this.latEnd = o, this.lonStart = i, this.lonEnd = a, this.heightStart = c, this.heightEnd = l;
  }
  _getPoints(t = !1) {
    const {
      latStart: e,
      latEnd: n,
      lonStart: s,
      lonEnd: o,
      heightStart: i,
      heightEnd: a
    } = this, c = x.mapLinear(0.5, 0, 1, e, n), l = x.mapLinear(0.5, 0, 1, s, o), h = Math.floor(s / G) * G, R = [
      [-F / 2, 0],
      [F / 2, 0],
      [0, h],
      [0, h + F / 2],
      [0, h + F],
      [0, h + 3 * F / 2],
      [e, o],
      [n, o],
      [e, s],
      [n, s],
      [0, s],
      [0, o],
      [c, l],
      [e, l],
      [n, l],
      [c, s],
      [c, o]
    ], _ = [], $ = R.length;
    for (let g = 0; g <= 1; g++) {
      const D = x.mapLinear(g, 0, 1, i, a);
      for (let w = 0, O = $; w < O; w++) {
        const [P, M] = R[w];
        if (P >= e && P <= n && M >= s && M <= o) {
          const E = Nt(t);
          _.push(E), this.getCartographicToPosition(P, M, D, E);
        }
      }
    }
    return _;
  }
  getBoundingBox(t, e) {
    ht();
    const {
      latStart: n,
      latEnd: s,
      lonStart: o,
      lonEnd: i
    } = this;
    if (s - n < F / 2) {
      const l = x.mapLinear(0.5, 0, 1, n, s), h = x.mapLinear(0.5, 0, 1, o, i);
      this.getCartographicToNormal(l, h, v), b.set(0, 0, 1), N.crossVectors(b, v), b.crossVectors(N, v), e.makeBasis(N, b, v);
    } else
      N.set(1, 0, 0), b.set(0, 1, 0), v.set(0, 0, 1), e.makeBasis(N, b, v);
    lt.copy(e).invert();
    const c = this._getPoints(!0);
    for (let l = 0, h = c.length; l < h; l++)
      c[l].applyMatrix4(lt);
    t.makeEmpty(), t.setFromPoints(c);
  }
  getBoundingSphere(t, e) {
    ht();
    const n = this._getPoints(!0);
    t.makeEmpty(), t.setFromPoints(n, e);
  }
}
function ft(r) {
  if (!r)
    return 0;
  const { format: t, type: e, image: n } = r, { width: s, height: o } = n;
  let i = Ft.getByteLength(s, o, t, e);
  return i *= r.generateMipmaps ? 4 / 3 : 1, i;
}
function Ct(r) {
  const t = /* @__PURE__ */ new Set();
  let e = 0;
  return r.traverse((n) => {
    if (n.geometry && !t.has(n.geometry) && (e += _t(n.geometry), t.add(n.geometry)), n.material) {
      const s = n.material;
      for (const o in s) {
        const i = s[o];
        i && i.isTexture && !t.has(i) && (e += ft(i), t.add(i));
      }
    }
  }), e;
}
const jt = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  estimateBytesUsed: Ct,
  getTextureByteLength: ft
}, Symbol.toStringTag, { value: "Module" }));
export {
  ct as C,
  I as E,
  It as G,
  jt as M,
  L as O,
  At as W,
  yt as a,
  Ut as b,
  Lt as c,
  Ct as e,
  ft as g
};
//# sourceMappingURL=MemoryUtils-DPE4VZ3R.js.map
