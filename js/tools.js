// Tools Page Manager
class ToolsPage {
    constructor() {
        this.init();
    }

    init() {
        this.setupFilter();
        this.setupToolCards();
        // Removed setupMobileMenu() to avoid conflicts with main.js and header.js
    }

    // Setup filter functionality
    setupFilter() {
        const filterDropdown = document.querySelector('.filter-dropdown');
        
        if (filterDropdown) {
            filterDropdown.addEventListener('change', (e) => {
                const selectedCategory = e.target.value;
                this.filterTools(selectedCategory);
            });
        }
    }

    // Filter tools based on category
    filterTools(category) {
        const toolCards = document.querySelectorAll('.tool-card');
        
        toolCards.forEach(card => {
            const cardCategory = card.getAttribute('data-category');
            
            if (category === 'all' || cardCategory.includes(category)) {
                card.style.display = 'block';
                card.style.animation = 'fadeInUp 0.3s ease forwards';
            } else {
                card.style.display = 'none';
            }
        });
    }

    // Setup tool card clicks
    setupToolCards() {
        const toolCards = document.querySelectorAll('.tool-card');
        
        toolCards.forEach(card => {
            card.addEventListener('click', (e) => {
                e.preventDefault();
                const toolTitle = card.querySelector('.tool-title').textContent;
                this.handleToolClick(toolTitle);
            });
        });
    }

    // Handle tool card clicks
    handleToolClick(toolTitle) {
        console.log('Tool clicked:', toolTitle);
        
        // Navigate to appropriate page based on tool
        switch(toolTitle) {
            case 'Tra cứu Thần số học':
                window.location.href = 'numerology.html';
                break;
            case 'Lập bản đồ sao':
                alert('Tính năng Lập bản đồ sao sẽ được phát triển sớm!');
                break;
            case 'Cung hoàng đạo':
                alert('Tính năng Cung hoàng đạo sẽ được phát triển sớm!');
                break;
            case 'Tarot Yes/No':
                alert('Tính năng Tarot Yes/No sẽ được phát triển sớm!');
                break;
            case 'Tarot theo chủ đề':
                alert('Tính năng Tarot theo chủ đề sẽ được phát triển sớm!');
                break;
            default:
                alert(`Tính năng ${toolTitle} sẽ được phát triển sớm!`);
                break;
        }
    }

    // Mobile menu functionality removed to avoid conflicts
    // Mobile menu is handled by main.js and header.js
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('Tools page loaded');
    new ToolsPage();
}); 