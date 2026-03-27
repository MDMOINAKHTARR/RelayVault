'use client';
import { motion } from 'framer-motion';
import { Clock, CheckCircle, RefreshCw, XCircle } from 'lucide-react';
import { useState, useEffect } from 'react';
import type { Bid } from '@/lib/mockData';
import { useToast } from './ToastProvider';
import { useRouter } from 'next/navigation';
import { useWriteContract, useAccount } from 'wagmi';
import { NEGOTIATION_ABI, CONTRACT_ADDRESSES } from '@/lib/contracts';
import { stringToHex, pad } from 'viem';

interface NegotiationCardProps {
  bid: Bid;
}

export function NegotiationCard({ bid }: NegotiationCardProps) {
  const [blocksLeft, setBlocksLeft] = useState(bid.ttlBlocks);
  const { showToast } = useToast();
  const router = useRouter();

  const { isConnected } = useAccount();
  const { writeContractAsync } = useWriteContract();

  const handleAccept = async () => {
    if (!isConnected) {
        showToast("Please connect your wallet first.", "error");
        return;
    }
    
    // Guard: contracts must be deployed before sending real transactions
    const contractsDeployed = !!process.env.NEXT_PUBLIC_NEGOTIATION_ADDRESS;
    if (!contractsDeployed) {
        showToast(`Contracts not deployed yet.`, 'error');
        return;
    }

    try {
        // Convert mock string bidId to bytes32 format for contract interactions
        const onchainBidId = pad(stringToHex(bid.bidId.substring(0, 31)), { size: 32 });
        showToast(`Accepting bid ${bid.bidId}...`, 'info');
        
        await writeContractAsync({
          address: CONTRACT_ADDRESSES.NEGOTIATION,
          abi: NEGOTIATION_ABI,
          functionName: 'acceptBid',
          args: [onchainBidId]
        });
        
        showToast(`Accepted bid ${bid.bidId}. Escrow locked!`, 'success');
        setTimeout(() => {
            router.push('/history');
        }, 1500);
    } catch (err: any) {
        showToast(`Transaction failed: ${err.shortMessage || err.message}`, 'error');
        // Fallback for visual testing with mock data: let them proceed visually after seeing the error
        setTimeout(() => {
            router.push('/history');
        }, 3000);
    }
  };

  useEffect(() => {
    if (bid.state !== 'OPEN' && bid.state !== 'COUNTERED') return;
    const timer = setInterval(() => {
      setBlocksLeft(prev => Math.max(0, prev - 1));
    }, 2000);
    return () => clearInterval(timer);
  }, [bid.state]);

  const stateColors: Record<string, string> = {
    OPEN: 'var(--rv-teal-600)',
    COUNTERED: 'var(--rv-yellow)',
    ACCEPTED: 'var(--rv-purple-600)',
    EXPIRED: 'var(--rv-gray-400)',
    CANCELLED: 'var(--rv-coral-600)',
  };

  return (
    <div className="brute-card" style={{ padding: 24, background: 'var(--rv-pure-white)' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
        <div>
          <div className="text-h3" style={{ fontWeight: 700 }}>
            {bid.initiatorName} <span style={{ color: 'var(--rv-gray-300)' }}>→</span> {bid.targetName}
          </div>
          <div style={{ fontFamily: 'var(--rv-font-mono)', fontSize: 11, color: 'var(--rv-gray-400)', marginTop: 6, display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontWeight: 700, color: 'var(--rv-black)' }}>{bid.bidId}</span>
            <span>·</span>
            <span style={{ color: blocksLeft < 20 ? 'var(--rv-coral-600)' : 'var(--rv-black)', display: 'flex', alignItems: 'center', gap: 4, fontWeight: 700 }}>
              <Clock size={12} /> TTL_{blocksLeft}_BLOCKS
            </span>
          </div>
        </div>
        <span className="brute-badge" style={{ background: stateColors[bid.state], color: bid.state === 'COUNTERED' ? 'var(--rv-black)' : 'var(--rv-white)', borderColor: 'var(--rv-black)', fontWeight: 800 }}>
          {bid.state}
        </span>
      </div>

      {/* Timeline */}
      <div style={{ position: 'relative', paddingLeft: 32, display: 'flex', flexDirection: 'column', gap: 20, marginBottom: 24 }}>
        <div style={{ position: 'absolute', left: 7, top: 0, bottom: 0, width: '1.5px', background: 'var(--rv-black)', borderStyle: 'dashed' }} />
        
        {bid.counterHistory.map((event, i) => {
          const isLast = i === bid.counterHistory.length - 1;
          return (
            <div key={i} style={{ position: 'relative' }}>
              <div style={{ 
                position: 'absolute', left: -32, top: 4, 
                width: 16, height: 16, background: i === 0 ? 'var(--rv-purple-600)' : 'var(--rv-yellow)', 
                border: '1.5px solid var(--rv-black)',
                zIndex: 2
              }} />
              <div>
                <div className="text-label" style={{ fontSize: 10, color: 'var(--rv-gray-400)', marginBottom: 2 }}>BY_{event.by.toUpperCase()}</div>
                <div style={{ fontFamily: 'var(--rv-font-mono)', fontSize: 18, fontWeight: 800 }}>
                  ${event.price.toLocaleString()} USDC
                </div>
                <div style={{ fontSize: 10, color: 'var(--rv-gray-400)', marginTop: 2, fontFamily: 'var(--rv-font-mono)' }}>
                  {new Date(event.at).toLocaleTimeString()}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Actions */}
      {(bid.state === 'OPEN' || bid.state === 'COUNTERED') && (
        <div style={{ display: 'flex', gap: 10 }}>
          <button 
            onClick={handleAccept}
            className="brute-btn brute-btn-teal" 
            style={{ flex: 2 }}
          >
            <CheckCircle size={14} /> ACCEPT
          </button>
          <button 
            onClick={() => showToast(`Opening counter-proposal for ${bid.bidId}`, 'info')}
            className="brute-btn" 
            style={{ flex: 1 }}
          >
            <RefreshCw size={14} /> COUNTER
          </button>
          <button 
            onClick={() => showToast(`Cancelling bid ${bid.bidId}...`, 'error')}
            className="brute-btn" 
            style={{ color: 'var(--rv-coral-600)', borderColor: 'var(--rv-coral-600)' }}
          >
            <XCircle size={14} />
          </button>
        </div>
      )}
    </div>
  );
}
