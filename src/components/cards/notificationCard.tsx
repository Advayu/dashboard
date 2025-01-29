"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";

interface Notification {
  message: string;
  action?: string;
}

interface NotificationCardProps {
  notification: Notification[];
}

const NotificationCard = ({ notification }: NotificationCardProps) => {
  const [notifications, setNotifications] = useState(notification);

  // TODO: Replace with better logic to handle or remove notification from backend
  const removeNotification = (index: number) => {
    setNotifications(notifications.filter((_, i) => i !== index));
  };

  return (
    <div className="">
      <h1 className="text-2xl font-bold">{"Here’s what’s new today"}</h1>

      {notifications.map((notif, index) => (
        <div
          key={index}
          className="relative md:w-64 w-full h-fit text-base font-medium rounded-md  my-2  p-4 bg-gradient-to-l from-blueTilt/20 to-blueTilt/5">
          <button
            className="absolute top-0 right-0 mt-2 mr-2 "
            onClick={() => removeNotification(index)}>
            &times;
          </button>
          <p>{notif.message}</p>
          {notif.action && (
            <Button className="bg-transparent" variant={"outline"}>
              {notif.action}
            </Button>
          )}
        </div>
      ))}
    </div>
  );
};

export default NotificationCard;
