// Loading Screen Management
class LoadingManager {
    constructor() {
        this.loadingScreen = document.getElementById('loading-screen');
        this.mainContent = document.getElementById('main-content');
        this.isLoading = true;
    }

    // Initialize loading
    init() {
        this.showLoading();
        this.simulateLoading();
    }

    // Show loading screen
    showLoading() {
        this.loadingScreen.style.display = 'flex';
        this.mainContent.style.display = 'none';
        this.isLoading = true;
    }

    // Hide loading screen
    hideLoading() {
        this.loadingScreen.classList.add('fade-out');
        
        setTimeout(() => {
            this.loadingScreen.style.display = 'none';
            this.mainContent.style.display = 'block';
            
            setTimeout(() => {
                this.mainContent.classList.add('show');
            }, 100);
            
            this.isLoading = false;
        }, 500);
    }

    // Simulate loading time
    simulateLoading() {
        // Minimum loading time
        const minLoadingTime = 2000;
        const startTime = Date.now();

        // Load components
        this.loadComponents().then(() => {
            const elapsedTime = Date.now() - startTime;
            const remainingTime = Math.max(0, minLoadingTime - elapsedTime);

            setTimeout(() => {
                this.hideLoading();
            }, remainingTime);
        });
    }

    // Load all components
    async loadComponents() {
        try {
            // Load header
            await this.loadComponent('header-component', 'components/header.html');
            
            // Load page content
            await this.loadComponent('page-content', 'pages/home.html');
            
            // Initialize header functionality
            if (window.HeaderManager) {
                new window.HeaderManager().init();
            }
            
        } catch (error) {
            console.error('Error loading components:', error);
        }
    }

    // Load individual component
    async loadComponent(containerId, componentPath) {
        const container = document.getElementById(containerId);
        if (!container) return;

        try {
            const response = await fetch(componentPath);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const html = await response.text();
            container.innerHTML = html;
            
            // Load images with lazy loading
            this.setupLazyLoading(container);
            
        } catch (error) {
            console.error(`Error loading ${componentPath}:`, error);
            container.innerHTML = `<p>Error loading component: ${componentPath}</p>`;
        }
    }

    // Setup lazy loading for images
    setupLazyLoading(container) {
        const images = container.querySelectorAll('img[data-src]');
        
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    observer.unobserve(img);
                }
            });
        });

        images.forEach(img => imageObserver.observe(img));
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const loadingManager = new LoadingManager();
    loadingManager.init();
}); 