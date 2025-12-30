import React, { useState } from 'react';
import api from '../services/api';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Loader2, Link as LinkIcon } from 'lucide-react';

const CreateGoalModal = ({ isOpen, onClose, onGoalCreated }) => {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // 1. Fetch Playlist Data
      const youtubeRes = await api.get(`/youtube/playlist?url=${encodeURIComponent(url)}`);
      const { title, videos, thumbnail, instructor } = youtubeRes.data;

      // 2. Create Goal
      await api.post('/goals', {
        title,
        playlistUrl: url,
        videos,
        thumbnail,
        instructor
      });

      onGoalCreated();
      onClose();
      setUrl('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to import playlist');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Import New Playlist</DialogTitle>
          <DialogDescription>
            Paste a YouTube playlist URL to create a distraction-free course.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
           <div className="space-y-2">
             <Label htmlFor="url">YouTube Playlist URL</Label>
             <div className="relative">
                <LinkIcon className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <Input 
                  id="url"
                  placeholder="https://www.youtube.com/playlist?list=..." 
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="pl-9"
                  required
                />
             </div>
           </div>
           
           {error && (
             <p className="text-sm text-red-500 font-medium bg-red-50 p-2 rounded border border-red-100">
                {error}
             </p>
           )}

           <DialogFooter>
             <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
             <Button type="submit" disabled={loading}>
                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Import Playlist'}
             </Button>
           </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateGoalModal;