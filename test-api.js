require('dotenv').config();
const axios = require('axios');

console.log('API Key present:', !!process.env.OPENROUTER_API_KEY);
console.log('API URL:', process.env.API_URL);

async function testAPI() {
    try {
        const response = await axios.post(process.env.API_URL, {
            model: "deepseek/deepseek-r1:free",
            messages: [{
                role: "user",
                content: "Hello"
            }],
            temperature: 0.7,
            max_tokens: 100
        }, {
            headers: {
                'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
                'HTTP-Referer': 'localhost',
                'X-Title': "Project Generator",
                'Content-Type': 'application/json'
            },
            timeout: 10000
        });
        
        console.log('API test successful!');
        console.log('Response:', response.data.choices[0]?.message?.content);
    } catch (error) {
        console.error('API test failed:');
        console.error('Status:', error.response?.status);
        console.error('Message:', error.response?.data?.error?.message || error.message);
    }
}

testAPI(); 