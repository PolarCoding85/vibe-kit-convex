export type Notification = {
  id: string
  title: string
  message: string
  timestamp: Date
  read: boolean
  archived: boolean
  type?: 'reply' | 'follow' | 'task' | 'system'
  link?: string
}

// Dummy notifications data
export const dummyNotifications: Notification[] = [
  {
    id: '1',
    title: 'New Reply',
    message: 'Tommy Lee replied to you in Generic File',
    timestamp: new Date('2025-04-07T12:35:00'),
    read: false,
    archived: false,
    type: 'reply',
    link: '/files/generic'
  },
  {
    id: '2',
    title: 'New Follower',
    message: 'Jennifer Lee followed you',
    timestamp: new Date('2025-04-07T09:12:00'),
    read: false,
    archived: false,
    type: 'follow'
  },
  {
    id: '3',
    title: 'Task Assignment',
    message: 'Eve Monroe assigned a task to you #JP-2137',
    timestamp: new Date('2025-04-07T08:56:00'),
    read: false,
    archived: true,
    type: 'task',
    link: '/tasks/JP-2137'
  }
]
