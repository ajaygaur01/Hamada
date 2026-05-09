import { CheckCircle2, AlertTriangle, Loader2 } from "lucide-react";
import type { UserProfile } from "../AccountPageClient";
import { useState } from "react";

interface ProfileSectionProps {
  profile: UserProfile;
  setProfile: React.Dispatch<React.SetStateAction<UserProfile>>;
  saveProfile: (event: React.FormEvent<HTMLFormElement>) => Promise<void>;
  savingProfile: boolean;
  message: string;
  error: string;
}

export default function ProfileSection({
  profile,
  setProfile,
  saveProfile,
  savingProfile,
  message,
  error
}: ProfileSectionProps) {
  const [showToast, setShowToast] = useState(false);

  // Wrap saveProfile to show toast on success
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    await saveProfile(e);
    if (!error) {
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300 relative">
      {/* Success Toast */}
      {showToast && message && (
        <div className="absolute top-0 right-0 bg-brand-green text-white px-4 py-2 rounded-md shadow-lg text-sm font-medium animate-in slide-in-from-top-2">
          {message}
        </div>
      )}

      <div>
        <h2 className="font-heading text-2xl text-zinc-900 mb-6">My Profile</h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-zinc-200 p-6 shadow-sm space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-zinc-700">Full Name</label>
                  <input
                    type="text"
                    value={profile.username}
                    onChange={(e) => setProfile(prev => ({ ...prev, username: e.target.value }))}
                    className="w-full px-4 py-2.5 rounded-lg border border-zinc-300 focus:border-brand-green focus:ring-1 focus:ring-brand-green outline-none transition-all text-sm"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-zinc-700">Email Address</label>
                  <input
                    type="email"
                    value={profile.email}
                    readOnly
                    className="w-full px-4 py-2.5 rounded-lg border border-zinc-200 bg-zinc-50 text-zinc-500 cursor-not-allowed outline-none text-sm"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-zinc-700">Phone Number</label>
                  <input
                    type="tel"
                    value={profile.phone}
                    onChange={(e) => setProfile(prev => ({ ...prev, phone: e.target.value }))}
                    className="w-full px-4 py-2.5 rounded-lg border border-zinc-300 focus:border-brand-green focus:ring-1 focus:ring-brand-green outline-none transition-all text-sm"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-zinc-700">Company Name</label>
                  <input
                    type="text"
                    value="Kaori B2B Client" // Placeholder, should come from profile if available
                    readOnly={profile.gstin_verified}
                    className={`w-full px-4 py-2.5 rounded-lg border text-sm outline-none transition-all ${
                      profile.gstin_verified 
                        ? 'border-zinc-200 bg-zinc-50 text-zinc-500 cursor-not-allowed' 
                        : 'border-zinc-300 focus:border-brand-green focus:ring-1 focus:ring-brand-green'
                    }`}
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-medium text-zinc-700">GSTIN</label>
                  <input
                    type="text"
                    value="29ABCDE1234F1Z5" // Placeholder
                    readOnly={profile.gstin_verified}
                    className={`w-full px-4 py-2.5 rounded-lg border text-sm outline-none transition-all ${
                      profile.gstin_verified 
                        ? 'border-zinc-200 bg-zinc-50 text-zinc-500 cursor-not-allowed' 
                        : 'border-zinc-300 focus:border-brand-green focus:ring-1 focus:ring-brand-green'
                    }`}
                  />
                </div>
              </div>

              {error && <p className="text-sm text-red-600 bg-red-50 p-3 rounded-md">{error}</p>}

              <div className="pt-4 border-t border-zinc-100 flex justify-end">
                <button
                  type="submit"
                  disabled={savingProfile}
                  className="bg-[#D04636] text-white px-6 py-2.5 rounded-lg font-medium hover:bg-[#B83C2D] transition-colors flex items-center gap-2 disabled:opacity-70"
                >
                  {savingProfile && <Loader2 size={16} className="animate-spin" />}
                  {savingProfile ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>

            <div className="mt-8 bg-white rounded-xl border border-zinc-200 p-6 shadow-sm">
              <h3 className="text-lg font-bold text-zinc-900 mb-4">Change Password</h3>
              <form className="space-y-4 max-w-md">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-zinc-700">Current Password</label>
                  <input type="password" placeholder="••••••••" className="w-full px-4 py-2.5 rounded-lg border border-zinc-300 focus:border-brand-green outline-none text-sm" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-zinc-700">New Password</label>
                  <input type="password" placeholder="••••••••" className="w-full px-4 py-2.5 rounded-lg border border-zinc-300 focus:border-brand-green outline-none text-sm" />
                </div>
                <button type="button" className="px-6 py-2 border border-zinc-300 text-zinc-700 rounded-lg font-medium hover:bg-zinc-50 transition-colors text-sm">
                  Update Password
                </button>
              </form>
            </div>
          </div>

          <div className="lg:col-span-1">
            {profile.gstin_verified ? (
              <div className="bg-[#4E3D33] border border-[#3e3028] rounded-xl p-6 shadow-sm flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-[#3e3028] text-[#D04636] rounded-full flex items-center justify-center mb-4 shadow-sm">
                  <CheckCircle2 size={32} />
                </div>
                <h3 className="text-lg font-bold text-white mb-1">Verified Wholesale Buyer</h3>
                <p className="text-sm text-[#E7DDC1]/80 mb-6">Your business details are verified.</p>
                
                <div className="w-full bg-[#3e3028] rounded-lg p-4 text-left border border-[#3e3028] space-y-3">
                  <div>
                    <p className="text-xs text-[#E7DDC1]/60 uppercase font-semibold tracking-wider">Company</p>
                    <p className="font-medium text-white text-sm">Kaori B2B Client</p>
                  </div>
                  <div>
                    <p className="text-xs text-[#E7DDC1]/60 uppercase font-semibold tracking-wider">GSTIN</p>
                    <p className="font-medium text-white text-sm">29ABCDE1234F1Z5</p>
                  </div>
                  <div>
                    <p className="text-xs text-[#E7DDC1]/60 uppercase font-semibold tracking-wider">Verified Since</p>
                    <p className="font-medium text-white text-sm">Oct 2023</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 shadow-sm flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mb-4 shadow-sm">
                  <AlertTriangle size={32} />
                </div>
                <h3 className="text-lg font-bold text-amber-800 mb-2">Unverified Account</h3>
                <p className="text-sm text-amber-700 mb-6">Verify your business to place bulk orders and access wholesale pricing.</p>
                
                <button className="w-full bg-[#D04636] text-white py-2.5 rounded-lg font-medium hover:bg-[#B83C2D] transition-colors shadow-sm">
                  Verify Now
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
