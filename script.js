// Set the date we're counting down to (May 9, 2026 13:30:00)
const countDownDate = new Date("May 9, 2026 13:30:00").getTime();

// Update the count down every 1 second
const x = setInterval(function() {

  // Get today's date and time
  const now = new Date().getTime();

  // Find the distance between now and the count down date
  const distance = countDownDate - now;

  // Time calculations for days, hours, minutes and seconds
  const days = Math.floor(distance / (1000 * 60 * 60 * 24));
  const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((distance % (1000 * 60)) / 1000);

  // Display the result in the elements
  document.getElementById("days").innerHTML = days < 10 ? '0' + days : days;
  document.getElementById("hours").innerHTML = hours < 10 ? '0' + hours : hours;
  document.getElementById("minutes").innerHTML = minutes < 10 ? '0' + minutes : minutes;
  document.getElementById("seconds").innerHTML = seconds < 10 ? '0' + seconds : seconds;

  // If the count down is finished, write some text
  if (distance < 0) {
    clearInterval(x);
    document.getElementById("countdown").innerHTML = "<div class='time-box'><span>¡Es HOY!</span></div>";
  }
}, 1000);

// Generate magical particles
function createParticles() {
    const container = document.getElementById('particles');
    const particleCount = 25;

    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.classList.add('particle');
        
        // Random size between 2px and 8px
        const size = Math.random() * 6 + 2;
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        
        // Random position
        particle.style.left = `${Math.random() * 100}%`;
        particle.style.top = `${Math.random() * 100}%`;
        
        // Random animation duration between 3s and 8s
        particle.style.setProperty('--duration', `${Math.random() * 5 + 3}s`);
        
        // Random opacity
        particle.style.setProperty('--opacity', Math.random() * 0.5 + 0.3);
        
        // Random animation delay
        particle.style.animationDelay = `${Math.random() * 5}s`;
        
        container.appendChild(particle);
    }
}

// Open Google Maps link
function openMap() {
    // Salón Casa Soñada: Gdor. Félix Garzón 2054
    const address = "Gdor. Félix Garzón 2054";
    const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
    window.open(googleMapsUrl, '_blank');
}

// Initialize particles on load
window.onload = createParticles;
