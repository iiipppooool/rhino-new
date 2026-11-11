import Image from 'next/image';
import { photos, type PhotoKey } from '@/lib/photos';
import { PhotoPlaceholder } from './placeholder';

/**
 * Renders a manifest photo, or a marked placeholder when no suitable photo was
 * found. Never renders an unrelated image to fill a gap.
 */
export function Photo({
  name,
  className = '',
  ratio = 'aspect-[4/3]',
  sizes = '(max-width: 768px) 100vw, 50vw',
  priority = false,
  tint = true,
}: {
  name: PhotoKey;
  className?: string;
  ratio?: string;
  sizes?: string;
  priority?: boolean;
  tint?: boolean;
}) {
  const p = photos[name];
  if (!p.src) return <PhotoPlaceholder brief={p.brief} ratio={ratio} className={className} />;

  return (
    <div className={`relative overflow-hidden ${ratio} ${tint ? 'graded-tint' : ''} ${className}`}>
      <Image
        src={p.src}
        alt={p.alt}
        fill
        sizes={sizes}
        priority={priority}
        loading={priority ? undefined : 'lazy'}
        className="graded object-cover"
        data-replace="true"
        data-photo-temporary={p.temporary ? 'true' : undefined}
      />
    </div>
  );
}
