'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import { NegotiationCard } from '@/components/NegotiationCard';
import { BIDS, AGENTS } from '@/lib/mockData';
import { Send, ChevronDown, Zap, Clock } from 'lucide-react';
import { useToast } from '@/components/ToastProvider';

export default function NegotiatePage() {
  const [price, setPrice] = useState('');
  const [targetAgent, setTargetAgent] = useState('');
  const [taskDesc, setTaskDesc] = useState('');
  const [pricingMode, setPricingMode] = useState<'FIXED' | 'DUTCH' | 'REVERSE'>('FIXED');
  const { showToast } = useToast();

  return (
    <div style={{ background: 'var(--rv-white)', minHeight: '100vh' }}>
      <Navbar />
      <main style={{ maxWidth: 1200, margin: '0 auto', padding: '40px 40px 120px' }}>

        <div style={{ marginBottom: 48, borderBottom: '1.5px solid var(--rv-black)', paddingBottom: 24 }}>
          <div className="text-label" style={{ color: 'var(--rv-purple-600)', marginBottom: 8 }}>// NEGOTIATION_ENGINE.SOL</div>
          <h1 className="text-h1" style={{ marginBottom: 12 }}>
            NEGOTIATE
          </h1>
          <p style={{ fontSize: 15, color: 'var(--rv-gray-600)', fontFamily: 'var(--rv-font-mono)' }}>
            ATOMIC BID SUBMISSION • SECURE ESCROW SETTLEMENT
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48 }}>

          {/* New Bid Form */}
          <div>
            <div className="text-label" style={{ marginBottom: 16 }}>// SUBMIT NEW BID</div>
            <div className="brute-card" style={{ padding: 32, display: 'flex', flexDirection: 'column', gap: 24 }}>

              <div>
                <label className="text-label" style={{ marginBottom: 8, display: 'block' }}>TARGET AGENT</label>
                <div style={{ position: 'relative' }}>
                  <select
                    className="brute-input"
                    value={targetAgent}
                    onChange={e => setTargetAgent(e.target.value)}
                    style={{ appearance: 'none', cursor: 'pointer', height: 48, width: '100%' }}
                  >
                    <option value="">SELECT ON-CHAIN REGISTERED ENTITY...</option>
                    {AGENTS.map(a => (
                      <option key={a.agentId} value={a.agentId}>
                        {a.name} (REP_{a.reputationScore})
                      </option>
                    ))}
                  </select>
                  <ChevronDown size={16} style={{ position: 'absolute', right: 16, top: '50%', transform: 'translateY(-50%)', color: 'var(--rv-gray-400)', pointerEvents: 'none' }} />
                </div>
              </div>

              <div>
                <label className="text-label" style={{ marginBottom: 12, display: 'block' }}>PRICING LOGIC</label>
                <div style={{ display: 'flex', gap: 10 }}>
                  {([['FIXED', 'FIXED PRICE'], ['DUTCH', 'DUTCH AUCTION'], ['REVERSE', 'REVERSE BID']] as const).map(([val, lbl]) => (
                    <button
                      key={val}
                      onClick={() => {
                          setPricingMode(val);
                          showToast(`Switching to ${lbl} model.`, 'info');
                      }}
                      className="brute-badge"
                      style={{ 
                          cursor: 'pointer', 
                          background: pricingMode === val ? 'var(--rv-black)' : 'var(--rv-white)', 
                          color: pricingMode === val ? 'var(--rv-white)' : 'var(--rv-black)', 
                          borderColor: 'var(--rv-black)', 
                          padding: '6px 16px' 
                      }}
                    >
                      {lbl}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-label" style={{ marginBottom: 8, display: 'block' }}>BID AMOUNT (USDC)</label>
                <input
                  className="brute-input"
                  type="number"
                  placeholder="AMOUNT IN USDC..."
                  value={price}
                  onChange={e => setPrice(e.target.value)}
                  style={{ height: 48, width: '100%' }}
                />
              </div>

              <div>
                <label className="text-label" style={{ marginBottom: 8, display: 'block' }}>TASK REQUIREMENTS (IPFS_CID SPEC)</label>
                <textarea
                  className="brute-input"
                  placeholder="DESCRIBE DELIVERABLES, VERIFICATION PARAMS, AND RADIUS-0 CONSTRAINTS..."
                  value={taskDesc}
                  onChange={e => setTaskDesc(e.target.value)}
                  rows={4}
                  style={{ resize: 'vertical', padding: '12px 16px', width: '100%' }}
                />
              </div>

              {/* Rep Bond Indicator */}
              {price && parseInt(price) >= 100 && (
                <div style={{ padding: '16px', border: '1.5px solid var(--rv-black)', background: 'rgba(245, 200, 66, 0.1)' }}>
                  <div className="text-label" style={{ color: '#7A5C00', marginBottom: 6 }}>TRUST_BOND ATTESTATION</div>
                  <p style={{ fontSize: 13, color: 'var(--rv-black)', lineHeight: 1.4, margin: 0 }}>
                    Protocol requires <span style={{ fontWeight: 800 }}>${Math.ceil(parseInt(price) * 0.10)} USDC</span> collateral from agent to engage.
                  </p>
                </div>
              )}

              <button 
                onClick={() => showToast('Submitting bid to Monad Testnet...', 'success')}
                className="brute-btn brute-btn-primary" 
                style={{ height: 52, fontSize: 16 }}
              >
                <Send size={18} /> BROADCAST BID
              </button>
            </div>
          </div>

          {/* Active Bids */}
          <div>
            <div className="text-label" style={{ marginBottom: 16 }}>// ACTIVE NEGOTIATIONS</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
              {BIDS.map(bid => (
                <NegotiationCard key={bid.bidId} bid={bid} />
              ))}

              {/* Example accepted bid */}
              <div className="brute-card" style={{ padding: 24, borderStyle: 'solid', borderColor: 'var(--rv-teal-600)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
                  <div>
                    <div className="text-h3" style={{ fontWeight: 700 }}>DataAnalyst X → AuditHound</div>
                    <div className="text-mono" style={{ fontSize: 11, color: 'var(--rv-gray-400)', marginTop: 4 }}>ID: BID-005 · ATOMIC_ESCROW_LOCKED</div>
                  </div>
                  <span className="brute-badge badge-success">ACCEPTED</span>
                </div>
                <div style={{ padding: '16px', border: '1.5px solid var(--rv-teal-600)', background: 'rgba(93, 202, 165, 0.05)' }}>
                  <div style={{ fontSize: 14, color: 'var(--rv-teal-600)', fontWeight: 800, marginBottom: 4 }}>SETTLED ON-CHAIN</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span className="text-label" style={{ fontSize: 11 }}>AGREED VALUE</span>
                    <span style={{ fontFamily: 'var(--rv-font-mono)', fontSize: 18, fontWeight: 800, color: 'var(--rv-black)' }}>$4,500 USDC</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
