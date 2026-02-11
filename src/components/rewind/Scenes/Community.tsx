import { AbsoluteFill, useCurrentFrame, interpolate, useVideoConfig } from 'remotion';
import { User } from 'lucide-react';
import { Background } from '../Background';

export const Community = () => {
    const frame = useCurrentFrame();
    const { width, height } = useVideoConfig();

    return (
        <AbsoluteFill className="text-stone-900 overflow-hidden">
            <Background />
            <div className="absolute inset-0 flex items-center justify-center z-20 flex-col">
                <h2
                    className="text-7xl font-black mb-6 text-center leading-tight text-stone-800"
                    style={{ opacity: interpolate(frame, [0, 20], [0, 1]), transform: `translateY(${interpolate(frame, [0, 20], [20, 0])}px)` }}
                >
                    YOU WEREN'T <br /><span className="text-indigo-600">ALONE</span>
                </h2>
                <div
                    className="bg-white/80 backdrop-blur-md px-8 py-4 rounded-full border border-indigo-100 shadow-md"
                    style={{ opacity: interpolate(frame, [30, 50], [0, 1]) }}
                >
                    <h3 className="text-3xl font-bold text-indigo-900">
                        85 Kindred Spirits Found
                    </h3>
                </div>
            </div>

            {/* Background moving avatars */}
            {Array.from({ length: 40 }).map((_, i) => {
                const x = (i * 1234) % width;
                const y = (i * 5678) % height;
                const delay = i * 2;

                const moveX = interpolate(frame, [0, 150], [0, (i % 2 === 0 ? 100 : -100)]);
                const moveY = interpolate(frame, [0, 150], [0, (i % 3 === 0 ? 100 : -100)]);
                const scale = interpolate(frame, [delay, delay + 20], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

                return (
                    <div
                        key={i}
                        className="absolute bg-white/60 rounded-full p-3 border border-white/40 backdrop-blur-sm z-10 shadow-sm"
                        style={{
                            left: x,
                            top: y,
                            transform: `translate(${moveX}px, ${moveY}px) scale(${scale})`,
                        }}
                    >
                        <User className="w-6 h-6 text-indigo-500" />
                    </div>
                );
            })}
        </AbsoluteFill>
    );
};
