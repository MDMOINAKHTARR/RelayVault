'use client';
import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import { VaultCard } from '@/components/VaultCard';
import { MY_AGENT, ESCROWS } from '@/lib/mockData';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { Shield, Zap, TrendingUp, Activity, DollarSign, Clock, ArrowUpRight } from 'lucide-react';
import { useToast } from '@/components/ToastProvider';

const reputationHistory = [
  { date: 'JAN', score: 820 }, { date: 'FEB', score: 844 }, { date: 'MAR01', score: 860 },
  { date: 'MAR08', score: 878 }, { date: 'MAR15', score: 891 }, { date: 'MAR22', score: 910 },
  { date: 'TODAY', score: 924 },
];

const earningsHistory = [
  { date: 'JAN', amount: 4200 }, { date: 'FEB', amount: 7800 }, { date: 'MAR01', amount: 11200 },
  { date: 'MAR08', amount: 16400 }, { date: 'MAR15', amount: 22100 }, { date: 'MAR22', amount: 35800 },
  { date: 'TODAY', amount: 48200 },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="brute-card" style={{ padding: '8px 12px', background: 'var(--rv-pure-white)', boxShadow: '4px 4px 0px var(--rv-black)' }}>
        <div style={{ fontFamily: 'var(--rv-font-mono)', fontSize: 10, color: 'var(--rv-gray-400)', marginBottom: 2 }}>{label}</div>
        <div style={{ fontFamily: 'var(--rv-font-mono)', fontSize: 14, fontWeight: 800, color: 'var(--rv-black)' }}>{payload[0].value.toLocaleString()}</div>
      </div>
    );
  }
  return null;
};

export default function DashboardPage() {
  const { showToast } = useToast();
  const kpis = [
    { icon: TrendingUp, label: 'REPUTATION_SCORE', val: MY_AGENT.reputationScore, sub: '+14 ATTESTATIONS', color: 'var(--rv-teal-600)' },
    { icon: DollarSign, label: 'TOTAL_EARNINGS', val: `$${MY_AGENT.totalEarnings.toLocaleString()}`, sub: 'USDC LIFETIME_VOL', color: 'var(--rv-purple-600)' },
    { icon: Activity, label: 'TASKS_COMPLETED', val: MY_AGENT.totalTasksCompleted, sub: '3_ACTIVE_THREADS', color: 'var(--rv-yellow)' },
    { icon: Shield, label: 'BOND_COLLATERAL', val: `$${MY_AGENT.bondCollateral.toLocaleString()}`, sub: `${MY_AGENT.disputeRate}% ERROR_RATE`, color: 'var(--rv-coral-600)' },
  ];

  return (
    <div style={{ background: 'var(--rv-white)', minHeight: '100vh' }}>
      <Navbar />
      <main style={{ maxWidth: 1200, margin: '0 auto', padding: '40px 40px 120px' }}>

        <div style={{ marginBottom: 48, borderBottom: '1.5px solid var(--rv-black)', paddingBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <div>
            <div className="text-label" style={{ color: 'var(--rv-purple-600)', marginBottom: 8 }}>// AGENT_OVERVIEW</div>
            <h1 className="text-h1" style={{ marginBottom: 12 }}>DASHBOARD</h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <span className="text-mono" style={{ fontSize: 12, color: 'var(--rv-gray-400)' }}>{MY_AGENT.agentId}</span>
              <span className="brute-badge badge-success" style={{ fontSize: 10 }}>{MY_AGENT.status.toUpperCase()}</span>
            </div>
          </div>
          <button 
            onClick={() => showToast('Connecting to performance metrics API...', 'info')}
            className="brute-btn" style={{ padding: '0 20px', height: 44 }}
          >
            REFRESH METRICS
          </button>
        </div>

        {/* KPI row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 24, marginBottom: 48 }}>
          {kpis.map(({ icon: Icon, label, val, sub, color }, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="brute-card"
              style={{ padding: '24px' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                <div className="text-label" style={{ fontSize: 10 }}>{label}</div>
                <div style={{ width: 36, height: 36, background: color, border: '1.5px solid var(--rv-black)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon size={16} color="var(--rv-pure-white)" />
                </div>
              </div>
              <div style={{ fontFamily: 'var(--rv-font-mono)', fontSize: 28, fontWeight: 900, marginBottom: 6 }}>{val}</div>
              <div className="text-mono" style={{ fontSize: 11, color: 'var(--rv-gray-400)' }}>{sub}</div>
            </motion.div>
          ))}
        </div>

        {/* Charts row */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32, marginBottom: 48 }}>
          {/* Reputation chart */}
          <div className="brute-card" style={{ padding: 32 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
              <div>
                <div className="text-h3" style={{ fontWeight: 800 }}>REPUTATION HISTORY</div>
                <div className="text-mono" style={{ fontSize: 12, color: 'var(--rv-gray-400)', marginTop: 4 }}>90_DAY_ATTESTATION_FLOW</div>
              </div>
              <ArrowUpRight size={20} style={{ color: 'var(--rv-teal-600)' }} />
            </div>
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={reputationHistory}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--rv-gray-100)" vertical={false} />
                <XAxis dataKey="date" tick={{ fontFamily: 'var(--rv-font-mono)', fontSize: 10, fill: 'var(--rv-gray-400)' }} axisLine={{ stroke: 'var(--rv-black)', strokeWidth: 1.5 }} tickLine={false} />
                <YAxis domain={[800, 1000]} tick={{ fontFamily: 'var(--rv-font-mono)', fontSize: 10, fill: 'var(--rv-gray-400)' }} axisLine={{ stroke: 'var(--rv-black)', strokeWidth: 1.5 }} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="stepAfter" dataKey="score" stroke="var(--rv-black)" strokeWidth={2.5} fill="var(--rv-teal-600)" fillOpacity={1} dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Earnings chart */}
          <div className="brute-card" style={{ padding: 32 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
              <div>
                <div className="text-h3" style={{ fontWeight: 800 }}>EARNINGS VELOCITY</div>
                <div className="text-mono" style={{ fontSize: 12, color: 'var(--rv-gray-400)', marginTop: 4 }}>CUMULATIVE_USDC_SETTLED</div>
              </div>
              <DollarSign size={20} style={{ color: 'var(--rv-purple-600)' }} />
            </div>
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={earningsHistory}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--rv-gray-100)" vertical={false} />
                <XAxis dataKey="date" tick={{ fontFamily: 'var(--rv-font-mono)', fontSize: 10, fill: 'var(--rv-gray-400)' }} axisLine={{ stroke: 'var(--rv-black)', strokeWidth: 1.5 }} tickLine={false} />
                <YAxis tick={{ fontFamily: 'var(--rv-font-mono)', fontSize: 10, fill: 'var(--rv-gray-400)' }} axisLine={{ stroke: 'var(--rv-black)', strokeWidth: 1.5 }} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="stepAfter" dataKey="amount" stroke="var(--rv-black)" strokeWidth={2.5} fill="var(--rv-purple-600)" fillOpacity={1} dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Bottom row */}
        <div style={{ display: 'grid', gridTemplateColumns: '400px 1fr', gap: 32 }}>
          <VaultCard />

          {/* Active escrows */}
          <div className="brute-card" style={{ padding: 32 }}>
            <div className="text-h3" style={{ fontWeight: 800, marginBottom: 8 }}>ACTIVE ESCROWS</div>
            <div className="text-mono" style={{ fontSize: 12, color: 'var(--rv-gray-400)', marginBottom: 24 }}>STAKED_FUNDS_IN_SETTLEMENT</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {ESCROWS.map((e) => {
                  const stateClass: Record<string, string> = { LOCKED: 'badge-primary', COMPLETED: 'badge-success', RELEASED: 'badge-success', DISPUTED: 'badge-error' };
                  return (
                    <div key={e.escrowId} className="brute-card" style={{ padding: '16px 20px', borderStyle: 'solid', display: 'flex', justifyContent: 'space-between', alignItems: 'center', filter: e.state === 'RELEASED' ? 'grayscale(1)' : 'none' }}>
                      <div>
                        <div className="text-mono" style={{ fontSize: 12, fontWeight: 900, marginBottom: 4 }}>{e.escrowId.toUpperCase()}</div>
                        <div className="text-label" style={{ fontSize: 10, color: 'var(--rv-gray-500)' }}>{e.payerName} → {e.receiverName}</div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontFamily: 'var(--rv-font-mono)', fontSize: 18, fontWeight: 900, marginBottom: 6 }}>${e.amount.toLocaleString()}</div>
                        <span className={`brute-badge ${stateClass[e.state] || ''}`} style={{ fontSize: 9 }}>{e.state}</span>
                      </div>
                    </div>
                  );
                })}
            </div>
            <button 
                onClick={() => showToast('Opening comprehensive escrow registry...', 'info')}
                className="brute-btn" 
                style={{ width: '100%', marginTop: 24, background: 'var(--rv-black)', color: 'var(--rv-white)' }}
            >
                VIEW_ALL_SETTLEMENTS
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
