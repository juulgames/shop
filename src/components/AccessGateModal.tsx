import React, { useState } from 'react';
import { 
  Lock, 
  Unlock, 
  MapPin, 
  KeyRound, 
  Navigation, 
  CheckCircle2, 
  AlertCircle, 
  ShieldAlert, 
  ArrowRight, 
  Sparkles,
  Eye,
  EyeOff,
  Building2,
  HelpCircle
} from 'lucide-react';
import { StoreSettings, AccessGateSettings } from '../types';

interface AccessGateModalProps {
  settings: StoreSettings;
  onUnlock: (method: 'password' | 'location', detail?: string) => void;
  onBypassToAdmin: () => void;
}

// Calculate distance between two lat/lng points in kilometers using Haversine formula
function calculateDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
    Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLon / 2) *
    Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}

export const AccessGateModal: React.FC<AccessGateModalProps> = ({
  settings,
  onUnlock,
  onBypassToAdmin,
}) => {
  const gate: AccessGateSettings = settings.accessGate || {
    enabled: true,
    storePassword: 'juuls3dexpress',
    allowLocationAccess: true,
    locationType: 'radius',
    workshopCity: 'Local Delivery & Pickup Zone',
    workshopLat: 52.0,
    workshopLng: 5.0,
    radiusKm: 50,
    allowedPostalCodes: ['1000', '2000'],
    allowedCity: 'Local Service Zone',
    allowedCountry: 'NL',
    headline: 'Private 3D Print Workshop',
    subheadline: 'Access is restricted to authorized customers with a password, or residents within our local service area.',
  };

  const [activeTab, setActiveTab] = useState<'password' | 'location'>('password');
  
  // Password state
  const [passwordInput, setPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  // Location state
  const [isLocating, setIsLocating] = useState(false);
  const [locationStatus, setLocationStatus] = useState<{
    success?: boolean;
    message?: string;
    distanceKm?: number;
  } | null>(null);

  // Postal / City input state
  const [postalInput, setPostalInput] = useState('');
  const [postalError, setPostalError] = useState<string | null>(null);

  // Handle password submit
  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError(null);

    const entered = passwordInput.trim();
    const correct = (gate.storePassword || 'juuls3dexpress').trim();

    if (!entered) {
      setPasswordError('Please enter the store password.');
      return;
    }

    if (entered.toLowerCase() === correct.toLowerCase()) {
      onUnlock('password', 'Verified via store access password');
    } else {
      setPasswordError('Incorrect password. Please verify the code or check with Juuls.');
    }
  };

  // Handle GPS / Geolocation check
  const handleCheckLocation = () => {
    setIsLocating(true);
    setLocationStatus(null);
    setPostalError(null);

    if (!navigator.geolocation) {
      setIsLocating(false);
      setLocationStatus({
        success: false,
        message: 'Geolocation is not supported by your browser. Please enter your postal code or city below instead.',
      });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setIsLocating(false);
        const userLat = position.coords.latitude;
        const userLng = position.coords.longitude;
        
        const dist = calculateDistanceKm(
          userLat,
          userLng,
          gate.workshopLat || 52.0,
          gate.workshopLng || 5.0
        );

        const maxRadius = gate.radiusKm || 50;

        if (dist <= maxRadius) {
          setLocationStatus({
            success: true,
            distanceKm: dist,
            message: `Location verified! You are ${dist} km away (within our ${maxRadius} km service radius).`,
          });
          setTimeout(() => {
            onUnlock('location', `GPS verified (${dist} km from workshop)`);
          }, 1200);
        } else {
          setLocationStatus({
            success: false,
            distanceKm: dist,
            message: `You are currently ${dist} km from our workshop (service radius is ${maxRadius} km). You can still access if you have the store password.`,
          });
        }
      },
      (error) => {
        setIsLocating(false);
        console.warn('Geolocation error:', error);
        setLocationStatus({
          success: false,
          message: 'Could not detect GPS location (permission denied or unavailable). Please verify using your postal code or city below.',
        });
      },
      { timeout: 8000, enableHighAccuracy: false }
    );
  };

  // Handle manual Postal / Zip or City check
  const handlePostalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPostalError(null);

    const inputClean = postalInput.trim().toLowerCase();
    if (!inputClean) {
      setPostalError('Please enter your postal code or city.');
      return;
    }

    const allowedCodes = (gate.allowedPostalCodes || []).map(c => c.trim().toLowerCase());
    const allowedCity = (gate.allowedCity || '').trim().toLowerCase();

    // Check if input matches any postal code prefix or full code, or the city name
    const matchesCode = allowedCodes.some(code => 
      code && (inputClean === code || inputClean.startsWith(code) || code.startsWith(inputClean))
    );
    const matchesCity = allowedCity && (
      inputClean.includes(allowedCity) || allowedCity.includes(inputClean)
    );

    if (matchesCode || matchesCity) {
      setLocationStatus({
        success: true,
        message: `Postal / Area code "${postalInput}" is in our verified local delivery zone!`,
      });
      setTimeout(() => {
        onUnlock('location', `Postal/City verified (${postalInput})`);
      }, 1000);
    } else {
      setPostalError(
        `"${postalInput}" is outside our local zone. Allowed zones include: ${gate.allowedPostalCodes?.slice(0, 4).join(', ')}${gate.allowedCity ? `, ${gate.allowedCity}` : ''}. Or use a password.`
      );
    }
  };

  return (
    <div 
      id="access-gate-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-stone-950/85 backdrop-blur-md overflow-y-auto"
    >
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-stone-200 overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-200">
        {/* Header Ribbon */}
        <div className="bg-gradient-to-r from-stone-900 via-stone-950 to-cyan-950 px-6 py-6 text-white border-b border-stone-800 relative">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400 shadow-inner">
                <Lock className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-mono tracking-widest text-cyan-400 uppercase font-black">
                  Protected Storefront
                </span>
                <h2 className="text-lg sm:text-xl font-black text-white tracking-tight leading-tight">
                  {gate.headline || 'Juuls 3D Express Access'}
                </h2>
              </div>
            </div>

            <span className="px-2.5 py-1 bg-amber-400/20 text-amber-300 border border-amber-400/30 text-[10px] font-black uppercase rounded-full tracking-wider">
              Restricted
            </span>
          </div>

          <p className="mt-2.5 text-xs text-stone-300 leading-relaxed">
            {gate.subheadline || 'This store requires a password or local residency verification to view models and place print orders.'}
          </p>
        </div>

        {/* Tab Switcher: Password vs Location */}
        <div className="flex border-b border-stone-200 bg-stone-50 text-xs font-bold">
          <button
            type="button"
            id="tab-password-unlock"
            onClick={() => setActiveTab('password')}
            className={`flex-1 py-3 px-4 flex items-center justify-center gap-2 border-b-2 transition-all ${
              activeTab === 'password'
                ? 'border-cyan-600 text-cyan-800 bg-white shadow-2xs font-extrabold'
                : 'border-transparent text-stone-500 hover:text-stone-800 hover:bg-stone-100/60'
            }`}
          >
            <KeyRound className="w-4 h-4" />
            <span>Enter Password</span>
          </button>

          {gate.allowLocationAccess !== false && (
            <button
              type="button"
              id="tab-location-unlock"
              onClick={() => setActiveTab('location')}
              className={`flex-1 py-3 px-4 flex items-center justify-center gap-2 border-b-2 transition-all ${
                activeTab === 'location'
                  ? 'border-cyan-600 text-cyan-800 bg-white shadow-2xs font-extrabold'
                  : 'border-transparent text-stone-500 hover:text-stone-800 hover:bg-stone-100/60'
              }`}
            >
              <MapPin className="w-4 h-4 text-rose-500" />
              <span>Verify Local Area</span>
            </button>
          )}
        </div>

        {/* Tab 1: Password Form */}
        {activeTab === 'password' && (
          <form onSubmit={handlePasswordSubmit} className="p-6 space-y-4">
            <div>
              <label className="block text-xs font-bold text-stone-800 mb-1.5 flex items-center justify-between">
                <span>Store Access Password</span>
                <span className="text-[10px] font-normal text-stone-400">Provided by Juuls</span>
              </label>

              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="gate-password-input"
                  value={passwordInput}
                  onChange={(e) => {
                    setPasswordInput(e.target.value);
                    if (passwordError) setPasswordError(null);
                  }}
                  placeholder="Enter access code..."
                  autoFocus
                  className="w-full pl-3.5 pr-10 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-sm font-medium text-stone-900 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:bg-white transition-all shadow-2xs"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {passwordError && (
                <div className="mt-2 flex items-center gap-1.5 text-xs text-rose-600 font-medium animate-in fade-in">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{passwordError}</span>
                </div>
              )}
            </div>

            <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 text-[11px] text-stone-500 space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-stone-700">
                <Lock className="w-3.5 h-3.5 text-cyan-600" />
                <span>Private Access Notice</span>
              </div>
              <p>
                Please enter the passcode provided directly by the workshop administrator. If you do not have a passcode, verify your local delivery zone using the tab above.
              </p>
            </div>

            <button
              type="submit"
              id="submit-gate-password"
              className="w-full py-3 bg-stone-950 hover:bg-stone-800 text-white rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 shadow-md hover:shadow-lg cursor-pointer"
            >
              <Unlock className="w-4 h-4 text-cyan-400" />
              <span>Unlock Website</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        {/* Tab 2: Location Verification */}
        {activeTab === 'location' && (
          <div className="p-6 space-y-4">
            <div className="text-center space-y-1">
              <div className="w-12 h-12 rounded-full bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center mx-auto shadow-xs">
                <MapPin className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-stone-900 text-sm">
                Local Residency &amp; Service Radius
              </h3>
              <p className="text-xs text-stone-500 max-w-sm mx-auto">
                Live in our service area? You can automatically unlock the store without a password.
              </p>
            </div>

            {/* GPS Radius Check Button */}
            <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-stone-700 flex items-center gap-1.5">
                  <Navigation className="w-3.5 h-3.5 text-cyan-600" />
                  <span>Automatic GPS Geolocation</span>
                </span>
                <span className="text-[10px] font-mono text-cyan-800 bg-cyan-100 font-bold px-2 py-0.5 rounded">
                  Within {gate.radiusKm || 50} km
                </span>
              </div>

              <p className="text-[11px] text-stone-500">
                Tap to check if your browser location is within {gate.radiusKm || 50} km of our 3D print workshop ({gate.workshopCity || 'Local Workshop'}).
              </p>

              <button
                type="button"
                id="btn-check-gps-location"
                onClick={handleCheckLocation}
                disabled={isLocating}
                className="w-full py-2.5 bg-cyan-700 hover:bg-cyan-800 disabled:opacity-50 text-white rounded-lg font-bold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                {isLocating ? (
                  <>
                    <span className="animate-spin w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full" />
                    <span>Detecting distance...</span>
                  </>
                ) : (
                  <>
                    <Navigation className="w-3.5 h-3.5" />
                    <span>Check My Current Location</span>
                  </>
                )}
              </button>
            </div>

            {/* Feedback alert from GPS check */}
            {locationStatus && (
              <div
                className={`p-3 rounded-xl border text-xs flex items-start gap-2 animate-in fade-in ${
                  locationStatus.success
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                    : 'bg-amber-50 border-amber-200 text-amber-900'
                }`}
              >
                {locationStatus.success ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                )}
                <div>
                  <p className="font-bold">
                    {locationStatus.success ? 'Access Granted!' : 'Verification Notice'}
                  </p>
                  <p className="text-[11px] mt-0.5 leading-relaxed">{locationStatus.message}</p>
                </div>
              </div>
            )}

            {/* Manual Postal / Zip / City verification */}
            <form onSubmit={handlePostalSubmit} className="pt-2 border-t border-stone-200 space-y-2">
              <label className="block text-xs font-bold text-stone-700">
                Or Verify via Postal Code / City:
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  id="gate-postal-input"
                  value={postalInput}
                  onChange={(e) => {
                    setPostalInput(e.target.value);
                    if (postalError) setPostalError(null);
                  }}
                  placeholder="e.g. 1000 or 90210 or Your City"
                  className="flex-1 px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg text-xs font-medium text-stone-900 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
                <button
                  type="submit"
                  id="submit-gate-postal"
                  className="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-lg text-xs font-bold transition-colors shrink-0"
                >
                  Verify
                </button>
              </div>

              {postalError && (
                <div className="text-[11px] text-rose-600 font-medium flex items-center gap-1.5 mt-1">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{postalError}</span>
                </div>
              )}

              <div className="text-[10px] text-stone-400">
                Postal codes or city names within the service area are verified against active workshop delivery zones.
              </div>
            </form>
          </div>
        )}

        {/* Footer / Workshop Admin Owner Bypass */}
        <div className="px-6 py-3.5 bg-stone-100/80 border-t border-stone-200 flex items-center justify-between text-xs text-stone-500">
          <div className="flex items-center gap-1.5">
            <Building2 className="w-3.5 h-3.5 text-stone-400" />
            <span>Workshop Owner?</span>
          </div>

          <button
            type="button"
            id="owner-admin-bypass"
            onClick={onBypassToAdmin}
            className="font-bold text-cyan-800 hover:text-stone-950 underline transition-colors cursor-pointer"
          >
            Switch to Workshop Admin →
          </button>
        </div>
      </div>
    </div>
  );
};
