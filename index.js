function openscreen(button) {
	display = window.open('display.html');
	display.onload = toon_menu;

	// window.postMessage('message', '*');

	start_polling()
}

function set_section(section_id) {
	for (const i in document.body.children) {
		const child = document.body.children[i];
		if (!child.tagName) {
			continue
		}
		if (child.tagName.toUpperCase() === 'SECTION') {
			if (child.classList.contains('visible')) {
				child.classList.remove('visible')
			}

			if (child.id === section_id) {
				child.classList.add('visible')
			}
		}
	}
}

function toon_menu() {
	set_section('menu');
	display.set_section('overlay');
	document.getElementById('newgamebutton').focus()
}

function toon_uitlegpagina() {
	set_section('uitlegpagina');
	display.set_section('uitlegpagina')
}

var guessed_letters = [];

function start_new_game() {
	string = document.getElementById('spel_text_input').value;
	title = document.getElementById('spel_title_input').value;

	if (string.length === 0) {
		alert('Geef een tekstje in!')
		// string = 'bram\ngeelen';
		return
	}


	display.start_new_game(string, title);


	set_section('spelcontrole');

	document.getElementById('solution').innerText = string;

	document.getElementById('spelcontrole').focus();
	guessed_letters = [];
	update_guessed_letters()
}

document.addEventListener('keypress', (event) => {
    if (document.getElementById('spelcontrole').classList.contains('visible')) {
        const letter = event.key.toUpperCase();
        if (letter < 'A' || letter > 'Z' || letter.length !== 1) {
            return
        }
        if (guessed_letters.includes(letter)) {
            display.guessed_wrong_letter(letter);
            return
        }
        const animate = !(document.getElementById('fastmode').checked);
        display.guess(letter, animate);
        guessed_letters.push(letter);
        update_guessed_letters();
    } else if (document.getElementById('uitlegpagina').classList.contains('visible')) {
        // TODO: pijltjes links en rechts werken niet
    	if (event.keyCode == 37) { // left arrow
    	    change_slide(-1)
        } else if (event.keyCode == 37) { // left arrow
            change_slide(+1)
        }
	}
});

function update_guessed_letters() {
	document.getElementById('guessed_letters').innerText = guessed_letters.join()
}

function spel_text_input_changed(a) {
	a.cols = Math.max(12, 
		...a.value
		 .split('\n')
		 .map(l => l.trim().length))
}

function toggle_sound(e) {
	display.sound_enabled = e.checked
}

function win() {
	display.win();
	if (display.sound_enabled){
		new Audio('sounds/397353__plasterbrain__tada-fanfare-g.flac').play();
	}
}

function wrong() {
	if (display.sound_enabled){
		new Audio('sounds/172950__notr__saddertrombones.mp3').play();
	}
}

function start_polling() {
    if (display.location.href === undefined) {
        set_section('start');
        document.getElementById('closed_view_info').style.visibility = 'visible';
    } else {
        setTimeout(start_polling, 1000)
    }
}

function change_slide(by) {
    display.change_slide(by);

	const slides = [...document.querySelectorAll('#uitlegpagina div.slide')];
    visible_bools = slides.map((slide) =>
		(slide.classList.contains('visible')));
    current_slide = visible_bools.indexOf(true);
    slides[current_slide].classList.remove('visible');
    current_slide = current_slide + by;
    current_slide = Math.min(current_slide, slides.length - 1);
    current_slide = Math.max(current_slide, 0);
    slides[current_slide].classList.add('visible');

    document.getElementById('previous_slide').disabled =
        current_slide === 0;

    document.getElementById('next_slide').disabled =
        current_slide === slides.length - 1;
}

function show_title_window() {
    const title = document.getElementById('title_input').value;
    display.show_title_window(title)
}

const theme = new Audio('sounds/theme.wav');

function play_theme() {
    // if (theme.pl)
    theme.play();
    button = document.getElementById('play_theme_button');
    button.innerText = 'Stop de soundtrack';
    button.onclick = stop_theme;
}

theme.onended = stop_theme

function stop_theme() {
    theme.pause();
    theme.currentTime = 0;
    button = document.getElementById('play_theme_button');
    button.innerText = 'Speel de soundtrack'
    button.onclick = play_theme;
}
