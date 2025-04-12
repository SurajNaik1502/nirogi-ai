
import React, { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Music, Play, Pause, Volume2, Youtube } from 'lucide-react';

interface MusicTrack {
  id: string;
  title: string;
  duration: string;
  audioSrc: string;
  youtubeLink?: string;
  gradient: string;
}

const musicTracks: MusicTrack[] = [
  {
    id: 'forest',
    title: 'Calm Forest Sounds',
    duration: '5:32',
    audioSrc: 'https://soundbible.com/mp3/meadow-birds-singing-nature-sounds-7803.mp3',
    youtubeLink: 'https://www.youtube.com/watch?v=xNN7iTA57jM',
    gradient: 'from-health-blue to-health-purple'
  },
  {
    id: 'ocean',
    title: 'Ocean Waves',
    duration: '7:15',
    audioSrc: 'https://soundbible.com/mp3/Ocean_Waves-Mike_Koenig-980635527.mp3',
    youtubeLink: 'https://www.youtube.com/watch?v=WHPEKLQID4U',
    gradient: 'from-health-pink to-health-purple'
  },
  {
    id: 'meditation',
    title: 'Meditation Music',
    duration: '10:05',
    audioSrc: 'https://soundbible.com/mp3/Zen_Temple_Bell-SoundBible.com-331362457.mp3',
    youtubeLink: 'https://www.youtube.com/watch?v=77ZozI0rw7w',
    gradient: 'from-health-orange to-health-pink'
  },
  {
    id: 'rain',
    title: 'Rain Sounds',
    duration: '8:45',
    audioSrc: 'https://soundbible.com/mp3/rain_thunder-Mike_Koenig-458919222.mp3',
    youtubeLink: 'https://www.youtube.com/watch?v=yIQd2Ya0Ziw',
    gradient: 'from-health-blue to-health-orange'
  }
];

const RelaxationMusic = () => {
  const [playingTrackId, setPlayingTrackId] = useState<string | null>(null);
  const audioRefs = useRef<Record<string, HTMLAudioElement | null>>({});

  const togglePlay = (trackId: string) => {
    // Stop currently playing track if there is one
    if (playingTrackId && playingTrackId !== trackId && audioRefs.current[playingTrackId]) {
      audioRefs.current[playingTrackId]?.pause();
    }
    
    // Toggle play/pause
    if (playingTrackId === trackId) {
      // If this track is already playing, pause it
      audioRefs.current[trackId]?.pause();
      setPlayingTrackId(null);
    } else {
      // Play the new track
      if (audioRefs.current[trackId]) {
        audioRefs.current[trackId]?.play().catch(e => console.error("Error playing audio:", e));
        setPlayingTrackId(trackId);
      }
    }
  };

  const openYoutubeLink = (link?: string) => {
    if (link) {
      window.open(link, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <Card className="glass-morphism">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Music className="h-5 w-5 text-health-orange" />
          Relaxation Music
        </CardTitle>
        <CardDescription>Listen to calming sounds to reduce stress</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {musicTracks.map(track => (
            <Card key={track.id} className="neo-blur overflow-hidden">
              <CardContent className="p-0">
                {/* Hidden audio element */}
                <audio
                  ref={el => audioRefs.current[track.id] = el}
                  src={track.audioSrc}
                  loop
                />
                
                <div className="flex items-center gap-4 p-4">
                  <div 
                    className={`bg-gradient-to-r ${track.gradient} h-16 w-16 rounded-md flex items-center justify-center cursor-pointer`}
                    onClick={() => togglePlay(track.id)}
                  >
                    {playingTrackId === track.id ? (
                      <Pause className="h-8 w-8 text-white" />
                    ) : (
                      <Play className="h-8 w-8 text-white" />
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium">{track.title}</h3>
                    <p className="text-sm text-muted-foreground">{track.duration}</p>
                  </div>
                  {track.youtubeLink && (
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => openYoutubeLink(track.youtubeLink)}
                      className="text-red-500 hover:text-red-600"
                    >
                      <Youtube className="h-5 w-5" />
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="mt-6 text-center">
          <Button 
            variant="outline" 
            onClick={() => openYoutubeLink('https://www.youtube.com/results?search_query=relaxation+music+meditation')}
          >
            <Youtube className="mr-2 h-4 w-4 text-red-500" />
            More Relaxation Videos on YouTube
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default RelaxationMusic;
