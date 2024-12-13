import Permissions from 'components/permissions';
import Menu from 'components/menu';
import MobileMenu from 'components/mobile-menu';
import Highlighter from 'components/highlighter';

import { formattedDate } from 'utils/date-handler';

import style from './user.module.scss';
import Icon from '../../components/icon/themed-icon';

export const columnsData = ({
  menu,
  searchedText,
  openMenuMobile,
  setopenMenuMobile,
  openMenu,
  userDetails,
  setOpenMenu,
}) => {
  return [
    {
      name: 'User Name', // NOTE: table head name
      key: 'name', // NOTE: table column unique key
      hidden: false,
      widthAndHeight: { width: '200px', height: '36px' },

      render: ({ profilePicture, value }) => {
        let nameSymbol = '';
        let nameSpaces = value?.split(' ');

        if (nameSpaces?.length > 1) {
          nameSymbol = `${nameSpaces[0]?.at(0)}${nameSpaces[1]?.at(0) ? nameSpaces[1]?.at(0) : ''}`;
        } else {
          nameSymbol = nameSpaces && nameSpaces[0]?.at(0);
        }

        return (
          <div
            className={style.imgDiv}
            style={{
              justifyContent: 'flex-start',
            }}
          >
            {profilePicture ? (
              <img
                style={{ width: '30px', height: '30px', borderRadius: '50%' }}
                alt="profilePicture"
                src={profilePicture}
              />
            ) : (
              <div
                style={{
                  borderRadius: '50%',
                  background: '#11103d',
                  width: '30px',
                  height: '30px',
                  color: 'white',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                {nameSymbol}
              </div>
            )}
            <p className={style.name}>
              <Highlighter search={searchedText}>{value}</Highlighter>
            </p>
          </div>
        );
      },
    },
    {
      name: 'Email',
      key: 'email',
      hidden: false,
      widthAndHeight: { width: '200px', height: '36px' },

      render: ({ value }) => (
        <div className={style.imgDiv}>
          <p className={style.name}>
            <Highlighter search={searchedText}>{value}</Highlighter>
          </p>
        </div>
      ),
    },
    {
      name: 'Role',
      key: 'role',
      hidden: false,
      widthAndHeight: { width: '200px', height: '36px' },

      render: ({ value }) => (
        <div className={style.imgDiv}>
          <p className={style.name}>
            <Highlighter search={searchedText}>{value}</Highlighter>
          </p>
        </div>
      ),
    },
    {
      name: 'Last Active',
      key: 'lastActive',
      hidden: false,
      widthAndHeight: { width: '200px', height: '36px' },

      render: ({ value }) => (
        <div className={style.imgDiv}>
          <p className={style.name}>{formattedDate(value, 'dd MMM,yyyy')}</p>
        </div>
      ),
    },

    {
      name: userDetails?.role === 'Admin' && 'Actions',
      key: 'actions',
      hidden: false,
      widthAndHeight: { width: '100px', height: '36px' },
      render: ({ row }) => {
        return (
          <>
            <Permissions allowedRoles={['Admin']} currentRole={userDetails?.role}>
              <div className={style.imgDiv1}>
                <div
                  className={style.img}
                  onClick={() => {
                    setOpenMenu(row);
                    setopenMenuMobile(row);
                  }}
                  role="presentation"
                >
                  <Icon name={'MoreInvertIcon'} />
                </div>
                {openMenu?._id === row?._id && (
                  <div className={style.menuDiv}>
                    <Menu menu={menu} />
                  </div>
                )}

                {openMenu?._id === row?._id && (
                  <MobileMenu isOpen={openMenuMobile} setIsOpen={setopenMenuMobile}>
                    <div className={style.menuDivMobile}>
                      {menu?.map((ele) => {
                        return (
                          <div className={style.innerDiv} onClick={ele.click} key={ele?.title} role="presentation">
                            {<p>{ele?.title}</p>}
                          </div>
                        );
                      })}
                    </div>
                  </MobileMenu>
                )}
              </div>
            </Permissions>
          </>
        );
      },
    },
  ];
};

export const columnsDataInvitees = ({
  invitesMenu,
  openMenu,
  setOpenMenu,
  openMenuInviteMobile,
  userDetails,
  setopenMenuInviteMobile,
}) => {
  return [
    {
      name: 'Email',
      key: 'email',
      hidden: false,
      widthAndHeight: { width: '200px', height: '36px' },

      render: ({ value }) => (
        <div className={style.imgDiv} style={{ justifyContent: 'flex-start' }}>
          <p className={style.name}>{value}</p>
        </div>
      ),
    },
    {
      name: 'Role',
      key: 'role',
      hidden: false,
      widthAndHeight: { width: '150px', height: '36px' },

      render: ({ value }) => (
        <div className={style.imgDiv}>
          <p className={style.name}>{value}</p>
        </div>
      ),
    },
    {
      name: userDetails?.role === 'Admin' && 'Actions',
      key: 'actions',
      hidden: false,
      widthAndHeight: { width: '10px', height: '36px' },
      render: ({ row }) => {
        return (
          <>
            <Permissions allowedRoles={['Admin']} currentRole={userDetails?.role}>
              <div className={style.imgDiv1}>
                <div
                  className={style.img}
                  onClick={() => {
                    setOpenMenu(row);
                    setopenMenuInviteMobile(true);
                  }}
                  role="presentation"
                >
                  <Icon name={'MoreInvertIcon'} height={16} width={16} />
                </div>
                {openMenu?._id === row?._id && (
                  <div className={style.menuDiv}>
                    <Menu menu={invitesMenu} />
                  </div>
                )}
                {openMenu?._id === row?._id && (
                  <MobileMenu isOpen={openMenuInviteMobile} setIsOpen={setopenMenuInviteMobile}>
                    <div className={style.menuDivMobile}>
                      {invitesMenu?.map((ele) => {
                        return (
                          <div className={style.innerDiv} onClick={ele.click} key={ele?.title} role="presentation">
                            {<p>{ele?.title}</p>}
                          </div>
                        );
                      })}
                    </div>
                  </MobileMenu>
                )}
              </div>
            </Permissions>
          </>
        );
      },
    },
  ];
};
