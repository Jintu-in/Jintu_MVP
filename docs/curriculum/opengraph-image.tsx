import { ImageResponse } from 'next/og';
import { getTrack, verificationMix } from '@/lib/tracks';

/**
 * Per-track OG image.
 *
 * Distribution is WhatsApp, so this is not decoration — a link without a
 * preview reads as spam in a placement group. The image leads with the
 * machine-checked percentage because that is the claim worth forwarding.
 */

export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';
export const alt = 'Jintu track';

export default async function Image({ params }: { params: { slug: string } }) {
  const track = await getTrack(params.slug);
  const mix = track ? verificationMix(track) : null;

  return new ImageResponse(
    (
      <div
        style={{
          height: '100%', width: '100%', display: 'flex', flexDirection: 'column',
          justifyContent: 'space-between', padding: 72, background: '#FFFFFF',
        }}
      >
        <div style={{ display: 'flex', fontSize: 26, color: '#17758A' }}>jintu.in</div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ fontSize: 62, color: '#0B0B0B', lineHeight: 1.1, letterSpacing: '-0.02em' }}>
            {track?.title ?? 'Learn anything'}
          </div>
          {track?.oneLine && (
            <div style={{ marginTop: 20, fontSize: 28, color: '#5F5E5A', lineHeight: 1.4 }}>
              {track.oneLine.slice(0, 96)}
            </div>
          )}
        </div>

        {mix && mix.total > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {/* The verification strip, again. Same idea at 1200px as at 80px. */}
            <div style={{ display: 'flex', height: 10, borderRadius: 6, overflow: 'hidden', background: '#E8E8E5' }}>
              <div style={{ width: `${(mix.machine / mix.total) * 100}%`, background: '#1D9E75' }} />
              <div style={{ width: `${(mix.peer / mix.total) * 100}%`, background: '#7F77DD' }} />
              <div style={{ width: `${(mix.model / mix.total) * 100}%`, background: '#BA7517' }} />
            </div>
            <div style={{ marginTop: 20, display: 'flex', fontSize: 26, color: '#5F5E5A' }}>
              {track!.units.length} artifacts · {mix.total} points ·{' '}
              {Math.round(mix.machineShare * 100)}% checked by machine · free to read
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', fontSize: 26, color: '#5F5E5A' }}>
            Free curriculum · Jintu
          </div>
        )}
      </div>
    ),
    { ...size },
  );
}
