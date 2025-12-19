import { F as y, c as T, U as p, L as Z, P as I, a as L, b as R } from "./constants-BPcXltxX.js";
import { d as ge, e as pe, W as be } from "./constants-BPcXltxX.js";
import { t as ee, c as q, L as U, r as C, g as te } from "./LoaderBase-CfTLVHyZ.js";
import { a as ye, T as Te } from "./LoaderBase-CfTLVHyZ.js";
function M(s) {
  if (!s)
    return null;
  let e = s.length;
  const t = s.indexOf("?"), n = s.indexOf("#");
  t !== -1 && (e = Math.min(e, t)), n !== -1 && (e = Math.min(e, n));
  const r = s.lastIndexOf(".", e), a = s.lastIndexOf("/", e), o = s.indexOf("://");
  return o !== -1 && o + 2 === a || r === -1 || r < a ? null : s.substring(r + 1, e) || null;
}
const w = {
  inView: !1,
  error: 1 / 0,
  distanceFromCamera: 1 / 0
}, $ = !0;
function J(s) {
  return s === T || s === y;
}
function b(s, e) {
  return s.__lastFrameVisited === e && s.__used;
}
function k(s) {
  return s.__childrenProcessed === s.children.length;
}
function x(s) {
  return s.__hasUnrenderableContent || s.parent && s.parent.geometricError < s.geometricError;
}
function N(s, e) {
  s.__lastFrameVisited !== e.frameCount && (s.__lastFrameVisited = e.frameCount, s.__used = !1, s.__inFrustum = !1, s.__isLeaf = !1, s.__visible = !1, s.__active = !1, s.__error = 1 / 0, s.__distanceFromCamera = 1 / 0, s.__allChildrenReady = !1, e.calculateTileViewError(s, w), s.__inFrustum = w.inView, s.__error = w.error, s.__distanceFromCamera = w.distanceFromCamera);
}
function B(s, e, t = !1) {
  if (e.ensureChildrenArePreprocessed(s), N(s, e), D(s, e, t), x(s) && k(s)) {
    const n = s.children;
    for (let r = 0, a = n.length; r < a; r++)
      B(n[r], e, t);
  }
}
function j(s, e) {
  if (e.ensureChildrenArePreprocessed(s), b(s, e.frameCount) && (s.__hasContent && e.queueTileForDownload(s), k(s))) {
    const t = s.children;
    for (let n = 0, r = t.length; n < r; n++)
      j(t[n], e);
  }
}
function D(s, e, t = !1) {
  s.__used || (t || (s.__used = !0, e.stats.used++), e.markTileUsed(s), s.__inFrustum === !0 && e.stats.inFrustum++);
}
function se(s, e) {
  return !(s.__error <= e.errorTarget && !x(s) || e.maxDepth > 0 && s.__depth + 1 >= e.maxDepth || !k(s));
}
function W(s, e) {
  if (e.ensureChildrenArePreprocessed(s), N(s, e), !s.__inFrustum)
    return;
  if (!se(s, e)) {
    D(s, e);
    return;
  }
  let t = !1, n = !1;
  const r = s.children;
  for (let a = 0, o = r.length; a < o; a++) {
    const c = r[a];
    W(c, e), t = t || b(c, e.frameCount), n = n || c.__inFrustum;
  }
  if (s.refine === "REPLACE" && !n && r.length !== 0) {
    s.__inFrustum = !1;
    for (let a = 0, o = r.length; a < o; a++)
      B(r[a], e, !0);
    return;
  }
  if (D(s, e), s.refine === "REPLACE" && (t && s.__depth !== 0 || $))
    for (let a = 0, o = r.length; a < o; a++)
      B(r[a], e);
}
function z(s, e) {
  const t = e.frameCount;
  if (!b(s, t))
    return;
  const n = s.children;
  let r = !1;
  for (let a = 0, o = n.length; a < o; a++) {
    const c = n[a];
    r = r || b(c, t);
  }
  if (!r)
    s.__isLeaf = !0;
  else {
    let a = !0;
    for (let o = 0, c = n.length; o < c; o++) {
      const i = n[o];
      if (z(i, e), b(i, t)) {
        const d = !x(i);
        let l = !i.__hasContent || i.__hasRenderableContent && J(i.__loadingState) || i.__hasUnrenderableContent && i.__loadingState === y;
        l = d && l || i.__allChildrenReady, a = a && l;
      }
    }
    s.__allChildrenReady = a;
  }
}
function K(s, e) {
  const t = e.stats;
  if (!b(s, e.frameCount))
    return;
  if (s.__isLeaf) {
    s.__loadingState === T ? (s.__inFrustum && (s.__visible = !0, t.visible++), s.__active = !0, t.active++) : s.__hasContent && e.queueTileForDownload(s);
    return;
  }
  const n = s.children, r = s.__hasContent, a = J(s.__loadingState) && r, o = (e.errorTarget + 1) * e.errorThreshold, c = s.__error <= o, i = s.refine === "ADD", d = s.__allChildrenReady || s.__depth === 0 && !$;
  if (r && (c || i) && e.queueTileForDownload(s), (c && a && !d || a && i) && (s.__inFrustum && (s.__visible = !0, t.visible++), s.__active = !0, t.active++), !i && c && !d)
    for (let l = 0, u = n.length; l < u; l++) {
      const _ = n[l];
      b(_, e.frameCount) && j(_, e);
    }
  else
    for (let l = 0, u = n.length; l < u; l++)
      K(n[l], e);
}
function Y(s, e) {
  const t = b(s, e.frameCount);
  if (t || s.__usedLastFrame) {
    let n = !1, r = !1;
    t ? (n = s.__active, e.displayActiveTiles ? r = s.__active || s.__visible : r = s.__visible) : N(s, e), s.__hasRenderableContent && s.__loadingState === T && (s.__wasSetActive !== n && e.invokeOnePlugin((o) => o.setTileActive && o.setTileActive(s, n)), s.__wasSetVisible !== r && e.invokeOnePlugin((o) => o.setTileVisible && o.setTileVisible(s, r))), s.__wasSetActive = n, s.__wasSetVisible = r, s.__usedLastFrame = t;
    const a = s.children;
    for (let o = 0, c = a.length; o < c; o++) {
      const i = a[o];
      Y(i, e);
    }
  }
}
function ne(s) {
  let e = null;
  return () => {
    e === null && (e = requestAnimationFrame(() => {
      e = null, s();
    }));
  };
}
const Q = Symbol("PLUGIN_REGISTERED"), H = (s, e) => {
  const t = s.priority || 0, n = e.priority || 0;
  return t !== n ? t > n ? 1 : -1 : s.__used !== e.__used ? s.__used ? 1 : -1 : s.__error !== e.__error ? s.__error > e.__error ? 1 : -1 : s.__distanceFromCamera !== e.__distanceFromCamera ? s.__distanceFromCamera > e.__distanceFromCamera ? -1 : 1 : s.__depthFromRenderedParent !== e.__depthFromRenderedParent ? s.__depthFromRenderedParent > e.__depthFromRenderedParent ? -1 : 1 : 0;
}, re = (s, e) => {
  const t = s.priority || 0, n = e.priority || 0;
  return t !== n ? t > n ? 1 : -1 : s.__lastFrameVisited !== e.__lastFrameVisited ? s.__lastFrameVisited > e.__lastFrameVisited ? -1 : 1 : s.__depthFromRenderedParent !== e.__depthFromRenderedParent ? s.__depthFromRenderedParent > e.__depthFromRenderedParent ? 1 : -1 : s.__loadingState !== e.__loadingState ? s.__loadingState > e.__loadingState ? -1 : 1 : s.__hasUnrenderableContent !== e.__hasUnrenderableContent ? s.__hasUnrenderableContent ? -1 : 1 : s.__error !== e.__error ? s.__error > e.__error ? -1 : 1 : 0;
};
class ce {
  get root() {
    const e = this.rootTileSet;
    return e ? e.root : null;
  }
  get loadProgress() {
    const { stats: e, isLoading: t } = this, n = e.downloading + e.parsing, r = e.inCacheSinceLoad + (t ? 1 : 0);
    return r === 0 ? 1 : 1 - n / r;
  }
  get errorThreshold() {
    return this._errorThreshold;
  }
  set errorThreshold(e) {
    console.warn('TilesRenderer: The "errorThreshold" option has been deprecated.'), this._errorThreshold = e;
  }
  constructor(e = null) {
    this.rootLoadingState = p, this.rootTileSet = null, this.rootURL = e, this.fetchOptions = {}, this.plugins = [], this.queuedTiles = [], this.cachedSinceLoadComplete = /* @__PURE__ */ new Set(), this.isLoading = !1;
    const t = new Z();
    t.unloadPriorityCallback = re;
    const n = new I();
    n.maxJobs = 25, n.priorityCallback = H;
    const r = new I();
    r.maxJobs = 5, r.priorityCallback = H;
    const a = new I();
    a.maxJobs = 25, this.processedTiles = /* @__PURE__ */ new WeakSet(), this.visibleTiles = /* @__PURE__ */ new Set(), this.activeTiles = /* @__PURE__ */ new Set(), this.usedSet = /* @__PURE__ */ new Set(), this.lruCache = t, this.downloadQueue = n, this.parseQueue = r, this.processNodeQueue = a, this.stats = {
      inCacheSinceLoad: 0,
      inCache: 0,
      parsing: 0,
      downloading: 0,
      failed: 0,
      inFrustum: 0,
      used: 0,
      active: 0,
      visible: 0
    }, this.frameCount = 0, this._dispatchNeedsUpdateEvent = ne(() => {
      this.dispatchEvent({ type: "needs-update" });
    }), this.errorTarget = 16, this._errorThreshold = 1 / 0, this.displayActiveTiles = !1, this.maxDepth = 1 / 0;
  }
  // Plugins
  registerPlugin(e) {
    if (e[Q] === !0)
      throw new Error("TilesRendererBase: A plugin can only be registered to a single tile set");
    const t = this.plugins, n = e.priority || 0;
    let r = t.length;
    for (let a = 0; a < t.length; a++)
      if ((t[a].priority || 0) > n) {
        r = a;
        break;
      }
    t.splice(r, 0, e), e[Q] = !0, e.init && e.init(this);
  }
  unregisterPlugin(e) {
    const t = this.plugins;
    if (typeof e == "string" && (e = this.getPluginByName(e)), t.includes(e)) {
      const n = t.indexOf(e);
      return t.splice(n, 1), e.dispose && e.dispose(), !0;
    }
    return !1;
  }
  getPluginByName(e) {
    return this.plugins.find((t) => t.name === e) || null;
  }
  traverse(e, t, n = !0) {
    this.root && ee(this.root, (r, ...a) => (n && this.ensureChildrenArePreprocessed(r, !0), e ? e(r, ...a) : !1), t);
  }
  queueTileForDownload(e) {
    e.__loadingState !== p || this.lruCache.isFull() || this.queuedTiles.push(e);
  }
  markTileUsed(e) {
    this.usedSet.add(e), this.lruCache.markUsed(e);
  }
  // Public API
  update() {
    const { lruCache: e, usedSet: t, stats: n, root: r, downloadQueue: a, parseQueue: o, processNodeQueue: c } = this;
    if (this.rootLoadingState === p && (this.rootLoadingState = L, this.invokeOnePlugin((l) => l.loadRootTileSet && l.loadRootTileSet()).then((l) => {
      let u = this.rootURL;
      u !== null && this.invokeAllPlugins((_) => u = _.preprocessURL ? _.preprocessURL(u, null) : u), this.rootLoadingState = T, this.rootTileSet = l, this.dispatchEvent({ type: "needs-update" }), this.dispatchEvent({ type: "load-content" }), this.dispatchEvent({
        type: "load-tile-set",
        tileSet: l,
        url: u
      });
    }).catch((l) => {
      this.rootLoadingState = y, console.error(l), this.rootTileSet = null, this.dispatchEvent({
        type: "load-error",
        tile: null,
        error: l,
        url: this.rootURL
      });
    })), !r)
      return;
    n.inFrustum = 0, n.used = 0, n.active = 0, n.visible = 0, this.frameCount++, t.forEach((l) => e.markUnused(l)), t.clear(), W(r, this), z(r, this), K(r, this), Y(r, this);
    const i = this.queuedTiles;
    i.sort(e.unloadPriorityCallback);
    for (let l = 0, u = i.length; l < u && !e.isFull(); l++)
      this.requestTileContents(i[l]);
    i.length = 0, e.scheduleUnload(), (a.running || o.running || c.running) === !1 && this.isLoading === !0 && (this.cachedSinceLoadComplete.clear(), n.inCacheSinceLoad = 0, this.dispatchEvent({ type: "tiles-load-end" }), this.isLoading = !1);
  }
  resetFailedTiles() {
    this.rootLoadingState === y && (this.rootLoadingState = p);
    const e = this.stats;
    e.failed !== 0 && (this.traverse((t) => {
      t.__loadingState === y && (t.__loadingState = p);
    }, null, !1), e.failed = 0);
  }
  dispose() {
    [...this.plugins].forEach((r) => {
      this.unregisterPlugin(r);
    });
    const t = this.lruCache, n = [];
    this.traverse((r) => (n.push(r), !1), null, !1);
    for (let r = 0, a = n.length; r < a; r++)
      t.remove(n[r]);
    this.stats = {
      parsing: 0,
      downloading: 0,
      failed: 0,
      inFrustum: 0,
      used: 0,
      active: 0,
      visible: 0
    }, this.frameCount = 0;
  }
  // Overrideable
  calculateBytesUsed(e, t) {
    return 0;
  }
  dispatchEvent(e) {
  }
  fetchData(e, t) {
    return fetch(e, t);
  }
  parseTile(e, t, n) {
    return null;
  }
  disposeTile(e) {
    e.__visible && (this.invokeOnePlugin((t) => t.setTileVisible && t.setTileVisible(e, !1)), e.__visible = !1), e.__active && (this.invokeOnePlugin((t) => t.setTileActive && t.setTileActive(e, !1)), e.__active = !1);
  }
  preprocessNode(e, t, n = null) {
    var r;
    if (this.processedTiles.add(e), e.content && (!("uri" in e.content) && "url" in e.content && (e.content.uri = e.content.url, delete e.content.url), e.content.boundingVolume && !("box" in e.content.boundingVolume || "sphere" in e.content.boundingVolume || "region" in e.content.boundingVolume) && delete e.content.boundingVolume), e.parent = n, e.children = e.children || [], (r = e.content) != null && r.uri) {
      const a = M(e.content.uri);
      e.__hasContent = !0, e.__hasUnrenderableContent = !!(a && /json$/.test(a)), e.__hasRenderableContent = !e.__hasUnrenderableContent;
    } else
      e.__hasContent = !1, e.__hasUnrenderableContent = !1, e.__hasRenderableContent = !1;
    e.__childrenProcessed = 0, n && n.__childrenProcessed++, e.__distanceFromCamera = 1 / 0, e.__error = 1 / 0, e.__inFrustum = !1, e.__isLeaf = !1, e.__usedLastFrame = !1, e.__used = !1, e.__wasSetVisible = !1, e.__visible = !1, e.__allChildrenReady = !1, e.__wasSetActive = !1, e.__active = !1, e.__loadingState = p, n === null ? (e.__depth = 0, e.__depthFromRenderedParent = e.__hasRenderableContent ? 1 : 0, e.refine = e.refine || "REPLACE") : (e.__depth = n.__depth + 1, e.__depthFromRenderedParent = n.__depthFromRenderedParent + (e.__hasRenderableContent ? 1 : 0), e.refine = e.refine || n.refine), e.__basePath = t, e.__lastFrameVisited = -1, this.invokeAllPlugins((a) => {
      a !== this && a.preprocessNode && a.preprocessNode(e, t, n);
    });
  }
  setTileActive(e, t) {
    t ? this.activeTiles.add(e) : this.activeTiles.delete(e);
  }
  setTileVisible(e, t) {
    t ? this.visibleTiles.add(e) : this.visibleTiles.delete(e);
  }
  calculateTileViewError(e, t) {
  }
  ensureChildrenArePreprocessed(e, t = !1) {
    const n = e.children;
    for (let r = 0, a = n.length; r < a; r++) {
      const o = n[r];
      if ("__depth" in o)
        break;
      t ? (this.processNodeQueue.remove(o), this.preprocessNode(o, e.__basePath, e)) : this.processNodeQueue.has(o) || this.processNodeQueue.add(o, (c) => {
        this.preprocessNode(c, e.__basePath, e), this._dispatchNeedsUpdateEvent();
      });
    }
  }
  // Private Functions
  // returns the total bytes used for by the given tile as reported by all plugins
  getBytesUsed(e) {
    let t = 0;
    return this.invokeAllPlugins((n) => {
      n.calculateBytesUsed && (t += n.calculateBytesUsed(e, e.cached.scene) || 0);
    }), t;
  }
  // force a recalculation of the tile or all tiles if no tile is provided
  recalculateBytesUsed(e = null) {
    const { lruCache: t, processedTiles: n } = this;
    e === null ? t.itemSet.forEach((r) => {
      n.has(r) && t.setMemoryUsage(r, this.getBytesUsed(r));
    }) : t.setMemoryUsage(e, this.getBytesUsed(e));
  }
  preprocessTileSet(e, t, n = null) {
    const r = e.asset.version, [a, o] = r.split(".").map((i) => parseInt(i));
    console.assert(
      a <= 1,
      "TilesRenderer: asset.version is expected to be a 1.x or a compatible version."
    ), a === 1 && o > 0 && console.warn("TilesRenderer: tiles versions at 1.1 or higher have limited support. Some new extensions and features may not be supported.");
    let c = t.replace(/\/[^/]*$/, "");
    c = new URL(c, window.location.href).toString(), this.preprocessNode(e.root, c, n);
  }
  loadRootTileSet() {
    let e = this.rootURL;
    return this.invokeAllPlugins((n) => e = n.preprocessURL ? n.preprocessURL(e, null) : e), this.invokeOnePlugin((n) => n.fetchData && n.fetchData(e, this.fetchOptions)).then((n) => {
      if (n instanceof Response) {
        if (n.ok)
          return n.json();
        throw new Error(`TilesRenderer: Failed to load tileset "${e}" with status ${n.status} : ${n.statusText}`);
      } else return n;
    }).then((n) => (this.preprocessTileSet(n, e), n));
  }
  requestTileContents(e) {
    if (e.__loadingState !== p)
      return;
    let t = !1, n = null, r = new URL(e.content.uri, e.__basePath + "/").toString();
    this.invokeAllPlugins((h) => r = h.preprocessURL ? h.preprocessURL(r, e) : r);
    const a = this.stats, o = this.lruCache, c = this.downloadQueue, i = this.parseQueue, d = M(r), l = new AbortController(), u = l.signal;
    if (o.add(e, (h) => {
      l.abort(), t ? (h.children.length = 0, h.__childrenProcessed = 0) : this.invokeAllPlugins((f) => {
        f.disposeTile && f.disposeTile(h);
      }), a.inCache--, this.cachedSinceLoadComplete.has(e) && (this.cachedSinceLoadComplete.delete(e), a.inCacheSinceLoad--), h.__loadingState === L ? a.downloading-- : h.__loadingState === R && a.parsing--, h.__loadingState = p, i.remove(h), c.remove(h);
    }))
      return this.isLoading || (this.isLoading = !0, this.dispatchEvent({ type: "tiles-load-start" })), o.setMemoryUsage(e, this.getBytesUsed(e)), this.cachedSinceLoadComplete.add(e), a.inCacheSinceLoad++, a.inCache++, a.downloading++, e.__loadingState = L, c.add(e, (h) => {
        if (u.aborted)
          return Promise.resolve();
        const f = this.invokeOnePlugin((g) => g.fetchData && g.fetchData(r, { ...this.fetchOptions, signal: u }));
        return this.dispatchEvent({ type: "tile-download-start", tile: e }), f;
      }).then((h) => {
        if (!u.aborted)
          if (h instanceof Response) {
            if (h.ok)
              return d === "json" ? h.json() : h.arrayBuffer();
            throw new Error(`Failed to load model with error code ${h.status}`);
          } else return h;
      }).then((h) => {
        if (!u.aborted)
          return a.downloading--, a.parsing++, e.__loadingState = R, i.add(e, (f) => u.aborted ? Promise.resolve() : d === "json" && h.root ? (this.preprocessTileSet(h, r, e), e.children.push(h.root), n = h, t = !0, Promise.resolve()) : this.invokeOnePlugin((g) => g.parseTile && g.parseTile(h, f, d, r, u)));
      }).then(() => {
        if (u.aborted)
          return;
        a.parsing--, e.__loadingState = T, o.setLoaded(e, !0);
        const h = this.getBytesUsed(e);
        if (o.getMemoryUsage(e) === 0 && h > 0 && o.isFull()) {
          o.remove(e);
          return;
        }
        o.setMemoryUsage(e, h), this.dispatchEvent({ type: "needs-update" }), this.dispatchEvent({ type: "load-content" }), t && this.dispatchEvent({
          type: "load-tile-set",
          tileSet: n,
          url: r
        }), e.cached.scene && this.dispatchEvent({
          type: "load-model",
          scene: e.cached.scene,
          tile: e
        });
      }).catch((h) => {
        u.aborted || (h.name !== "AbortError" ? (i.remove(e), c.remove(e), e.__loadingState === R ? a.parsing-- : e.__loadingState === L && a.downloading--, a.failed++, console.error(`TilesRenderer : Failed to load tile at url "${e.content.uri}".`), console.error(h), e.__loadingState = y, o.setLoaded(e, !0), this.dispatchEvent({
          type: "load-error",
          tile: e,
          error: h,
          url: r
        })) : o.remove(e));
      });
  }
  getAttributions(e = []) {
    return this.invokeAllPlugins((t) => t !== this && t.getAttributions && t.getAttributions(e)), e;
  }
  invokeOnePlugin(e) {
    const t = [...this.plugins, this];
    for (let n = 0; n < t.length; n++) {
      const r = e(t[n]);
      if (r)
        return r;
    }
    return null;
  }
  invokeAllPlugins(e) {
    const t = [...this.plugins, this], n = [];
    for (let r = 0; r < t.length; r++) {
      const a = e(t[r]);
      a && n.push(a);
    }
    return n.length === 0 ? null : Promise.all(n);
  }
}
function X(s, e, t, n, r, a) {
  let o;
  switch (n) {
    case "SCALAR":
      o = 1;
      break;
    case "VEC2":
      o = 2;
      break;
    case "VEC3":
      o = 3;
      break;
    case "VEC4":
      o = 4;
      break;
    default:
      throw new Error(`FeatureTable : Feature type not provided for "${a}".`);
  }
  let c;
  const i = t * o;
  switch (r) {
    case "BYTE":
      c = new Int8Array(s, e, i);
      break;
    case "UNSIGNED_BYTE":
      c = new Uint8Array(s, e, i);
      break;
    case "SHORT":
      c = new Int16Array(s, e, i);
      break;
    case "UNSIGNED_SHORT":
      c = new Uint16Array(s, e, i);
      break;
    case "INT":
      c = new Int32Array(s, e, i);
      break;
    case "UNSIGNED_INT":
      c = new Uint32Array(s, e, i);
      break;
    case "FLOAT":
      c = new Float32Array(s, e, i);
      break;
    case "DOUBLE":
      c = new Float64Array(s, e, i);
      break;
    default:
      throw new Error(`FeatureTable : Feature component type not provided for "${a}".`);
  }
  return c;
}
class P {
  constructor(e, t, n, r) {
    this.buffer = e, this.binOffset = t + n, this.binLength = r;
    let a = null;
    if (n !== 0) {
      const o = new Uint8Array(e, t, n);
      a = JSON.parse(q(o));
    } else
      a = {};
    this.header = a;
  }
  getKeys() {
    return Object.keys(this.header).filter((e) => e !== "extensions");
  }
  getData(e, t, n = null, r = null) {
    const a = this.header;
    if (!(e in a))
      return null;
    const o = a[e];
    if (o instanceof Object) {
      if (Array.isArray(o))
        return o;
      {
        const { buffer: c, binOffset: i, binLength: d } = this, l = o.byteOffset || 0, u = o.type || r, _ = o.componentType || n;
        if ("type" in o && r && o.type !== r)
          throw new Error("FeatureTable: Specified type does not match expected type.");
        const h = i + l, f = X(c, h, t, u, _, e);
        if (h + f.byteLength > i + d)
          throw new Error("FeatureTable: Feature data read outside binary body length.");
        return f;
      }
    } else return o;
  }
  getBuffer(e, t) {
    const { buffer: n, binOffset: r } = this;
    return n.slice(r + e, r + e + t);
  }
}
class ae {
  constructor(e) {
    this.batchTable = e;
    const t = e.header.extensions["3DTILES_batch_table_hierarchy"];
    this.classes = t.classes;
    for (const r of this.classes) {
      const a = r.instances;
      for (const o in a)
        r.instances[o] = this._parseProperty(a[o], r.length, o);
    }
    if (this.instancesLength = t.instancesLength, this.classIds = this._parseProperty(t.classIds, this.instancesLength, "classIds"), t.parentCounts ? this.parentCounts = this._parseProperty(t.parentCounts, this.instancesLength, "parentCounts") : this.parentCounts = new Array(this.instancesLength).fill(1), t.parentIds) {
      const r = this.parentCounts.reduce((a, o) => a + o, 0);
      this.parentIds = this._parseProperty(t.parentIds, r, "parentIds");
    } else
      this.parentIds = null;
    this.instancesIds = [];
    const n = {};
    for (const r of this.classIds)
      n[r] = n[r] ?? 0, this.instancesIds.push(n[r]), n[r]++;
  }
  _parseProperty(e, t, n) {
    if (Array.isArray(e))
      return e;
    {
      const { buffer: r, binOffset: a } = this.batchTable, o = e.byteOffset, c = e.componentType || "UNSIGNED_SHORT", i = a + o;
      return X(r, i, t, "SCALAR", c, n);
    }
  }
  getDataFromId(e, t = {}) {
    const n = this.parentCounts[e];
    if (this.parentIds && n > 0) {
      let i = 0;
      for (let d = 0; d < e; d++)
        i += this.parentCounts[d];
      for (let d = 0; d < n; d++) {
        const l = this.parentIds[i + d];
        l !== e && this.getDataFromId(l, t);
      }
    }
    const r = this.classIds[e], a = this.classes[r].instances, o = this.classes[r].name, c = this.instancesIds[e];
    for (const i in a)
      t[o] = t[o] || {}, t[o][i] = a[i][c];
    return t;
  }
}
class O extends P {
  get batchSize() {
    return console.warn("BatchTable.batchSize has been deprecated and replaced with BatchTable.count."), this.count;
  }
  constructor(e, t, n, r, a) {
    super(e, n, r, a), this.count = t, this.extensions = {};
    const o = this.header.extensions;
    o && o["3DTILES_batch_table_hierarchy"] && (this.extensions["3DTILES_batch_table_hierarchy"] = new ae(this));
  }
  getData(e, t = null, n = null) {
    return console.warn("BatchTable: BatchTable.getData is deprecated. Use BatchTable.getDataFromId to get allproperties for an id or BatchTable.getPropertyArray for getting an array of value for a property."), super.getData(e, this.count, t, n);
  }
  getDataFromId(e, t = {}) {
    if (e < 0 || e >= this.count)
      throw new Error(`BatchTable: id value "${e}" out of bounds for "${this.count}" features number.`);
    for (const n of this.getKeys())
      t[n] = super.getData(n, this.count)[e];
    for (const n in this.extensions) {
      const r = this.extensions[n];
      r.getDataFromId instanceof Function && (t[n] = t[n] || {}, r.getDataFromId(e, t[n]));
    }
    return t;
  }
  getPropertyArray(e) {
    return super.getData(e, this.count);
  }
}
class le extends U {
  parse(e) {
    const t = new DataView(e), n = C(t);
    console.assert(n === "b3dm");
    const r = t.getUint32(4, !0);
    console.assert(r === 1);
    const a = t.getUint32(8, !0);
    console.assert(a === e.byteLength);
    const o = t.getUint32(12, !0), c = t.getUint32(16, !0), i = t.getUint32(20, !0), d = t.getUint32(24, !0), l = 28, u = e.slice(
      l,
      l + o + c
    ), _ = new P(
      u,
      0,
      o,
      c
    ), h = l + o + c, f = e.slice(
      h,
      h + i + d
    ), g = new O(
      f,
      _.getData("BATCH_LENGTH"),
      0,
      i,
      d
    ), S = h + i + d, v = new Uint8Array(e, S, a - S);
    return {
      version: r,
      featureTable: _,
      batchTable: g,
      glbBytes: v
    };
  }
}
class he extends U {
  parse(e) {
    const t = new DataView(e), n = C(t);
    console.assert(n === "i3dm");
    const r = t.getUint32(4, !0);
    console.assert(r === 1);
    const a = t.getUint32(8, !0);
    console.assert(a === e.byteLength);
    const o = t.getUint32(12, !0), c = t.getUint32(16, !0), i = t.getUint32(20, !0), d = t.getUint32(24, !0), l = t.getUint32(28, !0), u = 32, _ = e.slice(
      u,
      u + o + c
    ), h = new P(
      _,
      0,
      o,
      c
    ), f = u + o + c, g = e.slice(
      f,
      f + i + d
    ), S = new O(
      g,
      h.getData("INSTANCES_LENGTH"),
      0,
      i,
      d
    ), v = f + i + d, V = new Uint8Array(e, v, a - v);
    let F = null, E = null, G = null;
    if (l)
      F = V, E = Promise.resolve();
    else {
      const A = this.resolveExternalURL(q(V));
      G = te(A), E = fetch(A, this.fetchOptions).then((m) => {
        if (!m.ok)
          throw new Error(`I3DMLoaderBase : Failed to load file "${A}" with status ${m.status} : ${m.statusText}`);
        return m.arrayBuffer();
      }).then((m) => {
        F = new Uint8Array(m);
      });
    }
    return E.then(() => ({
      version: r,
      featureTable: h,
      batchTable: S,
      glbBytes: F,
      gltfWorkingPath: G
    }));
  }
}
class de extends U {
  parse(e) {
    const t = new DataView(e), n = C(t);
    console.assert(n === "pnts");
    const r = t.getUint32(4, !0);
    console.assert(r === 1);
    const a = t.getUint32(8, !0);
    console.assert(a === e.byteLength);
    const o = t.getUint32(12, !0), c = t.getUint32(16, !0), i = t.getUint32(20, !0), d = t.getUint32(24, !0), l = 28, u = e.slice(
      l,
      l + o + c
    ), _ = new P(
      u,
      0,
      o,
      c
    ), h = l + o + c, f = e.slice(
      h,
      h + i + d
    ), g = new O(
      f,
      _.getData("BATCH_LENGTH") || _.getData("POINTS_LENGTH"),
      0,
      i,
      d
    );
    return Promise.resolve({
      version: r,
      featureTable: _,
      batchTable: g
    });
  }
}
class ue extends U {
  parse(e) {
    const t = new DataView(e), n = C(t);
    console.assert(n === "cmpt", 'CMPTLoader: The magic bytes equal "cmpt".');
    const r = t.getUint32(4, !0);
    console.assert(r === 1, 'CMPTLoader: The version listed in the header is "1".');
    const a = t.getUint32(8, !0);
    console.assert(a === e.byteLength, "CMPTLoader: The contents buffer length listed in the header matches the file.");
    const o = t.getUint32(12, !0), c = [];
    let i = 16;
    for (let d = 0; d < o; d++) {
      const l = new DataView(e, i, 12), u = C(l), _ = l.getUint32(4, !0), h = l.getUint32(8, !0), f = new Uint8Array(e, i, h);
      c.push({
        type: u,
        buffer: f,
        version: _
      }), i += h;
    }
    return {
      version: r,
      tiles: c
    };
  }
}
export {
  le as B3DMLoaderBase,
  ue as CMPTLoaderBase,
  y as FAILED,
  he as I3DMLoaderBase,
  T as LOADED,
  L as LOADING,
  Z as LRUCache,
  U as LoaderBase,
  ye as LoaderUtils,
  R as PARSING,
  de as PNTSLoaderBase,
  I as PriorityQueue,
  ce as TilesRendererBase,
  Te as TraversalUtils,
  p as UNLOADED,
  ge as WGS84_FLATTENING,
  pe as WGS84_HEIGHT,
  be as WGS84_RADIUS
};
//# sourceMappingURL=index.core.js.map
