import React, { useState } from 'react';
import { useRouter } from '../../context/RouterContext';
import { useStore } from '../../context/StoreContext';
import {
  Palette,
  Save,
  Eye,
  Type,
  Layout,
  Smartphone,
  Tablet,
  Monitor,
  Check,
  RotateCcw,
  Sparkles,
  ExternalLink,
} from 'lucide-react';

export const StoreCustomizer: React.FC = () => {
  const { navigate } = useRouter();
  const { currentTenant, updateTenant, addToast } = useStore();

  const [name, setName] = useState(currentTenant.name || '');
  const [tagline, setTagline] = useState(currentTenant.tagline || '');
  const [primaryColor, setPrimaryColor] = useState(currentTenant.theme?.primaryColor || currentTenant.primaryColor || '#059669');
  const [accentColor, setAccentColor] = useState(currentTenant.theme?.accentColor || currentTenant.accentColor || '#047857');
  const [fontFamily, setFontFamily] = useState(currentTenant.theme?.fontFamily || currentTenant.fontFamily || 'Plus Jakarta Sans');
  const [bannerUrl, setBannerUrl] = useState(currentTenant.theme?.bannerUrl || currentTenant.bannerImage || '');
  const [announcementText, setAnnouncementText] = useState(currentTenant.theme?.announcementText || '⚡ Extra 10% OFF on Prepaid Orders');
  const [showAnnouncement, setShowAnnouncement] = useState(currentTenant.theme?.showAnnouncement ?? true);
  const [whatsappNumber, setWhatsappNumber] = useState(currentTenant.whatsappNumber || '+91 98201 44521');
  const [instagram, setInstagram] = useState(currentTenant.instagram || '@dailyneeddeals');
  const [deviceView, setDeviceView] = useState<'desktop' | 'mobile'>('desktop');

  const handleSaveTheme = () => {
    updateTenant(currentTenant.id, {
      name,
      tagline,
      primaryColor,
      accentColor,
      whatsappNumber,
      instagram,
      fontFamily,
      bannerImage: bannerUrl,
      theme: {
        ...(currentTenant.theme || {}),
        primaryColor,
        accentColor,
        fontFamily,
        bannerUrl,
        announcementText,
        showAnnouncement,
      },
    });
    addToast('Storefront branding & theme saved successfully!', 'success');
  };

  return (
    <div className="space-y-4 pb-12">
      {/* Top Header */}
      <div className="bg-white rounded-xl border border-neutral-200 p-3.5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-sm font-bold text-neutral-900 flex items-center gap-2">
            <Palette className="w-4 h-4 text-neutral-600" />
            <span>Storefront Theme & Branding Customizer</span>
          </h1>
          <p className="text-[11px] text-neutral-500">
            Customize colors, typography, banners, and announcement bars with real-time preview.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center bg-neutral-100 p-1 rounded-lg">
            <button
              type="button"
              onClick={() => setDeviceView('desktop')}
              className={`p-1.5 rounded-md ${deviceView === 'desktop' ? 'bg-white shadow-xs' : 'text-neutral-500'}`}
              title="Desktop View"
            >
              <Monitor className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => setDeviceView('mobile')}
              className={`p-1.5 rounded-md ${deviceView === 'mobile' ? 'bg-white shadow-xs' : 'text-neutral-500'}`}
              title="Mobile View"
            >
              <Smartphone className="w-3.5 h-3.5" />
            </button>
          </div>

          <button
            type="button"
            onClick={() => navigate(`/store/${currentTenant.slug}`)}
            className="px-3 py-1.5 border border-neutral-200 text-neutral-700 hover:bg-neutral-50 rounded-lg text-xs font-semibold flex items-center gap-1"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Open Store</span>
          </button>

          <button
            id="theme-save-btn"
            type="button"
            onClick={handleSaveTheme}
            className="px-4 py-1.5 bg-neutral-900 hover:bg-neutral-800 text-white rounded-lg text-xs font-semibold shadow-xs flex items-center gap-1.5"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save Changes</span>
          </button>
        </div>
      </div>

      {/* 2 Columns: Controls (Left 4 cols) & Live Storefront Preview (Right 8 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Controls */}
        <div className="lg:col-span-4 bg-white rounded-xl border border-neutral-200 p-5 shadow-xs space-y-4 max-h-[85vh] overflow-y-auto text-xs">
          <h2 className="font-bold text-neutral-900 uppercase tracking-wider text-[11px]">Store Brand Identity</h2>

          <div>
            <label className="block font-semibold text-neutral-700 mb-1">Store Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-neutral-50 border border-neutral-200 rounded-lg px-3 py-1.5 text-neutral-900 focus:bg-white"
            />
          </div>

          <div>
            <label className="block font-semibold text-neutral-700 mb-1">Tagline</label>
            <input
              type="text"
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              className="w-full bg-neutral-50 border border-neutral-200 rounded-lg px-3 py-1.5 text-neutral-900 focus:bg-white"
            />
          </div>

          {/* Color Palette */}
          <div className="pt-2 border-t border-neutral-100">
            <label className="block font-semibold text-neutral-700 mb-1.5">Primary Brand Color</label>
            <div className="flex items-center gap-2 mb-2">
              {['#0f172a', '#059669', '#2563eb', '#7c3aed', '#dc2626', '#d97706'].map((col) => (
                <button
                  key={col}
                  type="button"
                  onClick={() => setPrimaryColor(col)}
                  className={`w-7 h-7 rounded-full border transition-transform ${
                    primaryColor === col ? 'ring-2 ring-neutral-900 scale-110' : 'opacity-80'
                  }`}
                  style={{ backgroundColor: col }}
                />
              ))}
            </div>
            <input
              type="text"
              value={primaryColor}
              onChange={(e) => setPrimaryColor(e.target.value)}
              className="w-full font-mono bg-neutral-50 border border-neutral-200 rounded-lg px-3 py-1 text-neutral-900 text-[11px]"
            />
          </div>

          {/* Accent Color */}
          <div className="pt-2 border-t border-neutral-100">
            <label className="block font-semibold text-neutral-700 mb-1.5">Accent Color</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={accentColor}
                onChange={(e) => setAccentColor(e.target.value)}
                className="w-8 h-8 rounded-lg border border-neutral-200 cursor-pointer p-0.5 bg-white"
              />
              <input
                type="text"
                value={accentColor}
                onChange={(e) => setAccentColor(e.target.value)}
                className="w-full font-mono bg-neutral-50 border border-neutral-200 rounded-lg px-3 py-1 text-neutral-900 text-[11px]"
              />
            </div>
          </div>

          {/* WhatsApp & Socials */}
          <div className="pt-2 border-t border-neutral-100 space-y-3">
            <h3 className="font-bold text-neutral-900 uppercase tracking-wider text-[11px]">Direct Commerce & Socials</h3>
            <div>
              <label className="block font-semibold text-neutral-700 mb-1">WhatsApp Business Number</label>
              <input
                type="text"
                value={whatsappNumber}
                onChange={(e) => setWhatsappNumber(e.target.value)}
                placeholder="+91 98201 44521"
                className="w-full bg-neutral-50 border border-neutral-200 rounded-lg px-3 py-1.5 text-neutral-900 text-xs"
              />
            </div>
            <div>
              <label className="block font-semibold text-neutral-700 mb-1">Instagram Handle</label>
              <input
                type="text"
                value={instagram}
                onChange={(e) => setInstagram(e.target.value)}
                placeholder="@yourbrand"
                className="w-full bg-neutral-50 border border-neutral-200 rounded-lg px-3 py-1.5 text-neutral-900 text-xs"
              />
            </div>
          </div>

          {/* Typography */}
          <div className="pt-2 border-t border-neutral-100">
            <label className="block font-semibold text-neutral-700 mb-1">Typography Pairing</label>
            <select
              value={fontFamily}
              onChange={(e) => setFontFamily(e.target.value)}
              className="w-full bg-neutral-50 border border-neutral-200 rounded-lg px-2.5 py-1.5 text-neutral-900"
            >
              <option value="'Plus Jakarta Sans', sans-serif">Modern Clean (Plus Jakarta Sans)</option>
              <option value="'Space Grotesk', sans-serif">Tech & Bold (Space Grotesk)</option>
              <option value="system-ui, sans-serif">System Native Sans</option>
            </select>
          </div>

          {/* Hero Banner */}
          <div className="pt-2 border-t border-neutral-100">
            <label className="block font-semibold text-neutral-700 mb-1">Hero Banner Image URL</label>
            <input
              type="text"
              value={bannerUrl}
              onChange={(e) => setBannerUrl(e.target.value)}
              className="w-full bg-neutral-50 border border-neutral-200 rounded-lg px-3 py-1.5 text-neutral-900 text-[11px]"
            />
          </div>

          {/* Announcement Bar */}
          <div className="pt-2 border-t border-neutral-100 space-y-2">
            <div className="flex items-center justify-between">
              <label className="font-semibold text-neutral-700">Top Announcement Bar</label>
              <input
                type="checkbox"
                checked={showAnnouncement}
                onChange={(e) => setShowAnnouncement(e.target.checked)}
                className="rounded border-neutral-300 text-neutral-900 focus:ring-neutral-900"
              />
            </div>
            {showAnnouncement && (
              <input
                type="text"
                value={announcementText}
                onChange={(e) => setAnnouncementText(e.target.value)}
                className="w-full bg-neutral-50 border border-neutral-200 rounded-lg px-3 py-1.5 text-neutral-900"
                placeholder="e.g. ⚡ Extra 10% OFF on Prepaid Orders"
              />
            )}
          </div>
        </div>

        {/* Right: Live Interactive Storefront Mockup */}
        <div className="lg:col-span-8 flex justify-center">
          <div
            className={`w-full bg-neutral-100 rounded-2xl p-3 border border-neutral-300 transition-all ${
              deviceView === 'mobile' ? 'max-w-sm' : 'max-w-full'
            }`}
          >
            {/* Storefront Mock Container */}
            <div className="bg-white rounded-xl shadow-md border border-neutral-200 overflow-hidden font-sans">
              {/* Announcement Bar */}
              {showAnnouncement && (
                <div
                  className="py-1.5 px-3 text-center text-white text-[11px] font-semibold"
                  style={{ backgroundColor: primaryColor }}
                >
                  {announcementText}
                </div>
              )}

              {/* Store Navbar Mock */}
              <div className="p-3.5 border-b border-neutral-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div
                    className="w-7 h-7 rounded-lg flex items-center justify-center text-white font-bold text-xs"
                    style={{ backgroundColor: primaryColor }}
                  >
                    {name[0]}
                  </div>
                  <div>
                    <h3 className="font-bold text-xs text-neutral-900">{name}</h3>
                    <p className="text-[10px] text-neutral-400">{tagline}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-neutral-400 text-xs">
                  <span>Search</span>
                  <span>·</span>
                  <span>Cart (0)</span>
                </div>
              </div>

              {/* Hero Banner Mock */}
              <div
                className="relative h-44 bg-cover bg-center flex items-center justify-center p-6 text-center text-white"
                style={{
                  backgroundImage: `linear-gradient(to right, rgba(0,0,0,0.6), rgba(0,0,0,0.4)), url(${bannerUrl})`,
                }}
              >
                <div>
                  <h2 className="text-lg font-bold">Festive Collection 2026</h2>
                  <p className="text-xs text-neutral-200 mt-1 max-w-sm">
                    Exclusive electronic accessories and home organizers at direct manufacturer rates.
                  </p>
                  <button
                    type="button"
                    className="mt-3 px-4 py-1.5 rounded-lg text-white font-bold text-xs shadow-md"
                    style={{ backgroundColor: primaryColor }}
                  >
                    Shop Deals Now
                  </button>
                </div>
              </div>

              {/* Sample Product Cards */}
              <div className="p-4 grid grid-cols-2 sm:grid-cols-3 gap-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="border border-neutral-200 rounded-lg p-2.5 space-y-1.5">
                    <div className="w-full aspect-square bg-neutral-100 rounded-md overflow-hidden">
                      <img
                        src="https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=400&q=80"
                        alt="item"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="font-semibold text-xs text-neutral-900 truncate">Smart Watch Series 9</div>
                    <div className="text-xs font-bold text-neutral-900">₹1,499</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
