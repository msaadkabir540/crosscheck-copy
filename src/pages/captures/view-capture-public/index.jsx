import { useCallback, useEffect, useMemo, useState } from 'react';

import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import { useNavigate, useParams } from 'react-router-dom';
import { saveAs } from 'file-saver';

import { useAppContext } from 'context/app-context';

import Loader from 'components/loader';
import BaseVideoPlayer from 'components/base-video-player';
import Icon from 'components/icon/themed-icon';
import AnimationComponent from 'components/lottie-animation';
import InstantRePlayer from 'components/base-instant-replayer';
import MainWrapper from 'components/layout/main-wrapper';
import DevtoolAndGeneralInfoComponent from 'components/view-capture-child';
import CaptureNavbarOption from 'components/capture-navbar-options';

import { useToaster } from 'hooks/use-toaster';

import { usePublicCaptureById } from 'api/v1/captures/capture';

import { formattedDate } from 'utils/date-handler';

import Avatar from 'assets/avatar.svg';
import gearAnimation from 'assets/animation/gears.json';

import style from './single-capture.module.scss';

const CaptureSinglePublic = () => {
  const { id } = useParams();

  const navigate = useNavigate();

  const [isRequestGranted, setIsRequestGranted] = useState(true);
  const { userDetails } = useAppContext();
  const { toastError } = useToaster();
  const [isMobileView, setIsMobileView] = useState(window.innerWidth <= 768);

  const onSuccess = () => {
    setIsRequestGranted(true);
  };

  const onError = (error) => {
    toastError(error);

    if (error.status === 401) setIsRequestGranted(false);
  };

  const { data: _checkData, isLoading, isFetching, refetch } = usePublicCaptureById({ id, onSuccess, onError });

  const isPrivateMode = useMemo(() => {
    return !!userDetails?.id;
  }, [userDetails]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth <= 768);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const handleDownload = useCallback(() => {
    fetch(_checkData?.source)
      .then((response) => response.blob())
      .then((blob) => {
        const parts = _checkData?.source.split('/');
        const filename = parts[parts?.length - 1];
        saveAs(blob, filename);
      })
      .catch((error) => {
        console.error('Error downloading the image:', error);
      });
  }, [_checkData?.source]);

  const redirectToFacebook = useCallback(() => {
    window.location.href = 'https://www.crosscheck.cloud/';
  }, []);

  const navigateToCapture = useCallback(() => {
    navigate('/captures');
  }, [navigate]);

  return (
    <MainWrapper title={''} date={formattedDate(new Date(), 'EEEE, d MMMM yyyy')}>
      {isLoading || isFetching ? (
        <Loader />
      ) : (
        <>
          {_checkData && isRequestGranted && (
            <div className={style.mainDiv}>
              <div className={style.captureNav}>
                {isPrivateMode ? (
                  <>
                    <div className={style.captureNav_LeftChild}>
                      <div className={style.appLogo} onClick={redirectToFacebook}>
                        <Icon name={'AppLogo'} />
                      </div>
                    </div>
                    <div className={style.userInfo_container} onClick={navigateToCapture}>
                      {userDetails?.profilePicture ? (
                        <img
                          src={userDetails?.profilePicture ? userDetails?.profilePicture : Avatar}
                          alt="profile-user"
                          className={style.logo2}
                        />
                      ) : (
                        <div className={style.alternative_name}>
                          {userDetails.name
                            ?.split(' ')
                            ?.slice(0, 2)
                            ?.map((word) => word[0]?.toUpperCase())
                            ?.join('')}
                        </div>
                      )}
                    </div>
                  </>
                ) : (
                  <>
                    <div className={style.captureNav_LeftChild}>
                      <div className={style.appLogo} onClick={redirectToFacebook}>
                        <Icon name={'AppLogo'} />
                      </div>
                    </div>
                    <CaptureNavbarOption
                      check={_checkData}
                      privatMode={isPrivateMode}
                      isMobileView={isMobileView}
                      refetch={refetch}
                    />
                  </>
                )}
              </div>

              <div className={`${style.mainWrapper} ${isMobileView && style.mainWrapperMobile}`}>
                <GroupedPanels isDisabled={isMobileView}>
                  <div className={`${style.leftDiv} ${isMobileView && style.leftDivMobile}`}>
                    {_checkData?.isProcessing ? (
                      <div className={style.is_processing_container}>
                        <div>
                          <AnimationComponent height={200} width={200} data={gearAnimation} />
                          <div>Getting things ready for you</div>
                        </div>
                      </div>
                    ) : (
                      <div style={{ position: !isMobileView && 'relative' }}>
                        {!isMobileView && (
                          <div
                            style={{ zIndex: !isMobileView && '99999' }}
                            className={style.download_icon_container}
                            onClick={handleDownload}
                          >
                            <Icon height={24} width={24} name={'checkDownloadIcon'} />
                          </div>
                        )}
                        {_checkData?.type === 'fullPageScreenshot' ||
                        _checkData?.type === 'visibleScreenshot' ||
                        _checkData?.type === 'selectedAreaScreenshot' ? (
                          <div className={style.image_container}>
                            <img
                              src={_checkData?.source}
                              alt="media"
                              className={isMobileView ? style.imageMobile : style.image}
                            />
                          </div>
                        ) : _checkData?.type === 'instantReplay' ? (
                          <InstantRePlayer
                            url={_checkData?.source}
                            publicMode={false}
                            isMobileView={isMobileView}
                            duration={_checkData?.duration}
                            recordingTimes={{
                              start: Math.round(_checkData?.recStartTime * 1000),
                              end: Math.round(_checkData?.recEndTime * 1000),
                            }}
                          />
                        ) : (
                          <BaseVideoPlayer
                            url={_checkData?.source}
                            publicMode={true}
                            duration={_checkData?.duration}
                            isMobileView={isMobileView}
                          />
                        )}
                      </div>
                    )}
                  </div>
                  <div className={`${style.rightDiv} ${isMobileView && style.rightDivMobile}`}>
                    <DevtoolAndGeneralInfoComponent isMobileView={isMobileView} check={_checkData} />
                  </div>
                </GroupedPanels>
              </div>
            </div>
          )}
        </>
      )}
    </MainWrapper>
  );
};

export default CaptureSinglePublic;

const GroupedPanels = ({ isDisabled, children }) => {
  return isDisabled ? (
    children
  ) : (
    <PanelGroup direction="horizontal" id="horizontal-group" style={{ gap: !isDisabled && '10px' }}>
      <Panel id="left-panel" defaultSize={70}>
        {children[0]}
      </Panel>
      <PanelResizeHandle disabled={isDisabled} id="horizontal-resize-handle" className={style.centerBorder} />
      <Panel id="right-panel" minSize={30} maxSize={70}>
        {children[1]}
      </Panel>
    </PanelGroup>
  );
};
