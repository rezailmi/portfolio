/**
 * Feature Flags Configuration
 *
 * All feature flags are defined here with their types and defaults.
 * Add new flags by extending the FeatureFlags interface and featureFlags object.
 */

export interface FeatureFlags {
  /**
   * Controls header placement mode:
   * - true: Header inside SidebarInset with backdrop-blur (inset/sticky mode)
   * - false: Header at root level, outside SidebarInset (static mode)
   *
   * Env: NEXT_PUBLIC_INSET_HEADER
   */
  insetHeader: boolean

  // Future flags can be added here:
  // experimentalFeature: boolean
  // newNavigation: 'tabs' | 'sidebar' | 'both'
}

export const featureFlags: FeatureFlags = {
  insetHeader: process.env.NEXT_PUBLIC_INSET_HEADER === 'true',
  // Add future flag defaults here
}

/**
 * Get a specific feature flag value
 */
export function getFeatureFlag<K extends keyof FeatureFlags>(key: K): FeatureFlags[K] {
  return featureFlags[key]
}

/**
 * Convenience function to check if inset header mode is enabled
 */
export function isInsetHeader(): boolean {
  return featureFlags.insetHeader
}
