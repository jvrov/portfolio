class ProjectsManager {
    constructor(username) {
        this.username = username;
        this.projectsGrid = document.getElementById('projectsGrid');
        this.filterButtons = document.querySelectorAll('.filter-btn');
        this.projects = [];
        
        this.init();
    }

    async init() {
        await this.fetchProjects();
        this.setupFilters();
    }

    async fetchProjects() {
        try {
            const response = await fetch(`https://api.github.com/users/${this.username}/repos`);
            const repos = await response.json();
            
            this.projects = await Promise.all(repos.map(async repo => {
                // Fetch languages for each repo
                const languagesResponse = await fetch(repo.languages_url);
                const languages = await languagesResponse.json();

                return {
                    name: repo.name,
                    description: repo.description || 'Sem descrição disponível',
                    languages: Object.keys(languages),
                    html_url: repo.html_url,
                    homepage: repo.homepage,
                    stars: repo.stargazers_count,
                    forks: repo.forks_count
                };
            }));

            this.renderProjects(this.projects);
        } catch (error) {
            console.error('Erro ao carregar projetos:', error);
            this.showError();
        }
    }

    renderProjects(projects) {
        this.projectsGrid.innerHTML = projects.map(project => `
            <article class="project-card">
                <div class="project-content">
                    <h3 class="project-title">${project.name}</h3>
                    <p class="project-description">${project.description}</p>
                    <div class="project-tech-stack">
                        ${project.languages.map(lang => 
                            `<span class="tech-tag">${lang}</span>`
                        ).join('')}
                    </div>
                    <div class="project-links">
                        ${project.homepage ? 
                            `<a href="${project.homepage}" class="project-link demo" target="_blank">
                                <i class="fas fa-external-link-alt"></i> Demo
                            </a>` : ''
                        }
                        <a href="${project.html_url}" class="project-link code" target="_blank">
                            <i class="fab fa-github"></i> Código
                        </a>
                    </div>
                </div>
            </article>
        `).join('');
    }

    setupFilters() {
        this.filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                const filter = button.dataset.filter;
                
                // Update active button
                this.filterButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                
                // Filter projects
                const filteredProjects = filter === 'all' 
                    ? this.projects 
                    : this.projects.filter(project => 
                        project.languages.some(lang => 
                            lang.toLowerCase() === filter.toLowerCase()
                        )
                    );
                
                this.renderProjects(filteredProjects);
            });
        });
    }

    showError() {
        this.projectsGrid.innerHTML = `
            <div class="error-message">
                <i class="fas fa-exclamation-circle"></i>
                <p>Ops! Não foi possível carregar os projetos.</p>
                <button onclick="location.reload()" class="btn primary">
                    Tentar novamente
                </button>
            </div>
        `;
    }
}

// Inicialização com seu username
document.addEventListener('DOMContentLoaded', () => {
    new ProjectsManager('jvrov');
}); 