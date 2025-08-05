/**
 * @author zpj
 * @date 2025/4/1
 */

import { AdapterFactory } from "./AdapterFactory";

export function createAdapter() {
  const adapter = AdapterFactory.getAdapter();
  if (adapter) {
    console.log(`Adapter created: ${adapter.constructor.name}`);
  } else {
    console.error(`Failed to create adapter.`);
  }
  return adapter;
}

export const globalAdapter = createAdapter();
globalAdapter?.share?.();
