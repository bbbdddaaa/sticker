// Sticker ($STKR) - Main JavaScript
// Blockchain Philanthropy Platform

class StickerApp {
    constructor() {
        this.isFeedPaused = false;
        this.donationFeed = [];
        this.votingData = {
            unicef: 0,
            doctors: 0,
            environment: 0
        };
        this.totalVotes = 0;
        this.userVotingPower = 1000; // Mock voting power
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.initializeStats();
        this.startDonationFeed();
        this.initializeVoting();
        this.setupAnimations();
        this.initializeSBTDemo();
    }

    setupEventListeners() {
        // Navigation smooth scrolling
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(anchor.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });

        // Hero buttons
        document.getElementById('tradeBtn').addEventListener('click', () => {
            this.showTradeModal();
        });

        document.getElementById('feedBtn').addEventListener('click', () => {
            document.getElementById('feed').scrollIntoView({ behavior: 'smooth' });
        });

        // Feed controls
        document.getElementById('refreshFeed').addEventListener('click', () => {
            this.refreshDonationFeed();
        });

        document.getElementById('pauseFeed').addEventListener('click', () => {
            this.toggleFeedPause();
        });

        // Voting buttons
        document.querySelectorAll('.vote-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const charity = e.target.getAttribute('data-charity');
                this.castVote(charity);
            });
        });

        // SBT card hover effect
        const sbtCard = document.getElementById('sbtCard');
        if (sbtCard) {
            sbtCard.addEventListener('mouseenter', () => {
                this.animateSBTCard();
            });
        }

        // Sticker animations
        document.querySelectorAll('.sticker').forEach(sticker => {
            sticker.addEventListener('click', () => {
                this.animateStickerClick(sticker);
            });
        });
    }

    initializeStats() {
        // Initialize hero stats with animated counting
        this.animateCounter('totalDonated', 0, 125000, 2000, '$');
        this.animateCounter('activeUsers', 0, 2847, 1500);
        this.animateCounter('charitiesHelped', 0, 12, 1000);

        // Initialize feed stats
        this.animateCounter('todayDonations', 0, 15420, 2500, '$');
        this.animateCounter('totalTransactions', 0, 1247, 2000);
        this.animateCounter('avgDonation', 0, 12.35, 1500, '$');
    }

    animateCounter(elementId, start, end, duration, prefix = '') {
        const element = document.getElementById(elementId);
        if (!element) return;

        const startTime = performance.now();
        const isDecimal = end.toString().includes('.');
        
        const updateCounter = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Easing function for smooth animation
            const easeOut = 1 - Math.pow(1 - progress, 3);
            const current = start + (end - start) * easeOut;
            
            if (isDecimal) {
                element.textContent = prefix + current.toFixed(2);
            } else {
                element.textContent = prefix + Math.floor(current).toLocaleString();
            }
            
            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            }
        };
        
        requestAnimationFrame(updateCounter);
    }

    startDonationFeed() {
        // Generate initial donation entries
        this.generateDonationEntries(5);
        this.updateDonationFeed();
        
        // Add new entries periodically
        setInterval(() => {
            if (!this.isFeedPaused) {
                this.addNewDonation();
            }
        }, 3000);
    }

    generateDonationEntries(count) {
        const charities = [
            { name: 'UNICEF', icon: '🌍', category: 'Children' },
            { name: 'Doctors Without Borders', icon: '🏥', category: 'Medical' },
            { name: 'Environmental Defense Fund', icon: '🌱', category: 'Environment' },
            { name: 'Red Cross', icon: '❤️', category: 'Emergency' },
            { name: 'World Food Programme', icon: '🍽️', category: 'Hunger' }
        ];

        const users = ['0x1234...5678', '0xabcd...efgh', '0x9876...5432', '0xdcba...hgfe'];

        for (let i = 0; i < count; i++) {
            const charity = charities[Math.floor(Math.random() * charities.length)];
            const user = users[Math.floor(Math.random() * users.length)];
            const amount = (Math.random() * 100 + 10).toFixed(2);
            const timeAgo = Math.floor(Math.random() * 60) + 1;

            this.donationFeed.push({
                charity: charity.name,
                icon: charity.icon,
                category: charity.category,
                user: user,
                amount: amount,
                timeAgo: timeAgo,
                timestamp: Date.now() - (timeAgo * 1000)
            });
        }
    }

    addNewDonation() {
        const charities = [
            { name: 'UNICEF', icon: '🌍', category: 'Children' },
            { name: 'Doctors Without Borders', icon: '🏥', category: 'Medical' },
            { name: 'Environmental Defense Fund', icon: '🌱', category: 'Environment' },
            { name: 'Red Cross', icon: '❤️', category: 'Emergency' },
            { name: 'World Food Programme', icon: '🍽️', category: 'Hunger' }
        ];

        const users = ['0x1234...5678', '0xabcd...efgh', '0x9876...5432', '0xdcba...hgfe', '0x1111...2222'];

        const charity = charities[Math.floor(Math.random() * charities.length)];
        const user = users[Math.floor(Math.random() * users.length)];
        const amount = (Math.random() * 100 + 10).toFixed(2);

        const newDonation = {
            charity: charity.name,
            icon: charity.icon,
            category: charity.category,
            user: user,
            amount: amount,
            timeAgo: 0,
            timestamp: Date.now()
        };

        this.donationFeed.unshift(newDonation);
        
        // Keep only last 20 entries
        if (this.donationFeed.length > 20) {
            this.donationFeed = this.donationFeed.slice(0, 20);
        }

        this.updateDonationFeed();
        this.updateFeedStats();
    }

    updateDonationFeed() {
        const feedContainer = document.getElementById('donationFeed');
        if (!feedContainer) return;

        feedContainer.innerHTML = '';

        this.donationFeed.forEach((donation, index) => {
            const entry = document.createElement('div');
            entry.className = 'donation-entry';
            entry.style.animationDelay = `${index * 0.1}s`;

            entry.innerHTML = `
                <div class="donation-info">
                    <div class="donation-icon">${donation.icon}</div>
                    <div class="donation-details">
                        <h4>${donation.charity}</h4>
                        <p>${donation.user} • ${donation.timeAgo === 0 ? 'Just now' : donation.timeAgo + 's ago'}</p>
                    </div>
                </div>
                <div class="donation-amount">$${donation.amount}</div>
            `;

            feedContainer.appendChild(entry);
        });
    }

    updateFeedStats() {
        const todayTotal = this.donationFeed.reduce((sum, donation) => sum + parseFloat(donation.amount), 0);
        const avgDonation = this.donationFeed.length > 0 ? todayTotal / this.donationFeed.length : 0;

        document.getElementById('todayDonations').textContent = `$${todayTotal.toFixed(2)}`;
        document.getElementById('totalTransactions').textContent = this.donationFeed.length.toString();
        document.getElementById('avgDonation').textContent = `$${avgDonation.toFixed(2)}`;
    }

    refreshDonationFeed() {
        this.generateDonationEntries(3);
        this.updateDonationFeed();
        this.updateFeedStats();
    }

    toggleFeedPause() {
        this.isFeedPaused = !this.isFeedPaused;
        const pauseBtn = document.getElementById('pauseFeed');
        pauseBtn.textContent = this.isFeedPaused ? 'Resume Updates' : 'Pause Updates';
        pauseBtn.style.background = this.isFeedPaused ? 
            'linear-gradient(135deg, #10B981, #059669)' : 
            'transparent';
    }

    initializeVoting() {
        // Initialize voting data
        this.votingData = {
            unicef: Math.floor(Math.random() * 100) + 50,
            doctors: Math.floor(Math.random() * 100) + 30,
            environment: Math.floor(Math.random() * 100) + 20
        };

        this.totalVotes = Object.values(this.votingData).reduce((sum, votes) => sum + votes, 0);
        this.updateVotingDisplay();
    }

    castVote(charity) {
        if (this.userVotingPower <= 0) {
            this.showNotification('Insufficient voting power!', 'error');
            return;
        }

        this.votingData[charity] += 1;
        this.totalVotes += 1;
        this.userVotingPower -= 1;

        this.updateVotingDisplay();
        this.showNotification(`Vote cast for ${this.getCharityName(charity)}!`, 'success');
        this.animateVoteButton(charity);
    }

    getCharityName(charity) {
        const names = {
            unicef: 'UNICEF',
            doctors: 'Doctors Without Borders',
            environment: 'Environmental Defense Fund'
        };
        return names[charity] || charity;
    }

    updateVotingDisplay() {
        // Update total votes
        document.getElementById('totalVotes').textContent = this.totalVotes.toLocaleString();
        document.getElementById('userVotingPower').textContent = `${this.userVotingPower.toLocaleString()} STKR`;

        // Update individual charity votes and percentages
        Object.keys(this.votingData).forEach(charity => {
            const votes = this.votingData[charity];
            const percentage = this.totalVotes > 0 ? (votes / this.totalVotes) * 100 : 0;

            document.getElementById(`${charity}Votes`).textContent = votes.toLocaleString();
            document.getElementById(`${charity}Percentage`).textContent = `${percentage.toFixed(1)}%`;
            document.getElementById(`${charity}Progress`).style.width = `${percentage}%`;
        });
    }

    animateVoteButton(charity) {
        const button = document.querySelector(`[data-charity="${charity}"]`);
        if (button) {
            button.style.transform = 'scale(0.95)';
            button.style.background = 'linear-gradient(135deg, #10B981, #059669)';
            
            setTimeout(() => {
                button.style.transform = 'scale(1)';
                setTimeout(() => {
                    button.style.background = 'linear-gradient(135deg, #FDE68A, #F59E0B)';
                }, 200);
            }, 150);
        }
    }

    setupAnimations() {
        // Intersection Observer for scroll animations
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, observerOptions);

        // Observe sections for scroll animations
        document.querySelectorAll('section').forEach(section => {
            section.style.opacity = '0';
            section.style.transform = 'translateY(30px)';
            section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(section);
        });

        // Sticker hover animations
        document.querySelectorAll('.sticker').forEach(sticker => {
            sticker.addEventListener('mouseenter', () => {
                sticker.style.transform = 'scale(1.2) rotate(5deg)';
            });
            
            sticker.addEventListener('mouseleave', () => {
                sticker.style.transform = 'scale(1) rotate(0deg)';
            });
        });
    }

    initializeSBTDemo() {
        const sbtCard = document.getElementById('sbtCard');
        if (sbtCard) {
            sbtCard.addEventListener('mouseenter', () => {
                this.animateSBTCard();
            });
        }
    }

    animateSBTCard() {
        const card = document.getElementById('sbtCard');
        if (card) {
            card.style.transform = 'translateY(-10px) rotateY(5deg)';
            card.style.boxShadow = '0 25px 50px rgba(0, 0, 0, 0.2)';
            
            setTimeout(() => {
                card.style.transform = 'translateY(-5px) rotateY(0deg)';
                card.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.15)';
            }, 200);
        }
    }

    animateStickerClick(sticker) {
        sticker.style.transform = 'scale(1.5) rotate(360deg)';
        sticker.style.filter = 'brightness(1.2)';
        
        setTimeout(() => {
            sticker.style.transform = 'scale(1) rotate(0deg)';
            sticker.style.filter = 'brightness(1)';
        }, 600);
    }

    showTradeModal() {
        // Create modal overlay
        const modal = document.createElement('div');
        modal.className = 'modal-overlay';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3>Start Trading STKR</h3>
                    <button class="modal-close">&times;</button>
                </div>
                <div class="modal-body">
                    <p>Connect your wallet to start trading STKR and automatically donate to charity with every transaction.</p>
                    <div class="modal-actions">
                        <button class="btn-primary" onclick="this.closest('.modal-overlay').remove()">
                            Connect Wallet
                        </button>
                        <button class="btn-secondary" onclick="this.closest('.modal-overlay').remove()">
                            Learn More
                        </button>
                    </div>
                </div>
            </div>
        `;

        // Add modal styles
        const style = document.createElement('style');
        style.textContent = `
            .modal-overlay {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0, 0, 0, 0.5);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 10000;
                animation: fadeIn 0.3s ease;
            }
            .modal-content {
                background: white;
                border-radius: 1rem;
                padding: 2rem;
                max-width: 500px;
                width: 90%;
                box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
                animation: slideUp 0.3s ease;
            }
            .modal-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 1rem;
            }
            .modal-close {
                background: none;
                border: none;
                font-size: 1.5rem;
                cursor: pointer;
                color: #6B7280;
            }
            .modal-actions {
                display: flex;
                gap: 1rem;
                margin-top: 1.5rem;
            }
            @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }
            @keyframes slideUp {
                from { transform: translateY(30px); opacity: 0; }
                to { transform: translateY(0); opacity: 1; }
            }
        `;
        document.head.appendChild(style);

        document.body.appendChild(modal);

        // Close modal on overlay click
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });

        // Close modal on close button
        modal.querySelector('.modal-close').addEventListener('click', () => {
            modal.remove();
        });
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;

        // Add notification styles
        const style = document.createElement('style');
        style.textContent = `
            .notification {
                position: fixed;
                top: 20px;
                right: 20px;
                padding: 1rem 1.5rem;
                border-radius: 0.5rem;
                color: white;
                font-weight: 500;
                z-index: 10001;
                animation: slideInRight 0.3s ease;
            }
            .notification-success {
                background: linear-gradient(135deg, #10B981, #059669);
            }
            .notification-error {
                background: linear-gradient(135deg, #EF4444, #DC2626);
            }
            .notification-info {
                background: linear-gradient(135deg, #3B82F6, #2563EB);
            }
            @keyframes slideInRight {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
        `;
        document.head.appendChild(style);

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.animation = 'slideInRight 0.3s ease reverse';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new StickerApp();
});

// Add some additional utility functions
window.StickerUtils = {
    formatCurrency: (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(amount);
    },

    formatNumber: (number) => {
        return new Intl.NumberFormat('en-US').format(number);
    },

    generateRandomAddress: () => {
        const chars = '0123456789abcdef';
        let result = '0x';
        for (let i = 0; i < 40; i++) {
            result += chars[Math.floor(Math.random() * chars.length)];
        }
        return result.substring(0, 10) + '...' + result.substring(36);
    }
};

// Add smooth scrolling for all anchor links
document.addEventListener('DOMContentLoaded', () => {
    // Add loading animation
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease';
    
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);
});
