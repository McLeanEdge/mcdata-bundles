import { useState, useEffect, useRef } from "react";
import { createClient } from "@supabase/supabase-js";

// ─── SUPABASE ─────────────────────────────────────────────────────────────────
console.log("URL:", import.meta.env.VITE_SUPABASE_URL);
console.log("KEY:", import.meta.env.VITE_SUPABASE_ANON_KEY);

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

// ─── PAYSTACK CONFIG ──────────────────────────────────────────────────────────
const PAYSTACK_PUBLIC_KEY = "pk_test_56eda5a1aea2538697144a6d995716746035545e";

// Loads the Paystack SDK from CDN
function loadPaystack() {
  return new Promise((resolve) => {
    if (window.PaystackPop) { resolve(); return; }
    const s = document.createElement("script");
    s.src = "https://js.paystack.co/v1/inline.js";
    s.onload = () => resolve();
    document.head.appendChild(s);
  });
}
// Replace these three values with your real EmailJS credentials
const EMAILJS_SERVICE_ID   = "service_qnuwuzs";    // EmailJS Service ID
const EMAILJS_PUBLIC_KEY   = "C-Fi28gFmaXlpRk5x";  // EmailJS Public Key
const EMAILJS_TMPL_ALERT   = "template_dg37w0p";   // Alert YOU on new signup
const EMAILJS_TMPL_WELCOME = "template_j9qdev9";   // Welcome email to new agent

// Loads the EmailJS SDK from CDN (no npm needed)
function loadEmailJS() {
  return new Promise((resolve) => {
    if (window.emailjs) { resolve(); return; }
    const s = document.createElement("script");
    s.src = "https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.min.js";
    s.onload = () => { window.emailjs.init(EMAILJS_PUBLIC_KEY); resolve(); };
    document.head.appendChild(s);
  });
}

async function sendEmails({ name, phone, email }) {
  try {
    await loadEmailJS();
    // Alert YOU at mcleanedge@gmail.com
    await window.emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TMPL_ALERT, {
      agent_name:  name,
      agent_phone: phone,
      agent_email: email,
      signup_time: new Date().toLocaleString(),
    });
    // Welcome email to the new agent
    await window.emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TMPL_WELCOME, {
      agent_name:  name,
      agent_phone: phone,
      to_email:    email,
    });
  } catch (err) {
    console.warn("EmailJS error:", err);
  }
}

// ─── SVG ICONS ────────────────────────────────────────────────────────────────
const Icon = ({ name, size = 18, color = "currentColor", sw = 1.8 }) => {
  const p = {
    signal:<><path d="M1 6C1 3.24 3.24 1 6 1"/><path d="M1 10c0-4.97 4.03-9 9-9"/><path d="M1 14C1 6.27 7.27 0 15 0"/><circle cx="1" cy="18" r="1.5" fill={color} stroke="none"/></>,
    zap:<polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>,
    dollar:<><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></>,
    wallet:<><rect x="2" y="5" width="20" height="14" rx="2"/><path d="M16 12h.01" strokeWidth="3" strokeLinecap="round"/><path d="M2 10h20"/></>,
    package:<><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></>,
    users:<><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></>,
    creditcard:<><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></>,
    arrowright:<><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></>,
    arrowleft:<><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></>,
    checkcircle:<><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></>,
    x:<><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></>,
    menu:<><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></>,
    user:<><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></>,
    phone:<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 11.5a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.37a16 16 0 0 0 6.08 6.08l1.63-1.63a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>,
    lock:<><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></>,
    logout:<><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></>,
    moon:<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>,
    list:<><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6" strokeWidth="3" strokeLinecap="round"/><line x1="3" y1="12" x2="3.01" y2="12" strokeWidth="3" strokeLinecap="round"/><line x1="3" y1="18" x2="3.01" y2="18" strokeWidth="3" strokeLinecap="round"/></>,
    plus:<><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></>,
    gift:<><polyline points="20 12 20 22 4 22 4 12"/><rect x="2" y="7" width="20" height="5"/><line x1="12" y1="22" x2="12" y2="7"/><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"/><path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"/></>,
    store:<><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></>,
    barchart:<><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></>,
    clock:<><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></>,
    info:<><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8" strokeWidth="3" strokeLinecap="round"/></>,
    layers:<><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></>,
    activity:<polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>,
    bell:<><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></>,
    shield:<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>,
    trending:<><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></>,
    search:<><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></>,
    chevronright:<polyline points="9 18 15 12 9 6"/>,
    star:<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>,
    helpcirlce:<><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17" strokeWidth="3" strokeLinecap="round"/></>,
    eye:<><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></>,
    upload:<><polyline points="16 16 12 12 8 16"/><line x1="12" y1="12" x2="12" y2="21"/><path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"/></>,
    mail:<><rect x="2" y="4" width="20" height="16" rx="2"/><polyline points="2,4 12,13 22,4"/></>,
  };
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
      {p[name]}
    </svg>
  );
};

// ─── NETWORK LOGOS (SVG) ──────────────────────────────────────────────────────
const MTNLogo = ({ size = 40 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100">
    <rect width="100" height="100" rx="14" fill="#FFCC00"/>
    <text x="50" y="58" textAnchor="middle" fontSize="30" fontWeight="900" fontFamily="Arial Black,sans-serif" fill="#000">MTN</text>
    <rect x="15" y="64" width="70" height="5" rx="2.5" fill="#000"/>
  </svg>
);

const TelecelLogo = ({ size = 40 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100">
    <rect width="100" height="100" rx="14" fill="#E4002B"/>
    <circle cx="50" cy="48" r="28" fill="none" stroke="#fff" strokeWidth="10"/>
    <rect x="38" y="36" width="24" height="24" rx="4" fill="#E4002B"/>
    <text x="50" y="56" textAnchor="middle" fontSize="16" fontWeight="900" fontFamily="Arial,sans-serif" fill="#fff">t</text>
    <text x="50" y="88" textAnchor="middle" fontSize="14" fontWeight="700" fontFamily="Arial,sans-serif" fill="#fff">Telecel</text>
  </svg>
);

const AirtelLogo = ({ size = 40 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100">
    <rect width="100" height="100" rx="14" fill="#FF0000"/>
    <path d="M20 65 Q50 20 80 65" stroke="#fff" strokeWidth="10" fill="none" strokeLinecap="round"/>
    <path d="M30 65 Q50 35 70 65" stroke="#fff" strokeWidth="7" fill="none" strokeLinecap="round"/>
    <circle cx="50" cy="65" r="6" fill="#fff"/>
    <text x="50" y="90" textAnchor="middle" fontSize="13" fontWeight="700" fontFamily="Arial,sans-serif" fill="#fff">Airtel·Tigo</text>
  </svg>
);

const McDataLogo = ({ size = 36 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100">
    <rect width="100" height="100" rx="20" fill="#00c96e"/>
    <text x="50" y="64" textAnchor="middle" fontSize="52" fontWeight="900" fontFamily="Arial Black,sans-serif" fill="#fff">M</text>
  </svg>
);

const NetworkLogo = ({ net, size = 40 }) => {
  if (net === "MTN") return <MTNLogo size={size}/>;
  if (net === "Telecel") return <TelecelLogo size={size}/>;
  return <AirtelLogo size={size}/>;
};

// ─── DATA ─────────────────────────────────────────────────────────────────────
const PACKAGES = {
  MTN: [
    { id:"m1", label:"1GB",  validity:"30 days",   price:4.50  },
    { id:"m2", label:"2GB",  validity:"30 days",   price:8.00  },
    { id:"m3", label:"5GB",  validity:"30 days",   price:18.00 },
    { id:"m4", label:"10GB", validity:"30 days",   price:32.00 },
    { id:"m5", label:"20GB", validity:"30 days",   price:58.00 },
    { id:"m6", label:"50GB", validity:"No Expiry", price:130.00},
  ],
  Telecel: [
    { id:"t1", label:"1GB",   validity:"7 days",  price:5.00  },
    { id:"t2", label:"3GB",   validity:"30 days", price:13.00 },
    { id:"t3", label:"5GB",   validity:"30 days", price:19.50 },
    { id:"t4", label:"10GB",  validity:"30 days", price:35.00 },
    { id:"t5", label:"25GB",  validity:"30 days", price:78.00 },
    { id:"t6", label:"100GB", validity:"90 days", price:280.00},
  ],
  AirtelTigo: [
    { id:"a1", label:"1GB",       validity:"7 days",  price:3.95  },
    { id:"a2", label:"2GB",       validity:"14 days", price:7.50  },
    { id:"a3", label:"5GB",       validity:"30 days", price:17.00 },
    { id:"a4", label:"10GB",      validity:"30 days", price:30.00 },
    { id:"a5", label:"20GB",      validity:"30 days", price:54.00 },
    { id:"a6", label:"Unlimited", validity:"1 day",   price:12.00 },
  ],
};

const NET_COLOR  = { MTN:"#FFCC00", Telecel:"#E4002B", AirtelTigo:"#FF0000" };
const NET_BG     = { MTN:"#fffbea", Telecel:"#fff0f3", AirtelTigo:"#fff0f0" };
const NET_BORDER = { MTN:"#ffe066", Telecel:"#ffa0b0", AirtelTigo:"#ffaaaa" };
const NET_TEXT   = { MTN:"#7a5c00", Telecel:"#8b001a", AirtelTigo:"#8b0000" };

const GREEN = "#00c96e";
const GREEN_DARK = "#009e54";
const GREEN_LIGHT = "#e6f9f0";
const GREEN_BORDER = "#b3efd4";

// USERS are now stored in Supabase — see AuthPage and TopUpPage for DB calls
let USERS_CACHE = []; // local cache populated after login for agent listing

let ORDERS = [
  { id:"ORD001", agent:"Kwame Mensah", network:"MTN",       bundle:"5GB",  phone:"0241112233", amount:18.00, status:"success", date:"2026-05-28 09:12" },
  { id:"ORD002", agent:"Ama Owusu",    network:"Telecel",   bundle:"3GB",  phone:"0501234444", amount:13.00, status:"success", date:"2026-05-28 10:45" },
  { id:"ORD003", agent:"Kwame Mensah", network:"AirtelTigo",bundle:"1GB",  phone:"0261112222", amount:3.95,  status:"pending", date:"2026-05-29 08:00" },
  { id:"ORD004", agent:"Ama Owusu",    network:"MTN",       bundle:"10GB", phone:"0501119999", amount:32.00, status:"success", date:"2026-05-29 14:22" },
];

const ghs = n => "GH₵ " + Number(n).toFixed(2);
const greet = () => { const h=new Date().getHours(); return h<12?"Good morning":h<17?"Good afternoon":"Good evening"; };

// ─── SHARED UI ────────────────────────────────────────────────────────────────
const Card = ({ children, style={}, onClick }) => (
  <div onClick={onClick} style={{ background:"#fff", borderRadius:16, border:"1.5px solid #e8eaf0", boxShadow:"0 2px 12px rgba(0,0,0,0.06)", ...style }}>
    {children}
  </div>
);

const Btn = ({ children, onClick, variant="primary", disabled=false, style={} }) => {
  const base = { padding:"12px 24px", borderRadius:12, fontWeight:700, fontSize:14, cursor:disabled?"not-allowed":"pointer", border:"none", display:"flex", alignItems:"center", justifyContent:"center", gap:8, transition:"all .15s", opacity:disabled?0.55:1 };
  const variants = {
    primary:{ background:GREEN, color:"#fff", boxShadow:`0 4px 14px ${GREEN}55` },
    outline:{ background:"#fff", color:GREEN, border:`1.5px solid ${GREEN_BORDER}` },
    ghost:  { background:"#f3f4f6", color:"#444" },
    danger: { background:"#fff0f0", color:"#c0392b", border:"1.5px solid #ffc0c0" },
  };
  return <button onClick={disabled?undefined:onClick} style={{...base,...variants[variant],...style}}>{children}</button>;
};

const Badge = ({ status }) => {
  const map = { success:[GREEN_LIGHT,"#00754e"], pending:["#fffbea","#8a6d00"], failed:["#fff0f0","#c0392b"] };
  const [bg,col] = map[status]||["#f3f4f6","#555"];
  return <span style={{ background:bg, color:col, fontSize:11, fontWeight:700, borderRadius:20, padding:"3px 10px", textTransform:"uppercase", letterSpacing:.4 }}>{status}</span>;
};

const PageHeader = ({ title, subtitle, onBack, action }) => (
  <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:24, flexWrap:"wrap" }}>
    {onBack && (
      <button onClick={onBack} style={{ width:38, height:38, borderRadius:10, background:"#f3f4f6", border:"none", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
        <Icon name="arrowleft" size={18} color="#333"/>
      </button>
    )}
    <div style={{ flex:1 }}>
      <h2 style={{ margin:0, fontSize:20, fontWeight:800, color:"#0d1117" }}>{title}</h2>
      {subtitle && <p style={{ margin:"2px 0 0", fontSize:13, color:"#888" }}>{subtitle}</p>}
    </div>
    {action}
  </div>
);

const StatCard = ({ icon, label, value, accent="#00c96e", onClick }) => (
  <Card onClick={onClick} style={{ padding:"18px 16px", cursor:onClick?"pointer":"default", transition:"box-shadow .15s" }}>
    <div style={{ width:38, height:38, borderRadius:10, background:`${accent}18`, display:"flex", alignItems:"center", justifyContent:"center", marginBottom:12 }}>
      <Icon name={icon} size={18} color={accent}/>
    </div>
    <p style={{ margin:"0 0 3px", fontSize:11, color:"#999", fontWeight:600, textTransform:"uppercase", letterSpacing:.5 }}>{label}</p>
    <p style={{ margin:0, fontSize:22, fontWeight:800, color:"#0d1117" }}>{value}</p>
  </Card>
);

// ─── AUTH ─────────────────────────────────────────────────────────────────────
function AuthPage({ onLogin }) {
  const [tab, setTab]     = useState("login");
  const [phone,setPhone]  = useState("");
  const [pin,setPin]      = useState("");
  const [name,setName]    = useState("");
  const [email,setEmail]  = useState("");
  const [err,setErr]      = useState("");
  const [loading,setLoad] = useState(false);
  const [modal,setModal]  = useState(true);

  const inp = { width:"100%", padding:"12px 14px 12px 42px", border:"1.5px solid #e0e0e0", borderRadius:12, fontSize:14, color:"#0d1117", outline:"none", boxSizing:"border-box", background:"#fafafa" };

  async function submit() {
    setLoad(true);
    if (tab==="login") {
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("phone", phone)
        .eq("pin", pin)
        .single();
      if (data) { setErr(""); onLogin(data); }
      else setErr("Incorrect phone number or PIN. Please try again.");
      setLoad(false);
    } else {
      if(!name||!phone||!pin||!email){ setErr("Fill all fields including email"); setLoad(false); return; }
      if(phone.length<10){ setErr("Enter valid 10-digit phone"); setLoad(false); return; }
      if(!email.includes("@")){ setErr("Enter a valid email address"); setLoad(false); return; }
      const nu = { id: Date.now(), name, phone, email, role: "agent", pin, balance: 0 };
      const { error } = await supabase.from("users").insert([nu]);
      if (!error) {
        await sendEmails({ name, phone, email });
        onLogin(nu);
      } else {
        setErr("Registration failed. Phone number may already be in use.");
      }
      setLoad(false);
    }
  }

  return (
    <div style={{ minHeight:"100vh", background:"linear-gradient(160deg,#f0fdf4 0%,#ffffff 60%,#ecfdf5 100%)", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:24, fontFamily:"'DM Sans',system-ui,sans-serif" }}>

      {/* Promo modal */}
      {modal && (
        <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.45)", backdropFilter:"blur(6px)", zIndex:200, display:"flex", alignItems:"center", justifyContent:"center", padding:24 }}>
          <Card style={{ padding:28, maxWidth:380, width:"100%", position:"relative" }}>
            <button onClick={()=>setModal(false)} style={{ position:"absolute", top:14, right:14, width:30, height:30, borderRadius:"50%", background:"#f3f4f6", border:"none", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}>
              <Icon name="x" size={14} color="#555"/>
            </button>
            {/* Green accent top bar */}
            <div style={{ height:5, background:`linear-gradient(90deg,${GREEN},#00e07a)`, borderRadius:4, marginBottom:20 }}/>
            <p style={{ fontSize:11, fontWeight:700, letterSpacing:1.5, textTransform:"uppercase", color:GREEN, marginBottom:8 }}>What your friend won't show you</p>
            <h2 style={{ fontSize:24, fontWeight:900, color:"#0d1117", lineHeight:1.2, marginBottom:6 }}>You're already<br/>the data plug.</h2>
            <p style={{ fontSize:16, fontWeight:800, color:"#0d1117", marginBottom:14 }}>Make it <span style={{ background:GREEN, color:"#fff", padding:"2px 10px", borderRadius:6, fontSize:14 }}>official</span>.</p>
            <p style={{ fontSize:13, color:"#666", lineHeight:1.6, marginBottom:20 }}>Set your own prices, keep every cedi of margin, and get paid to your MoMo — no middleman, no monthly fees.</p>
            <div style={{ background:"#f8fffe", border:`1.5px solid ${GREEN_BORDER}`, borderRadius:14, padding:16, marginBottom:20 }}>
              {[["01","Set your own prices. Keep every cedi of margin."],["02","Withdraw to MoMo any time. No minimum hold."],["03","Free to start. No monthly fees, no hidden cuts."]].map(([n,t])=>(
                <div key={n} style={{ display:"flex", gap:12, alignItems:"flex-start", marginBottom:n==="03"?0:10 }}>
                  <span style={{ color:GREEN, fontWeight:800, fontSize:13, minWidth:24 }}>{n}</span>
                  <span style={{ color:"#444", fontSize:13 }}>{t}</span>
                </div>
              ))}
            </div>
            <Btn onClick={()=>setModal(false)} style={{ width:"100%" }}>Open my store <Icon name="arrowright" size={15} color="#fff"/></Btn>
            <p onClick={()=>setModal(false)} style={{ textAlign:"center", color:"#aaa", fontSize:13, marginTop:14, cursor:"pointer" }}>Maybe later</p>
          </Card>
        </div>
      )}

      {/* Logo */}
      <div style={{ textAlign:"center", marginBottom:32 }}>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:12, marginBottom:6 }}>
          <McDataLogo size={52}/>
          <div style={{ textAlign:"left" }}>
            <h1 style={{ margin:0, fontSize:28, fontWeight:900, color:"#0d1117", letterSpacing:-1 }}>McData <span style={{ color:GREEN }}>Bundles</span></h1>
            <p style={{ margin:0, fontSize:12, color:"#888" }}>Ghana's trusted data reseller platform</p>
          </div>
        </div>
        {/* Network logos row */}
        <div style={{ display:"flex", gap:10, justifyContent:"center", marginTop:16 }}>
          <MTNLogo size={38}/><TelecelLogo size={38}/><AirtelLogo size={38}/>
        </div>
        {/* Animated tagline on auth page */}
        <div style={{ marginTop:14, padding:"9px 20px", background:"#fff", borderRadius:12, border:"1.5px solid #e8eaf0", boxShadow:"0 2px 8px rgba(0,0,0,0.05)", display:"inline-block" }}>
          <AnimatedText />
        </div>
      </div>

      <Card style={{ padding:28, width:"100%", maxWidth:420 }}>
        {/* Tabs */}
        <div style={{ display:"flex", background:"#f3f4f6", borderRadius:10, padding:4, marginBottom:24 }}>
          {["login","register"].map(t=>(
            <button key={t} onClick={()=>{setTab(t);setErr("");}} style={{ flex:1, padding:"9px 0", borderRadius:8, border:"none", cursor:"pointer", fontWeight:700, fontSize:13, background:tab===t?"#fff":"transparent", color:tab===t?"#0d1117":"#888", boxShadow:tab===t?"0 1px 6px rgba(0,0,0,0.1)":"none", transition:"all .2s" }}>
              {t==="login"?"Sign In":"Create Account"}
            </button>
          ))}
        </div>

        {tab==="register" && (
          <div style={{ marginBottom:14, position:"relative" }}>
            <div style={{ position:"absolute", left:13, top:"50%", transform:"translateY(-50%)" }}><Icon name="user" size={15} color="#aaa"/></div>
            <input value={name} onChange={e=>setName(e.target.value)} placeholder="Full Name" style={inp}/>
          </div>
        )}
        {tab==="register" && (
          <div style={{ marginBottom:14, position:"relative" }}>
            <div style={{ position:"absolute", left:13, top:"50%", transform:"translateY(-50%)" }}><Icon name="mail" size={15} color="#aaa"/></div>
            <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email address (for notifications)" type="email" style={inp}/>
          </div>
        )}
        <div style={{ marginBottom:14, position:"relative" }}>
          <div style={{ position:"absolute", left:13, top:"50%", transform:"translateY(-50%)" }}><Icon name="phone" size={15} color="#aaa"/></div>
          <input value={phone} onChange={e=>setPhone(e.target.value)} placeholder="Phone Number e.g. 0241234567" type="tel" style={inp}/>
        </div>
        <div style={{ marginBottom:20, position:"relative" }}>
          <div style={{ position:"absolute", left:13, top:"50%", transform:"translateY(-50%)" }}><Icon name="lock" size={15} color="#aaa"/></div>
          <input value={pin} onChange={e=>setPin(e.target.value)} placeholder="PIN (4–6 digits)" type="password" maxLength={6} style={inp}/>
        </div>

        {err && <div style={{ background:"#fff0f0", border:"1px solid #ffc0c0", color:"#c0392b", borderRadius:10, padding:"10px 14px", fontSize:13, marginBottom:16 }}>{err}</div>}

        <Btn onClick={submit} disabled={loading} style={{ width:"100%" }}>
          {loading?"Please wait…":tab==="login"?"Sign In →":"Create Agent Account →"}
        </Btn>
        {tab==="login" && <p style={{ textAlign:"center", color:"#bbb", fontSize:12, marginTop:14 }}>Demo: 0200000000 / 1234 (admin) · 0241234567 / 2222 (agent)</p>}
      </Card>
    </div>
  );
}

// ─── TOP NAV ──────────────────────────────────────────────────────────────────
function TopNav({ user, onMenu, onNav }) {
  return (
    <div style={{ position:"sticky", top:0, zIndex:100, background:"#fff", borderBottom:"1.5px solid #e8eaf0", padding:"0 20px", height:60, display:"flex", alignItems:"center", justifyContent:"space-between" }}>
      <div style={{ display:"flex", alignItems:"center", gap:10, cursor:"pointer" }} onClick={()=>onNav("home")}>
        <McDataLogo size={34}/>
        <span style={{ fontWeight:900, fontSize:16, color:"#0d1117", letterSpacing:-.5 }}>McData <span style={{ color:GREEN }}>Bundles</span></span>
        {user.role==="admin"&&<span style={{ background:GREEN_LIGHT, color:GREEN_DARK, fontSize:10, fontWeight:700, padding:"2px 8px", borderRadius:20 }}>ADMIN</span>}
      </div>
      <div style={{ display:"flex", alignItems:"center", gap:10 }}>
        {/* Network logos */}
        <div style={{ display:"flex", gap:6 }}>
          <MTNLogo size={26}/><TelecelLogo size={26}/><AirtelLogo size={26}/>
        </div>
        <button style={{ width:38, height:38, borderRadius:10, background:"#f3f4f6", border:"none", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}>
          <Icon name="bell" size={17} color="#555"/>
        </button>
        <button onClick={onMenu} style={{ width:38, height:38, borderRadius:10, background:GREEN, border:"none", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}>
          <Icon name="menu" size={18} color="#fff"/>
        </button>
      </div>
    </div>
  );
}

// ─── BOTTOM NAV ───────────────────────────────────────────────────────────────
function BottomNav({ tab, user, onNav }) {
  const tabs = [
    { id:"home",   icon:"activity", label:"Home"    },
    { id:"buy",    icon:"zap",      label:"Buy Data" },
    { id:"orders", icon:"list",     label:"Orders"  },
    ...(user.role==="admin"?[
      { id:"agents", icon:"users",      label:"Agents"  },
      { id:"topup",  icon:"creditcard", label:"Top-Up"  },
    ]:[]),
  ];
  return (
    <div style={{ position:"fixed", bottom:0, left:0, right:0, background:"#fff", borderTop:"1.5px solid #e8eaf0", display:"flex", justifyContent:"space-around", padding:"6px 0 10px", zIndex:99 }}>
      {tabs.map(t=>(
        <button key={t.id} onClick={()=>onNav(t.id)} style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:3, background:"none", border:"none", cursor:"pointer", padding:"6px 14px", borderRadius:12 }}>
          <div style={{ width:36, height:36, borderRadius:10, background:tab===t.id?GREEN_LIGHT:"transparent", display:"flex", alignItems:"center", justifyContent:"center" }}>
            <Icon name={t.icon} size={18} color={tab===t.id?GREEN:"#aaa"}/>
          </div>
          <span style={{ fontSize:10, fontWeight:700, color:tab===t.id?GREEN:"#bbb" }}>{t.label}</span>
        </button>
      ))}
    </div>
  );
}

// ─── SIDE MENU ────────────────────────────────────────────────────────────────
function SideMenu({ user, onClose, onNav, onLogout }) {
  const agents = USERS.filter(u=>u.role==="agent");
  const menuSection = (title, items) => (
    <>
      <p style={{ fontSize:11, fontWeight:700, color:"#aaa", letterSpacing:1, textTransform:"uppercase", padding:"16px 20px 6px" }}>{title}</p>
      {items.map(([icon,label,nav])=>(
        <button key={label} onClick={()=>{onNav(nav);onClose();}} style={{ width:"100%", display:"flex", alignItems:"center", gap:14, padding:"12px 20px", background:"none", border:"none", cursor:"pointer", textAlign:"left" }}>
          <div style={{ width:38, height:38, borderRadius:12, background:GREEN_LIGHT, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
            <Icon name={icon} size={17} color={GREEN}/>
          </div>
          <span style={{ fontWeight:600, color:"#1a1a1a", fontSize:15 }}>{label}</span>
          <Icon name="chevronright" size={15} color="#ccc" style={{ marginLeft:"auto" }}/>
        </button>
      ))}
    </>
  );

  return (
    <div style={{ position:"fixed", inset:0, zIndex:300 }}>
      <div onClick={onClose} style={{ position:"absolute", inset:0, background:"rgba(0,0,0,0.3)", backdropFilter:"blur(3px)" }}/>
      <div style={{ position:"absolute", right:0, top:0, bottom:0, width:300, background:"#fff", boxShadow:"-8px 0 40px rgba(0,0,0,0.12)", display:"flex", flexDirection:"column", overflowY:"auto" }}>
        {/* Header */}
        <div style={{ padding:"20px 20px 16px", display:"flex", justifyContent:"space-between", alignItems:"center", borderBottom:"1.5px solid #e8eaf0" }}>
          <div style={{ display:"flex", alignItems:"center", gap:10 }}>
            <McDataLogo size={32}/>
            <span style={{ fontWeight:800, fontSize:16, color:"#0d1117" }}>Menu</span>
          </div>
          <button onClick={onClose} style={{ width:32, height:32, borderRadius:8, background:"#f3f4f6", border:"none", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}>
            <Icon name="x" size={15} color="#555"/>
          </button>
        </div>

        {/* Balance */}
        <div style={{ margin:"16px 20px", background:GREEN_LIGHT, border:`1.5px solid ${GREEN_BORDER}`, borderRadius:16, padding:18 }}>
          <p style={{ margin:"0 0 4px", fontSize:11, fontWeight:700, color:GREEN_DARK, textTransform:"uppercase", letterSpacing:1 }}>Available Balance</p>
          <p style={{ margin:"0 0 12px", fontSize:26, fontWeight:900, color:"#0d1117" }}>{ghs(user.balance||0)}</p>
          <div style={{ display:"flex", gap:12 }}>
            <span style={{ color:GREEN, fontSize:13, fontWeight:600 }}>+GH₵10.00 today</span>
            <span style={{ color:"#e4002b", fontSize:13, fontWeight:600 }}>-GH₵8.80</span>
          </div>
        </div>

        {/* Network logos in menu */}
        <div style={{ padding:"0 20px 4px" }}>
          <p style={{ fontSize:11, fontWeight:700, color:"#aaa", letterSpacing:1, textTransform:"uppercase", marginBottom:12 }}>Buy Data</p>
          <div style={{ display:"flex", gap:14 }}>
            {Object.keys(PACKAGES).map(net=>(
              <div key={net} onClick={()=>{onNav("buy");onClose();}} style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", gap:6, cursor:"pointer", padding:"10px 6px", borderRadius:12, border:"1.5px solid #e8eaf0", background:"#fafafa" }}>
                <NetworkLogo net={net} size={36}/>
                <span style={{ fontSize:11, fontWeight:700, color:"#444" }}>{net}</span>
              </div>
            ))}
          </div>
        </div>

        {menuSection("More Services",[
          ["list","Transaction History","orders"],
          ["gift","Refer & Earn 1%","orders"],
          ["store","My Store","home"],
          ["shield","Support","home"],
        ])}

        {user.role==="admin" && menuSection("Admin",[
          ["users","Manage Agents","agents"],
          ["creditcard","Top-Up Agents","topup"],
          ["barchart","Reports","orders"],
        ])}

        <div style={{ marginTop:"auto", padding:"16px 20px", borderTop:"1.5px solid #e8eaf0" }}>
          <button onClick={()=>{onLogout();onClose();}} style={{ width:"100%", display:"flex", alignItems:"center", gap:12, padding:"12px 16px", background:"#fff0f0", border:"1.5px solid #ffc0c0", borderRadius:12, cursor:"pointer" }}>
            <Icon name="logout" size={18} color="#c0392b"/>
            <span style={{ fontWeight:700, color:"#c0392b", fontSize:15 }}>Sign Out</span>
          </button>
          <p style={{ textAlign:"center", color:"#ccc", fontSize:11, marginTop:14 }}>MCDATA BUNDLES · 2026</p>
        </div>
      </div>
    </div>
  );
}

// ─── ANIMATED TEXT ────────────────────────────────────────────────────────────
const ANIMATED_PHRASES = [
  { text: "Ghana's #1 Data Plug 🇬🇭",        color: "#00c96e" },
  { text: "MTN · Telecel · AirtelTigo ⚡",   color: "#f59e0b" },
  { text: "Keep Every Cedi of Margin 💰",     color: "#009e54" },
  { text: "Sell Data. Get Paid to MoMo 📲",  color: "#6366f1" },
  { text: "No Middleman. No Hidden Fees. ✅", color: "#0ea5e9" },
  { text: "Instant Bundles, Any Network 🚀",  color: "#00c96e" },
];

function AnimatedText() {
  const [index,  setIndex]   = useState(0);
  const [phase,  setPhase]   = useState("in");
  const [typed,  setTyped]   = useState("");
  const fullText = ANIMATED_PHRASES[index].text;

  useEffect(() => {
    let timeout;
    if (phase === "in") {
      if (typed.length < fullText.length) {
        timeout = setTimeout(() => setTyped(fullText.slice(0, typed.length + 1)), 45);
      } else {
        timeout = setTimeout(() => setPhase("out"), 2200);
      }
    } else if (phase === "out") {
      if (typed.length > 0) {
        timeout = setTimeout(() => setTyped(t => t.slice(0, -1)), 22);
      } else {
        setIndex(i => (i + 1) % ANIMATED_PHRASES.length);
        setPhase("in");
      }
    }
    return () => clearTimeout(timeout);
  }, [phase, typed, fullText]);

  const col = ANIMATED_PHRASES[index].color;

  return (
    <div style={{ minHeight:32, display:"flex", alignItems:"center", justifyContent:"center", gap:4 }}>
      <style>{`@keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }`}</style>
      <span style={{ fontWeight:900, fontSize:16, color:col, letterSpacing:.2, transition:"color 0.4s" }}>
        {typed}
      </span>
      <span style={{ display:"inline-block", width:2, height:18, background:col, borderRadius:2, marginLeft:1, animation:"blink 0.8s step-end infinite" }}/>
    </div>
  );
}

// ─── IMAGE SLIDER ─────────────────────────────────────────────────────────────
const SLIDES = [
  {
    url: "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=900&q=85",
    headline: "Buy Data Instantly ⚡",
    sub: "MTN, Telecel & AirtelTigo bundles — delivered in seconds",
    cta: "buy", ctaLabel: "Buy Now",
    accent: "#00c96e",
  },
  {
    url: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=900&q=85",
    headline: "Become a Data Agent 💼",
    sub: "Set your own prices and earn on every bundle you sell",
    cta: "buy", ctaLabel: "Start Selling",
    accent: "#f59e0b",
  },
  {
    url: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=900&q=85",
    headline: "Track Every Order 📋",
    sub: "Full transaction history and real-time status updates",
    cta: "orders", ctaLabel: "View Orders",
    accent: "#6366f1",
  },
  {
    url: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=900&q=85",
    headline: "Get Paid to MoMo 💰",
    sub: "Withdraw your earnings any time — zero minimum hold",
    cta: "topup", ctaLabel: "Top Up",
    accent: "#0ea5e9",
  },
];

function ImageSlider({ onNav }) {
  const [cur,      setCur]    = useState(0);
  const [prev,     setPrev]   = useState(null);
  const [dir,      setDir]    = useState(1); // 1 = forward, -1 = back
  const [sliding,  setSlide]  = useState(false);
  const timerRef              = useRef(null);

  const goTo = (idx, direction = 1) => {
    if (sliding || idx === cur) return;
    clearInterval(timerRef.current);
    setDir(direction);
    setPrev(cur);
    setSlide(true);
    setCur(idx);
    setTimeout(() => { setPrev(null); setSlide(false); }, 500);
  };

  const next = () => goTo((cur + 1) % SLIDES.length, 1);
  const back = () => goTo((cur - 1 + SLIDES.length) % SLIDES.length, -1);

  useEffect(() => {
    timerRef.current = setInterval(next, 4800);
    return () => clearInterval(timerRef.current);
  }, [cur, sliding]);

  const slide = SLIDES[cur];

  return (
    <div style={{ position:"relative", borderRadius:20, overflow:"hidden", marginBottom:20, boxShadow:"0 10px 40px rgba(0,0,0,0.22)" }}>
      <style>{`
        @keyframes slideInRight { from { transform:translateX(60px); opacity:0; } to { transform:translateX(0); opacity:1; } }
        @keyframes slideInLeft  { from { transform:translateX(-60px);opacity:0; } to { transform:translateX(0); opacity:1; } }
        @keyframes fadeUp       { from { transform:translateY(14px); opacity:0; } to { transform:translateY(0); opacity:1; } }
        .slide-in-r { animation: slideInRight 0.5s cubic-bezier(.22,.68,0,1.2) forwards; }
        .slide-in-l { animation: slideInLeft  0.5s cubic-bezier(.22,.68,0,1.2) forwards; }
        .fade-up    { animation: fadeUp 0.45s ease forwards; }
        .slider-arrow:hover { transform: translateY(-50%) scale(1.12) !important; }
      `}</style>

      {/* Image layer */}
      <div key={cur} className={sliding ? (dir>0 ? "slide-in-r" : "slide-in-l") : ""}
        style={{ height:220, backgroundImage:`url(${slide.url})`, backgroundSize:"cover", backgroundPosition:"center", position:"relative" }}>

        {/* Gradient overlay */}
        <div style={{ position:"absolute", inset:0, background:`linear-gradient(160deg, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.72) 100%)` }}/>

        {/* Slide counter pill */}
        <div style={{ position:"absolute", top:12, right:14, background:"rgba(0,0,0,0.5)", borderRadius:20, padding:"3px 12px", backdropFilter:"blur(4px)" }}>
          <span style={{ color:"#fff", fontSize:11, fontWeight:700 }}>{cur+1} / {SLIDES.length}</span>
        </div>

        {/* Text content */}
        <div key={cur + "-text"} className="fade-up"
          style={{ position:"absolute", bottom:0, left:0, right:0, padding:"20px 20px 18px" }}>
          <h3 style={{ margin:"0 0 5px", fontSize:21, fontWeight:900, color:"#fff", lineHeight:1.2, textShadow:"0 2px 10px rgba(0,0,0,0.5)" }}>
            {slide.headline}
          </h3>
          <p style={{ margin:"0 0 14px", fontSize:13, color:"rgba(255,255,255,0.88)", lineHeight:1.45 }}>
            {slide.sub}
          </p>
          <button onClick={() => onNav(slide.cta)}
            style={{ padding:"8px 20px", background:slide.accent, color:"#fff", border:"none", borderRadius:9, fontWeight:800, fontSize:13, cursor:"pointer", boxShadow:`0 4px 14px ${slide.accent}99`, letterSpacing:.2 }}>
            {slide.ctaLabel} →
          </button>
        </div>

        {/* Arrow buttons */}
        <button className="slider-arrow" onClick={back}
          style={{ position:"absolute", left:10, top:"50%", transform:"translateY(-50%)", width:34, height:34, borderRadius:"50%", background:"rgba(255,255,255,0.22)", border:"1.5px solid rgba(255,255,255,0.4)", backdropFilter:"blur(6px)", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", color:"#fff", fontSize:16, fontWeight:900, transition:"transform 0.2s" }}>‹</button>
        <button className="slider-arrow" onClick={next}
          style={{ position:"absolute", right:10, top:"50%", transform:"translateY(-50%)", width:34, height:34, borderRadius:"50%", background:"rgba(255,255,255,0.22)", border:"1.5px solid rgba(255,255,255,0.4)", backdropFilter:"blur(6px)", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", color:"#fff", fontSize:16, fontWeight:900, transition:"transform 0.2s" }}>›</button>
      </div>

      {/* Dot indicators */}
      <div style={{ display:"flex", justifyContent:"center", alignItems:"center", gap:6, padding:"10px 0", background:"#fff" }}>
        {SLIDES.map((s, i) => (
          <button key={i} onClick={() => goTo(i, i > cur ? 1 : -1)}
            style={{ width:i===cur?28:8, height:8, borderRadius:4, background:i===cur?slide.accent:"#d0d0d0", border:"none", cursor:"pointer", padding:0, transition:"all 0.35s ease" }}/>
        ))}
      </div>
    </div>
  );
}

// ─── HOME / DASHBOARD ─────────────────────────────────────────────────────────
function HomePage({ user, orders, onNav }) {
  const mine   = user.role==="agent" ? orders.filter(o=>o.agent===user.name) : orders;
  const rev    = mine.filter(o=>o.status==="success").reduce((s,o)=>s+o.amount,0);
  const recent = mine.slice(0,5);

  return (
    <div>
      {/* Animated tagline */}
      <div style={{ textAlign:"center", marginBottom:14, padding:"10px 16px", background:"#fff", borderRadius:14, border:"1.5px solid #e8eaf0", boxShadow:"0 2px 8px rgba(0,0,0,0.04)" }}>
        <AnimatedText />
      </div>

      {/* Image Slider */}
      <ImageSlider onNav={onNav} />

      {/* Hero greeting card */}
      <Card style={{ padding:24, marginBottom:20, background:`linear-gradient(135deg,${GREEN} 0%,${GREEN_DARK} 100%)`, border:"none" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:20 }}>
          <div>
            <p style={{ margin:"0 0 2px", fontSize:13, color:"rgba(255,255,255,0.75)", fontWeight:500 }}>{greet()},</p>
            <h2 style={{ margin:0, fontSize:24, fontWeight:900, color:"#fff" }}>{user.name}</h2>
            {user.role==="admin"&&<span style={{ background:"rgba(255,255,255,0.2)", color:"#fff", fontSize:10, fontWeight:700, padding:"2px 10px", borderRadius:20, display:"inline-block", marginTop:4 }}>ADMIN</span>}
          </div>
          <div style={{ width:46, height:46, borderRadius:14, background:"rgba(255,255,255,0.2)", display:"flex", alignItems:"center", justifyContent:"center" }}>
            <Icon name="user" size={22} color="#fff"/>
          </div>
        </div>
        {/* Live bar */}
        <div style={{ background:"rgba(255,255,255,0.15)", borderRadius:12, padding:"12px 16px" }}>
          <div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:12 }}>
            <div style={{ width:8, height:8, borderRadius:"50%", background:"#fff" }}/>
            <span style={{ color:"rgba(255,255,255,0.9)", fontSize:11, fontWeight:700, letterSpacing:1 }}>LIVE</span>
            <Icon name="clock" size={12} color="rgba(255,255,255,0.6)"/>
            <span style={{ color:"rgba(255,255,255,0.6)", fontSize:11, marginLeft:2 }}>{new Date().toLocaleTimeString()}</span>
          </div>
          <div style={{ display:"flex", flexWrap:"wrap", gap:8 }}>
            {[["plus","Top up","topup"],["package","Orders","orders"],["list","Transactions","orders"],["layers","Bulk","buy"],["store","Store","home"]].map(([ic,lb,nav])=>(
              <button key={lb} onClick={()=>onNav(nav)} style={{ display:"flex", alignItems:"center", gap:6, padding:"7px 12px", background:"rgba(255,255,255,0.15)", border:"1px solid rgba(255,255,255,0.2)", borderRadius:8, color:"#fff", fontSize:12, fontWeight:600, cursor:"pointer" }}>
                <Icon name={ic} size={13} color="#fff"/>{lb}
              </button>
            ))}
          </div>
        </div>
      </Card>

      {/* Stats */}
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginBottom:20 }}>
        <StatCard icon="wallet"   label="Balance"     value={ghs(user.balance||0)} accent={GREEN}    onClick={()=>onNav("topup")}/>
        <StatCard icon="package"  label="Orders"      value={mine.length}          accent="#6366f1"  onClick={()=>onNav("orders")}/>
        <StatCard icon="activity" label="GB Sold"     value="12.0 GB"              accent="#0ea5e9"  onClick={()=>onNav("orders")}/>
        <StatCard icon="dollar"   label="Revenue"     value={ghs(rev)}             accent="#f59e0b"  onClick={()=>onNav("orders")}/>
      </div>

      {/* Place new order — Network logos */}
      <Card style={{ padding:20, marginBottom:20 }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
          <h3 style={{ margin:0, fontSize:16, fontWeight:800, color:"#0d1117" }}>Place New Order</h3>
          <span style={{ fontSize:13, color:"#888" }}>Pick a network</span>
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:12 }}>
          {Object.keys(PACKAGES).map(net=>(
            <div key={net} onClick={()=>onNav("buy",net)} style={{ border:`2px solid ${NET_BORDER[net]}`, borderRadius:16, padding:"16px 10px", cursor:"pointer", textAlign:"center", background:NET_BG[net], transition:"box-shadow .15s" }}>
              <div style={{ display:"flex", justifyContent:"center", marginBottom:10 }}>
                <NetworkLogo net={net} size={44}/>
              </div>
              <p style={{ margin:"0 0 2px", fontWeight:800, fontSize:14, color:NET_TEXT[net] }}>{net}</p>
              <p style={{ margin:0, fontSize:11, color:"#888" }}>Tap to buy</p>
            </div>
          ))}
        </div>
      </Card>

      {/* Quick actions */}
      <Card style={{ padding:20, marginBottom:20 }}>
        <h3 style={{ margin:"0 0 16px", fontSize:16, fontWeight:800, color:"#0d1117" }}>Quick Actions</h3>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:10 }}>
          {[
            { icon:"package",    label:"Order",    nav:"buy",    accent:GREEN   },
            { icon:"barchart",   label:"Reports",  nav:"orders", accent:"#6366f1" },
            { icon:"layers",     label:"Bulk",     nav:"buy",    accent:"#0ea5e9" },
            { icon:"creditcard", label:"Top Up",   nav:"topup",  accent:"#f59e0b" },
            { icon:"list",       label:"Trans",    nav:"orders", accent:"#10b981" },
            { icon:"info",       label:"Support",  nav:"home",   accent:"#6366f1" },
            { icon:"store",      label:"Store",    nav:"home",   accent:"#f43f5e" },
            { icon:"user",       label:"Profile",  nav:"home",   accent:"#0ea5e9" },
          ].map(a=>(
            <button key={a.label} onClick={()=>onNav(a.nav)} style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:6, padding:"12px 6px", background:"#fafafa", border:"1.5px solid #e8eaf0", borderRadius:14, cursor:"pointer" }}>
              <div style={{ width:42, height:42, borderRadius:12, background:`${a.accent}15`, display:"flex", alignItems:"center", justifyContent:"center" }}>
                <Icon name={a.icon} size={19} color={a.accent}/>
              </div>
              <span style={{ fontSize:11, color:"#555", fontWeight:600 }}>{a.label}</span>
            </button>
          ))}
        </div>
      </Card>

      {/* Recent orders */}
      <Card style={{ padding:20, marginBottom:20 }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
          <div style={{ display:"flex", alignItems:"center", gap:8 }}>
            <h3 style={{ margin:0, fontSize:16, fontWeight:800, color:"#0d1117" }}>Recent Orders</h3>
            <span style={{ background:GREEN_LIGHT, color:GREEN_DARK, fontSize:11, fontWeight:700, padding:"2px 8px", borderRadius:20 }}>{recent.length}</span>
          </div>
          <button onClick={()=>onNav("orders")} style={{ background:"none", border:"none", color:GREEN, fontSize:13, fontWeight:700, cursor:"pointer", display:"flex", alignItems:"center", gap:4 }}>
            View all <Icon name="arrowright" size={14} color={GREEN}/>
          </button>
        </div>
        {recent.length===0 && <p style={{ textAlign:"center", color:"#bbb", padding:"20px 0" }}>No orders yet</p>}
        {recent.map(o=>(
          <div key={o.id} onClick={()=>onNav("orders")} style={{ display:"flex", alignItems:"center", gap:12, padding:"11px 0", borderBottom:"1px solid #f3f4f6", cursor:"pointer" }}>
            <NetworkLogo net={o.network} size={38}/>
            <div style={{ flex:1, minWidth:0 }}>
              <p style={{ margin:0, fontWeight:700, color:"#0d1117", fontSize:14 }}>{o.phone}</p>
              <p style={{ margin:0, fontSize:12, color:"#888" }}>{o.bundle} · {o.date}</p>
            </div>
            <div style={{ textAlign:"right" }}>
              <p style={{ margin:"0 0 3px", fontWeight:800, color:"#0d1117", fontSize:14 }}>{ghs(o.amount)}</p>
              <Badge status={o.status}/>
            </div>
          </div>
        ))}
      </Card>
    </div>
  );
}

// ─── BUY DATA PAGE ────────────────────────────────────────────────────────────
function BuyPage({ user, onOrder, defaultNet, onNav }) {
  const [net,    setNet]    = useState(defaultNet||"MTN");
  const [pkg,    setPkg]    = useState(null);
  const [recip,  setRecip]  = useState("");
  const [step,   setStep]   = useState(1);
  const [busy,   setBusy]   = useState(false);
  const [ref,    setRef]    = useState("");

  const inp = { width:"100%", padding:"12px 14px 12px 42px", border:"1.5px solid #e0e0e0", borderRadius:12, fontSize:15, color:"#0d1117", outline:"none", boxSizing:"border-box", background:"#fafafa" };

  async function process() {
    if(!recip||recip.length<10){ alert("Enter a valid 10-digit recipient number"); return; }
    setBusy(true);
    try {
      await loadPaystack();
      const handler = window.PaystackPop.setup({
        key:      PAYSTACK_PUBLIC_KEY,
        email:    (user.email || user.phone + "@mcdata.app"),
        amount:   pkg.price * 100,
        currency: "GHS",
        ref:      "ORD" + Date.now(),
        metadata: { agent:user.name, network:net, bundle:pkg.label, recipient:recip },
        callback: function(response) {
          const id = response.reference;
          setRef(id);
          onOrder({ id, agent:user.name, network:net, bundle:pkg.label, phone:recip, amount:pkg.price, status:"success", date:new Date().toLocaleString() });
          setBusy(false);
          setStep(3);
        },
        onClose: function() {
          setBusy(false);
          alert("Payment cancelled. Try again when ready.");
        },
      });
      handler.openIframe();
    } catch(e) {
      setBusy(false);
      alert("Could not load payment. Check your connection and try again.");
    }
  }

  if(step===3) return (
    <div style={{ display:"flex", flexDirection:"column", alignItems:"center", padding:"48px 24px", textAlign:"center" }}>
      <div style={{ width:80, height:80, borderRadius:"50%", background:GREEN_LIGHT, border:`2px solid ${GREEN_BORDER}`, display:"flex", alignItems:"center", justifyContent:"center", marginBottom:20 }}>
        <Icon name="checkcircle" size={38} color={GREEN}/>
      </div>
      <h2 style={{ margin:"0 0 8px", fontSize:24, fontWeight:900, color:"#0d1117" }}>Order Successful!</h2>
      <p style={{ color:"#555", margin:"0 0 4px" }}>{pkg.label} {net} data sent to <strong>{recip}</strong></p>
      <p style={{ color:"#888", fontSize:13 }}>Ref: {ref} · {ghs(pkg.price)}</p>
      <div style={{ display:"flex", gap:12, marginTop:28 }}>
        <Btn variant="outline" onClick={()=>{setStep(1);setPkg(null);setRecip("");}}>Buy Again</Btn>
        <Btn onClick={()=>onNav("orders")}>View Orders</Btn>
      </div>
    </div>
  );

  if(step===2) return (
    <div>
      <PageHeader title="Confirm Order" subtitle="Review your order before paying" onBack={()=>setStep(1)}/>
      <Card style={{ padding:0, marginBottom:20, overflow:"hidden" }}>
        <div style={{ height:4, background:`linear-gradient(90deg,${NET_COLOR[net]},${GREEN})` }}/>
        <div style={{ padding:20 }}>
          <div style={{ display:"flex", alignItems:"center", gap:14, marginBottom:20, paddingBottom:16, borderBottom:"1px solid #f3f4f6" }}>
            <NetworkLogo net={net} size={52}/>
            <div>
              <p style={{ margin:0, fontWeight:900, fontSize:18, color:"#0d1117" }}>{pkg.label} {net}</p>
              <p style={{ margin:0, color:"#888", fontSize:13 }}>Validity: {pkg.validity}</p>
            </div>
          </div>
          {[["Network",net],["Bundle Size",pkg.label],["Validity",pkg.validity],["Recipient",recip],["Amount to Pay",ghs(pkg.price)]].map(([l,v])=>(
            <div key={l} style={{ display:"flex", justifyContent:"space-between", padding:"10px 0", borderBottom:"1px solid #f3f4f6" }}>
              <span style={{ color:"#888", fontSize:14 }}>{l}</span>
              <span style={{ fontWeight:700, color:"#0d1117", fontSize:14 }}>{v}</span>
            </div>
          ))}
        </div>
      </Card>
      <Btn onClick={process} disabled={busy} style={{ width:"100%" }}>
        {busy?"Processing…":`Confirm & Pay ${ghs(pkg.price)}`}
      </Btn>
    </div>
  );

  return (
    <div>
      <PageHeader title="Buy Data Bundle" subtitle="Select a network and bundle"/>

      {/* Network selector with logos */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:12, marginBottom:24 }}>
        {Object.keys(PACKAGES).map(n=>(
          <div key={n} onClick={()=>{setNet(n);setPkg(null);}} style={{ border:`2px solid ${net===n?NET_COLOR[n]:NET_BORDER[n]}`, borderRadius:16, padding:"14px 10px", cursor:"pointer", textAlign:"center", background:net===n?NET_BG[n]:"#fff", transition:"all .15s" }}>
            <div style={{ display:"flex", justifyContent:"center", marginBottom:8 }}>
              <NetworkLogo net={n} size={42}/>
            </div>
            <p style={{ margin:0, fontWeight:800, fontSize:13, color:net===n?NET_TEXT[n]:"#555" }}>{n}</p>
          </div>
        ))}
      </div>

      {/* Bundle grid */}
      <h4 style={{ margin:"0 0 12px", fontSize:14, fontWeight:700, color:"#555" }}>Select Bundle</h4>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(130px,1fr))", gap:10, marginBottom:24 }}>
        {PACKAGES[net].map(p=>(
          <div key={p.id} onClick={()=>setPkg(p)} style={{ border:`2px solid ${pkg?.id===p.id?NET_COLOR[net]:NET_BORDER[net]}`, borderRadius:14, padding:"14px 12px", cursor:"pointer", background:pkg?.id===p.id?NET_BG[net]:"#fff", transition:"all .15s" }}>
            <p style={{ margin:"0 0 2px", fontSize:22, fontWeight:900, color:"#0d1117" }}>{p.label}</p>
            <p style={{ margin:"0 0 8px", fontSize:11, color:"#888" }}>{p.validity}</p>
            <p style={{ margin:0, fontSize:16, fontWeight:800, color:NET_TEXT[net] }}>{ghs(p.price)}</p>
          </div>
        ))}
      </div>

      {/* Recipient */}
      <h4 style={{ margin:"0 0 10px", fontSize:14, fontWeight:700, color:"#555" }}>Recipient Number</h4>
      <div style={{ position:"relative", marginBottom:20 }}>
        <div style={{ position:"absolute", left:13, top:"50%", transform:"translateY(-50%)" }}><Icon name="phone" size={16} color="#aaa"/></div>
        <input value={recip} onChange={e=>setRecip(e.target.value)} placeholder="0241234567" type="tel" style={inp}/>
      </div>

      <Btn onClick={()=>{if(!pkg){alert("Select a bundle");return;} if(!recip||recip.length<10){alert("Enter recipient number");return;} setStep(2);}} style={{ width:"100%" }}>
        {pkg?`Continue — ${ghs(pkg.price)}`:"Select a bundle to continue"}
      </Btn>
    </div>
  );
}

// ─── ORDERS PAGE ──────────────────────────────────────────────────────────────
function OrdersPage({ orders, userRole, onNav }) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const filtered = orders.filter(o => {
    const q = search.toLowerCase();
    const matchQ = o.phone.includes(q)||o.network.toLowerCase().includes(q)||o.id.toLowerCase().includes(q)||o.agent.toLowerCase().includes(q)||o.bundle.toLowerCase().includes(q);
    const matchF = filter==="all"||o.status===filter;
    return matchQ&&matchF;
  });

  const rev = filtered.filter(o=>o.status==="success").reduce((s,o)=>s+o.amount,0);

  return (
    <div>
      <PageHeader title={userRole==="admin"?"All Orders":"My Orders"} subtitle={`${filtered.length} orders · ${ghs(rev)} revenue`}/>

      {/* Summary row */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:12, marginBottom:20 }}>
        <StatCard icon="package" label="Total"   value={filtered.length} accent={GREEN}/>
        <StatCard icon="checkcircle" label="Success" value={filtered.filter(o=>o.status==="success").length} accent="#10b981"/>
        <StatCard icon="dollar"  label="Revenue" value={ghs(rev)} accent="#f59e0b"/>
      </div>

      {/* Filters */}
      <Card style={{ padding:16, marginBottom:16 }}>
        <div style={{ display:"flex", gap:10, flexWrap:"wrap", alignItems:"center" }}>
          <div style={{ position:"relative", flex:1, minWidth:160 }}>
            <div style={{ position:"absolute", left:12, top:"50%", transform:"translateY(-50%)" }}><Icon name="search" size={14} color="#aaa"/></div>
            <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search orders…" style={{ width:"100%", padding:"9px 14px 9px 34px", border:"1.5px solid #e0e0e0", borderRadius:10, fontSize:13, outline:"none", boxSizing:"border-box" }}/>
          </div>
          {["all","success","pending","failed"].map(f=>(
            <button key={f} onClick={()=>setFilter(f)} style={{ padding:"8px 14px", borderRadius:10, border:`1.5px solid ${filter===f?GREEN:NET_BORDER.MTN}`, background:filter===f?GREEN_LIGHT:"#fff", color:filter===f?GREEN_DARK:"#666", fontWeight:600, fontSize:12, cursor:"pointer", textTransform:"capitalize" }}>{f}</button>
          ))}
        </div>
      </Card>

      {/* Table */}
      <Card style={{ overflow:"hidden" }}>
        {filtered.length===0 ? (
          <div style={{ padding:"48px 24px", textAlign:"center" }}>
            <Icon name="package" size={40} color="#e0e0e0"/>
            <p style={{ color:"#bbb", marginTop:12, fontSize:15 }}>No orders found</p>
          </div>
        ) : (
          <div style={{ overflowX:"auto" }}>
            <table style={{ width:"100%", borderCollapse:"collapse", fontSize:13 }}>
              <thead>
                <tr style={{ background:"#f8f9fb", borderBottom:"1.5px solid #e8eaf0" }}>
                  {["Ref","Date",...(userRole==="admin"?["Agent"]:[]),"Network","Bundle","Recipient","Amount","Status"].map(h=>(
                    <th key={h} style={{ textAlign:"left", padding:"10px 14px", color:"#888", fontWeight:700, fontSize:11, textTransform:"uppercase", letterSpacing:.5, whiteSpace:"nowrap" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((o,i)=>(
                  <tr key={o.id} style={{ borderBottom:"1px solid #f3f4f6", background:i%2===0?"#fff":"#fafafa" }}>
                    <td style={{ padding:"12px 14px", fontWeight:700, color:GREEN, whiteSpace:"nowrap" }}>{o.id}</td>
                    <td style={{ padding:"12px 14px", color:"#888", whiteSpace:"nowrap" }}>{o.date}</td>
                    {userRole==="admin"&&<td style={{ padding:"12px 14px", fontWeight:600, whiteSpace:"nowrap" }}>{o.agent}</td>}
                    <td style={{ padding:"12px 14px" }}>
                      <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                        <NetworkLogo net={o.network} size={26}/>
                        <span style={{ fontWeight:600, color:NET_TEXT[o.network] }}>{o.network}</span>
                      </div>
                    </td>
                    <td style={{ padding:"12px 14px", fontWeight:700 }}>{o.bundle}</td>
                    <td style={{ padding:"12px 14px", color:"#555" }}>{o.phone}</td>
                    <td style={{ padding:"12px 14px", fontWeight:800 }}>{ghs(o.amount)}</td>
                    <td style={{ padding:"12px 14px" }}><Badge status={o.status}/></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}

// ─── AGENTS PAGE ──────────────────────────────────────────────────────────────
function AgentsPage({ orders, onNav }) {
  const [agents, setAgents] = useState([]);
  useEffect(() => {
    supabase.from("users").select("*").eq("role","agent").then(({data})=>{ if(data) setAgents(data); });
  }, []);
  return (
    <div>
      <PageHeader title="Agent Management" subtitle={`${agents.length} active agents`} action={
        <Btn onClick={()=>onNav("topup")}><Icon name="plus" size={15} color="#fff"/>Top-Up Agent</Btn>
      }/>

      {/* Summary */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:12, marginBottom:20 }}>
        <StatCard icon="users"   label="Agents"       value={agents.length} accent={GREEN}/>
        <StatCard icon="package" label="Total Orders"  value={orders.length} accent="#6366f1"/>
        <StatCard icon="dollar"  label="Total Revenue" value={ghs(orders.reduce((s,o)=>s+o.amount,0))} accent="#f59e0b"/>
      </div>

      {/* Agent cards */}
      <div style={{ display:"grid", gap:14 }}>
        {agents.map(a=>{
          const ao = orders.filter(o=>o.agent===a.name);
          const tot = ao.reduce((s,o)=>s+o.amount,0);
          const nets = [...new Set(ao.map(o=>o.network))];
          return (
            <Card key={a.id} style={{ padding:20 }}>
              <div style={{ display:"flex", alignItems:"center", gap:16, marginBottom:16 }}>
                <div style={{ width:52, height:52, borderRadius:16, background:GREEN_LIGHT, border:`2px solid ${GREEN_BORDER}`, display:"flex", alignItems:"center", justifyContent:"center", fontWeight:900, fontSize:20, color:GREEN_DARK, flexShrink:0 }}>
                  {a.name.split(" ").map(w=>w[0]).join("").slice(0,2)}
                </div>
                <div style={{ flex:1 }}>
                  <p style={{ margin:0, fontWeight:800, fontSize:16, color:"#0d1117" }}>{a.name}</p>
                  <p style={{ margin:0, fontSize:13, color:"#888" }}>{a.phone}</p>
                </div>
                <div style={{ textAlign:"right" }}>
                  <p style={{ margin:0, fontWeight:900, fontSize:18, color:GREEN_DARK }}>{ghs(tot)}</p>
                  <p style={{ margin:0, fontSize:12, color:"#888" }}>{ao.length} orders</p>
                </div>
              </div>
              {/* Stats row */}
              <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:10 }}>
                {[["Balance",ghs(a.balance||0),"#f59e0b"],["Orders",ao.length,GREEN],["Networks",nets.length,"#6366f1"]].map(([l,v,c])=>(
                  <div key={l} style={{ background:"#fafafa", borderRadius:10, padding:"10px 12px", border:"1px solid #e8eaf0" }}>
                    <p style={{ margin:"0 0 2px", fontSize:11, color:"#888", fontWeight:600 }}>{l}</p>
                    <p style={{ margin:0, fontWeight:800, fontSize:16, color:c }}>{v}</p>
                  </div>
                ))}
              </div>
              {/* Networks used */}
              {nets.length>0 && (
                <div style={{ display:"flex", gap:8, marginTop:12 }}>
                  {nets.map(n=><NetworkLogo key={n} net={n} size={28}/>)}
                </div>
              )}
              <div style={{ display:"flex", gap:8, marginTop:12 }}>
                <Btn variant="outline" onClick={()=>onNav("topup")} style={{ flex:1, padding:"9px 0" }}><Icon name="creditcard" size={14} color={GREEN}/>Top-Up</Btn>
                <Btn variant="ghost" onClick={()=>onNav("orders")} style={{ flex:1, padding:"9px 0" }}><Icon name="list" size={14} color="#555"/>Orders</Btn>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

// ─── TOP-UP PAGE ──────────────────────────────────────────────────────────────
function TopUpPage({ onNav }) {
  const [agentId, setAgId] = useState("");
  const [amount,  setAmt]  = useState("");
  const [done,    setDone] = useState(false);
  const [agents,  setAgents] = useState([]);
  useEffect(() => {
    supabase.from("users").select("*").eq("role","agent").then(({data})=>{ if(data) setAgents(data); });
  }, []);
  const selected = agents.find(a=>a.id===Number(agentId));

  async function handle() {
    if(!selected||!amount||isNaN(amount)||Number(amount)<1){ alert("Select an agent and enter a valid amount"); return; }
    const newBal = (selected.balance||0) + Number(amount);
    const { error } = await supabase.from("users").update({ balance: newBal }).eq("id", selected.id);
    if (!error) {
      setAgents(prev => prev.map(a => a.id===selected.id ? {...a, balance: newBal} : a));
      setDone(true); setAmt(""); setTimeout(()=>setDone(false),4000);
    } else {
      alert("Top-up failed. Please try again.");
    }
  }

  const inp2 = { width:"100%", padding:"12px 14px 12px 42px", border:"1.5px solid #e0e0e0", borderRadius:12, fontSize:15, color:"#0d1117", outline:"none", boxSizing:"border-box", background:"#fafafa" };

  return (
    <div>
      <PageHeader title="Top-Up Agent Balance" subtitle="Credit an agent's wallet" onBack={()=>onNav("agents")}/>

      {/* Agent selector cards */}
      <h4 style={{ margin:"0 0 12px", fontSize:14, fontWeight:700, color:"#555" }}>Select Agent</h4>
      <div style={{ display:"grid", gap:10, marginBottom:20 }}>
        {agents.map(a=>(
          <div key={a.id} onClick={()=>setAgId(String(a.id))} style={{ display:"flex", alignItems:"center", gap:14, padding:"14px 16px", border:`2px solid ${agentId===String(a.id)?GREEN:NET_BORDER.MTN}`, borderRadius:14, cursor:"pointer", background:agentId===String(a.id)?GREEN_LIGHT:"#fff" }}>
            <div style={{ width:44, height:44, borderRadius:12, background:GREEN_LIGHT, border:`1.5px solid ${GREEN_BORDER}`, display:"flex", alignItems:"center", justifyContent:"center", fontWeight:800, color:GREEN_DARK, fontSize:16, flexShrink:0 }}>
              {a.name.split(" ").map(w=>w[0]).join("").slice(0,2)}
            </div>
            <div style={{ flex:1 }}>
              <p style={{ margin:0, fontWeight:700, color:"#0d1117" }}>{a.name}</p>
              <p style={{ margin:0, fontSize:12, color:"#888" }}>{a.phone}</p>
            </div>
            <div style={{ textAlign:"right" }}>
              <p style={{ margin:0, fontWeight:800, color:GREEN_DARK }}>{ghs(a.balance||0)}</p>
              <p style={{ margin:0, fontSize:11, color:"#888" }}>balance</p>
            </div>
            {agentId===String(a.id)&&<Icon name="checkcircle" size={20} color={GREEN}/>}
          </div>
        ))}
      </div>

      <Card style={{ padding:24 }}>
        <h4 style={{ margin:"0 0 16px", fontSize:15, fontWeight:700, color:"#0d1117" }}>Enter Amount</h4>
        <div style={{ position:"relative", marginBottom:6 }}>
          <div style={{ position:"absolute", left:13, top:"50%", transform:"translateY(-50%)", fontWeight:700, color:"#aaa", fontSize:14 }}>₵</div>
          <input value={amount} onChange={e=>setAmt(e.target.value)} placeholder="e.g. 100.00" type="number" min="1" style={inp2}/>
        </div>
        <p style={{ fontSize:12, color:"#aaa", marginBottom:20 }}>Minimum: GH₵10 · Instant credit</p>

        {done && (
          <div style={{ background:GREEN_LIGHT, border:`1.5px solid ${GREEN_BORDER}`, borderRadius:12, padding:"14px 16px", marginBottom:16, display:"flex", alignItems:"center", gap:10 }}>
            <Icon name="checkcircle" size={18} color={GREEN}/>
            <span style={{ fontWeight:700, color:GREEN_DARK }}>GH₵{amount} credited to {selected?.name} successfully!</span>
          </div>
        )}

        {/* Quick amount buttons */}
        <div style={{ display:"flex", gap:8, flexWrap:"wrap", marginBottom:20 }}>
          {["20","50","100","200","500"].map(v=>(
            <button key={v} onClick={()=>setAmt(v)} style={{ padding:"7px 16px", borderRadius:8, border:`1.5px solid ${amount===v?GREEN:NET_BORDER.MTN}`, background:amount===v?GREEN_LIGHT:"#fff", color:amount===v?GREEN_DARK:"#444", fontWeight:600, fontSize:13, cursor:"pointer" }}>GH₵{v}</button>
          ))}
        </div>

        <Btn onClick={handle} style={{ width:"100%" }}>
          <Icon name="creditcard" size={16} color="#fff"/>
          Credit {amount?`GH₵${amount} to `:"Agent Balance"}{selected?.name||""}
        </Btn>
      </Card>
    </div>
  );
}

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
export default function App() {
  const [user,    setUser]    = useState(null);
  const [page,    setPage]    = useState("home");
  const [orders,  setOrders]  = useState(ORDERS);
  const [menuOpen,setMenu]    = useState(false);
  const [buyNet,  setBuyNet]  = useState(null);

  function addOrder(o) { setOrders(prev=>[o,...prev]); }
  function nav(p, net=null) { setPage(p); if(net) setBuyNet(net); window.scrollTo(0,0); }

  if(!user) return <AuthPage onLogin={u=>{setUser(u);setPage("home");}}/>;

  return (
    <div style={{ minHeight:"100vh", background:"#f5f6fa", fontFamily:"'DM Sans',system-ui,sans-serif", paddingBottom:80 }}>
      <TopNav user={user} onMenu={()=>setMenu(true)} onNav={nav}/>
      {menuOpen && <SideMenu user={user} onClose={()=>setMenu(false)} onNav={nav} onLogout={()=>setUser(null)}/>}

      <div style={{ maxWidth:860, margin:"0 auto", padding:"24px 16px" }}>
        {page==="home"   && <HomePage  user={user} orders={orders} onNav={nav}/>}
        {page==="buy"    && <BuyPage   user={user} onOrder={addOrder} defaultNet={buyNet} onNav={nav}/>}
        {page==="orders" && <OrdersPage orders={user.role==="agent"?orders.filter(o=>o.agent===user.name):orders} userRole={user.role} onNav={nav}/>}
        {page==="agents" && user.role==="admin" && <AgentsPage orders={orders} onNav={nav}/>}
        {page==="topup"  && user.role==="admin" && <TopUpPage onNav={nav}/>}
      </div>

      <BottomNav tab={page} user={user} onNav={nav}/>
    </div>
  );
}


