import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db } from '../lib/firebase';
import { doc, updateDoc, collection, query, where, getDocs } from 'firebase/firestore';

export const VerifyTicket = () => {
  // Use URL parameter to get the ticket ID
  const { ticketId } = useParams<{ ticketId: string }>();
  const navigate = useNavigate();
  
  const [ticketData, setTicketData] = useState<any>(null);
  const [status, setStatus] = useState<'loading' | 'valid' | 'invalid' | 'checked-in'>('loading');
  
  // Check if admin is logged in
  const isAdmin = localStorage.getItem("admin_auth") === "true";

  useEffect(() => {
    const fetchTicket = async () => {
      // If not admin, redirect to login page or show message
      if (!isAdmin) {
        return;
      }

      try {
        const q = query(collection(db, "reservations"), where("ticketId", "==", ticketId));
        const snap = await getDocs(q);
        
        if (!snap.empty) {
          const data = snap.docs[0].data();
          setTicketData({ id: snap.docs[0].id, ...data });
          // Check if the ticket has already been checked-in
          setStatus(data.status === 'checked-in' ? 'checked-in' : 'valid');
        } else {
          setStatus('invalid');
        }
      } catch (error) {
        console.error("Verification Error:", error);
        setStatus('invalid');
      }
    };

    fetchTicket();
  }, [ticketId, isAdmin]);

  // If not admin, show message
  if (!isAdmin) {
    return (
      <div className="h-screen bg-black flex flex-col items-center justify-center p-6 text-center">
        <h2 className="text-red-500 font-bold uppercase tracking-widest mb-6">Admin Login Required</h2>
        <button 
          onClick={() => navigate('/admin')}
          className="bg-white text-black px-8 py-3 rounded-full font-bold uppercase text-xs hover:bg-[#b19eef] transition-all"
        >
          Go to Login
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#05050a] flex items-center justify-center p-6 text-white font-['Montserrat']">
      <div className="w-full max-w-md bg-white/5 border border-white/10 p-12 rounded-[3.5rem] text-center backdrop-blur-3xl shadow-2xl relative overflow-hidden">
        
        {/* Glow Effect */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-32 bg-[#b19eef]/10 blur-[80px] pointer-events-none" />

        {status === 'loading' && (
          <div className="flex flex-col items-center gap-4">
            <div className="animate-spin h-10 w-10 border-4 border-[#b19eef] border-t-transparent rounded-full" />
            <p className="text-white/40 text-xs uppercase tracking-widest">Verifying Ticket...</p>
          </div>
        )}

        {status === 'valid' && (
          <div className="space-y-8 animate-in fade-in zoom-in duration-500">
            <div className="w-24 h-24 bg-green-500/20 rounded-full flex items-center justify-center mx-auto shadow-[0_0_50px_rgba(34,197,94,0.2)]">
              <span className="text-green-400 text-5xl">✓</span>
            </div>
            
            <h2 className="text-3xl font-black uppercase tracking-tighter italic">Ticket Valid</h2>
            
            <div className="py-8 border-y border-white/10 text-left space-y-4">
              <div>
                <p className="text-white/20 text-[10px] uppercase font-bold tracking-widest">Attendee</p>
                <p className="text-xl font-bold">{ticketData.name}</p>
              </div>
              <div>
                <p className="text-white/20 text-[10px] uppercase font-bold tracking-widest">Ticket ID</p>
                <p className="font-mono text-[#b19eef]">{ticketId}</p>
              </div>
            </div>

            <button 
  onClick={async () => { 
    await updateDoc(doc(db, "reservations", ticketData.id), { status: 'checked-in' }); 
    alert("Check-in Successful!");
    navigate('/admin'); // After scanning is complete, navigate back to the Dashboard
  }}
  className="..."
>
  Check-In Entry
</button>
          </div>
        )}

        {status === 'checked-in' && (
          <div className="space-y-6 animate-in fade-in duration-500">
            <div className="w-20 h-20 bg-orange-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-orange-400 text-3xl">!</span>
            </div>
            <h2 className="text-orange-400 font-black text-2xl uppercase tracking-tighter">Already Checked-In</h2>
            <p className="text-white/30 text-xs italic">Used by {ticketData?.name}</p>
            <button onClick={() => navigate('/admin')} className="text-white/40 text-[10px] uppercase tracking-widest border-b border-white/10 pb-1 mt-6">Back to Dashboard</button>
          </div>
        )}

        {status === 'invalid' && (
          <div className="space-y-6 animate-in fade-in duration-500">
            <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-red-500 text-3xl">✕</span>
            </div>
            <h2 className="text-red-500 font-black text-2xl uppercase tracking-tighter">Invalid Ticket</h2>
            <p className="text-white/30 text-xs font-medium">No record found for ID: {ticketId}</p>
            <button onClick={() => navigate('/admin')} className="text-white/40 text-[10px] uppercase tracking-widest border-b border-white/10 pb-1 mt-6">Back to Dashboard</button>
          </div>
        )}
      </div>
    </div>
  );
};