'use client';
import { motion } from 'framer-motion';
import { AGENTS, type Agent } from '@/lib/mockData';
import { Shield, Zap, TrendingUp, User } from 'lucide-react';
import { useToast } from './ToastProvider';
import { useRouter } from 'next/navigation';
import { useWriteContract, useAccount, useReadContract } from 'wagmi';
import { NEGOTIATION_ABI, REGISTRY_ABI, CONTRACT_ADDRESSES } from '@/lib/contracts';
import { parseUnits } from 'viem';

function getCapabilityColor(cap: string) {
  if (cap.startsWith('code')) return 'badge-purple';
  if (cap.startsWith('finance') || cap.startsWith('data')) return 'badge-teal';
  if (cap.startsWith('legal') || cap.startsWith('compliance')) return 'badge-amber';
  if (cap.startsWith('media') || cap.startsWith('language')) return 'badge-coral';
  if (cap.startsWith('ai') || cap.startsWith('governance')) return 'badge-gray';
  return 'badge-gray';
}

function getReputationColor(score: number) {
  if (score >= 900) return 'var(--rv-teal-600)';
  if (score >= 800) return 'var(--rv-purple-600)';
  if (score >= 700) return 'var(--rv-yellow)';
  return 'var(--rv-coral-600)';
}

function getAvatarGradient(avatar: string) {
  return 'var(--rv-black)';
}

interface AgentCardProps {
  agent: Agent;
  compact?: boolean;
}

export function AgentCard({ agent, compact = false }: AgentCardProps) {
  const { showToast } = useToast();
  const router = useRouter();
  const { isConnected } = useAccount();
  const { writeContractAsync } = useWriteContract();

  // Fetch real on-chain data for this agent from the Registry
  const { data: onChainAgentData } = useReadContract({
    address: CONTRACT_ADDRESSES.REGISTRY,
    abi: REGISTRY_ABI,
    functionName: 'getAgent',
    args: [agent.agentId as `0x${string}`],
  });

  const onChainAgent = onChainAgentData as any;
  const isRegisteredOnChain = onChainAgent && onChainAgent.registeredAt > 0n;

  const displayRep = isRegisteredOnChain ? Number(onChainAgent.reputationScore) : agent.reputationScore;
  // UI expects 'ACTIVE' or 'INACTIVE'. AgentStatus enum: 0=ACTIVE, 1=SUSPENDED, 2=INACTIVE
  const displayStatus = isRegisteredOnChain ? (onChainAgent.status === 0 ? 'ACTIVE' : 'INACTIVE') : agent.status;
  const displayTasks = isRegisteredOnChain ? Number(onChainAgent.totalTasksCompleted) : agent.totalTasksCompleted;
  
  const repColor = getReputationColor(displayRep);

  const handleHire = async () => {
    if (!isConnected) {
        showToast("Please connect your wallet first.", "error");
        return;
    }

    // Guard: contracts must be deployed before sending real transactions
    const contractsDeployed = !!process.env.NEXT_PUBLIC_NEGOTIATION_ADDRESS;
    if (!contractsDeployed) {
        showToast(`Contracts not deployed yet. Run: npx hardhat run scripts/deploy.ts --network monad_testnet`, 'error');
        return;
    }

    try {
        showToast(`Broadcasting bid for ${agent.name}...`, 'info');
        await writeContractAsync({
          address: CONTRACT_ADDRESSES.NEGOTIATION,
          abi: NEGOTIATION_ABI,
          functionName: 'submitBid',
          args: [
            "QmTaskSpecPlaceholder",
            agent.agentId as `0x${string}`,
            parseUnits(agent.pricingModel.basePrice.toString(), 6),
            BigInt(100)
          ]
        });
        showToast(`Bid broadcasted successfully!`, 'success');
        setTimeout(() => router.push(`/negotiate?agentId=${agent.agentId}`), 1200);
    } catch (err: any) {
        showToast(`Transaction failed: ${err.shortMessage || err.message}`, 'error');
    }
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ 
        transform: 'translate(-3px, -3px)',
        boxShadow: '7px 7px 0px var(--rv-black)'
      }}
      className="brute-card"
      style={{ 
        padding: compact ? '16px' : '24px', 
        cursor: 'pointer',
        background: 'var(--rv-pure-white)'
      }}
    >
      {/* Avatar + Status */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
        <div style={{
          width: 48, height: 48,
          background: getAvatarGradient(agent.avatar),
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: 'var(--rv-font-mono)', fontSize: 13, fontWeight: 700, color: 'var(--rv-white)',
          border: '1.5px solid var(--rv-black)'
        }}>
          {agent.avatar}
        </div>
        <span className={`brute-badge ${displayStatus === 'ACTIVE' ? 'badge-success' : 'badge-error'}`}>
          {displayStatus}
        </span>
      </div>

      {/* Name + role */}
      <div className="text-h2" style={{ marginBottom: 2 }}>{agent.name}</div>
      <div style={{ fontSize: 11, color: 'var(--rv-gray-400)', marginBottom: 14, fontFamily: 'var(--rv-font-mono)', textTransform: 'uppercase' }}>
        {agent.pricingModel.pricingType} · {agent.pricingModel.currency}
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginBottom: 14 }}>
        {[
          { val: `${agent.pricingModel.basePrice}`, lbl: 'BASE/USDC' },
          { val: displayTasks.toLocaleString(), lbl: 'TASKS' },
          { val: `${agent.disputeRate}%`, lbl: 'DISPUTES' },
        ].map(({ val, lbl }) => (
          <div key={lbl} style={{ textAlign: 'center', padding: '10px 4px', border: '1px solid var(--rv-gray-100)', background: 'var(--rv-white)' }}>
            <div style={{ fontFamily: 'var(--rv-font-mono)', fontSize: 15, fontWeight: 700 }}>{val}</div>
            <div className="text-label" style={{ fontSize: 9, marginTop: 2 }}>{lbl}</div>
          </div>
        ))}
      </div>

      {/* Reputation bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
        <span className="text-label" style={{ color: 'var(--rv-gray-700)' }}>Reputation</span>
        <span style={{ fontFamily: 'var(--rv-font-mono)', fontSize: 11, color: repColor, fontWeight: 700 }}>
          {displayRep}/1000
        </span>
      </div>
      <div style={{ height: 12, border: '1.5px solid var(--rv-black)', background: 'var(--rv-white)', position: 'relative' }}>
        <div style={{ height: '100%', width: `${displayRep / 10}%`, background: repColor }} />
      </div>

      {!compact && (
        <>
          {/* Capabilities */}
          <div style={{ marginTop: 14, display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {agent.capabilities.slice(0, 3).map(cap => (
              <span key={cap} className="brute-badge" style={{ fontSize: 9, background: 'var(--rv-white)', borderColor: 'var(--rv-black)', color: 'var(--rv-black)' }}>
                {cap.split(':').pop()?.toUpperCase()}
              </span>
            ))}
          </div>

          {/* Actions */}
          <div style={{ marginTop: 16, display: 'flex', gap: 10 }}>
            <button 
              onClick={handleHire}
              className="brute-btn brute-btn-purple" 
              style={{ flex: 1 }}
            >
              <Zap size={14} /> HIRE
            </button>
            <button 
              onClick={() => showToast(`Opening ${agent.name}'s profile.`, 'info')}
              className="brute-btn"
              style={{ padding: '0 12px' }}
            >
              <User size={14} />
            </button>
          </div>
        </>
      )}
    </motion.div>
  );
}
