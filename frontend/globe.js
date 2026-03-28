document.addEventListener('DOMContentLoaded', () => {
    // --------------------------------------------------------
    // REALISTIC 3D EARTH GLOBE INITIALIZATION (THREE.JS)
    // --------------------------------------------------------
    const container = document.getElementById('canvas-container');
    
    // Scene setup
    const scene = new THREE.Scene();
    
    // Camera setup
    const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 4.5; // distance from earth
    
    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);
    
    // --------------------------------------------------------
    // LIGHTING: Ambient & Directional
    // --------------------------------------------------------
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.2); // Soft ambient
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1.2); // Sun effect
    directionalLight.position.set(5, 3, 5);
    scene.add(directionalLight);

    // Minor blue/green fill light for the required neon glow aesthetic
    const pointLight = new THREE.PointLight(0x00ff9f, 0.6, 50);
    pointLight.position.set(-5, 0.5, -2);
    scene.add(pointLight);

    // --------------------------------------------------------
    // 3D GEOMETRY AND TEXTURES
    // --------------------------------------------------------
    const globeGroup = new THREE.Group();
    scene.add(globeGroup);

    const textureLoader = new THREE.TextureLoader();
    textureLoader.setCrossOrigin('anonymous');
    
    const geometry = new THREE.SphereGeometry(1.5, 64, 64);

    // Earth mesh
    const earthMaterial = new THREE.MeshPhongMaterial({
        map: textureLoader.load('https://unpkg.com/three-globe/example/img/earth-blue-marble.jpg'),
        shininess: 12,
    });
    const earth = new THREE.Mesh(geometry, earthMaterial);
    globeGroup.add(earth);

    // Atmosphere halo
    const atmosGeometry = new THREE.SphereGeometry(1.53, 64, 64);
    const atmosMaterial = new THREE.MeshPhongMaterial({
        color: 0x00aaff,
        transparent: true,
        opacity: 0.2,
        blending: THREE.AdditiveBlending,
        side: THREE.BackSide,
        depthWrite: false
    });
    const atmosphere = new THREE.Mesh(atmosGeometry, atmosMaterial);
    globeGroup.add(atmosphere);

    // Tilt Earth precisely
    globeGroup.rotation.z = 23.5 * Math.PI / 180;

    // --------------------------------------------------------
    // ANIMATION & RESIZE EVENTS
    // --------------------------------------------------------
    function animate() {
        requestAnimationFrame(animate);
        // Infinite rotation on Y axis
        globeGroup.rotation.y += 0.0015;
        renderer.render(scene, camera);
    }
    animate();
    
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });

    // --------------------------------------------------------
    // LOGIN FORM SUBMISSION LOGIC
    // --------------------------------------------------------
    const globeLoginForm = document.getElementById("globe-login-form");
    if(globeLoginForm) {
        globeLoginForm.addEventListener("submit", (e) => {
            e.preventDefault();
            
            // Save to Local Storage to pass to the profile dashboard
            const nameInput = document.getElementById('l-name');
            const emailInput = document.getElementById('l-email');
            const passInput = document.getElementById('l-pass');
            const phoneInput = document.getElementById('l-phone');

            if(nameInput) localStorage.setItem('agri_user_name', nameInput.value);
            if(emailInput) localStorage.setItem('agri_user_email', emailInput.value);
            if(passInput) localStorage.setItem('agri_user_pass', passInput.value);
            if(phoneInput) localStorage.setItem('agri_user_phone', phoneInput.value);

            const btn = globeLoginForm.querySelector("button[type='submit']");
            if(btn) btn.style.opacity = "0.5";
            
            setTimeout(() => {
                window.location.href = "dashboard.html";
            }, 800);
        });

        // --------------------------------------------------------
        // SOCIAL LOGINS LOGIC
        // --------------------------------------------------------
        const socialBtns = globeLoginForm.querySelectorAll(".glass-social-btn");
        socialBtns.forEach(btn => {
            // Save original content so we can restore it if needed, or just use textContent
            btn.addEventListener("click", () => {
                const provider = btn.textContent.includes("Google") ? "Google" : "GitHub";
                
                // Simulate an OAuth popup requesting their email
                const email = prompt(`Sign in with ${provider}\n\nPlease enter your email address to continue:`);
                
                if(email && email.includes("@")) {
                    btn.style.opacity = "0.5";
                    btn.style.justifyContent = "center";
                    btn.innerHTML = `<span style="margin:auto; display:block; padding:2px">Connecting ${provider}...</span>`;
                    
                    setTimeout(() => {
                        window.location.href = "dashboard.html";
                    }, 800);
                } else if(email !== null) {
                    alert(`A valid email address is required to proceed with ${provider}.`);
                }
            });
        });
    }
});
