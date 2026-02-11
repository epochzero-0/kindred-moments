import { AbsoluteFill, useCurrentFrame, interpolate, useVideoConfig, spring } from 'remotion';
import { Background } from '../Background';

export const Intro = ({ name }: { name: string }) => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    const scale = spring({
        frame,
        fps,
        config: { stiffness: 100 }
    });

    const opacity = interpolate(frame, [0, 20], [0, 1]);

    return (
        <AbsoluteFill className="flex items-center justify-center text-stone-900">
            <Background />
            <div className="text-center z-10">
                <h1
                    className="text-8xl font-black mb-6 tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-pink-600"
                    style={{ transform: `scale(${scale})`, opacity, color: '#ea580c' }} // Fallback color
                >
                    2025
                </h1>
                <div style={{ opacity: interpolate(frame, [20, 40], [0, 1]) }}>
                    <h2 className="text-5xl font-bold mb-4 text-stone-800">Hello, {name}</h2>
                    <p className="text-2xl text-stone-500 uppercase tracking-widest">Your Year Unwrapped</p>
                </div>
            </div>
        </AbsoluteFill>
    );
};
