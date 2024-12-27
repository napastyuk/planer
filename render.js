

/*init*/
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
    const monthCalendarBodyEl = document.querySelector('.calendar .calendar_days-of-month');
    const monthCalendarTitleEl = document.querySelector('.calendar .calendar_title');
    
    let firstDayOfWeek = getClosestMonday();
    dateControl.value = firstDayOfWeek.toISOString().substring(0,10); //установим в инпут ближайший понедельник 
    renderLayoutBlocks(); //добавим линии для дней внутри блоков

    /*рендер динамических блоков*/
    function render(targetDay) {    
        renderWeekTitles(weekDaysSelectors, targetDay); //названия дней недели
        monthCalendarTitleEl.innerText = targetDay.toLocaleString("ru", {year: 'numeric', month: 'long'});
        renderCalendar(monthCalendarBodyEl, targetDay); //календарик на месяц
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




