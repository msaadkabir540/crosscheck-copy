import { useCallback, useState } from 'react';

import Button from 'components/button';
import MoreMenu from 'components/more-menu';
import DeleteModal from 'components/delete-modal';
import Tags from 'components/tags';

import threeDots from 'assets/threeDots.svg';
import edit from 'assets/Edit.svg';
import del from 'assets/Delete.svg';

import style from './release.module.scss';
import AddRelease from './add-release';
import Icon from '../../../../components/icon/themed-icon';

const Releases = () => {
  const [openDelModal, setOpenDelModal] = useState(false);
  const [open, setOpen] = useState(false);
  const [openAddRelease, setOpenAddRelease] = useState(false);

  const items = [
    {
      title: 'Edit',
      icon: edit,
    },
    {
      title: 'Delete',
      icon: del,
      click: () => {
        setOpenDelModal(true);
      },
    },
  ];

  return (
    <>
      <div className={style.main}>
        <div className={style.header}>
          <Button text="Add Release" handleClick={() => setOpenAddRelease(true)} />
          <div>
            <Icon name={'MenuIcon'} />
          </div>
        </div>
        <div className={style.grid}>
          {data?.map((ele, index) => (
            <ProjectCard key={ele?.id} ele={ele} index={index} items={items} open={open} setOpen={setOpen} />
          ))}
        </div>
      </div>
      <DeleteModal openDelModal={openDelModal} setOpenDelModal={setOpenDelModal} name="release" />
      <AddRelease openAddRelease={openAddRelease} setOpenAddRelease={setOpenAddRelease} />
    </>
  );
};

export default Releases;

const data = [
  {
    name: 'Sprint 1.0',
    id: 1,
  },
  {
    name: 'Sprint 1.0',
    id: 2,
  },
  {
    name: 'Sprint 1.0',
    id: 3,
  },
  {
    name: 'Sprint 1.0',
    id: 4,
  },
  {
    name: 'Sprint 1.0',
    id: 5,
  },
  {
    name: 'Sprint 1.0',
    id: 6,
  },
  {
    name: 'Sprint 1.0',
    id: 7,
  },
  {
    name: 'Sprint 1.0',
    id: 8,
  },
];

const ProjectCard = ({ ele, index, items, setOpen, open }) => {
  const handleMoreClick = useCallback(() => {
    setOpen(index);
  }, [index]);

  const handleBackdropClick = useCallback(() => {
    setOpen(false);
  }, []);

  return (
    <div className={style.cardMain} key={index}>
      <div className={style.card}>
        <p className={style.p}>
          {ele.name}
          {ele?.name.length > 28 && <span className={style.tooltip}>{ele.name}</span>}
        </p>
        <div className={style.img} src={threeDots} alt="" onClick={handleMoreClick}>
          <Icon name={'MoreInvertIcon'} />
        </div>
        {open === index && <MoreMenu menu={items} />}
        {open === index && <div className={style.backdrop} onClick={handleBackdropClick}></div>}
      </div>
      <div className={style.body}>
        <h6 className={style.h6}>Description</h6>
        <p className={style.para}>
          In this sprint, we need to deliver test cases module along with bugs reporting and user management.
        </p>
        <div className={style.daysDiv}>
          <h5>15 Days</h5>
          <h5
            style={{
              fontWeight: 300,
            }}
          >
            1 Apr, 2023 - 15 Apr, 2023
          </h5>
        </div>
        <div className={style.flex}>
          <p className={style.title}>Created By</p>
          <p className={style.title}>Dania Tariq</p>
        </div>
        <div className={style.flex}>
          <p className={style.title}>Responsible:</p>
          <p className={style.title}>Haleema Mughal</p>
        </div>
        <div className={style.flex}>
          <p className={style.title}>Status</p>
          <p className={style.title}>
            <Tags text="Closed" />
          </p>
        </div>
      </div>
    </div>
  );
};
