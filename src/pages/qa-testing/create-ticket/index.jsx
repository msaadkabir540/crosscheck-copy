import { useCallback, useRef, useState } from 'react';

import Modal from 'components/modal';
import Button from 'components/button';
import SelectBox from 'components/select-box';
import GenericTable from 'components/generic-table';

import { columnsData, rows, locationOptions } from './helper';
import style from './retest.module.scss';
import TaskCreated from './task-created';
import Icon from '../../../components/icon/themed-icon';

const CreateTicket = ({ openCreateTicket, setOpenCreateTicket, control }) => {
	const { ref } = useRef;

	const [openTaskCreated, setOpenTaskCreated] = useState(false);

	const handleCloseCreateTicket = useCallback(() => setOpenCreateTicket(false), [setOpenCreateTicket]);

	const handleTaskCreated = useCallback(() => {
		setOpenTaskCreated(true);
		setOpenCreateTicket(false);
	}, [setOpenTaskCreated, setOpenCreateTicket]);

	return (
		<>
			<Modal
				open={openCreateTicket}
				handleClose={handleCloseCreateTicket}
				className={style.mainDiv}
				backClass={style.modal}
			>
				<div className={style.crossImg}>
					<span className={style.modalTitle}>Create Ticket</span>
					<div onClick={handleCloseCreateTicket} className={style.hover}>
						<Icon name={'CrossIcon'} />
						<div className={style.tooltip}>
							<p>Close</p>
						</div>
					</div>
				</div>
				<p className={style.p}>Bug-102, Bug-103, Bug-104 </p>
				<div>
					<SelectBox
						options={locationOptions}
						label={'Assign to'}
						name={'Assign to'}
						control={control}
						numberBadgeColor={'#39695b'}
						dynamicClass={style.zDynamicState4}
						showNumber
						isMulti
						placeholder="Select"
					/>
				</div>

				<div className={style.flex}>
					<Icon name={'RetestIcon'} />
					<p>Ticket Creation History</p>
				</div>
				<div className={style.tableWidth}>
					<GenericTable
						ref={ref}
						columns={columnsData}
						dataSource={rows || []}
						height={'300px'}
						classes={{
							test: style.test,
							table: style.table,
							thead: style.thead,
							th: style.th,
							containerClass: style.checkboxContainer,
							tableBody: style.tableRow,
						}}
					/>
				</div>
				<div className={style.innerFlex}>
					<p onClick={handleCloseCreateTicket}>Discard</p>
					<Button
						text="Save"
						handleClick={handleTaskCreated}
					/>
				</div>
			</Modal>
			<TaskCreated openTaskCreated={openTaskCreated} setOpenTaskCreated={setOpenTaskCreated} />
		</>
	);
};

export default CreateTicket;
