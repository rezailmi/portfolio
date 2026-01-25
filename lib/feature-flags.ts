export interface FeatureFlags {
  insetHeader: boolean
}

export const featureFlags: FeatureFlags = {
  insetHeader: process.env.NEXT_PUBLIC_INSET_HEADER === 'true',
}

export function getFeatureFlag<K extends keyof FeatureFlags>(key: K): FeatureFlags[K] {
  return featureFlags[key]
}

export function isInsetHeader(): boolean {
  return featureFlags.insetHeader
}
