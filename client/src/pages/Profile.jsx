import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import api from '../services/api';
import { 
  Trophy, Flame, Clock, Video, 
  Target, Calendar, TrendingUp, Loader2, ArrowLeft, BarChart3, Edit2, Award, Download, LogOut 
} from 'lucide-react';
import { Progress } from "../components/ui/progress";
import { Button } from "../components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../components/ui/dialog";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";

const Profile = () => {
  const { user, login, logout } = useAuth(); 
  const navigate = useNavigate();
  const [profileData, setProfileData] = useState(null);
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  // Edit State
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editForm, setEditForm] = useState({ name: '', bio: '', avatar: '' });
  const [updating, setUpdating] = useState(false);

  // Helper: Get Year
  const getJoinedYear = (dateString) => {
    if (!dateString) return new Date().getFullYear();
    return new Date(dateString).getFullYear();
  };

  // Helper: Get Last 7 Days Activity
  const getLast7DaysData = (log = []) => {
    const last7Days = [];
    const today = new Date();
    const logMap = {};
    log.forEach(l => logMap[l.date] = l.count);

    for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(today.getDate() - i);
        const dateStr = d.toISOString().split('T')[0];
        const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });
        
        last7Days.push({
            day: dayName,
            fullDate: dateStr,
            count: logMap[dateStr] || 0
        });
    }
    return last7Days;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userRes = await api.get('/users/profile');
        setProfileData(userRes.data);
        
        setEditForm({
          name: userRes.data.name,
          bio: userRes.data.bio || '',
          avatar: userRes.data.avatar || ''
        });

        const goalsRes = await api.get('/goals');
        setGoals(goalsRes.data);
      } catch (error) {
        console.error("Error loading profile", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setUpdating(true);
    try {
      const { data } = await api.put('/users/profile', editForm);
      setProfileData(data); 
      login(data); 
      setIsEditOpen(false);
    } catch (error) {
      alert("Failed to update profile");
      console.error(error);
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
    </div>
  );

  const displayUser = profileData || user; 
  const weeklyData = getLast7DaysData(displayUser?.activityLog);
  const maxCount = Math.max(...weeklyData.map(d => d.count), 5);

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar user={displayUser} />

      <main className="max-w-6xl mx-auto px-4 py-8">
        
        {/* Back Button */}
        <div className="mb-6">
            <Button 
                variant="ghost" 
                onClick={() => navigate('/dashboard')}
                className="pl-0 gap-2 text-slate-500 hover:text-slate-900 hover:bg-transparent"
            >
                <ArrowLeft className="w-5 h-5" /> Back to Learning
            </Button>
        </div>

        {/* --- Header Section --- */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8 mb-8 flex flex-col md:flex-row items-center md:items-start gap-8 relative group">
           {/* Edit & Logout Buttons */}
           <div className="absolute top-6 right-6 flex items-center gap-2">
             <button 
               onClick={() => setIsEditOpen(true)}
               className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-all"
               title="Edit Profile"
             >
               <Edit2 className="w-5 h-5" />
             </button>
             <button 
               onClick={logout}
               className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-all"
               title="Logout"
             >
               <LogOut className="w-5 h-5" />
             </button>
           </div>

           <div className="relative shrink-0">
             <div className="w-32 h-32 rounded-full p-1 bg-gradient-to-tr from-blue-500 to-purple-500">
               <div className="w-full h-full rounded-full border-4 border-white bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-4xl font-bold overflow-hidden">
                 {displayUser?.avatar ? (
                   <img 
                     src={displayUser.avatar} 
                     alt="Profile" 
                     className="w-full h-full object-cover"
                   />
                 ) : (
                   <span>{displayUser?.name?.charAt(0)?.toUpperCase() || 'U'}</span>
                 )}
               </div>
             </div>
             <div className="absolute -bottom-2 -right-2 bg-slate-900 text-white text-xs font-bold px-3 py-1 rounded-full border-4 border-white">
               Lvl {displayUser?.level || 1}
             </div>
           </div>

           <div className="flex-1 text-center md:text-left space-y-3">
             <div>
                <h1 className="text-3xl font-bold text-slate-900">{displayUser?.name}</h1>
             </div>
             
             {/* Bio Section */}
             {displayUser?.bio && (
               <p className="text-slate-600 text-sm max-w-lg mx-auto md:mx-0 leading-relaxed font-sans">
                 {displayUser.bio}
               </p>
             )}

             <div className="flex flex-wrap justify-center md:justify-start gap-3 pt-2">
                <div className="flex items-center gap-2 bg-orange-50 text-orange-700 px-4 py-2 rounded-xl text-sm font-bold border border-orange-100">
                   <Flame className="w-4 h-4 fill-orange-500" /> {displayUser?.streak || 0} Day Streak
                </div>
                <div className="flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-xl text-sm font-bold border border-blue-100">
                   <Trophy className="w-4 h-4 fill-blue-500" /> {displayUser?.xp || 0} XP
                </div>
             </div>
           </div>
        </div>

        {/* --- TABS NAVIGATION --- */}
        <div className="flex gap-8 border-b border-slate-200 mb-8">
           <button 
             onClick={() => setActiveTab('overview')}
             className={`pb-3 text-sm font-semibold transition-all ${activeTab === 'overview' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-slate-500 hover:text-slate-800'}`}
           >
             Overview
           </button>
           <button 
             onClick={() => setActiveTab('certificates')}
             className={`pb-3 text-sm font-semibold transition-all ${activeTab === 'certificates' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-slate-500 hover:text-slate-800'}`}
           >
             Certificates <span className="ml-1 bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full text-xs">{displayUser?.certificates?.length || 0}</span>
           </button>
        </div>

        {/* --- TAB CONTENT --- */}
        {activeTab === 'overview' ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Stats & Charts */}
            <div className="lg:col-span-2 space-y-8">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <StatCard icon={Clock} label="Total Time" value={`${displayUser?.stats?.totalMinutes || 0}m`} color="text-blue-600" bg="bg-blue-50" />
                    <StatCard icon={Video} label="Videos" value={displayUser?.stats?.videosCompleted || 0} color="text-purple-600" bg="bg-purple-50" />
                    <StatCard icon={Target} label="Quizzes" value={displayUser?.stats?.quizzesPassed || 0} color="text-green-600" bg="bg-green-50" />
                    <StatCard icon={Calendar} label="Joined" value={getJoinedYear(displayUser?.createdAt)} color="text-orange-600" bg="bg-orange-50" />
                </div>

                {/* Weekly Activity Chart */}
                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                    <div className="flex justify-between items-center mb-6">
                    <h3 className="font-bold text-lg text-slate-800 flex items-center gap-2">
                        <BarChart3 className="w-5 h-5 text-slate-400" /> Weekly Activity
                    </h3>
                    <span className="text-sm text-slate-500">
                      {weeklyData.reduce((sum, d) => sum + d.count, 0)} activities this week
                    </span>
                    </div>
                    <div className="flex items-end justify-between gap-3" style={{ height: '200px' }}>
                    {weeklyData.map((d, i) => {
                        const barHeight = maxCount > 0 ? Math.max((d.count / maxCount) * 160, d.count > 0 ? 20 : 8) : 8;
                        const isToday = i === 6;
                        return (
                            <div key={d.fullDate} className="flex flex-col items-center gap-2 flex-1 group cursor-pointer">
                                <span className="text-xs font-bold text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity">
                                  {d.count}
                                </span>
                                <div className="w-full flex items-end justify-center" style={{ height: '160px' }}>
                                    <div 
                                        className={`w-full max-w-[40px] rounded-t-lg transition-all duration-500 ${
                                          isToday 
                                            ? 'bg-blue-600' 
                                            : d.count > 0 
                                              ? 'bg-blue-400 group-hover:bg-blue-500' 
                                              : 'bg-slate-200'
                                        }`}
                                        style={{ height: `${barHeight}px` }}
                                    />
                                </div>
                                <span className={`text-xs font-bold ${isToday ? 'text-blue-600' : 'text-slate-400'}`}>{d.day}</span>
                            </div>
                        );
                    })}
                    </div>
                </div>
            </div>

            {/* Active Courses Sidebar */}
            <div className="lg:col-span-1 space-y-6">
                <h3 className="font-bold text-lg text-slate-800">Active Courses</h3>
                {goals.length === 0 ? (
                    <div className="text-center p-8 bg-white rounded-2xl border border-dashed text-slate-400">
                        No active courses.
                    </div>
                ) : (
                    goals.map((goal) => (
                        <div key={goal._id} className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex gap-4 mb-3">
                                <img src={goal.thumbnail} alt="" className="w-16 h-16 rounded-lg object-cover bg-slate-100" />
                                <div className="flex-1 min-w-0">
                                    <h4 className="font-bold text-slate-800 truncate">{goal.title}</h4>
                                    <p className="text-xs text-slate-500 mt-1">{goal.completedVideos} / {goal.totalVideos} Videos</p>
                                </div>
                            </div>
                            <div className="space-y-1">
                                <div className="flex justify-between text-xs font-semibold text-slate-500">
                                    <span>Progress</span>
                                    <span>{goal.progress}%</span>
                                </div>
                                <Progress value={goal.progress} className="h-2" />
                            </div>
                        </div>
                    ))
                )}
            </div>
            </div>
        ) : (
            // --- CERTIFICATES TAB ---
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in zoom-in-95 duration-300">
                {displayUser?.certificates && displayUser.certificates.length > 0 ? (
                    displayUser.certificates.map((cert, index) => (
                    <div key={index} className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col gap-4 hover:shadow-md transition-all group">
                        {/* Image Preview */}
                        <div className="relative aspect-[1.41] bg-slate-100 rounded-lg overflow-hidden border border-slate-100">
                            <img src={cert.imageUrl} alt="Certificate" className="w-full h-full object-contain" />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                            <a 
                                href={cert.imageUrl} 
                                download={`Certificate-${cert.courseTitle.replace(/\s+/g, '-')}.png`} 
                                className="bg-white text-slate-900 px-5 py-2.5 rounded-full font-bold text-sm flex items-center gap-2 transform translate-y-2 group-hover:translate-y-0 transition-all hover:bg-slate-200"
                            >
                                <Download className="w-4 h-4" /> Download
                            </a>
                            </div>
                        </div>
                        
                        {/* Info */}
                        <div>
                            <h3 className="font-bold text-slate-900 line-clamp-1" title={cert.courseTitle}>{cert.courseTitle}</h3>
                            <div className="flex items-center gap-2 mt-2 text-xs text-slate-500">
                                <Calendar className="w-3 h-3" />
                                <span>Issued: {new Date(cert.issuedAt).toLocaleDateString()}</span>
                            </div>
                        </div>
                    </div>
                    ))
                ) : (
                    <div className="col-span-full py-24 text-center bg-white rounded-3xl border border-dashed border-slate-200">
                        <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Award className="w-8 h-8 text-slate-300" />
                        </div>
                        <h3 className="font-bold text-slate-900 text-lg">No Certificates Yet</h3>
                        <p className="text-slate-500 text-sm mt-2 max-w-sm mx-auto">
                            Complete all videos and quizzes in a course to earn your first certificate of completion!
                        </p>
                        <Button variant="outline" className="mt-6" onClick={() => navigate('/dashboard')}>
                            Explore Courses
                        </Button>
                    </div>
                )}
            </div>
        )}

        {/* --- EDIT PROFILE MODAL --- */}
        <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Edit Profile</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleUpdateProfile} className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Display Name</Label>
                <Input 
                  id="name" 
                  value={editForm.name} 
                  onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                  required 
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="avatar">Avatar URL</Label>
                <Input 
                  id="avatar" 
                  value={editForm.avatar} 
                  onChange={(e) => setEditForm({...editForm, avatar: e.target.value})}
                  placeholder="https://example.com/photo.jpg" 
                />
                <p className="text-xs text-slate-500">Paste an image URL for your profile picture.</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <textarea 
                  id="bio"
                  className="flex w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-background placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 min-h-[80px] font-sans"
                  value={editForm.bio}
                  onChange={(e) => setEditForm({...editForm, bio: e.target.value})}
                  placeholder="Tell us about yourself..."
                />
              </div>

              <DialogFooter>
                <Button type="button" variant="ghost" onClick={() => setIsEditOpen(false)}>Cancel</Button>
                <Button type="submit" disabled={updating}>
                  {updating ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : 'Save Changes'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

      </main>
    </div>
  );
};

// --- SUB-COMPONENTS ---

const StatCard = ({ icon: Icon, label, value, color, bg }) => (
    <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col items-center justify-center text-center gap-2 hover:shadow-md transition-shadow">
       <div className={`p-3 rounded-full ${bg} ${color}`}>
          <Icon className="w-5 h-5" />
       </div>
       <div>
          <div className="text-2xl font-bold text-slate-900">{value}</div>
          <div className="text-xs text-slate-500 font-medium uppercase tracking-wide">{label}</div>
       </div>
    </div>
);

const ActivityHeatmap = ({ activityLog }) => {
    const today = new Date();
    
    // Generate all dates for the past year
    const days = [];
    for (let i = 364; i >= 0; i--) {
        const d = new Date();
        d.setDate(today.getDate() - i);
        days.push(d);
    }

    // Create activity lookup map
    const logMap = {};
    if (activityLog) {
        activityLog.forEach(log => {
            logMap[log.date] = log.count;
        });
    }

    // Get color based on activity count (GitHub green theme)
    const getColor = (count) => {
        if (!count) return 'bg-slate-200';
        if (count === 1) return 'bg-green-300';
        if (count === 2) return 'bg-green-400';
        if (count === 3) return 'bg-green-500';
        return 'bg-green-600';
    };

    // Group days into weeks
    const weeks = [];
    let currentWeek = [];
    
    const firstDayOfWeek = days[0].getDay();
    for (let i = 0; i < firstDayOfWeek; i++) {
        currentWeek.push(null);
    }
    
    days.forEach((date) => {
        currentWeek.push(date);
        if (currentWeek.length === 7) {
            weeks.push(currentWeek);
            currentWeek = [];
        }
    });
    
    if (currentWeek.length > 0) {
        while (currentWeek.length < 7) currentWeek.push(null);
        weeks.push(currentWeek);
    }

    return (
        <div className="space-y-2">
            {/* Grid */}
            <div className="flex gap-1">
                {/* Day labels */}
                <div className="flex flex-col gap-1 text-[10px] text-slate-400 pr-1">
                    <span className="h-[12px]"></span>
                    <span className="h-[12px] leading-[12px]">Mon</span>
                    <span className="h-[12px]"></span>
                    <span className="h-[12px] leading-[12px]">Wed</span>
                    <span className="h-[12px]"></span>
                    <span className="h-[12px] leading-[12px]">Fri</span>
                    <span className="h-[12px]"></span>
                </div>
                
                {/* Weeks grid */}
                <div className="flex gap-[3px] overflow-x-auto">
                    {weeks.map((week, weekIndex) => (
                        <div key={weekIndex} className="flex flex-col gap-[3px]">
                            {week.map((date, dayIndex) => {
                                if (!date) {
                                    return <div key={dayIndex} className="w-[12px] h-[12px]" />;
                                }
                                const dateStr = date.toISOString().split('T')[0];
                                const count = logMap[dateStr] || 0;
                                const isToday = dateStr === today.toISOString().split('T')[0];
                                
                                return (
                                    <div 
                                        key={dateStr}
                                        title={`${dateStr}: ${count} ${count === 1 ? 'activity' : 'activities'}`}
                                        className={`w-[12px] h-[12px] rounded-sm ${getColor(count)} ${isToday ? 'ring-2 ring-blue-500' : ''} hover:ring-1 hover:ring-slate-400 cursor-pointer`}
                                    />
                                );
                            })}
                        </div>
                    ))}
                </div>
            </div>
            
            {/* Legend */}
            <div className="flex items-center justify-end gap-2 text-xs text-slate-500">
                <span>Less</span>
                <div className="flex gap-1">
                    <div className="w-[12px] h-[12px] rounded-sm bg-slate-200" />
                    <div className="w-[12px] h-[12px] rounded-sm bg-green-300" />
                    <div className="w-[12px] h-[12px] rounded-sm bg-green-400" />
                    <div className="w-[12px] h-[12px] rounded-sm bg-green-500" />
                    <div className="w-[12px] h-[12px] rounded-sm bg-green-600" />
                </div>
                <span>More</span>
            </div>
        </div>
    );
};

export default Profile;
