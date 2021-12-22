{
    function updateCalendars(data) {
        const d = new Date();
        const d1 = new Date()
        d1.setMonth(d.getMonth() - 1);
        const d2 = new Date()
        d2.setMonth(d.getMonth() - 2);
        const months = [
            d2.getMonth(),
            d1.getMonth(),
            d.getMonth(),
        ]
        setMonthNames(months);
        const monthsData = months.map(o => {
            return data.monthlyAvgs.filter(d => {
                if (new Date(d.date).getMonth() == o) {
                    return d;
                }
            })
        })
        for (let i = 0; i < monthsData.length; i++) {
            setMonthColors(i, monthsData[i])
        }
    }

    function resetHeader(statusHeader) {
        statusHeader.classList.remove('card__header--operational')
        statusHeader.classList.remove('card__header--intermittent')
        statusHeader.classList.remove('card__header--down')
        statusHeader.innerText = '';
    }

    function resetBadge(statusBadge) {
        statusBadge.classList.remove('status-badge--operational');
        statusBadge.classList.remove('status-badge--intermittent');
        statusBadge.classList.remove('status-badge--down');
    }

    function updateStatus(data) {
        const statusHeader = document.querySelector('.js-status-header');
        const statusBadge = document.querySelector('.js-status-badge');
        resetHeader(statusHeader);
        resetBadge(statusBadge);
        if (data.status == "operational") {
            statusHeader.classList.add('status-header--operational')
            statusHeader.innerText = 'All Services operational';
            statusBadge.classList.add('status-badge--operational');
        }    
        if (data.status == "intermittent") {
            statusHeader.classList.add('status-header--intermittent')
            statusHeader.innerText = 'Inermittent outages';
            statusBadge.classList.add('status-badge--intermittent');
        }  
        if (data.status == "down") {
            statusHeader.classList.add('status-header--down')
            statusHeader.innerText = 'All Services down';
            statusBadge.classList.add('status-badge--down');
        }  
    }

    function setMonthNames(months) {
        const monthNames = ["January","February","March","April","May","June","July",
        "August","September","October","November","December"];
        const monthLabels = document.querySelectorAll('.js-month-label');
        for (let i = 0; i < months.length; i ++) {
            monthLabels[i].innerText = monthNames[months[i]]
        }
    }

    function setMonthColors(monthIdx, data) {
        const calendar = document.querySelectorAll(".js-calendar")[monthIdx];
        const d =  new Date(data[0].date);
        const days = calendar.querySelectorAll('.day');
        const startIdx = d.getDay()
        for (let i = 0; i < data.length;  i++) {
            const day = days[startIdx + i]
            const date = new Date(data[i].date)
            const tooltip = document.createElement('div');
            const tooltipArrow = document.createElement('i');
            day.classList.add('tooltip');
            tooltip.innerHTML = `<p>${date.toLocaleDateString('en-US')} - ${data[i].status}</p> ${tooltipArrow.outerHTML}`;
            tooltip.classList.add('top')
            day.appendChild(tooltip)
            if (data[i].status == 'operational') {
                day.classList.add('day--operational'); 
            }
            if (data[i].status == 'intermittent') {
                day.classList.add('day--intermittent'); 
            }
            if (data[i].status == 'no data') {
                day.classList.add('day--no-data'); 
            }
        }
    }

    let lastUpdated;
    let mostRecentHistoricDate;

    function getData() {
        fetch('http://localhost:8003/historic').then(res => res.json()).then(data => {
            if (data.monthlyAvgs[data.monthlyAvgs.length - 1].date != mostRecentHistoricDate) {
                updateCalendars(data);
                mostRecentHistoricDate = data.monthlyAvgs[data.monthlyAvgs.length - 1].date;
            }
        })
        fetch('http://localhost:8003/current').then(res => res.json()).then(data => {
            if (data.lastUpdated != lastUpdated) {
                updateStatus(data);
                lastUpdated = data.lastUpdated;
            }
        })
    } 

    getData();

    setInterval(getData, 1000 * 60 * 5);
}