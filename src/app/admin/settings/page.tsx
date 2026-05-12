"use client";

import { useState } from "react";
import { Settings, User, Bell, Shield, Save, Loader2, Mail, Phone, Lock } from "lucide-react";
import { useToast } from "@/components/admin/ui/Toast";

export default function AdminSettingsPage() {
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");

  const [profile, setProfile] = useState({
    name: "Admin User",
    email: "admin@kaori.com",
    phone: "+91 9876543210",
  });

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      toast("Settings saved successfully", "success");
    }, 1000);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold text-zinc-900">Settings</h1>
        <p className="text-zinc-500 text-sm mt-1">Manage your account and platform configurations.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Sidebar Tabs */}
        <aside className="w-full md:w-64 space-y-1">
          {[
            { id: "profile", label: "Admin Profile", icon: User },
            { id: "platform", label: "Platform Info", icon: Shield },
            { id: "notifications", label: "Notifications", icon: Bell },
            { id: "security", label: "Security", icon: Lock },
          ].map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  activeTab === tab.id 
                    ? "bg-[#D04636] text-white" 
                    : "text-zinc-500 hover:bg-white hover:text-zinc-900"
                }`}
              >
                <Icon size={18} />
                {tab.label}
              </button>
            );
          })}
        </aside>

        {/* Content */}
        <div className="flex-1 space-y-6">
          <div className="bg-white rounded-2xl border border-zinc-200 p-6">
            {activeTab === "profile" && (
              <div className="space-y-6">
                <h2 className="font-bold text-zinc-900">Admin Profile</h2>
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-1.5">Full Name</label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={16} />
                      <input 
                        type="text" 
                        value={profile.name} 
                        onChange={e => setProfile({...profile, name: e.target.value})}
                        className="w-full pl-9 pr-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-sm outline-none focus:bg-white focus:border-[#D04636] transition-all" 
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-1.5">Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={16} />
                      <input 
                        type="email" 
                        value={profile.email} 
                        onChange={e => setProfile({...profile, email: e.target.value})}
                        className="w-full pl-9 pr-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-sm outline-none focus:bg-white focus:border-[#D04636] transition-all" 
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-1.5">Phone Number</label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={16} />
                      <input 
                        type="text" 
                        value={profile.phone} 
                        onChange={e => setProfile({...profile, phone: e.target.value})}
                        className="w-full pl-9 pr-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-sm outline-none focus:bg-white focus:border-[#D04636] transition-all" 
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "platform" && (
              <div className="space-y-6">
                <h2 className="font-bold text-zinc-900">Platform Configurations</h2>
                <div className="space-y-4">
                  <div className="p-4 bg-zinc-50 rounded-xl border border-zinc-200">
                    <p className="text-sm font-semibold text-zinc-900">Local Storage Active</p>
                    <p className="text-xs text-zinc-500 mt-1">All images are currently being stored in the <code>/public/uploads</code> directory.</p>
                  </div>
                  <div className="p-4 bg-zinc-50 rounded-xl border border-zinc-200">
                    <p className="text-sm font-semibold text-zinc-900">Maintenance Mode</p>
                    <p className="text-xs text-zinc-500 mt-1">Platform is currently online and accessible to all users.</p>
                  </div>
                </div>
              </div>
            )}

            {(activeTab === "notifications" || activeTab === "security") && (
              <div className="flex flex-col items-center justify-center py-20 text-center space-y-3">
                <div className="w-12 h-12 bg-zinc-100 rounded-full flex items-center justify-center text-zinc-400">
                  <Settings size={24} />
                </div>
                <div>
                  <p className="font-bold text-zinc-900">Coming Soon</p>
                  <p className="text-sm text-zinc-500">These settings are under development.</p>
                </div>
              </div>
            )}

            <div className="mt-8 pt-6 border-t border-zinc-100 flex justify-end">
              <button 
                onClick={handleSave} 
                disabled={saving}
                className="inline-flex items-center gap-2 bg-[#D04636] text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-[#B83C2D] transition-colors shadow-sm disabled:opacity-50"
              >
                {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                Save Settings
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
