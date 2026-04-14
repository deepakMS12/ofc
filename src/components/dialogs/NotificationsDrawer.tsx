'use client';

import { useState, useEffect } from 'react';
import {
    Drawer,
    Box,
    Typography,
    IconButton,
    Tabs,
    Tab,
    Chip,
} from '@mui/material';
import { keyframes } from '@mui/system';
import { X, Mail, MoreVertical, BellRing } from 'lucide-react';

interface Notification {
    id: string;
    type: 'ticket' | 'email' | 'feedback';
    title: string;
    description: string;
    date: string;
    priority: 'HIGH' | 'MEDIUM' | 'LOW';
    unread: boolean;
}

interface NotificationsDrawerProps {
    open: boolean;
    onClose: () => void;
    onNotificationCountChange?: (count: number) => void;
}

const sampleNotifications: Notification[] = [];

const rotation = keyframes`
    0% {
        transform: rotate(0deg);
    }
    100% {
        transform: rotate(359deg);
    }
`;
const rotatingClass = 'notifyRotation';

export default function NotificationsDrawer({ open, onClose, onNotificationCountChange }: NotificationsDrawerProps) {
    const [activeTab, setActiveTab] = useState(0);

    useEffect(() => {
        if (open) {
            // Disable body scroll when drawer is open
            document.body.style.overflow = 'hidden';
        } else {
            // Re-enable body scroll when drawer is closed
            document.body.style.overflow = '';
        }

        // Cleanup: re-enable scroll when component unmounts
        return () => {
            document.body.style.overflow = '';
        };
    }, [open]);

    const unreadNotifications = sampleNotifications.filter((n) => n.unread);
    const emailFailureNotifications: Notification[] = []; // Empty for now

    // Update notification count when it changes
    useEffect(() => {
        if (onNotificationCountChange) {
            onNotificationCountChange(unreadNotifications.length);
        }
    }, [unreadNotifications.length, onNotificationCountChange]);

    const getNotificationIcon = (type: string) => {
        switch (type) {
            case 'ticket':
            case 'feedback':
                return <Mail size={20} color="#2196f3" />;
            case 'email':
                return <MoreVertical size={20} color="#f44336" />;
            default:
                return <Mail size={20} color="#2196f3" />;
        }
    };

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'HIGH':
                return { bg: '#f44336', color: 'white' };
            case 'MEDIUM':
                return { bg: '#ffc107', color: '#333' };
            case 'LOW':
                return { bg: '#4caf50', color: 'white' };
            default:
                return { bg: '#e0e0e0', color: '#666' };
        }
    };

    const notificationsToShow = activeTab === 0 ? unreadNotifications : emailFailureNotifications;

    return (
        <Drawer
            anchor="right"
            open={open}
            onClose={onClose}
            PaperProps={{
                sx: {
                    width: '45%',
                    maxWidth: '90vw',
                },
            }}
        >
            <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                {/* Header */}
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        p: 2,
                        borderBottom: '1px solid #e0e0e0',
                        backgroundColor: '#f5f5f5',
                    }}
                >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <BellRing size={22} />
                        </Box>
                        <Typography variant="h6" sx={{ fontWeight: 600, color: '#333' }}>
                            Notifications
                        </Typography>
                    </Box>
                    <IconButton onClick={onClose} size="small" sx={{ color: '#666' }}>
                        <X size={20} />
                    </IconButton>
                </Box>

                {/* Tabs */}
                <Box sx={{ borderBottom: '1px solid #e0e0e0' }}>
                    <Tabs
                        value={activeTab}
                        onChange={(_, newValue) => setActiveTab(newValue)}
                        sx={{
                            '& .MuiTab-root': {
                                textTransform: 'none',
                                fontSize: '14px',
                                fontWeight: 500,
                                minHeight: 48,
                                color: '#666',
                                '&.Mui-selected': {
                                    color: '#2196f3',
                                    fontWeight: 600,
                                },
                            },
                            '& .MuiTabs-indicator': {
                                backgroundColor: '#2196f3',
                                height: 2,
                            },
                        }}
                    >
                        <Tab label="Important" />
                        <Tab label="MSG Failure" />
                    </Tabs>
                </Box>

                {/* Notifications List */}
                <Box sx={{ flex: 1, overflowY: 'auto', backgroundColor: 'white' }}>
                    {notificationsToShow.length === 0 ? (
                        <Box
                            sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                minHeight: '520px',
                                color: '#999',
                                textAlign: 'center',
                                gap: 2,
                            }}
                        >
                            <Box
                                sx={{
                                    width: 180,
                                    height: 180,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    '& .notifyRotation': {
                                        animation: `${rotation} 2s linear infinite`,
                                        transformOrigin: '50% 50%',
                                    },
                                }}
                            >
                                <svg
                                    width="180"
                                    height="180"
                                    viewBox="0 0 92 87"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                    style={{ width: '100%', height: '100%' }}
                                >
                                    <path
                                        d="M26 54.37V38.9C26.003 37.125 26.9469 35.4846 28.48 34.59L43.48 25.84C45.027 24.9468 46.933 24.9468 48.48 25.84L63.48 34.59C65.0285 35.4745 65.9887 37.1167 66 38.9V54.37C66 57.1314 63.7614 59.37 61 59.37H31C28.2386 59.37 26 57.1314 26 54.37Z"
                                        fill="#8C92A5"
                                    />
                                    <path
                                        d="M46 47.7L26.68 36.39C26.2325 37.1579 25.9978 38.0312 26 38.92V54.37C26 57.1314 28.2386 59.37 31 59.37H61C63.7614 59.37 66 57.1314 66 54.37V38.9C66.0022 38.0112 65.7675 37.1379 65.32 36.37L46 47.7Z"
                                        fill="#CDCDD8"
                                    />
                                    <path
                                        d="M27.8999 58.27C28.7796 58.9758 29.8721 59.3634 30.9999 59.37H60.9999C63.7613 59.37 65.9999 57.1314 65.9999 54.37V38.9C65.9992 38.0287 65.768 37.1731 65.3299 36.42L27.8999 58.27Z"
                                        fill="#E5E5F0"
                                    />
                                    <path
                                        className={rotatingClass}
                                        d="M77.8202 29.21L89.5402 25.21C89.9645 25.0678 90.4327 25.1942 90.7277 25.5307C91.0227 25.8673 91.0868 26.348 90.8902 26.75L87.0002 34.62C86.8709 34.8874 86.6407 35.0924 86.3602 35.19C86.0798 35.2806 85.7751 35.2591 85.5102 35.13L77.6502 31.26C77.2436 31.0643 76.9978 30.6401 77.0302 30.19C77.0677 29.7323 77.3808 29.3438 77.8202 29.21Z"
                                        fill="#E5E5F0"
                                    />
                                    <path
                                        className={rotatingClass}
                                        d="M5.12012 40.75C6.36707 20.9791 21.5719 4.92744 41.2463 2.61179C60.9207 0.296147 79.4368 12.3789 85.2401 31.32"
                                        stroke="#E5E5F0"
                                        strokeWidth="3"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                    <path
                                        className={rotatingClass}
                                        d="M14.18 57.79L2.46001 61.79C2.03313 61.9358 1.56046 61.8088 1.2642 61.4686C0.967927 61.1284 0.906981 60.6428 1.11001 60.24L5.00001 52.38C5.12933 52.1127 5.35954 51.9076 5.64001 51.81C5.92044 51.7194 6.22508 51.7409 6.49001 51.87L14.35 55.74C14.7224 55.9522 14.9394 56.36 14.9073 56.7874C14.8753 57.2149 14.5999 57.5857 14.2 57.74L14.18 57.79Z"
                                        fill="#E5E5F0"
                                    />
                                    <path
                                        className={rotatingClass}
                                        d="M86.9998 45.8C85.9593 65.5282 70.9982 81.709 51.4118 84.2894C31.8254 86.8697 13.1841 75.1156 7.06982 56.33"
                                        stroke="#E5E5F0"
                                        strokeWidth="3"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                </svg>
                            </Box>
                            <Typography variant="body2" sx={{ fontWeight: 600, color: '#555' }}>
                                No notifications yet
                            </Typography>
                            <Typography variant="caption" sx={{ maxWidth: 240, color: '#888', lineHeight: 1.4 }}>
                                Stay tuned! We will update you here whenever something important happens.
                            </Typography>
                        </Box>
                    ) : (
                        notificationsToShow.map((notification) => {
                            const priorityColors = getPriorityColor(notification.priority);
                            return (
                                <Box
                                    key={notification.id}
                                    sx={{
                                        p: 2,
                                        borderBottom: '1px solid #f0f0f0',
                                        display: 'flex',
                                        gap: 2,
                                        cursor: 'pointer',
                                        '&:hover': {
                                            backgroundColor: '#fffdf5',
                                        },
                                    }}
                                >
                                    {/* Icon */}
                                    <Box sx={{ mt: 0.5 }}>
                                        {getNotificationIcon(notification.type)}
                                    </Box>

                                    {/* Content */}
                                    <Box sx={{ flex: 1, minWidth: 0 }}>
                                        <Typography
                                            variant="body2"
                                            sx={{
                                                fontWeight: 600,
                                                color: '#333',
                                                mb: 0.5,
                                            }}
                                        >
                                            {notification.title}
                                        </Typography>
                                        <Typography
                                            variant="caption"
                                            sx={{
                                                color: '#666',
                                                display: 'block',
                                                mb: 1,
                                                fontSize: '12px',
                                                lineHeight: 1.4,
                                            }}
                                        >
                                            {notification.description}
                                        </Typography>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <Chip
                                                label={notification.priority}
                                                size="small"
                                                sx={{
                                                    backgroundColor: priorityColors.bg,
                                                    color: priorityColors.color,
                                                    fontWeight: 500,
                                                    fontSize: '11px',
                                                    height: 20,
                                                }}
                                            />
                                            <Typography
                                                variant="caption"
                                                sx={{
                                                    color: '#999',
                                                    fontSize: '11px',
                                                }}
                                            >
                                                {notification.date}
                                            </Typography>
                                        </Box>
                                    </Box>
                                </Box>
                            );
                        })
                    )}
                </Box>
            </Box>
        </Drawer>
    );
}

