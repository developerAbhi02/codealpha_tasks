// Select DOM Elements
const inputBox = document.getElementById('input-box');
const addButton = document.getElementById('add-button');
const listContainer = document.getElementById('list-container');
const clearAllButton = document.getElementById('clear-all');
const taskCounter = document.getElementById('task-counter');
const filterOptions = document.querySelectorAll('.filter-option');
const themeToggle = document.getElementById('theme-toggle');
const languageToggle = document.getElementById('language-toggle');

// Toast and Dialog Elements
const toastContainer = document.getElementById('toast-container');
const dialogOverlay = document.getElementById('confirm-dialog');
const dialogTitle = document.getElementById('dialog-title');
const dialogMessage = document.getElementById('dialog-message');
const dialogConfirm = document.getElementById('dialog-confirm');
const dialogCancel = document.getElementById('dialog-cancel');

// Current filter state
let currentFilter = 'all';

// Current language and theme settings
let currentLanguage = 'hi'; // 'hi' for Hindi, 'en' for English
let currentTheme = localStorage.getItem('theme') || 'light';

// Language translations
const translations = {
    hi: {
        appTitle: 'कार्यपथ - आपकी टू-डू लिस्ट',
        addTaskPlaceholder: 'अपना कार्य जोड़ें',
        addButton: 'जोड़ें',
        allFilter: 'सभी',
        pendingFilter: 'बाकी',
        completedFilter: 'पूर्ण',
        clearAll: 'सभी हटाएं',
        taskStats: 'कुल कार्य:',
        emptyTaskAlert: 'कृपया कुछ लिखें!',
        clearConfirm: 'क्या आप सभी टास्क हटाना चाहते हैं?',
        changeLanguage: 'भाषा बदलें / Change Language',
        changeTheme: 'थीम बदलें',
        taskAdded: 'कार्य सफलतापूर्वक जोड़ा गया!',
        taskDeleted: 'कार्य सफलतापूर्वक हटा दिया गया!',
        allTasksCleared: 'सभी कार्य साफ़ कर दिए गए!',
        taskMarkedCompleted: 'कार्य पूर्ण के रूप में चिह्नित किया गया',
        taskMarkedPending: 'कार्य बाकी के रूप में चिह्नित किया गया',
        showingAllTasks: 'सभी कार्य दिखाए जा रहे हैं',
        showingPendingTasks: 'बाकी कार्य दिखाए जा रहे हैं',
        showingCompletedTasks: 'पूर्ण कार्य दिखाए जा रहे हैं',
        deleteTaskTitle: 'कार्य हटाएं',
        deleteTaskConfirm: 'क्या आप वाकई इस कार्य को हटाना चाहते हैं?',
        clearAllTasksTitle: 'सभी कार्य हटाएं'
    },
    en: {
        appTitle: 'KaryaPath - Your To-Do List',
        addTaskPlaceholder: 'Add your task',
        addButton: 'Add',
        allFilter: 'All',
        pendingFilter: 'Pending',
        completedFilter: 'Completed',
        clearAll: 'Clear All',
        taskStats: 'Total Tasks:',
        emptyTaskAlert: 'Please write something!',
        clearConfirm: 'Do you want to clear all tasks?',
        changeLanguage: 'Change Language / भाषा बदलें',
        changeTheme: 'Change Theme',
        taskAdded: 'Task added successfully!',
        taskDeleted: 'Task deleted successfully!',
        allTasksCleared: 'All tasks cleared successfully!',
        taskMarkedCompleted: 'Task marked as completed',
        taskMarkedPending: 'Task marked as pending',
        showingAllTasks: 'Showing all tasks',
        showingPendingTasks: 'Showing pending tasks',
        showingCompletedTasks: 'Showing completed tasks',
        deleteTaskTitle: 'Delete Task',
        deleteTaskConfirm: 'Are you sure you want to delete this task?',
        clearAllTasksTitle: 'Clear All Tasks'
    }
};

// Load saved tasks and apply theme on page load
window.addEventListener('load', () => {
    showTasks();
    updateTaskCounter();
    applyTheme();
    loadLanguage();
});

// Toggle theme
themeToggle.addEventListener('click', () => {
    currentTheme = currentTheme === 'light' ? 'dark' : 'light';
    applyTheme();
    localStorage.setItem('theme', currentTheme);
});

// Toggle language
languageToggle.addEventListener('click', () => {
    currentLanguage = currentLanguage === 'hi' ? 'en' : 'hi';
    localStorage.setItem('language', currentLanguage);
    loadLanguage();
});

// Apply theme
function applyTheme() {
    if (currentTheme === 'dark') {
        document.body.setAttribute('data-theme', 'dark');
        themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    } else {
        document.body.removeAttribute('data-theme');
        themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
    }
    themeToggle.title = translations[currentLanguage].changeTheme;
}

// Load language
function loadLanguage() {
    // Get saved language
    const savedLanguage = localStorage.getItem('language');
    if (savedLanguage) {
        currentLanguage = savedLanguage;
    }
    
    // Update title
    document.title = translations[currentLanguage].appTitle;
    
    // Update placeholder text
    inputBox.placeholder = translations[currentLanguage].addTaskPlaceholder;
    
    // Update button text
    addButton.textContent = translations[currentLanguage].addButton;
    clearAllButton.textContent = translations[currentLanguage].clearAll;
    
    // Update filter text
    const filterLabels = [
        translations[currentLanguage].allFilter,
        translations[currentLanguage].pendingFilter,
        translations[currentLanguage].completedFilter
    ];
    
    filterOptions.forEach((option, index) => {
        option.textContent = filterLabels[index];
    });
    
    // Update task stats
    document.querySelector('.task-stats').innerHTML = 
        `${translations[currentLanguage].taskStats} <span id="task-counter">${listContainer.querySelectorAll('li').length}</span>`;
    
    // Update button tooltips
    languageToggle.title = translations[currentLanguage].changeLanguage;
    themeToggle.title = translations[currentLanguage].changeTheme;
}

// Show Toast Message
function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    toastContainer.appendChild(toast);

    // Remove toast after 3 seconds
    setTimeout(() => {
        toast.style.animation = 'slideOut 0.3s ease-in-out forwards';
        setTimeout(() => {
            toastContainer.removeChild(toast);
        }, 300);
    }, 3000);
}

// Show Confirmation Dialog
function showConfirmDialog(title, message) {
    return new Promise((resolve) => {
        dialogTitle.textContent = title;
        dialogMessage.textContent = message;
        dialogOverlay.classList.add('active');

        const handleConfirm = () => {
            dialogOverlay.classList.remove('active');
            cleanup();
            resolve(true);
        };

        const handleCancel = () => {
            dialogOverlay.classList.remove('active');
            cleanup();
            resolve(false);
        };

        const cleanup = () => {
            dialogConfirm.removeEventListener('click', handleConfirm);
            dialogCancel.removeEventListener('click', handleCancel);
        };

        dialogConfirm.addEventListener('click', handleConfirm);
        dialogCancel.addEventListener('click', handleCancel);
    });
}

// Add new task
function addTask() {
    if (inputBox.value === '') {
        showToast(translations[currentLanguage].emptyTaskAlert, 'error');
        return;
    }

    // Create new task item
    const li = document.createElement('li');
    li.innerHTML = inputBox.value;
    li.setAttribute('data-status', 'pending');
    
    const span = document.createElement('span');
    span.innerHTML = '\u00d7';
    li.appendChild(span);
    
    listContainer.appendChild(li);
    inputBox.value = '';
    saveData();
    updateTaskCounter();
    applyFilter(currentFilter);

    showToast(translations[currentLanguage].taskAdded, 'success');
}

// Add task on Enter key press
inputBox.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        addTask();
    }
});

// Add task on button click
addButton.addEventListener('click', addTask);

// Handle list container clicks (check/uncheck and delete)
listContainer.addEventListener('click', (e) => {
    if (e.target.tagName === 'LI') {
        e.target.classList.toggle('checked');
        e.target.setAttribute('data-status', 
            e.target.classList.contains('checked') ? 'completed' : 'pending'
        );
        saveData();
        applyFilter(currentFilter);
        
        const status = e.target.classList.contains('checked');
        showToast(
            status ? translations[currentLanguage].taskMarkedCompleted : translations[currentLanguage].taskMarkedPending,
            'info'
        );
    }
    else if (e.target.tagName === 'SPAN') {
        const taskText = e.target.parentElement.textContent.slice(0, -1);
        showConfirmDialog(
            translations[currentLanguage].deleteTaskTitle,
            translations[currentLanguage].deleteTaskConfirm
        ).then((confirmed) => {
            if (confirmed) {
                e.target.parentElement.remove();
                saveData();
                updateTaskCounter();
                showToast(translations[currentLanguage].taskDeleted, 'success');
            }
        });
    }
});

// Clear all tasks
clearAllButton.addEventListener('click', async () => {
    const confirmed = await showConfirmDialog(
        translations[currentLanguage].clearAllTasksTitle,
        translations[currentLanguage].clearConfirm
    );
    
    if (confirmed) {
        listContainer.innerHTML = '';
        saveData();
        updateTaskCounter();
        showToast(translations[currentLanguage].allTasksCleared, 'success');
    }
});

// Handle filter options
filterOptions.forEach(option => {
    option.addEventListener('click', () => {
        document.querySelector('.filter-option.active').classList.remove('active');
        option.classList.add('active');
        currentFilter = option.getAttribute('data-filter');
        applyFilter(currentFilter);
        
        let toastMessage;
        switch (currentFilter) {
            case 'all':
                toastMessage = translations[currentLanguage].showingAllTasks;
                break;
            case 'pending':
                toastMessage = translations[currentLanguage].showingPendingTasks;
                break;
            case 'completed':
                toastMessage = translations[currentLanguage].showingCompletedTasks;
                break;
        }
        showToast(toastMessage, 'info');
    });
});

// Apply filter
function applyFilter(filter) {
    const tasks = listContainer.querySelectorAll('li');
    tasks.forEach(task => {
        const status = task.getAttribute('data-status');
        switch (filter) {
            case 'all':
                task.style.display = 'block';
                break;
            case 'pending':
                task.style.display = status === 'pending' ? 'block' : 'none';
                break;
            case 'completed':
                task.style.display = status === 'completed' ? 'block' : 'none';
                break;
        }
    });
}

// Update task counter
function updateTaskCounter() {
    const totalTasks = listContainer.querySelectorAll('li').length;
    const counterSpan = document.getElementById('task-counter');
    if (counterSpan) {
        counterSpan.textContent = totalTasks;
    }
}

// Save data to local storage
function saveData() {
    localStorage.setItem('todoData', listContainer.innerHTML);
}

// Show tasks from local storage
function showTasks() {
    const savedData = localStorage.getItem('todoData');
    if (savedData) {
        listContainer.innerHTML = savedData;
        const tasks = listContainer.querySelectorAll('li');
        tasks.forEach(task => {
            if (!task.hasAttribute('data-status')) {
                task.setAttribute('data-status', 
                    task.classList.contains('checked') ? 'completed' : 'pending'
                );
            }
        });
    }
} 