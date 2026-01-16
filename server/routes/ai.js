import express from 'express';
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from 'dotenv';

dotenv.config();
const router = express.Router();
// Helper function to extract JSON array from text
const cleanAndParseJSON = (text) => {
  try {
    // 1. Remove markdown code blocks (e.g., ```json ... ```)
    let cleanText = text.replace(/```\w*\n?/g, '').replace(/```/g, '').trim();
    
    // 2. Find the first '[' and last ']' to extract the array
    const firstBracket = cleanText.indexOf('[');
    const lastBracket = cleanText.lastIndexOf(']');
    
    if (firstBracket !== -1 && lastBracket !== -1) {
      cleanText = cleanText.substring(firstBracket, lastBracket + 1);
    }

    return JSON.parse(cleanText);
  } catch (e) {
    console.error("JSON Parse Error:", e);
    throw new Error("AI response was not valid JSON");
  }
};

// ==========================================
// 1. QUIZ GENERATION
// ==========================================
router.post('/quiz', async (req, res) => {
  const { videoTitle, description } = req.body;
  
  console.log(`\n📢 Generating Quiz for: ${videoTitle}`);

  try {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error("MISSING API KEY in .env file");
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    
    // ✅ CHANGED MODEL TO 'gemini-pro' (Most Stable)
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });

    const prompt = `
      You are a Senior Technical Interviewer. 
      Video: "${videoTitle}" (${description ? description.substring(0, 1000) : ''}...).
      
      Task: Create 3 HARD multiple choice questions.
      Output: PURE JSON Array only. No markdown.
      
      Requirements:
      1. 'options' must be an array of 4 distinct strings.
      2. 'correctAnswer' must be an EXACT copy of one of the strings from 'options'.
      3. Do NOT prefix options with "A)", "1.", etc. just the text.

      Example Format:
      [
        { 
          "question": "What is the complexity of binary search?", 
          "options": ["O(n)", "O(log n)", "O(1)", "O(n^2)"], 
          "correctAnswer": "O(log n)" 
        }
      ]
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    console.log("✅ AI Replied:", text.substring(0, 50) + "...");

    const quizData = cleanAndParseJSON(text);
    res.json(quizData);

  } catch (error) {
    console.error("❌ QUIZ ERROR:", error.message);
    res.status(500).json({ 
      error: true,
      message: error.message || 'Failed to generate quiz'
    });
  }
});

// ==========================================
// 2. FLASHCARD GENERATION
// ==========================================
router.post('/flashcards', async (req, res) => {
  const { videoTitle, description } = req.body;

  console.log(`\n📢 Generating Flashcards for: ${videoTitle}`);

  try {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error("MISSING API KEY in .env file");
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    
    // ✅ CHANGED MODEL TO 'gemini-pro' (Most Stable)
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });

    const prompt = `
      You are an Expert Mentor.
      Topic: "${videoTitle}".
      Task: Create 5 ADVANCED flashcards.
      Output: PURE JSON Array only.
      Format: [{ "front": "Question", "back": "Answer" }]
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    console.log("✅ AI Replied:", text.substring(0, 50) + "...");

    const flashcards = cleanAndParseJSON(text);
    res.json(flashcards);

  } catch (error) {
    console.error("❌ FLASHCARD ERROR:", error.message);
    res.status(500).json({ 
      error: true,
      message: error.message || 'Failed to generate flashcards'
    });
  }
});

export default router;
