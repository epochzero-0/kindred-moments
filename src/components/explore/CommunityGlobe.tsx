import { useState, useRef, useMemo, useEffect, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Float, Text, Html } from "@react-three/drei";
import { motion, AnimatePresence } from "framer-motion";
import * as THREE from "three";
import { Users, Sparkles, Heart, X, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { User, Clan } from "@/types";

export interface CommunityGlobeProps {
  currentUser: User | null;
  allUsers: User[];
  clans: Clan[];
}

// Calculate 3D position on sphere based on theme clustering and user relevance
const calculateCommunityPosition = (
  theme: string,
  index: number,
  total: number,
  isUserMember: boolean,
  matchesUserInterests: boolean
): [number, number, number] => {
  const themeAngles: Record<string, { theta: number; phi: number }> = {
    fitness: { theta: 0, phi: Math.PI / 4 },
    tech: { theta: Math.PI / 2, phi: Math.PI / 4 },
    art: { theta: Math.PI, phi: Math.PI / 4 },
    food: { theta: -Math.PI / 2, phi: Math.PI / 4 },
    study: { theta: Math.PI / 4, phi: Math.PI / 3 },
    gaming: { theta: 3 * Math.PI / 4, phi: Math.PI / 3 },
    music: { theta: -3 * Math.PI / 4, phi: Math.PI / 3 },
    pets: { theta: -Math.PI / 4, phi: Math.PI / 3 },
    books: { theta: Math.PI / 6, phi: 2 * Math.PI / 3 },
    travel: { theta: -Math.PI / 6, phi: 2 * Math.PI / 3 },
    dogs: { theta: -Math.PI / 4, phi: Math.PI / 3 }, // Map dogs to pets area
    "food hunt": { theta: -Math.PI / 2, phi: Math.PI / 4 }, // Map to food area
    "evening walks": { theta: 0, phi: Math.PI / 4 }, // Map to fitness area
    cooking: { theta: -Math.PI / 2, phi: Math.PI / 4 }, // Map to food area
    movies: { theta: Math.PI, phi: Math.PI / 4 }, // Map to art/entertainment
    "board games": { theta: 3 * Math.PI / 4, phi: Math.PI / 3 } // Map to gaming
  };

  const baseAngle = themeAngles[theme] || { theta: (index / total) * Math.PI * 2, phi: Math.PI / 2 };

  // Communities user is part of or match interests are positioned MUCH closer
  const radius = isUserMember ? 0.8 : matchesUserInterests ? 1.4 : 2.2;

  // Add slight variation to avoid overlap, less variation for user communities
  const variation = isUserMember ? (Math.random() - 0.5) * 0.2 : (Math.random() - 0.5) * 0.4;

  const x = radius * Math.sin(baseAngle.phi) * Math.cos(baseAngle.theta + variation);
  const y = radius * Math.sin(baseAngle.phi) * Math.sin(baseAngle.theta + variation);
  const z = radius * Math.cos(baseAngle.phi);

  return [x, y, z];
};

// Community node component
function CommunityNode({
  clan,
  position,
  isUserMember,
  isRelated,
  size,
  onClick,
  onHover
}: {
  clan: Clan;
  position: [number, number, number];
  isUserMember: boolean;
  isRelated: boolean;
  size: number;
  onClick: () => void;
  onHover: (hovered: boolean) => void;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  useFrame(({ clock }) => {
    if (meshRef.current) {
      const pulse = Math.sin(clock.elapsedTime * 2) * 0.05;
      meshRef.current.scale.setScalar(1 + pulse + (hovered ? 0.3 : 0));

      if (isUserMember) {
        meshRef.current.rotation.y = clock.elapsedTime * 0.5;
      }
    }
  });

  const color = isUserMember ? "#ec4899" : isRelated ? "#8b5cf6" : "#22c55e";

  return (
    <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.5}>
      <group position={position}>
        {/* Glow effect */}
        <mesh>
          <sphereGeometry args={[size * 1.8, 16, 16]} />
          <meshBasicMaterial color={color} transparent opacity={0.08} />
        </mesh>

        {/* Main sphere */}
        <mesh
          ref={meshRef}
          onClick={(e) => { e.stopPropagation(); onClick(); }}
          onPointerOver={(e) => { e.stopPropagation(); setHovered(true); onHover(true); }}
          onPointerOut={(e) => { e.stopPropagation(); setHovered(false); onHover(false); }}
        >
          <sphereGeometry args={[size, 32, 32]} />
          <meshStandardMaterial
            color={color}
            emissive={color}
            emissiveIntensity={hovered ? 1.5 : 0.8}
            roughness={0.3}
            metalness={0.7}
          />
        </mesh>

        {/* Member ring for user communities */}
        {isUserMember && (
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <ringGeometry args={[size * 1.3, size * 1.5, 32]} />
            <meshBasicMaterial color="#ec4899" transparent opacity={0.5} side={THREE.DoubleSide} />
          </mesh>
        )}

        {/* Label */}
        <Text
          position={[0, size + 0.08, 0]}
          fontSize={0.05}
          color="white"
          anchorX="center"
          anchorY="bottom"
          outlineWidth={0.003}
          outlineColor="#000000"
        >
          {clan.name}
        </Text>

        {/* Member count */}
        <Text
          position={[0, -size - 0.06, 0]}
          fontSize={0.035}
          color="#94a3b8"
          anchorX="center"
          anchorY="top"
        >
          {clan.members.length} members
        </Text>
      </group>
    </Float>
  );
}

// User dot component
function UserDot({
  user,
  position,
  isCurrentUser,
  onClick
}: {
  user: User;
  position: [number, number, number];
  isCurrentUser: boolean;
  onClick: () => void;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  useFrame(({ clock }) => {
    if (meshRef.current && isCurrentUser) {
      meshRef.current.rotation.y = clock.elapsedTime;
      const pulse = Math.sin(clock.elapsedTime * 3) * 0.1;
      meshRef.current.scale.setScalar(1 + pulse);
    }
  });

  const size = isCurrentUser ? 0.05 : 0.025;
  const color = isCurrentUser ? "#fbbf24" : "#60a5fa";

  return (
    <mesh
      ref={meshRef}
      position={position}
      onClick={(e) => { e.stopPropagation(); onClick(); }}
      onPointerOver={(e) => { e.stopPropagation(); setHovered(true); }}
      onPointerOut={(e) => { e.stopPropagation(); setHovered(false); }}
    >
      <sphereGeometry args={[size, 16, 16]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={hovered || isCurrentUser ? 2 : 1}
        roughness={0.2}
        metalness={0.8}
      />

      {hovered && (
        <Html distanceFactor={10}>
          <div className="bg-black/80 backdrop-blur-sm px-3 py-2 rounded-lg text-white text-xs whitespace-nowrap pointer-events-none">
            {user.name}
            {isCurrentUser && <span className="ml-2 text-yellow-400">(You)</span>}
          </div>
        </Html>
      )}
    </mesh>
  );
}

// Connection line between user and community
function ConnectionLine({
  start,
  end,
  color = "#8b5cf6"
}: {
  start: [number, number, number];
  end: [number, number, number];
  color?: string;
}) {
  const points = [new THREE.Vector3(...start), new THREE.Vector3(...end)];
  const geometry = new THREE.BufferGeometry().setFromPoints(points);

  return (
    <line geometry={geometry}>
      <lineBasicMaterial color={color} transparent opacity={0.2} linewidth={1} />
    </line>
  );
}

// Central current user node
function CentralUserNode({ user }: { user: User }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const ringsRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = clock.elapsedTime * 0.5;
      const pulse = Math.sin(clock.elapsedTime * 2) * 0.05;
      meshRef.current.scale.setScalar(1 + pulse);
    }
    if (ringsRef.current) {
      ringsRef.current.rotation.z = clock.elapsedTime * 0.3;
    }
  });

  return (
    <group>
      {/* Central sphere */}
      <mesh ref={meshRef}>
        <sphereGeometry args={[0.08, 32, 32]} />
        <meshStandardMaterial
          color="#fbbf24"
          emissive="#fbbf24"
          emissiveIntensity={2}
          roughness={0.2}
          metalness={1}
        />
      </mesh>

      {/* Rings */}
      <group ref={ringsRef}>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.14, 0.006, 16, 100]} />
          <meshBasicMaterial color="#fbbf24" transparent opacity={0.6} />
        </mesh>
        <mesh rotation={[Math.PI / 3, Math.PI / 4, 0]}>
          <torusGeometry args={[0.17, 0.004, 16, 100]} />
          <meshBasicMaterial color="#ec4899" transparent opacity={0.4} />
        </mesh>
      </group>

      {/* Label */}
      <Text
        position={[0, 0.18, 0]}
        fontSize={0.06}
        color="white"
        anchorX="center"
        anchorY="bottom"
        outlineWidth={0.003}
        outlineColor="#000000"
        fontWeight="bold"
      >
        You
      </Text>
    </group>
  );
}

// Main 3D Scene
function CommunityGlobeScene({
  currentUser,
  allUsers,
  clans,
  selectedCommunity,
  onSelectCommunity,
  hoveredCommunity,
  onHoverCommunity
}: {
  currentUser: User | null;
  allUsers: User[];
  clans: Clan[];
  selectedCommunity: string | null;
  onSelectCommunity: (id: string | null) => void;
  hoveredCommunity: string | null;
  onHoverCommunity: (id: string | null) => void;
}) {
  // Calculate community positions
  const communityPositions = useMemo(() => {
    const positions = new Map<string, [number, number, number]>();
    const userInterests = new Set(currentUser?.interests || []);
    const userCommunities = new Set(currentUser?.joined_clans || []);

    clans.forEach((clan, idx) => {
      // Check BOTH directions: user's joined_clans AND if user is in clan.members
      const isUserMember = userCommunities.has(clan.id) ||
        (currentUser && clan.members.includes(currentUser.id));

      const matchesUserInterests = userInterests.has(clan.theme) ||
        currentUser?.interests.some(interest =>
          clan.theme.toLowerCase().includes(interest.toLowerCase()) ||
          interest.toLowerCase().includes(clan.theme.toLowerCase())
        );

      positions.set(
        clan.id,
        calculateCommunityPosition(clan.theme, idx, clans.length, isUserMember, matchesUserInterests || false)
      );
    });
    return positions;
  }, [clans, currentUser]);

  // Calculate user positions (near their communities)
  const userPositions = useMemo(() => {
    const positions = new Map<string, [number, number, number]>();

    allUsers.forEach(user => {
      if (user.id === currentUser?.id) {
        // Current user at center
        positions.set(user.id, [0, 0, 0]);
      } else {
        // Position near their primary community
        const primaryClan = user.joined_clans[0];
        if (primaryClan && communityPositions.has(primaryClan)) {
          const clanPos = communityPositions.get(primaryClan)!;
          // Add offset from clan position
          const angle = Math.random() * Math.PI * 2;
          const distance = 0.2 + Math.random() * 0.15;
          positions.set(user.id, [
            clanPos[0] + Math.cos(angle) * distance,
            clanPos[1] + Math.sin(angle) * distance,
            clanPos[2] + (Math.random() - 0.5) * 0.2
          ]);
        } else {
          // Position randomly if no clan
          const theta = Math.random() * Math.PI * 2;
          const phi = Math.random() * Math.PI;
          const r = 2;
          positions.set(user.id, [
            r * Math.sin(phi) * Math.cos(theta),
            r * Math.sin(phi) * Math.sin(theta),
            r * Math.cos(phi)
          ]);
        }
      }
    });

    return positions;
  }, [allUsers, communityPositions, currentUser]);

  // Find related communities (share members with user's communities)
  const relatedCommunities = useMemo(() => {
    if (!currentUser) return new Set<string>();

    // Get all clans the user is actually in (check both directions)
    const userCommunityIds = new Set([
      ...currentUser.joined_clans,
      ...clans.filter(c => c.members.includes(currentUser.id)).map(c => c.id)
    ]);

    const related = new Set<string>();

    clans.forEach(clan => {
      // Skip if user is already a member
      if (userCommunityIds.has(clan.id)) return;

      // Check if any members are in user's communities OR share interests
      const hasSharedMembers = clan.members.some(memberId => {
        const member = allUsers.find(u => u.id === memberId);
        if (!member) return false;

        // Check if member is in any of user's communities
        const memberCommunities = new Set([
          ...member.joined_clans,
          ...clans.filter(c => c.members.includes(memberId)).map(c => c.id)
        ]);

        return Array.from(userCommunityIds).some(ucId => memberCommunities.has(ucId));
      });

      // Also consider related if theme matches user interests
      const matchesInterests = currentUser.interests.some(interest =>
        clan.theme.toLowerCase().includes(interest.toLowerCase()) ||
        interest.toLowerCase().includes(clan.theme.toLowerCase())
      );

      if (hasSharedMembers || matchesInterests) {
        related.add(clan.id);
      }
    });

    return related;
  }, [currentUser, clans, allUsers]);

  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.4} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color="#8b5cf6" />
      <spotLight position={[0, 10, 0]} angle={0.3} penumbra={1} intensity={0.5} />

      {/* Central user */}
      {currentUser && <CentralUserNode user={currentUser} />}

      {/* Communities */}
      {clans.map(clan => {
        const position = communityPositions.get(clan.id);
        if (!position) return null;

        // Check BOTH directions for membership
        const isUserMember = (currentUser?.joined_clans.includes(clan.id)) ||
          (currentUser && clan.members.includes(currentUser.id)) || false;
        const isRelated = relatedCommunities.has(clan.id);
        const size = 0.06 + (clan.members.length / 20) * 0.03;

        return (
          <CommunityNode
            key={clan.id}
            clan={clan}
            position={position}
            isUserMember={isUserMember}
            isRelated={isRelated}
            size={size}
            onClick={() => onSelectCommunity(selectedCommunity === clan.id ? null : clan.id)}
            onHover={(hovered) => onHoverCommunity(hovered ? clan.id : null)}
          />
        );
      })}

      {/* Users - show all users */}
      {allUsers.map(user => {
        const position = userPositions.get(user.id);
        if (!position || user.id === currentUser?.id) return null;

        return (
          <UserDot
            key={user.id}
            user={user}
            position={position}
            isCurrentUser={false}
            onClick={() => {}}
          />
        );
      })}

      {/* Connections from current user to their communities */}
      {currentUser && clans
        .filter(clan => currentUser.joined_clans.includes(clan.id) || clan.members.includes(currentUser.id))
        .map(clan => {
          const position = communityPositions.get(clan.id);
          if (!position) return null;
          return (
            <ConnectionLine
              key={clan.id}
              start={[0, 0, 0]}
              end={position}
              color="#ec4899"
            />
          );
        })
      }

      {/* Camera controls */}
      <OrbitControls
        enableZoom={true}
        enablePan={true}
        minDistance={2}
        maxDistance={8}
        autoRotate={!selectedCommunity}
        autoRotateSpeed={0.3}
      />
    </>
  );
}

const CommunityGlobe = ({ currentUser, allUsers, clans }: CommunityGlobeProps) => {
  const [selectedCommunity, setSelectedCommunity] = useState<string | null>(null);
  const [hoveredCommunity, setHoveredCommunity] = useState<string | null>(null);
  const navigate = useNavigate();

  const selectedClan = clans.find(c => c.id === selectedCommunity);

  // Count user communities (check both directions) - updates when user joins new communities
  const userCommunities = useMemo(() => {
    if (!currentUser) return 0;
    return new Set([
      ...currentUser.joined_clans,
      ...clans.filter(c => c.members.includes(currentUser.id)).map(c => c.id)
    ]).size;
  }, [currentUser, clans]);

  // Calculate discovery communities - updates based on current user's interests and communities
  const discoveryCommunities = useMemo(() => {
    if (!currentUser) return [];

    const userCommunityIds = new Set([
      ...currentUser.joined_clans,
      ...clans.filter(c => c.members.includes(currentUser.id)).map(c => c.id)
    ]);

    const userInterests = new Set(currentUser.interests);

    return clans.filter(clan => {
      // Skip if user is already a member
      if (userCommunityIds.has(clan.id)) return false;

      // Check if theme matches user interests
      const matchesInterests = userInterests.has(clan.theme) ||
        currentUser.interests.some(interest =>
          clan.theme.toLowerCase().includes(interest.toLowerCase()) ||
          interest.toLowerCase().includes(clan.theme.toLowerCase())
        );

      // Check if members overlap with user's communities
      const hasSharedMembers = clan.members.some(memberId => {
        const member = allUsers.find(u => u.id === memberId);
        if (!member) return false;

        const memberCommunities = new Set([
          ...member.joined_clans,
          ...clans.filter(c => c.members.includes(memberId)).map(c => c.id)
        ]);

        return Array.from(userCommunityIds).some(ucId => memberCommunities.has(ucId));
      });

      return matchesInterests || hasSharedMembers;
    }).slice(0, 6);
  }, [currentUser, clans, allUsers]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="relative"
    >
      {/* Stats */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-pink-500/10 text-pink-500">
            <Heart className="h-4 w-4" />
            <span className="text-sm font-medium">
              {userCommunities} {userCommunities === 1 ? 'community' : 'communities'}
            </span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-500/10 text-purple-500">
            <Sparkles className="h-4 w-4" />
            <span className="text-sm font-medium">{discoveryCommunities.length} to explore</span>
          </div>
        </div>
      </div>

      {/* User interests display */}
      {currentUser && currentUser.interests.length > 0 && (
        <div className="mb-4 p-3 rounded-xl bg-gradient-to-r from-primary/5 to-sakura/5 border border-primary/10">
          <p className="text-xs text-muted-foreground mb-2">Your interests</p>
          <div className="flex flex-wrap gap-1.5">
            {currentUser.interests.map(interest => (
              <span
                key={interest}
                className="px-2 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium"
              >
                {interest}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* 3D Globe */}
      <div
        className="relative rounded-3xl overflow-hidden"
        style={{ height: "28rem", background: "linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #312e81 100%)" }}
      >
        <Suspense fallback={
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="animate-pulse text-white/60 flex flex-col items-center gap-3">
              <Sparkles className="h-8 w-8 animate-spin" />
              <p>Loading your community universe...</p>
            </div>
          </div>
        }>
          <Canvas camera={{ position: [0, 0, 4], fov: 65 }}>
            <CommunityGlobeScene
              currentUser={currentUser}
              allUsers={allUsers}
              clans={clans}
              selectedCommunity={selectedCommunity}
              onSelectCommunity={setSelectedCommunity}
              hoveredCommunity={hoveredCommunity}
              onHoverCommunity={setHoveredCommunity}
            />
          </Canvas>
        </Suspense>

        {/* Interaction hints */}
        <div className="absolute bottom-4 left-4 flex flex-col gap-2 text-white/40 text-xs">
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-yellow-400" />
            <span>You</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-pink-500" />
            <span>Your communities</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-purple-500" />
            <span>Recommended</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-blue-400" />
            <span>Other users</span>
          </div>
        </div>

        {/* Hovered community preview */}
        {hoveredCommunity && !selectedCommunity && (
          <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md rounded-xl p-3 border border-white/10 max-w-xs">
            <p className="text-white text-sm font-medium">
              {clans.find(c => c.id === hoveredCommunity)?.name}
            </p>
            <p className="text-white/60 text-xs mt-1">
              Click to explore this community
            </p>
          </div>
        )}
      </div>

      {/* Selected community panel */}
      <AnimatePresence>
        {selectedCommunity && selectedClan && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="mt-4 bg-white rounded-2xl shadow-elevated overflow-hidden"
          >
            <div className="p-4 bg-gradient-to-r from-primary/10 to-sakura/10 border-b border-border/50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Sparkles className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">{selectedClan.name}</h3>
                    <p className="text-xs text-muted-foreground">
                      {selectedClan.members.length} members · {selectedClan.theme}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedCommunity(null)}
                  className="p-2 rounded-lg hover:bg-muted transition-colors"
                >
                  <X className="h-4 w-4 text-muted-foreground" />
                </button>
              </div>
            </div>

            <div className="p-4">
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm text-muted-foreground">Weekly Goal</p>
                <p className="text-sm font-medium text-foreground">{selectedClan.weekly_goal}</p>
              </div>

              <button
                onClick={() => {
                  setSelectedCommunity(null);
                  navigate(`/explore?tab=groups&q=${encodeURIComponent(selectedClan.name)}`);
                }}
                className="w-full py-2.5 rounded-xl bg-primary text-white text-sm font-medium flex items-center justify-center gap-2 hover:bg-primary/90 transition-colors"
              >
                <Users className="h-4 w-4" />
                Explore Community
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Discovery section */}
      {discoveryCommunities.length > 0 && (
        <div className="mt-6">
          <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-purple-500" />
            Communities you might like
          </h3>
          <div className="grid grid-cols-1 gap-2">
            {discoveryCommunities.map(clan => (
              <button
                key={clan.id}
                onClick={() => setSelectedCommunity(clan.id)}
                className="flex items-center justify-between p-3 rounded-xl bg-muted/50 hover:bg-muted transition-colors text-left"
              >
                <div>
                  <p className="text-sm font-medium text-foreground">{clan.name}</p>
                  <p className="text-xs text-muted-foreground">{clan.members.length} members · {clan.theme}</p>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </button>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default CommunityGlobe;
