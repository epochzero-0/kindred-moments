import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig } from 'remotion';
import { Calendar, Users } from 'lucide-react';
import { Background } from '../Background';

export const EventStats = () => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    const titleOpacity = interpolate(frame, [0, 20], [0, 1]);
    const statsProgress = spring({
        frame: frame - 20,
        fps,
        config: { damping: 200 }
    });

    const eventsCount = Math.floor(interpolate(statsProgress, [0, 1], [0, 42]));

    return (
        <AbsoluteFill className="flex flex-col items-center justify-center p-8 text-stone-900">
            <Background />
            <h2 style={{ opacity: titleOpacity }} className="text-6xl font-black mb-16 text-center z-10 tracking-tighter text-stone-800">
                MOMENTS SHARED
            </h2>

            <div className="grid grid-cols-2 gap-12 w-full max-w-5xl z-10">
                <div
                    style={{ transform: `scale(${statsProgress})` }}
                    className="bg-white/60 backdrop-blur-xl p-12 rounded-[2rem] border border-white/40 flex flex-col items-center shadow-[0_8px_32px_rgba(0,0,0,0.05)]"
                >
                    <Calendar className="w-20 h-20 text-orange-500 mb-6" />
                    <div className="text-9xl font-black mb-2 text-stone-900">{eventsCount}</div>
                    <div className="text-2xl text-stone-500 font-bold tracking-widest uppercase">Events</div>
                </div>

                <div
                    style={{ transform: `scale(${statsProgress})` }}
                    className="bg-white/60 backdrop-blur-xl p-12 rounded-[2rem] border border-white/40 flex flex-col items-center justify-center shadow-[0_8px_32px_rgba(0,0,0,0.05)]"
                >
                    <div className="text-4xl font-bold text-center leading-relaxed text-stone-700">
                        From cozy coffee chats to <span className="text-orange-500">massive festivals</span>.
                    </div>
                </div>
            </div>
        </AbsoluteFill>
    );
};
