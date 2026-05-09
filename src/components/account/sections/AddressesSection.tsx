import { useState } from "react";
import { Plus, MapPin, Edit2, Trash2 } from "lucide-react";

// Mock Address Type
type Address = {
  id: string;
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  pincode: string;
  isDefault: boolean;
};

const mockAddresses: Address[] = [
  {
    id: "1",
    fullName: "John Doe",
    phone: "+91 9876543210",
    addressLine1: "123 Business Park, Phase 1",
    addressLine2: "Industrial Area",
    city: "Mumbai",
    state: "Maharashtra",
    pincode: "400001",
    isDefault: true,
  }
];

export default function AddressesSection() {
  const [addresses, setAddresses] = useState<Address[]>(mockAddresses);
  const [showForm, setShowForm] = useState(false);

  // Simplified form state for UI demo
  const [formData, setFormData] = useState({
    fullName: "", phone: "", addressLine1: "", addressLine2: "", city: "", state: "", pincode: "", isDefault: false
  });

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this address?")) {
      setAddresses(addresses.filter(a => a.id !== id));
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex items-center justify-between">
        <h2 className="font-heading text-2xl text-zinc-900">Saved Addresses</h2>
        {!showForm && (
          <button 
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 bg-brand-green text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#3f5226] transition-colors"
          >
            <Plus size={16} /> Add New Address
          </button>
        )}
      </div>

      {showForm && (
        <div className="bg-white rounded-xl border border-zinc-200 p-6 shadow-sm animate-in slide-in-from-top-4">
          <h3 className="text-lg font-bold text-zinc-900 mb-4">Add New Address</h3>
          <form className="space-y-4" onSubmit={(e) => {
            e.preventDefault();
            setAddresses([...addresses, { ...formData, id: Date.now().toString() } as Address]);
            setShowForm(false);
          }}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-zinc-700">Full Name</label>
                <input required type="text" className="w-full px-3 py-2 rounded-md border border-zinc-300 focus:border-brand-green outline-none text-sm" value={formData.fullName} onChange={e => setFormData({...formData, fullName: e.target.value})} />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-zinc-700">Phone</label>
                <input required type="tel" className="w-full px-3 py-2 rounded-md border border-zinc-300 focus:border-brand-green outline-none text-sm" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
              </div>
              <div className="space-y-1.5 md:col-span-2">
                <label className="text-sm font-medium text-zinc-700">Address Line 1</label>
                <input required type="text" className="w-full px-3 py-2 rounded-md border border-zinc-300 focus:border-brand-green outline-none text-sm" value={formData.addressLine1} onChange={e => setFormData({...formData, addressLine1: e.target.value})} />
              </div>
              <div className="space-y-1.5 md:col-span-2">
                <label className="text-sm font-medium text-zinc-700">Address Line 2 (Optional)</label>
                <input type="text" className="w-full px-3 py-2 rounded-md border border-zinc-300 focus:border-brand-green outline-none text-sm" value={formData.addressLine2} onChange={e => setFormData({...formData, addressLine2: e.target.value})} />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-zinc-700">City</label>
                <input required type="text" className="w-full px-3 py-2 rounded-md border border-zinc-300 focus:border-brand-green outline-none text-sm" value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-zinc-700">State</label>
                <select required className="w-full px-3 py-2 rounded-md border border-zinc-300 focus:border-brand-green outline-none text-sm" value={formData.state} onChange={e => setFormData({...formData, state: e.target.value})}>
                  <option value="">Select State</option>
                  <option value="Maharashtra">Maharashtra</option>
                  <option value="Karnataka">Karnataka</option>
                  <option value="Delhi">Delhi</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-zinc-700">Pincode</label>
                <input required type="text" className="w-full px-3 py-2 rounded-md border border-zinc-300 focus:border-brand-green outline-none text-sm" value={formData.pincode} onChange={e => setFormData({...formData, pincode: e.target.value})} />
              </div>
            </div>
            <div className="flex items-center gap-2 pt-2">
              <input type="checkbox" id="isDefault" className="rounded border-zinc-300 text-brand-green focus:ring-brand-green" checked={formData.isDefault} onChange={e => setFormData({...formData, isDefault: e.target.checked})} />
              <label htmlFor="isDefault" className="text-sm text-zinc-700">Set as default address</label>
            </div>
            <div className="flex justify-end gap-3 pt-4">
              <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 text-sm font-medium text-zinc-600 hover:text-zinc-900">Cancel</button>
              <button type="submit" className="px-6 py-2 bg-[#D04636] text-white rounded-md text-sm font-medium hover:bg-[#B83C2D]">Save Address</button>
            </div>
          </form>
        </div>
      )}

      {!showForm && addresses.length === 0 ? (
        <div className="bg-white rounded-xl border border-zinc-200 p-12 flex flex-col items-center justify-center text-center shadow-sm">
          <div className="w-24 h-24 bg-brand-cream rounded-full flex items-center justify-center mb-6 text-brand-green">
            <MapPin size={48} strokeWidth={1.5} />
          </div>
          <h3 className="text-lg font-bold text-zinc-900 mb-2">No saved addresses</h3>
          <p className="text-zinc-500 max-w-sm mb-6">Add an address so you can easily select it during checkout.</p>
          <button onClick={() => setShowForm(true)} className="bg-brand-green text-white px-6 py-2.5 rounded-lg font-medium hover:bg-[#3f5226] transition-colors">
            Add Address
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {addresses.map((address) => (
            <div key={address.id} className={`bg-white rounded-xl border ${address.isDefault ? 'border-brand-green bg-[#fcfdfa]' : 'border-zinc-200'} p-5 shadow-sm relative group`}>
              {address.isDefault && (
                <span className="absolute top-5 right-5 bg-brand-green text-white text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded">Default</span>
              )}
              <h3 className="font-bold text-zinc-900 mb-1">{address.fullName}</h3>
              <p className="text-sm text-zinc-600 leading-relaxed mb-4">
                {address.addressLine1}<br/>
                {address.addressLine2 && <>{address.addressLine2}<br/></>}
                {address.city}, {address.state} {address.pincode}<br/>
                India<br/>
                Phone: {address.phone}
              </p>
              
              <div className="flex items-center gap-3 pt-4 border-t border-zinc-100">
                <button className="flex items-center gap-1 text-sm font-medium text-brand-green hover:underline">
                  <Edit2 size={14} /> Edit
                </button>
                <button onClick={() => handleDelete(address.id)} className="flex items-center gap-1 text-sm font-medium text-red-600 hover:underline">
                  <Trash2 size={14} /> Delete
                </button>
                {!address.isDefault && (
                  <button className="text-sm font-medium text-zinc-500 hover:text-zinc-900 ml-auto">
                    Set as Default
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
