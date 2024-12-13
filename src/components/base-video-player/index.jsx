import { useState, useRef, useEffect, useCallback } from 'react';

import ReactPlayer from 'react-player';

import { useCaptureContext } from 'context/capture-context';

import PlayerProgressBar from 'components/player-progress-bar';
import IconButton from 'components/icon-button';

import { formatTime } from 'utils/date-handler';

import style from './player.module.scss';
import BaseSelect from '../custom-select';

const VideoPlayer = ({ url, publicMode, duration, isMobileView }) => {
  const { setPlayedSecond, clickedPlayedSecond, setClickedPlayedSecond } = useCaptureContext();

  const playerRef = useRef(null);
  const progressBarRef = useRef(null);
  const volumeBarRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(0.5);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [isDraggingProgress, setIsDraggingProgress] = useState(false);
  const [isDraggingVolume, setIsDraggingVolume] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1.0);

  const handleProgressMouseDown = useCallback(() => {
    setIsDraggingProgress(true);
  }, []);

  const handleVolumeMouseDown = useCallback(() => {
    setIsDraggingVolume(true);
  }, []);

  const toggleMute = useCallback(() => {
    setIsMuted((prevMuted) => !prevMuted);
  }, []);

  const handleSpaceBar = useCallback((event) => {
    if (event.code === 'Space') {
      event.preventDefault();
      setIsPlaying((prevState) => !prevState);
    }
  }, []);

  useEffect(() => {
    document.addEventListener('keydown', handleSpaceBar);

    return () => {
      document.removeEventListener('keydown', handleSpaceBar);
    };
  }, [handleSpaceBar]);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (isDraggingProgress) {
        const progressBarRect = progressBarRef.current.getBoundingClientRect();
        let progressPercentage = (e.clientX - progressBarRect.left) / progressBarRect.width;
        progressPercentage = Math.min(Math.max(progressPercentage, 0), 1);
        setProgress(progressPercentage * 100);
        setCurrentTime(progressPercentage * duration);
      }

      if (isDraggingVolume) {
        const volumeBarRect = volumeBarRef.current.getBoundingClientRect();
        let volumePercentage = (e.clientX - volumeBarRect.left) / volumeBarRect.width;
        volumePercentage = Math.min(Math.max(volumePercentage, 0), 1);
        setVolume(volumePercentage);
      }
    };

    const handleMouseUp = () => {
      setIsDraggingProgress(false);
      setIsDraggingVolume(false);

      if (isDraggingProgress && playerRef.current) {
        playerRef.current.seekTo(currentTime / duration, 'fraction');
      }
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDraggingProgress, isDraggingVolume, currentTime, duration]);

  const handleProgress = useCallback(
    (state) => {
      if (!isDraggingProgress && state.playedSeconds !== null && !isNaN(state.playedSeconds)) {
        setPlayedSecond(Math.round(state.playedSeconds));
        setProgress((state.playedSeconds / duration) * 100);
        setCurrentTime(state.playedSeconds);
      }
    },

    [duration, isDraggingProgress],
  );

  const handleSeek = useCallback(
    (e) => {
      if (progressBarRef.current) {
        const progressBarRect = progressBarRef.current.getBoundingClientRect();
        const clickPosition = (e.clientX - progressBarRect.left) / progressBarRect.width;

        const seekTimeSeconds = Math.round(clickPosition * duration);

        setProgress(clickPosition * 100);
        setCurrentTime(seekTimeSeconds);

        setIsPlaying(false);

        if (playerRef.current) {
          playerRef.current.seekTo(seekTimeSeconds, 'seconds');
        }
      }
    },
    [duration],
  );

  const toggleFullScreen = useCallback(() => {
    const player = playerRef.current.getInternalPlayer();

    if (!document.fullscreenElement) {
      player.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  }, [playerRef]);

  const formattedCurrentTime = formatTime(currentTime);
  const formattedDuration = formatTime(duration);

  useEffect(() => {
    if (clickedPlayedSecond) {
      setIsPlaying(false);
      playerRef.current.seekTo(clickedPlayedSecond, 'seconds');
      setClickedPlayedSecond(null);
    }
  }, [clickedPlayedSecond]);

  const handleTogglePlaying = useCallback(() => {
    setIsPlaying(!isPlaying);
  }, [isPlaying]);

  const handleStopPlaying = useCallback(() => {
    setIsPlaying(false);
  }, []);

  const handleSelect = useCallback((val) => {
    setPlaybackSpeed(val);
  }, []);

  return (
    <div className={style.padding_twenty} style={{ paddingBottom: isMobileView ? '0px' : '20px' }}>
      <div
        className={style.player_container}
        onClick={handleTogglePlaying}
        style={{ height: publicMode ? 'calc(100vh - 225px)' : '' }}
      >
        <ReactPlayer
          ref={playerRef}
          url={url}
          width="100%"
          height={'100%'}
          playing={isPlaying}
          volume={isMuted ? 0 : volume}
          muted={isMuted}
          onProgress={handleProgress}
          playbackRate={playbackSpeed}
          onEnded={handleStopPlaying}
          played={clickedPlayedSecond ? [clickedPlayedSecond / duration, 1] : null}
        />
      </div>
      <div className={style.player_container_desktop}>
        <PlayerProgressBar
          progress={progress}
          handleProgressMouseDown={handleProgressMouseDown}
          progressBarRef={progressBarRef}
          handleSeek={handleSeek}
          type={'player'}
        />
        <div className={style.spaceBetween}>
          <div className={style.flexClass}>
            <IconButton
              height={'24px'}
              width={'24px'}
              onClick={handleTogglePlaying}
              className={style.generic_icon}
              iconName={isPlaying ? 'pauseIcon' : 'play'}
              tooltip={isPlaying ? 'pause' : 'play'}
              tooltipStyle={{ left: isPlaying ? '90%' : '70%' }}
            />
            <IconButton
              height={'24px'}
              width={'24px'}
              onClick={toggleMute}
              className={style.generic_icon}
              iconName={isMuted ? 'muteIcon' : 'unmuteIcon'}
              tooltip={isMuted ? 'unmute' : 'mute'}
            />
            <PlayerProgressBar
              progressBarRef={volumeBarRef}
              handleProgressMouseDown={handleVolumeMouseDown}
              progress={volume}
            />
            <p className={style.time}>
              {formattedCurrentTime} / {formattedDuration}
            </p>
          </div>
          <div className={style.rightDiv}>
            <BaseSelect
              options={[
                { label: '0.5x', value: 0.5 },
                { label: '1.0x', value: 1.0 },
                { label: '1.5x', value: 1.5 },
                { label: '2.0x', value: 2.0 },
              ]}
              label={`${playbackSpeed}x`}
              selectedValue={playbackSpeed}
              onSelect={handleSelect}
            />
            <div></div>
            <IconButton
              onClick={toggleFullScreen}
              className={style.generic_icon}
              iconName={'zoomIcon'}
              tooltip={'zoom'}
              tooltipStyle={{ left: '0%' }}
              height={'24px'}
              width={'24px'}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;
