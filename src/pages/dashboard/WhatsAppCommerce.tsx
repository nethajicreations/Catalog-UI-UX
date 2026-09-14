import React, { useState } from 'react';
import { useRouter } from '../../context/RouterContext';
import { useStore } from '../../context/StoreContext';
import {
  MessageSquare,
  Send,
  CheckCheck,
  Users,
  BookOpen,
  Sparkles,
  Phone,
  CheckCircle2,
  ExternalLink,
  ShoppingBag,
  BellRing,
  Smartphone,
} from 'lucide-react';

export const WhatsAppCommerce: React.FC = () => {
  const { currentTenant, catalogues, products, customers, addToast } = useStore();

  const [selectedCatalogueId, setSelectedCatalogueId] = useState(catalogues[0]?.id || '');
  const [targetAudience, setTargetAudience] = useState<'all' | 'b2b' | 'vip' | 'abandoned'>('all');
  const [messageTemplate, setMessageTemplate] = useState(
    `Hello {{customer_name}}! 🎁\nSpecial offer from {{store_name}}: Browse our latest digital catalogue "{{catalogue_title}}" with up to 40% OFF.\n\nOrder directly on WhatsApp or online: {{catalogue_link}}\n\nUse code FESTIVE10 for extra savings!`
  );
  const [isSending, setIsSending] = useState(false);

  // Automated notification settings
  const [autoOrderConfirm, setAutoOrderConfirm] = useState(true);
  const [autoDispatchUpdate, setAutoDispatchUpdate] = useState(true);
  const [autoCartReminder, setAutoCartReminder] = useState(true);

  // Broadcast History
  const [broadcasts, setBroadcasts] = useState([
    {
      id: 'b1',
      title: 'Weekend Flash Deals Broadcast',
      audience: 'All Customers (1,842)',
      sentDate: 'Yesterday, 4:15 PM',
      delivered: '1,810 (98%)',
      opened: '1,420 (78%)',
      ordersGenerated: 28,
      revenueGenerated: 42800,
    },
    {
      id: 'b2',
      title: 'B2B Wholesale Price Drop',
      audience: 'B2B Wholesale Group (34)',
      sentDate: 'Sep 10, 11:30 AM',
      delivered: '34 (100%)',
      opened: '32 (94%)',
      ordersGenerated: 6,
      revenueGenerated: 184000,
    },
  ]);

  const selectedCatalogue = catalogues.find((c) => c.id === selectedCatalogueId);

  // Simulated live message preview replacement
  const previewMessage = messageTemplate
    .replace('{{customer_name}}', 'Aarav Sharma')
    .replace('{{store_name}}', currentTenant.name)
    .replace('{{catalogue_title}}', selectedCatalogue?.name || 'Exclusive Deals')
    .replace(
      '{{catalogue_link}}',
      `https://${currentTenant.slug}.catalogpro.shop/c/${selectedCatalogue?.slug || 'festive'}`
    );

  const handleSendBroadcast = () => {
    setIsSending(true);
    setTimeout(() => {
      setIsSending(false);
      const newBroadcast = {
        id: 'b_' + Date.now(),
        title: `Broadcast: ${selectedCatalogue?.name || 'Catalog Share'}`,
        audience: targetAudience === 'all' ? 'All Customers (1,842)' : targetAudience === 'b2b' ? 'B2B Wholesale' : 'VIP Customers',
        sentDate: 'Just now',
        delivered: '1,842 (100%)',
        opened: 'Just queued',
        ordersGenerated: 0,
        revenueGenerated: 0,
      };
      setBroadcasts([newBroadcast, ...broadcasts]);
      addToast(`WhatsApp broadcast queued to ${targetAudience} audience successfully!`, 'success');
    }, 800);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-neutral-900 tracking-tight flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-emerald-600" />
            <span>WhatsApp Commerce Hub</span>
          </h1>
          <p className="text-xs text-neutral-500">
            Automate order notifications, send interactive catalogue broadcasts, and capture chat orders.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-lg text-xs font-semibold text-emerald-900">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Connected: +91 98200 12345 (Meta Cloud API)</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Broadcast Composer (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Broadcast Composer Card */}
          <div className="bg-white rounded-xl border border-neutral-200 p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-neutral-900 flex items-center gap-2">
                <Send className="w-4 h-4 text-emerald-600" />
                <span>Create Interactive Catalogue Broadcast</span>
              </h2>
              <span className="text-[11px] text-neutral-500 font-medium">Meta Cloud API Certified</span>
            </div>

            {/* Catalogue Selector */}
            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">
                Select Catalogue to Broadcast
              </label>
              <select
                value={selectedCatalogueId}
                onChange={(e) => setSelectedCatalogueId(e.target.value)}
                className="w-full bg-neutral-50 border border-neutral-200 rounded-lg px-3 py-2 text-xs text-neutral-900 focus:outline-none"
              >
                {catalogues.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.productIds.length} items)
                  </option>
                ))}
              </select>
            </div>

            {/* Target Audience */}
            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">Target Audience</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { id: 'all', label: 'All Contacts', sub: '1,842 users' },
                  { id: 'b2b', label: 'B2B Trade', sub: '34 accounts' },
                  { id: 'vip', label: 'VIP Shoppers', sub: '82 clients' },
                  { id: 'abandoned', label: 'Cart Dropoffs', sub: '19 carts' },
                ].map((aud) => (
                  <button
                    key={aud.id}
                    type="button"
                    onClick={() => setTargetAudience(aud.id as any)}
                    className={`p-2 rounded-lg border text-left text-xs transition-colors ${
                      targetAudience === aud.id
                        ? 'border-emerald-600 bg-emerald-50/50 text-emerald-900 font-bold'
                        : 'border-neutral-200 text-neutral-600 hover:bg-neutral-50'
                    }`}
                  >
                    <div>{aud.label}</div>
                    <div className="text-[10px] text-neutral-400 font-normal">{aud.sub}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Template input */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-neutral-700">Message Content</label>
                <span className="text-[10px] text-neutral-400">Supports emojis & formatting</span>
              </div>
              <textarea
                rows={5}
                value={messageTemplate}
                onChange={(e) => setMessageTemplate(e.target.value)}
                className="w-full bg-neutral-50 border border-neutral-200 rounded-lg p-3 text-xs text-neutral-900 font-mono focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600"
              />
            </div>

            {/* Send CTA */}
            <div className="pt-2 flex items-center justify-between">
              <span className="text-xs text-neutral-500">Estimated recipients: <strong>1,842 contacts</strong></span>
              <button
                id="whatsapp-send-broadcast-btn"
                type="button"
                onClick={handleSendBroadcast}
                disabled={isSending}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold shadow-xs flex items-center gap-1.5 transition-colors"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{isSending ? 'Sending Campaign...' : 'Launch Broadcast'}</span>
              </button>
            </div>
          </div>

          {/* Automated Notifications Toggles */}
          <div className="bg-white rounded-xl border border-neutral-200 p-5 shadow-xs space-y-4">
            <h2 className="text-sm font-bold text-neutral-900 flex items-center gap-2">
              <BellRing className="w-4 h-4 text-neutral-500" />
              <span>Automated WhatsApp Notifications</span>
            </h2>

            <div className="space-y-3 divide-y divide-neutral-100 text-xs">
              <div className="pt-2 flex items-center justify-between">
                <div>
                  <div className="font-semibold text-neutral-900">Instant Order Confirmation</div>
                  <p className="text-neutral-500 text-[11px]">Send order breakdown, invoice link, and estimated delivery date</p>
                </div>
                <input
                  type="checkbox"
                  checked={autoOrderConfirm}
                  onChange={(e) => setAutoOrderConfirm(e.target.checked)}
                  className="rounded border-neutral-300 text-emerald-600 focus:ring-emerald-600"
                />
              </div>

              <div className="pt-3 flex items-center justify-between">
                <div>
                  <div className="font-semibold text-neutral-900">Courier Dispatch & Tracking Alerts</div>
                  <p className="text-neutral-500 text-[11px]">Auto-send live courier tracking link when AWB number is entered</p>
                </div>
                <input
                  type="checkbox"
                  checked={autoDispatchUpdate}
                  onChange={(e) => setAutoDispatchUpdate(e.target.checked)}
                  className="rounded border-neutral-300 text-emerald-600 focus:ring-emerald-600"
                />
              </div>

              <div className="pt-3 flex items-center justify-between">
                <div>
                  <div className="font-semibold text-neutral-900">Abandoned Cart WhatsApp Recovery</div>
                  <p className="text-neutral-500 text-[11px]">Send friendly reminder + 5% discount code after 2 hours of abandonment</p>
                </div>
                <input
                  type="checkbox"
                  checked={autoCartReminder}
                  onChange={(e) => setAutoCartReminder(e.target.checked)}
                  className="rounded border-neutral-300 text-emerald-600 focus:ring-emerald-600"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Live WhatsApp Chat Bubble Preview & History (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* WhatsApp Chat Preview */}
          <div className="bg-neutral-900/5 rounded-2xl p-4 border border-neutral-200">
            <div className="flex items-center justify-between mb-3 px-1">
              <span className="text-xs font-bold text-neutral-700 flex items-center gap-1.5">
                <Smartphone className="w-4 h-4 text-emerald-600" />
                <span>Customer WhatsApp View</span>
              </span>
              <span className="text-[10px] text-neutral-400">Live preview</span>
            </div>

            {/* Chat Device Mock */}
            <div className="bg-[#EFEAE2] rounded-xl p-3 border border-neutral-300/80 shadow-xs min-h-[380px] flex flex-col justify-between">
              {/* WhatsApp message bubble */}
              <div className="bg-white rounded-lg rounded-tl-xs p-3 shadow-xs max-w-[90%] text-neutral-800 text-xs space-y-2 border border-neutral-200/60">
                {/* Embedded catalogue card */}
                {selectedCatalogue && (
                  <div className="rounded-md overflow-hidden border border-neutral-200 bg-neutral-50">
                    <img src={selectedCatalogue.coverImage} alt="cover" className="w-full h-28 object-cover" />
                    <div className="p-2">
                      <div className="font-bold text-[11px] text-neutral-900">{selectedCatalogue.name}</div>
                      <div className="text-[10px] text-neutral-500">
                        {selectedCatalogue.productIds.length} curated products
                      </div>
                    </div>
                  </div>
                )}

                <div className="whitespace-pre-line text-[11px] leading-relaxed">{previewMessage}</div>

                <div className="text-[9px] text-neutral-400 text-right flex items-center justify-end gap-1">
                  <span>10:42 AM</span>
                  <CheckCheck className="w-3 h-3 text-sky-500" />
                </div>
              </div>

              {/* Quick Action Button Mock inside WhatsApp */}
              <div className="space-y-1.5 pt-3">
                <button
                  type="button"
                  className="w-full bg-white text-emerald-700 hover:bg-neutral-50 font-bold py-2 rounded-lg text-xs shadow-xs border border-neutral-200 flex items-center justify-center gap-1.5"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Browse Catalogue</span>
                </button>
              </div>
            </div>
          </div>

          {/* Broadcast History */}
          <div className="bg-white rounded-xl border border-neutral-200 p-4 shadow-xs space-y-3">
            <h3 className="text-xs font-bold text-neutral-900 uppercase tracking-wider">
              Recent Broadcast Campaigns
            </h3>

            <div className="space-y-3">
              {broadcasts.map((b) => (
                <div key={b.id} className="p-3 rounded-lg bg-neutral-50 border border-neutral-100 text-xs space-y-1.5">
                  <div className="flex justify-between font-bold text-neutral-900">
                    <span>{b.title}</span>
                    <span className="text-emerald-600 font-semibold">{b.delivered}</span>
                  </div>
                  <div className="text-[11px] text-neutral-500 flex justify-between">
                    <span>{b.audience}</span>
                    <span>{b.sentDate}</span>
                  </div>
                  <div className="text-[11px] text-neutral-700 pt-1 border-t border-neutral-200 flex justify-between font-medium">
                    <span>Orders: {b.ordersGenerated}</span>
                    <span className="font-bold">Sales: ₹{b.revenueGenerated.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
