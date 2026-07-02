document.addEventListener('DOMContentLoaded', () => {
    // --- Mobile Menu Toggle ---
    const menuToggle = document.getElementById('menu-toggle');
    const mobileMenu = document.getElementById('mobile-menu');
    const menuIconOpen = document.getElementById('menu-icon-open');
    const menuIconClose = document.getElementById('menu-icon-close');

    if (menuToggle && mobileMenu) {
        menuToggle.addEventListener('click', () => {
            const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
            menuToggle.setAttribute('aria-expanded', !isExpanded);

            mobileMenu.classList.toggle('hidden');

            if (menuIconOpen && menuIconClose) {
                menuIconOpen.classList.toggle('hidden');
                menuIconClose.classList.toggle('hidden');
            }
        });

        // Close mobile menu when a link is clicked
        const mobileLinks = mobileMenu.querySelectorAll('a');
        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.add('hidden');
                menuToggle.setAttribute('aria-expanded', 'false');
                if (menuIconOpen && menuIconClose) {
                    menuIconOpen.classList.remove('hidden');
                    menuIconClose.classList.add('hidden');
                }
            });
        });
    }

    // --- Dark Mode Controller ---
    const themeToggle = document.getElementById('theme-toggle');
    const sunIcon = document.getElementById('theme-toggle-sun');
    const moonIcon = document.getElementById('theme-toggle-moon');

    const enableDarkMode = () => {
        document.documentElement.classList.add('dark');
        localStorage.setItem('theme', 'dark');
        if (sunIcon && moonIcon) {
            sunIcon.classList.remove('hidden');
            moonIcon.classList.add('hidden');
        }
    };

    const disableDarkMode = () => {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('theme', 'light');
        if (sunIcon && moonIcon) {
            sunIcon.classList.add('hidden');
            moonIcon.classList.remove('hidden');
        }
    };

    // Check system preference or localStorage
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
        enableDarkMode();
    } else {
        disableDarkMode();
    }

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            if (document.documentElement.classList.contains('dark')) {

                disableDarkMode();
            } else {

                enableDarkMode();
            }
        });
    }

    // --- Intersection Scroll Spy ---
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('nav a');

    const scrollSpy = () => {
        let currentSectionId = 'profile';

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            if (window.scrollY >= (sectionTop - 250)) {
                currentSectionId = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (href === `#${currentSectionId}`) {
                link.classList.remove('text-neutral-400', 'dark:text-neutral-500');
                link.classList.add('text-neutral-900', 'dark:text-white', 'font-medium');
            } else {
                link.classList.remove('text-neutral-900', 'dark:text-white', 'font-medium');
                link.classList.add('text-neutral-400', 'dark:text-neutral-500');
            }
        });
    };

    window.addEventListener('scroll', scrollSpy);
    scrollSpy();

    // --- Scroll Reveal Animations ---
    const revealElements = document.querySelectorAll('.scroll-reveal');

    if (revealElements.length > 0) {
        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.remove('opacity-0', 'translate-y-8');
                    entry.target.classList.add('opacity-100', 'translate-y-0');
                    revealObserver.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        revealElements.forEach(el => revealObserver.observe(el));
    }

    // --- Contact Form Mailto Handler ---
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const name = document.getElementById('contact-name').value.trim();
            const email = document.getElementById('contact-email').value.trim();
            const message = document.getElementById('contact-message').value.trim();
            const form_data = {
                name: name,
                email: email,
                message: message
            }
            try {
                const res = await fetch('https://portfolio-form-handler.vercel.app/api/send-email', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(form_data)
                })

                const data = await res.json();
                if (data.success) {
                    showToast('Message sent successfully!', 'green');
                    contactForm.reset();
                }
                else {
                    showToast(data.error, 'red');
                }
            } catch (error) {
                showToast('Failed to send message. Please try again later.', 'red');
                console.log(error);
            }

        });
    }

    // --- Copy Email to Clipboard ---
    const copyEmailBtn = document.getElementById('copy-email-btn');
    const copyEmailIcon = document.getElementById('copy-email-icon');
    const copyToast = document.getElementById('copy-toast');

    if (copyEmailBtn && copyToast && copyEmailIcon) {
        copyEmailBtn.addEventListener('click', () => {
            const emailText = 'nandeshwar.rangu@gmail.com';
            navigator.clipboard.writeText(emailText).then(() => {
                // Toggle active check states
                copyEmailIcon.className = 'bi bi-check-lg text-emerald-500';
                copyToast.classList.remove('hidden', 'opacity-0');
                copyToast.classList.add('opacity-100');

                setTimeout(() => {
                    copyEmailIcon.className = 'bi bi-clipboard';
                    copyToast.classList.remove('opacity-100');
                    copyToast.classList.add('opacity-0');
                    setTimeout(() => copyToast.classList.add('hidden'), 300);
                }, 2000);
            }).catch(err => {
                console.error('Failed to copy text: ', err);
            });
        });
    }

    // --- Minimalist "Back to Top" Button ---
    const backToTopBtn = document.getElementById('back-to-top');
    if (backToTopBtn) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 400) {
                backToTopBtn.classList.remove('opacity-0', 'pointer-events-none');
                backToTopBtn.classList.add('opacity-100');
            } else {
                backToTopBtn.classList.remove('opacity-100');
                backToTopBtn.classList.add('opacity-0', 'pointer-events-none');
            }
        });

        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // --- Project Category Filter Tabs ---
    const filterButtons = document.querySelectorAll('.project-filter-btn');
    const projectCards = document.querySelectorAll('#projects .group');

    if (filterButtons.length > 0 && projectCards.length > 0) {
        filterButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                // Update active state class weights
                filterButtons.forEach(b => {
                    b.classList.remove('bg-neutral-900', 'dark:bg-white', 'text-white', 'dark:text-neutral-950', 'border-neutral-900', 'dark:border-white');
                    b.classList.add('text-neutral-500', 'border-neutral-200', 'dark:border-neutral-800');
                });
                btn.classList.add('bg-neutral-900', 'dark:bg-white', 'text-white', 'dark:text-neutral-950', 'border-neutral-900', 'dark:border-white');
                btn.classList.remove('text-neutral-500', 'border-neutral-200', 'dark:border-neutral-800');

                const filterValue = btn.getAttribute('data-filter');

                projectCards.forEach(card => {
                    const cardCategory = card.getAttribute('data-category');
                    if (filterValue === 'all' || cardCategory === filterValue) {
                        card.classList.remove('hidden');
                        setTimeout(() => {
                            card.classList.remove('opacity-0', 'scale-95');
                            card.classList.add('opacity-100', 'scale-100');
                        }, 50);
                    } else {
                        card.classList.add('hidden', 'opacity-0', 'scale-95');
                        card.classList.remove('opacity-100', 'scale-100');
                    }
                });
            });
        });
    }

    // --- Project Details Modal ---
    const modal = document.getElementById('project-modal');
    const modalContent = document.getElementById('modal-content');
    const modalClose = document.getElementById('modal-close');

    const modalTag = document.getElementById('modal-tag');
    const modalTitle = document.getElementById('modal-title');
    const modalDesc = document.getElementById('modal-desc');
    const modalImg = document.getElementById('modal-img');
    const modalPlaceholder = document.getElementById('modal-placeholder');
    const modalPlaceholderText = document.getElementById('modal-placeholder-text');
    const modalTechList = document.getElementById('modal-tech-list');
    const modalGithub = document.getElementById('modal-github');

    const openModal = (card) => {
        const title = card.getAttribute('data-modal-title');
        const tag = card.getAttribute('data-modal-tag');
        const desc = card.getAttribute('data-modal-desc');
        const img = card.getAttribute('data-modal-img');
        const tech = card.getAttribute('data-modal-tech') || '';
        const github = card.getAttribute('data-modal-github');

        modalTitle.textContent = title;
        modalTag.textContent = tag;
        modalDesc.textContent = desc;
        modalGithub.setAttribute('href', github);

        if (img) {
            modalImg.src = img;
            modalImg.alt = title;
            modalImg.classList.remove('hidden');
            modalPlaceholder.classList.add('hidden');
        } else {
            modalImg.classList.add('hidden');
            modalPlaceholder.classList.remove('hidden');
            const placeholderWord = title.includes('URL') ? 'URL' : 'BILL';
            modalPlaceholderText.textContent = placeholderWord;
        }

        // Clean and render tech badges
        modalTechList.innerHTML = '';
        tech.split(',').forEach(t => {
            if (t.trim()) {
                const span = document.createElement('span');
                span.className = 'bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 text-xs px-3 py-1.5 border border-neutral-200 dark:border-neutral-700 tracking-wide font-medium';
                span.textContent = t.trim();
                modalTechList.appendChild(span);
            }
        });

        // Toggle classes with transition delay
        modal.classList.remove('opacity-0', 'pointer-events-none');
        setTimeout(() => {
            modalContent.classList.remove('opacity-0', 'scale-95');
            modalContent.classList.add('opacity-100', 'scale-100');
        }, 50);
        document.body.classList.add('overflow-hidden');
    };

    const closeModal = () => {
        modalContent.classList.remove('opacity-100', 'scale-100');
        modalContent.classList.add('opacity-0', 'scale-95');
        setTimeout(() => {
            modal.classList.add('opacity-0', 'pointer-events-none');
            document.body.classList.remove('overflow-hidden');
        }, 300);
    };

    if (projectCards.length > 0) {
        projectCards.forEach(card => {
            const triggers = card.querySelectorAll('.modal-trigger');
            triggers.forEach(el => {
                el.addEventListener('click', (e) => {
                    e.preventDefault();
                    openModal(card);
                });
            });
        });
    }

    if (modalClose) modalClose.addEventListener('click', closeModal);
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeModal();
        });
    }

    // --- Custom Magnetic Blend-Difference Cursor ---
    const cursor = document.getElementById('custom-cursor');
    if (cursor) {
        document.addEventListener('mousemove', (e) => {
            // Apply coordinates smoothly
            cursor.style.left = e.clientX + 'px';
            cursor.style.top = e.clientY + 'px';
        });

        // Set expanding state selectors
        const hoverables = document.querySelectorAll('a, button, .p-6, input, textarea, .group img');
        hoverables.forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursor.classList.remove('w-2.5', 'h-2.5');
                cursor.classList.add('w-8', 'h-8', 'bg-neutral-900/10', 'dark:bg-white/15', 'scale-125');
            });
            el.addEventListener('mouseleave', () => {
                cursor.classList.remove('w-8', 'h-8', 'bg-neutral-900/10', 'dark:bg-white/15', 'scale-125');
                cursor.classList.add('w-2.5', 'h-2.5');
            });
        });
    }

    // --- Toast Notification System ---
    function showToast(message, type = 'green') {
        let container = document.getElementById('toast-container');
        if (!container) {
            container = document.createElement('div');
            container.id = 'toast-container';
            container.className = 'fixed top-6 right-6 z-[9999] flex flex-col gap-3 pointer-events-none';
            document.body.appendChild(container);
        }

        const toast = document.createElement('div');
        toast.className = `px-10 py-3 rounded-lg text-sm font-semibold tracking-wider shadow-lg transition-all duration-300 transform translate-y-4 opacity-0 flex items-center gap-2 pointer-events-auto border backdrop-blur-md`;

        if (type === 'green') {
            toast.classList.add('bg-emerald-50/90', 'border-emerald-200', 'text-emerald-800', 'dark:bg-emerald-950/90', 'dark:border-emerald-800', 'dark:text-emerald-200');
        } else {
            toast.classList.add('bg-rose-50/90', 'border-rose-200', 'text-rose-800', 'dark:bg-rose-950/90', 'dark:border-rose-800', 'dark:text-rose-200');
        }

        const icon = document.createElement('i');
        icon.className = type === 'green' ? 'bi bi-check-circle-fill text-emerald-500' : 'bi bi-exclamation-circle-fill text-rose-500';
        toast.appendChild(icon);

        const text = document.createElement('span');
        text.textContent = message;
        toast.appendChild(text);

        container.appendChild(toast);
        toast.offsetHeight; // Force reflow
        toast.classList.remove('translate-y-4', 'opacity-0');
        toast.classList.add('translate-y-0', 'opacity-100');

        setTimeout(() => {
            toast.classList.remove('translate-y-0', 'opacity-100');
            toast.classList.add('translate-y-4', 'opacity-0');
            setTimeout(() => {
                toast.remove();
                if (container.children.length === 0) {
                    container.remove();
                }
            }, 150);
        }, 3000);
    }
});