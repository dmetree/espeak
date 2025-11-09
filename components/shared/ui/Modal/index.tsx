import React, { CSSProperties, FC, MouseEvent, ReactNode } from 'react';
import ReactDom from 'react-dom';
import { useDispatch, useSelector } from 'react-redux';
import { hideModal } from '@/store/actions/modal/index'; // Assuming the actions are in this file

const MODAL_STYLES: CSSProperties = {
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    backgroundColor: 'var(--bgColor)',
    padding: '40px',
    zIndex: 1000,
};

const OVERLAY_STYLES: CSSProperties = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, .7)',
    zIndex: 1000,
};

type TModalProps = {
    modalKey: string;
    children: ReactNode;
    onClose?: () => void;
    className?: string;
};

export const Modal: FC<TModalProps> = ({ modalKey, children, onClose, className }) => {
    const dispatch = useDispatch();

    // Get the list of open modals from the Redux store
    const openModals = useSelector(({ modal }) => modal.openModals);

    // If the modal is not open, return null (do not render)
    if (!openModals.includes(modalKey)) return null;

    const closeModal = (e: MouseEvent<HTMLDivElement>) => {
        e.preventDefault();
        dispatch(hideModal(modalKey)); // Dispatch the hideModal action to remove the modal from the stack
        if (onClose) {
            onClose(); // Call the onClose callback if provided
        }
    };

    return (
        <>
            {ReactDom.createPortal(
                <>
                    <div style={OVERLAY_STYLES} onClick={closeModal} />
                    <div className={className} style={MODAL_STYLES}>
                        {/* Modal content */}
                        {children}
                    </div>
                </>,
                document.getElementById('portal')! // Ensure there is a DOM element with id="portal" for modals
            )}
        </>
    );
};
