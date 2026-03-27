'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import { AgentCard } from '@/components/AgentCard';
import { AGENTS, type Agent } from '@/lib/mockData';
import { Search, SlidersHorizontal, X, Filter } from 'lucide-react';
import { useToast } from '@/components/ToastProvider';

const ALL_CAPABILITIES = Array.from(new Set(AGENTS.flatMap(a => a.capabilities)));
const DOMAINS = Array.from(new Set(ALL_CAPABILITIES.map(c => c.split(':')[0])));

export default function DiscoverPage() {
  const [search, setSearch] = useState('');
  const [minRep, setMinRep] = useState(0);
  const [maxPrice, setMaxPrice] = useState(500);
  const [domain, setDomain] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'reputation' | 'price' | 'tasks'>('reputation');
  const { showToast } = useToast();

  const filtered = AGENTS
    .filter(a => {
      if (search && !a.name.toLowerCase().includes(search.toLowerCase()) &&
          !a.capabilities.some(c => c.toLowerCase().includes(search.toLowerCase()))) return false;
      if (a.reputationScore < minRep) return false;
      if (a.pricingModel.basePrice > maxPrice) return false;
      if (domain && !a.capabilities.some(c => c.startsWith(domain))) return false;
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'reputation') return b.reputationScore - a.reputationScore;
      if (sortBy === 'price') return a.pricingModel.basePrice - b.pricingModel.basePrice;
      return b.totalTasksCompleted - a.totalTasksCompleted;
    });

  return (
    <div style={{ background: 'var(--rv-white)', minHeight: '100vh' }}>
      <Navbar />
      <main style={{ maxWidth: 1200, margin: '0 auto', padding: '40px 40px 120px' }}>

        <div style={{ marginBottom: 48, borderBottom: '1.5px solid var(--rv-black)', paddingBottom: 24 }}>
          <div className="text-label" style={{ color: 'var(--rv-purple-600)', marginBottom: 8 }}>// AGENT MARKETPLACE</div>
          <h1 className="text-h1" style={{ marginBottom: 12 }}>
            DISCOVER AGENTS
          </h1>
          <p style={{ fontSize: 15, color: 'var(--rv-gray-600)', fontFamily: 'var(--rv-font-mono)' }}>
            {AGENTS.length} REGISTERED ENTITIES · VERIFIED ON-CHAIN
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: 40, alignItems: 'start' }}>
          {/* Sidebar filters */}
          <div style={{ position: 'sticky', top: 104 }}>
            <div className="brute-card" style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 32 }}>

              <div>
                <div className="text-label" style={{ marginBottom: 12 }}>Search Registry</div>
                <div style={{ position: 'relative' }}>
                  <Search size={16} style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: 'var(--rv-gray-400)' }} />
                  <input
                    className="brute-input"
                    style={{ paddingLeft: 44, height: 44, width: '100%' }}
                    placeholder="NAME OR CAPABILITY..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <div className="text-label" style={{ marginBottom: 12 }}>Capabilities</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {DOMAINS.map(d => (
                    <button
                      key={d}
                      onClick={() => {
                        setDomain(domain === d ? null : d);
                        showToast(`Filtering by ${d.toUpperCase()} domain`, 'info');
                      }}
                      className="brute-badge"
                      style={{ 
                        cursor: 'pointer', 
                        textTransform: 'uppercase', 
                        background: domain === d ? 'var(--rv-black)' : 'var(--rv-white)', 
                        color: domain === d ? 'var(--rv-white)' : 'var(--rv-black)',
                        borderColor: 'var(--rv-black)'
                      }}
                    >
                      {d}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                  <div className="text-label">Min Reputation</div>
                  <span style={{ fontFamily: 'var(--rv-font-mono)', fontSize: 12, fontWeight: 700 }}>{minRep}</span>
                </div>
                <input
                  type="range" min={0} max={1000} value={minRep}
                  onChange={e => setMinRep(+e.target.value)}
                  style={{ width: '100%', accentColor: 'var(--rv-black)' }}
                />
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                  <div className="text-label">Max Price (USDC)</div>
                  <span style={{ fontFamily: 'var(--rv-font-mono)', fontSize: 12, fontWeight: 700 }}>${maxPrice}</span>
                </div>
                <input
                  type="range" min={1} max={500} value={maxPrice}
                  onChange={e => setMaxPrice(+e.target.value)}
                  style={{ width: '100%', accentColor: 'var(--rv-black)' }}
                />
              </div>

              <div>
                <div className="text-label" style={{ marginBottom: 12 }}>Sort Order</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {[['reputation', 'REPUTATION HIGHEST'], ['price', 'PRICE LOWEST'], ['tasks', 'VOLUME HIGHEST']].map(([val, lbl]) => (
                    <label key={val} style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', fontSize: 12, fontWeight: 600, fontFamily: 'var(--rv-font-mono)' }}>
                      <input type="radio" name="sort" value={val} checked={sortBy === val} onChange={() => setSortBy(val as 'reputation' | 'price' | 'tasks')} style={{ accentColor: 'var(--rv-black)', width: 16, height: 16 }} />
                      {lbl}
                    </label>
                  ))}
                </div>
              </div>

              {(search || domain || minRep > 0 || maxPrice < 500) && (
                <button 
                  className="brute-btn" 
                  style={{ borderColor: 'var(--rv-coral-600)', color: 'var(--rv-coral-600)', width: '100%' }}
                  onClick={() => { 
                    setSearch(''); setDomain(null); setMinRep(0); setMaxPrice(500); 
                    showToast('Search filters cleared.', 'info');
                  }}
                >
                  <X size={14} /> CLEAR FILTERS
                </button>
              )}
            </div>
          </div>

          {/* Results */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <span className="text-mono" style={{ fontSize: 13, color: 'var(--rv-gray-400)' }}>
                {filtered.length} AGENTS MATCHING PROTOCOL FILTERS
              </span>
            </div>

            {filtered.length === 0 ? (
              <div className="brute-card" style={{ padding: 80, textAlign: 'center', color: 'var(--rv-gray-400)', borderStyle: 'dotted' }}>
                <Filter size={48} style={{ margin: '0 auto 24px', opacity: 0.2 }} />
                <div className="text-h3" style={{ marginBottom: 8 }}>NO AGENTS FOUND</div>
                <p style={{ fontSize: 14 }}>Try adjusting your filters to see more agents.</p>
                <button 
                  onClick={() => { setSearch(''); setDomain(null); setMinRep(0); setMaxPrice(500); }} 
                  className="brute-btn brute-btn-purple" 
                  style={{ marginTop: 24 }}
                >
                  RESET FILTERS
                </button>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 24 }}>
                {filtered.map((agent, i) => (
                  <motion.div
                    key={agent.agentId}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <AgentCard agent={agent} />
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
