import React, { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import api from '../services/api';
import Navbar from '../components/Navbar';
import GoalCard from '../components/Goalcard';
import CreateGoalModal from '../components/CreateGoalModal';
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useAuth } from '../context/AuthContext'; // 1. Import useAuth

const Dashboard = () => {
  const { user } = useAuth(); // 2. Get user from context
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchGoals();
  }, []);

  const fetchGoals = async () => {
    try {
      const { data } = await api.get('/goals');
      setGoals(data);
    } catch (error) {
      console.error("Failed to load goals");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50">
      <Navbar user={user} /> {/* 3. Pass the user prop here! */}
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10">
           <div>
             <h1 className="text-3xl font-bold tracking-tight text-slate-900">My Learning</h1>
             <p className="text-slate-500 mt-1">Track your progress and stay focused.</p>
           </div>
           <Button onClick={() => setIsModalOpen(true)} size="lg" className="shadow-md">
             <Plus className="w-4 h-4 mr-2" /> New Goal
           </Button>
        </div>

        {/* Content Section */}
        {loading ? (
           <div className="flex h-64 items-center justify-center">
             <Loader2 className="animate-spin text-primary w-8 h-8" />
           </div>
        ) : goals.length > 0 ? (
           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
             {goals.map((goal) => (
               <GoalCard key={goal._id} goal={goal} />
             ))}
           </div>
        ) : (
           <div className="text-center py-20 bg-white rounded-xl border border-dashed border-slate-300">
             <div className="bg-slate-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Plus className="w-8 h-8 text-slate-400" />
             </div>
             <h3 className="text-lg font-medium text-slate-900">No goals yet</h3>
             <p className="text-slate-500 mb-6 max-w-sm mx-auto">
               Import a YouTube playlist to generate your first distraction-free course.
             </p>
             <Button variant="outline" onClick={() => setIsModalOpen(true)}>
               Create your first goal
             </Button>
           </div>
        )}
      </main>

      <CreateGoalModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onGoalCreated={fetchGoals} 
      />
    </div>
  );
};

export default Dashboard;