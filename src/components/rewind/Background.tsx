import { AbsoluteFill, useCurrentFrame, interpolate } from 'remotion';

export const Background = () => {
    const frame = useCurrentFrame();

    // Subtle rotating gradient background - Light Theme
    const rotate = interpolate(frame, [0, 900], [0, 360]);

    return (
        <AbsoluteFill style={{ backgroundColor: '#faf9f6' }} className="overflow-hidden">
            <div
                className="absolute inset-[-50%]"
                style={{
                    transform: `rotate(${rotate}deg)`,
                    opacity: 0.4,
                    background: 'linear-gradient(to bottom right, #ffedd5, #fce7f3, #e0e7ff)', // Orange-50 to Pink-50 to Indigo-50
                }}
            />
            {/* Grid overlay - Darker grid for light bg */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.03)_1px,transparent_1px)] bg-[size:50px_50px]" />

            {/* Vignette - Light to slightly darker edges */}
            <div className="absolute inset-0 bg-radial-gradient from-transparent to-stone-200/50 opacity-100" />
        </AbsoluteFill>
    );
};
