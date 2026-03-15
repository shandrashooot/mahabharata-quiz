'use client';

import { useState, useEffect, useRef } from "react";

const style = `
  @import url('https://fonts.googleapis.com/css2?family=Cinzel+Decorative:wght@400;700;900&family=Cinzel:wght@400;600;700&family=IM+Fell+English:ital@0;1&display=swap');

  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: #080603; }

  .quiz-root {
    min-height: 100vh;
    background: #080603;
    color: #F5E6C8;
    font-family: 'IM Fell English', serif;
    position: relative;
    overflow: hidden;
  }

  .mandala-bg {
    position: fixed;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    pointer-events: none;
    z-index: 0;
  }

  .mandala-ring {
    position: absolute;
    border-radius: 50%;
    border: 1px solid rgba(212,175,55,0.07);
  }

  .noise-overlay {
    position: fixed;
    inset: 0;
    pointer-events: none;
    z-index: 999;
    opacity: 0.04;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)'/%3E%3C/svg%3E");
  }

  @keyframes shimmer {
    0% { background-position: -300% center; }
    100% { background-position: 300% center; }
  }
  @keyframes floatUp {
    0% { opacity: 0; transform: translateY(28px); }
    100% { opacity: 1; transform: translateY(0); }
  }
  @keyframes wrongShake {
    0%,100% { transform: translateX(0); }
    15%,55% { transform: translateX(-9px); }
    35%,75% { transform: translateX(9px); }
  }
  @keyframes pulseGold {
    0%,100% { box-shadow: 0 0 20px rgba(212,175,55,0.3); }
    50% { box-shadow: 0 0 60px rgba(212,175,55,0.7); }
  }
  @keyframes rotateSlow {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
  @keyframes rotateSlowReverse {
    from { transform: rotate(0deg); }
    to { transform: rotate(-360deg); }
  }
  @keyframes introGlow {
    0%,100% { text-shadow: 0 0 20px rgba(212,175,55,0.3); }
    50% { text-shadow: 0 0 60px rgba(212,175,55,0.9), 0 0 120px rgba(212,175,55,0.4); }
  }
  @keyframes fadeIn {
    0% { opacity: 0; transform: translateY(10px); }
    100% { opacity: 1; transform: translateY(0); }
  }
  @keyframes particleFly {
    0% { transform: translate(0,0) scale(1); opacity: 1; }
    100% { transform: translate(var(--tx), var(--ty)) scale(0); opacity: 0; }
  }
  @keyframes glowPulse {
    0%,100% { box-shadow: 0 0 10px rgba(212,175,55,0.3), inset 0 0 10px rgba(212,175,55,0.05); }
    50% { box-shadow: 0 0 35px rgba(212,175,55,0.6), inset 0 0 20px rgba(212,175,55,0.08); }
  }
  @keyframes chakraSpin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
  @keyframes wave {
    0%,100% { height: 4px; }
    50% { height: 14px; }
  }

  .gold-text {
    background: linear-gradient(120deg, #C8981E 0%, #F4D03F 25%, #D4AF37 50%, #F4D03F 75%, #C8981E 100%);
    background-size: 300% auto;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    animation: shimmer 4s linear infinite;
  }

  .ornament::before, .ornament::after {
    content: '';
    flex: 1;
    height: 1px;
    background: linear-gradient(to right, transparent, rgba(212,175,55,0.4), transparent);
  }
  .ornament { display: flex; align-items: center; gap: 14px; }

  .quiz-btn {
    font-family: 'Cinzel', serif;
    letter-spacing: 0.35em;
    text-transform: uppercase;
    font-size: 11px;
    cursor: pointer;
    border: 1px solid rgba(212,175,55,0.6);
    color: #D4AF37;
    background: transparent;
    padding: 14px 44px;
    transition: all 0.3s ease;
  }
  .quiz-btn:hover:not(:disabled) {
    background: rgba(212,175,55,0.1);
    border-color: #D4AF37;
    box-shadow: 0 0 30px rgba(212,175,55,0.2);
  }
  .quiz-btn:disabled { opacity: 0.25; cursor: not-allowed; }

  .quiz-input {
    width: 100%;
    background: transparent;
    border: none;
    border-bottom: 2px solid rgba(212,175,55,0.25);
    text-align: center;
    color: #F5E6C8;
    font-family: 'IM Fell English', serif;
    font-style: italic;
    font-size: 1.25rem;
    padding: 12px 8px;
    transition: all 0.3s;
    outline: none;
  }
  .quiz-input::placeholder { color: rgba(245,230,200,0.2); }
  .quiz-input:focus { border-bottom-color: #D4AF37; }
  .quiz-input.wrong { border-bottom-color: #DC143C; color: #DC143C; animation: wrongShake 0.45s ease-in-out; }

  .progress-bar { height: 1px; background: rgba(212,175,55,0.08); }
  .progress-fill { height: 100%; background: linear-gradient(to right, #A0862A, #F4D03F); transition: width 0.7s ease; }

  .wrong-msg {
    font-family: 'IM Fell English', serif;
    font-style: italic;
    color: #DC143C;
    font-size: 0.8rem;
    min-height: 20px;
    text-align: center;
  }

  .score-badge {
    font-family: 'Cinzel', serif;
    letter-spacing: 0.15em;
    font-size: 0.7rem;
    color: #D4AF37;
  }

  .question-text {
    font-family: 'IM Fell English', serif;
    font-style: italic;
    font-size: 1.5rem;
    line-height: 1.65;
    color: #F5E6C8;
    animation: floatUp 0.5s ease-out forwards;
  }

  .era-tag {
    font-family: 'Cinzel', serif;
    letter-spacing: 0.35em;
    font-size: 0.65rem;
    text-transform: uppercase;
    color: rgba(212,175,55,0.45);
  }

  .hint-text {
    font-family: 'IM Fell English', serif;
    font-style: italic;
    color: rgba(212,175,55,0.4);
    font-size: 0.75rem;
    text-align: center;
    margin-top: 16px;
    animation: floatUp 0.4s ease-out forwards;
  }

  .chakra-ring-1 {
    position: absolute; width: 180px; height: 180px;
    border-radius: 50%; border: 1px solid rgba(212,175,55,0.2);
    animation: chakraSpin 12s linear infinite;
  }
  .chakra-ring-2 {
    position: absolute; width: 220px; height: 220px;
    border-radius: 50%; border: 1px dashed rgba(212,175,55,0.12);
    animation: rotateSlowReverse 18s linear infinite;
  }
  .chakra-ring-3 {
    position: absolute; width: 260px; height: 260px;
    border-radius: 50%; border: 1px solid rgba(212,175,55,0.07);
    animation: chakraSpin 25s linear infinite;
  }

  .whisper-card {
    display: flex;
    align-items: center;
    gap: 16px;
    margin-top: 20px;
    padding: 16px 20px;
    border: 1px solid rgba(212,175,55,0.55);
    background: rgba(212,175,55,0.07);
    box-shadow: 0 0 30px rgba(212,175,55,0.15);
    animation: glowPulse 3s ease-in-out infinite, fadeIn 0.7s ease-out forwards;
  }

  .whisper-avatar-wrap { position: relative; flex-shrink: 0; }

  .whisper-spin {
    position: absolute; inset: -5px;
    border-radius: 50%;
    border: 1px dashed rgba(212,175,55,0.4);
    animation: rotateSlow 6s linear infinite;
  }

  .whisper-avatar {
    width: 54px; height: 54px;
    border-radius: 50%; overflow: hidden;
    border: 2px solid rgba(212,175,55,0.8);
    box-shadow: 0 0 20px rgba(212,175,55,0.5);
  }
  .whisper-avatar img { width: 100%; height: 100%; object-fit: cover; object-position: top; }

  .whisper-name {
    font-family: 'Cinzel', serif;
    font-size: 0.62rem;
    letter-spacing: 0.3em;
    text-transform: uppercase;
    color: #D4AF37;
    margin-bottom: 5px;
    text-shadow: 0 0 12px rgba(212,175,55,0.6);
  }

  .whisper-quote {
    font-family: 'IM Fell English', serif;
    font-style: italic;
    font-size: 0.9rem;
    color: rgba(245,230,200,0.95);
    line-height: 1.65;
    text-shadow: 0 0 16px rgba(212,175,55,0.2);
  }

  .char-avatar {
    width: 72px; height: 72px;
    border-radius: 50%; overflow: hidden;
    border: 2px solid rgba(212,175,55,0.6);
    animation: pulseGold 2.5s ease-in-out infinite;
    position: relative; flex-shrink: 0;
  }
  .char-avatar img { width: 100%; height: 100%; object-fit: cover; object-position: top; }

  .char-spin-ring {
    position: absolute; inset: -6px;
    border-radius: 50%;
    border: 1px dashed rgba(212,175,55,0.3);
    animation: rotateSlow 8s linear infinite;
  }

  .char-name {
    font-family: 'Cinzel', serif;
    font-size: 0.75rem;
    letter-spacing: 0.25em;
    text-transform: uppercase;
    color: #D4AF37;
    margin-bottom: 2px;
    text-shadow: 0 0 12px rgba(212,175,55,0.5);
  }

  .char-title-text {
    font-family: 'Cinzel', serif;
    font-size: 0.55rem;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: rgba(212,175,55,0.5);
    margin-bottom: 6px;
  }

  .char-quote {
    font-family: 'IM Fell English', serif;
    font-style: italic;
    font-size: 0.88rem;
    color: rgba(245,230,200,0.8);
    line-height: 1.65;
    max-width: 380px;
    text-align: center;
  }

  .particle {
    position: absolute; border-radius: 50%;
    pointer-events: none;
    animation: particleFly 0.8s ease-out forwards;
  }

  /* Mute button */
  .mute-btn {
    position: fixed;
    bottom: 20px; right: 20px;
    z-index: 200;
    width: 44px; height: 44px;
    border-radius: 50%;
    border: 1px solid rgba(212,175,55,0.4);
    background: rgba(8,6,3,0.9);
    color: #D4AF37;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s;
    font-size: 1rem;
  }
  .mute-btn:hover { border-color: #D4AF37; box-shadow: 0 0 20px rgba(212,175,55,0.3); }

  .sound-wave {
    display: flex; align-items: center; gap: 3px; height: 16px;
  }
  .sound-wave span {
    display: block; width: 3px;
    background: #D4AF37; border-radius: 2px;
    animation: wave 1s ease-in-out infinite;
  }
  .sound-wave span:nth-child(2) { animation-delay: 0.1s; }
  .sound-wave span:nth-child(3) { animation-delay: 0.2s; }
  .sound-wave span:nth-child(4) { animation-delay: 0.3s; }
`;

const CHARACTERS = {
  krishna:      { name:"Krishna",      image:"/characters/krishna.png",      title:"The Divine Charioteer",  quote:"You have the right to perform your actions, but never to the fruits thereof." },
  arjuna:       { name:"Arjuna",       image:"/characters/arjuna.png",       title:"The Peerless Archer",     quote:"I will fight — not for glory, not for gain — but because dharma demands it." },
  bhishma:      { name:"Bhishma",      image:"/characters/bhishma.png",      title:"Grandsire of the Kurus",  quote:"He who conquers his own self is truly unconquerable." },
  yudhishthira: { name:"Yudhishthira", image:"/characters/yudhishthira.png", title:"The Dharmaraj",           quote:"Truth is my sword. Righteousness is my shield." },
  shakuni:      { name:"Shakuni",      image:"/characters/shakuni.png",      title:"The Cunning Gambler",     quote:"Every game is already won before the first dice is cast — in the mind." },
  vidura:       { name:"Vidura",       image:"/characters/vidura.png",       title:"The Wisest Counselor",    quote:"A fool speaks what he knows. A wise man knows what not to speak." },
  sahadeva:     { name:"Sahadeva",     image:"/characters/sahadeva.png",     title:"The Seer Among Pandavas", quote:"I knew. I always knew. But the curse of knowledge is knowing when silence must prevail." },
};

const QUESTIONS = [
  { id:1,  era:"Kurukshetra War",        question:"What was the sacred scripture spoken by Krishna to Arjuna on the battlefield of Kurukshetra?", accepted:["bhagavad gita","gita","bhagavadgita","the gita","the bhagavad gita"], char:CHARACTERS.krishna },
  { id:2,  era:"Kingdom of Hastinapura", question:"What terrible vow did Devavrata take that earned him the fearsome name Bhishma?",               accepted:["celibacy","brahmacharya","never to marry","lifelong celibacy","to never marry"], char:CHARACTERS.bhishma },
  { id:3,  era:"The Forest Exile",       question:"From which god did Arjuna receive the mighty Pashupatastra weapon?",                             accepted:["shiva","lord shiva","mahadeva","shiv"], char:CHARACTERS.arjuna },
  { id:4,  era:"Sabha Parva",            question:"What ill-fated game did Yudhishthira play that led to the exile of the Pandavas?",               accepted:["dice","dice game","chausar","gambling","chaupad"], char:CHARACTERS.yudhishthira },
  { id:5,  era:"Kingdom of Hastinapura", question:"Shakuni was the prince of which kingdom before coming to Hastinapura?",                          accepted:["gandhara","gandhar"], char:CHARACTERS.shakuni },
  { id:6,  era:"Kingdom of Hastinapura", question:"Who was the wisest man in Hastinapura — born of a maid yet wiser than any king?",                accepted:["vidura"], char:CHARACTERS.vidura },
  { id:7,  era:"The Five Pandavas",      question:"Which Pandava was gifted with foresight and knew the future but was cursed to stay silent?",     accepted:["sahadeva","sahdev"], char:CHARACTERS.sahadeva },
  { id:8,  era:"After Kurukshetra",      question:"What ancient text did Bhishma recite while lying upon his bed of arrows, awaiting death?",       accepted:["vishnu sahasranama","vishnu sahasranamam","sahasranama","thousand names of vishnu"], char:CHARACTERS.bhishma },
  { id:9,  era:"Khandava Dahan",         question:"What is the name of the legendary bow gifted to Arjuna by the god of fire, Agni?",               accepted:["gandiva","gandiv","gandivam"], char:CHARACTERS.arjuna },
  { id:10, era:"The Great War",          question:"What is the name of the great battlefield where the 18-day Mahabharata war was fought?",          accepted:["kurukshetra","kuru kshetra"], char:CHARACTERS.krishna },
];

const WRONG_MSGS = [
  "The sages would weep... Try again.",
  "Even Shakuni's dice were more honest.",
  "Consult Vidura for wisdom, then retry.",
  "The answer eludes thee still...",
  "Dhritarashtra saw more clearly.",
];

type CharType = typeof CHARACTERS.krishna;

function speakQuote(text: string) {
  if (typeof window === 'undefined') return;
  window.speechSynthesis.cancel();
  const utter = new SpeechSynthesisUtterance(text);
  utter.rate  = 0.75;
  utter.pitch = 0.6;
  utter.volume = 1;
  utter.lang  = 'en-US';
  const go = () => {
    const voices = window.speechSynthesis.getVoices();
    const v =
      voices.find(v => v.name === 'Microsoft David - English (United States)') ||
      voices.find(v => v.name === 'Microsoft Guy Online (Natural) - English (United States)') ||
      voices.find(v => v.name === 'Google UK English Male') ||
      voices.find(v => v.name === 'Alex') ||
      voices.find(v => v.name.toLowerCase().includes('david')) ||
      voices.find(v => v.name.toLowerCase().includes('guy')) ||
      voices.find(v => v.lang === 'en-US');
    if (v) utter.voice = v;
    window.speechSynthesis.speak(utter);
  };
  if (window.speechSynthesis.getVoices().length > 0) go();
  else {
    window.speechSynthesis.onvoiceschanged = () => {
      go();
      window.speechSynthesis.onvoiceschanged = null;
    };
  }
}

function spawnParticles(container: HTMLElement) {
  for (let i = 0; i < 18; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    const angle = (i / 18) * 360;
    const dist  = 50 + Math.random() * 70;
    const tx    = Math.cos((angle * Math.PI) / 180) * dist;
    const ty    = Math.sin((angle * Math.PI) / 180) * dist;
    p.style.cssText = `left:50%;top:50%;--tx:${tx}px;--ty:${ty}px;background:${i%3===0?'#F4D03F':i%3===1?'#D4AF37':'#fff'};width:${4+Math.random()*5}px;height:${4+Math.random()*5}px;animation-duration:${0.6+Math.random()*0.4}s;`;
    container.appendChild(p);
    setTimeout(() => p.remove(), 1200);
  }
}

export default function MahabharataQuiz() {
  const [phase, setPhase]             = useState("intro");
  const [idx, setIdx]                 = useState(0);
  const [answer, setAnswer]           = useState("");
  const [wrong, setWrong]             = useState(false);
  const [wrongMsg, setWrongMsg]       = useState("");
  const [attempts, setAttempts]       = useState(0);
  const [score, setScore]             = useState(0);
  const [prevChar, setPrevChar]       = useState<CharType | null>(null);
  const [prevQuote, setPrevQuote]     = useState("");
  const [showWhisper, setShowWhisper] = useState(false);
  const [soundOn, setSoundOn]         = useState(true);

  const inputRef  = useRef<HTMLInputElement>(null);
  const bubbleRef = useRef<HTMLDivElement>(null);
  const spokenRef = useRef<string>("");

  const q        = QUESTIONS[idx];
  const progress = (idx / QUESTIONS.length) * 100;
  const pct      = Math.round((score / (QUESTIONS.length * 100)) * 100);

  useEffect(() => {
    if (phase === "question") setTimeout(() => inputRef.current?.focus(), 120);
  }, [phase, idx]);

  useEffect(() => {
    if (phase === "question" && prevChar) {
      setShowWhisper(true);
      // Speak quote when whisper appears on new question
      if (soundOn && prevQuote && spokenRef.current !== prevQuote) {
        spokenRef.current = prevQuote;
        speakQuote(prevQuote);
      }
    }
  }, [idx, phase]);

  const submit = () => {
    if (!answer.trim()) return;
    const norm = answer.trim().toLowerCase().replace(/[^a-z0-9 ]/g, "");
    const ok   = q.accepted.some((a: string) => norm === a.toLowerCase().replace(/[^a-z0-9 ]/g, ""));
    if (ok) {
      setScore(s => s + Math.max(100 - attempts * 15, 10));
      setWrong(false);
      if (bubbleRef.current) spawnParticles(bubbleRef.current);
      setPrevChar(q.char);
      setPrevQuote(q.char.quote);
      setShowWhisper(false);
      window.speechSynthesis?.cancel();
      setTimeout(() => {
        if (idx + 1 >= QUESTIONS.length) { setPhase("complete"); }
        else { setIdx(i => i + 1); setAnswer(""); setAttempts(0); }
      }, 400);
    } else {
      setAttempts(a => a + 1);
      setWrong(true);
      setWrongMsg(WRONG_MSGS[attempts % WRONG_MSGS.length]);
      setTimeout(() => setWrong(false), 480);
    }
  };

  return (
    <>
      <style>{style}</style>
      <div className="quiz-root">
        <div className="noise-overlay" />
        <div className="mandala-bg">
          {[700,580,460,340,220].map((s,i) => (
            <div key={i} className="mandala-ring" style={{width:s,height:s}} />
          ))}
        </div>

        {/* Mute toggle */}
        <button className="mute-btn" onClick={() => {
          setSoundOn(m => {
            if (m) window.speechSynthesis?.cancel();
            return !m;
          });
        }}>
          {soundOn ? (
            <div className="sound-wave">
              <span style={{height:'6px'}} /><span style={{height:'10px'}} />
              <span style={{height:'14px'}} /><span style={{height:'10px'}} />
            </div>
          ) : '🔇'}
        </button>

        {/* ── INTRO ── */}
        {phase === "intro" && (
          <div style={{minHeight:"100vh",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",position:"relative",zIndex:1,padding:"24px",textAlign:"center",animation:"floatUp 0.7s ease-out forwards"}}>
            <div style={{position:"relative",marginBottom:"8px",display:"flex",alignItems:"center",justifyContent:"center",width:"280px",height:"280px"}}>
              <div className="chakra-ring-1" />
              <div className="chakra-ring-2" />
              <div className="chakra-ring-3" />
              <div style={{position:"relative",zIndex:2,textAlign:"center"}}>
                <p style={{fontFamily:"'Cinzel',serif",letterSpacing:"0.45em",fontSize:"0.6rem",textTransform:"uppercase",color:"rgba(212,175,55,0.6)",marginBottom:"12px"}}>
                  ॥ चक्रव्यूह ॥
                </p>
                <h1 style={{
                  fontFamily:"'Cinzel Decorative',serif",
                  fontSize:"clamp(2.2rem,8vw,4rem)",
                  fontWeight:900, lineHeight:1.05,
                  background:"linear-gradient(120deg,#C8981E 0%,#F4D03F 25%,#D4AF37 50%,#F4D03F 75%,#C8981E 100%)",
                  backgroundSize:"300% auto",
                  WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text",
                  animation:"shimmer 4s linear infinite, introGlow 3s ease-in-out infinite",
                }}>
                  CHAKRA<br/>VYUH
                </h1>
              </div>
            </div>
            <p style={{fontFamily:"'IM Fell English',serif",fontStyle:"italic",fontSize:"1rem",color:"rgba(245,230,200,0.55)",marginBottom:"8px"}}>
              The Great Quiz of the Epic Age
            </p>
            <p style={{fontFamily:"'Cinzel',serif",letterSpacing:"0.3em",fontSize:"0.6rem",textTransform:"uppercase",color:"rgba(212,175,55,0.35)",marginBottom:"40px"}}>
              Mahabharata · Knowledge · Dharma
            </p>
            <div className="ornament" style={{marginBottom:"36px",maxWidth:"300px",width:"100%"}}>
              <span style={{color:"rgba(212,175,55,0.5)",fontSize:"1.1rem"}}>✦</span>
            </div>
            <p style={{fontFamily:"'IM Fell English',serif",fontStyle:"italic",color:"rgba(245,230,200,0.45)",marginBottom:"40px",lineHeight:1.8,fontSize:"0.9rem"}}>
              {QUESTIONS.length} questions await thee, seeker.<br/>
              Enter the formation — if thou darest.
            </p>
            <button className="quiz-btn" onClick={() => { setPrevChar(null); setShowWhisper(false); setPhase("question"); }}>
              Enter the Vyuh
            </button>
          </div>
        )}

        {/* ── QUESTION ── */}
        {phase === "question" && (
          <div style={{minHeight:"100vh",display:"flex",flexDirection:"column",position:"relative",zIndex:1}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"20px 28px 12px"}}>
              <span className="score-badge">{idx+1} / {QUESTIONS.length}</span>
              <span className="score-badge">{score} pts</span>
            </div>
            <div className="progress-bar" style={{margin:"0 28px"}}>
              <div className="progress-fill" style={{width:`${progress}%`}} />
            </div>

            <div style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"40px 24px"}}>
              <div style={{width:"100%",maxWidth:"580px"}}>
                <p className="era-tag" style={{textAlign:"center",marginBottom:"28px"}}>{q.era}</p>
                <div className="ornament" style={{marginBottom:"32px"}}><span style={{color:"rgba(212,175,55,0.35)"}}>✦</span></div>
                <p key={q.id} className="question-text" style={{textAlign:"center",marginBottom:"32px"}}>{q.question}</p>
                <div className="ornament" style={{marginBottom:"44px"}}><span style={{color:"rgba(212,175,55,0.35)"}}>✦</span></div>

                {/* Input */}
                <div ref={bubbleRef} style={{position:"relative",animation: wrong ? "wrongShake 0.45s ease-in-out" : "none"}}>
                  <input
                    ref={inputRef}
                    className={`quiz-input ${wrong ? "wrong" : ""}`}
                    placeholder="Write the answer here..."
                    value={answer}
                    onChange={e => setAnswer(e.target.value)}
                    onKeyDown={e => e.key === "Enter" && submit()}
                    autoComplete="off"
                    spellCheck={false}
                  />
                </div>

                {/* Wrong message */}
                <p className="wrong-msg" style={{marginTop:"10px",opacity: wrong ? 1 : 0}}>
                  {wrongMsg}
                </p>

                {/* ── Whisper card ── */}
                {showWhisper && prevChar && (
                  <div key={`whisper-${idx}`} className="whisper-card">
                    <div className="whisper-avatar-wrap">
                      <div className="whisper-spin" />
                      <div className="whisper-avatar">
                        <img src={prevChar.image} alt={prevChar.name} />
                      </div>
                    </div>
                    <div>
                      <p className="whisper-name">✦ {prevChar.name} ✦</p>
                      <p className="whisper-quote">&ldquo;{prevQuote}&rdquo;</p>
                    </div>
                  </div>
                )}

                {/* Submit */}
                <div style={{display:"flex",justifyContent:"center",marginTop:"28px"}}>
                  <button className="quiz-btn" onClick={submit} disabled={!answer.trim()}>
                    Submit
                  </button>
                </div>

                {/* Hint */}
                {attempts >= 2 && (
                  <p className="hint-text">
                    Hint: begins with &quot;{q.accepted[0][0].toUpperCase()}&quot;
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ── COMPLETE ── */}
        {phase === "complete" && (
          <div style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",position:"relative",zIndex:1,padding:"24px",animation:"floatUp 0.7s ease-out forwards"}}>
            <div style={{textAlign:"center",maxWidth:"420px",width:"100%"}}>
              <p style={{fontFamily:"'Cinzel',serif",letterSpacing:"0.4em",fontSize:"0.6rem",textTransform:"uppercase",color:"rgba(212,175,55,0.5)",marginBottom:"24px"}}>
                ॥ समाप्तम् ॥
              </p>
              <h2 style={{
                fontFamily:"'Cinzel Decorative',serif",fontSize:"2.2rem",fontWeight:700,marginBottom:"8px",
                background:"linear-gradient(120deg,#C8981E,#F4D03F,#D4AF37)",
                WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",backgroundClip:"text",
              }}>
                The Vyuh Breaks
              </h2>
              <p style={{fontFamily:"'Cinzel',serif",letterSpacing:"0.3em",fontSize:"0.55rem",textTransform:"uppercase",color:"rgba(212,175,55,0.35)",marginBottom:"36px"}}>
                Thou hast escaped the formation
              </p>
              <div style={{border:"1px solid rgba(212,175,55,0.25)",background:"rgba(212,175,55,0.03)",padding:"44px 32px",marginBottom:"36px"}}>
                <div style={{
                  fontFamily:"'Cinzel',serif",fontSize:"4.5rem",fontWeight:700,lineHeight:1,
                  background:"linear-gradient(120deg,#C8981E,#F4D03F,#D4AF37,#F4D03F,#C8981E)",
                  backgroundSize:"300% auto",
                  WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",backgroundClip:"text",
                  animation:"shimmer 4s linear infinite",
                }}>{score}</div>
                <p style={{fontFamily:"'Cinzel',serif",letterSpacing:"0.35em",fontSize:"0.6rem",textTransform:"uppercase",color:"rgba(245,230,200,0.3)",marginBottom:"20px",marginTop:"8px"}}>Total Score</p>
                <p style={{fontFamily:"'IM Fell English',serif",fontStyle:"italic",color:"rgba(245,230,200,0.6)",fontSize:"1rem",lineHeight:1.7}}>
                  {pct >= 80 ? "Thou art worthy of standing beside the Pandavas." : pct >= 50 ? "A promising student of the eternal epic." : "Return to the forest and study more, seeker."}
                </p>
              </div>

              {prevChar && (
                <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:"12px",marginBottom:"32px",animation:"fadeIn 0.8s ease-out forwards"}}>
                  <div style={{position:"relative"}}>
                    <div className="char-spin-ring" />
                    <div className="char-avatar">
                      <img src={prevChar.image} alt={prevChar.name} />
                    </div>
                  </div>
                  <div style={{textAlign:"center"}}>
                    <p className="char-name">✦ {prevChar.name} ✦</p>
                    <p className="char-title-text">{prevChar.title}</p>
                    <p className="char-quote">&ldquo;{prevQuote}&rdquo;</p>
                  </div>
                </div>
              )}

              <button className="quiz-btn" onClick={() => {
                setIdx(0); setScore(0); setAnswer("");
                setAttempts(0); setPrevChar(null);
                setShowWhisper(false); setPhase("intro");
                window.speechSynthesis?.cancel();
              }}>
                Enter Again
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}