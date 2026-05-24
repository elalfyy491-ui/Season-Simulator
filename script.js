// Season Simulator - Interactive Weather Experience
// Main Application Class

class SeasonSimulator {
    constructor() {
        this.currentSeason = 'spring';
        this.currentWeather = 'sunny';
        this.currentTime = 12;
        this.animationIntensity = 1;
        this.soundEnabled = true;
        this.isFullscreen = false;
        
        this.particles = [];
        this.animationId = null;
        this.audioContext = null;
        this.audioElements = {};
        
        this.init();
    }
    
    init() {
        this.setupCanvas();
        this.setupEventListeners();
        this.setupAudio();
        this.setupCustomCursor();
        this.preloadImages();
        this.startAnimation();
        
        // Initialize with spring/sunny after images load
        setTimeout(() => {
            this.updateEnvironment();
            this.hideLoadingScreen();
        }, 2000);
    }
    
    preloadImages() {
        const imageUrls = [
            'https://images.unsplash.com/photo-1490750967868-88aa4486c946?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80', // Spring day
            'https://images.unsplash.com/photo-1518837695005-2083093ee35b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80', // Spring night
            'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?ixlib=rb-4.0.3&auto=format&fit=crop&w=2073&q=80', // Summer day
            'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80', // Summer night
            'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?ixlib=rb-4.0.3&auto=format&fit=crop&w=2071&q=80', // Autumn day
            'https://images.unsplash.com/photo-1509773896068-7fd415d91e2e?ixlib=rb-4.0.3&auto=format&fit=crop&w=2069&q=80', // Autumn night
            'https://images.unsplash.com/photo-1483664852095-d6cc6870702d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80', // Winter day
            'https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80'  // Winter night
        ];
        
        let loadedCount = 0;
        const totalImages = imageUrls.length;
        
        imageUrls.forEach(url => {
            const img = new Image();
            img.onload = () => {
                loadedCount++;
                const progress = (loadedCount / totalImages) * 100;
                this.updateLoadingProgress(progress);
            };
            img.onerror = () => {
                loadedCount++;
                console.warn(`Failed to load image: ${url}`);
                const progress = (loadedCount / totalImages) * 100;
                this.updateLoadingProgress(progress);
            };
            img.src = url;
        });
    }
    
    updateLoadingProgress(progress) {
        const loadingText = document.querySelector('.loading-text');
        if (loadingText) {
            loadingText.textContent = `Loading magical environment... ${Math.round(progress)}%`;
        }
    }
    
    setupCanvas() {
        this.canvas = document.getElementById('particleCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.resizeCanvas();
        
        window.addEventListener('resize', () => this.resizeCanvas());
    }
    
    resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }
    
    setupEventListeners() {
        // Season buttons
        document.querySelectorAll('.season-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const season = e.currentTarget.dataset.season;
                this.changeSeason(season);
            });
        });
        
        // Weather buttons
        document.querySelectorAll('.weather-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const weather = e.currentTarget.dataset.weather;
                this.changeWeather(weather);
            });
        });
        
        // Time slider
        const timeSlider = document.getElementById('timeSlider');
        timeSlider.addEventListener('input', (e) => {
            this.currentTime = parseFloat(e.target.value);
            this.updateTimeDisplay();
            this.updateEnvironment();
        });
        
        // Intensity slider
        const intensitySlider = document.getElementById('intensitySlider');
        intensitySlider.addEventListener('input', (e) => {
            this.animationIntensity = parseFloat(e.target.value);
        });
        
        // Toggle buttons
        document.getElementById('soundToggle').addEventListener('click', () => {
            this.toggleSound();
        });
        
        document.getElementById('fullscreenToggle').addEventListener('click', () => {
            this.toggleFullscreen();
        });
        
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            this.handleKeyboard(e);
        });
        
        // Enhanced scrollbar interactions
        this.setupScrollbarEffects();
    }
    
    setupScrollbarEffects() {
        const controlPanel = document.getElementById('controlPanel');
        
        // Add scroll-based effects
        controlPanel.addEventListener('scroll', (e) => {
            const scrollPercentage = e.target.scrollTop / (e.target.scrollHeight - e.target.clientHeight);
            this.updateScrollbarGlow(scrollPercentage);
        });
        
        // Add hover effects for scrollbar area
        controlPanel.addEventListener('mouseenter', () => {
            controlPanel.classList.add('scrollbar-active');
        });
        
        controlPanel.addEventListener('mouseleave', () => {
            controlPanel.classList.remove('scrollbar-active');
        });
        
        // Smooth scroll behavior
        controlPanel.style.scrollBehavior = 'smooth';
    }
    
    updateScrollbarGlow(scrollPercentage) {
        const controlPanel = document.getElementById('controlPanel');
        
        // Create dynamic glow based on scroll position
        const hue = scrollPercentage * 60; // 0 to 60 degrees
        const saturation = 50 + (scrollPercentage * 30); // 50% to 80%
        const lightness = 70 + (scrollPercentage * 20); // 70% to 90%
        
        controlPanel.style.setProperty('--scroll-glow', `hsl(${hue}, ${saturation}%, ${lightness}%)`);
    }
    
    setupAudio() {
        this.audioElements = {
            rain: document.getElementById('rainAudio'),
            wind: document.getElementById('windAudio'),
            thunder: document.getElementById('thunderAudio')
        };
        
        // Set initial volumes
        Object.values(this.audioElements).forEach(audio => {
            audio.volume = 0.3;
        });
    }
    
    setupCustomCursor() {
        let mouseX = 0, mouseY = 0;
        let targetX = 0, targetY = 0;
        
        document.addEventListener('mousemove', (e) => {
            targetX = e.clientX;
            targetY = e.clientY;
        });
        
        // Smooth cursor following
        const updateCursor = () => {
            mouseX += (targetX - mouseX) * 0.1;
            mouseY += (targetY - mouseY) * 0.1;
            
            document.documentElement.style.setProperty('--cursor-x', mouseX + 'px');
            document.documentElement.style.setProperty('--cursor-y', mouseY + 'px');
            
            requestAnimationFrame(updateCursor);
        };
        updateCursor();
        
        // Add cursor trail effect
        this.createCursorTrail();
        
        // Add magnetic effect for buttons
        this.addMagneticEffect();
    }
    
    addMagneticEffect() {
        const magneticElements = document.querySelectorAll('.season-btn, .weather-btn, .toggle-btn');
        
        magneticElements.forEach(el => {
            el.addEventListener('mouseenter', (e) => {
                e.target.style.transform = 'scale(1.05)';
            });
            
            el.addEventListener('mouseleave', (e) => {
                e.target.style.transform = 'scale(1)';
            });
            
            el.addEventListener('mousemove', (e) => {
                const rect = e.target.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                
                e.target.style.transform = `scale(1.05) translate(${x * 0.1}px, ${y * 0.1}px)`;
            });
        });
    }
    
    createCursorTrail() {
        const trail = [];
        const trailLength = 10;
        
        document.addEventListener('mousemove', (e) => {
            trail.push({ x: e.clientX, y: e.clientY, time: Date.now() });
            
            if (trail.length > trailLength) {
                trail.shift();
            }
        });
    }
    
    changeSeason(season) {
        if (season === this.currentSeason) return;
        
        this.currentSeason = season;
        
        // Update active button
        document.querySelectorAll('.season-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-season="${season}"]`).classList.add('active');
        
        // Update environment
        this.updateEnvironment();
        this.updateTemperature();
        this.createSeasonTransition();
    }
    
    changeWeather(weather) {
        if (weather === this.currentWeather) return;
        
        this.currentWeather = weather;
        
        // Update active button
        document.querySelectorAll('.weather-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-weather="${weather}"]`).classList.add('active');
        
        // Update environment
        this.updateEnvironment();
        this.updateWeatherEffects();
        this.playWeatherSounds();
    }
    
    updateEnvironment() {
        const environment = document.getElementById('environment');
        const backgroundLayer = document.getElementById('backgroundLayer');
        
        // Remove existing classes
        environment.className = 'environment';
        environment.classList.add(this.currentSeason);
        environment.classList.add(`weather-${this.currentWeather}`);
        
        // Update background based on season and time
        this.updateBackground();
        
        // Update particles
        this.updateParticles();
        
        // Update UI info
        document.getElementById('currentSeason').textContent = 
            this.currentSeason.charAt(0).toUpperCase() + this.currentSeason.slice(1);
        document.getElementById('currentWeather').textContent = 
            this.currentWeather.charAt(0).toUpperCase() + this.currentWeather.slice(1);
    }
    
    updateBackground() {
        const backgroundLayer = document.getElementById('backgroundLayer');
        const atmosphereLayer = document.getElementById('atmosphereLayer');
        const environment = document.getElementById('environment');
        
        // Determine if it's night time (before 6 AM or after 8 PM)
        const isNight = this.currentTime < 6 || this.currentTime > 20;
        
        // Add/remove night mode class
        if (isNight) {
            environment.classList.add('night-mode');
        } else {
            environment.classList.remove('night-mode');
        }
        
        // Apply realistic lighting based on time of day
        this.applyRealisticLighting(backgroundLayer, isNight);
        
        // Weather-specific atmosphere overlays
        this.applyWeatherAtmosphere(atmosphereLayer);
        
        // Add subtle parallax effect for depth
        this.addParallaxEffect();
    }
    
    applyRealisticLighting(backgroundLayer, isNight) {
        let filter = '';
        let overlay = '';
        
        if (isNight) {
            // Night lighting effects
            filter = 'brightness(0.3) contrast(1.3) saturate(0.7) hue-rotate(10deg)';
            overlay = `
                linear-gradient(180deg, 
                    rgba(25, 25, 112, 0.4) 0%, 
                    rgba(0, 0, 0, 0.6) 100%
                )`;
        } else {
            // Day lighting based on time
            const dayProgress = (this.currentTime - 6) / 12; // 0 to 1 from 6 AM to 6 PM
            
            if (this.currentTime >= 6 && this.currentTime <= 8) {
                // Dawn
                filter = 'brightness(0.8) contrast(1.1) saturate(1.2) hue-rotate(-10deg)';
                overlay = `
                    linear-gradient(180deg, 
                        rgba(255, 94, 77, 0.2) 0%, 
                        rgba(255, 154, 0, 0.1) 50%,
                        transparent 100%
                    )`;
            } else if (this.currentTime >= 8 && this.currentTime <= 17) {
                // Midday
                filter = 'brightness(1.1) contrast(1.05) saturate(1.1)';
                overlay = `
                    linear-gradient(180deg, 
                        rgba(135, 206, 235, 0.1) 0%, 
                        transparent 60%
                    )`;
            } else if (this.currentTime >= 17 && this.currentTime <= 20) {
                // Sunset
                filter = 'brightness(0.9) contrast(1.2) saturate(1.3) hue-rotate(15deg)';
                overlay = `
                    linear-gradient(180deg, 
                        rgba(255, 69, 0, 0.3) 0%, 
                        rgba(255, 140, 0, 0.2) 40%,
                        rgba(255, 20, 147, 0.1) 70%,
                        transparent 100%
                    )`;
            }
        }
        
        backgroundLayer.style.filter = filter;
        
        // Apply lighting overlay
        if (!backgroundLayer.querySelector('.lighting-overlay')) {
            const lightingOverlay = document.createElement('div');
            lightingOverlay.className = 'lighting-overlay';
            lightingOverlay.style.cssText = `
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                pointer-events: none;
                z-index: 3;
                transition: all 1s ease;
            `;
            backgroundLayer.appendChild(lightingOverlay);
        }
        
        const lightingOverlay = backgroundLayer.querySelector('.lighting-overlay');
        lightingOverlay.style.background = overlay;
    }
    
    applyWeatherAtmosphere(atmosphereLayer) {
        let weatherOverlay = '';
        
        switch (this.currentWeather) {
            case 'rain':
                weatherOverlay = `
                    radial-gradient(ellipse at center, rgba(0, 0, 0, 0.3) 0%, rgba(0, 0, 0, 0.6) 100%),
                    linear-gradient(180deg, rgba(105, 105, 105, 0.4) 0%, rgba(47, 79, 79, 0.2) 100%)
                `;
                break;
            case 'thunderstorm':
                weatherOverlay = `
                    radial-gradient(ellipse at center, rgba(0, 0, 0, 0.5) 0%, rgba(0, 0, 0, 0.8) 100%),
                    linear-gradient(180deg, rgba(25, 25, 112, 0.3) 0%, rgba(0, 0, 0, 0.4) 100%)
                `;
                break;
            case 'fog':
                weatherOverlay = `
                    radial-gradient(ellipse at center, rgba(255, 255, 255, 0.4) 0%, rgba(255, 255, 255, 0.1) 70%, transparent 100%),
                    linear-gradient(180deg, rgba(248, 248, 255, 0.3) 0%, rgba(230, 230, 250, 0.1) 100%)
                `;
                break;
            case 'snow':
                weatherOverlay = `
                    radial-gradient(ellipse at center, rgba(255, 255, 255, 0.2) 0%, rgba(240, 248, 255, 0.1) 100%),
                    linear-gradient(180deg, rgba(176, 196, 222, 0.2) 0%, transparent 100%)
                `;
                break;
            case 'wind':
                weatherOverlay = `
                    linear-gradient(45deg, 
                        rgba(255, 255, 255, 0.05) 0%, 
                        transparent 30%, 
                        rgba(255, 255, 255, 0.05) 60%, 
                        transparent 100%
                    )
                `;
                break;
            default: // sunny
                weatherOverlay = `
                    radial-gradient(ellipse at 70% 20%, rgba(255, 215, 0, 0.15) 0%, transparent 50%),
                    linear-gradient(180deg, rgba(135, 206, 235, 0.1) 0%, transparent 40%)
                `;
        }
        
        atmosphereLayer.style.background = weatherOverlay;
    }
    
    addParallaxEffect() {
        // Add subtle mouse-based parallax for depth
        document.addEventListener('mousemove', (e) => {
            const mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
            const mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
            
            const backgroundLayer = document.getElementById('backgroundLayer');
            const atmosphereLayer = document.getElementById('atmosphereLayer');
            
            // Subtle parallax movement
            backgroundLayer.style.transform = `translate(${mouseX * 10}px, ${mouseY * 5}px) scale(1.05)`;
            atmosphereLayer.style.transform = `translate(${mouseX * 5}px, ${mouseY * 2.5}px)`;
        });
    }
    
    getTimeBasedGradient(gradients) {
        // Simple day/night transition based on time
        const dayGradient = gradients[0];
        const nightGradient = gradients[1];
        
        if (this.currentTime >= 6 && this.currentTime <= 18) {
            return dayGradient;
        } else {
            return nightGradient;
        }
    }
    
    updateParticles() {
        this.particles = [];
        
        // Create particles based on weather and season
        const particleCount = Math.floor(100 * this.animationIntensity);
        
        for (let i = 0; i < particleCount; i++) {
            this.particles.push(this.createParticle());
        }
    }
    
    createParticle() {
        const particle = {
            x: Math.random() * this.canvas.width,
            y: Math.random() * this.canvas.height,
            size: Math.random() * 4 + 1,
            speedX: (Math.random() - 0.5) * 2,
            speedY: Math.random() * 2 + 1,
            opacity: Math.random() * 0.8 + 0.2,
            color: this.getParticleColor(),
            type: this.getParticleType()
        };
        
        return particle;
    }
    
    getParticleColor() {
        const colors = {
            spring: ['#ffffff', '#ffb3ba', '#bae1ff', '#ffffba'],
            summer: ['#fff2cc', '#ffcc99', '#ffffff', '#ffe066'],
            autumn: ['#ffa500', '#ff6347', '#daa520', '#cd853f'],
            winter: ['#ffffff', '#e6f3ff', '#b3d9ff', '#ccebff']
        };
        
        const seasonColors = colors[this.currentSeason];
        return seasonColors[Math.floor(Math.random() * seasonColors.length)];
    }
    
    getParticleType() {
        if (this.currentWeather === 'rain') return 'rain';
        if (this.currentWeather === 'snow') return 'snow';
        if (this.currentWeather === 'wind') return 'leaf';
        return 'default';
    }
    
    updateWeatherEffects() {
        // Reset all weather effects
        document.querySelectorAll('.weather-effects > div').forEach(el => {
            el.style.opacity = '0';
        });
        
        // Apply current weather effect
        switch (this.currentWeather) {
            case 'rain':
                this.createRainEffect();
                break;
            case 'snow':
                this.createSnowEffect();
                break;
            case 'fog':
                document.getElementById('fogOverlay').style.opacity = '0.7';
                break;
            case 'thunderstorm':
                this.createThunderstormEffect();
                break;
        }
    }
    
    createRainEffect() {
        const rainContainer = document.getElementById('rainContainer');
        rainContainer.style.opacity = '1';
        rainContainer.innerHTML = '';
        
        // Create more realistic rain with varying intensities
        for (let i = 0; i < 150; i++) {
            const drop = document.createElement('div');
            const intensity = Math.random();
            const size = intensity * 3 + 1;
            const speed = intensity * 2 + 1;
            
            drop.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size * 8}px;
                background: linear-gradient(transparent, rgba(173, 216, 230, ${0.3 + intensity * 0.4}), transparent);
                left: ${Math.random() * 100}%;
                border-radius: 50%;
                animation: rainFall ${speed}s linear infinite;
                animation-delay: ${Math.random() * 3}s;
                transform: rotate(${Math.random() * 10 - 5}deg);
            `;
            rainContainer.appendChild(drop);
        }
        
        // Add rain puddle effects
        this.createPuddleEffects();
        
        // Add rain animation CSS
        if (!document.getElementById('rainAnimation')) {
            const style = document.createElement('style');
            style.id = 'rainAnimation';
            style.textContent = `
                @keyframes rainFall {
                    0% { 
                        transform: translateY(-100vh) translateX(0px); 
                        opacity: 0; 
                    }
                    5% { opacity: 1; }
                    95% { opacity: 1; }
                    100% { 
                        transform: translateY(100vh) translateX(50px); 
                        opacity: 0; 
                    }
                }
                
                @keyframes puddleRipple {
                    0% { 
                        transform: scale(0); 
                        opacity: 0.8; 
                    }
                    100% { 
                        transform: scale(1); 
                        opacity: 0; 
                    }
                }
            `;
            document.head.appendChild(style);
        }
    }
    
    createPuddleEffects() {
        const puddleContainer = document.createElement('div');
        puddleContainer.className = 'puddle-container';
        puddleContainer.style.cssText = `
            position: absolute;
            bottom: 0;
            left: 0;
            width: 100%;
            height: 20%;
            pointer-events: none;
            z-index: 5;
        `;
        
        document.getElementById('rainContainer').appendChild(puddleContainer);
        
        // Create ripple effects
        setInterval(() => {
            if (this.currentWeather === 'rain' || this.currentWeather === 'thunderstorm') {
                const ripple = document.createElement('div');
                ripple.style.cssText = `
                    position: absolute;
                    width: 20px;
                    height: 20px;
                    border: 2px solid rgba(173, 216, 230, 0.6);
                    border-radius: 50%;
                    left: ${Math.random() * 100}%;
                    bottom: ${Math.random() * 50}px;
                    animation: puddleRipple 1s ease-out forwards;
                `;
                puddleContainer.appendChild(ripple);
                
                setTimeout(() => {
                    if (puddleContainer.contains(ripple)) {
                        puddleContainer.removeChild(ripple);
                    }
                }, 1000);
            }
        }, 300);
    }
    
    createSnowEffect() {
        const snowContainer = document.getElementById('snowContainer');
        snowContainer.style.opacity = '1';
        snowContainer.innerHTML = '';
        
        // Create more realistic snow with different sizes and falling patterns
        for (let i = 0; i < 80; i++) {
            const flake = document.createElement('div');
            const size = Math.random() * 12 + 3;
            const opacity = Math.random() * 0.8 + 0.2;
            const drift = Math.random() * 100 - 50;
            
            flake.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                background: radial-gradient(circle, rgba(255, 255, 255, ${opacity}) 0%, rgba(255, 255, 255, ${opacity * 0.3}) 70%, transparent 100%);
                border-radius: 50%;
                left: ${Math.random() * 100}%;
                animation: snowFall ${Math.random() * 4 + 3}s linear infinite;
                animation-delay: ${Math.random() * 4}s;
                box-shadow: 0 0 ${size/2}px rgba(255, 255, 255, 0.5);
            `;
            snowContainer.appendChild(flake);
        }
        
        // Add snow accumulation effect at bottom
        this.createSnowAccumulation();
        
        // Add snow animation CSS
        if (!document.getElementById('snowAnimation')) {
            const style = document.createElement('style');
            style.id = 'snowAnimation';
            style.textContent = `
                @keyframes snowFall {
                    0% { 
                        transform: translateY(-100vh) translateX(0px) rotate(0deg); 
                        opacity: 0; 
                    }
                    10% { opacity: 1; }
                    90% { opacity: 1; }
                    100% { 
                        transform: translateY(100vh) translateX(${Math.random() * 200 - 100}px) rotate(360deg); 
                        opacity: 0; 
                    }
                }
                
                @keyframes snowAccumulate {
                    0% { height: 0; opacity: 0; }
                    100% { height: 30px; opacity: 0.8; }
                }
            `;
            document.head.appendChild(style);
        }
    }
    
    createSnowAccumulation() {
        const accumulation = document.createElement('div');
        accumulation.className = 'snow-accumulation';
        accumulation.style.cssText = `
            position: absolute;
            bottom: 0;
            left: 0;
            width: 100%;
            height: 0;
            background: linear-gradient(180deg, 
                rgba(255, 255, 255, 0) 0%, 
                rgba(255, 255, 255, 0.3) 50%, 
                rgba(255, 255, 255, 0.8) 100%
            );
            animation: snowAccumulate 10s ease-out forwards;
            pointer-events: none;
            z-index: 6;
        `;
        
        document.getElementById('snowContainer').appendChild(accumulation);
    }
    
    createThunderstormEffect() {
        const lightningFlash = document.getElementById('lightningFlash');
        
        // Random lightning flashes
        const flashInterval = setInterval(() => {
            if (this.currentWeather !== 'thunderstorm') {
                clearInterval(flashInterval);
                return;
            }
            
            lightningFlash.style.opacity = '1';
            setTimeout(() => {
                lightningFlash.style.opacity = '0';
            }, 100);
            
            // Play thunder sound after flash
            setTimeout(() => {
                if (this.soundEnabled && this.audioElements.thunder) {
                    this.audioElements.thunder.currentTime = 0;
                    this.audioElements.thunder.play().catch(() => {});
                }
            }, 500);
            
        }, Math.random() * 5000 + 3000);
    }
    
    playWeatherSounds() {
        // Stop all sounds first
        Object.values(this.audioElements).forEach(audio => {
            audio.pause();
            audio.currentTime = 0;
        });
        
        if (!this.soundEnabled) return;
        
        // Play appropriate sound
        switch (this.currentWeather) {
            case 'rain':
            case 'thunderstorm':
                if (this.audioElements.rain) {
                    this.audioElements.rain.play().catch(() => {});
                }
                break;
            case 'wind':
                if (this.audioElements.wind) {
                    this.audioElements.wind.play().catch(() => {});
                }
                break;
        }
    }
    
    updateTemperature() {
        const temperatures = {
            spring: { min: 15, max: 25 },
            summer: { min: 25, max: 35 },
            autumn: { min: 10, max: 20 },
            winter: { min: -5, max: 10 }
        };
        
        const range = temperatures[this.currentSeason];
        const temp = Math.floor(Math.random() * (range.max - range.min + 1)) + range.min;
        
        document.getElementById('temperature').textContent = `${temp}°C`;
    }
    
    updateTimeDisplay() {
        const hours = Math.floor(this.currentTime);
        const minutes = Math.floor((this.currentTime - hours) * 60);
        const timeString = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
        document.getElementById('timeDisplay').textContent = timeString;
    }
    
    createSeasonTransition() {
        // Create a smooth transition effect between seasons
        const transitionOverlay = document.createElement('div');
        transitionOverlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.4) 0%, transparent 70%);
            z-index: 999;
            opacity: 0;
            pointer-events: none;
            transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
        `;
        
        document.body.appendChild(transitionOverlay);
        
        // Create sparkle particles during transition
        this.createTransitionSparkles();
        
        // Animate transition
        setTimeout(() => {
            transitionOverlay.style.opacity = '1';
            transitionOverlay.style.transform = 'scale(1.2)';
        }, 10);
        
        setTimeout(() => {
            transitionOverlay.style.opacity = '0';
            transitionOverlay.style.transform = 'scale(0.8)';
        }, 400);
        
        setTimeout(() => {
            document.body.removeChild(transitionOverlay);
        }, 1200);
    }
    
    createTransitionSparkles() {
        const sparkleContainer = document.createElement('div');
        sparkleContainer.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 1001;
        `;
        
        document.body.appendChild(sparkleContainer);
        
        // Create sparkle particles
        for (let i = 0; i < 20; i++) {
            const sparkle = document.createElement('div');
            sparkle.style.cssText = `
                position: absolute;
                width: 4px;
                height: 4px;
                background: radial-gradient(circle, rgba(255, 255, 255, 1) 0%, transparent 70%);
                border-radius: 50%;
                left: ${Math.random() * 100}%;
                top: ${Math.random() * 100}%;
                animation: sparkleFloat 1s ease-out forwards;
                animation-delay: ${Math.random() * 0.5}s;
            `;
            sparkleContainer.appendChild(sparkle);
        }
        
        // Add sparkle animation
        if (!document.getElementById('sparkleAnimation')) {
            const style = document.createElement('style');
            style.id = 'sparkleAnimation';
            style.textContent = `
                @keyframes sparkleFloat {
                    0% { 
                        opacity: 0; 
                        transform: scale(0) rotate(0deg); 
                    }
                    50% { 
                        opacity: 1; 
                        transform: scale(1) rotate(180deg); 
                    }
                    100% { 
                        opacity: 0; 
                        transform: scale(0) rotate(360deg); 
                    }
                }
            `;
            document.head.appendChild(style);
        }
        
        // Remove sparkles after animation
        setTimeout(() => {
            document.body.removeChild(sparkleContainer);
        }, 1500);
    }
    
    toggleSound() {
        this.soundEnabled = !this.soundEnabled;
        const soundToggle = document.getElementById('soundToggle');
        
        soundToggle.classList.toggle('active', this.soundEnabled);
        soundToggle.querySelector('.toggle-icon').textContent = this.soundEnabled ? '🔊' : '🔇';
        
        if (!this.soundEnabled) {
            Object.values(this.audioElements).forEach(audio => {
                audio.pause();
            });
        } else {
            this.playWeatherSounds();
        }
    }
    
    toggleFullscreen() {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch(() => {});
            this.isFullscreen = true;
        } else {
            document.exitFullscreen().catch(() => {});
            this.isFullscreen = false;
        }
        
        const fullscreenToggle = document.getElementById('fullscreenToggle');
        fullscreenToggle.classList.toggle('active', this.isFullscreen);
    }
    
    handleKeyboard(e) {
        switch (e.key) {
            case '1':
                this.changeSeason('spring');
                break;
            case '2':
                this.changeSeason('summer');
                break;
            case '3':
                this.changeSeason('autumn');
                break;
            case '4':
                this.changeSeason('winter');
                break;
            case 's':
                this.toggleSound();
                break;
            case 'f':
                this.toggleFullscreen();
                break;
            case 'Escape':
                if (document.fullscreenElement) {
                    this.toggleFullscreen();
                }
                break;
        }
    }
    
    startAnimation() {
        const animate = () => {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            
            // Update and draw particles
            this.particles.forEach((particle, index) => {
                this.updateParticle(particle);
                this.drawParticle(particle);
                
                // Remove particles that are off-screen
                if (particle.y > this.canvas.height + 50 || 
                    particle.x < -50 || 
                    particle.x > this.canvas.width + 50) {
                    this.particles[index] = this.createParticle();
                    this.particles[index].y = -50;
                }
            });
            
            this.animationId = requestAnimationFrame(animate);
        };
        
        animate();
    }
    
    updateParticle(particle) {
        particle.x += particle.speedX * this.animationIntensity;
        particle.y += particle.speedY * this.animationIntensity;
        
        // Add some drift based on weather
        if (this.currentWeather === 'wind') {
            particle.x += Math.sin(Date.now() * 0.001 + particle.x * 0.01) * 0.5;
        }
        
        // Fade particles based on weather
        if (this.currentWeather === 'fog') {
            particle.opacity *= 0.999;
        }
    }
    
    drawParticle(particle) {
        this.ctx.save();
        this.ctx.globalAlpha = particle.opacity;
        
        if (particle.type === 'rain') {
            // Draw rain drop
            this.ctx.strokeStyle = particle.color;
            this.ctx.lineWidth = 1;
            this.ctx.beginPath();
            this.ctx.moveTo(particle.x, particle.y);
            this.ctx.lineTo(particle.x - 2, particle.y - 10);
            this.ctx.stroke();
        } else if (particle.type === 'snow') {
            // Draw snowflake
            this.ctx.fillStyle = particle.color;
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            this.ctx.fill();
        } else if (particle.type === 'leaf') {
            // Draw leaf
            this.ctx.fillStyle = particle.color;
            this.ctx.save();
            this.ctx.translate(particle.x, particle.y);
            this.ctx.rotate(Date.now() * 0.001 + particle.x * 0.01);
            this.ctx.fillRect(-particle.size/2, -particle.size/2, particle.size, particle.size);
            this.ctx.restore();
        } else {
            // Draw default particle
            this.ctx.fillStyle = particle.color;
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            this.ctx.fill();
        }
        
        this.ctx.restore();
    }
    
    hideLoadingScreen() {
        setTimeout(() => {
            const loadingScreen = document.getElementById('loadingScreen');
            loadingScreen.classList.add('hidden');
        }, 1500);
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new SeasonSimulator();
});

// Custom cursor movement
document.addEventListener('mousemove', (e) => {
    const cursor = document.querySelector('body::after');
    document.documentElement.style.setProperty('--cursor-x', e.clientX + 'px');
    document.documentElement.style.setProperty('--cursor-y', e.clientY + 'px');
});

// Add cursor position CSS variables
document.documentElement.style.setProperty('--cursor-x', '0px');
document.documentElement.style.setProperty('--cursor-y', '0px');