let currentQuestion = 0;
let timeLeft;
let timer;
let questions;
let score = 0;

fetch('https://opentdb.com/api.php?amount=5&category=21&type=multiple')
    .then(response => response.json())
    .then(data => {
        questions = data.results;
        loadQuestion(questions[currentQuestion]);
    })
    .catch(error => console.error('Error loading questions:', error));

function loadQuestion(question) {
    document.getElementById('question').innerText = `${currentQuestion + 1}. ${question.question}`;

    const optionsContainer = document.getElementById('options');
    optionsContainer.innerHTML = '';

    const allOptions = [...question.incorrect_answers, question.correct_answer];
    shuffleArray(allOptions);

    allOptions.forEach(option => {
        const optionDiv = document.createElement('div');
        optionDiv.textContent = option;
        optionDiv.classList.add('option');
        optionDiv.addEventListener('click', () => selectOption(optionDiv, question));
        optionsContainer.appendChild(optionDiv);
    });

    startTimer();
}

function selectOption(selectedOption, question) {
    const options = document.querySelectorAll('.option');
    if (document.querySelector('.option.selected')) {
        return;
    }
    options.forEach(option => {
        if (option === selectedOption) {
            option.classList.add('selected');
            if (selectedOption.textContent === question.correct_answer) {
                option.style.background = "green";
                option.style.color = "white";
                option.innerHTML += '<i class="fas fa-check"></i>';
                score++;
            } else {
                option.style.background = "red";
                option.innerHTML += '<i class="fas fa-times"></i>';
            }
        } else {
            if (option.textContent === question.correct_answer) {
                option.style.background = "green";
                option.style.color = "white";
                option.innerHTML += '<i class="fas fa-check"></i>';
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
        if (timeLeft == 0) {
            clearInterval(timer);
            goToNextQuestion();
        } else {
            document.getElementById('timer').textContent = `Time Left: ${timeLeft}`;
            document.getElementById('line').style.width = `${(15 - timeLeft) / 15 * 110}%`;
            timeLeft--;
        }
    }, 1000);
}

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
    document.getElementById('line').style.display = 'none';
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
    document.getElementById('line').style.display = 'block';
    currentQuestion = 0;
    loadQuestion(questions[currentQuestion]);
    const btnSubmit = document.getElementById('btnsubmit');
    btnSubmit.textContent = 'Next';
    btnSubmit.removeEventListener('click', restartQuiz);
    btnSubmit.addEventListener('click', goToNextQuestion);
}

document.getElementById('btnsubmit').addEventListener('click', goToNextQuestion);

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}
