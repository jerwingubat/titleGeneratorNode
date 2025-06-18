const { makeApiRequest } = require('./apiClient');

async function generateProjectTitles(industry, technology, specialRequirements, projectCategory, projectType, referer) {
    const prompt = createProjectPrompt(industry, technology, specialRequirements, projectCategory, projectType);
    return makeApiRequest(prompt, referer);
}

function createProjectPrompt(industry, technology, specialRequirements, projectCategory, projectType) {
    return `
As a technical project advisor, generate 2 ${projectCategory} master's degree worthy project titles for ${projectType} with complete specifications in JSON format.

- Industry: ${industry}
- Technologies: ${technology || 'Not specified'}
- Requirements: ${specialRequirements || 'None'}

For each project provide:
1. title: Master's Degree worthy Research title (string)
2. description: 2-sentence description (string)
3. technologies: Primary technologies needed (string)
4. objectives: 5 technical objectives with sub-bullets each (array of strings)
5. technical_features: 5 key technical features (array of strings)

Return ONLY valid JSON following this EXACT structure:
{
  "projects": [
    {
      "title": "Project Title 1",
      "description": "Brief description",
      "technologies": "Tech stack",
      "objectives": ["obj1", "obj2", "obj3"],
      "technical_features": ["feature1", "feature2", "feature3"]
    },
    {
      "title": "Project Title 2",
      "description": "Brief description",
      "technologies": "Tech stack",
      "objectives": ["obj1", "obj2", "obj3"],
      "technical_features": ["feature1", "feature2", "feature3"]
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
    generateProjectTitles
};