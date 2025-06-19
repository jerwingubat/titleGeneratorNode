document.addEventListener("DOMContentLoaded", function () {
    document.getElementById('changeTopicBtn').addEventListener("click", function () {
        window.location.href = "research.html";
    });
    const generateBtn = document.getElementById('generateBtn');
    const retryBtn = document.getElementById('retryBtn');
    const cancelBtn = document.getElementById('cancelBtn');

    if (generateBtn) generateBtn.addEventListener('click', generateTitles);
    if (retryBtn) retryBtn.addEventListener('click', generateTitles);
    if (cancelBtn) cancelBtn.addEventListener('click', resetUI);

    const resultsPlaceholder = document.getElementById('resultsPlaceholder');
    const resultsContent = document.getElementById('resultsContent');
    const loading = document.getElementById('loading');
    const errorBox = document.getElementById('errorBox');


    const industryInput = document.getElementById('industry');
    const technologyInput = document.getElementById('technology');
    const requirementsInput = document.getElementById('specialRequirements');
    const projectTypeSelect = document.getElementById('projectType');


    async function generateTitles() {
        const projectCategory = document.querySelector('input[name="projectCategory"]:checked').value;
        const inputs = {
            industry: document.getElementById('industry').value.trim(),
            technology: document.getElementById('technology').value.trim(),
            specialRequirements: document.getElementById('specialRequirements').value.trim(),
            projectCategory: projectCategory,
            projectType: document.getElementById('projectType').value
        };
        if (!inputs.industry) {
            showError('Industry field is required.');
            return;
        }


        setLoadingState(true);
        hideError();

        try {
            const response = await fetch('/api/project-titles', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(inputs)
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to generate titles');
            }
            if (data.success && data.titles) {
                displayTitles(data.titles, inputs.projectCategory);
            } else {
                throw new Error('Invalid response format');
            }
        } catch (error) {
            console.error('Error:', error);
            showError(error.message || 'An error occurred while generating titles');
        } finally {
            setLoadingState(false);
        }
    }


    function getInputValues() {
        const projectCategory = document.querySelector('input[name="projectCategory"]:checked').value;

        return {
            industry: industryInput.value.trim(),
            technology: technologyInput.value.trim(),
            specialRequirements: requirementsInput.value.trim(),
            projectCategory: projectCategory,
            projectType: projectTypeSelect.value
        }
    }

    function displayTitles(titles, projectCategory) {
        try {
            const resultsContent = document.getElementById('resultsContent');
            resultsContent.innerHTML = '';
            resultsContent.style.display = 'block';

            if (!titles || !Array.isArray(titles)) {
                throw new Error('Invalid titles data');
            }

            titles.forEach((title, index) => {
                const titleBox = document.createElement('div');
                titleBox.className = 'title-box';
                titleBox.style.animationDelay = `${index * 0.1}s`;

                const safeTitle = title.title || 'Untitled Project';
                const safeDesc = title.description || 'No description available';
                const safeTech = title.technologies || 'No technologies specified';
                const safeObjectives = Array.isArray(title.objectives) ? title.objectives : ['No objectives specified'];
                const safeFeatures = Array.isArray(title.technical_features) ? title.technical_features : ['No features specified'];

                const typeBadge = document.createElement('span');
                typeBadge.className = `title-type ${projectCategory.toLowerCase()}`;
                typeBadge.textContent = projectCategory;
                titleBox.appendChild(typeBadge);

                titleBox.appendChild(createElementWithText('div', 'title', safeTitle));
                titleBox.appendChild(createElementWithText('p', 'description', safeDesc));

                titleBox.appendChild(
                    createTechnicalSection(
                        'objectives',
                        'fas fa-bullseye',
                        'Technical Objectives',
                        safeObjectives,
                        true
                    )
                );

                titleBox.appendChild(
                    createTechnicalSection(
                        'features',
                        'fas fa-cogs',
                        'Technical Features',
                        safeFeatures,
                        false
                    )
                );

                const details = document.createElement('div');
                details.className = 'title-details';
                details.appendChild(createDetailItem(
                    'fas fa-microchip',
                    'Technologies',
                    safeTech
                ));
                titleBox.appendChild(details);

                resultsContent.appendChild(titleBox); 
            });
            console.log('Titles generated successfully:', titles);
        } catch (error) {
            console.error('Error displaying titles:', error);
            showError(error.message || 'An error occurred while displaying titles');
        }


    }

    function createElementWithText(tag, className, text) {
        const el = document.createElement(tag);
        el.className = className;
        el.textContent = text;
        return el;
    }

    function createTechnicalSection(type, icon, title, items, isOrdered) {
        const section = document.createElement('div');
        section.className = `spec-section ${type}`;

        const header = document.createElement('div');
        header.className = 'section-header';
        header.innerHTML = `<i class="${icon}"></i><h4>${title}</h4>`;

        const list = document.createElement(isOrdered ? 'ol' : 'ul');
        list.className = 'spec-list';

        items.forEach((item, i) => {
            const li = document.createElement('li');
            li.style.setProperty('--animation-order', i);
            li.innerHTML = isOrdered
                ? `<span class="spec-number">${i + 1}.</span><span class="spec-text">${item}</span>`
                : `<span class="spec-icon">⚙️</span><span class="spec-text">${item}</span>`;
            list.appendChild(li);
        });

        section.appendChild(header);
        section.appendChild(list);
        return section;
    }

    function createDetailItem(icon, label, value) {
        const item = document.createElement('div');
        item.className = 'detail-item';
        item.innerHTML = `<i class="${icon}"></i> <strong>${label}:</strong> ${value}`;
        return item;
    }

    function setLoadingState(isLoading) {
        if (isLoading) {
            resultsPlaceholder.style.display = 'none';
            resultsContent.style.display = 'none';
            loading.style.display = 'flex';
        } else {
            loading.style.display = 'none';
        }
        generateBtn.disabled = isLoading;
    }

    function hideError() {
        errorBox.style.display = 'none';
    }

    function resetUI() {
        const resultsPlaceholder = document.getElementById('resultsPlaceholder');
        const resultsContent = document.getElementById('resultsContent');
        const errorBox = document.getElementById('errorBox');
        const loading = document.getElementById('loading');
        const generateBtn = document.getElementById('generateBtn') || document.getElementById('generateBtn');

        if (generateBtn) generateBtn.disabled = false;
        if (loading) loading.style.display = 'none';
        if (errorBox) errorBox.style.display = 'none';
        if (resultsPlaceholder) resultsPlaceholder.style.display = 'block';
        if (resultsContent) {
            resultsContent.style.display = 'none';
            resultsContent.innerHTML = '';
        }
    }

    function setLoadingState(isLoading) {
        if (isLoading) {
            resultsPlaceholder.style.display = 'none';
            resultsContent.style.display = 'none';
            loading.style.display = 'flex';
        } else {
            loading.style.display = 'none';
        }
        generateBtn.disabled = isLoading;
    }

    function showError(message) {
        errorBox.querySelector('.error-title').textContent = message.split('.')[0];
        errorBox.querySelector('p').textContent = message;
        errorBox.style.display = 'block';
    }

});


