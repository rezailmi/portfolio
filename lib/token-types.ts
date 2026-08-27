import { shadow, space, tracking, weight, zIndex } from '@/lib/constants.stylex'
import { colors, radius } from '@/lib/tokens.stylex'

type StyleXTokenKeys<T> = Exclude<
  keyof T,
  '__opaqueId' | '__tokens' | symbol | 'toString' | 'valueOf' | 'description'
>

export type SpaceToken = keyof typeof space
export type NegativeSpaceToken = `-${Exclude<SpaceToken, 'none'>}`
export type MarginToken = SpaceToken | NegativeSpaceToken | 'auto'
export type ShadowToken = keyof typeof shadow
export type ZIndexToken = keyof typeof zIndex
export type WeightToken = keyof typeof weight
export type TrackingToken = keyof typeof tracking
export type ColorToken = StyleXTokenKeys<typeof colors>
export type RadiusToken = StyleXTokenKeys<typeof radius>
