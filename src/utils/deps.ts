import type { Plugin } from "@inkweave/core";
import {
  audioPlugin,
  autoButtonPlugin,
  autoRestorePlugin,
  autoSavePlugin,
  cdButtonPlugin,
  classTagPlugin,
  fadeEffectPlugin,
  imagePlugin,
  linkOpenPlugin,
  memoryPlugin,
  scrollAfterChoicePlugin,
} from "@inkweave/plugins";
import type { PluginSettings } from "../types";

export const plugins: Plugin[] = [
  audioPlugin,
  autoButtonPlugin,
  autoRestorePlugin,
  autoSavePlugin,
  cdButtonPlugin,
  classTagPlugin,
  fadeEffectPlugin,
  imagePlugin,
  linkOpenPlugin,
  memoryPlugin,
  scrollAfterChoicePlugin,
];

const deps: Record<string, string[]> = {};
const rdeps: Record<string, string[]> = {};
for (const p of plugins) {
  deps[p.id] = p.dependencies || [];
  rdeps[p.id] = [];
}
for (const p of plugins) {
  for (const d of p.dependencies || []) {
    if (rdeps[d]) rdeps[d].push(p.id);
  }
}

const reachable = (start: string, edges: Record<string, string[]>): Set<string> => {
  const found = new Set<string>();
  const seen = new Set<string>();
  const queue = [start];
  let head = 0;

  while (head < queue.length) {
    const id = queue[head++];
    if (id === undefined || seen.has(id)) continue;
    seen.add(id);
    for (const next of edges[id] || []) {
      if (!found.has(next)) {
        found.add(next);
        queue.push(next);
      }
    }
  }
  return found;
};

export const resolve = (
  settings: Record<string, boolean>,
  id: string,
  on: boolean,
): Partial<PluginSettings> => {
  const next = { ...settings };
  if (on) {
    for (const dep of reachable(id, deps)) next[dep] = true;
    next[id] = true;
  } else {
    for (const dep of reachable(id, rdeps)) next[dep] = false;
    next[id] = false;
  }
  return next;
};
