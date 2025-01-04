/**
 * 对象池对象接口
 * @date 2025/1/4
 */
export interface PoolObject {
  alloc(): void;

  free(): void;
}