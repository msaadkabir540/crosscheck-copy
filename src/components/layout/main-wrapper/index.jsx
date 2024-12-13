import { useCallback, useEffect, useState } from 'react';

import _ from 'lodash';
import { useNavigate } from 'react-router-dom';

import { useMode } from 'context/dark-mode';

import TextField from 'components/text-field';
import MobileMenu from 'components/mobile-menu';

import { useGetProjectsForMainWrapper } from 'api/v1/projects/projects';
import { getUsers } from 'api/v1/settings/user-management';

import search from 'assets/search.svg';
import clearIcon from 'assets/cross.svg';
import arrow from 'assets/arrow-separate-vertical.svg';

import layoutStyle from './style.module.scss';
import style from '../layout.module.scss';
import Icon from '../../icon/themed-icon';
import UserSelector from '../../user-selector';

const MainWrapper = ({
  disabled = false,
  title,
  date = new Date(),
  admin,
  children,
  searchField,
  stylesBack,
  onSearch,
  barIcon = false,
  activeTab = 0,
  noHeader = false,
  onClear,
  setSelectedUser,
}) => {
  const [open, setOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isSearch, setIsSearch] = useState(false);
  const [viewAsUsers, setViewAsUsers] = useState([]);

  const { data: _allProjects } = useGetProjectsForMainWrapper(barIcon ? { search: '' } : {}, barIcon);

  const loadUsers = useCallback(async () => {
    try {
      const users = await getUsers({
        sortBy: '',
        sort: '',
        search: '',
      });

      const filteredUsers = users?.users
        ?.filter((x) => x.role !== 'Admin' && x.status && !x?.superAdmin)
        .map((x) => ({
          label: x.name,
          ...(x?.profilePicture && { image: x?.profilePicture }),
          ...(!x?.profilePicture && { imagAlt: _.first(x?.name) }),
          value: x._id,
          role: x?.role,
          checkbox: false,
        }));

      setViewAsUsers(filteredUsers);
    } catch (error) {
      console.error('Error loading users:', error);
    }
  }, []);

  useEffect(() => {
    if (admin) {
      loadUsers();
    }
  }, [loadUsers, admin]);

  const { isDarkMode } = useMode();

  const handleOpen = useCallback(() => {
    setOpen(true);
  }, []);

  const handleDoubleOpener = useCallback(() => {
    setIsOpen(true);
    setOpen(true);
  }, []);

  const handelOpenSearch = useCallback(() => {
    setIsSearch(true);
  }, []);

  const handleCloseSearch = useCallback(() => {
    setIsSearch(false);
  }, []);

  const handleClose = useCallback(() => {
    () => setOpen(false);
  }, []);

  return disabled ? (
    children
  ) : (
    <main className={layoutStyle.mainWrapper}>
      {title && (
        <>
          <div
            className={`${style.navbarDiv} ${noHeader && style.navbarDivAtProjects} ${isDarkMode ? 'dark-mode' : 'light-mode'}  ${noHeader && layoutStyle.noMargin}`}
          >
            {!noHeader && (
              <div className={layoutStyle.barIcon}>
                <h6>
                  {barIcon && (
                    <div alt="" onClick={handleOpen}>
                      <Icon name={'UpDownArrow'} height={24} width={24} />
                    </div>
                  )}
                  {title}
                </h6>
                <p>{date}</p>

                {open && (
                  <div className={style.allProjects}>
                    {_allProjects?.allProjects.map((x) => {
                      return <ItemComponent key={x._id} item={x} setOpen={setOpen} activeTab={activeTab} />;
                    })}
                  </div>
                )}

                {open && <div className={style.backdrop} onClick={handleClose}></div>}
              </div>
            )}
            <div className={style.searchDiv}>
              {searchField && (
                <TextField
                  wraperClass={noHeader && layoutStyle.input}
                  searchField={searchField}
                  icon={search}
                  clearIcon={clearIcon}
                  placeholder="Type and search..."
                  onClear={onClear}
                  onChange={onSearch}
                />
              )}
            </div>
            {admin && title === 'Dashboard' && (
              <div>
                <UserSelector options={viewAsUsers} setSelectedUser={setSelectedUser} />
              </div>
            )}
          </div>
          <div
            className={`${style.navbarDivMobile} ${isDarkMode ? 'dark-mode' : 'light-mode'} ${noHeader && layoutStyle.noMargin} ${noHeader && layoutStyle.paddingOnHeader}`}
          >
            {!isSearch ? (
              <div className={layoutStyle.flexBar}>
                {!noHeader && (
                  <>
                    <div className={layoutStyle.barIcon}>
                      <h6>
                        {title}
                        {barIcon && (
                          <div alt="" onClick={handleDoubleOpener}>
                            <img src={arrow} alt="" />
                          </div>
                        )}
                      </h6>
                      {open && (
                        <div className={style.allProjects}>
                          {_allProjects?.allProjects.map((x) => {
                            return <ItemComponent key={x._id} item={x} activeTab={activeTab} />;
                          })}
                        </div>
                      )}
                      {open && (
                        <MobileMenu isOpen={isOpen} setIsOpen={setIsOpen}>
                          <div className={style.allProjectsMobile}>
                            {_allProjects?.allProjects.map((x) => {
                              return <ItemComponent key={x._id} item={x} activeTab={activeTab} />;
                            })}
                          </div>
                        </MobileMenu>
                      )}

                      {open && <div className={style.backdrop} onClick={handleClose}></div>}
                    </div>
                    {searchField && <img alt="" src={search} onClick={handelOpenSearch} />}
                  </>
                )}
              </div>
            ) : (
              <div className={style.mobileSearchDiv}>
                {searchField && (
                  <TextField
                    wraperClass={noHeader && layoutStyle.input}
                    searchField={searchField}
                    icon={search}
                    clearIcon={clearIcon}
                    placeholder="Type and search..."
                    onClear={onClear}
                    onChange={onSearch}
                  />
                )}

                {searchField && (
                  <span className={style.doneText} onClick={handleCloseSearch}>
                    Done
                  </span>
                )}
              </div>
            )}
          </div>
        </>
      )}
      <div className={style.childDiv} style={stylesBack}>
        {children}
      </div>
    </main>
  );
};

export default MainWrapper;

const ItemComponent = ({ item, setOpen, activeTab }) => {
  const navigate = useNavigate();

  const itemClickHandler = useCallback(() => {
    setOpen && setOpen(false);

    navigate(`/projects/${item?._id}?active=${activeTab}`);
  }, [activeTab, item?._id, navigate, setOpen]);

  return (
    <div className={style.innerFlex} onClick={itemClickHandler}>
      <span>
        {_.chain(_.words(item?.name))
          .take(2)
          .map((word) => word.charAt(0))
          .join('')
          .value()}
      </span>
      <p>{item?.name}</p>
    </div>
  );
};
