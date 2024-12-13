import { useEffect } from 'react';

import style from '../base-video-player/player.module.scss';

const PlayerProgressBar = ({ progress, handleProgressMouseDown, progressBarRef, handleSeek, type }) => {
  useEffect(() => {
    const handleTouchMove = (e) => {
      if (handleProgressMouseDown) {
        const touch = e.touches[0];

        const event = {
          clientX: touch.clientX,
        };
        handleSeek(event);
      }
    };

    const handleTouchEnd = () => {
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };

    const handleTouchStart = () => {
      handleProgressMouseDown();
      document.addEventListener('touchmove', handleTouchMove);
      document.addEventListener('touchend', handleTouchEnd);
    };

    const progressBarElement = progressBarRef.current;
    progressBarElement.addEventListener('touchstart', handleTouchStart);

    return () => {
      progressBarElement.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [handleProgressMouseDown, handleSeek, progressBarRef]);

  return (
    <>
      {type === 'player' ? (
        <div
          className={style.progressBar}
          ref={progressBarRef}
          onMouseDown={handleProgressMouseDown}
          onClick={handleSeek}
        >
          <div className={style.progress} style={{ width: `${progress}%` }}></div>
          <div className={style.playhead} style={{ left: `${progress}%` }}></div>
        </div>
      ) : (
        <div className={style.volumeBar} ref={progressBarRef} onMouseDown={handleProgressMouseDown}>
          <div className={style.volume} style={{ width: `${progress * 100}%` }}></div>
          <div className={style.volumeHead} style={{ left: `${progress * 100}%` }}></div>
        </div>
      )}
    </>
  );
};

export default PlayerProgressBar;
