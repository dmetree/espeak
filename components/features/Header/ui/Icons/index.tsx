import s from './.module.scss';

export const menuObj = {
  supportchat: (
    <svg className={`${s.notificationsIcon} ${s.sidebarIcon} ${s.support}`}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width="24"
      height="24">
      <g fillRule="nonzero">
        <path fillRule="evenodd" clipRule="evenodd" d="M22 10.787c0 4.854-4.253 8.788-9.5 8.788a10.22 10.22 0 0 1-2.684-.355c-1.881 1.241-4.233 1.617-5.485 1.73-.286.027-.434-.347-.24-.559.595-.65 1.431-1.803 1.715-3.368C4.073 15.43 3 13.225 3 10.787 3 5.934 7.253 2 12.5 2S22 5.934 22 10.787z" />
      </g>
    </svg>
  ),
  notifications: (
    <svg
      className={`${s.notificationsIcon} ${s.sidebarIcon}`}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width="24"
      height="24"
    >
      <path d="M4.068,18H19.724a3,3,0,0,0,2.821-4.021L19.693,6.094A8.323,8.323,0,0,0,11.675,0h0A8.321,8.321,0,0,0,3.552,6.516l-2.35,7.6A3,3,0,0,0,4.068,18Z" />
      <path d="M7.1,20a5,5,0,0,0,9.8,0Z" />
    </svg>
  ),
  login: (
    <svg
      className={`${s.loginIcon} ${s.sidebarIcon}`}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width="30"
      height="30"
    >
      <g fillRule="nonzero">
        <path d="M4.79 10.77H0.78c-0.43 0-0.78-0.34-0.78-0.77s0.35-0.77 0.78-0.77H4.79v-5.22c0-2.45 2.07-4.44 4.59-4.44h5.04c2.45 0 4.5 1.99 4.5 4.44v11.12c0 2.45-2.07 4.44-4.59 4.44H9.38c-2.45 0-4.59-1.99-4.59-4.44v-4.8H4.79zM10.67 6.55c0.31-0.3 0.81-0.3 1.11 0l3.02 2.91c0.31 0.31 0.31 0.81 0 1.12l-3.02 2.91c-0.31 0.3-0.81 0.3-1.11 0s-0.31-0.81 0-1.12l1.65-1.6H4.79v-2h7.53l-1.65-1.6c-0.31-0.31-0.31-0.81 0-1.12z" />
      </g>
    </svg>
  ),
  exit: (
    <svg
      className={`${s.exitIcon} ${s.sidebarIcon}`}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width="30"
      height="30"
    >
      <g fillRule="nonzero">
        <path d="M9.49 0c2.48 0 4.5 1.99 4.5 4.44v4.79H7.9c-0.44 0-0.79 0.34-0.79 0.77s0.35 0.77 0.79 0.77h6.09v4.79c0 2.45-2.07 4.44-4.59 4.44H4.53C2.03 20 0 18.01 0 15.56V4.45C0 1.99 2.03 0 4.53 0h4.96zm7.05 6.55c0.31-0.3 0.81-0.3 1.11 0l2.92 2.91c0.31 0.31 0.31 0.81 0 1.12l-2.92 2.91c-0.31 0.3-0.81 0.3-1.11 0s-0.31-0.81 0-1.12l1.6-1.56h-4.94v-2h4.94l-1.6-1.56c-0.31-0.31-0.31-0.81 0-1.12z" />
      </g>
    </svg>
  ),
  magazine: (
    <svg
      className={`${s.magazineIcon} ${s.sidebarIcon}`}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width="30"
      height="30"
    >
      <path d="M4.395,16.061c.199-.041,.402-.061,.605-.061h1V.1C3.672,.575,2,2.624,2,5v12.025c.699-.527,1.525-.86,2.395-.964Z" />
      <path d="M22,5v11H8V0h5V10.348c0,.623,.791,.89,1.169,.395l1.331-1.743,1.331,1.743c.378,.495,1.169,.228,1.169-.395V.101c2.282,.463,4,2.48,4,4.899Z" />
      <path d="M19,22H5c-1.657,0-3,1.343-3,3s1.343,3,3,3h12c2.761,0,5-2.239,5-5v-1Z" />
    </svg>
  ),
  user: (
    <svg
      className={`${s.userIcon} ${s.sidebarIcon}`}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 512 512"
      width="30"
      height="30"
    >
      <circle cx="256" cy="128" r="128" />
      <path d="M256,298.667c-105.99,0.118-191.882,86.01-192,192C64,502.449,73.551,512,85.333,512h341.333   c11.782,0,21.333-9.551,21.333-21.333C447.882,384.677,361.99,298.784,256,298.667z" />
    </svg>
  ),
  psycho: (
    <svg
      className={`${s.psychoIcon} ${s.sidebarIcon}`}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width="30"
      height="30"
    >
      <path d="M12,9c-2.481,0-4.5-2.019-4.5-4.5S9.519,0,12,0s4.5,2.019,4.5,4.5-2.019,4.5-4.5,4.5Z" />
      <path d="M22.922,9.681c-.686-.572-1.579-.808-2.516-.636l-4.122,1.003c-1.903,.346-3.284,2.001-3.284,3.936v7.802l-1,.182-1-.182v-7.802c0-1.935-1.381-3.589-3.227-3.923l-4.237-1.028c-.881-.162-1.774,.077-2.458,.648-.686,.572-1.078,1.411-1.078,2.303v9.834l12,2.182,12-2.182V11.984c0-.892-.393-1.731-1.078-2.303Z" />
    </svg>
  ),
  search: (
    <svg
      className={`${s.searchIcon} ${s.strokeMenuIcon}`}
      width="20px"
      height="20px"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M17 17L21 21" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M19 11C19 15.4183 15.4183 19 11 19C6.58172 19 3 15.4183 3 11C3 6.58172 6.58172 3 11 3C15.4183 3 19 6.58172 19 11Z" strokeWidth="2" />
    </svg>
  )
};
