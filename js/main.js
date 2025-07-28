// Main Application
class AstrorekaApp {
    constructor() {
        this.currentPage = 'home';
        this.components = {};
        this.isInitialized = false;
    }

    // Initialize application
    async init() {
        if (this.isInitialized) return;
        
        try {
            // Setup event listeners
            this.setupEventListeners();
            
            // Initialize components
            await this.initializeComponents();
            
            // Setup navigation
            this.setupNavigation();
            
            // Handle direct URL access
            this.handleDirectAccess();
            
            this.isInitialized = true;
            console.log('Astroreka App initialized successfully');
            
        } catch (error) {
            console.error('Error initializing Astroreka App:', error);
        }
    }

    // Handle direct URL access
    handleDirectAccess() {
        const path = window.location.pathname;
        const currentFile = window.location.pathname.split('/').pop();
        
        // Only redirect if not already on the correct page
        if ((path === '/numerology' || path === '/numerology.html') && currentFile !== 'numerology.html') {
            window.location.href = 'numerology.html';
        }
        if ((path === '/tools' || path === '/tools.html') && currentFile !== 'tools.html') {
            window.location.href = 'tools.html';
        }
    }

    // Setup global event listeners
    setupEventListeners() {
        // Handle navigation
        document.addEventListener('click', (e) => {
            const link = e.target.closest('a[href]');
            if (link && link.href.includes(window.location.origin)) {
                // Don't intercept direct file links
                const href = link.getAttribute('href');
                if (href === 'tools.html' || href === 'numerology.html' || href === 'index.html') {
                    return; // Let browser handle these directly
                }
                
                e.preventDefault();
                this.navigateTo(link.href);
            }
        });

        // Handle logo click - go to homepage
        document.addEventListener('click', (e) => {
            const logoLink = e.target.closest('#logo a[href*="index.html"]');
            if (logoLink) {
                e.preventDefault();
                window.location.href = 'index.html';
            }
        });

        // Handle scroll to top button
        document.addEventListener('click', (e) => {
            if (e.target.closest('#scroll-to-top')) {
                e.preventDefault();
                this.scrollToTop();
            }
        });

        // Handle scroll events
        window.addEventListener('scroll', this.handleScroll.bind(this));
        
        // Handle resize events
        window.addEventListener('resize', this.handleResize.bind(this));
    }

    // Handle scroll events
    handleScroll() {
        // Update progress bar
        this.updateProgressBar();
        
        // Handle sticky header
        this.handleStickyHeader();
        
        // Handle scroll to top button
        this.handleScrollToTop();
    }

    // Update progress bar
    updateProgressBar() {
        const progressBar = document.querySelector('.header-progress-bar');
        if (!progressBar) return;

        const scrollTop = window.pageYOffset;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;
        
        progressBar.style.width = scrollPercent + '%';
    }

    // Handle sticky header
    handleStickyHeader() {
        const header = document.getElementById('header');
        if (!header) return;

        const scrollTop = window.pageYOffset;
        const threshold = 100;

        if (scrollTop > threshold) {
            header.classList.add('sticky');
        } else {
            header.classList.remove('sticky');
        }
    }

    // Handle scroll to top button
    handleScrollToTop() {
        const scrollToTopBtn = document.getElementById('scroll-to-top');
        if (!scrollToTopBtn) return;

        const scrollTop = window.pageYOffset;
        const threshold = 300;

        if (scrollTop > threshold) {
            scrollToTopBtn.classList.add('show');
        } else {
            scrollToTopBtn.classList.remove('show');
        }
    }

    // Scroll to top
    scrollToTop() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }

    // Handle resize events
    handleResize() {
        // Recalculate layouts if needed
        this.updateLayout();
    }

    // Update layout on resize
    updateLayout() {
        // Add any layout updates here
    }

    // Navigate to page
    async navigateTo(url) {
        try {
            const urlObj = new URL(url);
            const path = urlObj.pathname;
            const currentFile = window.location.pathname.split('/').pop();
            
            // Handle direct file access for standalone pages - only redirect if not already on the correct page
            if ((path === '/numerology' || path === '/numerology.html') && currentFile !== 'numerology.html') {
                window.location.href = 'numerology.html';
                return;
            }
            if ((path === '/tools' || path === '/tools.html') && currentFile !== 'tools.html') {
                window.location.href = 'tools.html';
                return;
            }
            
            // For other pages, use SPA routing
            this.currentPage = path === '/' ? 'home' : path.slice(1);
            
            // Update URL without reload
            window.history.pushState({}, '', url);
            
            // Load page content
            await this.loadPage(this.currentPage);
            
        } catch (error) {
            console.error('Navigation error:', error);
        }
    }



    // Load page content
    async loadPage(pageName) {
        const pageContent = document.getElementById('page-content');
        if (!pageContent) return;

        try {
            const pagePath = `pages/${pageName}.html`;
            const response = await fetch(pagePath);
            
            if (!response.ok) {
                throw new Error(`Page not found: ${pagePath}`);
            }
            
            const html = await response.text();
            pageContent.innerHTML = html;
            
            // Update page title
            this.updatePageTitle(pageName);
            

            
            // Scroll to top
            window.scrollTo(0, 0);
            
        } catch (error) {
            console.error(`Error loading page ${pageName}:`, error);
            pageContent.innerHTML = `<div class="error-page">
                <h2>Page Not Found</h2>
                <p>The requested page could not be loaded.</p>
                <p><a href="index.html" style="color: #A87C12; text-decoration: none;">← Quay về trang chủ</a></p>
            </div>`;
        }
    }

    // Update page title
    updatePageTitle(pageName) {
        const titles = {
            'home': 'Astroreka - Xem Thần Số Học, Bản Đồ Sao, Cung Hoàng Đạo, Bói Bài Tarot',
            'numerology': 'Thần Số Học - Astroreka',
            'tools': 'Công cụ - Astroreka',
            'knowledge': 'Kiến thức - Astroreka',
            'contact': 'Liên hệ - Astroreka'
        };
        
        document.title = titles[pageName] || 'Astroreka';
    }

    // Initialize components
    async initializeComponents() {
        // Load header component
        await this.loadHeaderComponent();
        
        // Initialize header if available
        if (window.HeaderManager) {
            this.components.header = new window.HeaderManager();
            await this.components.header.init();
        } else {
            // Fallback: Initialize mobile menu directly
            this.initializeMobileMenu();
        }
    }

    // Load header component
    async loadHeaderComponent() {
        const headerComponent = document.getElementById('header-component');
        if (headerComponent) {
            try {
                const response = await fetch('components/header.html');
                const headerHTML = await response.text();
                headerComponent.innerHTML = headerHTML;
                console.log('Header component loaded successfully');
            } catch (error) {
                console.error('Error loading header component:', error);
            }
        }
    }
    
    // Fallback mobile menu initialization
    initializeMobileMenu() {
        const mobileMenuButton = document.querySelector('[data-toggle="off-canvas"][data-target="#mobile-menu"]');
        const mobileMenu = document.getElementById('mobile-menu');
        const mobileMenuClose = document.querySelector('.mobile-menu-close');
        
        if (mobileMenuButton && mobileMenu) {
            console.log('Initializing mobile menu fallback...');
            
            // Toggle mobile menu
            mobileMenuButton.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('Mobile menu button clicked (fallback)');
                
                if (mobileMenu.classList.contains('active')) {
                    this.closeMobileMenu(mobileMenu);
                } else {
                    this.openMobileMenu(mobileMenu);
                }
            });
            
            // Close mobile menu
            if (mobileMenuClose) {
                mobileMenuClose.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.closeMobileMenu(mobileMenu);
                });
            }
            
            // Close on escape key
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && mobileMenu.classList.contains('active')) {
                    this.closeMobileMenu(mobileMenu);
                }
            });
            
            // Close when clicking outside
            document.addEventListener('click', (e) => {
                if (mobileMenu.classList.contains('active')) {
                    if (!mobileMenu.contains(e.target) && !mobileMenuButton.contains(e.target)) {
                        this.closeMobileMenu(mobileMenu);
                    }
                }
            });
        }
    }
    
    // Open mobile menu
    openMobileMenu(mobileMenu) {
        console.log('Opening mobile menu (fallback)...');
        mobileMenu.style.display = 'block';
        mobileMenu.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        setTimeout(() => {
            mobileMenu.style.opacity = '1';
        }, 10);
    }
    
    // Close mobile menu
    closeMobileMenu(mobileMenu) {
        console.log('Closing mobile menu (fallback)...');
        mobileMenu.style.opacity = '0';
        
        setTimeout(() => {
            mobileMenu.classList.remove('active');
            mobileMenu.style.display = 'none';
            document.body.style.overflow = '';
            
            // Close all submenus
            const submenus = mobileMenu.querySelectorAll('.mobile-submenu.active');
            submenus.forEach(submenu => {
                submenu.classList.remove('active');
            });
        }, 300);
    }

    // Setup navigation
    setupNavigation() {
        // Handle browser back/forward buttons
        window.addEventListener('popstate', (event) => {
            const path = window.location.pathname;
            this.currentPage = path === '/' ? 'home' : path.slice(1);
            this.loadPage(this.currentPage);
        });
    }

    // Utility methods
    showLoading() {
        const loadingEl = document.createElement('div');
        loadingEl.className = 'page-loading';
        loadingEl.innerHTML = '<div class="loading-spinner"></div>';
        document.body.appendChild(loadingEl);
    }

    hideLoading() {
        const loadingEl = document.querySelector('.page-loading');
        if (loadingEl) {
            loadingEl.remove();
        }
    }
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.astrorekaApp = new AstrorekaApp();
    window.astrorekaApp.init();
});

// Export for use in other modules
window.AstrorekaApp = AstrorekaApp; 