import express from 'express';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

// Helper: Parse Duration (PT1H2M10S -> Minutes)
const parseDuration = (duration) => {
    // Handle null, undefined, or empty strings
    if (!duration || typeof duration !== 'string') return 10;
    
    const match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
    if (!match) return 10; // Return default if pattern doesn't match
    
    const hours = (parseInt(match[1]) || 0);
    const minutes = (parseInt(match[2]) || 0);
    const seconds = (parseInt(match[3]) || 0);
    return (hours * 60) + minutes + (seconds > 30 ? 1 : 0);
};

// Helper: Fetch all videos from playlist using pagination
const fetchAllPlaylistVideos = async (playlistId, apiKey) => {
    let allItems = [];
    let nextPageToken = null;
    
    do {
        const url = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet,contentDetails&playlistId=${playlistId}&maxResults=50&key=${apiKey}${nextPageToken ? `&pageToken=${nextPageToken}` : ''}`;
        
        const response = await axios.get(url);
        allItems = allItems.concat(response.data.items);
        nextPageToken = response.data.nextPageToken;
        
        console.log(`Fetched ${allItems.length} videos... ${nextPageToken ? 'getting more...' : 'done!'}`);
    } while (nextPageToken);
    
    return allItems;
};

// Helper: Fetch durations for videos (in batches of 50)
const fetchVideoDurations = async (videoIds, apiKey) => {
    const durationMap = {};
    
    // Split into batches of 50 (API limit)
    for (let i = 0; i < videoIds.length; i += 50) {
        const batch = videoIds.slice(i, i + 50);
        const idsString = batch.join(',');
        
        const response = await axios.get(`https://www.googleapis.com/youtube/v3/videos?part=contentDetails&id=${idsString}&key=${apiKey}`);
        
        response.data.items.forEach(item => {
            durationMap[item.id] = parseDuration(item.contentDetails.duration);
        });
    }
    
    return durationMap;
};

router.get('/playlist', async (req, res) => {
  const { url } = req.query;
  if (!url) return res.status(400).json({ message: 'URL is required' });

  let playlistId = null;
  try {
      if (!url.includes('youtube.com') && !url.includes('youtu.be')) playlistId = url; 
      else playlistId = new URL(url).searchParams.get('list');
  } catch (e) {
      playlistId = url.split('list=')[1]?.split('&')[0];
  }

  if (!playlistId) return res.status(400).json({ message: 'Invalid Playlist URL' });

  const API_KEY = process.env.YOUTUBE_API_KEY;

  try {
    // 1. Playlist Info
    const listRes = await axios.get(`https://www.googleapis.com/youtube/v3/playlists?part=snippet&id=${playlistId}&key=${API_KEY}`);
    const playlistInfo = listRes.data.items[0]?.snippet;

    // 2. Fetch ALL Playlist Videos (with pagination)
    console.log(`📺 Fetching all videos from playlist: ${playlistId}`);
    const allVideoItems = await fetchAllPlaylistVideos(playlistId, API_KEY);
    console.log(`✅ Total videos found: ${allVideoItems.length}`);

    // 3. Get Durations for all videos
    const videoIds = allVideoItems.map(item => item.contentDetails.videoId);
    const durationMap = await fetchVideoDurations(videoIds, API_KEY);

    const videos = allVideoItems.map(item => ({
      youtubeId: item.contentDetails.videoId,
      title: item.snippet.title,
      thumbnail: item.snippet.thumbnails?.medium?.url,
      description: item.snippet.description,
      duration: durationMap[item.contentDetails.videoId] || 10 
    }));

    res.json({
      title: playlistInfo?.title,
      instructor: playlistInfo?.channelTitle,
      thumbnail: playlistInfo?.thumbnails?.medium?.url,
      videos: videos,
      totalVideos: videos.length
    });

  } catch (error) {
    console.error('❌ YouTube API Error:', error.message);
    res.status(500).json({ message: 'Failed to fetch from YouTube' });
  }
});

export default router;