const express = require('express');
const router = express.Router();
const { generateResearchTitles } = require('../lib/researchGenerator');
const { generateProjectTitles } = require('../lib/projectGenerator');

router.post('/research-titles', async (req, res) => {
    try {
        const { course, topic } = req.body;
        if (!course || !topic) {
            return res.status(400).json({ error: 'Course and topic are required' });
        }

        const titles = await generateResearchTitles(course, topic, req.headers.host);
        res.json({ success: true, titles });
    } catch (error) {
        console.error("Error generating research titles:", error);
        res.status(500).json({
            success: false,
            error: error.message || 'Failed to generate research titles'
        });
    }
});

router.post('/project-titles', async (req, res) => {
    try {
        const { industry, technology, specialRequirements, projectCategory, projectType } = req.body;
        if (!industry) {
            return res.status(400).json({ error: 'Industry is required' });
        }

        const titles = await generateProjectTitles(
            industry,
            technology,
            specialRequirements,
            projectCategory,
            projectType,
            req.headers.host
        );
        res.json({ success: true, titles });
    } catch (error) {
        console.error("Error generating project titles:", error);
        res.status(500).json({
            success: false,
            error: error.message || 'Failed to generate project titles'
        });
    }
});

module.exports = router;