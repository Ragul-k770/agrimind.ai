document.addEventListener("DOMContentLoaded", () => {
    /* ==========================================================
       1. Leaf Particles Animation (Canvas + requestAnimationFrame)
       ========================================================== */
    const canvas = document.getElementById("leaf-canvas");
    const ctx = canvas.getContext("2d");

    let width, height;
    let leaves = [];

    // Resize canvas exactly to window bounds
    function resizeCanvas() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    }

    window.addEventListener("resize", resizeCanvas);
    resizeCanvas();

    class Leaf {
        constructor() {
            this.x = Math.random() * width;
            this.y = Math.random() * height - height;
            this.size = Math.random() * 6 + 5; // Variation in leaf size
            this.speedY = Math.random() * 1.5 + 0.5; // Downward drop speed
            this.speedX = Math.random() * 0.8 - 0.4; // Base wind drift
            this.angle = Math.random() * Math.PI * 2;
            this.spin = (Math.random() - 0.5) * 0.04;
            // Alternating green hues for leaves
            this.baseColor = Math.random() > 0.6 ? '#00ff9f' : '#22c55e';
            this.opacity = Math.random() * 0.4 + 0.1; // Subtle transparency
        }

        update() {
            this.y += this.speedY;
            // Add a sine wave motion to simulate wind sway
            this.x += this.speedX + Math.sin(this.y * 0.01) * 0.8;
            this.angle += this.spin;

            // Loop leaves back to top when they fall off screen
            if (this.y > height + this.size) {
                this.y = -this.size;
                this.x = Math.random() * width;
            }
            // Loop sides
            if (this.x > width + this.size) this.x = -this.size;
            if (this.x < -this.size) this.x = width + this.size;
        }

        draw() {
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.rotate(this.angle);

            ctx.fillStyle = this.baseColor;
            ctx.globalAlpha = this.opacity;

            // Draw a leaf shape using quadratic bezier curves
            ctx.beginPath();
            ctx.moveTo(0, -this.size);
            ctx.quadraticCurveTo(this.size, -this.size/2, 0, this.size);
            ctx.quadraticCurveTo(-this.size, -this.size/2, 0, -this.size);
            ctx.fill();

            // Optional subtle glow effect
            ctx.shadowBlur = 10;
            ctx.shadowColor = this.baseColor;

            ctx.restore();
        }
    }

    // Initialize the leaf particles
    function initLeaves() {
        leaves = [];
        // Calculate amount relative to screen width, up to 60 leaves
        const leafCount = Math.min(Math.floor(window.innerWidth / 25), 60);
        for (let i = 0; i < leafCount; i++) {
            leaves.push(new Leaf());
        }
    }
    initLeaves();

    // Animation Loop
    function animateCanvas() {
        ctx.clearRect(0, 0, width, height); // Clear whole canvas
        leaves.forEach(leaf => {
            leaf.update();
            leaf.draw();
        });
        requestAnimationFrame(animateCanvas);
    }
    animateCanvas();

    /* ==========================================================
       2. Chat Functionality & Interactions
       ========================================================== */
    const chatMessages = document.getElementById("chat-messages");
    const chatInput = document.getElementById("chat-input");
    const sendBtn = document.getElementById("send-btn");

    // Dynamic AI responses for demonstration
    const aiResponses = [
        "Based on satellite imagery, your field has optimal soil moisture today. Consider delaying irrigation by 2 days.",
        "I've analyzed the weather forecast. A light rain is expected tomorrow evening. Nitrogen fertilization is recommended before the rain.",
        "The market trend for wheat is rising. Holding your crop for another week might yield 5-7% higher returns.",
        "I detect early signs of a nutrient deficiency in the recent uploads. Applying a micronutrient spray immediately is advised.",
        "Your soil pH is currently slightly acidic. Adding lime during the next tilling season will balance it to optimal levels for your cash crops.",
        "Temperature drop alert: Frost is highly likely tonight. Activating your sprinkler systems at 3am can protect the sensitive blossoms.",
        "I matched your query with global indices. Crop rotation with legumes next season will restore soil nitrogen completely naturally."
    ];

    function createTypingIndicator() {
        const indicatorDiv = document.createElement('div');
        indicatorDiv.className = 'message ai-message typing';
        indicatorDiv.innerHTML = `
            <div class="avatar"><i class="fa-solid fa-robot"></i></div>
            <div class="content">
                <div class="typing-indicator">
                    <div class="dot"></div>
                    <div class="dot"></div>
                    <div class="dot"></div>
                </div>
            </div>
        `;
        return indicatorDiv;
    }

    function appendMessage(text, isUser) {
        const msgDiv = document.createElement("div");
        msgDiv.className = `message ${isUser ? 'user-message' : 'ai-message'}`;

        const avatarHTML = isUser
            ? `<div class="avatar"><i class="fa-solid fa-user"></i></div>`
            : `<div class="avatar"><i class="fa-solid fa-robot"></i></div>`;

        msgDiv.innerHTML = `
            ${avatarHTML}
            <div class="content"><p>${text}</p></div>
        `;

        chatMessages.appendChild(msgDiv);
        scrollToBottom();
    }

    function scrollToBottom() {
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    // Main send logic
    function handleSend() {
        const text = chatInput.value.trim();
        if (!text) return; // Do nothing if empty

        // 1. Append User Message
        appendMessage(text, true);
        
        // Reset input immediately
        chatInput.value = '';
        chatInput.focus();

        // 2. Append Typing Indicator
        const typingIndicator = createTypingIndicator();
        chatMessages.appendChild(typingIndicator);
        scrollToBottom();

        // 3. Simulate AI delay
        const typingDelay = 1200 + Math.random() * 1500; // 1.2s to 2.7s typing pause
        
        setTimeout(() => {
            // Remove typing indicator safely
            if (chatMessages.contains(typingIndicator)) {
                chatMessages.removeChild(typingIndicator);
            }

            // Append specific AI response or random one
            const randomResponse = aiResponses[Math.floor(Math.random() * aiResponses.length)];
            const fallbackResponse = "I have recorded that information. How else can I assist with your farming operations?";
            
            // Just output random response for the premium feel demo
            appendMessage(randomResponse, false);
        }, typingDelay);
    }

    // Event Listeners
    sendBtn.addEventListener("click", handleSend);
    
    chatInput.addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
            handleSend();
        }
    });

    // Initial focus on load for best UX
    chatInput.focus();
});
