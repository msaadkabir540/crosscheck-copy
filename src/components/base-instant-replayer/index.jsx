import { useState, useRef, useEffect, useCallback } from 'react';

import rrwebPlayer from 'rrweb-player';
import axios from 'axios';

import PlayerProgressBar from 'components/player-progress-bar';
import IconButton from 'components/icon-button';
import AnimationComponent from 'components/lottie-animation';

import { formatTime } from 'utils/date-handler';

import gearAnimation from 'assets/animation/gears.json';

import BaseSelect from '../custom-select';
import style from './player.module.scss';

const InstantRePlayer = ({ url, duration, publicMode, isMobileView, recordingTimes }) => {
  const playerRef = useRef(null);
  const rrwebPlayerInstance = useRef(null);
  const progressBarRef = useRef(null);

  const [shouldStart, setShouldStart] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [progressBar, setProgressBar] = useState(0);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);

  const [isEventsFetching, setIsEventFetching] = useState(false);
  const [replayEvents, setInstantReplayEvents] = useState([]);

  const formattedCurrentTime = formatTime(currentTime);
  const formattedDuration = formatTime(duration);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsEventFetching(true);

        const response = await axios.get(url);
        if (response.status === 200) setInstantReplayEvents(response.data);
        setIsEventFetching(false);
      } catch (error) {
        console.error(error);
        setIsEventFetching(false);
      }
    };

    fetchData();
  }, [url]);

  useEffect(() => {
    if (replayEvents.length && playerRef.current && !rrwebPlayerInstance.current) {
      rrwebPlayerInstance.current = new rrwebPlayer({
        target: playerRef.current,
        props: {
          events: replayEvents,
          showController: false,
          mouseTail: false,
          autoPlay: false,
        },
      });

      rrwebPlayerInstance.current.playRange(recordingTimes.start, recordingTimes.end);
      setIsPlaying(true);

      const handleTimeUpdate = (time) => {
        setProgressBar(Math.floor(((time.payload - recordingTimes.start) / (duration * 1000)) * 100));

        setCurrentTime((time.payload - recordingTimes.start) / 1000);

        if (time.payload - recordingTimes.start >= duration * 1000) {
          rrwebPlayerInstance.current.pause();
          setShouldStart(true);
          setIsPlaying(false);
        }
      };

      rrwebPlayerInstance.current.addEventListener('ui-update-current-time', handleTimeUpdate);
    }

    return () => {
      if (rrwebPlayerInstance.current) {
        rrwebPlayerInstance.current.pause();
        rrwebPlayerInstance.current = null;
      }
    };
  }, [duration, replayEvents, recordingTimes]);

  const handlePlayPause = useCallback(() => {
    if (shouldStart) {
      rrwebPlayerInstance.current.goto(recordingTimes.start);
      setShouldStart(false);
    }

    rrwebPlayerInstance.current.toggle();
    setIsPlaying((pre) => !pre);
  }, [recordingTimes.start, shouldStart]);

  useEffect(() => {
    const handleSpaceBar = (event) => {
      if (event.code === 'Space') {
        event.preventDefault();
        handlePlayPause();
      }
    };

    document.addEventListener('keydown', handleSpaceBar);

    return () => {
      document.removeEventListener('keydown', handleSpaceBar);
    };
  }, [handlePlayPause]);

  const speedHandler = useCallback((speed) => {
    rrwebPlayerInstance.current.setSpeed(speed);
    setPlaybackSpeed(speed);
  }, []);

  const handleProgressClick = useCallback(
    (e) => {
      const progressBarRect = progressBarRef.current.getBoundingClientRect();
      let progressPercentage = (e.clientX - progressBarRect.left) / progressBarRect.width;
      progressPercentage = Math.min(Math.max(progressPercentage, 0), 1);
      setShouldStart(false);
      setProgressBar(progressPercentage * 100);
      setCurrentTime(progressPercentage * duration);
      rrwebPlayerInstance.current.goto(progressPercentage * duration * 1000 + recordingTimes.start);
    },
    [duration, recordingTimes.start],
  );

  const handlerToggleFullScreen = useCallback(() => {
    rrwebPlayerInstance.current.toggleFullscreen();
  }, []);

  const handleSeek = useCallback(
    (e) => {
      if (progressBarRef.current) {
        const progressBarRect = progressBarRef.current.getBoundingClientRect();
        const progressPercentage = (e.clientX - progressBarRect.left) / progressBarRect.width;

        setProgressBar(progressPercentage * 100);
        setCurrentTime(progressPercentage * duration);

        if (rrwebPlayerInstance.current) {
          rrwebPlayerInstance.current.goto(progressPercentage * duration * 1000 + recordingTimes.start);
        }
      }
    },
    [duration, recordingTimes.start],
  );

  return isEventsFetching ? (
    <div className={`${style.player_container}  ${style.is_processing_container}`}>
      <div>
        <AnimationComponent height={200} width={200} data={gearAnimation} />
        <div>Getting things ready for you</div>
      </div>
    </div>
  ) : (
    <div className={style.mainWrapper} style={{ paddingBottom: isMobileView ? '0px' : '20px' }}>
      <div
        className={style.player_container}
        onClick={handlePlayPause}
        style={{ height: publicMode ? 'calc(100vh - 225px)' : '' }}
      >
        <div ref={playerRef} className={style.rrwebPlayer} />
      </div>
      <div className={style.player_container_desktop}>
        <PlayerProgressBar
          progress={progressBar}
          handleProgressMouseDown={handleProgressClick}
          progressBarRef={progressBarRef}
          handleSeek={handleSeek}
          type={'player'}
        />
        <div className={style.spaceBetween}>
          <div className={style.flexClass}>
            <IconButton
              height={'24px'}
              width={'24px'}
              onClick={handlePlayPause}
              className={style.generic_icon}
              iconName={isPlaying ? 'pauseIcon' : 'play'}
              tooltip={isPlaying ? 'pause' : 'play'}
              tooltipStyle={{ left: isPlaying ? '90%' : '70%' }}
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
              onSelect={speedHandler}
            />

            <IconButton
              onClick={handlerToggleFullScreen}
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

export default InstantRePlayer;
