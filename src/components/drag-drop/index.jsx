import Button from 'components/button';
import Loader from 'components/loader';

import style from './image-upload.module.scss';
import Icon from '../icon/themed-icon';

const DragDrop = ({ files, className, isLoading, type = 'img', handleSubmit, backImg, backClass }) => {
  return (
    <>
      <div className={`${style.wraper} ${className}`} data-testid={'wraper'}>
        <div className={style.imgSection}>
          {type === 'img' && files?.acceptedFiles?.[0]?.attachment ? (
            <img
              className={`${type === 'img' && files?.acceptedFiles?.[0]?.attachment ? style.profileImg : ''}   `}
              src={`${files?.acceptedFiles?.[0]?.attachment}`}
              alt=""
            />
          ) : (
            <div>{backImg ? <img src={backImg} alt="" /> : <Icon name={'UploadIconThin'} />}</div>
          )}
        </div>

        <div className={backClass}>
          <p className={style.heading}>
            Drop your file here or
            <span className={style.selectFile}> Select a file</span>
          </p>
          {type !== 'img' && files?.acceptedFiles?.length && (
            <div className={style.filesUpdate}>
              <aside>
                <h4>Files</h4>
                <ul>
                  {files?.acceptedFiles?.length > 0 &&
                    files?.acceptedFiles?.map((x) => {
                      return (
                        <>
                          <li>
                            {x.name} - {x.size}MB
                          </li>
                        </>
                      );
                    })}
                </ul>
              </aside>

              {handleSubmit && (
                <Button
                  text={'Submit'}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSubmit(files?.acceptedFiles);
                  }}
                  disabled={isLoading}
                />
              )}
              {isLoading && <Loader tableMode />}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default DragDrop;
