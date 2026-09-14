import React, { useState } from 'react';
import { useRouter } from '../../context/RouterContext';
import { useStore } from '../../context/StoreContext';
import { StatusBadge } from '../../components/ui/Badge';
import {
  BookOpen,
  Plus,
  Copy,
  ExternalLink,
  Edit,
  Share2,
  Trash2,
  Eye,
  CheckCircle2,
  MessageSquare,
  Lock,
  Globe,
  Briefcase,
} from 'lucide-react';
import { Catalogue } from '../../types';

export const CataloguesList: React.FC = () => {
  const { navigate } = useRouter();
  const { catalogues, products, currentTenant, duplicateCatalogue, deleteCatalogue, addToast } = useStore();

  const handleCopyLink = (cat: Catalogue) => {
    const url = `${window.location.origin}/store/${currentTenant.slug}/catalogue/${cat.slug}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url);
      addToast(`Copied share link for "${cat.name}"!`, 'success');
    } else {
      addToast(`Share link: ${url}`, 'info');
    }
  };

  const handleWhatsAppShare = (cat: Catalogue) => {
    const url = `${window.location.origin}/store/${currentTenant.slug}/catalogue/${cat.slug}`;
    const text = encodeURIComponent(
      `Check out our new catalogue: *${cat.name}* from ${currentTenant.name}! Browse products & order directly: ${url}`
    );
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-neutral-900 tracking-tight">Digital Catalogues & Price Lists</h1>
          <p className="text-xs text-neutral-500">
            Create branded digital catalogues with wholesale or retail pricing to share over WhatsApp, email, or web.
          </p>
        </div>

        <button
          id="catalogue-create-new-btn"
          type="button"
          onClick={() => navigate('/dashboard/catalogues/new')}
          className="flex items-center gap-1.5 px-3.5 py-1.5 bg-neutral-900 text-white hover:bg-neutral-800 rounded-lg text-xs font-semibold shadow-xs transition-colors self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>New Visual Catalogue</span>
        </button>
      </div>

      {/* Catalogues Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {catalogues.map((cat) => {
          const productCount = cat.productIds.length;

          return (
            <div
              key={cat.id}
              className="bg-white rounded-xl border border-neutral-200 shadow-xs overflow-hidden flex flex-col justify-between hover:border-neutral-300 transition-all"
            >
              <div>
                {/* Cover Image & Badges */}
                <div className="relative h-44 bg-neutral-100 overflow-hidden">
                  <img src={cat.coverImage} alt={cat.name} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex flex-col justify-between p-3.5">
                    <div className="flex items-center justify-between">
                      <span
                        className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full flex items-center gap-1 ${
                          cat.customerAccess === 'public'
                            ? 'bg-emerald-500/90 text-white'
                            : cat.customerAccess === 'b2b_only'
                            ? 'bg-indigo-600/90 text-white'
                            : 'bg-amber-600/90 text-white'
                        }`}
                      >
                        {cat.customerAccess === 'public' && <Globe className="w-3 h-3" />}
                        {cat.customerAccess === 'b2b_only' && <Briefcase className="w-3 h-3" />}
                        {cat.customerAccess === 'vip_only' && <Lock className="w-3 h-3" />}
                        <span>{cat.customerAccess.replace('_', ' ')}</span>
                      </span>

                      <span className="text-[10px] bg-black/60 backdrop-blur-xs text-white px-2 py-0.5 rounded font-medium">
                        {cat.pricingMode.toUpperCase()}
                      </span>
                    </div>

                    <div>
                      <h2 className="text-sm font-bold text-white leading-tight line-clamp-2">{cat.name}</h2>
                      <div className="flex items-center gap-3 text-[11px] text-neutral-300 mt-1">
                        <span>{productCount} items</span>
                        <span>·</span>
                        <span>{cat.viewCount} views</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Body info */}
                <div className="p-4 space-y-3">
                  <p className="text-xs text-neutral-600 line-clamp-2 leading-relaxed">{cat.description}</p>

                  <div className="flex items-center justify-between text-[11px] text-neutral-500 border-t border-neutral-100 pt-2.5">
                    <span>Layout: <strong className="text-neutral-800">{cat.layoutStyle.replace('_', ' ')}</strong></span>
                    <span>Updated {cat.lastUpdated}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="p-3 border-t border-neutral-100 bg-neutral-50/50 flex items-center justify-between gap-1 text-xs">
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => handleWhatsAppShare(cat)}
                    className="p-1.5 rounded-lg text-emerald-600 hover:bg-emerald-50 transition-colors"
                    title="Share via WhatsApp"
                  >
                    <MessageSquare className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleCopyLink(cat)}
                    className="p-1.5 rounded-lg text-neutral-600 hover:bg-neutral-200 transition-colors"
                    title="Copy Share Link"
                  >
                    <Copy className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={() => duplicateCatalogue(cat.id)}
                    className="p-1.5 rounded-lg text-neutral-600 hover:bg-neutral-200 transition-colors"
                    title="Duplicate Catalogue"
                  >
                    <Share2 className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      if (confirm(`Archive catalogue "${cat.name}"?`)) deleteCatalogue(cat.id);
                    }}
                    className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 transition-colors"
                    title="Archive Catalogue"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    id={`catalogue-preview-${cat.id}`}
                    type="button"
                    onClick={() => navigate(`/dashboard/catalogues/${cat.id}`)}
                    className="px-2.5 py-1.5 bg-neutral-900 hover:bg-neutral-800 text-white rounded-lg text-xs font-semibold flex items-center gap-1 shadow-xs"
                  >
                    <Edit className="w-3.5 h-3.5" />
                    <span>Visual Builder</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
