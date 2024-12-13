import { useCallback } from 'react';

import { useForm } from 'react-hook-form';

import Modal from 'components/modal';
import TextField from 'components/text-field';
import Button from 'components/button';
import SelectBox from 'components/select-box';
import TextArea from 'components/text-area';
import DatePicker from 'components/date-picker';

import style from './import.module.scss';
import Icon from '../../../../../components/icon/themed-icon';

const AddRelease = ({ openAddRelease, setOpenAddRelease }) => {
  const { control, register } = useForm();

  const closeAddReleaseModal = useCallback(() => {
    setOpenAddRelease(false);
  }, [setOpenAddRelease]);

  const handleRegisterName = useCallback(() => {
    register('name', {
      required: 'Required',
    });
  }, [register]);

  const handleCloseAddRelease = useCallback(() => {
    setOpenAddRelease(false);
  }, [setOpenAddRelease]);

  return (
    <>
      {' '}
      <Modal open={openAddRelease} handleClose={closeAddReleaseModal} className={style.mainDiv}>
        <div className={style.crossImg}>
          <span className={style.modalTitle}>Add Release</span>
          <div onClick={closeAddReleaseModal} className={style.hover}>
            <Icon name={'CrossIcon'} />
            <div className={style.tooltip}>
              <p>Close</p>
            </div>
          </div>
        </div>
        <form>
          <TextField register={handleRegisterName} label="Release Name" name="name" placeholder="Sprint 1.0" />
          <div className={style.grid}>
            <DatePicker
              id="checkInTime"
              control={control}
              label={'Start Date'}
              placeholder={'Select'}
              name={'startDate'}
            />
            <DatePicker
              id="checkInTime"
              control={control}
              label={'End Date'}
              placeholder={'Select'}
              name={'endDate'}
              backClass={style.popper}
            />
          </div>
          <div
            style={{
              marginTop: '20px',
            }}
          >
            <SelectBox
              name="status"
              control={control}
              badge
              options={statusOptions}
              label={'Recurrence'}
              placeholder={'Select'}
              numberBadgeColor={'#39695b'}
              showNumber
            />
          </div>
          <div
            style={{
              marginTop: '20px',
            }}
          >
            <TextArea label={'Release Description'} placeholder="Write your text here" />
          </div>
          <div
            style={{
              marginTop: '20px',
            }}
          >
            <SelectBox
              name="person"
              control={control}
              badge
              options={statusOptions}
              label={'Responsible Person'}
              placeholder={'Select'}
              numberBadgeColor={'#39695b'}
              showNumber
            />
          </div>
          <div className={style.mainBtnDiv}>
            <Button text={'Cancel'} btnClass={style.btnClassUncheckModal} handleClick={handleCloseAddRelease} />
            <Button text={`Add Release`} type={'onSubmit'} />
          </div>
        </form>
      </Modal>
    </>
  );
};

export default AddRelease;

const statusOptions = [
  {
    label: 'Open',
    value: 'Open',
  },
  {
    label: 'Closed',
    value: 'Closed',
  },
];
