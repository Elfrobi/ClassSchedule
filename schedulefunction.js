function moveItem(){
    $('.draggable').draggable({
        helper: 'clone',
        snap: '.droppable',
        revert: 'invalid',      
        stop: function(event, ui) {
            $(this).draggable('option', 'revert', 'invalid');
        }
    });

    $('.droppable').droppable({
        accept: '.draggable',
        drop: function(event, ui) {
            if ($(this).is(':empty')) {
                let newItem;
                if (ui.helper.data('original')) {
                    // Ha a húzott elem már létezik, akkor nem hozunk létre újat
                    newItem = ui.helper;
                    console.log('good');
                }else {
                    // Ha az elem új, akkor klónozzuk és adjunk hozzá egy egyedi azonosítót
                    newItem = ui.helper.clone();
                    newItem.data('original', true);
                    console.log('másol');
                }
                newItem.css({
                    'width': $(this).width() + 25, 
                    'height':$(this).height() + 25,
                    'position': 'absolute',
                    'top': '0',
                    'left': '0' 
                });
                $(this).append(newItem);
                newItem.draggable({
                    helper: 'original',
                    snap: '.droppable, .scrollable-list',
                    snapMode: 'inner', 
                    revert: 'invalid',
                });
            }else {
                alert('Ebben az időpontban már van egy tantárgy.');
                ui.helper.draggable({
                    helper: 'original',
                    snap: '.droppable',
                    snapMode: 'inner', 
                    revert: 'valid'
                });
            }
        }
    });
}


/*stop: function(event, ui) {
                        if ($(this).is('.scrollable-list')) {
                            $(this).remove();
                            console.log('törlés');
                        }
                    }*/

// Órarend mentése
function saveSchedule() {
    let scheduleName = prompt('Kérlek, adj meg egy nevet az órarendnek.');
    if (scheduleName){
        if (localStorage.getItem(scheduleName)) {
            if (!confirm("Már létezik '" + scheduleName + "' nevű órarend. Felül szeretnéd írni?")) {
                return;
            }
            localStorage.removeItem(scheduleName);
            $('#savedSchedules option:selected').remove();
        }    
        localStorage.setItem(scheduleName, JSON.stringify($('#schedule').html()));   
        $('#savedSchedules').append('<option>' + scheduleName + '</option>');
    }else{
        alert('Nem adtál nevet az órarendnek!');
    }
}

//Órarend betöltése
function loadSchedule() {
    let scheduleName = $('#savedSchedules').val();
    let savedSchedule = JSON.parse(localStorage.getItem(scheduleName));
    if (savedSchedule) {
        $('#schedule').html(savedSchedule);
        moveItem();
    }else {
        alert('Nincs órarend a listában.');
    }
}


function deleteSchedule() {
    let select = document.getElementById('savedSchedules');
    let scheduleName = select.options[select.selectedIndex].value;
    if (scheduleName) {
        if (confirm("Biztosan törölni szeretnéd a(z) '" + scheduleName + "' órarendet?")) {
            localStorage.removeItem(scheduleName);
            loadSchedules();
        }
    }
}

function loadSchedules() {
    let select = document.getElementById('savedSchedules');
    select.innerHTML = '';
    for (let i = 0; i < localStorage.length; i++) {
        let scheduleName = localStorage.key(i);
        let option = document.createElement('option');
        option.text = scheduleName;
        option.value = scheduleName;
        select.add(option);
    }
}

function openScheduleDialog() {
    let dialog = document.getElementById('scheduleDialog');
    loadSchedules();
    if (localStorage.length > 0) {
        dialog.showModal();
    } else {
        alert('Nincs még elmentett órarended.');
    }
}

// Behúzott tantárgyak törlése
function clearSchedule() {
    $('#schedule .draggable').remove();
}

$(function() {
    // Betölti az elmentett órarendek listáját
    let savedSchedules = Object.keys(localStorage);
    savedSchedules.forEach(function(scheduleName) {
        $('#savedSchedules').append('<option>' + scheduleName + '</option>');
    });
    moveItem();
});
