require('dotenv').config();
const axios = require('axios');

const API_URL = process.env.API_URL;
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const REQUEST_INTERVAL = parseInt(process.env.REQUEST_INTERVAL) || 1000;
const MAX_RETRIES = parseInt(process.env.MAX_RETRIES) || 3;
const RETRY_DELAYS = process.env.RETRY_DELAYS ? 
    process.env.RETRY_DELAYS.split(',').map(Number) : [1000, 3000, 5000];

let lastRequestTime = 0;
const requestQueue = [];
let isProcessing = false;
let currentModelIndex = 0;

const MODELS = [
    "deepseek/deepseek-r1:free",
    "google/gemini-2.5-flash-preview"
];

async function makeApiRequest(prompt, referer = 'localhost') {
    return enqueueRequest(prompt, referer);
}

async function enqueueRequest(prompt, referer) {
    return new Promise((resolve, reject) => {
        requestQueue.push({
            args: [prompt, referer],
            resolve,
            reject,
            timestamp: Date.now()
        });
        processQueue();
    });
}

async function processQueue() {
    if (isProcessing || requestQueue.length === 0) return;
    isProcessing = true;

    const currentRequest = requestQueue[0];

    try {
        const now = Date.now();
        const timeSinceLast = now - lastRequestTime;
        if (timeSinceLast < REQUEST_INTERVAL) {
            await new Promise(r => setTimeout(r, REQUEST_INTERVAL - timeSinceLast));
        }

        const result = await sendApiRequest(...currentRequest.args);
        currentRequest.resolve(result);
    } catch (error) {
        currentRequest.reject(error);
    } finally {
        requestQueue.shift();
        isProcessing = false;
        if (requestQueue.length > 0) {
            setTimeout(processQueue, REQUEST_INTERVAL);
        }
    }
}

async function sendApiRequest(prompt, referer, attempt = 0) {
    try {
        lastRequestTime = Date.now();

        const response = await axios.post(API_URL, {
            model: MODELS[currentModelIndex],
            messages: [{
                role: "user",
                content: prompt
            }],
            temperature: 0.7,
            max_tokens: 2000,
            top_p: 1,
            frequency_penalty: 0,
            presence_penalty: 0
        }, {
            headers: {
                'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
                'HTTP-Referer': referer,
                'X-Title': "Project Generator",
                'Content-Type': 'application/json'
            },
            timeout: 30000
        });

        const content = response.data.choices[0]?.message?.content.trim();
        if (!content) throw new Error("No content returned from API");

        return parseResponse(content);

    } catch (error) {
        console.error("API request failed: ", error);
        
        if (currentModelIndex < MODELS.length - 1) {
            currentModelIndex++;
            return sendApiRequest(...arguments, attempt);
        }
        
        if (shouldRetry(error, attempt)) {
            const delay = RETRY_DELAYS[attempt] || 5000;
            await new Promise(r => setTimeout(r, delay));
            return sendApiRequest(...arguments, attempt + 1);
        }
        
        currentModelIndex = 0;
        throw error;
    }
}

function parseResponse(content) {
    try {
        const parsed = JSON.parse(content);

        if (parsed && parsed.projects && Array.isArray(parsed.projects)) {
            return parsed.projects;
        }

        if (Array.isArray(parsed)) {
            return parsed;
        }

        throw new Error('Unexpected API response structure');
    } catch (e) {
        console.error('Parsing error:', e);
        throw new Error('Failed to parse API response');
    }
}

function shouldRetry(error, attempt) {
    return attempt < MAX_RETRIES &&
        (!error.response ||
            error.response.status === 429 ||
            error.response.status >= 500);
}

module.exports = {
    makeApiRequest
};