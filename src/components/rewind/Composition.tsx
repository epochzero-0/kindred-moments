import { Series } from 'remotion';
import { Intro } from './Scenes/Intro';
import { EventStats } from './Scenes/EventStats';
import { VolunteerStats } from './Scenes/VolunteerStats';
import { Community } from './Scenes/Community';
import { Impact } from './Scenes/Impact';
import { Outro } from './Scenes/Outro';
import '../../index.css';

export const MainComposition = ({ name }: { name: string }) => {
    return (
        <Series>
            <Series.Sequence durationInFrames={90}>
                <Intro name={name} />
            </Series.Sequence>

            <Series.Sequence durationInFrames={150}>
                <EventStats />
            </Series.Sequence>

            <Series.Sequence durationInFrames={180}>
                <VolunteerStats />
            </Series.Sequence>

            <Series.Sequence durationInFrames={150}>
                <Community />
            </Series.Sequence>

            <Series.Sequence durationInFrames={150}>
                <Impact />
            </Series.Sequence>

            <Series.Sequence durationInFrames={180}>
                <Outro name={name} />
            </Series.Sequence>
        </Series>
    );
};
