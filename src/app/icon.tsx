import { ImageResponse } from 'next/og';

export const size = {
  width: 32,
  height: 32,
};

export const contentType = 'image/png';

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 20,
          background: 'linear-gradient(135deg, #064e3b 0%, #facc15 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#fef3c7',
          borderRadius: '50%',
          fontWeight: 700,
        }}
      >
        D
      </div>
    ),
    {
      ...size,
    }
  );
}
