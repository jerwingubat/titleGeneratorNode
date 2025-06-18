const { makeApiRequest } = require('./apiClient');

async function generateResearchTitles(course, topic, referer) {
    const prompt = createResearchPrompt(course, topic);
    return makeApiRequest(prompt, referer);
}

function createResearchPrompt(course, topic) {
    return `
You are a research adviser. The student is enrolled in ${course} and has submitted the following research topic:

"${topic}"

Please provide:
1. title: Master's Degree worthy Research title (string)
2. description: 2-sentence description (string)
3. objectives: 5 objectives with sub-bullets each (array of strings)

Return ONLY a valid JSON following this EXACT structure:
{
"projects": [
{
  "title": "Project Title 1",
  "description": "Brief description",
  "objectives": ["obj1", "obj2", "obj3"]
},
{
  "title": "Project Title 2",
  "description": "Brief description",
  "objectives": ["obj1", "obj2", "obj3"]
}
]
}

IMPORTANT:
1. Do not include any text outside the JSON structure
2. Ensure all quotes are double quotes
3. Do not use markdown or code blocks
4. Include exactly 2 projects in the array`;
}

module.exports = {
    generateResearchTitles
};