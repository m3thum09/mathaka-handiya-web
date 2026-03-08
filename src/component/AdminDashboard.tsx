import { useState, useEffect, useCallback, useRef } from 'react';
import { db, auth } from '../lib/firebase';
import { 
  collection, 
  query, 
  orderBy, 
  onSnapshot, 
  doc, 
  updateDoc 
} from 'firebase/firestore';
import { signInWithEmailAndPassword, onAuthStateChanged, signOut } from 'firebase/auth';
import { motion, AnimatePresence } from 'framer-motion';
import emailjs from '@emailjs/browser';
import { Html5Qrcode } from "html5-qrcode";

type StatusType = 'pending' | 'approved' | 'rejected' | 'checked-in';

interface ReservationRecord {
  id: string; 
  name: string; 
  email: string; 
  whatsapp: string;
  ticketId: string; 
  status: StatusType; 
  receiptUrl: string;
  userType?: string; 
  amount?: number; 
  createdAt: any;
}

export const AdminDashboard = () => {
  const [isAdmin, setIsAdmin] = useState<boolean>(localStorage.getItem("admin_auth") === "true");
  const [activeTab, setActiveTab] = useState<StatusType>('pending');
  const [data, setData] = useState<ReservationRecord[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isScannerOpen, setIsScannerOpen] = useState(false);

  const qrInstanceRef = useRef<Html5Qrcode | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsAdmin(true);
        localStorage.setItem("admin_auth", "true");
      } else {
        setIsAdmin(false);
        localStorage.removeItem("admin_auth");
      }
    });
    return () => unsubscribe();
  }, []);

  const stopScanner = useCallback(async () => {
    try {
      if (qrInstanceRef.current && qrInstanceRef.current.isScanning) {
        await qrInstanceRef.current.stop();
        qrInstanceRef.current = null;
      }
    } catch (err) { 
      console.error("Camera release error:", err); 
    } finally { 
      setIsScannerOpen(false); 
    }
  }, []);

  const startScanner = useCallback(() => {
    setIsScannerOpen(true);
    setTimeout(() => {
      const html5QrCode = new Html5Qrcode("reader");
      qrInstanceRef.current = html5QrCode;
      html5QrCode.start(
        { facingMode: "environment" },
        { fps: 15, qrbox: { width: 250, height: 250 } },
        (decodedText) => {
          const ticketId = decodedText.split('/').pop();
          stopScanner().then(() => { 
            if (ticketId) window.location.href = `/verify/${ticketId}`; 
          });
        },
        () => {}
      ).catch(() => {
        alert("Camera error.");
        setIsScannerOpen(false);
      });
    }, 150);
  }, [stopScanner]);

  const handleStatusUpdate = async (item: ReservationRecord, newStatus: StatusType) => {
    setLoading(true);
    try {
      await updateDoc(doc(db, "reservations", item.id), { status: newStatus });
      
      if (newStatus === 'approved') {
        const templateParams = {
          user_name: item.name,
          user_email: item.email,
          ticket_id: item.ticketId,
          qr_url: `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=https://mathakahandiya.live/verify/${item.ticketId}`
        };
        await emailjs.send(
          import.meta.env.VITE_EMAILJS_SERVICE_ID, 
          import.meta.env.VITE_EMAIL_TICKET_TEMPLATE_ID, 
          templateParams, 
          import.meta.env.VITE_EMAILJS_PUBLIC_KEY
        );
      }
      alert(`Status successfully updated to: ${newStatus}`);
    } catch (error) {
      console.error("Update error:", error);
      alert("Failed to update status. Check permissions.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault(); 
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email.toLowerCase().trim(), password);
    } catch (error: any) {
      console.error("Full Login Error:", error.code, error.message);
      alert("Invalid Credentials or Access Denied.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    localStorage.removeItem("admin_auth");
    setIsAdmin(false);
  };

  useEffect(() => {
    if (isAdmin) {
      const q = query(collection(db, "reservations"), orderBy("createdAt", "desc"));
      const unsub = onSnapshot(q, (snap) => {
        setData(snap.docs.map(d => ({ 
          id: d.id, 
          ...d.data() 
        } as ReservationRecord)));
      });
      return () => unsub();
    }
  }, [isAdmin]);

  const filteredData = data.filter(item => 
    item.status === activeTab && (
      item.name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
      item.ticketId?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.email?.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  const formatDateTime = (ts: any) => ts ? ts.toDate().toLocaleString('en-GB', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit', hour12: true }) : '---';

  if (!isAdmin) return (
    <div className="h-screen bg-[#05050a] flex items-center justify-center p-6 text-white font-['Montserrat']">
      <form onSubmit={handleLogin} className="bg-white/5 p-8 rounded-[2.5rem] border border-white/10 w-full max-w-sm backdrop-blur-3xl shadow-2xl">
        <h2 className="text-xl font-bold text-center mb-6 uppercase tracking-[0.3em]">Portal Access</h2>
        <input type="email" placeholder="Email" required className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl mb-4 outline-none focus:border-[#b19eef]/50" onChange={(e) => setEmail(e.target.value)} />
        <input type="password" placeholder="Password" required className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl mb-6 outline-none focus:border-[#b19eef]/50" onChange={(e) => setPassword(e.target.value)} />
        <button type="submit" disabled={loading} className="w-full bg-[#b19eef] text-black font-black py-4 rounded-2xl active:scale-95 transition-all text-xs tracking-widest">{loading ? "VERIFYING..." : "ENTER PORTAL"}</button>
      </form>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#05050a] text-white p-4 md:p-8 font-['Montserrat']">
      <div className="max-w-6xl mx-auto">
        <header className="flex flex-col md:flex-row justify-between items-center mb-8 gap-6">
          <div className="flex items-center justify-between w-full md:w-auto">
            <h1 className="text-m font-black uppercase tracking-tighter text-[#b19eef]">Management</h1>
            <button onClick={handleLogout} className="md:ml-6 text-[9px] text-white/20 hover:text-red-500 uppercase font-bold tracking-widest transition-colors">Logout</button>
          </div>
          <div className="flex gap-2 w-full md:w-auto">
            <input type="text" placeholder="Search attendee..." className="bg-white/5 border border-white/10 p-4 rounded-2xl flex-1 md:w-64 outline-none text-[11px] focus:border-[#b19eef]/50" onChange={(e) => setSearchQuery(e.target.value)} />
            <button onClick={startScanner} className="bg-[#b19eef] text-black px-6 rounded-2xl text-[9px] font-black uppercase shadow-lg shadow-[#b19eef]/20 active:scale-95">Scan QR</button>
          </div>
        </header>

        <AnimatePresence>
          {isScannerOpen && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[500] flex items-center justify-center p-6 bg-black/95 backdrop-blur-sm">
              <div className="relative w-full max-w-sm bg-[#121212] border border-white/10 rounded-[3rem] p-6 shadow-2xl text-center">
                <h3 className="text-white/40 text-[9px] font-bold uppercase tracking-[0.3em] mb-4">Scan QR Ticket</h3>
                <div id="reader" className="overflow-hidden rounded-3xl border border-white/5 bg-black aspect-square"></div>
                <button onClick={stopScanner} className="w-full mt-6 bg-white/5 text-white/40 py-4 rounded-2xl text-[9px] font-bold uppercase hover:bg-white/10 transition-all">Cancel Scan</button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex bg-white/5 p-1 rounded-2xl mb-8 overflow-x-auto gap-1 border border-white/5 no-scrollbar shadow-inner">
          {(['pending', 'approved', 'rejected', 'checked-in'] as StatusType[]).map((tab) => (
            <button key={tab} onClick={() => setActiveTab(tab)} className={`flex-1 min-w-[100px] py-4 rounded-xl text-[9px] font-black uppercase transition-all ${activeTab === tab ? 'bg-white text-black shadow-lg' : 'text-white/40 hover:text-white'}`}>
              {tab === 'checked-in' ? 'Attended' : tab} ({data.filter(i => i.status === tab).length})
            </button>
          ))}
        </div>

        <div className="grid gap-3">
          <AnimatePresence mode='popLayout'>
            {filteredData.map((item) => (
              <motion.div key={item.id} layout initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-[#111118] border border-white/5 hover:border-[#b19eef]/20 p-5 rounded-[2rem] flex flex-col md:flex-row justify-between items-center gap-4 shadow-xl transition-all">
                <div className="flex flex-col md:flex-row items-center gap-5 w-full flex-1">
                  <div className="flex flex-col items-center md:items-start shrink-0">
                    <span className="text-[9px] font-mono text-[#b19eef] bg-[#b19eef]/10 px-3 py-1.5 rounded-xl border border-[#b19eef]/20">#{item.ticketId}</span>
                    <span className="text-[9px] text-white/30 font-bold uppercase mt-1 tracking-widest">{formatDateTime(item.createdAt)}</span>
                  </div>
                  <div className="text-center md:text-left flex-1 min-w-0">
                    <p className="font-bold text-sm tracking-tight text-white/90 truncate">{item.name}</p>
                    <div className="flex flex-wrap justify-center md:justify-start items-center gap-1.5 mt-1.5">
                      <span className="text-[8px] px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-white/40 uppercase font-black">{item.userType || 'Student'}</span>
                      <span className="text-[8px] px-2 py-0.5 rounded-full bg-[#b19eef]/10 border border-[#b19eef]/20 text-[#b19eef] font-bold">LKR {item.amount || '1500'}</span>
                      <span className="text-[10px] text-white/20 font-medium truncate ml-1 border-l border-white/10 pl-2">{item.email}</span>
                    </div>
                  </div>
                </div>

                <div className={`grid w-full md:w-auto ${activeTab === 'pending' ? 'grid-cols-3' : (activeTab === 'approved' ? 'grid-cols-2' : 'grid-cols-1')} md:flex gap-2 pt-3 md:pt-0 border-t md:border-t-0 border-white/5 shrink-0`}>
                  <a href={item.receiptUrl} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center bg-white/5 border border-white/10 h-10 md:h-auto md:px-5 md:py-3 rounded-2xl text-[9px] font-bold uppercase hover:bg-white/10 transition-all">Slip</a>
                  
                  {activeTab === 'pending' && (
                    <>
                      <button onClick={() => handleStatusUpdate(item, 'rejected')} className="flex items-center justify-center bg-red-500/10 text-red-500 h-10 md:h-auto md:px-5 md:py-3 rounded-2xl text-[9px] font-bold uppercase hover:bg-red-500/20 transition-all">Reject</button>
                      <button onClick={() => handleStatusUpdate(item, 'approved')} className="flex items-center justify-center bg-white text-black h-10 md:h-auto md:px-6 md:py-3 rounded-2xl text-[9px] font-black uppercase hover:bg-[#b19eef] transition-all">Approve</button>
                    </>
                  )}

                  {activeTab === 'approved' && (
                    <button onClick={() => handleStatusUpdate(item, 'checked-in')} className="flex items-center justify-center bg-[#b19eef] text-black h-10 md:h-auto md:px-8 md:py-3 rounded-2xl text-[9px] font-black uppercase active:scale-95 shadow-lg shadow-[#b19eef]/10">Check-In</button>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};