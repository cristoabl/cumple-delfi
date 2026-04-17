// Setup background music toggle
const musicToggle = document.getElementById('musicToggle');
const bgMusic = document.getElementById('bgMusic');

if (musicToggle && bgMusic) {
    // Optionally try to auto-play but mostly browsers block this, so the user has to click
    musicToggle.addEventListener('click', () => {
        if (bgMusic.paused) {
            bgMusic.play();
            musicToggle.classList.add('playing');
            localStorage.setItem('music_playing', 'true');
        } else {
            bgMusic.pause();
            musicToggle.classList.remove('playing');
            localStorage.setItem('music_playing', 'false');
        }
    });

    // Start playing if it was playing previously or if user interacts
    document.body.addEventListener('click', () => {
        if (localStorage.getItem('music_playing') === 'true' && bgMusic.paused) {
            bgMusic.play();
            musicToggle.classList.add('playing');
        }
    }, { once: true });
}

// Set the date we're counting down to (May 9, 2026 13:30:00 - Argentina Time)
const countDownDate = new Date("2026-05-09T13:30:00-03:00").getTime();

// Update the count down every 1 second
const x = setInterval(function () {

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

// ==========================================
// CONFIGURACIÓN DE SUPABASE (RSVP)
// ==========================================
// AQUÍ DEBES PONER TUS CREDENCIALES DE SUPABASE:
const SUPABASE_URL = 'https://yaamlnxagnqshksjuvom.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_dSK5g5wre2liZuttLHNq5w_mPWMVy3G';

if (window.supabase) {
    // Inicializar cliente
    const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

    // Configurar listener del formulario
    document.getElementById('rsvp-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const inputName = document.getElementById('guest-name').value.trim();
        const btn = document.getElementById('submit-btn');
        const msgDiv = document.getElementById('rsvp-message');

        if (!inputName) return;

        // Limpiar mensajes y bloquear boton
        btn.disabled = true;
        btn.innerText = "Enviando...";
        msgDiv.className = "message hidden";

        // Preparar el nombre para guardar (normalizado)
        try {
            // 1. Obtener lista actual para verificar apodos o similitudes (ej: Gabi vs Gabriela)
            const { data: invitadosActuales, error: fetchError } = await supabaseClient
                .from('invitados')
                .select('nombre_completo');
                
            if (!fetchError && invitadosActuales) {
                const isDuplicate = invitadosActuales.some(invitado => 
                    isNameSimilar(invitado.nombre_completo, inputName)
                );

                if (isDuplicate) {
                    showMessage(`¡Hola ${inputName}! Parece que tu asistencia (o la de alguien con tu mismo nombre/apodo) ya estaba confirmada en la lista mágica. ✨`, 'error');
                    btn.disabled = false;
                    btn.innerText = "¡Asistiré!";
                    return; // Detener ejecución
                }
            }

            // 2. Si no hay duplicados similares, intentar insertar
            const { data, error } = await supabaseClient
                .from('invitados')
                .insert([
                    { nombre_completo: inputName, estado: 'Confirmado' }
                ]);

            if (error) {
                // Código 23505 es violación de restricción "UNIQUE" en PostgreSQL
                if (error.code === '23505') {
                    showMessage(`¡Hola ${inputName}! Tu asistencia ya estaba confirmada en la lista mágica. ✨`, 'error');
                } else if (error.message.includes('FetchError') || SUPABASE_URL.includes('TU-PROYECTO')) {
                    showMessage('Falta configurar las credenciales de Supabase. El desarrollador te explicará cómo hacerlo.', 'error');
                } else {
                    showMessage('Hubo un error al confirmar. Intenta de nuevo más tarde.', 'error');
                    console.error(error);
                }
            } else {
                showMessage(`¡Perfecto ${inputName}! Tu lugar en la mesa del Sombrerero está asegurado. 🫖🎩`, 'success');
                document.getElementById('guest-name').value = ''; // Limpiar
            }
        } catch (err) {
            showMessage('Error de red. Revisa tu conexión.', 'error');
        } finally {
            btn.disabled = false;
            btn.innerText = "¡Asistiré!";
        }
    });
}

function showMessage(text, type) {
    const msgDiv = document.getElementById('rsvp-message');
    msgDiv.innerText = text;
    msgDiv.className = `message ${type}`;
}

// Lógica inteligente para detectar apodos (Gabi Dodelson == Gabriela Dodelson)
function isNameSimilar(n1, n2) {
    // Normalizar: Minúsculas y sin tildes
    const normalize = (s) => s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();
    
    const str1 = normalize(n1);
    const str2 = normalize(n2);

    if (str1 === str2) return true; // Directamente iguales

    const words1 = str1.split(/\s+/);
    const words2 = str2.split(/\s+/);
    
    // Si ambos tienen al menos nombre + apellido
    if (words1.length >= 2 && words2.length >= 2) {
        const last1 = words1[words1.length - 1]; // Apellido 1
        const last2 = words2[words2.length - 1]; // Apellido 2
        
        // Si el apellido es exactamente igual
        if (last1 === last2) {
            const first1 = words1[0]; // Nombre 1
            const first2 = words2[0]; // Nombre 2
            
            // Ver si un nombre contiene al otro (Ej: Gabriela arranca con Gabi o Ga)
            // Solo si la coincidencia es de más de 2 letras para cubrir casos como 'Ga'
            if (first1.length >= 2 && first2.length >= 2) {
                if (first1.startsWith(first2) || first2.startsWith(first1)) {
                    return true;
                }
            }
        }
    }
    
    return false;
}

// Initialize particles on load
window.onload = createParticles;
