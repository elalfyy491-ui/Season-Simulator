# Season Simulator - Immersive Weather Experience

A cinematic, interactive weather and season simulator that creates magical, atmospheric environments with smooth transitions, particle effects, and immersive sound design.

![Season Simulator Preview](https://img.shields.io/badge/Status-Ready-brightgreen) ![HTML5](https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white) ![CSS3](https://img.shields.io/badge/CSS3-1572B6?logo=css3&logoColor=white) ![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=black)

## Features

### **Cinematic Visual Experience**
- **Glassmorphism UI** with blur effects and soft gradients
- **Dynamic backgrounds** that change based on season and time of day
- **Smooth transitions** between seasons with Apple-quality motion design
- **Particle systems** for rain, snow, leaves, and atmospheric effects
- **Custom cursor** with magnetic hover interactions

### **Weather Simulation**
- **6 Weather Modes**: Sunny, Rain, Snow, Wind, Thunderstorm, Fog
- **4 Seasons**: Spring, Summer, Autumn, Winter
- **Real-time effects**: Lightning flashes, falling particles, atmospheric overlays
- **Dynamic lighting** that responds to time of day and weather conditions

### **Atmospheric Sound Design**
- **Ambient audio** for each weather condition
- **Thunder sounds** synchronized with lightning flashes
- **Smooth audio transitions** and volume controls
- **Mute/unmute toggle** with visual feedback

### **Interactive Controls**
- **Season switcher** with animated buttons
- **Weather controls** with instant effect changes
- **Time of day slider** (24-hour cycle)
- **Animation intensity** adjustment
- **Fullscreen mode** for complete immersion

### **Responsive Design**
- **Mobile-optimized** interface and performance
- **Touch-friendly** controls on all devices
- **Adaptive layouts** for different screen sizes
- **Performance optimization** for smooth animations

## Quick Start

1. **Clone or download** the project files
2. **Open `index.html`** in a modern web browser
3. **Allow audio** when prompted for the full experience
4. **Interact** with the season and weather controls
5. **Press F** for fullscreen or **S** to toggle sound

## Controls

### **Mouse Controls**
- **Click season buttons** to switch between Spring, Summer, Autumn, Winter
- **Click weather buttons** to change weather conditions
- **Drag sliders** to adjust time of day and animation intensity
- **Hover effects** on all interactive elements

### **Keyboard Shortcuts**
- **1, 2, 3, 4** - Switch to Spring, Summer, Autumn, Winter
- **S** - Toggle sound on/off
- **F** - Toggle fullscreen mode
- **Escape** - Exit fullscreen

## Technical Details

### **Built With**
- **Pure HTML5, CSS3, JavaScript** - No frameworks or dependencies
- **Canvas API** for particle rendering
- **Web Audio API** for sound management
- **CSS Custom Properties** for dynamic theming
- **RequestAnimationFrame** for smooth animations

### **Performance Features**
- **GPU-accelerated transforms** for smooth animations
- **Optimized particle systems** with object pooling
- **Throttled resize events** for responsive performance
- **Lazy-loaded assets** for faster initial load
- **Mobile performance optimizations**

### **Browser Compatibility**
- **Chrome/Edge** 88+ (Recommended)
- **Firefox** 85+
- **Safari** 14+
- **Mobile browsers** with WebGL support

## Project Structure

```
season-simulator/
├── index.html          # Main HTML structure
├── style.css           # Styling and animations
├── script.js           # Core JavaScript functionality
├── assets/             # Audio and image assets
│   ├── audio/          # Weather sound effects
│   └── images/         # Background images (optional)
└── README.md           # This file
```

## Customization

### **Adding New Seasons**
1. Add season data to the `seasonGradients` object in `script.js`
2. Create corresponding CSS classes in `style.css`
3. Add season button to the HTML structure

### **Custom Weather Effects**
1. Extend the `updateWeatherEffects()` method
2. Add new particle types in `getParticleType()`
3. Create CSS animations for new effects

### **Audio Integration**
1. Add audio files to the `assets/audio/` directory
2. Update the `setupAudio()` method to include new sounds
3. Modify `playWeatherSounds()` to handle new audio

### **Styling Modifications**
- Modify CSS custom properties in `:root` for global theme changes
- Adjust glassmorphism effects by changing backdrop-filter values
- Customize particle colors in the `getParticleColor()` method

## Advanced Features

### **Particle System**
- **Dynamic particle generation** based on weather conditions
- **Physics-based movement** with wind effects
- **Depth simulation** with varying sizes and speeds
- **Performance scaling** based on device capabilities

### **Atmospheric Effects**
- **Time-based lighting** that changes throughout the day
- **Weather-specific atmospheres** (fog, storm clouds, clear skies)
- **Seasonal color palettes** with smooth transitions
- **Ambient lighting** that responds to weather conditions

### **User Experience**
- **Smooth state transitions** between all modes
- **Visual feedback** for all interactions
- **Accessibility considerations** with reduced motion support
- **Loading states** with elegant animations

## Development

### **Local Development**
1. Serve files through a local web server (required for audio)
2. Use browser developer tools for debugging
3. Test on multiple devices and browsers
4. Monitor performance with browser profiling tools

### **Adding Audio Files**
Due to browser security restrictions, audio files need to be served from a web server. For local development:

```bash
# Using Python
python -m http.server 8000

# Using Node.js
npx serve .

# Using PHP
php -S localhost:8000
```

## License

This project is open source and available under the [MIT License](LICENSE).

## Contributing

Contributions are welcome! Please feel free to submit pull requests or open issues for:
- New weather effects
- Additional seasons
- Performance improvements
- Bug fixes
- Feature enhancements

## Roadmap

- [ ] **Real weather integration** with API data
- [ ] **Music playlist** integration
- [ ] **VR/AR support** for immersive experiences
- [ ] **Social sharing** of favorite combinations
- [ ] **Preset collections** for different moods
- [ ] **Advanced particle physics** with WebGL
- [ ] **AI-generated weather patterns**

---

**Enjoy your magical weather journey!**

*Created with love for those who love beautiful, interactive experiences.*