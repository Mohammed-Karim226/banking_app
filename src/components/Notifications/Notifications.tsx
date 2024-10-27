"use client";

import { useState, useEffect } from "react";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { NotificationBing } from "iconsax-react";

// Define types for notifications
type Notification = {
  id: string;
  title: string;
  message: string;
  time: string;
};

const generateNotification = (): Notification => ({
  id: Math.random().toString(36).substr(2, 9),
  title: [
    "New transaction",
    "Balance update",
    "Security alert",
    "Bill due soon",
    "Cashback earned",
  ][Math.floor(Math.random() * 5)],
  message: [
    "You spent $24.50 at Starbucks",
    "Your current balance is $1,234.56",
    "New login detected from New York",
    "Your electricity bill is due in 3 days",
    "You earned $5.00 cashback on recent purchases",
  ][Math.floor(Math.random() * 5)],
  time: new Date().toLocaleTimeString(),
});

export function NotificationsDropdown({ open }: { open?: boolean }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);

  useEffect(() => {
    const interval = setInterval(() => {
      const newNotification = generateNotification();
      setNotifications((prev) => [newNotification, ...prev.slice(0, 4)]);
      setUnreadCount((prev) => prev + 1);
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const handleOpen = (open: boolean) => {
    if (open) {
      setUnreadCount(0);
    }
  };

  return (
    <DropdownMenu onOpenChange={handleOpen}>
      <DropdownMenuTrigger asChild className="pl-3">
        <Button variant="ghost" className="relative" size="icon">
          <NotificationBing size={open ? "24" : "20"} color="#7a7a7a" />{" "}
          {unreadCount > 0 && (
            <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-600" />
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-80 dark:border-stone-500 bg-white dark:bg-stone-600">
        <DropdownMenuLabel className="dark:text-slate-900">
          Notifications
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          {notifications.map((notification) => (
            <DropdownMenuItem key={notification.id}>
              <div className="flex flex-col">
                <span className="font-medium dark:text-slate-900">
                  {notification.title}
                </span>
                <span className="text-sm text-muted-foreground dark:text-slate-900">
                  {notification.message}
                </span>
                <span className="text-xs text-muted-foreground dark:text-slate-900">
                  {notification.time}
                </span>
              </div>
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
