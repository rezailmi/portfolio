import { ImageResponse } from 'next/og'
import { cacheLife } from 'next/cache'
import { readFile } from 'node:fs/promises'
import { join } from 'node:path'

export const alt = 'Reza Ilmi — Portfolio'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

async function getGeistBold() {
  'use cache'
  cacheLife('max')
  return readFile(
    join(process.cwd(), 'node_modules/geist/dist/fonts/geist-sans/Geist-Bold.ttf')
  )
}

export default async function Image() {
  const geistBold = await getGeistBold()

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#e0ded4',
        }}
      >
        {/* Monitor frame */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            position: 'relative',
            width: 1000,
            height: 540,
            borderRadius: 12,
            background: 'linear-gradient(to bottom, #e8e6dc, #d8d6cc)',
            border: '1px solid #c4c2ba',
            padding: 24,
          }}
        >
          {/* Outer screen bezel */}
          <div
            style={{
              display: 'flex',
              flex: 1,
              borderRadius: 10,
              background: 'linear-gradient(143deg, #9B9A8E 0%, #B0AE9F 50%, #F2F1DB 52%, #E2E1D4 100%)',
              padding: 14,
              boxShadow: '1px 1px 0px #CDCBC0',
            }}
          >
            {/* Inner screen bezel */}
            <div
              style={{
                display: 'flex',
                flex: 1,
                borderRadius: 16,
                background: 'linear-gradient(to bottom, #5a5854, #454341)',
                padding: 10,
              }}
            >
              {/* Screen */}
              <div
                style={{
                  display: 'flex',
                  flex: 1,
                  flexDirection: 'column',
                  borderRadius: 12,
                  background: '#1a1a1a',
                  overflow: 'hidden',
                }}
              >
                {/* Menu bar */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    height: 28,
                    paddingLeft: 10,
                    paddingRight: 10,
                    background: 'rgba(255, 255, 255, 0.9)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    {/* Folder icon */}
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z" />
                    </svg>
                    <span style={{ fontFamily: 'Geist', fontSize: 12, fontWeight: 700, color: '#000' }}>
                      Reza
                    </span>
                  </div>
                </div>

                {/* Screen content — logo centered */}
                <div
                  style={{
                    display: 'flex',
                    flex: 1,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <svg
                    width={140}
                    height={145}
                    viewBox="-3 -3 62 64"
                    fill="none"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M19.0176 57.3943C25.0517 57.3943 30.1692 51.8914 31.9564 44.2698C32.5651 44.8578 33.214 45.4251 33.9016 45.9668C41.7345 52.1371 51.6248 52.6445 55.9923 47.1002C60.3598 41.5559 57.5506 32.0593 49.7178 25.8891C49.3101 25.568 48.8969 25.2622 48.4792 24.9718C50.6731 22.4309 52 19.1204 52 15.5C52 7.49187 45.5081 1 37.5 1C34.6812 1 32.0502 1.80435 29.8241 3.19606C27.5615 1.31373 24.6527 0.181641 21.4795 0.181641C14.269 0.181641 8.42383 6.02686 8.42383 13.2373C8.42383 13.7646 8.45508 14.2845 8.51584 14.7954C3.73594 16.0673 0.210938 20.4663 0.210938 25.6975C0.210938 29.7766 2.35424 33.3497 5.56455 35.3288C5.45648 36.2977 5.40039 37.2907 5.40039 38.3021C5.40039 48.8464 11.497 57.3943 19.0176 57.3943Z"
                      fill="#fafafa"
                    />
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M18.9716 14.9794C15.8351 18.9298 15.7692 24.0987 18.8245 26.5245C21.8798 28.9504 26.8992 27.7145 30.0357 23.7641C33.1722 19.8137 33.2381 14.6448 30.1828 12.219C27.1275 9.79318 22.1081 11.0291 18.9716 14.9794Z"
                      fill="#1a1a1a"
                    />
                  </svg>
                </div>

                {/* CRT scanline overlay */}
                <div
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'linear-gradient(to bottom, transparent 50%, rgba(0,0,0,0.15) 50%)',
                    backgroundSize: '100% 4px',
                    display: 'flex',
                  }}
                />
              </div>
            </div>
          </div>

          {/* Disk drive slot */}
          <div
            style={{
              position: 'absolute',
              bottom: 48,
              right: 56,
              width: 120,
              height: 3,
              background: 'linear-gradient(to right, #1a1a1a, #2b2b2b, #1a1a1a)',
              display: 'flex',
            }}
          />

          {/* Rainbow logo */}
          <div
            style={{
              position: 'absolute',
              bottom: 40,
              left: 40,
              display: 'flex',
              height: 8,
              width: 24,
            }}
          >
            <div style={{ flex: 1, background: '#7cc7e8' }} />
            <div style={{ flex: 1, background: '#41b54a' }} />
            <div style={{ flex: 1, background: '#f8d800' }} />
            <div style={{ flex: 1, background: '#f86800' }} />
            <div style={{ flex: 1, background: '#f80000' }} />
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        {
          name: 'Geist',
          data: geistBold,
          style: 'normal',
          weight: 700,
        },
      ],
    }
  )
}
