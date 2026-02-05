"use strict";
var DirectEditPreload = (() => {
  // src/preload.ts
  var fiberRoots = /* @__PURE__ */ new Map();
  var elementToFiber = /* @__PURE__ */ new WeakMap();
  function ensureRootSet(rendererId) {
    let set = fiberRoots.get(rendererId);
    if (!set) {
      set = /* @__PURE__ */ new Set();
      fiberRoots.set(rendererId, set);
    }
    return set;
  }
  function rebuildIndex() {
    elementToFiber = /* @__PURE__ */ new WeakMap();
    for (const roots of fiberRoots.values()) {
      for (const root of roots) {
        const current = root?.current;
        if (!current) continue;
        indexFiberTree(current);
      }
    }
  }
  function indexFiberTree(root) {
    const stack = [root];
    while (stack.length > 0) {
      const node = stack.pop();
      if (!node) continue;
      const stateNode = node.stateNode;
      if (stateNode && stateNode.nodeType === 1) {
        elementToFiber.set(stateNode, node);
      }
      if (node.child) stack.push(node.child);
      if (node.sibling) stack.push(node.sibling);
    }
  }
  function getFiberForElement(element) {
    return elementToFiber.get(element) ?? null;
  }
  function createHook() {
    let rendererId = 0;
    const hook = {
      supportsFiber: true,
      inject(renderer) {
        rendererId += 1;
        const id = rendererId;
        void renderer;
        ensureRootSet(id);
        return id;
      },
      onCommitFiberRoot(id, root) {
        const roots = ensureRootSet(id);
        roots.add(root);
        rebuildIndex();
      },
      onCommitFiberUnmount() {
      },
      getFiberRoots(id) {
        return ensureRootSet(id);
      }
    };
    return hook;
  }
  function wrapHook(existing) {
    const originalInject = existing.inject?.bind(existing);
    const originalCommit = existing.onCommitFiberRoot?.bind(existing);
    const originalUnmount = existing.onCommitFiberUnmount?.bind(existing);
    existing.supportsFiber = true;
    existing.inject = (renderer) => {
      const id = originalInject ? originalInject(renderer) : 1;
      ensureRootSet(id);
      return id;
    };
    existing.onCommitFiberRoot = (id, root, ...args) => {
      const roots = ensureRootSet(id);
      roots.add(root);
      rebuildIndex();
      if (originalCommit) {
        originalCommit(id, root, ...args);
      }
    };
    existing.onCommitFiberUnmount = (id, fiber, ...args) => {
      if (originalUnmount) {
        originalUnmount(id, fiber, ...args);
      }
    };
    if (!existing.getFiberRoots) {
      existing.getFiberRoots = (id) => ensureRootSet(id);
    }
  }
  function installHook() {
    if (typeof window === "undefined") return;
    const globalWindow = window;
    if (globalWindow.__DIRECT_EDIT_DEVTOOLS__?.hasHook) return;
    const existing = globalWindow.__REACT_DEVTOOLS_GLOBAL_HOOK__;
    if (existing) {
      wrapHook(existing);
    } else {
      globalWindow.__REACT_DEVTOOLS_GLOBAL_HOOK__ = createHook();
    }
    globalWindow.__DIRECT_EDIT_DEVTOOLS__ = {
      getFiberForElement,
      hasHook: true
    };
  }
  installHook();
})();
