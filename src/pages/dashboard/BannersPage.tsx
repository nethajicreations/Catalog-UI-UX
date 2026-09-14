import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import {
  Image as ImageIcon,
  Plus,
  ExternalLink,
  Eye,
  CheckCircle2,
  XCircle,
  Sliders,
  Layers,
  Sparkles,
} from 'lucide-react';
import { Banner } from '../../types';

export const BannersPage: React.FC = () => {
  const { banners, toggleBannerStatus, addToast } = useStore();
  const [activePlacement, setActivePlacement] = useState<'all' | 'hero' | 'category' | 'checkout'>('all');

  const filteredBanners = banners.filter((b) =>
    activePlacement === 'all' ? true : b.placement === activePlacement
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-neutral-900 tracking-tight">Storefront Banners & Hero Sliders</h1>
          <p className="text-xs text-neutral-500">
            Manage high-impact graphic promotional banners and announcements across your storefront.
          </p>
        </div>

        <button
          type="button"
          onClick={() => addToast('Banner creation modal initialized. Select template to customize.', 'info')}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-neutral-900 hover:bg-neutral-800 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Promotional Banner
        </button>
      </div>

      {/* Placement Tabs */}
      <div className="flex items-center gap-2 border-b border-neutral-200 pb-2 overflow-x-auto text-xs">
        {(['all', 'hero', 'category', 'checkout'] as const).map((p) => (
          <button
            key={p}
            type="button"
            onClick={() => setActivePlacement(p)}
            className={`px-3 py-1.5 font-semibold rounded-lg capitalize transition-colors ${
              activePlacement === p
                ? 'bg-neutral-900 text-white'
                : 'text-neutral-600 hover:bg-neutral-100'
            }`}
          >
            {p === 'all' ? 'All Banners' : `${p} Banners`}
          </button>
        ))}
      </div>

      {/* Grid of Banners */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredBanners.map((banner) => (
          <div
            key={banner.id}
            className="bg-white rounded-xl border border-neutral-200/80 shadow-xs overflow-hidden flex flex-col"
          >
            {/* Visual Preview */}
            <div className="relative h-44 bg-neutral-900 overflow-hidden group">
              <img
                src={banner.imageUrl}
                alt={banner.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex flex-col justify-end p-4 text-white">
                <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-white/20 backdrop-blur-xs uppercase tracking-wider mb-1 w-fit">
                  {banner.placement} Placement
                </span>
                <h3 className="font-bold text-base leading-tight">{banner.title}</h3>
                {banner.subtitle && <p className="text-xs text-neutral-200 mt-0.5">{banner.subtitle}</p>}
                {banner.ctaText && (
                  <div className="mt-2">
                    <span className="inline-block px-2.5 py-1 bg-white text-neutral-900 text-[11px] font-bold rounded-md">
                      {banner.ctaText} →
                    </span>
                  </div>
                )}
              </div>

              {/* Status Badge */}
              <div className="absolute top-3 right-3">
                <span
                  className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    banner.status === 'active'
                      ? 'bg-emerald-500 text-white'
                      : 'bg-neutral-800 text-neutral-300'
                  }`}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-white" />
                  <span className="capitalize">{banner.status}</span>
                </span>
              </div>
            </div>

            {/* Controls */}
            <div className="p-3.5 flex items-center justify-between border-t border-neutral-100 bg-neutral-50/50 mt-auto text-xs">
              <div className="flex items-center gap-2 text-neutral-500 text-[11px]">
                <span>Links to:</span>
                <code className="text-neutral-700 bg-neutral-200/70 px-1.5 py-0.5 rounded font-mono">
                  {banner.linkUrl}
                </code>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => toggleBannerStatus(banner.id)}
                  className={`px-3 py-1 font-semibold rounded-lg border transition-colors ${
                    banner.status === 'active'
                      ? 'border-neutral-200 text-neutral-600 hover:bg-white'
                      : 'border-emerald-300 text-emerald-700 bg-emerald-50 hover:bg-emerald-100'
                  }`}
                >
                  {banner.status === 'active' ? 'Deactivate' : 'Publish Live'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
