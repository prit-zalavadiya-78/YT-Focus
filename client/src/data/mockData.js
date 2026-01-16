export const userData = {
  name: "Ambal",
  avatar: "https://randomuser.me/api/portraits/men/32.jpg",
  xp: 2450,
  level: 5,
  streak: 12,
  league: "Diamond",
  stats: {
    hoursWatched: 14.5,
    videosCompleted: 28,
    quizzesAced: 15
  },
  weeklyActivity: [40, 70, 20, 90, 60, 30, 80],
  dailyQuests: [
    { id: 1, title: "Watch 1 Video", completed: true },
    { id: 2, title: "Score 100% on a Quiz", completed: false },
    { id: 3, title: "Study for 30 mins", completed: false },
  ]
};

export const coursesData = [
  {
    id: 1,
    title: "Complete React Course 2024",
    instructor: "Chai aur Code",
    thumbnail: "https://img.youtube.com/vi/bMknfKXIFA8/maxresdefault.jpg",
    totalVideos: 45,
    completedVideos: 12,
    progress: 26, // Percentage
    lastWatched: "Props & Tailwind",
    locked: false
  },
  {
    id: 2,
    title: "System Design for Beginners",
    instructor: "NeetCode",
    thumbnail: "https://i.ytimg.com/vi/i53Gi_K3o7I/maxresdefault.jpg",
    totalVideos: 18,
    completedVideos: 17,
    progress: 94,
    lastWatched: "Load Balancers",
    locked: false
  },
  {
    id: 3,
    title: "Advanced Backend Engineering",
    instructor: "Hussein Nasser",
    thumbnail: "https://i.ytimg.com/vi/7MwD_v9651g/maxresdefault.jpg",
    totalVideos: 30,
    completedVideos: 0,
    progress: 0,
    lastWatched: "Start Course",
    locked: true 
  }
];
