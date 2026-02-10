import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Globe } from "lucide-react";
import type { Clan, PulseData } from "@/types";

export interface GlobeVisualizationProps {
  pulseData: PulseData[];
  clans: Clan[];
}

const GlobeVisualization = ({ pulseData, clans }: GlobeVisualizationProps) => {
  const [selectedNode, setSelectedNode] = useState<string | null>(null);

  // Generate node positions in a circular pattern
  const neighbourhoodNodes = pulseData.map((p, i) => {
    const angle = (i / pulseData.length) * Math.PI * 2;
    const radius = 120;
    return {
      id: p.neighbourhood,
      type: "neighbourhood" as const,
      x: 50 + Math.cos(angle) * 35,
      y: 50 + Math.sin(angle) * 35,
      size: Math.max(20, p.active_today),
      data: p,
    };
  });

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <div className="relative bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl overflow-hidden" style={{ height: "28rem" }}>
        {/* Animated background */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(50)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute h-1 w-1 rounded-full bg-white/20"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                opacity: [0.2, 0.8, 0.2],
              }}
              transition={{
                duration: 2 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>

        {/* Connection lines */}
        <svg className="absolute inset-0 w-full h-full">
          {neighbourhoodNodes.slice(0, -1).map((node, i) => {
            const nextNode = neighbourhoodNodes[(i + 1) % neighbourhoodNodes.length];
            return (
              <motion.line
                key={`${node.id}-${nextNode.id}`}
                x1={`${node.x}%`}
                y1={`${node.y}%`}
                x2={`${nextNode.x}%`}
                y2={`${nextNode.y}%`}
                stroke="rgba(255,255,255,0.1)"
                strokeWidth="1"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1, delay: i * 0.1 }}
              />
            );
          })}
        </svg>

        {/* Neighbourhood nodes */}
        {neighbourhoodNodes.map((node, i) => (
          <motion.button
            key={node.id}
            className="absolute transform -translate-x-1/2 -translate-y-1/2 group"
            style={{ left: `${node.x}%`, top: `${node.y}%` }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: i * 0.1, type: "spring" }}
            onClick={() => setSelectedNode(selectedNode === node.id ? null : node.id)}
          >
            <div
              className={`rounded-full bg-gradient-to-br from-primary to-sakura flex items-center justify-center transition-all ${selectedNode === node.id ? "ring-4 ring-white/40" : "group-hover:ring-2 group-hover:ring-white/20"
                }`}
              style={{
                width: `${Math.max(24, node.size / 2)}px`,
                height: `${Math.max(24, node.size / 2)}px`,
              }}
            >
              <span className="text-[8px] font-bold text-white">{node.data.active_today}</span>
            </div>
            <p className="absolute top-full left-1/2 -translate-x-1/2 mt-1 text-[10px] text-white/60 whitespace-nowrap">
              {node.id}
            </p>
          </motion.button>
        ))}

        {/* Center info */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
          <div className="h-20 w-20 rounded-full bg-gradient-to-br from-primary/30 to-sakura/30 backdrop-blur-sm flex items-center justify-center mb-2">
            <Globe className="h-10 w-10 text-white/80" />
          </div>
          <p className="text-white/60 text-xs">
            {pulseData.reduce((sum, p) => sum + p.active_today, 0)} active
          </p>
        </div>

        {/* Selected node info */}
        <AnimatePresence>
          {selectedNode && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="absolute bottom-4 left-4 right-4 bg-white/10 backdrop-blur-md rounded-xl p-4"
            >
              {(() => {
                const nodeData = pulseData.find((p) => p.neighbourhood === selectedNode);
                if (!nodeData) return null;
                return (
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-white">{nodeData.neighbourhood}</h4>
                      <p className="text-xs text-white/60">
                        {nodeData.active_today} active · Mood {nodeData.avg_mood.toFixed(1)}
                      </p>
                    </div>
                    <div className="flex gap-1">
                      {nodeData.top_interests.map((interest) => (
                        <span key={interest} className="px-2 py-1 rounded-full bg-white/10 text-xs text-white/80">
                          {interest}
                        </span>
                      ))}
                    </div>
                  </div>
                );
              })()}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-6 mt-4 text-xs text-muted-foreground">
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-gradient-to-br from-primary to-sakura" />
          <span>Neighbourhoods</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-0.5 w-4 bg-muted-foreground/30" />
          <span>Connections</span>
        </div>
      </div>
    </motion.div>
  );
};

export default GlobeVisualization;
