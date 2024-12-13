import PropTypes from 'prop-types';

import { useAppContext } from 'context/app-context';

import Button from 'components/button';
import SelectBox from 'components/select-box';
import DateRange from 'components/date-range';
import Permissions from 'components/permissions';

import style from './header.module.scss';
import { useProjectOptions } from '../helper';

const FilterHeader = ({ control, reset, watch, mobileView, setValue, onFilterApply, _IsLoading }) => {
  const { userDetails } = useAppContext();
  const { data = {} } = useProjectOptions();

  const { deletedBy = [], searchTypeOptions } = data;

  const onChange = (name, dates) => {
    const [start, end] = dates;
    setValue(name, { start, end });
  };

  return (
    <>
      <div className={style.mainHeader} style={{ paddingBottom: mobileView ? '35px' : '' }}>
        <div className={style.grid}>
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '10px',
              alignItems: 'flex-end',
            }}
          >
            <Permissions allowedRoles={['Admin']} currentRole={userDetails?.role}>
              <div className={style.statusBar}>
                <SelectBox
                  options={deletedBy}
                  name="deletedBy"
                  control={control}
                  isMulti
                  badge
                  label={'Deleted By'}
                  placeholder={'Select'}
                  numberBadgeColor={'#39695b'}
                  dynamicClass={style.zDynamicState5}
                  showNumber
                />
              </div>
            </Permissions>
            <div className={style.dateClass}>
              <DateRange
                handleChange={(e) => onChange('deletedOn', e)}
                startDate={watch('deletedOn')?.start}
                endDate={watch('deletedOn')?.end}
                label={'Date Deleted'}
                name={'deletedOn'}
                placeholder={'Select'}
                control={control}
                className={style.dateClass}
              />
            </div>
            <div className={style.statusBar}>
              <SelectBox
                label={'Type'}
                name={'searchType'}
                isMulti
                control={control}
                numberBadgeColor={'#39695b'}
                placeholder={'Select'}
                dynamicClass={style.zDynamicState4}
                options={searchTypeOptions}
                showNumber
              />
            </div>

            <div className={style.statusBar}></div>
          </div>
          <div className={style.resetDiv}>
            <Button
              text={'Reset'}
              type="button"
              btnClass={style.reset}
              disabled={_IsLoading}
              style={{ marginRight: '10px', marginLeft: '10px' }}
              onClick={(e) => {
                e.preventDefault();
                reset();
              }}
            />
            <Button
              text={'Apply'}
              type="button"
              disabled={_IsLoading}
              onClick={(e) => {
                e.preventDefault();
                onFilterApply();
              }}
            />
          </div>
        </div>
      </div>
    </>
  );
};

FilterHeader.propTypes = {
  control: PropTypes.any.isRequired,
  reset: PropTypes.func.isRequired,
  watch: PropTypes.func.isRequired,
  mobileView: PropTypes.bool.isRequired,
  setValue: PropTypes.func.isRequired,
  onFilterApply: PropTypes.func.isRequired,
  _IsLoading: PropTypes.bool.isRequired,
};

export default FilterHeader;
