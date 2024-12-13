import { useMemo, useState, useEffect, useCallback } from 'react';

import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { saveAs } from 'file-saver';

import { useAppContext } from 'context/app-context';

import MainWrapper from 'components/layout/main-wrapper';
import BaseVideoPlayer from 'components/base-video-player';
import InstantRePlayer from 'components/base-instant-replayer';
import RequestAccessCard from 'components/capture-components/request-access-screen';
import Loader from 'components/loader';
import CaptureNavbarOption from 'components/capture-navbar-options';
import Icon from 'components/icon/themed-icon';
import AnimationComponent from 'components/lottie-animation';
import DevtoolAndGeneralInfoComponent from 'components/view-capture-child';

import { useToaster } from 'hooks/use-toaster';

import { useGetCaptureById } from 'api/v1/captures/capture';
import { useGrantCheckAccess, useRejectAccess } from 'api/v1/captures/share-with';

import { formattedDate } from 'utils/date-handler';

import gearAnimation from 'assets/animation/gears.json';

import style from './single-capture.module.scss';

const CaptureSingle = () => {
  const { mutateAsync: _grantAccessToUser } = useGrantCheckAccess();
  const { mutateAsync: _rejectAccessToUser } = useRejectAccess();

  const location = useLocation();
  const navigate = useNavigate();
  const [isRequestGranted, setIsRequestGranted] = useState(true);
  const [isMobileView, setIsMobileView] = useState(window.innerWidth <= 768);
  const { userDetails } = useAppContext();
  const { id } = useParams();
  const { toastError } = useToaster();

  const onSuccess = () => {
    setIsRequestGranted(true);
  };

  const onError = (error) => {
    toastError(error);
    if (error.status === 401) setIsRequestGranted(false);
  };

  useEffect(() => {
    const grantAccess = async (email) => {
      const body = { email: email };

      try {
        await _grantAccessToUser({ checkId: id, body });
      } catch (error) {
        console.log(error);
      }
    };

    const rejectAccess = async (email) => {
      const body = { email: email };

      try {
        await _rejectAccessToUser({ checkId: id, body });
      } catch (error) {
        console.log(error);
      }
    };

    const searchParams = new URLSearchParams(location.search);
    const email = searchParams.get('email');
    const access = searchParams.get('access');

    if (access === 'granted') {
      grantAccess(email);
    } else if (access === 'denied') {
      rejectAccess(email);
    } else {
      return;
    }
  }, [_grantAccessToUser, _rejectAccessToUser, id, location]);

  const { data: _checkData, isLoading, refetch } = useGetCaptureById({ id, onSuccess, onError });

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

  const handleDownload = useCallback(
    (url) => {
      fetch(_checkData?.source)
        .then((response) => response.blob())
        .then((blob) => {
          const parts = url.split('/');
          const filename = parts[parts?.length - 1];
          saveAs(blob, filename);
        })
        .catch((error) => {
          console.error('Error downloading the image:', error);
        });
    },
    [_checkData?.source],
  );

  const handleNavigateToCaptures = useCallback(() => {
    navigate('/captures');
  }, [navigate]);

  return (
    <MainWrapper
      disabled={isMobileView}
      title={isMobileView ? '' : 'Checks'}
      date={formattedDate(new Date(), 'EEEE, d MMMM yyyy')}
    >
      {isLoading ? (
        <Loader />
      ) : (
        <>
          {_checkData && isRequestGranted && (
            <div className={style.mainDiv}>
              <div className={style.captureNav}>
                <div className={style.captureNav_LeftChild} onClick={handleNavigateToCaptures}>
                  <div>
                    <Icon width={24} height={24} name={'BackIcon'} />
                  </div>
                  <h6>Back</h6>
                </div>
                <CaptureNavbarOption
                  check={_checkData}
                  privatMode={isPrivateMode}
                  isMobileView={isMobileView}
                  refetch={refetch}
                />
              </div>
              <div className={`${style.mainWrapper} ${isMobileView && style.mainWrapperMobile}`}>
                <GroupedPanels isDisabled={isMobileView}>
                  <div className={`${style.leftDiv} ${isMobileView && style.leftDivMobile}`}>
                    {!isMobileView && (
                      <div className={style.download_icon_container} onClick={handleDownload}>
                        <Icon height={24} width={24} name={'checkDownloadIcon'} />
                      </div>
                    )}
                    {_checkData?.isProcessing ? (
                      <div className={style.is_processing_container}>
                        <div>
                          <AnimationComponent height={200} width={200} data={gearAnimation} />
                          <div>Getting things ready for you</div>
                        </div>
                      </div>
                    ) : (
                      <div>
                        {_checkData?.type === 'fullPageScreenshot' ||
                        _checkData?.type === 'visibleScreenshot' ||
                        _checkData?.type === 'selectedAreaScreenshot' ? (
                          <div className={`${isMobileView ? style.image_container_mobile : style.image_container}`}>
                            <img src={_checkData?.source} alt="media" />
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
                            publicMode={false}
                            duration={_checkData?.duration}
                          />
                        )}
                      </div>
                    )}
                  </div>
                  <div className={`${style.rightDiv} ${style.rightDivMobile}`}>
                    <DevtoolAndGeneralInfoComponent isMobileView={isMobileView} check={_checkData} />
                  </div>
                </GroupedPanels>
              </div>
            </div>
          )}

          {!_checkData && !isRequestGranted && (
            <div className={style.request_main_container}>
              <RequestAccessCard />
            </div>
          )}
        </>
      )}
    </MainWrapper>
  );
};

export default CaptureSingle;

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
