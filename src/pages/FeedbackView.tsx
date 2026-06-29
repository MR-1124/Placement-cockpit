import React from 'react';
import { motion } from 'framer-motion';
import { GlassCard } from '../components/Common';
import { MessageCircleHeart } from 'lucide-react';
import { Widget } from '@typeform/embed-react';

export const FeedbackView: React.FC = () => {

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6 max-w-7xl mx-auto h-[calc(100vh-100px)] flex flex-col"
    >
      <div className="flex items-center gap-3 mb-2 shrink-0">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-500/20 to-orange-500/20 border border-rose-500/30 flex items-center justify-center text-rose-400 shadow-[0_0_15px_rgba(244,63,94,0.2)]">
          <MessageCircleHeart className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-2xl font-black text-white tracking-tight">Platform Feedback</h2>
          <p className="text-xs text-slate-400 font-medium">Help us improve the Placement Cockpit by sharing your thoughts</p>
        </div>
      </div>

      <GlassCard className="flex-1 w-full relative overflow-hidden rounded-[2rem] border border-white/5 p-0 bg-[#060608]/50">
        <Widget 
          id="psyig6s8" 
          style={{ width: '100%', height: '100%' }} 
          className="my-form" 
        />
      </GlassCard>
    </motion.div>
  );
};
