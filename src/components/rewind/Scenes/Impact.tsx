import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig } from 'remotion';
import { Award, Star, Zap } from 'lucide-react';
import { Background } from '../Background';

export const Impact = () => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    return (
        <AbsoluteFill className="flex flex-col items-center justify-center text-stone-900">
            <Background />
            <h2 className="text-6xl font-black italic mb-16 text-yellow-500 z-10 drop-shadow-md">
                LEGENDARY STATUS
            </h2>

            <div className="grid grid-cols-3 gap-16 z-10">
                {[Award, Star, Zap].map((Icon, index) => (
                    <div
                        key={index}
                        style={{
                            transform: `scale(${spring({ frame: frame - (30 + index * 10), fps })}`,
                            opacity: interpolate(frame, [30 + index * 10, 40 + index * 10], [0, 1])
                        }}
                        className="flex flex-col items-center group"
                    >
                        <div className="bg-gradient-to-br from-yellow-400 to-orange-500 p-10 rounded-full shadow-lg mb-6 transform transition-transform group-hover:scale-110">
                            <Icon className="w-24 h-24 text-white" />
                        </div>
                        <div className="text-2xl font-bold uppercase tracking-widest text-stone-700 bg-white/60 px-4 py-2 rounded-lg backdrop-blur-sm border border-white/50">
                            Badge Earned
                        </div>
                    </div>
                ))}
            </div>

            <div
                className="mt-24 bg-gradient-to-r from-yellow-100/80 to-orange-100/80 px-16 py-8 rounded-3xl border border-yellow-200 backdrop-blur-xl z-10 shadow-lg"
                style={{
                    opacity: interpolate(frame, [80, 100], [0, 1]),
                    transform: `translateY(${interpolate(frame, [80, 100], [50, 0])}px)`
                }}
            >
                <span className="text-6xl font-black text-yellow-600 mr-6">TOP 1%</span>
                <span className="text-4xl font-light tracking-wide text-stone-800">CONTRIBUTOR</span>
            </div>
        </AbsoluteFill>
    );
};
