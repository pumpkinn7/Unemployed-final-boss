import { useEffect, useState } from 'react';

const useAudio = (url: string) => {
  const [audio] = useState(new Audio(url));
  const [playing, setPlaying] = useState(false);

  const toggle = () => setPlaying(!playing);

  useEffect(() => {
    playing ? audio.play().catch(e => console.log('Audio play failed:', e)) : audio.pause();
    
    return () => {
      audio.pause();
    };
  }, [playing, audio]);

  useEffect(() => {
    audio.addEventListener('ended', () => setPlaying(false));
    return () => {
      audio.removeEventListener('ended', () => setPlaying(false));
    };
  }, [audio]);

  return [playing, toggle] as const;
};

export default useAudio;
