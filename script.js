let currentQuestion = 0;
let timeLeft;
let timer;
let questions;
let score = 0;

fetch('questions.json')
    .then(response => response.json())
    .then(data => {
        questions = data.questions;
        loadQuestion(questions[currentQuestion]);
    })
    .catch(error => console.error('Error loading questions:', error));

function loadQuestion(question) {
    document.getElementById('question').innerText = question.text;

    const optionsContainer = document.getElementById('options');
    optionsContainer.innerHTML = '';

    question.options.forEach(option => {
        const optionDiv = document.createElement('div');
        optionDiv.textContent = option;
        optionDiv.classList.add('option');
        optionDiv.addEventListener('click', () => selectOption(optionDiv, question));
        optionsContainer.appendChild(optionDiv);
    });

    startTimer();
}

// function selectOption(selectedOption, question) {
//     const options = document.querySelectorAll('.option');
//     options.forEach(option => {
//         if (option === selectedOption) {
//             option.classList.add('selected');
//             if (selectedOption.textContent === question.answer) {
//                 option.style.background="green";
//                 option.style.color="white";
//                 score++;
//             }
//         } else {
//             option.classList.remove('selected');
//         }
//     });
// }

function selectOption(selectedOption, question) {
    const options = document.querySelectorAll('.option');
    if (document.querySelector('.option.selected')) {
        return;
    }
    options.forEach(option => {
        if (option === selectedOption) {
            option.classList.add('selected');
            if (selectedOption.textContent === question.answer) {
                option.style.background = "green";
                option.style.color = "white";
                score++;
            } else {
                option.style.background = "red";
            }
        } else {
            if (option.textContent === question.answer) {
                option.style.background = "green";
                option.style.color = "white";
            } else {
                option.style.background = "";
            }
            option.classList.remove('selected');
        }
    });
}



function startTimer() {
    timeLeft = 15;
    clearInterval(timer);
    timer = setInterval(() => {
        if (timeLeft <= 0) {
            clearInterval(timer);
            goToNextQuestion();
        } else {
            document.getElementById('timer').textContent = `Time Left: ${timeLeft} seconds`;
            timeLeft--;
        }
    }, 1000);
}

// function submitAnswer() {
//     const selectedOption = document.querySelector('.option.selected');
//     if (!selectedOption && timeLeft > 0) {
//         alert('Please select an option before submitting.');
//         return; 
//     }
//     goToNextQuestion();
// }

function goToNextQuestion() {
    const selectedOption = document.querySelector('.option.selected');
    if (!selectedOption && timeLeft > 0) {
        alert('Please select an option before submitting.');
        return; 
    }
    clearInterval(timer);
    currentQuestion++;
    if (currentQuestion < questions.length) {
        loadQuestion(questions[currentQuestion]);
    } else {
        endQuiz();
    }
}

function endQuiz() {
    const scoreDisplay = document.getElementById('question');
    scoreDisplay.innerHTML = `<center> Quiz Ended! <br> Your Score: ${score}/${questions.length} </center>`;
    document.getElementById('options').innerHTML = '';
    document.getElementById('timer').textContent = '';
    const btnSubmit = document.getElementById('btnsubmit');
    btnSubmit.textContent = 'Restart';
    btnSubmit.removeEventListener('click', goToNextQuestion);
    btnSubmit.addEventListener('click', restartQuiz);
    score = 0; 
}

function restartQuiz() {
    currentQuestion = 0;
    loadQuestion(questions[currentQuestion]);
    const btnSubmit = document.getElementById('btnsubmit');
    btnSubmit.textContent = 'Next';
    btnSubmit.removeEventListener('click', restartQuiz);
    btnSubmit.addEventListener('click', goToNextQuestion);
}

document.getElementById('btnsubmit').addEventListener('click', goToNextQuestion);
