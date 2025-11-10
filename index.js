import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
//import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;


app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const genai = new GoogleGenAI (process.env.GEMINI_API_KEY);
const model = "gemini-2.5-flash";

app.post('/api/chat', async (req, res) => {
    const userMessage = req.body.message;

    if (!userMessage){
        return res.status(400).json({ reply: "Message is required"});
    }
    
    try {
        const result = await model.generateContent(userMessage);
        const response = await result.response;
        const text = response.text();

        res.json({ reply: text});
    } catch (error) { 
        console.log(error);
        res.status(500).json({ error: "Something went wrong"});
    }

    } );
        

app.listen(PORT, () => console.log(`server ready on http://localhost:${PORT}`));
