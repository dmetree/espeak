import React from 'react';
import { motion } from 'framer-motion';

import Sidebar from '@/components/features/SidebarES';
import UserInfo from '@/components/pages/spec_info/UserInfoSelf';

import s from './.module.scss';

const UserInfoPage = () => {
  return (
    <motion.div
      className={`${s.container} ${s.second}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className={s.page}>
        <Sidebar />
        <div className={s.main}>
          <UserInfo />
        </div>
      </div>
    </motion.div>
  );
};

export default UserInfoPage;
