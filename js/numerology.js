// Numerology Page JavaScript
class NumerologyPage {
    constructor() {
        this.init();
    }

    init() {
        console.log('Initializing NumerologyPage...');
        this.setupNumberTabs();
        this.setupForm();
        
        // Initialize grid with default tab
        const defaultTab = document.querySelector('.number-tab.active');
        if (defaultTab) {
            console.log('Found default tab:', defaultTab.textContent.trim());
            this.updateNumberGrid(defaultTab.textContent.trim());
        } else {
            console.log('No default tab found, creating default numbers...');
            // Create default numbers if no tab is active
            this.updateNumberGrid('Số chủ đạo');
        }
    }

    // Setup number tabs
    setupNumberTabs() {
        const tabs = document.querySelectorAll('.number-tab');
        
        tabs.forEach(tab => {
            tab.addEventListener('click', (e) => {
                e.preventDefault();
                
                // Remove active class from all tabs
                tabs.forEach(t => t.classList.remove('active'));
                
                // Add active class to clicked tab
                tab.classList.add('active');
                
                // Update grid based on selected tab
                const tabName = tab.textContent.trim();
                console.log('Tab clicked:', tabName);
                this.updateNumberGrid(tabName);
            });
        });
        
        // Set first tab as active by default and load its numbers
        if (tabs.length > 0) {
            const firstTab = tabs[0];
            firstTab.classList.add('active');
            const tabName = firstTab.textContent.trim();
            console.log('Loading default tab:', tabName);
            this.updateNumberGrid(tabName);
        }
    }

    // Setup number grid
    setupNumberGrid() {
        const numberItems = document.querySelectorAll('.number-item');
        
        numberItems.forEach(item => {
            item.addEventListener('click', () => {
                const number = item.textContent;
                this.showNumberDetails(number);
            });
        });
    }

    // Update number grid based on selected tab
    updateNumberGrid(tabName) {
        const grid = document.querySelector('.number-grid');
        if (!grid) {
            console.error('Grid not found!');
            return;
        }

        console.log('Updating grid for tab:', tabName);

        // Define numbers for each tab
        const tabNumbers = {
            'Số chủ đạo': [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 22, 33],
            'Số sứ mệnh': [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 22, 33],
            'Số trưởng thành': [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 22],
            'Số thái độ': [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 22, 33],
            'Số linh hồn': [1, 2, 3, 4, 5, 6, 7, 8, 9, 11, 22, 33],
            'Số nhân cách': [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 22, 33],
            'Số ngày sinh': [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 22],
            'Số cân bằng': [1, 2, 3, 4, 5, 6, 7, 8, 9]
        };

        const numbers = tabNumbers[tabName] || [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 22, 33];
        
        console.log('Numbers to display:', numbers);
        console.log('Grid element:', grid);
        
        // Update grid with animation
        grid.style.opacity = '0';
        
        setTimeout(() => {
            grid.innerHTML = numbers.map((num, index) => 
                `<div class="number-item" style="--animation-order: ${index}">${num}</div>`
            ).join('');
            
            grid.style.opacity = '1';
            
            // Re-attach event listeners
            this.setupNumberGrid();
            
            console.log('Grid updated successfully');
        }, 150);
    }

    // Show number details
    showNumberDetails(number) {
        // You can implement a modal or redirect to a details page
        console.log(`Showing details for number: ${number}`);
        
        // For now, just show an alert
        alert(`Chi tiết về số ${number} sẽ được hiển thị ở đây.`);
    }

    // Setup form
    setupForm() {
        const form = document.querySelector('.numerology-form');
        if (!form) return;

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleFormSubmit();
        });

        // Setup help link
        const helpLink = document.querySelector('.help-link');
        if (helpLink) {
            helpLink.addEventListener('click', (e) => {
                e.preventDefault();
                this.showHelpModal();
            });
        }
    }

    // Handle form submission
    handleFormSubmit() {
        const fullname = document.getElementById('fullname').value.trim();
        const day = document.querySelector('.date-select:nth-child(1)').value;
        const month = document.querySelector('.date-select:nth-child(2)').value;
        const year = document.querySelector('.date-select:nth-child(3)').value;

        // Validate form
        if (!fullname || !day || !month || !year) {
            alert('Vui lòng điền đầy đủ thông tin!');
            return;
        }

        // Format date as dd/mm/yyyy
        const dob = `${day}/${month}/${year}`;
        
        // Calculate numerology
        const lifePathNumber = this.getLifePathNumber(dob);
        const destinyNumber = this.getDestinyNumber(fullname);
        
        // Show result
        this.showResult(fullname, lifePathNumber, destinyNumber);
    }

    // Hàm tính Con Số Chủ Đạo từ ngày sinh (dd/mm/yyyy)
    getLifePathNumber(dob) {
        const digits = dob.replace(/\D/g, ''); // bỏ ký tự không phải số
        let sum = digits.split('').reduce((acc, digit) => acc + parseInt(digit), 0);

        while (sum > 11 && sum !== 22 && sum !== 33) {
            sum = sum.toString().split('').reduce((acc, digit) => acc + parseInt(digit), 0);
        }

        return sum;
    }

    // Hàm tính Số Sứ Mệnh từ tên
    getDestinyNumber(fullname) {
        const nameNumbers = this.convertNameToNumbers(fullname);
        let sum = nameNumbers.split('').reduce((acc, digit) => acc + parseInt(digit), 0);

        while (sum > 11 && sum !== 22 && sum !== 33) {
            sum = sum.toString().split('').reduce((acc, digit) => acc + parseInt(digit), 0);
        }

        return sum;
    }

    // Show result
    showResult(fullname, lifePathNumber, destinyNumber) {
        const resultHTML = `
            <div class="result-modal">
                <div class="result-content">
                    <h3>Kết quả Thần số học cho ${fullname}</h3>
                    <div class="result-item">
                        <strong>Con số chủ đạo:</strong> <span class="highlight-number">${lifePathNumber}</span>
                    </div>
                    <div class="result-item">
                        <strong>Số sứ mệnh:</strong> <span class="highlight-number">${destinyNumber}</span>
                    </div>
                    <button class="close-result">Đóng</button>
                </div>
            </div>
        `;
        
        // Remove existing result if any
        const existingResult = document.querySelector('.result-modal');
        if (existingResult) {
            existingResult.remove();
        }
        
        // Add result to page
        document.body.insertAdjacentHTML('beforeend', resultHTML);
        
        // Setup event listeners for modal
        this.setupModalEvents();
    }

    // Setup modal events
    setupModalEvents() {
        const modal = document.querySelector('.result-modal');
        const closeBtn = document.querySelector('.close-result');
        
        if (!modal || !closeBtn) return;
        
        // Close on button click
        closeBtn.addEventListener('click', () => {
            modal.remove();
        });
        
        // Close on outside click
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });
        
        // Close on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal) {
                modal.remove();
            }
        });
    }

    // Convert name to numbers
    convertNameToNumbers(name) {
        const nameMap = {
            'a': 1, 'b': 2, 'c': 3, 'd': 4, 'e': 5, 'f': 6, 'g': 7, 'h': 8, 'i': 9,
            'j': 1, 'k': 2, 'l': 3, 'm': 4, 'n': 5, 'o': 6, 'p': 7, 'q': 8, 'r': 9,
            's': 1, 't': 2, 'u': 3, 'v': 4, 'w': 5, 'x': 6, 'y': 7, 'z': 8
        };
        
        return name.toLowerCase().replace(/[^a-z]/g, '').split('').map(char => nameMap[char] || 0).join('');
    }

    // Show help modal
    showHelpModal() {
        alert('Hướng dẫn nhập tên:\n\n- Nhập đầy đủ họ và tên khai sinh\n- Không sử dụng tên thường gọi hoặc biệt danh\n- Viết hoa chữ cái đầu của mỗi từ\n- Ví dụ: Nguyễn Văn An');
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, checking for numerology page...');
    const numerologyPage = document.querySelector('.numerology-page');
    if (numerologyPage) {
        console.log('Numerology page found, initializing...');
        const page = new NumerologyPage();
    } else {
        console.log('Numerology page not found');
    }
}); 