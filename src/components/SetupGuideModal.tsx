import React, { useState } from 'react';
import { 
  X, 
  HelpCircle, 
  CheckCircle2, 
  CreditCard, 
  DollarSign, 
  Globe, 
  ArrowRight, 
  ExternalLink,
  Copy,
  Check,
  Shield,
  Zap
} from 'lucide-react';
import { StoreSettings } from '../types';

interface SetupGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: StoreSettings;
  onGoToSettings: () => void;
}

export const SetupGuideModal: React.FC<SetupGuideModalProps> = ({
  isOpen,
  onClose,
  settings,
  onGoToSettings,
}) => {
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [activeStep, setActiveStep] = useState<1 | 2 | 3 | 4>(1);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/75 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        id="setup-guide-modal"
        className="relative bg-white w-full max-w-3xl rounded-2xl overflow-hidden shadow-2xl border border-stone-200 flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 sm:p-6 bg-stone-900 text-stone-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-stone-950 flex items-center justify-center font-bold">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
                How to Sell for Free with PayPal & Your Live URL
              </h3>
              <p className="text-xs text-stone-400">
                Zero monthly subscriptions vs. Shopify's $39/month fee
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-stone-800 hover:bg-stone-700 text-stone-300 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Step Navigation Tabs */}
        <div className="grid grid-cols-4 border-b border-stone-200 bg-stone-50 text-xs font-semibold">
          {[
            { step: 1, label: "1. Why Free?" },
            { step: 2, label: "2. Free PayPal" },
            { step: 3, label: "3. Free PayPal" },
            { step: 4, label: "4. Your Live URL" },
          ].map((t) => (
            <button
              key={t.step}
              onClick={() => setActiveStep(t.step as any)}
              className={`py-3 px-2 text-center transition-colors border-b-2 flex items-center justify-center gap-1.5 ${
                activeStep === t.step
                  ? 'border-amber-500 bg-white text-stone-950 font-bold'
                  : 'border-transparent text-stone-500 hover:text-stone-800'
              }`}
            >
              <span>{t.label}</span>
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5 text-sm text-stone-700">
          
          {activeStep === 1 && (
            <div className="space-y-4">
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                <h4 className="font-bold text-stone-900 text-sm flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-amber-600" />
                  Shopify vs. This Free Setup
                </h4>
                <p className="text-xs text-stone-600 mt-1 leading-relaxed">
                  Shopify charges <strong>$39 every single month</strong> ($468/year) just to keep a basic store online, even if you sell zero items that month!
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-4 rounded-xl border border-rose-200 bg-rose-50/50 space-y-2">
                  <div className="font-bold text-rose-800 uppercase tracking-wider text-[11px]">
                    Traditional Shopify Cost
                  </div>
                  <ul className="space-y-1 text-stone-600 list-disc list-inside">
                    <li>$39 to $105/month recurring fee</li>
                    <li>2.9% + 30¢ per transaction</li>
                    <li>Paid apps & themes ($10–$50/mo)</li>
                    <li>Total: <strong>$500+ / year minimum</strong></li>
                  </ul>
                </div>

                <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/50 space-y-2">
                  <div className="font-bold text-emerald-800 uppercase tracking-wider text-[11px]">
                    This Store + PayPal Setup
                  </div>
                  <ul className="space-y-1 text-stone-700 list-disc list-inside font-medium">
                    <li><span className="text-emerald-700 font-bold">$0/month</span> website hosting (included here!)</li>
                    <li><span className="text-emerald-700 font-bold">$0/month</span> PayPal account fee</li>
                    <li>Only pay standard 2.9% + 30¢ when a sale happens</li>
                    <li>Total: <strong>$0 out of pocket</strong> to start selling!</li>
                  </ul>
                </div>
              </div>

              <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 text-xs text-stone-600">
                <strong>How it works:</strong> You add your own products here, hook up your free PayPal link, and share your live URL with customers. All customer orders are saved and you get paid directly to your bank account!
              </div>
            </div>
          )}

          {activeStep === 2 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#635BFF] text-white flex items-center justify-center font-bold text-xs">
                  S
                </div>
                <div>
                  <h4 className="font-bold text-stone-900 text-sm">
                    How to Get Free PayPal Payment Links (2-Minute Setup)
                  </h4>
                  <p className="text-xs text-stone-500">
                    PayPal handles credit cards, Apple Pay, and Google Pay with zero monthly fee.
                  </p>
                </div>
              </div>

              <ol className="space-y-3 text-xs text-stone-700 list-decimal list-inside bg-stone-50 p-4 rounded-xl border border-stone-200">
                <li className="leading-relaxed">
                  <strong>Create a free account:</strong> Visit{' '}
                  <a 
                    href="https://paypal.com" 
                    target="_blank" 
                    rel="noreferrer" 
                    className="text-[#635BFF] font-semibold underline inline-flex items-center gap-0.5"
                  >
                    paypal.com <ExternalLink className="w-3 h-3" />
                  </a>
                  . Signing up and identity verification are 100% free.
                </li>
                <li className="leading-relaxed">
                  <strong>Create a Payment Link:</strong> In your PayPal dashboard, navigate to{' '}
                  <span className="bg-stone-200 px-1.5 py-0.5 rounded font-mono">Payment Links</span> and click <strong>New</strong>.
                </li>
                <li className="leading-relaxed">
                  <strong>Enter Item Name & Price:</strong> For example, type "Minimalist Ceramic Mug" and "$28.00". Click <strong>Create Link</strong>.
                </li>
                <li className="leading-relaxed">
                  <strong>Paste it into your Store:</strong> Copy the link (looks like <code className="bg-stone-200 px-1 py-0.5 rounded">https://buy.paypal.com/abc123xyz</code>) and paste it when adding or editing your product in the <strong>Sell Items</strong> manager.
                </li>
                <li className="leading-relaxed">
                  <strong>Get Paid:</strong> When customers click to pay, PayPal securely accepts their card and automatically deposits the payout into your bank account!
                </li>
              </ol>

              <div className="flex items-center gap-2 text-xs text-stone-500 bg-indigo-50 p-3 rounded-lg border border-indigo-100">
                <Shield className="w-4 h-4 text-[#635BFF] flex-shrink-0" />
                <span>You don't need any backend server code or complex API keys. PayPal Payment Links handle the PCI-compliant checkout pages automatically.</span>
              </div>
            </div>
          )}

          {activeStep === 3 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#0070BA] text-white flex items-center justify-center font-bold text-xs">
                  P
                </div>
                <div>
                  <h4 className="font-bold text-stone-900 text-sm">
                    How to Accept Free PayPal Payments
                  </h4>
                  <p className="text-xs text-stone-500">
                    Buyers can pay with their PayPal balance, linked bank account, or cards.
                  </p>
                </div>
              </div>

              <div className="space-y-3 text-xs text-stone-700 bg-stone-50 p-4 rounded-xl border border-stone-200">
                <div>
                  <h5 className="font-bold text-stone-900 mb-1">Option A: PayPal.Me Link (Easiest)</h5>
                  <p className="text-stone-600 leading-relaxed">
                    1. Go to <a href="https://paypal.me" target="_blank" rel="noreferrer" className="text-[#0070BA] font-semibold underline">paypal.me</a> and claim your free personal or business link (e.g., <code className="bg-stone-200 px-1 rounded">paypal.me/YourStoreName</code>).<br />
                    2. Put your link in Store Settings. Buyers can send payment directly with their order number!
                  </p>
                </div>

                <div className="pt-2 border-t border-stone-200">
                  <h5 className="font-bold text-stone-900 mb-1">Option B: PayPal Payment Buttons</h5>
                  <p className="text-stone-600 leading-relaxed">
                    1. Log into your free PayPal Business account.<br />
                    2. Go to <strong>Pay & Get Paid</strong> &gt; <strong>PayPal Buttons</strong>.<br />
                    3. Choose "Buy Now" or "Smart Button" and copy the checkout link to paste into your product.
                  </p>
                </div>
              </div>

              <div className="p-3 bg-sky-50 rounded-xl border border-sky-100 text-xs text-stone-700">
                <strong>No subscription:</strong> Just like PayPal does not charge any monthly fee. Only standard transaction fees apply when a customer completes an order.
              </div>
            </div>
          )}

          {activeStep === 4 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Globe className="w-6 h-6 text-amber-600" />
                <div>
                  <h4 className="font-bold text-stone-900 text-sm">
                    Your Live Store URL (Already Active!)
                  </h4>
                  <p className="text-xs text-stone-500">
                    Your website is already deployed and live on the web with full HTTPS security.
                  </p>
                </div>
              </div>

              <div className="p-4 bg-stone-900 text-white rounded-xl space-y-2">
                <div className="text-xs text-stone-400 font-semibold uppercase tracking-wider">
                  Your Current Live Store URL
                </div>
                <div className="flex items-center justify-between gap-2 p-2 bg-stone-800 rounded-lg border border-stone-700 font-mono text-xs text-amber-300 break-all">
                  <span>{window.location.href}</span>
                  <button
                    onClick={handleCopy}
                    className="p-1.5 bg-stone-700 hover:bg-stone-600 rounded text-white flex-shrink-0 transition-colors"
                    title="Copy URL"
                  >
                    {copiedUrl ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
                <p className="text-[11px] text-stone-400">
                  Anyone with this link can visit your store, view your catalog, and purchase your items on any mobile phone or desktop browser.
                </p>
              </div>

              <div className="space-y-3 text-xs text-stone-700">
                <h5 className="font-bold text-stone-900 text-sm">Want a Custom Domain like "juuls3dexpress.com"?</h5>
                <p className="text-stone-600">
                  You do not need an expensive Shopify plan ($39/mo) to use your own custom domain. Here is how you can use a custom URL:
                </p>

                <div className="space-y-2.5">
                  <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
                    <div className="font-bold text-stone-900 mb-1">
                      1. Fast Domain Forwarding (Recommended — 2 minutes, ~$9/yr)
                    </div>
                    <p className="text-stone-600 text-[11px] leading-relaxed">
                      Register <strong>juuls3dexpress.com</strong> on Namecheap, Cloudflare, Porkbun, or GoDaddy. Go to your domain dashboard &gt; <em>Domain Redirect / URL Forwarding</em> &gt; paste your store URL above. When anyone types your custom URL, they arrive straight at your 3D print shop!
                    </p>
                  </div>

                  <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
                    <div className="font-bold text-stone-900 mb-1">
                      2. Free Forever Cloud Hosting (Vercel / Cloudflare Pages)
                    </div>
                    <p className="text-stone-600 text-[11px] leading-relaxed">
                      In AI Studio, use <strong>Export to GitHub</strong> or <strong>Export ZIP</strong> from the top-right menu. Connect it to Vercel or Cloudflare Pages for $0/mo hosting, and add your custom domain directly with automated free SSL certificates.
                    </p>
                  </div>

                  <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
                    <div className="font-bold text-stone-900 mb-1">
                      3. Free Social Media Bio Links
                    </div>
                    <p className="text-stone-600 text-[11px] leading-relaxed">
                      Put your current store link directly in your Instagram, TikTok, or YouTube "Link in bio", or create a free Linktree pointing to your Juuls 3D Express store.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-4 sm:p-5 border-t border-stone-200 bg-stone-50 flex items-center justify-between">
          <div className="text-xs text-stone-500">
            Step {activeStep} of 4
          </div>
          <div className="flex gap-2">
            {activeStep > 1 && (
              <button
                onClick={() => setActiveStep((activeStep - 1) as any)}
                className="px-3.5 py-1.5 text-xs font-semibold text-stone-700 hover:text-stone-900 bg-white border border-stone-300 rounded-lg"
              >
                Previous
              </button>
            )}
            {activeStep < 4 ? (
              <button
                onClick={() => setActiveStep((activeStep + 1) as any)}
                className="px-4 py-1.5 text-xs font-bold text-stone-950 bg-amber-500 hover:bg-amber-400 rounded-lg flex items-center gap-1.5"
              >
                <span>Next</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                onClick={() => {
                  onClose();
                  onGoToSettings();
                }}
                className="px-4 py-1.5 text-xs font-bold text-white bg-stone-900 hover:bg-stone-800 rounded-lg flex items-center gap-1.5"
              >
                <span>Go to Store Settings</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
