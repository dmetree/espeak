import React from 'react'

import Page from "@/components/shared/ui/Page/Page";
import Substrate from "@/components/shared/ui/Substrate/Substrate";
import Button from "@/components/shared/ui/Button";
import { Modal } from '@/components/shared/ui/Modal';
import { showModal, hideModal, toggleModal } from '@/store/actions/modal';

import { EModalKind } from '@/components/shared/types';

import { useDispatch, useSelector } from 'react-redux';
import { loadMessages } from '@/components/shared/i18n/translationLoader';

// import ChangePassword from '@/components/pages/EditProfile/features/ChangePassword';
import UpdateProfile from '@/components/pages/role_novice/EditProfile/ui/UpdateProfile';

const EditProfile = () => {

    const currentLocale = useSelector(({ locale }) => locale.currentLocale);
    const t = loadMessages(currentLocale);

    return (
        <Page>
            <Substrate color="bg-color">
                <UpdateProfile />
                {/* <Button onClick={() => showModal(EModalKind.ChangePassword)}>{t.change_password}</Button>
                <Modal modalKey={EModalKind.ChangePassword}>

                </Modal> */}
            </Substrate>
        </Page>
    )
}

export default EditProfile
