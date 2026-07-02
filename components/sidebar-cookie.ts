export const SIDEBAR_COOKIE_NAME = 'sidebar:state'

export function getSidebarDefaultOpen(): boolean {
  if (typeof document === 'undefined') return true
  const match = document.cookie
    .split('; ')
    .find((row) => row.startsWith(`${SIDEBAR_COOKIE_NAME}=`))
  return match ? match.split('=')[1] === 'true' : true
}
