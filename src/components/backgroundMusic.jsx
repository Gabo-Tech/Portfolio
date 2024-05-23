'use client';
import { useEffect, useRef, useState } from 'react';

const BackgroundMusic = () => {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [volume, setVolume] = useState(0.2);

  useEffect(() => {
    const startPlaying = () => {
      if (audioRef.current) {
        audioRef.current.play();
        setIsPlaying(true);
        document.removeEventListener('click', startPlaying);
      }
    };

    if (audioRef.current) {
      audioRef.current.play().catch(() => {
        document.addEventListener('click', startPlaying);
      });
    }

    return () => {
      document.removeEventListener('click', startPlaying);
    };
  }, []);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleVolumeChange = (e) => {
    const newVolume = e.target.value;
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };

  return (
    <div>
      <audio ref={audioRef} loop>
        <source src="/Retolofi Chill Blue Lo-Fi (Sadok8).aac" type="audio/aac" />
        Your browser does not support the audio element.
      </audio>
      <div className="audio-controls">
        <button onClick={togglePlay}>
          {isPlaying ? 'Pause Music' : 'Play Music'}
        </button>
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={volume}
          onChange={handleVolumeChange}
          aria-label="Volume Control"
        />
      </div>
    </div>
  );
};

export default BackgroundMusic;
