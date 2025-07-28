// Header Manager
class HeaderManager {
    constructor() {
        this.header = null;
        this.mobileMenu = null;
        this.mobileMenuButton = null;
        this.mobileMenuClose = null;
        this.submenuToggles = [];
        this.isInitialized = false;
    }

    // Initialize header
    async init() {
        if (this.isInitialized) return;

        try {
            // Wait for header to be loaded
            await this.waitForHeader();
            
            // Setup elements
            this.setupElements();
            
            // Setup event listeners
            this.setupEventListeners();
            
            // Setup mobile menu
            this.setupMobileMenu();
            
            // Setup dropdown menus
            this.setupDropdownMenus();
            

            
            this.isInitialized = true;
            console.log('Header Manager initialized successfully');
            
        } catch (error) {
            console.error('Error initializing Header Manager:', error);
        }
    }

    // Wait for header to be loaded
    async waitForHeader() {
        return new Promise((resolve) => {
            const checkHeader = () => {
                const header = document.getElementById('header');
                if (header) {
                    resolve();
                } else {
                    setTimeout(checkHeader, 100);
                }
            };
            checkHeader();
        });
    }

    // Setup header elements
    setupElements() {
        this.header = document.getElementById('header');
        this.mobileMenu = document.getElementById('mobile-menu');
        this.mobileMenuButton = document.querySelector('[data-toggle="off-canvas"][data-target="#mobile-menu"]');
        this.mobileMenuClose = document.querySelector('.mobile-menu-close');
    }

    // Setup event listeners
    setupEventListeners() {
        // Mobile menu toggle
        if (this.mobileMenuButton) {
            console.log('Mobile menu button found:', this.mobileMenuButton);
            this.mobileMenuButton.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('Mobile menu button clicked');
                this.toggleMobileMenu();
            });
        }

        // Mobile menu close
        if (this.mobileMenuClose) {
            this.mobileMenuClose.addEventListener('click', (e) => {
                e.preventDefault();
                this.closeMobileMenu();
            });
        }

        // Close mobile menu when clicking outside
        document.addEventListener('click', (e) => {
            if (this.mobileMenu && this.mobileMenu.classList.contains('active')) {
                if (!this.mobileMenu.contains(e.target) && !this.mobileMenuButton.contains(e.target)) {
                    this.closeMobileMenu();
                }
            }
        });

        // Close mobile menu on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.mobileMenu && this.mobileMenu.classList.contains('active')) {
                this.closeMobileMenu();
            }
        });
    }

    // Setup mobile menu
    setupMobileMenu() {
        if (!this.mobileMenu) return;

        // Setup submenu toggles
        const submenuItems = this.mobileMenu.querySelectorAll('.mobile-menu-item.has-submenu');
        
        submenuItems.forEach(item => {
            const link = item.querySelector('.mobile-menu-link');
            const submenu = item.querySelector('.mobile-submenu');
            
            if (link && submenu) {
                link.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.toggleSubmenu(submenu);
                });
            }
        });
    }

    // Setup dropdown menus
    setupDropdownMenus() {
        const dropdownItems = document.querySelectorAll('.menu-item-has-children');
        
        dropdownItems.forEach(item => {
            const link = item.querySelector('.nav-top-link');
            const submenu = item.querySelector('.sub-menu');
            
            if (link && submenu) {
                // Desktop hover
                item.addEventListener('mouseenter', () => {
                    this.showDropdown(submenu);
                });
                
                item.addEventListener('mouseleave', () => {
                    this.hideDropdown(submenu);
                });
                
                // Mobile click
                link.addEventListener('click', (e) => {
                    if (window.innerWidth <= 768) {
                        e.preventDefault();
                        this.toggleDropdown(submenu);
                    }
                });
            }
        });
    }

    // Toggle mobile menu
    toggleMobileMenu() {
        if (!this.mobileMenu) return;

        if (this.mobileMenu.classList.contains('active')) {
            this.closeMobileMenu();
        } else {
            this.openMobileMenu();
        }
    }

    // Open mobile menu
    openMobileMenu() {
        if (!this.mobileMenu) return;

        console.log('Opening mobile menu...');
        this.mobileMenu.style.display = 'block';
        this.mobileMenu.classList.add('active');
        
        // Prevent body scroll
        document.body.style.overflow = 'hidden';
        
        // Add animation
        setTimeout(() => {
            this.mobileMenu.style.opacity = '1';
        }, 10);
    }

    // Close mobile menu
    closeMobileMenu() {
        if (!this.mobileMenu) return;

        console.log('Closing mobile menu...');
        this.mobileMenu.style.opacity = '0';
        
        setTimeout(() => {
            this.mobileMenu.classList.remove('active');
            this.mobileMenu.style.display = 'none';
            
            // Restore body scroll
            document.body.style.overflow = '';
            
            // Close all submenus
            const submenus = this.mobileMenu.querySelectorAll('.mobile-submenu.active');
            submenus.forEach(submenu => {
                submenu.classList.remove('active');
            });
        }, 300);
    }

    // Toggle submenu in mobile menu
    toggleSubmenu(submenu) {
        if (!submenu) return;

        const isActive = submenu.classList.contains('active');
        
        // Close all other submenus
        const allSubmenus = this.mobileMenu.querySelectorAll('.mobile-submenu.active');
        allSubmenus.forEach(menu => {
            if (menu !== submenu) {
                menu.classList.remove('active');
            }
        });
        
        // Toggle current submenu
        if (isActive) {
            submenu.classList.remove('active');
        } else {
            submenu.classList.add('active');
        }
    }

    // Show dropdown menu
    showDropdown(submenu) {
        if (!submenu || window.innerWidth <= 768) return;

        submenu.style.opacity = '1';
        submenu.style.visibility = 'visible';
        submenu.style.transform = 'translateY(0)';
    }

    // Hide dropdown menu
    hideDropdown(submenu) {
        if (!submenu || window.innerWidth <= 768) return;

        submenu.style.opacity = '0';
        submenu.style.visibility = 'hidden';
        submenu.style.transform = 'translateY(-10px)';
    }

    // Toggle dropdown menu (mobile)
    toggleDropdown(submenu) {
        if (!submenu) return;

        const isVisible = submenu.style.visibility === 'visible';
        
        if (isVisible) {
            this.hideDropdown(submenu);
        } else {
            this.showDropdown(submenu);
        }
    }

    // Update header on scroll
    updateOnScroll() {
        if (!this.header) return;

        const scrollTop = window.pageYOffset;
        const threshold = 100;

        if (scrollTop > threshold) {
            this.header.classList.add('sticky');
        } else {
            this.header.classList.remove('sticky');
        }
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

    // Handle window resize
    handleResize() {
        // Close mobile menu on desktop
        if (window.innerWidth > 768 && this.mobileMenu && this.mobileMenu.classList.contains('active')) {
            this.closeMobileMenu();
        }
    }

    // Public methods
    getHeader() {
        return this.header;
    }

    isMobileMenuOpen() {
        return this.mobileMenu && this.mobileMenu.classList.contains('active');
    }


}

// Export for use in other modules
window.HeaderManager = HeaderManager; 