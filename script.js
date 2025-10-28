// User data management
class HalalEarning {
    constructor() {
        this.users = JSON.parse(localStorage.getItem('halalUsers')) || [];
        this.currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;
        this.init();
    }

    init() {
        this.updateEarningsDisplay();
        this.setupEventListeners();
    }

    setupEventListeners() {
        // Navigation smooth scroll
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                document.querySelector(this.getAttribute('href')).scrollIntoView({
                    behavior: 'smooth'
                });
            });
        });
    }

    registerUser() {
        const name = prompt("আপনার নাম লিখুন:");
        const email = prompt("আপনার ইমেইল লিখুন:");
        const phone = prompt("আপনার ফোন নম্বর লিখুন:");

        if (name && email && phone) {
            const user = {
                id: Date.now(),
                name,
                email,
                phone,
                balance: 0,
                totalEarned: 0,
                joinedDate: new Date().toLocaleDateString('bn-BD')
            };

            this.users.push(user);
            this.currentUser = user;
            this.saveData();
            
            alert('রেজিস্ট্রেশন সফল! আপনি এখন আয় শুরু করতে পারেন।');
            this.updateEarningsDisplay();
        }
    }

    addEarning(amount, source) {
        if (!this.currentUser) {
            alert('দয়া করে প্রথমে রেজিস্টার করুন।');
            return;
        }

        const user = this.users.find(u => u.id === this.currentUser.id);
        if (user) {
            user.balance += amount;
            user.totalEarned += amount;
            this.saveData();
            this.updateEarningsDisplay();
            
            alert(`সফলভাবে ${amount} টাকা যোগ করা হয়েছে! (${source})`);
        }
    }

    withdrawMoney() {
        if (!this.currentUser) {
            alert('দয়া করে প্রথমে রেজিস্টার করুন।');
            return;
        }

        const user = this.users.find(u => u.id === this.currentUser.id);
        if (user.balance === 0) {
            alert('আপনার ব্যালেন্সে কোন টাকা নেই।');
            return;
        }

        const amount = user.balance;
        const method = prompt(`উত্তোলনের মাধ্যম选择 করুন:\n1. bKash\n2. Nagad\n3. Rocket`);
        
        if (method) {
            user.balance = 0;
            this.saveData();
            this.updateEarningsDisplay();
            alert(`সফলভাবে ${amount} টাকা উত্তোলন করা হয়েছে!`);
        }
    }

    updateEarningsDisplay() {
        if (this.currentUser) {
            const user = this.users.find(u => u.id === this.currentUser.id);
            if (user) {
                document.getElementById('currentBalance').textContent = `${user.balance} টাকা`;
                document.getElementById('totalEarning').textContent = `${user.totalEarned} টাকা`;
                
                // Simulate daily earning
                const todayEarning = Math.floor(Math.random() * 200) + 100;
                document.getElementById('todayEarning').textContent = `${todayEarning} টাকা`;
            }
        }
    }

    saveData() {
        localStorage.setItem('halalUsers', JSON.stringify(this.users));
        localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
    }

    // Admin functions
    getAdminStats() {
        const totalUsers = this.users.length;
        const totalEarnings = this.users.reduce((sum, user) => sum + user.totalEarned, 0);
        const totalBalance = this.users.reduce((sum, user) => sum + user.balance, 0);

        return {
            totalUsers,
            totalEarnings,
            totalBalance,
            users: this.users
        };
    }
}

// Initialize the application
const halalApp = new HalalEarning();

// Global functions for HTML onclick events
function registerUser() {
    halalApp.registerUser();
}

function withdrawMoney() {
    halalApp.withdrawMoney();
}

// Simulate earning opportunities
function startContentWriting() {
    halalApp.addEarning(250, 'কনটেন্ট রাইটিং');
}

function startTeaching() {
    halalApp.addEarning(200, 'অনলাইন টিউশন');
}

function startDesigning() {
    halalApp.addEarning(400, 'ডিজাইন সার্ভিস');
}

// Auto update earnings every minute
setInterval(() => {
    halalApp.updateEarningsDisplay();
}, 60000);
