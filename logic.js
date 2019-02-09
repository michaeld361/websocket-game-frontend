var app = app || {};
app.dom = {};

const init = () => {
	setupDOM();
	addEvents();
};

const setupDOM = () => {
	app.dom.playGameBtn 	= document.getElementById('introPlay');
	app.dom.introContainer 	= document.getElementById('introContainer');
}

const addEvents = () => {
	app.dom.playGameBtn.addEventListener('click', function(){
		app.dom.introContainer.style.transform = "translateY(-100%)";
	});
}






init();