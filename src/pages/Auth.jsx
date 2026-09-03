import { useState } from "react";
import { motion } from "framer-motion";

export default function Auth() {
  const [mode, setMode] = useState("login");
  const [remember, setRemember] = useState(false);
  const [policy, setPolicy] = useState(false);

  return (
    <section className="mx-auto max-w-md px-6 py-12">
      <div className="flex gap-2 rounded-full bg-[#eef4ec] p-1 mb-6">
        <button onClick={() => setMode("login")} className={`flex-1 rounded-full py-2 text- font-bold ${mode==="login"?"bg-[#0f2e1f] text-white":"text-[#0f2e1f]/60"}`}>ВХОД</button>
        <button onClick={() => setMode("register")} className={`flex-1 rounded-full py-2 text- font-bold ${mode==="register"?"bg-[#0f2e1f] text-white":"text-[#0f2e1f]/60"}`}>РЕГИСТРАЦИЯ</button>
      </div>

      <motion.div key={mode} initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} className="rounded-xl border border-black/10 bg-white p-5">
        <div className="flex flex-col gap-4">
          <input type="email" placeholder="Имейл" className="w-full rounded-lg border border-black/10 bg-[#f6f9f5] px-4 py-2.5 text- focus:outline-none" />
          <input type="password" placeholder="Парола" className="w-full rounded-lg border border-black/10 bg-[#f6f9f5] px-4 py-2.5 text- focus:outline-none" />

          {mode==="register" && (
            <>
              <input type="password" placeholder="Потвърди паролата" className="w-full rounded-lg border border-black/10 bg-[#f6f9f5] px-4 py-2.5 text- focus:outline-none" />

              <div onClick={() => setPolicy(!policy)} style={{display:'flex', alignItems:'flex-start', gap:'8px', cursor:'pointer', userSelect:'none', marginTop:'4px'}}>
                <div style={{
                  width:'20px',
                  height:'20px',
                  minWidth:'20px',
                  borderRadius:'6px',
                  border:'2px solid #1e4d2b',
                  backgroundColor: policy? '#1e4d2b' : '#ffffff',
                  display:'flex',
                  alignItems:'center',
                  justifyContent:'center',
                  marginTop:'1px'
                }}>
                  {policy && <span style={{color:'white', fontSize:'12px', fontWeight:'900', lineHeight:1}}>✓</span>}
                </div>
                <span style={{fontSize:'12px', lineHeight:'16px', color:'#0f2e1f'}}>
                  Приемам <a href="/privacy-policy" onClick={(e)=>e.stopPropagation()} style={{fontWeight:700, color:'#1e4d2b', textDecoration:'underline'}}>Политика за поверителност</a> и <a href="/terms" onClick={(e)=>e.stopPropagation()} style={{fontWeight:700, color:'#1e4d2b', textDecoration:'underline'}}>Общи условия</a>
                </span>
              </div>
            </>
          )}

          {mode==="login" && (
            <div className="flex items-center justify-between">
              <div onClick={() => setRemember(!remember)} style={{display:'flex', alignItems:'center', gap:'8px', cursor:'pointer', userSelect:'none'}}>
                <div style={{
                  width:'20px',
                  height:'20px',
                  borderRadius:'6px',
                  border:'2px solid #1e4d2b',
                  backgroundColor: remember? '#1e4d2b' : '#ffffff',
                  display:'flex',
                  alignItems:'center',
                  justifyContent:'center',
                }}>
                  {remember && <span style={{color:'white', fontSize:'12px', fontWeight:'900', lineHeight:1}}>✓</span>}
                </div>
                <span style={{fontSize:'12px', fontWeight:500, color:'#0f2e1f'}}>Запомни ме</span>
              </div>
              <button type="button" style={{fontSize:'12px', fontWeight:700, color:'#1e4d2b'}}>Забравена парола?</button>
            </div>
          )}

          <button disabled={mode==="register" &&!policy} className={`mt-2 w-full rounded-full py-3 text- font-black text-white uppercase transition ${policy || mode==="login"? "bg-[#1e4d2b] hover:bg-[#0f2e1f]" : "bg-[#1e4d2b]/40 cursor-not-allowed"}`}>
            {mode==="login"?"Влез":"Създай профил"}
          </button>
        </div>
      </motion.div>
    </section>
  );
}