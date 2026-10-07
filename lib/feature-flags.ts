export interface FeatureFlags {
  insetHeader: boolean
}

export const featureFlags: FeatureFlags = {
  insetHeader: process.env.NEXT_PUBLIC_INSET_HEADER === 'true',
}
