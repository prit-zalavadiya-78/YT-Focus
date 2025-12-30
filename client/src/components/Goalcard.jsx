import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { PlayCircle, Clock, CheckCircle } from 'lucide-react';

const GoalCard = ({ goal }) => {
  const navigate = useNavigate();
  
  // Calculate actual progress from videos array
  const completedVideos = goal.videos?.filter(v => v.watched)?.length || 0;
  const totalVideos = goal.totalVideos || goal.videos?.length || 1;
  
  // Show at least 1% if any videos are completed
  const displayProgress = completedVideos > 0 
    ? Math.max(Math.round((completedVideos / totalVideos) * 100), 1) 
    : 0;
  
  const hasStarted = completedVideos > 0;

  return (
    <Card className="hover:shadow-lg transition-all duration-300 border-slate-200 overflow-hidden flex flex-col h-full group">
      <div className="relative h-40 w-full overflow-hidden bg-slate-100">
        <img 
          src={goal.thumbnail || "/api/placeholder/400/320"} 
          alt={goal.title} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded-md flex items-center gap-1 backdrop-blur-sm">
           <Clock className="w-3 h-3" />
           <span>{totalVideos} Videos</span>
        </div>
        {hasStarted && (
          <div className="absolute top-2 left-2 bg-green-500 text-white text-xs px-2 py-1 rounded-md flex items-center gap-1">
             <CheckCircle className="w-3 h-3" />
             <span>{completedVideos} done</span>
          </div>
        )}
      </div>

      <CardHeader className="p-4 pb-2">
        <CardTitle className="text-lg font-bold line-clamp-2 leading-tight group-hover:text-blue-600 transition-colors">
            {goal.title}
        </CardTitle>
        <p className="text-sm text-slate-500 font-medium">
            {goal.instructor || "Unknown Instructor"}
        </p>
      </CardHeader>

      <CardContent className="p-4 pt-2 flex-1">
        <div className="flex justify-between text-xs text-slate-500 mb-2 font-medium">
            <span>Progress ({completedVideos}/{totalVideos})</span>
            <span>{displayProgress}%</span>
        </div>
        <Progress value={displayProgress} className="h-2" />
      </CardContent>

      <CardFooter className="p-4 pt-0">
        <Button 
            onClick={() => navigate(`/goals/${goal._id}`)} 
            className="w-full gap-2 font-semibold"
            variant={hasStarted ? "default" : "secondary"}
        >
            {hasStarted ? (
                <>Continue <PlayCircle className="w-4 h-4" /></>
            ) : (
                <>Start Learning</>
            )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default GoalCard;