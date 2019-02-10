var app 			= app || {};
app.dom 			= {};
var connectedUsers 	= 0;
var numberOfAnswers = 0;
var questionCount 	= 0;
var answered 		= false;
var questionList;

var connectionOptions =  {
       "force new connection" : true,
       "reconnectionAttempts": "Infinity", 
       "timeout" : 10000,
       "transports" : ["websocket"]
};

var socket = io('http://192.168.0.84:3000', connectionOptions);

const init = () => {
	console.log(socket);
	setupDOM();
	addEvents();
	userConnectionEvents();
	syncUsers();
	questions();
}

const setupDOM = () => {
	app.dom.playGameBtn 	= document.getElementById('introPlay');
	app.dom.introContainer 	= document.getElementById('introContainer');
	app.dom.userContainer   = document.getElementById('userContainer');
	app.dom.answerContainer = document.getElementById('answerContainer');
	app.dom.answer1 		= document.querySelector('.answer1');
	app.dom.answer2 		= document.querySelector('.answer2');
	app.dom.answer3 		= document.querySelector('.answer3');
	app.dom.clientContainer = document.getElementById('clientContainer');
	app.dom.desktopClient   = document.getElementById('desktop');
	app.dom.playerClient    = document.getElementById('player');
}

const mobileUser = () => {
	document.getElementById('userName').style.display = 'block';
	app.dom.introContainer.style.display = "none";
	app.dom.clientContainer.style.display = "none";
	app.dom.answerContainer.style.display = "block";
}

const addEvents = () => {
	app.dom.playGameBtn.addEventListener('click', function(){
		app.dom.introContainer.style.transform = "translateY(-100%)";
		socket.emit('play game', "one");
	})
	app.dom.answer1.addEventListener('click', function(){
		answer('answer1');
	})
	app.dom.answer2.addEventListener('click', function(){
		answer('answer2');
	})
	app.dom.answer3.addEventListener('click', function(){
		answer('answer3');
	})
	app.dom.playerClient.addEventListener('click', function(){
		mobileUser();
	})
	app.dom.desktopClient.addEventListener('click', function(){
		app.dom.clientContainer.style.display = "none";
		document.getElementById('userName').style.display = "none";
	})
}

const answer = (answer) => {
	if(answered == false) {
	console.log(socket.io.engine.id); 
	var socketString = socket.io.engine.id.toString();
	socket.emit('answer', socketString, answer);
	answered = true;
	}
	else {
		console.log('already answered');
	}
}

const addUser = (userArray) => {
	document.getElementById('userContainer').innerHTML = "";
	for(var i = 0; i < userArray.length; i++)
	{
		var newUser = document.createElement('div');
		newUser.setAttribute('class', 'userIcon ' + userArray[i]);
		newUser.setAttribute('id', userArray[i]);
		document.getElementById('userContainer').appendChild(newUser);
	}
}

const showQuestions = (data) => {
{
	console.log(data.results);
	questionList = data.results;
}


const userConnectionEvents = () => {
{
	socket.on('user connected', function(userArray){
		console.log('user connected: ' + userArray);
		connectedUsers = userArray.length;
		addUser(userArray);
	})
		socket.on('user disconnected', function(userArray){
	    console.log('User disconnect... ');
	    connectedUsers = userArray.length;
	    addUser(userArray);
	})
}


const syncUsers = () => {
	socket.on('sync', function(userArray){
			console.log('number of users: ' + userArray.length)
			addUser(userArray);
			finalIndex = userArray.length - 1;
			document.getElementById('userName').value = userArray[finalIndex];
	})
}


const questions = () => {
	socket.on('next question', function(userSocket){
		console.log('new question');
		for(var i = 0; i < document.querySelectorAll('.userIcon').length; i++)
		{
			document.querySelectorAll('.userIcon')[i].classList.remove("green");
		}
		questionCount++;
		nextQuestion();
	})

	socket.on('question list', function(questions){
		questionList = questions.results;
		console.log(questionList)
		nextQuestion();
	})


	const nextQuestion = () => {
	{
		answered = false;
		document.querySelector('.answer1').innerHTML  = questionList[questionCount].correct_answer;
		document.querySelector('.answer2').innerHTML  = questionList[questionCount].incorrect_answers[1];
		document.querySelector('.answer3').innerHTML  = questionList[questionCount].incorrect_answers[2];
		document.querySelector('.question').innerHTML = questionList[questionCount].question;
	}

	socket.on('new user answer', function(userSocket, nextQuestion){
		document.getElementById(userSocket).classList.add("green");
	});

}

init();



