const chat = document.getElementById('chat');
const stressInput = document.getElementById('stressInput');
function addMessage(text, from = 'bot') {
    const msg = document.createElement('div');
    msg.textContent = text;
    msg.className = from;
    chat.appendChild(msg);
    chat.scrollTop = chat.scrollHeight;
    speak(text);
}
function speak(text) {
    const utterance = new SpeechSynthesisUtterance(text);
    window.speechSynthesis.speak(utterance);
}
function startListening() {
    const recognition = new window.SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognition.start();

    recognition.onresult = (event) => {
        const result = event.results[0][0].transcript;
        stressInput.value = result;
        addMessage("You said: " + result, 'user');
    };
}
async function getData() {
    const res = await fetch('/data');
    return await res.json();
}

async function sendStress() {
    const value = parseInt(stressInput.value);
    if (isNaN(value) || value < 1 || value > 10) {
        addMessage("Please enter a valid number between 1 and 10.");
        return;
    }

    addMessage("You: " + value, 'user');

    const res = await fetch('/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stress_score: value })
    });

    const data = await res.json();

    if (data.data.day_count === 1) {
        addMessage("Hi there! I'm here to support you. On a scale of 1 to 10, how stressed are you feeling today?");
    } else if (data.data.day_count >= 7) {
        const { initial_stress, weekly_stress } = data.data;
        const progress = initial_stress - weekly_stress;
        addMessage(You've been sharing with me for a week now. Your stress level was ${initial_stress} on day one, and today it's ${weekly_stress}.);

        if (progress > 0) {
            addMessage("It's great to see that your stress has gone down! Keep practicing healthy habits and talking about your feelings. I'm always here if you want to share more.");
        } else {
            addMessage("It looks like your stress level hasn't improved much. It might be helpful to speak with a doctor or mental health professional. You're not alone, and support is available whenever you need it.");
        }
    } else {
        addMessage("Thank you for sharing. Remember, it's okay to feel stressed sometimes. Keep checking in with me every day so we can track how you're doing.");
    }

    stressInput.value = '';
}
