import { useCallback } from 'react';

import { toast } from 'react-toastify';

import style from './use-toaster.module.scss';

export const toastNotification = ({ title, body, icon, onClick, options = {} }) => {
  return toast.info(
    <div onClick={onClick} className={style.toastClass}>
      <div className={style.iconClass}>
        {icon && <img src={icon} alt="notification-icon" className={style.img}></img>}
        <div className={style.innerDiv}>
          <p className={style.titleClass}>{title}</p>
          <p className={style.bodyClass}> {body}</p>
        </div>
      </div>
    </div>,
    options,
  );
};

export function useToaster() {
  const toastError = useCallback((error = {}, setError = () => {}, options = {}) => {
    if (error.validations) {
      Object.keys(error.validations).forEach((fieldName) => {
        setError(fieldName, {
          type: 'server',
          message: error.validations[fieldName],
        });
      });
    }

    return toast.error(`${error?.msg}`, {
      ...options,
    });
  }, []);

  const toastSuccess = useCallback((message = '', options = {}) => {
    return toast.success(message, {
      ...options,
    });
  }, []);

  return { toastError, toastSuccess, toastNotification };
}
