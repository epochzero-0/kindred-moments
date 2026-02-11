import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig } from 'remotion';
import { Background } from '../Background';
import { Heart } from 'lucide-react';

export const Outro = ({ name }: { name: string }) => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    const scale = spring({
        frame,
        fps,
        config: { stiffness: 50 }
    });

    return (
        <AbsoluteFill className="flex items-center justify-center text-stone-900">
            <Background />
            <div className="text-center z-10" style={{ transform: `scale(${scale})` }}>
                <div className="mb-8">
                    <Heart className="w-24 h-24 text-pink-500 fill-pink-500 mx-auto animate-pulse" />
                </div>
                <h1 className="text-6xl font-black mb-6 text-stone-900">Thank You.</h1>
                <h2 className="text-3xl font-light text-stone-600">{name}</h2>
                <div className="mt-12 opacity-50 text-sm uppercase tracking-widest text-stone-500">
                    Kindred Moments 2025
                </div>
            </div>
        </AbsoluteFill>
    );
};
