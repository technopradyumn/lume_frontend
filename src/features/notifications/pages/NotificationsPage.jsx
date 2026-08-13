import React, { useEffect, useState } from "react";
import { Bell } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getNotifications, markNotificationsAsRead } from "../../../shared/services/api";
import { UserAvatar } from "../../../shared/components/UserAvatar";
import { timeAgo } from "../../../shared/utils/formatters";

export function NotificationsPage() {
  const [items, setItems] = useState(() => {
    try {
      return JSON.parse(sessionStorage.getItem("lume_notifications") || "[]");
    } catch {
      return [];
    }
  });
  const navigate = useNavigate();
  useEffect(() => {
    getNotifications().then((data) => {
      setItems(data || []);
      sessionStorage.setItem("lume_notifications", JSON.stringify(data || []));
    }).catch(() => {});
    markNotificationsAsRead().catch(() => {});
  }, []);
  return <div className="page-container"><div className="section-header"><div><h1 className="section-title"><Bell size={24} /> Notifications</h1><p className="section-subtitle">Your latest activity</p></div></div>{items.length ? items.map((item) => <button key={item._id} className="notification-page__item" onClick={() => item.link && navigate(item.link)}><UserAvatar user={item.sender} size="md" noLink /><span><strong>{item.message}</strong><small>{timeAgo(item.createdAt)}</small></span></button>) : <p className="section-subtitle">You are all caught up.</p>}</div>;
}
