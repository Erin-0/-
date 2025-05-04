 // --- START OF FILE script.js ---

document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const themeToggle = document.getElementById('theme-toggle');
    const themeIcon = themeToggle.querySelector('i');
    const topicInput = document.getElementById('topic-input');
    const wordCount = document.getElementById('word-count');
    const submitBtn = document.getElementById('submit-btn');
    const topicForm = document.getElementById('topic-form');
    const loadingSection = document.getElementById('loading');
    const resultSection = document.getElementById('result-section');
    // Get the new image container instead of the video element
    const resultImagesContainer = document.getElementById('result-images');
    // const resultVideo = document.getElementById('result-video'); // Removed or repurposed
    // const downloadBtn = document.getElementById('download-btn'); // Removed or repurposed
    const catHelper = document.getElementById('cat-helper');
    const logoImg = document.getElementById('logo-img');
    const catHelperImg = document.getElementById('cat-helper-img');
    const step1Img = document.getElementById('step1-img');
    const step2Img = document.getElementById('step2-img');
    const step3Img = document.getElementById('step3-img');

    // 🚨🚨 WARNING: EXPOSING API KEYS IN FRONTEND CODE IS INSECURE! 🚨🚨
    // This key can be stolen easily. Use a backend server for production.
    // This is included for demonstration/testing purposes ONLY.
    const STARRYAI_API_KEY = '_lSPpLYCpwGobfyd-uIIZBtCrIdgLg'; // Replace with your actual key if needed

    // Create animated background
    createAnimatedBackground();

    // Check for saved theme preference
    if (localStorage.getItem('darkMode') === 'enabled') {
        document.body.classList.add('dark-mode');
        themeIcon.classList.remove('fa-moon');
        themeIcon.classList.add('fa-sun');
        updateImageTheme(true);
    } else {
        updateImageTheme(false);
    }

    // Theme Toggle Functionality
    themeToggle.addEventListener('click', function() {
        document.body.classList.toggle('dark-mode');

        if (document.body.classList.contains('dark-mode')) {
            themeIcon.classList.remove('fa-moon');
            themeIcon.classList.add('fa-sun');
            localStorage.setItem('darkMode', 'enabled');
            updateImageTheme(true);
        } else {
            themeIcon.classList.remove('fa-sun');
            themeIcon.classList.add('fa-moon');
            localStorage.setItem('darkMode', 'disabled');
            updateImageTheme(false);
        }
    });

    // Word Count Validation
    topicInput.addEventListener('input', function() {
        const words = this.value.trim().split(/\s+/).filter(word => word !== '');
        const wordNum = words.length;

        wordCount.textContent = wordNum;

        // Adjust word limit if needed for image generation prompts
        if (wordNum > 0 && wordNum <= 30) { // Increased limit slightly for prompts
            submitBtn.disabled = false;
        } else {
            submitBtn.disabled = true;
        }
    });

    // Form Submission
    topicForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const topic = topicInput.value.trim();

        if (topic) {
            // Clear previous results
            resultImagesContainer.innerHTML = '';
            resultSection.style.display = 'none';
            // Show loading animation
            loadingSection.style.display = 'block';

            // Call StarryAI API
            generateImagesWithStarryAI(topic);
        }
    });

    // Download Button (Removed - Add different functionality if needed)
    // downloadBtn.addEventListener('click', function(e) {
    //     e.preventDefault();
    //     alert('Download functionality needs to be adapted for images.');
    // });

    // Cat Helper Interaction
    catHelper.addEventListener('click', function() {
        // Update tips for image generation
        alert('Tips for best results:\n\n1. Be descriptive in your topic (e.g., "Newton\'s laws of motion with apples and ramps").\n2. Use keywords related to style (e.g., "minimalist", "flat design", "vector art").\n3. Keep it focused on one core concept.\n4. The API will generate educational illustrations with black lines on a white background.');
    });

    // Create animated background elements
    function createAnimatedBackground() {
        const bgAnimation = document.getElementById('bg-animation');
        // Avoid creating duplicates if called again
        if (bgAnimation.children.length > 0) return;
        const numberOfElements = 15;

        for (let i = 0; i < numberOfElements; i++) {
            const span = document.createElement('span');
            span.style.top = Math.random() * 100 + '%';
            span.style.left = Math.random() * 100 + '%';
            const size = Math.random() * 80 + 20;
            span.style.width = size + 'px';
            span.style.height = size + 'px';
            span.style.animationDelay = Math.random() * 5 + 's';
            span.style.animationDuration = Math.random() * 10 + 15 + 's';
            bgAnimation.appendChild(span);
        }
    }

    // Update SVG images based on theme
    function updateImageTheme(isDark) {
        const theme = isDark ? 'dark' : 'light';
        logoImg.src = `cat-logo-${theme}.svg`;
        catHelperImg.src = `cat-helper-${theme}.svg`;
        step1Img.src = `step1-${theme}.svg`;
        step2Img.src = `step2-${theme}.svg`;
        step3Img.src = `step3-${theme}.svg`;
    }

    // Process topic with StarryAI API
    async function generateImagesWithStarryAI(topic) {
        console.log(`Generating images for topic: ${topic} with StarryAI`);

        // 🚨🚨 WARNING: INSECURE API KEY USAGE! Use a backend server! 🚨🚨
        const apiKey = STARRYAI_API_KEY;
        const apiUrl = 'https://api.starryai.com/creations/';

        // Dynamically insert the user's topic into the prompt
        const promptText = `A clear educational illustration explaining ${topic} in a minimalistic style with white background and black lines, suitable for teaching students, professional and clean design`;

        const options = {
            method: 'POST',
            headers: {
                'accept': 'application/json',
                'content-type': 'application/json',
                'X-API-Key': apiKey // Key included directly - INSECURE!
            },
            body: JSON.stringify({
                model: 'lyra', // Or another model if you prefer
                aspectRatio: 'landscape', // Or 'portrait', 'square'
                highResolution: true, // Request higher resolution
                images: 4, // Number of images to generate
                steps: 30, // Quality steps
                // initialImageMode: 'color', // Less relevant without initial image
                prompt: promptText, // Use the dynamic prompt
                negativePrompt: 'blurry, low quality, photograph, photo, 3D render, text, watermark, signature, noisy, complex background, people, animals', // Refined negative prompt
                seed: Math.floor(Math.random() * 100000), // Random seed for variety
                // initialImageStrength: 30 // Less relevant without initial image
            })
        };

        try {
            const response = await fetch(apiUrl, options);

            if (!response.ok) {
                // Try to get more error details from the response body
                let errorData;
                try {
                    errorData = await response.json();
                } catch (e) {
                    errorData = { message: 'Could not parse error response.' };
                }
                console.error('StarryAI API Error Response:', errorData);
                throw new Error(`API request failed with status ${response.status}: ${errorData?.message || response.statusText}`);
            }

            const result = await response.json();
            console.log('StarryAI API Success Response:', result);

            // --- Process the StarryAI Response ---
            // NOTE: The actual structure of the response needs to be checked.
            // Assuming the response has an array named 'creations' or 'images'
            // containing objects with an 'image_url' or similar property.
            // Adjust based on the actual API documentation or console.log(result).

            let imageUrls = [];
            if (result && Array.isArray(result)) {
                // Sometimes the API might return an array directly
                imageUrls = result.map(item => item.url || item.image_url).filter(Boolean); // Adjust property name as needed
            } else if (result && Array.isArray(result.creations)) {
                 imageUrls = result.creations.map(item => item.url || item.image_url).filter(Boolean); // Adjust property name as needed
            } else if (result && Array.isArray(result.images)) {
                 imageUrls = result.images.map(item => item.url || item.image_url).filter(Boolean); // Adjust property name as needed
            }
             // Add more checks if the structure is different


            // Hide loading and show results
            loadingSection.style.display = 'none';

            if (imageUrls.length > 0) {
                displayResults(imageUrls);
            } else {
                console.error("No image URLs found in the response:", result);
                alert('Sorry, could not retrieve images from the API response. Check the console.');
                resultSection.style.display = 'none'; // Keep results hidden if no images
            }

        } catch (error) {
            console.error('Error generating images with StarryAI:', error);
            loadingSection.style.display = 'none';
            resultSection.style.display = 'none'; // Ensure results are hidden on error
            alert(`Sorry, there was an error generating images: ${error.message}. Please try again.`);
        }
    }

    // Function to display the generated images
    function displayResults(imageUrls) {
        resultImagesContainer.innerHTML = ''; // Clear previous images

        imageUrls.forEach(url => {
            const imgElement = document.createElement('img');
            imgElement.src = url;
            imgElement.alt = `AI generated illustration for ${topicInput.value.trim()}`;
            imgElement.onerror = () => { // Basic error handling for broken image links
               console.error(`Failed to load image: ${url}`);
               imgElement.alt = 'Failed to load image';
               // Optionally replace with a placeholder or remove
               // imgElement.remove();
            };
            resultImagesContainer.appendChild(imgElement);
        });

        resultSection.style.display = 'block'; // Show the results section
        // Scroll to results
        resultSection.scrollIntoView({ behavior: 'smooth' });
    }

});
// --- END OF FILE script.js ---