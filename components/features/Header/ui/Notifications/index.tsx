import { useState } from "react";
import { format } from "date-fns";
import s from "./.module.css";

const formatNotificationTime = (createdAt) => {
    if (!createdAt) return "";

    // Firestore Timestamp → JS Date
    const date =
        typeof createdAt.toDate === "function" ? createdAt.toDate() : new Date(createdAt);

    const now = new Date();
    const isToday =
        date.getDate() === now.getDate() &&
        date.getMonth() === now.getMonth() &&
        date.getFullYear() === now.getFullYear();

    if (isToday) {
        return `Today, ${format(date, "HH:mm")}`;
    }

    return format(date, "EEE, MMM d, HH:mm");
};

const Index = ({ notifications, setDisplayNotifications }) => {

    const items = Array.isArray(notifications) ? notifications : [];

    const handleDelete = (idx: number) => {
        if (!items) return;
        const updated = items?.filter((_, i) => i !== idx);
        setDisplayNotifications(updated); // updates parent state
    };

    return (
        <div className={s.notificationsContainer}>
            {!items || items?.length === 0 ? (
                <div className={s.noNotificationsMessage}>
                    You have no new notifications.
                </div>
            ) : (
                items?.map((notification, index) => (
                    <div key={index} className={s.notificationItem}>
                        <div className={s.notificationHeader}>
                            {/* {!notification.isRead && 
                            <span className={s.unreadDot}>
                                </span>} */}
                            {/* &nbsp; */}
                            <div
                                className={s.notificationTitle}
                            >
                                {notification.title}
                            </div>
                            <button
                                className={s.deleteButton}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleDelete(index);
                                }}
                            >
                                ✖
                            </button>
                        </div>
                        <div className={s.notificationMessage}>
                            {notification.message}
                            {/* View &#x2794; */}
                        </div>
                        <div className={s.notificationMessage}>{notification.linkTo}</div>
                        <div className={s.notificationTime}>
                            {formatNotificationTime(notification.created_at)}
                        </div>
                    </div>
                ))
            )}
        </div>
    );
};

export default Index;
