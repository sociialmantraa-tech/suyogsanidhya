import React, { useEffect, useState } from 'react';
import { adminApi } from '../utils/api';
import { Save } from 'lucide-react';

export default function Settings() {
  const [loading, setLoading] = useState(true);
  const [siteName, setSiteName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [address, setAddress] = useState('');
  const [hours, setHours] = useState('');
  
  const [linkedin, setLinkedin] = useState('');
  const [twitter, setTwitter] = useState('');
  const [youtube, setYoutube] = useState('');

  const [razorpayKey, setRazorpayKey] = useState('');
  const [taxPercent, setTaxPercent] = useState('18.00');

  const [apiMsg, setApiMsg] = useState('');

  useEffect(() => {
    adminApi.get('/admin/settings.php')
      .then(res => {
        if (res && res.settings) {
          const list = res.settings;
          const getValue = (key) => list.find(s => s.setting_key === key)?.setting_value || '';
          
          setSiteName(getValue('site_name'));
          setEmail(getValue('contact_email'));
          setPhone(getValue('contact_phone'));
          setWhatsapp(getValue('contact_whatsapp'));
          setAddress(getValue('contact_address'));
          setHours(getValue('business_hours'));
          
          setLinkedin(getValue('social_linkedin'));
          setTwitter(getValue('social_twitter'));
          setYoutube(getValue('social_youtube'));
          
          setRazorpayKey(getValue('razorpay_key_id'));
          setTaxPercent(getValue('tax_rate_percent'));
        }
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const handleSettingsSubmit = async (e) => {
    e.preventDefault();
    setApiMsg('Saving settings config...');

    const payload = {
      settings: [
        { key: 'site_name', value: siteName },
        { key: 'contact_email', value: email },
        { key: 'contact_phone', value: phone },
        { key: 'contact_whatsapp', value: whatsapp },
        { key: 'contact_address', value: address },
        { key: 'business_hours', value: hours },
        { key: 'social_linkedin', value: linkedin },
        { key: 'social_twitter', value: twitter },
        { key: 'social_youtube', value: youtube },
        { key: 'razorpay_key_id', value: razorpayKey },
        { key: 'tax_rate_percent', value: taxPercent }
      ]
    };

    try {
      const response = await adminApi.post('/admin/settings.php', payload);
      if (response && response.success) {
        setApiMsg('Site settings updated successfully!');
      } else {
        throw new Error(response.error || "Failed to update settings.");
      }
    } catch (err) {
      setApiMsg(`Error: ${err.message}`);
    }
  };

  if (loading) {
    return <div className="text-center py-20 text-xs text-gray-500 font-sans">Loading configurations...</div>;
  }

  return (
    <div className="max-w-4xl bg-white border border-gray-200 p-8 shadow-sm font-sans text-xs text-gray-600">
      
      <div className="border-b border-gray-200 pb-4 mb-6">
        <h3 className="font-serif text-lg font-bold text-gray-800">Global Website Configuration</h3>
        <p className="text-[10px] text-gray-400 mt-1">Manage public brand descriptions, communication coordinates, and Razorpay API credentials.</p>
      </div>

      {apiMsg && (
        <div className="bg-blue-50 border-l-4 border-blue-500 text-blue-700 p-3 text-xs mb-6">
          {apiMsg}
        </div>
      )}

      <form onSubmit={handleSettingsSubmit} className="space-y-6">
        
        {/* Section: General Info */}
        <div className="space-y-4">
          <h4 className="text-sm font-bold uppercase tracking-wider text-darkCyan border-b border-gray-100 pb-2">1. General Information</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="font-bold uppercase tracking-wider">Site Brand Name</label>
              <input 
                type="text" 
                value={siteName} 
                onChange={(e) => setSiteName(e.target.value)}
                className="w-full border border-gray-300 rounded p-2.5 text-xs focus:border-darkCyan focus:outline-none"
              />
            </div>
            <div className="space-y-1">
              <label className="font-bold uppercase tracking-wider">Support/Contact Email</label>
              <input 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-gray-300 rounded p-2.5 text-xs focus:border-darkCyan focus:outline-none"
              />
            </div>
            <div className="space-y-1">
              <label className="font-bold uppercase tracking-wider">Contact Phone</label>
              <input 
                type="text" 
                value={phone} 
                onChange={(e) => setPhone(e.target.value)}
                className="w-full border border-gray-300 rounded p-2.5 text-xs focus:border-darkCyan focus:outline-none"
              />
            </div>
            <div className="space-y-1">
              <label className="font-bold uppercase tracking-wider">WhatsApp Number</label>
              <input 
                type="text" 
                value={whatsapp} 
                onChange={(e) => setWhatsapp(e.target.value)}
                className="w-full border border-gray-300 rounded p-2.5 text-xs focus:border-darkCyan focus:outline-none"
              />
            </div>
            <div className="space-y-1 md:col-span-2">
              <label className="font-bold uppercase tracking-wider">Office Address</label>
              <input 
                type="text" 
                value={address} 
                onChange={(e) => setAddress(e.target.value)}
                className="w-full border border-gray-300 rounded p-2.5 text-xs focus:border-darkCyan focus:outline-none"
              />
            </div>
            <div className="space-y-1 md:col-span-2">
              <label className="font-bold uppercase tracking-wider">Business Operating Hours</label>
              <input 
                type="text" 
                value={hours} 
                onChange={(e) => setHours(e.target.value)}
                className="w-full border border-gray-300 rounded p-2.5 text-xs focus:border-darkCyan focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Section: Social */}
        <div className="space-y-4 pt-4">
          <h4 className="text-sm font-bold uppercase tracking-wider text-darkCyan border-b border-gray-100 pb-2">2. Social Links</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="font-bold uppercase tracking-wider">LinkedIn URL</label>
              <input 
                type="text" 
                value={linkedin} 
                onChange={(e) => setLinkedin(e.target.value)}
                className="w-full border border-gray-300 rounded p-2.5 text-xs focus:border-darkCyan focus:outline-none"
              />
            </div>
            <div className="space-y-1">
              <label className="font-bold uppercase tracking-wider">Twitter URL</label>
              <input 
                type="text" 
                value={twitter} 
                onChange={(e) => setTwitter(e.target.value)}
                className="w-full border border-gray-300 rounded p-2.5 text-xs focus:border-darkCyan focus:outline-none"
              />
            </div>
            <div className="space-y-1">
              <label className="font-bold uppercase tracking-wider">YouTube Channel</label>
              <input 
                type="text" 
                value={youtube} 
                onChange={(e) => setYoutube(e.target.value)}
                className="w-full border border-gray-300 rounded p-2.5 text-xs focus:border-darkCyan focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Section: Financials */}
        <div className="space-y-4 pt-4">
          <h4 className="text-sm font-bold uppercase tracking-wider text-darkCyan border-b border-gray-100 pb-2">3. Payment & Taxes</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="font-bold uppercase tracking-wider">Razorpay Public Key ID</label>
              <input 
                type="text" 
                value={razorpayKey} 
                onChange={(e) => setRazorpayKey(e.target.value)}
                className="w-full border border-gray-300 rounded p-2.5 text-xs focus:border-darkCyan focus:outline-none"
              />
            </div>
            <div className="space-y-1">
              <label className="font-bold uppercase tracking-wider">Tax Rate (%)</label>
              <input 
                type="text" 
                value={taxPercent} 
                onChange={(e) => setTaxPercent(e.target.value)}
                className="w-full border border-gray-300 rounded p-2.5 text-xs focus:border-darkCyan focus:outline-none"
              />
            </div>
          </div>
        </div>

        <div className="pt-4">
          <button 
            type="submit" 
            className="btn-primary py-3 px-8 text-xs flex items-center gap-2"
          >
            <Save className="w-4 h-4" /> Save Configuration Settings
          </button>
        </div>

      </form>
    </div>
  );
}
