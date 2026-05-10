import React, { useState, useEffect } from 'react';
import { Wind, Droplets, Thermometer, Eye, ArrowUpRight, Waves, Fish, Sparkles, Anchor, Activity } from 'lucide-react';

export default function FinFindrDashboard() {
  const [time, setTime] = useState(new Date());
  const [hasRead, setHasRead] = useState(false);

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const days = [
    { day: 'THU', date: 8, score: 6.4 },
    { day: 'FRI', date: 9, score: 8.7 },
    { day: 'SAT', date: 10, score: 9.2 },
    { day: 'SUN', date: 11, score: 7.1 },
    { day: 'MON', date: 12, score: 3.2 },
    { day: 'TUE', date: 13, score: 5.4 },
    { day: 'WED', date: 14, score: 2.1 },
  ];

  const scoreColor = (s) => {
    if (s >= 8.5) return { bg: '#3DA85F', label: 'PRIME', verdict: 'EXCEPTIONAL', verdictColor: '#3DA85F' };
    if (s >= 7.0) return { bg: '#7CC36A', label: 'GOOD', verdict: 'STRONG', verdictColor: '#5BAA48' };
    if (s >= 5.5) return { bg: '#E8C547', label: 'FAIR', verdict: 'SOLID', verdictColor: '#C99B2D' };
    if (s >= 4.0) return { bg: '#E89647', label: 'POOR', verdict: 'SLOW', verdictColor: '#D17A2E' };
    return { bg: '#D94B3A', label: 'TOUGH', verdict: 'TOUGH', verdictColor: '#C13D2D' };
  };

  const formatTime = (d) =>
    d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });

  const NUMERAL = '#0f1b12';
  const todayScore = 6.4;
  const todayColor = scoreColor(todayScore);

  return (
    <div className="min-h-screen w-full" style={{
      background: '#f4f4f1',
      fontFamily: "'Inter', system-ui, sans-serif",
      color: '#1a1a1a',
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600;9..144,700;9..144,800;9..144,900&family=JetBrains+Mono:wght@400;500;600;700&family=Inter:wght@400;500;600;700&display=swap');

        * { -webkit-font-smoothing: antialiased; }

        .serif { font-family: 'Fraunces', serif; font-optical-sizing: auto; letter-spacing: -0.02em; }
        .mono { font-family: 'JetBrains Mono', monospace; }

        @keyframes pulse-dot {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.4; transform: scale(0.85); }
        }
        @keyframes scan {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100%); }
        }
        @keyframes fade-up {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes shimmer-bar {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }
        @keyframes pulse-period {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.08); }
        }

        .live-dot { animation: pulse-dot 1.6s ease-in-out infinite; }
        .scan-line { animation: scan 4s linear infinite; }
        .fade-in { animation: fade-up 0.5s ease-out backwards; }
        .pulse-period { animation: pulse-period 3s ease-in-out infinite; transform-origin: center; display: inline-block; }

        .grid-bg {
          background-image:
            linear-gradient(rgba(0,0,0,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,0,0,0.04) 1px, transparent 1px);
          background-size: 24px 24px;
        }

        .feature-card { transition: all 0.25s cubic-bezier(0.2, 0.8, 0.2, 1); }
        .feature-card:hover {
          transform: translateY(-1px);
          border-color: #1a1a1a !important;
          background: #ffffff !important;
        }
        .feature-card:hover .arrow-icon { transform: translate(2px, -2px); }
        .feature-card:hover .icon-tile { transform: scale(1.05); }
        .arrow-icon { transition: transform 0.25s ease; }
        .icon-tile { transition: transform 0.25s ease; }

        .day-cell { transition: all 0.2s ease; cursor: pointer; }
        .day-cell:hover { transform: translateY(-2px); }

        .read-cta {
          position: relative;
          transition: all 0.3s cubic-bezier(0.2, 0.8, 0.2, 1);
          cursor: pointer;
          overflow: hidden;
        }
        .read-cta:hover {
          background: linear-gradient(135deg, #B8DCEF 0%, #7CB8DA 100%) !important;
          box-shadow: 0 6px 20px -6px rgba(124,184,218,0.55), inset 0 1px 0 rgba(255,255,255,0.5) !important;
        }
        .read-cta:hover .read-arrow { transform: translateX(3px); }
        .read-cta:active { transform: scale(0.99); }
        .read-arrow { transition: transform 0.25s ease; }

        .shimmer-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.4) 50%, transparent 100%);
          animation: shimmer-bar 3.5s ease-in-out infinite;
          pointer-events: none;
        }

        .corner-cross {
          position: absolute;
          width: 10px;
          height: 10px;
          pointer-events: none;
          z-index: 2;
        }
        .corner-cross::before,
        .corner-cross::after {
          content: '';
          position: absolute;
          background: #1a1a1a;
        }
        .corner-cross::before { width: 10px; height: 1px; top: 50%; left: 0; }
        .corner-cross::after { width: 1px; height: 10px; left: 50%; top: 0; }
        .cc-tl { top: -5px; left: -5px; }
        .cc-tr { top: -5px; right: -5px; }
        .cc-bl { bottom: -5px; left: -5px; }
        .cc-br { bottom: -5px; right: -5px; }

        .demo-toggle { transition: all 0.2s ease; }
        .demo-toggle:hover { transform: translateY(-1px); }
      `}</style>

      <div className="fixed inset-0 grid-bg pointer-events-none" />

      <div className="relative max-w-md mx-auto px-5 py-6">

        {/* HEADER */}
        <header className="fade-in mb-5 pb-4 border-b border-black relative" style={{ animationDelay: '0ms' }}>
          <div className="flex items-end justify-between">
            <div className="flex items-end gap-3">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#1a1a1a" strokeWidth="1.75" style={{ marginBottom: 2 }}>
                <path d="M12 2 L4 8 L4 16 L12 22 L20 16 L20 8 Z" />
                <circle cx="12" cy="12" r="2.5" fill="#1a1a1a" />
              </svg>
              <div className="flex flex-col">
                <div className="mono text-[9px] font-semibold tracking-[0.25em] mb-0.5" style={{ color: '#888' }}>
                  ANGLER OS
                </div>
                <div className="serif font-semibold tracking-tight leading-none flex items-baseline" style={{ fontSize: '34px', color: '#1a1a1a' }}>
                  <span>FinFindr</span>
                  <span className="pulse-period" style={{ color: '#2A6E96', marginLeft: '1px' }}>.</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 px-2.5 py-1 border border-black/15 rounded" style={{ background: '#fff', marginBottom: 2 }}>
              <div className="live-dot w-1.5 h-1.5 rounded-sm" style={{ background: '#3DA85F' }} />
              <span className="mono text-[10px] font-semibold tracking-wider" style={{ color: '#1a1a1a' }}>
                {formatTime(time)}
              </span>
            </div>
          </div>
        </header>

        {/* DEMO TOGGLE */}
        <div className="fade-in mb-4 flex justify-end" style={{ animationDelay: '40ms' }}>
          <button
            onClick={() => setHasRead(!hasRead)}
            className="demo-toggle mono text-[8px] font-bold tracking-[0.15em] px-2 py-1 rounded-sm border"
            style={{
              background: hasRead ? '#1a1a1a' : '#fff',
              color: hasRead ? '#fff' : '#666',
              borderColor: hasRead ? '#1a1a1a' : 'rgba(0,0,0,0.2)',
            }}
          >
            DEMO · {hasRead ? 'TAP TO RESET' : 'TAP TO SIMULATE READ'}
          </button>
        </div>

        {/* DYNAMIC HEADLINE */}
        <div className="fade-in mb-6 relative" style={{ animationDelay: '60ms' }}>
          <div className="mono text-[10px] font-semibold tracking-[0.25em] mb-3 flex items-center justify-between" style={{ color: '#444' }}>
            <span>── 0800 · GOOD MORNING, ANGLER</span>
            <span className="serif text-[10px] italic" style={{ color: '#888' }}>day 47</span>
          </div>

          {!hasRead ? (
            <h1 className="serif text-[36px] leading-[1.0] font-bold tracking-tight" style={{ color: '#1a1a1a' }}>
              The water is<br />
              <span style={{ fontStyle: 'italic', fontWeight: 700 }}>waiting.</span>
            </h1>
          ) : (
            // POST-READ STATE — horizontal, score on the left, verdict on the right
            <div className="flex items-center gap-4">
              {/* Big score block */}
              <div className="flex-shrink-0 flex items-center justify-center px-4 py-2 rounded-lg relative"
                style={{
                  background: todayColor.bg,
                  border: '1px solid rgba(0,0,0,0.15)',
                  boxShadow: `0 4px 14px -6px ${todayColor.bg}80`,
                  minWidth: 110,
                }}>
                {/* tiny corner ticks */}
                <div className="absolute top-1 left-1 w-1 h-1 rounded-sm" style={{ background: 'rgba(0,0,0,0.25)' }} />
                <div className="absolute top-1 right-1 w-1 h-1 rounded-sm" style={{ background: 'rgba(0,0,0,0.25)' }} />
                <div className="absolute bottom-1 left-1 w-1 h-1 rounded-sm" style={{ background: 'rgba(0,0,0,0.25)' }} />
                <div className="absolute bottom-1 right-1 w-1 h-1 rounded-sm" style={{ background: 'rgba(0,0,0,0.25)' }} />

                <div className="flex items-baseline gap-1">
                  <span className="serif font-bold leading-none" style={{ fontSize: '52px', color: NUMERAL, letterSpacing: '-0.04em' }}>
                    {todayScore.toFixed(1)}
                  </span>
                  <span className="mono text-sm font-bold" style={{ color: NUMERAL, opacity: 0.6 }}>
                    /10
                  </span>
                </div>
              </div>

              {/* Verdict text */}
              <div className="flex-1 min-w-0">
                <div className="mono text-[9px] font-bold tracking-[0.2em] mb-1" style={{ color: '#666' }}>
                  TODAY'S READ
                </div>
                <div className="serif font-bold leading-[0.95] tracking-tight" style={{ fontSize: '26px', color: '#1a1a1a' }}>
                  Looks{' '}
                  <span style={{ color: todayColor.verdictColor, fontStyle: 'italic', fontWeight: 800 }}>
                    {todayColor.verdict.toLowerCase()}
                  </span>
                  .
                </div>
              </div>
            </div>
          )}
        </div>

        {/* LIVE CONDITIONS */}
        <div className="fade-in relative mb-5"
          style={{
            animationDelay: '120ms',
            background: '#ffffff',
            border: '1px solid rgba(0,0,0,0.12)',
            borderRadius: '10px',
          }}>
          <div className="corner-cross cc-tl" />
          <div className="corner-cross cc-tr" />
          <div className="corner-cross cc-bl" />
          <div className="corner-cross cc-br" />

          <div className="absolute inset-x-0 h-12 pointer-events-none scan-line overflow-hidden" style={{
            background: 'linear-gradient(180deg, transparent, rgba(124,184,218,0.10), transparent)',
            borderRadius: '10px',
          }} />

          <div className="flex items-center justify-between px-4 py-2 border-b border-black/10"
            style={{ background: '#fafaf7', borderRadius: '10px 10px 0 0' }}>
            <div className="flex items-center gap-2">
              <div className="live-dot w-1.5 h-1.5 rounded-sm" style={{ background: '#3DA85F' }} />
              <span className="mono text-[10px] font-semibold tracking-[0.2em]" style={{ color: '#1a1a1a' }}>
                LIVE · LAKE MINNETONKA
              </span>
            </div>
            <span className="mono text-[10px] font-medium" style={{ color: '#666' }}>
              44.92°N · 93.59°W
            </span>
          </div>

          <div className="relative p-5">
            <div className="flex items-end justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-baseline gap-1.5">
                  <span className="serif text-[68px] leading-none font-medium" style={{ color: '#1a1a1a' }}>
                    52
                  </span>
                  <span className="mono text-base font-semibold" style={{ color: '#666' }}>°F</span>
                </div>
                <div className="mt-2 text-[13px] font-medium" style={{ color: '#333' }}>
                  Overcast · Light drizzle
                </div>
              </div>

              <div className="flex flex-col items-end pb-1">
                <div className="mono text-[8px] font-bold tracking-wider mb-1" style={{ color: '#888' }}>
                  HOURLY TEMP · 6H
                </div>
                <svg width="120" height="40" viewBox="0 0 120 40" style={{ display: 'block' }}>
                  <defs>
                    <linearGradient id="tempFill" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#7CB8DA" stopOpacity="0.28" />
                      <stop offset="100%" stopColor="#7CB8DA" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  <line x1="0" y1="10" x2="120" y2="10" stroke="rgba(0,0,0,0.05)" strokeWidth="0.5" />
                  <line x1="0" y1="20" x2="120" y2="20" stroke="rgba(0,0,0,0.08)" strokeWidth="0.5" strokeDasharray="2,2" />
                  <line x1="0" y1="30" x2="120" y2="30" stroke="rgba(0,0,0,0.05)" strokeWidth="0.5" />
                  <path d="M0,28 L20,24 L40,18 L60,14 L80,11 L100,15 L120,17 L120,40 L0,40 Z" fill="url(#tempFill)" />
                  <path d="M0,28 L20,24 L40,18 L60,14 L80,11 L100,15 L120,17"
                    fill="none" stroke="#4F95C2" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  {[[0,28],[20,24],[40,18],[60,14],[80,11],[100,15]].map(([x,y],i) => (
                    <circle key={i} cx={x} cy={y} r="1.2" fill="#4F95C2" opacity="0.6" />
                  ))}
                  <circle cx="120" cy="17" r="2.2" fill="#4F95C2" />
                  <circle cx="120" cy="17" r="4" fill="#4F95C2" opacity="0.25">
                    <animate attributeName="r" values="4;7;4" dur="2s" repeatCount="indefinite" />
                    <animate attributeName="opacity" values="0.25;0;0.25" dur="2s" repeatCount="indefinite" />
                  </circle>
                </svg>
                <div className="mono text-[8px] font-bold tracking-wider mt-0.5" style={{ color: '#3DA85F' }}>
                  ↑ WARMING · +4°F SINCE 6A
                </div>
              </div>
            </div>

            <button
              onClick={() => setHasRead(true)}
              className="read-cta w-full mb-4 flex items-center justify-between px-4 py-3"
              style={{
                background: 'linear-gradient(135deg, #C9E4F2 0%, #95C8E2 100%)',
                border: '1px solid rgba(79,149,194,0.45)',
                borderRadius: '8px',
                boxShadow: '0 4px 14px -6px rgba(124,184,218,0.5), inset 0 1px 0 rgba(255,255,255,0.6)',
              }}>
              <div className="shimmer-overlay" />

              <div className="flex items-center gap-3 relative z-10">
                <div className="flex items-center justify-center w-9 h-9 rounded"
                  style={{
                    background: 'rgba(255,255,255,0.55)',
                    border: '1px solid rgba(255,255,255,0.8)',
                  }}>
                  <Activity size={16} strokeWidth={2.25} color="#2A6E96" />
                </div>
                <div className="text-left">
                  <div className="mono text-[9px] font-bold tracking-[0.2em]" style={{ color: 'rgba(42,110,150,0.85)' }}>
                    TODAY'S BITE
                  </div>
                  <div className="serif text-[17px] font-semibold leading-tight mt-0.5" style={{ color: '#1a3a52' }}>
                    {hasRead ? 'Refresh your read' : 'Get your read'}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 relative z-10">
                <svg width="44" height="14" viewBox="0 0 44 14" style={{ display: 'block' }}>
                  <path d="M0,7 Q5.5,2 11,7 T22,7 T33,7 T44,7"
                    fill="none" stroke="rgba(42,110,150,0.7)" strokeWidth="1.5" strokeLinecap="round">
                    <animate attributeName="d"
                      values="M0,7 Q5.5,2 11,7 T22,7 T33,7 T44,7;M0,7 Q5.5,12 11,7 T22,7 T33,7 T44,7;M0,7 Q5.5,2 11,7 T22,7 T33,7 T44,7"
                      dur="2.5s" repeatCount="indefinite" />
                  </path>
                </svg>
                <div className="flex items-center justify-center w-7 h-7 rounded"
                  style={{ background: '#ffffff', border: '1px solid rgba(42,110,150,0.3)' }}>
                  <ArrowUpRight className="read-arrow" size={14} strokeWidth={2.25} color="#2A6E96" />
                </div>
              </div>
            </button>

            <div className="grid grid-cols-4 border-t border-l rounded-md overflow-hidden" style={{ borderColor: 'rgba(0,0,0,0.12)' }}>
              {[
                { Icon: Wind, label: 'WIND', val: '8', unit: 'mph', sub: 'NW' },
                { Icon: Droplets, label: 'HUMID', val: '78', unit: '%', sub: 'RISING' },
                { Icon: Thermometer, label: 'WATER', val: '47', unit: '°F', sub: 'STEADY' },
                { Icon: Eye, label: 'PRESS', val: '29.8', unit: 'in', sub: 'FALLING' },
              ].map(({ Icon, label, val, unit, sub }) => (
                <div key={label} className="px-2.5 py-2.5 border-r border-b" style={{ borderColor: 'rgba(0,0,0,0.12)' }}>
                  <div className="flex items-center gap-1 mb-1">
                    <Icon size={10} strokeWidth={2} color="#444" />
                    <span className="mono text-[8px] font-bold tracking-wider" style={{ color: '#666' }}>{label}</span>
                  </div>
                  <div className="flex items-baseline gap-0.5">
                    <span className="serif text-lg font-semibold leading-none" style={{ color: '#1a1a1a' }}>{val}</span>
                    <span className="mono text-[9px] font-semibold" style={{ color: '#666' }}>{unit}</span>
                  </div>
                  <div className="mono text-[8px] font-bold tracking-wider mt-1" style={{ color: '#333' }}>{sub}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 7-DAY FORECAST */}
        <div className="fade-in mb-6" style={{ animationDelay: '200ms' }}>
          <div className="flex items-center justify-between mb-3">
            <div className="mono text-[10px] font-semibold tracking-[0.25em]" style={{ color: '#444' }}>
              ── 7-DAY BITE FORECAST
            </div>
            <span className="mono text-[9px] font-semibold flex items-center gap-1" style={{ color: '#666' }}>
              <span style={{ color: '#3DA85F' }}>▲</span>
              <span>SCORE / 10</span>
            </span>
          </div>

          <div className="grid grid-cols-7 gap-1">
            {days.map((d, i) => {
              const c = scoreColor(d.score);
              const isToday = i === 0;
              return (
                <div key={d.day} className="day-cell relative">
                  {isToday && (
                    <div className="absolute -top-2 left-0 right-0 flex justify-center z-10">
                      <span className="mono text-[7px] font-bold tracking-[0.15em] px-1.5 py-px rounded-sm" style={{
                        background: '#1a1a1a', color: '#fff',
                      }}>NOW</span>
                    </div>
                  )}
                  <div className="flex flex-col items-stretch overflow-hidden"
                    style={{
                      background: '#ffffff',
                      border: `1px solid ${isToday ? '#1a1a1a' : 'rgba(0,0,0,0.12)'}`,
                      borderRadius: '6px',
                    }}>
                    <div className="text-center py-1.5 border-b" style={{ borderColor: 'rgba(0,0,0,0.08)' }}>
                      <div className="mono text-[8px] font-bold tracking-wider leading-none" style={{ color: '#666' }}>{d.day}</div>
                      <div className="serif text-xs font-semibold leading-none mt-0.5" style={{ color: '#1a1a1a' }}>{d.date}</div>
                    </div>
                    <div className="h-10 flex items-center justify-center"
                      style={{ background: c.bg, boxShadow: `inset 0 0 0 1px rgba(0,0,0,0.08)` }}>
                      <span className="serif text-base font-bold leading-none" style={{ color: NUMERAL }}>{d.score.toFixed(1)}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-between mt-3 px-0.5">
            <div className="flex items-center gap-2.5">
              {[
                { c: '#D94B3A', l: 'TOUGH' },
                { c: '#E89647', l: 'POOR' },
                { c: '#E8C547', l: 'FAIR' },
                { c: '#7CC36A', l: 'GOOD' },
                { c: '#3DA85F', l: 'PRIME' },
              ].map(({ c, l }) => (
                <div key={l} className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-sm" style={{ background: c, border: '1px solid rgba(0,0,0,0.15)' }} />
                  <span className="mono text-[8px] font-bold tracking-wider" style={{ color: '#444' }}>{l}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* INTELLIGENCE MODULES */}
        <div className="fade-in mb-4" style={{ animationDelay: '320ms' }}>
          <div className="mono text-[10px] font-semibold tracking-[0.25em] mb-3 flex items-center justify-between" style={{ color: '#444' }}>
            <span>── INTELLIGENCE MODULES</span>
            <span className="mono text-[8px] font-bold" style={{ color: '#888' }}>3 / 3</span>
          </div>

          <div className="space-y-2">
            {[
              { Icon: Waves, title: 'Water Reader', tag: 'AI', tagStyle: true,
                desc: 'Polygon scan any lake for structure & hotspots', code: '01',
                tileBg: 'linear-gradient(135deg, #E8F2FA 0%, #C8DFF2 100%)',
                tileBorder: '#0F63B0', iconColor: '#0A4A87' },
              { Icon: Fish, title: 'Lure & Fly', tag: 'RECOMMENDER', tagStyle: false,
                desc: "Tuned picks for today's conditions & species", code: '02',
                tileBg: 'linear-gradient(135deg, #FBF1D9 0%, #F4DFA4 100%)',
                tileBorder: '#C99B2D', iconColor: '#8A6A1A' },
              { Icon: Sparkles, title: 'Daily Read', tag: 'CONDITIONS', tagStyle: false,
                desc: 'Full breakdown · windows · limiting factors', code: '03',
                tileBg: 'linear-gradient(135deg, #E5F2DD 0%, #C5E0B5 100%)',
                tileBorder: '#3DA85F', iconColor: '#1F6B38' },
            ].map(({ Icon, title, tag, tagStyle, desc, code, tileBg, tileBorder, iconColor }) => (
              <button key={title} className="feature-card w-full text-left p-4 flex items-center gap-4 relative"
                style={{ background: '#ffffff', border: '1px solid rgba(0,0,0,0.12)', borderRadius: '8px' }}>
                <div className="absolute top-1.5 right-1.5 flex items-center gap-0.5">
                  <div className="w-0.5 h-0.5 rounded-full" style={{ background: tileBorder, opacity: 0.5 }} />
                  <div className="w-0.5 h-0.5 rounded-full" style={{ background: tileBorder, opacity: 0.7 }} />
                  <div className="w-0.5 h-0.5 rounded-full" style={{ background: tileBorder }} />
                </div>

                <div className="mono text-[9px] font-bold tracking-wider" style={{ color: '#aaa' }}>{code}</div>
                <div className="icon-tile flex-shrink-0 w-11 h-11 flex items-center justify-center relative"
                  style={{ background: tileBg, border: `1px solid ${tileBorder}40`, borderRadius: '6px' }}>
                  <Icon size={20} strokeWidth={1.75} color={iconColor} />
                  <div className="absolute top-0.5 right-0.5 w-1 h-1 rounded-sm" style={{ background: tileBorder, opacity: 0.7 }} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="serif text-base font-semibold" style={{ color: '#1a1a1a' }}>{title}</span>
                    {tagStyle ? (
                      <span className="mono text-[8px] font-bold tracking-wider px-1.5 py-0.5 rounded-sm"
                        style={{ background: '#1a1a1a', color: '#fff' }}>{tag}</span>
                    ) : (
                      <span className="mono text-[8px] font-bold tracking-wider" style={{ color: '#666' }}>{tag}</span>
                    )}
                  </div>
                  <p className="text-[11px] font-medium leading-tight" style={{ color: '#555' }}>{desc}</p>
                </div>
                <ArrowUpRight size={16} className="arrow-icon flex-shrink-0" color="#1a1a1a" strokeWidth={2} />
              </button>
            ))}
          </div>
        </div>

        {/* FOOTER */}
        <div className="fade-in flex items-center justify-between pt-4 mt-2 border-t border-black/15"
          style={{ animationDelay: '440ms' }}>
          <div className="flex items-center gap-1.5">
            <Anchor size={11} strokeWidth={2} color="#666" />
            <span className="mono text-[9px] font-semibold tracking-wider" style={{ color: '#666' }}>SYNCED · 12s AGO</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex gap-0.5 items-end">
              <div className="w-0.5 h-2 rounded-sm" style={{ background: '#3DA85F' }} />
              <div className="w-0.5 h-2.5 rounded-sm" style={{ background: '#3DA85F' }} />
              <div className="w-0.5 h-3 rounded-sm" style={{ background: '#3DA85F' }} />
              <div className="w-0.5 h-3.5 rounded-sm" style={{ background: '#3DA85F' }} />
            </div>
            <span className="mono text-[9px] font-bold tracking-[0.2em]" style={{ color: '#666' }}>FINFINDR · MN</span>
          </div>
        </div>

      </div>
    </div>
  );
}
