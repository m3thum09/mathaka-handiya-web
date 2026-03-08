import { useState, type ChangeEvent, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { db, storage } from '../lib/firebase';
import { collection, addDoc, serverTimestamp, query, where, getDocs, limit } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import emailjs from '@emailjs/browser';

const PRICING = { STUDENT: 1000, STAFF: 2000 };
const BANK_INFO = {
  BANK: import.meta.env.VITE_BANK_NAME,
  HOLDER: import.meta.env.VITE_BANK_HOLDER,
  ACC_NO: import.meta.env.VITE_BANK_ACC_NO,
};

interface ReservationData {
  name: string; email: string; whatsapp: string; otp: string; userType: 'student' | 'staff' | '';
}

export const ReservationForm = ({ onClose }: { onClose: () => void }) => {
  // 'true' to stop ticket sales, 'false' to reopen
  const isSoldOut = true;
  const [step, setStep] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [generatedOtp, setGeneratedOtp] = useState<string>('');
  const [file, setFile] = useState<File | null>(null);
  const [formData, setFormData] = useState<ReservationData>({ 
    name: '', email: '', whatsapp: '', otp: '', userType: '' 
  });

  // Security Layer 1: Prevent Background Interaction
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = 'unset'; };
  }, []);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected && selected.size < 10 * 1024 * 1024) { // 10Mb file size
      const allowed = ['image/jpeg', 'image/png', 'application/pdf', 'image/heic', 'image/heif'];
      const fileExtension = selected.name.split('.').pop()?.toLowerCase();
      const isAllowedExt = ['jpg', 'jpeg', 'png', 'pdf', 'heic', 'heif'].includes(fileExtension || '');

      if (allowed.includes(selected.type) || isAllowedExt) {
        setFile(selected);
      } else {
        alert("Only JPG, PNG, PDF or HEIC files are allowed.");
      }
    } else if (selected) {
      alert("File too large (Max 10MB)");
    }
  };

  const handleSendOTP = async () => {
    emailjs.init(import.meta.env.VITE_EMAILJS_PUBLIC_KEY);
    const lowerEmail = formData.email.toLowerCase().trim();
    const isCampusMail = lowerEmail.endsWith("@sltc.ac.lk") || lowerEmail.endsWith("@sltc.edu.lk");
    if (!isCampusMail) return alert("⚠️ Please use your official SLTC campus email address.");
    if (!formData.name || !formData.whatsapp || !formData.userType) return alert("Please fill all details.");

    setLoading(true);
    try {
      const q = query(collection(db, "reservations"), where("email", "==", lowerEmail), limit(1));
      const snap = await getDocs(q);
      if (!snap.empty) { alert("⚠️ Already reserved with this email."); setLoading(false); return; }

      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      setGeneratedOtp(otp);
      await emailjs.send(import.meta.env.VITE_EMAILJS_SERVICE_ID, import.meta.env.VITE_EMAILJS_TEMPLATE_ID, 
        { to_name: formData.name, to_email: lowerEmail, otp: otp }, import.meta.env.VITE_EMAILJS_PUBLIC_KEY);
      setStep(2);
    } catch { alert("Error sending OTP."); } finally { setLoading(false); }
  };

  const handleSubmit = async () => {
    if (!file) return alert("Please upload the payment slip.");
    setLoading(true);
    try {
      const storageRef = ref(storage, `receipts/${Date.now()}_${file.name}`);
      const uploadTask = await uploadBytes(storageRef, file);
      const url = await getDownloadURL(uploadTask.ref);
      
      const finalAmount = formData.userType === 'staff' ? PRICING.STAFF : PRICING.STUDENT;

      // Fixed Unique Ticket ID Solution
      let uniqueTicketId = "";
      let isIdUnique = false;

      // Keep trying until a new ID that doesn't exist in the system is found
      while (!isIdUnique) {
        // Create a longer ID using the timestamp and 3 random characters to ensure uniqueness even under high load
        const timestampPart = Date.now().toString().slice(-4);
        const randomPart = Math.random().toString(36).substring(2, 5).toUpperCase();
        uniqueTicketId = `MH-${timestampPart}${randomPart}`;

        // Check if this ID is already in use in Firestore
        const idCheckQuery = query(collection(db, "reservations"), where("ticketId", "==", uniqueTicketId), limit(1));
        const idCheckSnap = await getDocs(idCheckQuery);
        
        if (idCheckSnap.empty) {
          isIdUnique = true;
        }
      }

      await addDoc(collection(db, "reservations"), {
        ticketId: uniqueTicketId, // 100% unique ID
        name: formData.name,
        email: formData.email.toLowerCase().trim(),
        whatsapp: formData.whatsapp,
        userType: formData.userType,
        amount: finalAmount,
        ticketCount: 1,
        receiptUrl: url,
        status: "pending",
        createdAt: serverTimestamp(),
      });
      setStep(4);
    } catch { alert("Failed to save. Check storage/rules."); } finally { setLoading(false); }
  };

  // Sold Out UI
  if (isSoldOut) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} 
        className="fixed inset-0 z-[500] flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl touch-none"
      >
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
          className="bg-[#121212] border border-white/10 p-10 rounded-[2.5rem] w-full max-w-sm shadow-2xl relative text-center"
        >
          <button onClick={onClose} aria-label="Close" className="absolute top-6 right-6 text-white/20 hover:text-white p-2">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 6L6 18M6 6l12 12" /></svg>
          </button>

          <div className="w-16 h-16 bg-[#b19eef]/10 text-[#b19eef] rounded-full flex items-center justify-center mx-auto mb-6">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18.36 6.64a9 9 0 1 1-12.73 0"/><line x1="12" y1="2" x2="12" y2="12"/></svg>
          </div>
          
          <h2 className="text-2xl font-bold mb-2 text-white uppercase tracking-tighter">Sold Out</h2>
          <p className="text-white/40 text-[11px] mb-8 leading-relaxed uppercase tracking-widest">
            Online reservations for <br/> <span className="text-[#b19eef]">Mathaka Handiya</span> are now closed.
          </p>
          
          <button onClick={onClose} className="w-full bg-white/5 border border-white/10 text-white/60 font-black py-4 rounded-2xl active:scale-95 transition-all text-[10px] uppercase tracking-widest">
            Close Portal
          </button>
        </motion.div>
      </motion.div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} 
      className="fixed inset-0 z-[500] flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl touch-none"
    >
      <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="bg-[#121212] border border-white/10 p-8 rounded-[2.5rem] w-full max-w-md shadow-2xl relative max-h-[90vh] overflow-y-auto no-scrollbar pointer-events-auto"
      >
        <button onClick={onClose} title="Close form" aria-label="Close" className="absolute top-6 right-6 text-white/20 hover:text-white p-2">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 6L6 18M6 6l12 12" /></svg>
        </button>

        <AnimatePresence mode="wait">
          {step === 1 && (
            // Step 1: User Details & Category Selection
            <motion.div key="s1" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }}>
              <h2 className="text-l font-bold mb-1 text-white">Registration</h2>
              <p className="text-white/40 text-[10px] mb-8 uppercase tracking-widest">Select Category & Details</p>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3 mb-2">
                  <button onClick={() => setFormData({...formData, userType: 'student'})} className={`p-4 rounded-2xl border text-left transition-all ${formData.userType === 'student' ? 'border-[#b19eef] bg-[#b19eef]/10' : 'border-white/5 bg-white/5 opacity-40'}`}>
                    <span className="block text-[10px] font-bold text-[#b19eef] uppercase tracking-widest">Student</span>
                    <span className="text-white font-bold text-xs">LKR {PRICING.STUDENT}</span>
                  </button>
                  <button onClick={() => setFormData({...formData, userType: 'staff'})} className={`p-4 rounded-2xl border text-left transition-all ${formData.userType === 'staff' ? 'border-[#b19eef] bg-[#b19eef]/10' : 'border-white/5 bg-white/5 opacity-40'}`}>
                    <span className="block text-[10px] font-bold text-[#b19eef] uppercase tracking-widest">Staff</span>
                    <span className="text-white font-bold text-xs">LKR {PRICING.STAFF}</span>
                  </button>
                </div>
                <input type="text" placeholder="Full Name" className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl outline-none focus:border-[#b19eef]/50 text-white" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
                <input type="email" placeholder="Campus Email" className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl outline-none focus:border-[#b19eef]/50 text-white" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} />
                <input type="tel" placeholder="WhatsApp Number" className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl outline-none focus:border-[#b19eef]/50 text-white" value={formData.whatsapp} onChange={(e) => setFormData({...formData, whatsapp: e.target.value})} />
                <button onClick={handleSendOTP} disabled={loading || !formData.userType} className="w-full bg-[#b19eef] text-black font-black py-5 rounded-2xl mt-4 active:scale-95 disabled:opacity-30 uppercase text-xs tracking-widest">{loading ? "Verifying..." : "Send OTP Code"}</button>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            // Step 2: OTP Verification
            <motion.div key="s2" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="text-center py-4">
              <h2 className="text-xl font-bold mb-2 text-white">Check Your Inbox</h2>
              <p className="text-white/40 text-[11px] mb-8 px-4 leading-relaxed">We've sent a 6-digit code to your campus email address.</p>
              <input type="text" placeholder="••••••" maxLength={6} className="w-full bg-white/5 border border-white/10 p-6 rounded-2xl text-center text-4xl tracking-[0.4em] outline-none font-mono focus:border-[#b19eef]/50 text-white mb-8" onChange={(e) => setFormData({...formData, otp: e.target.value})} />
              <button onClick={() => formData.otp === generatedOtp ? setStep(3) : alert("Invalid OTP")} className="w-full bg-[#b19eef] text-black font-black py-5 rounded-2xl active:scale-95 disabled:opacity-30 uppercase text-xs tracking-widest">Verify & Proceed</button>
            </motion.div>
          )}

          {step === 3 && (
            // Step 3: Bank Transfer Instructions & Receipt Upload
            <motion.div key="s3" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }}>
              <h2 className="text-xl font-bold mb-6 text-white">Bank Transfer</h2>
              <div className="bg-white/5 border border-white/10 p-5 rounded-3xl mb-4 space-y-2.5">
                <p className="text-[#b19eef] text-sm font-bold uppercase tracking-tighter">{BANK_INFO.BANK}</p>
                <p className="text-white/90 text-[13px] font-bold">{BANK_INFO.HOLDER}</p>
                <p className="text-white/50 font-mono text-sm tracking-widest">{BANK_INFO.ACC_NO}</p>
                <div className="pt-2 border-t border-white/5 flex justify-between items-center">
                  <span className="text-white/40 text-[10px] uppercase font-bold">Total</span>
                  <span className="text-white font-bold text-M">LKR {formData.userType === 'staff' ? PRICING.STAFF : PRICING.STUDENT}</span>
                </div>
              </div>

              <div className="bg-[#b19eef]/5 border border-[#b19eef]/20 p-4 rounded-2xl flex items-start gap-3 mb-4">
                <div className="mt-0.5 text-[#b19eef]"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg></div>
                <p className="text-[9px] text-[#b19eef] font-bold uppercase leading-relaxed tracking-wide">Please use your Registration Number as reference.</p>
              </div>

              <label title="Upload Slip" className="w-full h-24 border-2 border-dashed border-white/10 rounded-2xl flex items-center justify-center cursor-pointer hover:bg-white/5 transition-colors">
                <input type="file" className="hidden" onChange={handleFileChange} accept=".jpg,.jpeg,.png,.pdf" />
                <span className="text-[10px] text-white/40 font-bold uppercase px-4 text-center">{file ? file.name : "Tap to Upload Slip (JPG/PNG/PDF)"}</span>
              </label>
              <button onClick={handleSubmit} disabled={loading || !file} className="w-full bg-[#b19eef] text-black font-black py-5 rounded-2xl mt-8 active:scale-95 disabled:opacity-20 uppercase text-xs tracking-widest">{loading ? "Uploading..." : "Complete Reservation"}</button>
            </motion.div>
          )}

          {step === 4 && (
            // Step 4: Success Confirmation
            <motion.div key="s4" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-6">
              <div className="w-16 h-16 bg-green-500/10 text-green-400 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg"><svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12" /></svg></div>
              <h2 className="text-2xl font-bold mb-3 tracking-tighter uppercase text-white">Success!</h2>
              <p className="text-white/40 text-xs mb-10 px-4 leading-relaxed">Your registration is pending review. Join the WhatsApp community for live updates.</p>
              <a href="https://chat.whatsapp.com/JKsS8Hs4LPvKZ0dNbOllzr" target="_blank" rel="noopener noreferrer" className="w-full block bg-[#25D366] text-white py-5 rounded-2xl font-black text-center active:scale-95 uppercase text-xs tracking-widest">Join WhatsApp Community</a>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  ); 
};