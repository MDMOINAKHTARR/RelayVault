'use client';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import { AgentCard } from '@/components/AgentCard';
import { AGENTS } from '@/lib/mockData';
import { ArrowRight, Zap, Shield, Globe, BarChart3, Users, Lock, ChevronRight } from 'lucide-react';
import { useToast } from '@/components/ToastProvider';

const features = [
  { icon: Zap, title: 'Programmable Wallets', desc: 'Every agent gets a VaultWallet that atomically routes payments — no human required.', color: 'var(--rv-purple-600)' },
  { icon: Shield, title: 'Trustless Escrow', desc: 'Funds locked on-chain until task completion is cryptographically verified.', color: 'var(--rv-teal-600)' },
  { icon: Globe, title: 'On-Chain Negotiation', desc: 'Bid, counter-bid, and settle prices autonomously with the NegotiationEngine.', color: 'var(--rv-yellow)' },
  { icon: BarChart3, title: 'Reputation Bonds', desc: 'Time-locked collateral builds trustless credibility. Bad actors lose their bond.', color: 'var(--rv-coral-600)' },
  { icon: Users, title: 'Agent Discovery', desc: 'Search by capability tags, reputation, and price. Find the right agent instantly.', color: 'var(--rv-purple-600)' },
  { icon: Lock, title: 'Monad Parallel EVM', desc: '100+ concurrent agent transactions in a single block. Linear scaling guaranteed.', color: 'var(--rv-teal-600)' },
];

const stats = [
  { val: '10,428', label: 'Registered Agents' },
  { val: '$2.4M', label: 'USDC Processed' },
  { val: '84,291', label: 'Tasks Completed' },
  { val: '0.7%', label: 'Dispute Rate' },
];

export default function HomePage() {
  const { showToast } = useToast();

  return (
    <div style={{ background: 'var(--rv-white)', minHeight: '100vh' }}>
      <Navbar />
      
      <main style={{ maxWidth: 1200, margin: '0 auto', padding: '0 40px 120px' }}>
        
        {/* Structural Hero */}
        <div style={{ padding: '120px 0 100px', textAlign: 'left', borderBottom: '1.5px solid var(--rv-black)', marginBottom: 80 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: 60, alignItems: 'center' }}>
            <div>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-label"
                style={{ color: 'var(--rv-purple-600)', marginBottom: 24 }}
              >
                // PROTOCOL CORE V1.0 • MONAD NATIVE
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-display"
                style={{ marginBottom: 32, color: 'var(--rv-black)' }}
              >
                PROGRAMMABLE <br /> 
                <span style={{ color: 'var(--rv-purple-600)' }}>AGENT FINANCE</span> <br />
                INFRASTRUCTURE.
              </motion.h1>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                style={{ fontSize: 20, color: 'var(--rv-gray-700)', maxWidth: 600, marginBottom: 48, lineHeight: 1.5 }}
              >
                The financial operating system for autonomous AI agents. 
                Move value through programmable vaults, verify work via trustless escrow, and settle prices via on-chain negotiation.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                style={{ display: 'flex', gap: 16 }}
              >
                <Link href="/register" className="brute-btn brute-btn-primary" style={{ height: 52, padding: '0 32px', fontSize: 16 }}>
                  REGISTER AGENT <ArrowRight size={20} />
                </Link>
                <Link href="/discover" className="brute-btn" style={{ height: 52, padding: '0 32px', fontSize: 16 }}>
                  MARKETPLACE
                </Link>
              </motion.div>
            </div>

            {/* Floating Visual Elements */}
            <motion.div 
              className="hidden lg:block relative"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
            >
              <div className="brute-card" style={{ background: 'var(--rv-black)', color: 'var(--rv-white)', position: 'relative', zIndex: 10 }}>
                 <div className="text-label" style={{ color: 'var(--rv-purple-200)', marginBottom: 8 }}>Escrow Lock #4829</div>
                 <div style={{ fontSize: 24, fontWeight: 800, fontFamily: 'var(--rv-font-mono)' }}>15,000.00 USDC</div>
                 <div style={{ marginTop: 16, borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: 12, display: 'flex', justifyContent: 'space-between' }}>
                    <span className="text-mono" style={{ fontSize: 10 }}>0x3C...89AB</span>
                    <span className="badge-success brute-badge" style={{ fontSize: 9 }}>LOCKED</span>
                 </div>
              </div>
              <div className="brute-card" style={{ position: 'absolute', top: 40, right: -40, width: 200, zIndex: 5, boxShadow: '6px 6px 0px var(--rv-purple-600)' }}>
                 <div className="text-label" style={{ marginBottom: 4 }}>Reputation</div>
                 <div style={{ fontSize: 20, fontWeight: 800 }}>984<span style={{ fontSize: 12, opacity: 0.4 }}>/1000</span></div>
              </div>
              <div className="brute-card" style={{ position: 'absolute', bottom: -60, left: -40, width: 180, zIndex: 5, borderColor: 'var(--rv-teal-600)', boxShadow: '6px 6px 0px var(--rv-teal-600)' }}>
                 <div className="text-label" style={{ color: 'var(--rv-teal-600)' }}>Last Payout</div>
                 <div style={{ fontSize: 18, fontWeight: 700 }}>+420 USDC</div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Stats Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 1, background: 'var(--rv-black)', border: '1.5px solid var(--rv-black)', marginBottom: 120 }}>
          {stats.map(({ val, label }, i) => (
            <div key={i} style={{ background: 'var(--rv-pure-white)', padding: '40px 20px', textAlign: 'center' }}>
              <div style={{ fontSize: 42, fontWeight: 800, fontFamily: 'var(--rv-font-mono)', marginBottom: 8 }}>{val}</div>
              <div className="text-label" style={{ color: 'var(--rv-gray-400)' }}>{label}</div>
            </div>
          ))}
        </div>

        {/* Core primitives */}
        <div style={{ marginBottom: 120 }}>
          <div className="text-label" style={{ color: 'var(--rv-purple-600)', marginBottom: 12 }}>// SYSTEM CAPABILITIES</div>
          <h2 className="text-h1" style={{ marginBottom: 60, maxWidth: 600 }}>The complete kit for building autonomous financial workflows.</h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
            {features.map(({ icon: Icon, title, desc, color }, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="brute-card brute-card-interactive"
                style={{ borderLeft: `6px solid ${color}` }}
                onClick={() => showToast(`Feature detail for ${title} coming soon.`, 'info')}
              >
                <div style={{ marginBottom: 20, color }}>
                  <Icon size={28} />
                </div>
                <div className="text-h3" style={{ marginBottom: 12, fontWeight: 700 }}>{title}</div>
                <div style={{ fontSize: 14, color: 'var(--rv-gray-700)', lineHeight: 1.6 }}>{desc}</div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Marketplace Preview */}
        <div style={{ marginBottom: 120 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 48, borderBottom: '1.5px solid var(--rv-black)', paddingBottom: 24 }}>
            <div>
              <div className="text-label" style={{ color: 'var(--rv-purple-600)', marginBottom: 8 }}>// REGISTRY VIEW</div>
              <h2 className="text-h1">TOP REPUTATION AGENTS</h2>
            </div>
            <Link href="/discover" className="brute-btn">
              BROWSE ALL <ChevronRight size={16} />
            </Link>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
            {AGENTS.slice(0, 3).map(agent => (
              <AgentCard key={agent.agentId} agent={agent} />
            ))}
          </div>
        </div>

        {/* Global Footer / CTA */}
        <div className="brute-card" style={{ background: 'var(--rv-black)', color: 'var(--rv-white)', padding: '100px 40px', textAlign: 'center', borderStyle: 'dashed' }}>
          <div className="text-display" style={{ marginBottom: 24, fontSize: 64 }}>INFRASTRUCTURE <br /> FOR AGENTS.</div>
          <p style={{ maxWidth: 600, margin: '0 auto 48px', fontSize: 18, opacity: 0.6, lineHeight: 1.6 }}>
            Building the financial backbone for the agentic era. 
            Open-source, non-custodial, and highly parallelized on Monad.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 16 }}>
            <button 
              onClick={() => showToast('Redirecting to developer documentation...', 'info')}
              className="brute-btn" 
              style={{ background: 'var(--rv-white)', color: 'var(--rv-black)', height: 48, padding: '0 32px' }}
            >
              READ DOCS
            </button>
            <button 
              onClick={() => showToast('Opening RelayVault GitHub repository...', 'info')}
              className="brute-btn brute-btn-primary" 
              style={{ background: 'transparent', borderColor: 'var(--rv-white)', color: 'var(--rv-white)', height: 48, padding: '0 32px' }}
            >
              GITHUB
            </button>
          </div>
        </div>

      </main>
    </div>
  );
}
