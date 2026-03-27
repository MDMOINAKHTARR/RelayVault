'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import { VaultCard } from '@/components/VaultCard';
import { PaymentFlowDiagram } from '@/components/PaymentFlow';
import { VAULT_ROUTING, MY_AGENT } from '@/lib/mockData';
import { Plus, Trash2, Save, Info, Zap } from 'lucide-react';

type SplitRecipient = { address: string; name: string; bps: number; amount: number };

export default function VaultPage() {
  const [recipients, setRecipients] = useState<SplitRecipient[]>(VAULT_ROUTING.splitRecipients);
  const [lockPercent, setLockPercent] = useState(20);
  const [simAmount, setSimAmount] = useState(1000);
  const [saved, setSaved] = useState(false);

  const splitTotal = recipients.reduce((s, r) => s + r.bps, 0);
  const holdPct = 100 - lockPercent - splitTotal / 100;

  const addRecipient = () => setRecipients(r => [...r, { address: '', name: 'New Agent', bps: 500, amount: 0 }]);
  const removeRecipient = (i: number) => setRecipients(r => r.filter((_, idx) => idx !== i));
  const updateBps = (i: number, bps: number) => setRecipients(r => r.map((rec, idx) => idx === i ? { ...rec, bps } : rec));
  const updateAddress = (i: number, address: string) => setRecipients(r => r.map((rec, idx) => idx === i ? { ...rec, address } : rec));

  const handleSave = () => { setSaved(true); setTimeout(() => setSaved(false), 2000); };

  return (
    <div>
      <Navbar />
      <main style={{ position: 'relative', zIndex: 1, maxWidth: 1200, margin: '0 auto', padding: '40px 40px 120px' }}>

        <div style={{ marginBottom: 40 }}>
          <div className="section-label" style={{ marginBottom: 8 }}>VaultWallet.sol</div>
          <h1 style={{ fontFamily: 'Syne, sans-serif', fontSize: 42, fontWeight: 800, color: '#fff', marginBottom: 8 }}>
            Vault Configuration
          </h1>
          <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.5)' }}>
            Configure autoSplit, timeLock, and hold routing — executes atomically on every incoming payment.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: 24, alignItems: 'start' }}>

          {/* Left: config */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

            {/* Auto-Split config */}
            <div className="glass" style={{ padding: 28 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                <div>
                  <div style={{ fontFamily: 'Syne, sans-serif', fontSize: 16, fontWeight: 700, marginBottom: 4 }}>Auto-Split Recipients</div>
                  <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>Funds routed atomically to sub-agents on payment</div>
                </div>
                <span style={{
                  fontFamily: 'DM Mono, monospace', fontSize: 13,
                  color: splitTotal > 7000 ? '#F0997B' : '#5DCAA5',
                  fontWeight: 500,
                }}>
                  {(splitTotal / 100).toFixed(0)}% total
                </span>
              </div>

              {recipients.map((r, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 100px 36px', gap: 10, alignItems: 'center', marginBottom: 12 }}
                >
                  <input
                    className="glass-input"
                    placeholder="0x address..."
                    style={{ fontSize: 12 }}
                    value={r.address}
                    onChange={e => updateAddress(i, e.target.value)}
                  />
                  <input
                    className="glass-input"
                    placeholder="Agent name"
                    style={{ fontSize: 12 }}
                    defaultValue={r.name}
                  />
                  <div style={{ position: 'relative' }}>
                    <input
                      className="glass-input"
                      type="number"
                      min={0} max={5000}
                      value={r.bps}
                      onChange={e => updateBps(i, +e.target.value)}
                      style={{ fontSize: 12, paddingRight: 36 }}
                    />
                    <span style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', fontSize: 11, color: 'rgba(255,255,255,0.3)', fontFamily: 'DM Mono, monospace' }}>
                      {(r.bps / 100).toFixed(0)}%
                    </span>
                  </div>
                  <button className="btn btn-danger btn-sm" style={{ padding: '8px', justifyContent: 'center' }} onClick={() => removeRecipient(i)}>
                    <Trash2 size={13} />
                  </button>
                </motion.div>
              ))}

              <button className="btn btn-ghost btn-sm" onClick={addRecipient} style={{ marginTop: 4 }}>
                <Plus size={13} /> Add Recipient
              </button>
            </div>

            {/* Time-Lock config */}
            <div className="glass" style={{ padding: 28 }}>
              <div style={{ marginBottom: 16 }}>
                <div style={{ fontFamily: 'Syne, sans-serif', fontSize: 16, fontWeight: 700, marginBottom: 4 }}>Time-Lock (Reputation Bond)</div>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>Portion locked as collateral; auto-unlocks after task completion</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                    <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)' }}>Lock Percentage</span>
                    <span style={{ fontFamily: 'DM Mono, monospace', fontSize: 13, color: '#FAC775', fontWeight: 500 }}>{lockPercent}%</span>
                  </div>
                  <input
                    type="range" min={0} max={50} value={lockPercent}
                    onChange={e => setLockPercent(+e.target.value)}
                    style={{ width: '100%', accentColor: '#EF9F27' }}
                  />
                </div>
                <div style={{ textAlign: 'center', padding: '12px 20px', borderRadius: 10, background: 'rgba(239,159,39,0.1)', border: '1px solid rgba(239,159,39,0.2)' }}>
                  <div style={{ fontFamily: 'Syne, sans-serif', fontSize: 24, fontWeight: 800, color: '#FAC775' }}>{lockPercent}%</div>
                  <div style={{ fontFamily: 'DM Mono, monospace', fontSize: 10, color: 'rgba(255,255,255,0.35)' }}>LOCKED</div>
                </div>
              </div>
            </div>

            {/* Simulation */}
            <div className="glass" style={{ padding: 28 }}>
              <div style={{ fontFamily: 'Syne, sans-serif', fontSize: 16, fontWeight: 700, marginBottom: 4 }}>Payment Simulation</div>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', marginBottom: 20 }}>Preview routing outcome for an incoming payment</div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
                <input
                  className="glass-input"
                  type="number"
                  value={simAmount}
                  onChange={e => setSimAmount(+e.target.value)}
                  style={{ maxWidth: 160 }}
                />
                <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13 }}>USDC incoming</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {recipients.map((r, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 14px', borderRadius: 8, background: 'rgba(83,74,183,0.1)', border: '1px solid rgba(83,74,183,0.15)' }}>
                    <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)' }}>{r.name}</span>
                    <span style={{ fontFamily: 'DM Mono, monospace', fontSize: 13, color: '#AFA9EC' }}>
                      ${((simAmount * r.bps) / 10000).toFixed(2)}
                    </span>
                  </div>
                ))}
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 14px', borderRadius: 8, background: 'rgba(239,159,39,0.08)', border: '1px solid rgba(239,159,39,0.15)' }}>
                  <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)' }}>🔒 Time-Locked</span>
                  <span style={{ fontFamily: 'DM Mono, monospace', fontSize: 13, color: '#FAC775' }}>${(simAmount * lockPercent / 100).toFixed(2)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 14px', borderRadius: 8, background: 'rgba(29,158,117,0.08)', border: '1px solid rgba(29,158,117,0.15)' }}>
                  <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)' }}>💰 Available (Hold)</span>
                  <span style={{ fontFamily: 'DM Mono, monospace', fontSize: 13, color: '#5DCAA5' }}>
                    ${Math.max(0, simAmount - (simAmount * lockPercent / 100) - recipients.reduce((s, r) => s + (simAmount * r.bps / 10000), 0)).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            <button className="btn btn-primary btn-lg" onClick={handleSave} style={{ justifyContent: 'center' }}>
              {saved ? '✓ Saved!' : <><Save size={16} /> Save Routing Config</>}
            </button>
          </div>

          {/* Right: live vault card */}
          <div style={{ position: 'sticky', top: 80 }}>
            <div className="section-label" style={{ marginBottom: 14 }}>Live Vault Preview</div>
            <VaultCard />
            <div className="glass" style={{ padding: 20, marginTop: 16 }}>
              <div className="section-label" style={{ marginBottom: 10 }}>Payment Flow</div>
              <PaymentFlowDiagram />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
