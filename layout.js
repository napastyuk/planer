/**
 * Добавление разметки
 */

function renderLayoutBlocks() {
    let weekDayLinesCount = 9;
    let tasksLinesCount = 7;
    let notesLinesCount = 10;
    let trackerLinesCount = 7;

    function addLinesInWeekDayBlock() {
        daysEl = document.querySelectorAll('.week-day');
        daysEl.forEach(dayEl => {
            let counter = weekDayLinesCount;
            do {
                dayEl.insertAdjacentHTML('beforeend','<div class="week-day_lines"></div>');
            } while (--counter);
        });
    };
    addLinesInWeekDayBlock();

    function addLinesInBlock(container, count){
        let markup = '<div class="main-tasks_item"><div class="main-tasks_line"></div><svg><use href="#circle"></use></svg></div>';
        do {
            container.insertAdjacentHTML('beforeend', markup); 
        } while (--count);
    };
    document.querySelectorAll('.tasks-block').forEach(blockItem => addLinesInBlock(blockItem,tasksLinesCount));

    function addLinesInNotesBlock(container, count){
        let markup = '<div class="notes_line"></div>';
        do {
            container.insertAdjacentHTML('beforeend', markup); 
        } while (--count);
    };
    document.querySelectorAll('.notes').forEach(blockItem => addLinesInNotesBlock(blockItem,notesLinesCount));

    function addLinesInTrackerBlock(container, count) {
        let markup = "";
        let circleCount = 7;
        let circleX = 0;
        markup += '<div class="habits_item">';
        markup += '<div class="habits_line"></div>';
        markup += '<svg>';
        do {
            markup += `<use href="#circle" x="${circleX}"></use>`;
            circleX += 25;
        } while (--circleCount);
        markup += '</svg>';
        markup += '</div>';

        do {
            container.insertAdjacentHTML('beforeend', markup);
        } while (--count);
    };
    document.querySelectorAll('.habits').forEach(blockItem => addLinesInTrackerBlock(blockItem,trackerLinesCount));
};

/**
 * Генерация заголовков для дней недели с разметкой
 */
function renderWeekTitles(container, weekDaysSelectors, startDay){

    let dayOfTheMonth = [];
    let weekDay = [];
    let monthTitles = [];

    for (let index = 0; index < 7; index++) {
        let nextDay = new Date(startDay.getFullYear(), startDay.getMonth(), startDay.getDate() + index);
        
        let numberOfNextDay = nextDay.getDate();
        dayOfTheMonth.push(numberOfNextDay);   

        let weekDayOfNextDay = nextDay.toLocaleString('ru-RU', { weekday: 'long' });
        weekDay.push(weekDayOfNextDay);
        
        let monthOfNextDay = removeDot(nextDay.toLocaleString('ru-RU', { month: 'short' }));
        monthTitles.push(monthOfNextDay);
    }

    for (let i = 0; i < 7; i++) {
        let domEl = container.querySelector(`${weekDaysSelectors[i]} .week-day_title`);
        let dayTitle = `${weekDay[i]}  ${dayOfTheMonth[i]}  ${monthTitles[i]}`;
        domEl.innerText = dayTitle;
    }
};



/**
 * Генерация календаря на месяц с разметкой
 */

function renderCalendar(body, targetDate){    
    let targetDay = targetDate.getDate(); 
    let targetYear  = targetDate.getFullYear();
    let targetMonth = targetDate.getMonth();

    draw(body, targetYear, targetMonth);
    
    function draw(body, targetYear, targetMonth) {
        let arrTarget = range(getLastDay(targetYear, targetMonth));  //массив дней текущего месяца
        let arrBefore = range(getLastDay(targetYear, targetMonth - 1)); //массив дней предыдущего месяца
        let arrAfter = range(getLastDay(targetYear, targetMonth + 1)); //массив дней следующего месяца
        
        let firstWeekDay = getFirstWeekDay(targetYear, targetMonth); //какой день недели выпадает на первое число текущего месяца
        let lastWeekDay  = getLastWeekDay(targetYear, targetMonth); //какой день недели выпадает на последнее число текущего месяца
        
        let nums = chunk(normalize(arrTarget, arrBefore, arrAfter, firstWeekDay, 6 - lastWeekDay), 7);
        body.innerHTML = '';
        createTable(body, nums);
    }
    
    function createTable(parent, arr) {      
        parent.textContent = '';
        let cellsRow = [];
        let isCurrentMonth = false;

        for (let sub of arr) {
            let tr = document.createElement('tr');
            if (isCurrentMonth && sub.includes(targetDay)) tr.classList.add('border');

            for (let num of sub) {
                if (num === 1) isCurrentMonth = !isCurrentMonth;
                let td = document.createElement('td');
                if (isCurrentMonth) td.classList.add('bold');
                td.textContent = num;
                tr.appendChild(td);
                cellsRow.push(td);
            }

            parent.appendChild(tr);
        }
        return cellsRow;
    }
    
    // добавляем в массив с текущим месяцем числа из предудущего и последующего месяца до конца/начала недели
    function normalize(arr, arrBefore, arrAfter, left, right) {
        for (let i = 0; i < left; i++) {
            arr.unshift(arrBefore[arrBefore.length-(i + 1)]);
        }
        for (let i = 0; i < right; i++) {
            arr.push(arrAfter[i]);
        }
        return arr;
    }
    
    function getFirstWeekDay(year, month) {
        let date = new Date(year, month, 1);
        let num  = date.getDay();
        
        if (num == 0) {
            return 6;
        } else {
            return num - 1;
        }
    }
    
    function getLastWeekDay(year, month) {
        let date = new Date(year, month + 1, 0);
        let num  = date.getDay();
        
        if (num == 0) {
            return 6;
        } else {
            return num - 1;
        }
    }
    
    function getLastDay(year, month) {
        let date = new Date(year, month + 1, 0);
        return date.getDate();
    }
    
    function range(count) {
        let arr = [];
        
        for (let i = 1; i <= count; i++) {
            arr.push(i);
        }
        
        return arr;
    }
    
    //делим массив на части по 7 дней
    function chunk(arr, n) {
        let result = [];
        let count = Math.ceil(arr.length / n);
        
        for (let i = 0; i < count; i++) {
            let elems = arr.splice(0, n);
            result.push(elems);
        }
        
        return result;
    }   
};

document.addEventListener('DOMContentLoaded', function(){
    const dateControl = document.querySelector('.set-week input[type="date"]');
    const renderBtnEl = document.getElementById('render-calendar');
    const weekDaysSelectors = [
        '.week-day_monday',
        '.week-day_tuesday',
        '.week-day_wednesday',
        '.week-day_thursday',
        '.week-day_friday',
        '.week-day_saturday',
        '.week-day_sunday'
    ];
    const monthCalendarBodyElList = document.querySelectorAll('.calendar .calendar_days-of-month');
    const monthCalendarTitleElList = document.querySelectorAll('.calendar .calendar_title');
    const palnerElList = document.querySelectorAll('.layout');
    
    let firstDayOfWeek = getClosestMonday();
    dateControl.value = firstDayOfWeek.toISOString().substring(0,10); //установим в инпут ближайший понедельник 
    renderLayoutBlocks(); //добавим линии для дней внутри блоков

    /*рендер динамических блоков*/
    function render(targetDay) {
        //первая неделя
        monthCalendarTitleElList[0].innerText = targetDay.toLocaleString("ru", {year: 'numeric', month: 'long'});
        renderWeekTitles(palnerElList[0],weekDaysSelectors,targetDay);
        renderCalendar(monthCalendarBodyElList[0],targetDay)
        
        //вторая неделя
        nextWeekDate = new Date(targetDay.setDate(targetDay.getDate() + 7));
        renderWeekTitles(palnerElList[1],weekDaysSelectors,nextWeekDate);
        renderCalendar(monthCalendarBodyElList[1],nextWeekDate);
        monthCalendarTitleElList[1].innerText = nextWeekDate.toLocaleString("ru", {year: 'numeric', month: 'long'});
    };

    render(firstDayOfWeek);

    /*Пересчет  после календаря после ввода новой даты*/
    renderBtnEl.addEventListener('click', function() {
        let dateFromControl = new Date(dateControl.value);
        if (dateFromControl.getDay() !== 1) {
            alert('Первый день недели должен быть понедельником!');
            return;
        };
        render(dateFromControl);
    });    
})

/**
 * Хепперы
 */
function capitalizeFirstLetter(str) {
    if (!str) return str; // Проверка на пустую строку
    return str.charAt(0).toUpperCase() + str.slice(1);
}

function removeDot(str) {
    if (!str) return str; // Проверка на пустую строку
    return str.replace('.', '');
}

function getClosestMonday() {  //дата ближайшего понельника
    const today = new Date();
    const dayOfWeek = today.getDay(); //0 - воскресенье, 1 - понедельник и т.д.
    const daysToAdd = (dayOfWeek <= 1) ? 1 - dayOfWeek : 8 - dayOfWeek; //Рассчитываем, сколько дней нужно прибавить или отнять до понедельника
    const closestMonday = new Date();
    closestMonday.setDate(today.getDate() + daysToAdd);
    return closestMonday;
}
/**/
