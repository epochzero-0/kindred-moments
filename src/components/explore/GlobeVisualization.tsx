import { useState, useRef, useMemo, useEffect, Suspense } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, Float, Text, Sphere, Trail, MeshDistortMaterial } from "@react-three/drei";
import { motion, AnimatePresence } from "framer-motion";
import * as THREE from "three";
import { 
  Users, Activity, Zap, Heart, MessageCircle, Sparkles, 
  TrendingUp, MapPin, Clock, ChevronRight, X
} from "lucide-react";
import { useChatConnections } from "@/hooks/use-chat-connections";
import { useNavigate } from "react-router-dom";
import type { Clan, PulseData } from "@/types";

export interface GlobeVisualizationProps {
  pulseData: PulseData[];
  clans: Clan[];
}

// Singapore neighbourhood coordinates (normalized to sphere)
const neighbourhoodPositions: Record<string, [number, number, number]> = {
  "Jurong East": [-0.8, 0.2, 0.5],
  "Tampines": [0.7, 0.3, 0.6],
  "Punggol": [0.5, 0.6, 0.5],
  "Sengkang": [0.4, 0.5, 0.7],
  "Woodlands": [0.1, 0.8, 0.5],
  "Yishun": [0.2, 0.7, 0.6],
  "Bedok": [0.8, 0.1, 0.5],
  "Clementi": [-0.6, 0.1, 0.7],
  "Bishan": [0.1, 0.4, 0.9],
  "Toa Payoh": [0.0, 0.3, 0.95],
  "Ang Mo Kio": [0.2, 0.5, 0.8],
  "Hougang": [0.5, 0.4, 0.7],
};

// Activity types for simulated events
const activityTypes = [
  { type: "join", icon: "👋", label: "joined a group", color: "#22c55e" },
  { type: "match", icon: "💫", label: "new connection", color: "#ec4899" },
  { type: "event", icon: "🎉", label: "event starting", color: "#8b5cf6" },
  { type: "chat", icon: "💬", label: "active chat", color: "#3b82f6" },
  { type: "goal", icon: "🎯", label: "goal achieved", color: "#f59e0b" },
];

// Glowing orb for each neighbourhood
function NeighbourhoodNode({ 
  position, 
  data, 
  isSelected, 
  isPersonal,
  onClick 
}: { 
  position: [number, number, number];
  data: PulseData;
  isSelected: boolean;
  isPersonal: boolean;
  onClick: () => void;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  
  // Normalize size based on activity
  const size = 0.08 + (data.active_today / 50) * 0.12;
  
  // Pulse animation
  useFrame(({ clock }) => {
    if (meshRef.current) {
      const pulse = Math.sin(clock.elapsedTime * 2) * 0.02;
      meshRef.current.scale.setScalar(1 + pulse + (hovered ? 0.2 : 0) + (isSelected ? 0.3 : 0));
    }
    if (glowRef.current) {
      glowRef.current.scale.setScalar(1.5 + Math.sin(clock.elapsedTime * 3) * 0.1);
    }
  });

  // Color based on mood (green = happy, yellow = neutral, red = low)
  const moodColor = useMemo(() => {
    if (data.avg_mood >= 4) return "#22c55e";
    if (data.avg_mood >= 3) return "#eab308";
    return "#f97316";
  }, [data.avg_mood]);

  return (
    <Float speed={2} rotationIntensity={0.2} floatIntensity={0.3}>
      <group position={position}>
        {/* Outer glow */}
        <mesh ref={glowRef}>
          <sphereGeometry args={[size * 2, 16, 16]} />
          <meshBasicMaterial 
            color={isPersonal ? "#ec4899" : moodColor} 
            transparent 
            opacity={0.15} 
          />
        </mesh>
        
        {/* Main node */}
        <mesh 
          ref={meshRef}
          onClick={(e) => { e.stopPropagation(); onClick(); }}
          onPointerOver={() => setHovered(true)}
          onPointerOut={() => setHovered(false)}
        >
          <sphereGeometry args={[size, 32, 32]} />
          <MeshDistortMaterial
            color={isPersonal ? "#ec4899" : moodColor}
            emissive={isPersonal ? "#ec4899" : moodColor}
            emissiveIntensity={isSelected ? 1.5 : hovered ? 1 : 0.5}
            distort={0.2}
            speed={2}
            roughness={0.2}
            metalness={0.8}
          />
        </mesh>

        {/* Activity indicator ring */}
        {data.active_today > 15 && (
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <ringGeometry args={[size * 1.5, size * 1.7, 32]} />
            <meshBasicMaterial color="#ffffff" transparent opacity={0.3} side={THREE.DoubleSide} />
          </mesh>
        )}

        {/* Label */}
        <Text
          position={[0, size + 0.08, 0]}
          fontSize={0.06}
          color="white"
          anchorX="center"
          anchorY="bottom"
          outlineWidth={0.003}
          outlineColor="#000000"
        >
          {data.neighbourhood}
        </Text>
        
        {/* Activity count badge */}
        <Text
          position={[0, -size - 0.05, 0]}
          fontSize={0.04}
          color="#94a3b8"
          anchorX="center"
          anchorY="top"
        >
          {data.active_today} active
        </Text>
      </group>
    </Float>
  );
}

// Animated particle stream between nodes
function ParticleStream({ 
  start, 
  end, 
  color,
  speed = 1
}: { 
  start: [number, number, number];
  end: [number, number, number];
  color: string;
  speed?: number;
}) {
  const ref = useRef<THREE.Mesh>(null);
  const [progress, setProgress] = useState(Math.random());

  useFrame((_, delta) => {
    setProgress(p => {
      const next = p + delta * speed * 0.3;
      return next > 1 ? 0 : next;
    });
    
    if (ref.current) {
      // Lerp position along the path
      ref.current.position.x = start[0] + (end[0] - start[0]) * progress;
      ref.current.position.y = start[1] + (end[1] - start[1]) * progress;
      ref.current.position.z = start[2] + (end[2] - start[2]) * progress;
      
      // Add arc to the path
      const arc = Math.sin(progress * Math.PI) * 0.3;
      ref.current.position.y += arc;
    }
  });

  return (
    <Trail
      width={0.5}
      length={6}
      color={color}
      attenuation={(t) => t * t}
    >
      <mesh ref={ref}>
        <sphereGeometry args={[0.015, 8, 8]} />
        <meshBasicMaterial color={color} />
      </mesh>
    </Trail>
  );
}

// Central pulsing core
function CentralCore() {
  const coreRef = useRef<THREE.Mesh>(null);
  const ringsRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (coreRef.current) {
      coreRef.current.rotation.y = clock.elapsedTime * 0.2;
      coreRef.current.rotation.x = Math.sin(clock.elapsedTime * 0.5) * 0.1;
    }
    if (ringsRef.current) {
      ringsRef.current.rotation.z = clock.elapsedTime * 0.3;
      ringsRef.current.rotation.x = clock.elapsedTime * 0.1;
    }
  });

  return (
    <group>
      {/* Central glowing sphere */}
      <mesh ref={coreRef}>
        <sphereGeometry args={[0.15, 64, 64]} />
        <MeshDistortMaterial
          color="#8b5cf6"
          emissive="#8b5cf6"
          emissiveIntensity={2}
          distort={0.4}
          speed={3}
          roughness={0}
          metalness={1}
        />
      </mesh>
      
      {/* Orbiting rings */}
      <group ref={ringsRef}>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.25, 0.005, 16, 100]} />
          <meshBasicMaterial color="#ec4899" transparent opacity={0.6} />
        </mesh>
        <mesh rotation={[Math.PI / 3, Math.PI / 4, 0]}>
          <torusGeometry args={[0.3, 0.003, 16, 100]} />
          <meshBasicMaterial color="#22c55e" transparent opacity={0.4} />
        </mesh>
        <mesh rotation={[Math.PI / 4, Math.PI / 2, 0]}>
          <torusGeometry args={[0.35, 0.002, 16, 100]} />
          <meshBasicMaterial color="#3b82f6" transparent opacity={0.3} />
        </mesh>
      </group>
      
      {/* Inner glow */}
      <Sphere args={[0.4, 32, 32]}>
        <meshBasicMaterial color="#8b5cf6" transparent opacity={0.05} />
      </Sphere>
    </group>
  );
}

// Floating particles background
function BackgroundParticles() {
  const particlesRef = useRef<THREE.Points>(null);
  
  const particles = useMemo(() => {
    const count = 200;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    
    for (let i = 0; i < count; i++) {
      // Spread particles in a sphere
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const radius = 1.5 + Math.random() * 1;
      
      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = radius * Math.cos(phi);
      
      // Random colors
      const colorChoice = Math.random();
      if (colorChoice < 0.33) {
        colors[i * 3] = 0.55; colors[i * 3 + 1] = 0.36; colors[i * 3 + 2] = 0.96; // Purple
      } else if (colorChoice < 0.66) {
        colors[i * 3] = 0.93; colors[i * 3 + 1] = 0.29; colors[i * 3 + 2] = 0.6; // Pink
      } else {
        colors[i * 3] = 0.13; colors[i * 3 + 1] = 0.77; colors[i * 3 + 2] = 0.37; // Green
      }
    }
    
    return { positions, colors };
  }, []);

  useFrame(({ clock }) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y = clock.elapsedTime * 0.02;
      particlesRef.current.rotation.x = Math.sin(clock.elapsedTime * 0.1) * 0.1;
    }
  });

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particles.positions.length / 3}
          array={particles.positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={particles.colors.length / 3}
          array={particles.colors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.015}
        vertexColors
        transparent
        opacity={0.8}
        sizeAttenuation
      />
    </points>
  );
}

// Event burst effect
function EventBurst({ position, color }: { position: [number, number, number]; color: string }) {
  const ref = useRef<THREE.Mesh>(null);
  const [scale, setScale] = useState(0);
  const [opacity, setOpacity] = useState(1);

  useFrame((_, delta) => {
    setScale(s => Math.min(s + delta * 3, 1.5));
    setOpacity(o => Math.max(o - delta * 1.5, 0));
  });

  if (opacity <= 0) return null;

  return (
    <mesh ref={ref} position={position} scale={scale}>
      <ringGeometry args={[0.1, 0.15, 32]} />
      <meshBasicMaterial color={color} transparent opacity={opacity} side={THREE.DoubleSide} />
    </mesh>
  );
}

// Main 3D Scene
function GlobeScene({ 
  pulseData, 
  selectedNode, 
  onSelectNode,
  personalNeighbourhoods,
  events
}: { 
  pulseData: PulseData[];
  selectedNode: string | null;
  onSelectNode: (id: string | null) => void;
  personalNeighbourhoods: string[];
  events: { id: string; from: string; to: string; color: string }[];
}) {
  const { camera } = useThree();
  
  // Generate connections between active neighbourhoods
  const connections = useMemo(() => {
    const conns: { start: [number, number, number]; end: [number, number, number]; color: string }[] = [];
    
    pulseData.forEach((p1, i) => {
      pulseData.slice(i + 1).forEach(p2 => {
        // Connect if they share interests
        const sharedInterests = p1.top_interests.filter(int => p2.top_interests.includes(int));
        if (sharedInterests.length > 0) {
          const pos1 = neighbourhoodPositions[p1.neighbourhood] || [0, 0, 0];
          const pos2 = neighbourhoodPositions[p2.neighbourhood] || [0, 0, 0];
          conns.push({
            start: pos1 as [number, number, number],
            end: pos2 as [number, number, number],
            color: sharedInterests.length > 1 ? "#ec4899" : "#8b5cf6"
          });
        }
      });
    });
    
    return conns.slice(0, 15); // Limit for performance
  }, [pulseData]);

  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.3} />
      <pointLight position={[5, 5, 5]} intensity={1} color="#ffffff" />
      <pointLight position={[-5, -5, -5]} intensity={0.5} color="#8b5cf6" />
      
      {/* Background particles */}
      <BackgroundParticles />
      
      {/* Central core */}
      <CentralCore />
      
      {/* Neighbourhood nodes */}
      {pulseData.map(data => {
        const pos = neighbourhoodPositions[data.neighbourhood];
        if (!pos) return null;
        
        return (
          <NeighbourhoodNode
            key={data.neighbourhood}
            position={pos}
            data={data}
            isSelected={selectedNode === data.neighbourhood}
            isPersonal={personalNeighbourhoods.includes(data.neighbourhood)}
            onClick={() => onSelectNode(selectedNode === data.neighbourhood ? null : data.neighbourhood)}
          />
        );
      })}
      
      {/* Animated particle streams */}
      {connections.map((conn, i) => (
        <ParticleStream
          key={i}
          start={conn.start}
          end={conn.end}
          color={conn.color}
          speed={0.5 + Math.random() * 0.5}
        />
      ))}
      
      {/* Event bursts */}
      {events.map(event => {
        const pos = neighbourhoodPositions[event.to];
        if (!pos) return null;
        return <EventBurst key={event.id} position={pos} color={event.color} />;
      })}
      
      {/* Camera controls */}
      <OrbitControls
        enableZoom={true}
        enablePan={false}
        minDistance={1.5}
        maxDistance={4}
        autoRotate
        autoRotateSpeed={0.5}
      />
    </>
  );
}

// Live activity feed item
interface LiveEvent {
  id: string;
  type: string;
  neighbourhood: string;
  message: string;
  timestamp: Date;
  icon: string;
  color: string;
}

const GlobeVisualization = ({ pulseData, clans }: GlobeVisualizationProps) => {
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [liveEvents, setLiveEvents] = useState<LiveEvent[]>([]);
  const [showActivityFeed, setShowActivityFeed] = useState(true);
  const [particleEvents, setParticleEvents] = useState<{ id: string; from: string; to: string; color: string }[]>([]);
  const { joinedGroups } = useChatConnections();
  const navigate = useNavigate();

  // Get liked users from session storage
  const getLikedUserNeighbourhoods = () => {
    try {
      const saved = sessionStorage.getItem("swipe-state");
      if (saved) {
        const state = JSON.parse(saved);
        return (state.likedUsers || []).map((u: { neighbourhood: string }) => u.neighbourhood);
      }
    } catch {
      // Ignore
    }
    return [];
  };

  const personalNeighbourhoods = useMemo((): string[] => {
    const liked = getLikedUserNeighbourhoods() as string[];
    return [...new Set(liked)];
  }, []);

  // Simulate live events
  useEffect(() => {
    const generateEvent = () => {
      const activity = activityTypes[Math.floor(Math.random() * activityTypes.length)];
      const neighbourhood = pulseData[Math.floor(Math.random() * pulseData.length)];
      
      const names = ["Sarah", "Wei Ming", "Priya", "Ahmad", "Michelle", "Jason", "Mei Ling", "Ravi"];
      const name = names[Math.floor(Math.random() * names.length)];
      
      const newEvent: LiveEvent = {
        id: `event-${Date.now()}`,
        type: activity.type,
        neighbourhood: neighbourhood.neighbourhood,
        message: `${name} ${activity.label}`,
        timestamp: new Date(),
        icon: activity.icon,
        color: activity.color,
      };
      
      setLiveEvents(prev => [newEvent, ...prev].slice(0, 5));
      
      // Add particle event
      const targetNeighbourhood = pulseData[Math.floor(Math.random() * pulseData.length)];
      setParticleEvents(prev => [...prev, {
        id: newEvent.id,
        from: neighbourhood.neighbourhood,
        to: targetNeighbourhood.neighbourhood,
        color: activity.color,
      }]);
      
      // Remove particle event after animation
      setTimeout(() => {
        setParticleEvents(prev => prev.filter(e => e.id !== newEvent.id));
      }, 3000);
    };

    // Initial events
    for (let i = 0; i < 3; i++) {
      setTimeout(() => generateEvent(), i * 500);
    }

    // Continuous events
    const interval = setInterval(generateEvent, 4000);
    return () => clearInterval(interval);
  }, [pulseData]);

  const selectedData = pulseData.find(p => p.neighbourhood === selectedNode);

  // Stats calculation
  const totalActive = pulseData.reduce((sum, p) => sum + p.active_today, 0);
  const avgMood = pulseData.reduce((sum, p) => sum + p.avg_mood, 0) / pulseData.length;

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      exit={{ opacity: 0 }}
      className="relative"
    >
      {/* Stats header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 text-emerald-500">
            <Activity className="h-4 w-4" />
            <span className="text-sm font-medium">{totalActive} active</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-yellow-500/10 text-yellow-500">
            <Sparkles className="h-4 w-4" />
            <span className="text-sm font-medium">{avgMood.toFixed(1)} mood</span>
          </div>
        </div>
        <button
          onClick={() => setShowActivityFeed(!showActivityFeed)}
          className="p-2 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
        >
          <Zap className={`h-4 w-4 ${showActivityFeed ? "text-primary" : "text-muted-foreground"}`} />
        </button>
      </div>

      {/* 3D Globe Canvas */}
      <div 
        className="relative rounded-3xl overflow-hidden"
        style={{ height: "24rem", background: "linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%)" }}
      >
        <Suspense fallback={
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="animate-pulse text-white/60">Loading community pulse...</div>
          </div>
        }>
          <Canvas camera={{ position: [0, 0, 2.5], fov: 50 }}>
            <GlobeScene
              pulseData={pulseData}
              selectedNode={selectedNode}
              onSelectNode={setSelectedNode}
              personalNeighbourhoods={personalNeighbourhoods}
              events={particleEvents}
            />
          </Canvas>
        </Suspense>

        {/* Live activity feed overlay */}
        <AnimatePresence>
          {showActivityFeed && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="absolute top-4 right-4 w-48"
            >
              <div className="bg-black/40 backdrop-blur-md rounded-xl p-3 border border-white/10">
                <div className="flex items-center gap-2 mb-2">
                  <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-xs text-white/80 font-medium">Live Activity</span>
                </div>
                <div className="space-y-2">
                  {liveEvents.slice(0, 4).map((event, i) => (
                    <motion.div
                      key={event.id}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1 - i * 0.2, y: 0 }}
                      className="flex items-start gap-2"
                    >
                      <span className="text-sm">{event.icon}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-[10px] text-white/90 truncate">{event.message}</p>
                        <p className="text-[9px] text-white/50">{event.neighbourhood}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Interaction hint */}
        <div className="absolute bottom-4 left-4 flex items-center gap-2 text-white/40 text-xs">
          <div className="flex items-center gap-1">
            <div className="h-4 w-4 rounded border border-white/20 flex items-center justify-center text-[8px]">↔</div>
            <span>Drag to rotate</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="h-4 w-4 rounded border border-white/20 flex items-center justify-center text-[8px]">⊕</div>
            <span>Scroll to zoom</span>
          </div>
        </div>

        {/* Personal network indicator */}
        {personalNeighbourhoods.length > 0 && (
          <div className="absolute bottom-4 right-4">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-pink-500/20 backdrop-blur-sm border border-pink-500/30">
              <Heart className="h-3 w-3 text-pink-400" />
              <span className="text-[10px] text-pink-300">{personalNeighbourhoods.length} connections</span>
            </div>
          </div>
        )}
      </div>

      {/* Selected neighbourhood deep-dive panel */}
      <AnimatePresence>
        {selectedNode && selectedData && (
          <motion.div
            initial={{ opacity: 0, y: 20, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={{ opacity: 0, y: 20, height: 0 }}
            className="mt-4 bg-white rounded-2xl shadow-elevated overflow-hidden"
          >
            {/* Header */}
            <div className="p-4 bg-gradient-to-r from-primary/10 to-sakura/10 border-b border-border/50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <MapPin className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">{selectedData.neighbourhood}</h3>
                    <p className="text-xs text-muted-foreground">
                      {selectedData.active_today} people active right now
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedNode(null)}
                  className="p-2 rounded-lg hover:bg-muted transition-colors"
                >
                  <X className="h-4 w-4 text-muted-foreground" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-4">
              {/* Stats grid */}
              <div className="grid grid-cols-3 gap-3 mb-4">
                <div className="text-center p-3 rounded-xl bg-muted/50">
                  <Users className="h-5 w-5 mx-auto mb-1 text-primary" />
                  <p className="text-lg font-bold text-foreground">{selectedData.active_today}</p>
                  <p className="text-[10px] text-muted-foreground">Active</p>
                </div>
                <div className="text-center p-3 rounded-xl bg-muted/50">
                  <Sparkles className="h-5 w-5 mx-auto mb-1 text-yellow-500" />
                  <p className="text-lg font-bold text-foreground">{selectedData.avg_mood.toFixed(1)}</p>
                  <p className="text-[10px] text-muted-foreground">Mood</p>
                </div>
                <div className="text-center p-3 rounded-xl bg-muted/50">
                  <TrendingUp className="h-5 w-5 mx-auto mb-1 text-emerald-500" />
                  <p className="text-lg font-bold text-foreground">{selectedData.top_interests.length}</p>
                  <p className="text-[10px] text-muted-foreground">Trending</p>
                </div>
              </div>

              {/* Trending interests */}
              <div className="mb-4">
                <p className="text-xs font-medium text-muted-foreground mb-2">Trending interests</p>
                <div className="flex flex-wrap gap-2">
                  {selectedData.top_interests.map(interest => (
                    <button
                      key={interest}
                      onClick={() => navigate(`/explore?tab=groups&q=${encodeURIComponent(interest)}`)}
                      className="px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-medium hover:bg-primary/20 transition-colors flex items-center gap-1"
                    >
                      {interest}
                      <ChevronRight className="h-3 w-3" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Recent activity */}
              <div className="mb-4">
                <p className="text-xs font-medium text-muted-foreground mb-2">Recent activity</p>
                <div className="space-y-2">
                  {liveEvents
                    .filter(e => e.neighbourhood === selectedNode)
                    .slice(0, 3)
                    .map(event => (
                      <div key={event.id} className="flex items-center gap-3 p-2 rounded-lg bg-muted/30">
                        <span className="text-lg">{event.icon}</span>
                        <div className="flex-1">
                          <p className="text-sm text-foreground">{event.message}</p>
                          <p className="text-[10px] text-muted-foreground flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            Just now
                          </p>
                        </div>
                      </div>
                    ))}
                  {liveEvents.filter(e => e.neighbourhood === selectedNode).length === 0 && (
                    <p className="text-xs text-muted-foreground text-center py-4">
                      No recent activity in this area
                    </p>
                  )}
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex gap-2">
                <button
                  onClick={() => navigate(`/explore?tab=members`)}
                  className="flex-1 py-2.5 rounded-xl bg-primary text-white text-sm font-medium flex items-center justify-center gap-2"
                >
                  <Users className="h-4 w-4" />
                  Meet people here
                </button>
                <button
                  onClick={() => navigate(`/explore?tab=groups`)}
                  className="flex-1 py-2.5 rounded-xl bg-muted text-foreground text-sm font-medium flex items-center justify-center gap-2"
                >
                  <MessageCircle className="h-4 w-4" />
                  Join groups
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Legend */}
      <div className="flex items-center justify-center gap-4 mt-4 text-xs text-muted-foreground">
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-emerald-500" />
          <span>High mood</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-yellow-500" />
          <span>Neutral</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-pink-500" />
          <span>Your network</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-1 w-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded" />
          <span>Connections</span>
        </div>
      </div>
    </motion.div>
  );
};

export default GlobeVisualization;
