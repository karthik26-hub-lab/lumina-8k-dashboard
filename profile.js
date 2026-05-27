document.addEventListener('DOMContentLoaded', () => {
    if (localStorage.getItem('lumina_auth') !== 'true') {
        window.location.href = 'index.html';
        return;
    }

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });
    
    document.querySelectorAll('.scroll-reveal').forEach((el, index) => {
        setTimeout(() => el.classList.add('visible'), index * 100);
        observer.observe(el);
    });

    document.getElementById('logout-btn').addEventListener('click', () => {
        localStorage.removeItem('lumina_auth');
        window.location.href = 'index.html';
    });

    const animateCounter = (id, target, duration) => {
        const obj = document.getElementById(id);
        if (!obj) return;

        let startTimestamp = null;
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            const easeProgress = 1 - Math.pow(1 - progress, 4);
            
            obj.innerHTML = Math.floor(easeProgress * target);
            
            if (progress < 1) {
                window.requestAnimationFrame(step);
            } else {
                obj.innerHTML = target;
            }
        };
        window.requestAnimationFrame(step);
    };

    setTimeout(() => {
        animateCounter('counter-frames', 1248, 2500);
        animateCounter('counter-hours', 42, 2000);
    }, 500); 

    const historyContainer = document.getElementById('profile-history-list');
    const saved = localStorage.getItem('lumina_history');
    
    if (saved) {
        try {
            const historyList = JSON.parse(saved);
            if (historyList.length === 0) {
                historyContainer.innerHTML = '<p style="color: var(--text-muted); font-size: 0.8rem; text-align: center; margin-top: 1rem;">No generations found.</p>';
            } else {
                historyContainer.innerHTML = '';
                historyList.slice(0, 5).forEach((item, index) => {
                    const div = document.createElement('div');
                    div.className = 'history-item';
                    div.style.animationDelay = `${index * 0.1}s`;
                    div.innerHTML = `
                        <img src="${item.thumbnail}" alt="Thumb" class="history-thumb">
                        <div class="history-details">
                            <div class="history-prompt">"${item.prompt}"</div>
                            <div class="history-time">${item.timestamp}</div>
                        </div>
                    `;
                    historyContainer.appendChild(div);
                });
            }
        } catch (e) {
            console.error("Error parsing history:", e);
            historyContainer.innerHTML = '<p style="color: #ff6b6b; font-size: 0.8rem; text-align: center; margin-top: 1rem;">Error loading history.</p>';
        }
    } else {
        historyContainer.innerHTML = '<p style="color: var(--text-muted); font-size: 0.8rem; text-align: center; margin-top: 1rem;">No generations found.</p>';
    }
});
