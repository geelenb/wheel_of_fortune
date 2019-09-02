sound_enabled = true;

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

function start_new_game(str, title) {
    const lettercontainer = document.getElementById('lettercontainer');
    const tiptext = document.getElementById('tiptext');
    
    const longest_line_length = Math.max(...(str.split('\n').map(s => s.trim().length)));
    const lll = longest_line_length;
    const num_lines = str.split('\n').length;
    
    const lines = str
        .split('\n')
        .map(line => line.trim())
        .map(line => ' '.repeat(Math.floor((lll - line.length) / 2))
                         + line 
                         + ' '.repeat(Math.ceil((lll - line.length) / 2)));

    const htmltext = '<div>' + 
        lines.map(line => line.split('')
                              .map(l => l.toUpperCase())
                              .map(l => (l >= 'A' && l <= 'Z') ? [l, '_'] : 
                                        (l == ' ') ? [l, '&nbsp;']
                                        : [l, l])
                              .map(a => '<span class="letter" data-letter="' + a[0] + '">' + a[1] + '</span>')
                              .join(''))
            .join('</div><div>')
        + '</div>';

    lettercontainer.innerHTML = htmltext;
    tiptext.innerText = title;

    if (title.length === 0) {
        document.getElementById('tip').style.visibility = 'hidden';
    } else {
        document.getElementById('tip').style.visibility = 'initial';
    }

    set_section('spel');

    scale_lettercontainer()
}

function scale_lettercontainer() {
    // zoom to take 2/3 height or 3/4 width
    const maxheight = window.innerHeight * 3 / 4;
    const maxwidth = window.innerWidth * 2 / 3;

    // document.getElementById('spel').style.zoom = Math.min(
    lettercontainer.style.zoom = Math.min(
        maxheight / lettercontainer.clientHeight,
        maxwidth / lettercontainer.clientWidth
    )

}

// prefetch
var audio = new Audio('sounds/bell.flac');
var wrong_letter = new Audio('sounds/142608__autistic-lucario__error.wav');


function guess(letter, animate) {
    const spans = document.querySelectorAll('#lettercontainer span[data-letter="' + letter + '"]');
    const delta_t = animate ? 700 : 0;
    const until_flip = animate ? 1500 : 0;

    if (spans.length === 0) {
        guessed_wrong_letter(letter);
        return;
    }

    if (animate) {
        spans.forEach((span, i) => {
            setTimeout(
                () => { 
                    span.innerHTML = '&nbsp;';
                    span.style.background = 'blue';
                    if (sound_enabled) {
                        new Audio('sounds/bell.flac').play();
                        // new Audio('sounds/196106__aiwha__ding.wav').play();
                    }
                },
                delta_t * i)
            }
        )
    }

    spans.forEach((span, i) => {
        setTimeout(
            () => { 
                span.innerText = span.dataset['letter'];
                span.style.background = 'initial' 
            },
            delta_t * (spans.length + 2))
        }
    )
}

function guessed_wrong_letter(letter) {
    wrong_letter.play();
    document.querySelector('#wrong_letter > p').innerText = letter;
    set_section('wrong_letter');
    setTimeout(
        () => set_section('spel'),
        2000
    );
}

setTimeout(
    () => {
        document.querySelector('section#overlay > p').remove()
    },
    5000
);


function win() {
    const spans = document.querySelectorAll('#lettercontainer span');
    const delta_t = 30;

    spans.forEach((span, i) => {
        setTimeout(
            () => { 
                if (span.dataset['letter'] !== ' ') {
                    span.innerText = span.dataset['letter'];
                    span.style.background = 'initial' 
                }
            },
            delta_t * i)
        }
    )
}

function scale_element(elementid, factor) {
    // debugger;
    const element = document.getElementById(elementid)
    if (element.style.zoom === "0"){
        element.style.zoom = 1;
    }
    // TODO: slides op display schalen? initialisatie?
    element.style.zoom *= factor;
}

function change_slide(by) {
    const slides = [...document.querySelectorAll('#uitlegpagina div.slide')];
    visible_bools = slides.map((slide) =>
        (slide.classList.contains('visible')));
    current_slide = visible_bools.indexOf(true);
    slides[current_slide].classList.remove('visible');
    current_slide = current_slide + by;
    current_slide = Math.min(current_slide, slides.length - 1);
    current_slide = Math.max(current_slide, 0);
    slides[current_slide].classList.add('visible');
}

function show_title_window(title_str) {
    document.getElementById('titel').innerText = title_str;
    set_section("titelpagina");
}