let fakeNames = [];
let attendees = [];

async function loadFakeNames() {
    try {
        const response = await fetch('fake_names.json');
        fakeNames = await response.json();
    } catch (error) {
        console.error("Error loading fake names:", error);
    }
}

async function loadAttendees() {
    try {
        const response = await fetch('attendees.json');
        attendees = await response.json();
    } catch (error) {
        console.error("Error loading attendees:", error);
    }
}

function startDraw() {
    const nameContainer = document.getElementById('nameContainer');
    const lever = document.getElementById('lever');
    lever.classList.add('pull');

    startLightAnimation();

    // Remove the 'winner' class when starting a new draw to ensure fake names are not bold
    nameContainer.classList.remove('winner');

    // Shuffle the fake names list before each draw
    const randomizedFakeNames = shuffleArray([...fakeNames]);
    let currentIndex = 0;
    let speed = 300; // Initial speed in milliseconds
    let acceleration = 0.9; // Factor to speed up
    let maxSpeed = 50; // Fastest speed
    let slowDownPoint = 2500; // Time in milliseconds to start slowing down
    let totalTime = 10000; // Total time for the roll

    function rollNames() {
        nameContainer.textContent = randomizedFakeNames[currentIndex % randomizedFakeNames.length];
        currentIndex++;

        // Adjust the speed for the roll-up phase
        if (speed > maxSpeed && totalTime - slowDownPoint > 0) {
            speed *= acceleration; // Speed up the rolling
        } else if (totalTime - slowDownPoint <= 0) {
            speed /= acceleration; // Slow down the rolling
        }

        totalTime -= speed;

        if (totalTime > 0) {
            setTimeout(rollNames, speed);
        } else {
            lever.classList.remove('pull');
            stopLightAnimation();
            revealWinner(nameContainer);
        }
    }

    // Start the rolling effect
    rollNames();
}


function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function startLightAnimation() {
    const lights = document.querySelectorAll('.light');
    lights.forEach(light => {
        light.classList.add('on');
    });
}

function stopLightAnimation() {
    const lights = document.querySelectorAll('.light');
    lights.forEach(light => {
        light.classList.remove('on');
    });
}

function createLights() {
    const topLights = document.getElementById('topLights');
    const bottomLights = document.getElementById('bottomLights');
    const leftLights = document.getElementById('leftLights');
    const rightLights = document.getElementById('rightLights');

    const numberOfLightsHorizontal = 20; // Adjust this number for more lights horizontally
    const numberOfLightsVertical = 10; // Adjust this number for more lights vertically

    // Create lights for the top and bottom
    for (let i = 0; i < numberOfLightsHorizontal; i++) {
        const light = document.createElement('div');
        light.classList.add('light');
        topLights.appendChild(light.cloneNode());
        bottomLights.appendChild(light.cloneNode());
    }

    // Create lights for the left and right sides
    for (let i = 0; i < numberOfLightsVertical; i++) {
        const light = document.createElement('div');
        light.classList.add('light');
        leftLights.appendChild(light.cloneNode());
        rightLights.appendChild(light.cloneNode());
    }
}


function revealWinner(nameContainer) {
    if (attendees.length > 0) {
        const winner = attendees[Math.floor(Math.random() * attendees.length)];
        nameContainer.textContent = winner;
        nameContainer.classList.add('winner');
        launchFireworks();
    } else {
        nameContainer.textContent = "No attendees loaded.";
    }
}

function launchFireworks() {
    const fireworksContainer = document.getElementById('fireworks');
    const totalFireworks = 100; // Increase the number of fireworks
    const duration = 10000; // Fireworks should last at least 10 seconds

    // Create fireworks for the specified duration
    for (let i = 0; i < totalFireworks; i++) {
        setTimeout(() => {
            createFirework(fireworksContainer);
        }, Math.random() * duration); // Randomize the timing of each firework
    }
}

function createFirework(container) {
    const firework = document.createElement('div');
    firework.classList.add('firework');

    // Randomize position, size, and colors of each firework
    firework.style.left = `${Math.random() * 100}%`;
    firework.style.top = `${Math.random() * 100}%`;
    firework.style.width = `${5 + Math.random() * 5}px`;
    firework.style.height = `${5 + Math.random() * 5}px`;
    firework.style.background = `hsl(${Math.random() * 360}, 100%, 70%)`; // Random color

    container.appendChild(firework);

    // Remove the firework after its animation ends
    setTimeout(() => {
        firework.remove();
    }, 1000); // Duration of each firework explosion
}


loadFakeNames();
loadAttendees();
createLights();

