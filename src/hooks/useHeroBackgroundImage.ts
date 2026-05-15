'use client';

import { useEffect, useState } from 'react';

import { ADMIN_PREVIEW_REFRESH_EVENT } from '@/lib/admin/previewRefresh';
import { landingHeroBackgroundKey, landingHeroBackgroundSlot } from '@/lib/portfolioImages';
import { getSupabaseBrowserClient } from '@/lib/supabase/client';

type HeroBackgroundImage = {
  src: string;
  alt: string;
};

export function useHeroBackgroundImage() {
  const [image, setImage] = useState<HeroBackgroundImage | null>(null);

  useEffect(() => {
    let isMounted = true;
    const supabase = getSupabaseBrowserClient();

    if (!supabase) {
      return;
    }

    const client = supabase;

    async function loadHeroBackground() {
      const { data, error } = await client
        .from('portfolio_image_overrides')
        .select('image_url, alt_th, deleted_at')
        .eq('project_key', landingHeroBackgroundKey)
        .eq('image_slot', landingHeroBackgroundSlot)
        .maybeSingle();

      if (!isMounted) {
        return;
      }

      if (error || data?.deleted_at || !data?.image_url) {
        setImage(null);
        return;
      }

      setImage({
        src: data.image_url,
        alt: data.alt_th || 'TRP Powers Plus portfolio background',
      });
    }

    void loadHeroBackground();
    window.addEventListener(ADMIN_PREVIEW_REFRESH_EVENT, loadHeroBackground);

    return () => {
      isMounted = false;
      window.removeEventListener(ADMIN_PREVIEW_REFRESH_EVENT, loadHeroBackground);
    };
  }, []);

  return image;
}
