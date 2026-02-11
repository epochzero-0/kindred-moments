import { Player } from '@remotion/player';
import { MainComposition } from '../components/rewind/Composition';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const RewindPage = () => {
    const navigate = useNavigate();

    return (
        <div className="fixed inset-0 bg-[#faf9f6]/95 z-50">
            {/* Player Container */}
            <div className="absolute inset-0 flex items-center justify-center">
                <Player
                    component={MainComposition}
                    durationInFrames={900}
                    compositionWidth={1920}
                    compositionHeight={1080}
                    fps={30}
                    style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'contain',
                    }}
                    controls={false} // Hide default controls for immersive feel
                    autoPlay
                    loop
                    inputProps={{ name: "Sarah Tan" }}
                />
            </div>

            {/* Overlay UI */}
            <div className="absolute top-0 left-0 right-0 p-6 flex justify-between items-start z-10 bg-gradient-to-b from-white/80 to-transparent">
                <Button
                    variant="ghost"
                    onClick={() => navigate(-1)}
                    className="text-stone-800 hover:bg-black/5 rounded-full p-2 h-auto"
                >
                    <ArrowLeft className="w-6 h-6" />
                    <span className="ml-2 sr-only">Back</span>
                </Button>
                <div className="text-right">
                    <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-orange-500 to-pink-600">
                        2025 Rewind
                    </h1>
                    <p className="text-xs text-stone-500">Sarah Tan</p>
                </div>
            </div>

            {/* Tap to pause/play overlay (mock interaction) */}
            <div className="absolute inset-0 z-0" onClick={(e) => {
                // Future: Toggle play/pause
                // For now just allow clicking through? 
                // Remotion Player handles its own clicks mostly.
            }} />
        </div>
    );
};

export default RewindPage;
