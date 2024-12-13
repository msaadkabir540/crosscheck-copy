import style from './more.module.scss';

const MoreMenu = ({ menu, menuClass }) => {
  return (
    <>
      <div className={`${menuClass} ${style.editor}`}>
        {menu?.map((ele) => (
          <div className={style.flexFlex} onClick={ele.click} key={Math.random()}>
            {ele?.img ? <img src={ele?.img} alt="" /> : ele?.compo ? ele?.compo : ''}
            <p>{ele.title}</p>
          </div>
        ))}
      </div>
    </>
  );
};

export default MoreMenu;
