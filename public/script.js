var words = [];
var states = [[]];
var step = 0;
var signals = [];
const begin = 'a';
const end = 'z';

// Adiciona as palavras no array
$('#insertWord').click(function() {
    let input = $('#inputText');
    let currentWord = input.val();

    if (words.indexOf(currentWord) < 0) {
        if (insertWord(input, currentWord)) {
            $('#validateInput').prop('disabled', false);
        };
    }

    input.val('');
});

$('#inputText').on('keyup', function(e) {
    if (e.keyCode == 32) {
        let input = $(this);
        let currentWord = input.val();

        if (words.indexOf(currentWord < 0)) {
            if (insertWord(input, currentWord)) {
                $('#validateInput').prop('disabled', false);
            };
        }
        input.val('');
    }
});

// Valida as palavras
$('#textValidate').on('keyup', function(e) {
    let input = $(this);
    let currentWord = input.val();

    validate(input, currentWord, e.keyCode);
});

//Remove palavras
$('#removeWords').click(function() {
    $('#palavrasAdicionadas .word').remove();
        words = [];
        states = [[]];
        step = 0;
    signals = [];
    
    setStates();
    setSignals();
    createTable(signals)
});

function setStates() {
    for (let i = 0; i < words.length; i++) {
    let currentStep = 0;
    let token = words[i];

        for (let j = 0; j < token.length; j++) {
            let letter = token[j];
        
            if(typeof states[currentStep][letter] === 'undefined'){
                let nextStep = step + 1;

                states[currentStep][letter] = nextStep;
                states[nextStep] = [];
            
                step = currentStep = nextStep;
            } else {
                currentStep = states[currentStep][letter];
            }

            if (j == token.length - 1) {
                states[currentStep]['end'] = true;
            } else {
                states[currentStep]['end'] = false;
            }
        }
    }
}

function setSignals() {
    let stateHelper = [];

    for (let i = 0; i < states.length; i++) {
        let aux = [];
        aux['state'] = i;

        for (let j = begin.charCodeAt(0); j <= end.charCodeAt(0); j++) {
            let letter = String.fromCharCode(j);

            if (typeof states[i][letter] === 'undefined') {
                aux[letter] = '-';
            } else {
                aux[letter] = states[i][letter];
            }
        }

        if (states[i]['end']) {
            aux['end'] = true;
        } else {
            aux['end'] = false;
        }

        stateHelper.push(aux);

    }

    return stateHelper;
}

function createTable(signals) {
    let table = $('#table');
    let header = $(document.createElement('th'));
    let row = $(document.createElement('tr'));
    
    table.html('');
    header.html('δ');
    row.append(header);
    table.append(row);

    for(let i = begin.charCodeAt(0); i <= end.charCodeAt(0); i++){
        let header = $(document.createElement('th')); 
        header.append(String.fromCharCode(i));
        row.append(header);
    }

    for(let j = 0; j < signals.length; j++){
        let row = $(document.createElement('tr'));
        let cell = $(document.createElement('td'));

        if(signals[j]['end']){
            cell.html('q' + signals[j]['state'] + '*');
            cell.addClass('end');
            row.addClass('end');
        } else {
            cell.html('q' + signals[j]['state']);
        }

        row.append(cell);
        row.addClass(`step_${j}`);

        for (var k = begin.charCodeAt(0); k <= end.charCodeAt(0); k++) {
            let innerCell = $(document.createElement('td'));
            let letter = String.fromCharCode(k);

            innerCell.html(signals[j][letter]);

            if(signals[j][letter] != '-'){
                innerCell.addClass('step');
            } else {
                innerCell.addClass('empty');
            }

            row.append(innerCell);
        }

        table.append(row);
    }
}

function insertWord(input, palavra) {
    palavra = palavra.trim();

    if (palavra.length > 0) {
        if (words.indexOf(palavra) < 0) {
            words.push(palavra);
            setStates();
            
        }

        signals = setSignals();
        createTable(signals);

        let wordDisplay = '<div class="word">';
            wordDisplay += '<input type="hidden" value="'+ palavra +'"></input>';
            wordDisplay += '<span class="text">'+ palavra +'</span>';
        wordDisplay += '</div>';

        $('#palavrasAdicionadas').append(wordDisplay);

        return true;
    }
}

function validate(input, validate, last) {
    if (validate || last == 32 || last == 8 || last == 46) {
        if (words.length > 0) {
            $("#table tr").removeClass('green');
            $("#table tr").removeClass('red');
            $("#table tr").removeClass('current_step');

            let currentStep = 0;
            let error = false;

            for (let i = 0; i < validate.length; i++) {
                let letter = validate[i];
                
                if (!error) {
                    if(letter.charCodeAt(0) >= begin.charCodeAt(0) && letter.charCodeAt(0) <= end.charCodeAt(0)){
                        if(signals[currentStep][letter] != '-'){
                            $("#table tr").removeClass('current_step');
                            $(`.step_${currentStep}`).addClass('green');
                            $(`.step_${currentStep}`).addClass('current_step');
                            currentStep = signals[currentStep][letter];
                        } else {
                            error = true;
                            $(`.step_${currentStep}`).addClass('red');
                        }
                    }

                    if (last == 32) {
                        if (i == validate.length - 1) {
                            if(signals[currentStep]['end']){
                                $("#table tr").removeClass('current_step');
                                $(`.step_${currentStep}`).addClass('green');
                                $(`.step_${currentStep}`).addClass('current_step');
                            } else {
                                error = true;
                                $(`.step_${currentStep}`).addClass('red');
                            }
                            input.val('');
                        }
                    }
                }
            }
        }
    }
}