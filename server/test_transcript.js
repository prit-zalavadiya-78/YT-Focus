import { YoutubeTranscript } from 'youtube-transcript';

async function test() {
    const videoId = 'M7lc1UVf-VE'; // YouTube Developers video
    console.log(`Fetching transcript for video ID: ${videoId}`);
    try {
        const transcript = await YoutubeTranscript.fetchTranscript(videoId);
        console.log(`Success! Found ${transcript.length} lines.`);
        if (transcript.length > 0) {
            console.log("First line:", transcript[0].text);
        } else {
            console.log("Transcript array is empty.");
        }
    } catch (e) {
        console.error("Error fetching transcript:", e);
    }
}

test();
