import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Loader2, AlertTriangle, Zap, FileText, CheckCircle, ChevronRight } from 'lucide-react';

// Components
import Navbar from '../components/Navbar';
import VideoPlayer from '../components/VideoPlayer';
import RoadmapView from '../components/RoadmapView';
import QuizModal from '../components/QuizModal';
import NotesEditor from '../components/NotesEditor';
import ConfettiManager from '../components/ConfettiManager';
import Flashcard from '../components/Flashcard'; 

import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const GoalDetail = () => {
  const { id } = useParams(); 
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [goal, setGoal] = useState(null);
  const [currentVideo, setCurrentVideo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('notes');
  const [flashcards, setFlashcards] = useState([]);
  const [flashcardLoading, setFlashcardLoading] = useState(false);
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizLoading, setQuizLoading] = useState(false);
  const [currentQuiz, setCurrentQuiz] = useState([]);
  const [triggerConfetti, setTriggerConfetti] = useState(false);

  useEffect(() => {
    const fetchGoal = async () => {
      try {
        const { data } = await api.get(`/goals/${id}`);
        setGoal(data);
        const activeVid = data.videos.find(v => v.isCurrent) || data.videos[0];
        setCurrentVideo(activeVid);
      } catch (error) {
        console.error("Error fetching goal", error);
      } finally {
        setLoading(false);
      }
    };
    fetchGoal();
  }, [id]);

  const handleVideoComplete = async () => {
    if (!currentVideo) return;
    if (currentVideo.watched) {
      handleNextVideo();
      return;
    }
    setQuizLoading(true);
    setShowQuiz(true);
    try {
        const { data } = await api.post('/ai/quiz', {
            videoTitle: currentVideo.title,
            description: "Coding tutorial" 
        });
        setCurrentQuiz(data);
    } catch (error) {
        console.error("Quiz Error:", error);
        const errorMsg = error.response?.data?.message || "Error loading quiz";
        setCurrentQuiz([{ question: errorMsg, options: ["Try Again"], correctAnswer: "Try Again" }]);
    } finally {
        setQuizLoading(false); 
    }
  };

  const handleNextVideo = () => {
    if (!goal || !currentVideo) return;
    const currentIndex = goal.videos.findIndex(v => v._id === currentVideo._id);
    if (currentIndex !== -1 && currentIndex < goal.videos.length - 1) {
      const nextVid = goal.videos[currentIndex + 1];
      setCurrentVideo(nextVid);
      setFlashcards([]);
    }
  };

  const handleLevelUp = async () => {
    setTriggerConfetti(true);
    try {
        const { data } = await api.patch(`/goals/${goal._id}/progress`, { videoId: currentVideo._id });

        setGoal(data);
        const nextVid = data.videos.find(v => v.isCurrent);
        if (nextVid) {
            setCurrentVideo(nextVid);
            setFlashcards([]);
        }
    } catch (error) { 
        console.error(error); 
    }
  };

  const handleGenerateFlashcards = async () => {
    setFlashcardLoading(true);
    try {
      const { data } = await api.post('/ai/flashcards', {
        videoTitle: currentVideo.title,
        description: "Coding tutorial" 
      });
      setFlashcards(data);
    } catch (error) {
      console.error(error);
    } finally {
      setFlashcardLoading(false);
    }
  };

  const handleSaveNotes = async (notesContent) => {
    if (!currentVideo || !goal) return;
    try {
      await api.patch(`/goals/${goal._id}/notes`, {
        videoId: currentVideo._id,
        notes: notesContent
      });
      setGoal(prev => ({
        ...prev,
        videos: prev.videos.map(v => 
          v._id === currentVideo._id ? { ...v, notes: notesContent } : v
        )
      }));
    } catch (error) {
      console.error('Failed to save notes:', error);
    }
  };


  if (loading) return <Loader2 className="animate-spin w-8 h-8 m-auto text-blue-600"/>;
  if (!goal) return <div>Goal not found</div>;

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar user={user} />
      <ConfettiManager trigger={triggerConfetti} setTrigger={setTriggerConfetti} />

      <div className="max-w-7xl mx-auto px-4 py-6">
        <button onClick={() => navigate('/dashboard')} className="flex items-center gap-2 text-slate-500 mb-6">
          <ArrowLeft className="w-5 h-5" /> Back
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-black rounded-2xl overflow-hidden shadow-2xl aspect-video">
               {currentVideo?.youtubeId ? (
                   <VideoPlayer url={`https://www.youtube.com/watch?v=${currentVideo.youtubeId}`} onComplete={handleVideoComplete}/>
               ) : <div className="text-white p-10">Video Unavailable</div>}
            </div>

            <div className="bg-white p-6 rounded-2xl border flex justify-between items-center">
              <div>
                <h1 className="text-xl font-bold">{currentVideo?.title}</h1>
                <span className="text-sm text-slate-500">{goal.completedVideos} / {goal.totalVideos} Completed</span>
              </div>
              <button onClick={handleVideoComplete} className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold flex gap-2">
                {currentVideo?.watched ? <>Next <ChevronRight/></> : <>Complete <CheckCircle/></>}
              </button>
            </div>

            <div className="bg-white rounded-2xl border overflow-hidden min-h-[400px] flex flex-col">
              <div className="flex border-b">
                <button onClick={() => setActiveTab('notes')} className={`flex-1 py-4 font-bold ${activeTab === 'notes' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-slate-500'}`}>Notes</button>
                <button onClick={() => setActiveTab('flashcards')} className={`flex-1 py-4 font-bold ${activeTab === 'flashcards' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-slate-500'}`}>Flashcards</button>
              </div>

              <div className="flex-1 bg-slate-50/50 p-6">
                {activeTab === 'notes' ? (
                   <NotesEditor note={currentVideo?.notes || ""} onSave={handleSaveNotes} />
                ) : (
                   <div className="flex flex-col items-center">
                      {flashcards.length === 0 ? (
                        <div className="text-center py-12">
                           <Zap className="w-12 h-12 text-amber-500 mx-auto mb-4" />
                           <h3 className="font-bold text-xl mb-2">Study Mode</h3>
                           <button onClick={handleGenerateFlashcards} disabled={flashcardLoading} className="bg-slate-900 text-white px-8 py-3 rounded-xl font-bold">
                             {flashcardLoading ? "Generating..." : "Generate AI Flashcards"}
                           </button>
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
                           {flashcards.map((c, i) => <Flashcard key={i} index={i} front={c.front} back={c.back} />)}
                        </div>
                      )}
                   </div>
                )}
              </div>
            </div>
          </div>
          
          <div className="lg:col-span-1">
             <RoadmapView videos={goal.videos} currentVideoId={currentVideo?._id} onVideoSelect={(id) => setCurrentVideo(goal.videos.find(v => v._id === id))} />
          </div>
        </div>
      </div>
      <QuizModal isOpen={showQuiz} onClose={() => setShowQuiz(false)} onPass={handleLevelUp} questions={currentQuiz} loading={quizLoading} />
    </div>
  );
};

export default GoalDetail;
