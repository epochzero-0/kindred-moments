import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig } from 'remotion';
import { Heart, Hand } from 'lucide-react';
import { Background } from '../Background';

export const VolunteerStats = () => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    const hours = Math.floor(interpolate(frame, [10, 60], [0, 150], { extrapolateRight: "clamp" }));
    const lives = Math.floor(interpolate(frame, [40, 90], [0, 500], { extrapolateRight: "clamp" }));

    return (
        <AbsoluteFill className="flex flex-col items-center justify-center text-stone-900">
            <Background />
            <div className="z-10 mb-16 text-center">
                <h2 className="text-4xl font-light mb-2 tracking-widest uppercase opacity-60 text-stone-600">Community Impact</h2>
                <h1 className="text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-orange-500">GIVING BACK</h1>
            </div>

            <div className="flex flex-row gap-16 z-10 w-full max-w-6xl px-8">
                <div className="flex-1 bg-white/50 backdrop-blur-lg border border-white/60 rounded-3xl p-10 flex flex-col items-center transform transition-transform shadow-sm">
                    <Hand className="w-24 h-24 text-rose-500 mb-6" />
                    <div className="text-8xl font-black mb-2 text-stone-800">{hours}</div>
                    <div className="text-2xl text-stone-500 uppercase tracking-widest font-bold">Hours Volunteered</div>
                </div>

                <div className="flex-1 bg-white/50 backdrop-blur-lg border border-white/60 rounded-3xl p-10 flex flex-col items-center transform transition-transform shadow-sm">
                    <Heart className="w-24 h-24 text-rose-500 fill-rose-500 mb-6 animate-pulse" />
                    <div className="text-8xl font-black mb-2 text-stone-800">{lives}</div>
                    <div className="text-2xl text-stone-500 uppercase tracking-widest font-bold">Lives Touched</div>
                </div>
            </div>
        </AbsoluteFill>
    );
};
