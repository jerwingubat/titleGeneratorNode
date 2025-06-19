document.addEventListener("DOMContentLoaded",function(){
    document.getElementById('changeTopicBtn').addEventListener("click",function(){
        window.location.href = "/";
    });
});


async function generateTitles() {
    const inputs = {
        course: document.getElementById('course').value.trim(),
        topic: document.getElementById('topic').value.trim()
    };

    const generateBtn = document.getElementById('adviseBtn') || document.getElementById('generateBtn');
    const resultsPlaceholder = document.getElementById('resultsPlaceholder');
    const resultsContent = document.getElementById('resultsContent');
    const loading = document.getElementById('loading');
    const errorBox = document.getElementById('errorBox');

    generateBtn.disabled = true;
    loading.style.display = 'flex';
    resultsPlaceholder.style.display = 'none';
    resultsContent.style.display = 'none';
    errorBox.style.display = 'none';

    try {
        const response = await fetch('/api/research-titles', {
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
            displayTitles(data.titles, inputs.course || inputs.projectCategory);
        } else {
            throw new Error('Invalid response format');
        }
    } catch (error) {
        console.error('Error:', error);
        showError(error.message || 'An error occurred while generating titles');
    } finally {
        generateBtn.disabled = false;
        loading.style.display = 'none';
    }
}

function displayTitles(titles, category) {
    const resultsContent = document.getElementById('resultsContent');
    resultsContent.innerHTML = '';

    if (!titles || !Array.isArray(titles)) {
        throw new Error('Invalid titles data');
    }

    titles.forEach((title, index) => {
        if (!title || typeof title !== 'object') return;

        const titleBox = document.createElement('div');
        titleBox.className = 'title-box';
        titleBox.style.animationDelay = `${index * 0.1}s`;

        const typeBadge = document.createElement('span');
        typeBadge.className = `title-type ${category.toLowerCase()}`;
        typeBadge.textContent = category;
        titleBox.appendChild(typeBadge);

        const titleElement = document.createElement('div');
        titleElement.className = 'title';
        titleElement.textContent = title.title || 'Untitled Project';
        titleBox.appendChild(titleElement);

        const descElement = document.createElement('p');
        descElement.className = 'description';
        descElement.textContent = title.description || 'No description available';
        titleBox.appendChild(descElement);

        if (title.objectives && title.objectives.length > 0) {
            titleBox.appendChild(createListSection('objectives', 'fas fa-bullseye', 'Objectives', title.objectives, true));
        }

        if (title.technical_features && title.technical_features.length > 0) {
            titleBox.appendChild(createListSection('features', 'fas fa-cogs', 'Technical Features', title.technical_features, false));
        }

        if (title.technologies) {
            const techElement = document.createElement('div');
            techElement.className = 'detail-item';
            techElement.innerHTML = `<i class="fas fa-microchip"></i> <strong>Technologies:</strong> ${title.technologies}`;
            titleBox.appendChild(techElement);
        }

        resultsContent.appendChild(titleBox);
    });

    resultsContent.style.display = 'block';
}

function createListSection(type, icon, title, items, isOrdered) {
    const section = document.createElement('div');
    section.className = `spec-section ${type}`;

    const header = document.createElement('div');
    header.className = 'section-header';
    header.innerHTML = `<i class="${icon}"></i><h4>${title}</h4>`;
    section.appendChild(header);

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

    section.appendChild(list);
    return section;
}

function showError(message) {
    const errorBox = document.getElementById('errorBox');
    if (!errorBox) return;

    const errorTitle = errorBox.querySelector('.error-title') || errorBox.querySelector('h3');
    const errorMessage = errorBox.querySelector('p');

    if (errorTitle) errorTitle.textContent = message.split('.')[0];
    if (errorMessage) errorMessage.textContent = message;
    errorBox.style.display = 'block';
}

document.addEventListener('DOMContentLoaded', function () {
    const generateBtn = document.getElementById('adviseBtn') || document.getElementById('generateBtn');
    const retryBtn = document.getElementById('retryBtn');
    const cancelBtn = document.getElementById('cancelBtn');

    if (generateBtn) generateBtn.addEventListener('click', generateTitles);
    if (retryBtn) retryBtn.addEventListener('click', generateTitles);
    if (cancelBtn) cancelBtn.addEventListener('click', resetUI);
});

function resetUI() {
    const resultsPlaceholder = document.getElementById('resultsPlaceholder');
    const resultsContent = document.getElementById('resultsContent');
    const errorBox = document.getElementById('errorBox');
    const loading = document.getElementById('loading');
    const generateBtn = document.getElementById('adviseBtn') || document.getElementById('generateBtn');

    if (generateBtn) generateBtn.disabled = false;
    if (loading) loading.style.display = 'none';
    if (errorBox) errorBox.style.display = 'none';
    if (resultsPlaceholder) resultsPlaceholder.style.display = 'block';
    if (resultsContent) {
        resultsContent.style.display = 'none';
        resultsContent.innerHTML = '';
    }
}