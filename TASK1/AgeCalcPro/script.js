// भाषा के लिए अनुवाद
const translations = {
    hindi: {
        title: "आयु गणक",
        subtitle: "Age Calculator",
        calculateBtn: "आयु की गणना करें",
        years: "वर्ष",
        months: "महीने",
        days: "दिन",
        toggleBtn: "English",
        alertSelectDate: "कृपया अपनी जन्म तिथि दर्ज करें",
        alertFutureDate: "जन्म तिथि आज से आगे नहीं हो सकती"
    },
    english: {
        title: "Age Calculator",
        subtitle: "आयु गणक",
        calculateBtn: "Calculate Age",
        years: "Years",
        months: "Months",
        days: "Days",
        toggleBtn: "हिंदी",
        alertSelectDate: "Please select your date of birth",
        alertFutureDate: "Date of birth cannot be in the future"
    }
};

// वर्तमान भाषा (डिफॉल्ट हिंदी)
let currentLanguage = "hindi";

// जरूरी एलिमेंट्स को सेलेक्ट करना
const dateInput = document.getElementById('date-input');
const calculateBtn = document.getElementById('calculate-btn');
const yearsEl = document.getElementById('years');
const monthsEl = document.getElementById('months');
const daysEl = document.getElementById('days');
const yearsTextEl = document.getElementById('years-text');
const monthsTextEl = document.getElementById('months-text');
const daysTextEl = document.getElementById('days-text');
const titleEl = document.querySelector('h1');
const subtitleEl = document.querySelector('h1 span');
const langToggleBtn = document.getElementById('lang-toggle');

// भाषा बदलने का फंक्शन
function toggleLanguage() {
    currentLanguage = currentLanguage === "hindi" ? "english" : "hindi";
    updateLanguage();
}

// भाषा अपडेट करने का फंक्शन
function updateLanguage() {
    const lang = translations[currentLanguage];
    titleEl.textContent = lang.title;
    subtitleEl.textContent = lang.subtitle;
    calculateBtn.textContent = lang.calculateBtn;
    yearsTextEl.textContent = lang.years;
    monthsTextEl.textContent = lang.months;
    daysTextEl.textContent = lang.days;
    langToggleBtn.textContent = lang.toggleBtn;
    
    // HTML लैंग एट्रिब्यूट अपडेट करना
    document.documentElement.lang = currentLanguage === "hindi" ? "hi" : "en";
}

// भाषा टॉगल बटन पर क्लिक इवेंट
langToggleBtn.addEventListener('click', toggleLanguage);

// आज की तारीख को डिफॉल्ट मैक्स वैल्यू के रूप में सेट करना
const today = new Date();
const formattedToday = formatDate(today);
dateInput.setAttribute('max', formattedToday);

// बटन पर क्लिक इवेंट
calculateBtn.addEventListener('click', calculateAge);

// उम्र गणना फंक्शन
function calculateAge() {
    const birthDate = new Date(dateInput.value);
    
    // अगर डेट चुनी नहीं गई है तो
    if (!dateInput.value) {
        alert(translations[currentLanguage].alertSelectDate);
        return;
    }
    
    // अगर फ्यूचर डेट है तो
    if (birthDate > today) {
        alert(translations[currentLanguage].alertFutureDate);
        return;
    }
    
    // उम्र की गणना
    let years = today.getFullYear() - birthDate.getFullYear();
    let months = today.getMonth() - birthDate.getMonth();
    let days = today.getDate() - birthDate.getDate();
    
    // माह और दिन की गणना को सही करना
    if (days < 0) {
        months--;
        // पिछले महीने के दिनों की संख्या पाने के लिए
        const lastMonthDate = new Date(
            today.getFullYear(),
            today.getMonth(),
            0
        );
        days += lastMonthDate.getDate();
    }
    
    if (months < 0) {
        years--;
        months += 12;
    }
    
    // परिणाम दिखाना
    yearsEl.textContent = years;
    monthsEl.textContent = months;
    daysEl.textContent = days;
    
    // एनिमेशन इफेक्ट
    animateResult();
}

// परिणाम एनिमेशन फंक्शन
function animateResult() {
    const resultBoxes = document.querySelectorAll('.result-box');
    
    resultBoxes.forEach(box => {
        box.classList.add('animate');
        setTimeout(() => {
            box.classList.remove('animate');
        }, 1000);
    });
}

// डेट फॉर्मेटिंग फंक्शन (YYYY-MM-DD)
function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

// CSS एनिमेशन क्लास जोड़ना
document.head.insertAdjacentHTML('beforeend', `
<style>
    .result-box.animate {
        animation: pop 0.5s ease-out;
    }
    
    @keyframes pop {
        0% { transform: scale(1); }
        50% { transform: scale(1.1); }
        100% { transform: scale(1); }
    }
</style>
`); 