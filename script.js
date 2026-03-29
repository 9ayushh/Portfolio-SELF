gsap.registerPlugin(ScrollTrigger);

// -----------------------------------------------------------------
// 1. Initial GSAP Intro Animation
// -----------------------------------------------------------------
var t1 = gsap.timeline();

t1.from("#text", { 
    delay: 0.5,
    duration: 1.5,
    width: 0, 
    ease: "power2.inOut"
});
t1.to("#text",{
    duration: 0.8,
    opacity: 0,
    ease: "power2.inOut"
})
t1.to("#page1", {
    y: "-100%",
    duration: 1,
    ease: "power3.inOut",
    onComplete: () => {
        document.getElementById('page1').style.display = 'none';
        document.body.style.overflow = 'auto'; // Re-enable scroll
    }
}, "-=0.2")

// -----------------------------------------------------------------
// 2. Hero Sequence GSAP
// -----------------------------------------------------------------
// Removed nav from initial GSAP timeline so it stands visible from start.

t1.from("#name",{
    opacity: 0,
    y: 30,
    duration: 1,
    ease: "power3.out"
}, "-=0.8")

t1.from(".one",{
    opacity: 0,
    duration: 0.8,
    y: 20,
    ease: "power2.out"
}, "-=0.7")

t1.from(".two",{
    opacity: 0,
    duration: 0.8,
    y: 20,
    ease: "power2.out"
}, "-=0.6")

t1.from(".project, .contact", {
    opacity: 0,
    y: 20,
    duration: 0.6,
    stagger: 0.2,
    ease: "power2.out"
}, "-=0.6")

t1.from(".right",{
    opacity: 0,
    duration: 1.8,
    ease: "power4.out",
    x: 80, 
    scale: 0.95
}, "-=1.5")


// -----------------------------------------------------------------
// 3. Navbar logic (Mobile toggle & Active Intersection Observer)
// -----------------------------------------------------------------
const mobileMenuBtn = document.getElementById('mobile-menu-btn');
const closeMenuBtn = document.getElementById('close-menu-btn');
const mobileMenu = document.getElementById('mobile-menu');
const mobileLinks = document.querySelectorAll('.mobile-link');

function openMobileMenu() {
    mobileMenu.classList.remove('translate-x-full');
}
function closeMobileMenu() {
    mobileMenu.classList.add('translate-x-full');
}

mobileMenuBtn.addEventListener('click', openMobileMenu);
closeMenuBtn.addEventListener('click', closeMobileMenu);
mobileLinks.forEach(link => link.addEventListener('click', closeMobileMenu));

// Intersection Observer for highlighting active nav links
const sections = document.querySelectorAll('main#about, div#skills, div#projects, div#contact');
const navLinks = document.querySelectorAll('.nav-link');

const observerOptions = {
    root: null,
    rootMargin: '-50% 0px -50% 0px', // detects when section is in middle of viewport
    threshold: 0
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            navLinks.forEach(link => {
                link.style.color = ''; // reset to default slate-300
                if(link.getAttribute('href') === '#' + entry.target.id) {
                    link.style.color = '#6058e8'; // highlight with brand color
                }
            });
        }
    });
}, observerOptions);

sections.forEach(sec => observer.observe(sec));


// -----------------------------------------------------------------
// 4. Dynamic Projects (GitHub API via Fetch)
// -----------------------------------------------------------------
const GITHUB_USERNAME = '9ayushh'; // Updated to real username

async function fetchGitHubProjects() {
    const container = document.getElementById('github-projects-container');
    
    try {
        const response = await fetch(`https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=15`);
        if(!response.ok) throw new Error("Failed to fetch");
        
        const repos = await response.json();
        
        // Filter out forks and pick top 6
        const bestRepos = repos.filter(r => !r.fork).slice(0, 6);
        
        if(bestRepos.length === 0) {
            container.innerHTML = `<p class="text-slate-400 col-span-full text-center">No projects found. Please update GitHub username in script.js.</p>`;
            return;
        }

        let html = '';
        bestRepos.forEach(repo => {
            // Pick a random placeholder image style for variety (using UI gradients)
            const gradientId = Math.floor(Math.random() * 4) + 1;
            const gradients = {
                1: 'from-blue-600 to-cyan-500',
                2: 'from-purple-600 to-brand',
                3: 'from-emerald-500 to-teal-400',
                4: 'from-orange-500 to-red-500'
            };
            const langClass = repo.language ? `<span class="text-xs font-bold tracking-wider px-3 py-1 bg-slate-800 text-slate-200 border border-slate-700 rounded-full">${repo.language}</span>` : '';

            html += `
                <div class="proj-card bg-slate-800 rounded-[2rem] overflow-hidden shadow-lg border border-slate-700 hover:border-brand/40 hover:shadow-2xl transition-all duration-300 group flex flex-col h-full">
                    <div class="relative overflow-hidden h-[200px] bg-gradient-to-tr ${gradients[gradientId]} p-6 flex items-center justify-center">
                        <i class="ri-github-fill text-6xl text-white/50 transform group-hover:scale-110 transition-transform duration-700 ease-out"></i>
                        <div class="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4">
                            <a href="${repo.html_url}" target="_blank" class="w-12 h-12 rounded-full bg-white text-slate-900 flex items-center justify-center hover:bg-brand hover:text-white transition-colors shadow-lg"><i class="ri-github-fill text-xl"></i></a>
                            ${repo.homepage ? `<a href="${repo.homepage}" target="_blank" class="w-12 h-12 rounded-full bg-brand text-white flex items-center justify-center hover:bg-white hover:text-brand transition-colors shadow-lg"><i class="ri-external-link-line text-xl"></i></a>` : ''}
                        </div>
                    </div>
                    <div class="p-8 flex-grow flex flex-col">
                        <div class="flex flex-wrap gap-2 mb-4">
                            ${langClass}
                        </div>
                        <h3 class="text-2xl font-bold text-slate-100 mb-3 group-hover:text-brand transition-colors cursor-pointer capitalize break-words">${repo.name.replace(/[-_]/g, ' ')}</h3>
                        <p class="text-slate-400 text-sm leading-relaxed mb-6 flex-grow">${repo.description || 'A wonderful project developed on GitHub without a specific description.'}</p>
                    </div>
                </div>
            `;
        });
        
        container.innerHTML = html;
        
        // After inserting new DOM nodes, refresh ScrollTrigger logic
        initGSAPScrollTriggers();
        
    } catch (error) {
        console.error('Error loading projects from GitHub:', error);
        container.innerHTML = `<p class="text-red-400 col-span-full text-center">Failed to load projects from GitHub. Check console for details.</p>`;
        // Initialize ScrollTrigger for existing nodes anyway
        initGSAPScrollTriggers();
    }
}

// -----------------------------------------------------------------
// 5. GSAP ScrollTrigger Initialization
// -----------------------------------------------------------------
function initGSAPScrollTriggers() {
    // Technical Skills animations
    gsap.utils.toArray('.skill-box').forEach((box, index) => {
        gsap.from(box, {
            scrollTrigger: {
                trigger: box,
                start: "top 85%", 
            },
            y: 60,
            opacity: 0,
            duration: 0.8,
            delay: (index % 4) * 0.15,
            ease: "power3.out"
        });
    });

    // Projects Header
    gsap.from('.project-header', {
        scrollTrigger: {
            trigger: '#projects',
            start: "top 80%"
        },
        y: 40,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out"
    });

    // Project Cards (Dynamic!)
    gsap.utils.toArray('.proj-card').forEach((card, index) => {
        gsap.from(card, {
            scrollTrigger: {
                trigger: card,
                start: "top 85%"
            },
            y: 60,
            opacity: 0,
            duration: 0.8,
            delay: (index % 3) * 0.15,
            ease: "power3.out"
        });
    });

    // Contact Section
    gsap.from('.contact-container', {
        scrollTrigger: {
            trigger: '#contact',
            start: "top 75%"
        },
        y: 50,
        opacity: 0,
        duration: 1.2,
        ease: "power3.out"
    });

    // Crucial to recalculate triggering boundaries after API paints the DOM
    ScrollTrigger.refresh();
}

// Start Fetch (which chains into GSAP initialization)
fetchGitHubProjects();


// -----------------------------------------------------------------
// 6. Contact Form Validation and Simple MailTo
// -----------------------------------------------------------------
const contactForm = document.getElementById('contactForm');
const formFeedback = document.getElementById('form-feedback');

contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const nameInput = document.getElementById('contact-name').value.trim();
    const emailInput = document.getElementById('email').value.trim();
    const messageInput = document.getElementById('message').value.trim();
    
    // JS Validation
    if(!nameInput || !emailInput || !messageInput) {
        formFeedback.className = 'bg-red-500/20 text-red-200 text-sm px-4 py-3 rounded-lg mt-2 font-medium block border border-red-500/30';
        formFeedback.textContent = 'Please fill out all required fields appropriately.';
        return;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if(!emailRegex.test(emailInput)) {
        formFeedback.className = 'bg-red-500/20 text-red-200 text-sm px-4 py-3 rounded-lg mt-2 font-medium block border border-red-500/30';
        formFeedback.textContent = 'Please enter a valid email address.';
        return;
    }
    
    // Option 1: Mock Success & MailTo Link Trigger
    formFeedback.className = 'bg-green-500/20 text-green-200 text-sm px-4 py-3 rounded-lg mt-2 font-medium block border border-green-500/30';
    formFeedback.textContent = 'Validation passed! Opening your default email client...';
    
    // Open explicit mailto
    const mailtoURL = `mailto:9ayushraj@gmail.com?subject=Portfolio Contact from ${encodeURIComponent(nameInput)}&body=${encodeURIComponent(messageInput + '\n\nSender Email: ' + emailInput)}`;
    window.location.href = mailtoURL;

    // Reset Form
    contactForm.reset();
    
    // Clear feedback after 5 seconds
    setTimeout(() => {
        formFeedback.classList.add('hidden');
    }, 5000);
});