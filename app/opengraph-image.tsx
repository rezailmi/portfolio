import { ImageResponse } from 'next/og'
import { readFile } from 'node:fs/promises'
import { join } from 'node:path'

export const alt = 'Reza Ilmi, Designer + Engineer'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function Image() {
  const geistBold = await readFile(
    join(process.cwd(), 'node_modules/geist/dist/fonts/geist-sans/Geist-Bold.ttf')
  )

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#f5f5f5',
        }}
      >
        {/* macOS Window */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            width: 920,
            height: 500,
            borderRadius: 12,
            overflow: 'hidden',
            boxShadow: '0 25px 60px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(0, 0, 0, 0.06)',
          }}
        >
          {/* Title Bar */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              height: 52,
              paddingLeft: 20,
              paddingRight: 20,
              background: '#e8e8e8',
              borderBottom: '1px solid #d4d4d4',
            }}
          >
            {/* Traffic Lights */}
            <div style={{ display: 'flex', gap: 8 }}>
              <div
                style={{
                  width: 14,
                  height: 14,
                  borderRadius: 7,
                  background: '#FF5F56',
                }}
              />
              <div
                style={{
                  width: 14,
                  height: 14,
                  borderRadius: 7,
                  background: '#FFBD2E',
                }}
              />
              <div
                style={{
                  width: 14,
                  height: 14,
                  borderRadius: 7,
                  background: '#27C93F',
                }}
              />
            </div>
            {/* Window Title */}
            <div
              style={{
                display: 'flex',
                flex: 1,
                justifyContent: 'center',
                fontFamily: 'Geist',
                fontSize: 14,
                color: '#737373',
                marginRight: 62,
              }}
            >
              rezailmi.com
            </div>
          </div>

          {/* Window Content */}
          <div
            style={{
              display: 'flex',
              flex: 1,
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              background: '#fafafa',
              gap: 32,
            }}
          >
            {/* Logo */}
            <svg
              width={120}
              height={124}
              viewBox="-3 -3 62 64"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M19.0176 57.3943C25.0517 57.3943 30.1692 51.8914 31.9564 44.2698C32.5651 44.8578 33.214 45.4251 33.9016 45.9668C41.7345 52.1371 51.6248 52.6445 55.9923 47.1002C60.3598 41.5559 57.5506 32.0593 49.7178 25.8891C49.3101 25.568 48.8969 25.2622 48.4792 24.9718C50.6731 22.4309 52 19.1204 52 15.5C52 7.49187 45.5081 1 37.5 1C34.6812 1 32.0502 1.80435 29.8241 3.19606C27.5615 1.31373 24.6527 0.181641 21.4795 0.181641C14.269 0.181641 8.42383 6.02686 8.42383 13.2373C8.42383 13.7646 8.45508 14.2845 8.51584 14.7954C3.73594 16.0673 0.210938 20.4663 0.210938 25.6975C0.210938 29.7766 2.35424 33.3497 5.56455 35.3288C5.45648 36.2977 5.40039 37.2907 5.40039 38.3021C5.40039 48.8464 11.497 57.3943 19.0176 57.3943Z"
                fill="#0a0a0a"
              />
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M18.9716 14.9794C15.8351 18.9298 15.7692 24.0987 18.8245 26.5245C21.8798 28.9504 26.8992 27.7145 30.0357 23.7641C33.1722 19.8137 33.2381 14.6448 30.1828 12.219C27.1275 9.79318 22.1081 11.0291 18.9716 14.9794Z"
                fill="#fafafa"
              />
            </svg>

            {/* Site Name */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 8,
              }}
            >
              <div
                style={{
                  fontFamily: 'Geist',
                  fontSize: 28,
                  fontWeight: 700,
                  color: '#0a0a0a',
                  letterSpacing: -0.5,
                }}
              >
                Reza Ilmi
              </div>
              <div
                style={{
                  fontFamily: 'Geist',
                  fontSize: 18,
                  color: '#737373',
                }}
              >
                Designer + Engineer
              </div>
            </div>
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
