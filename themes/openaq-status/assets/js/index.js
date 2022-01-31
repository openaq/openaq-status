import sparkline from "@fnando/sparkline"; 

import langs from './i18n';
//lang set globally in previous script tag
{


    const locale = Intl.NumberFormat().resolvedOptions().locale;


    const latencyData = [
        334.88927542682933,  282.2285121000001,
        277.25652529875526, 313.27633768464716,
         387.3416669999999,  321.9994582685952,
        363.45742915481134,  276.4172884605809,
         294.7158107857143,  288.7977031363638,
         278.8792257740585,  294.4576054564315,
         384.1272662384937, 357.17573612970733,
         317.6760689776782, 700, 1200
      ];


    const sparklineElem = document.querySelector(".sparkline");
    
    
    function updateCalendars(data) {
        const d = new Date();
        let month = d.getMonth();
        if (month == 0) {
            month = 12;
        }
        const d1 = new Date();
        d1.setMonth(month - 1);
        const d2 = new Date();
        d2.setMonth(month - 2);
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
        statusHeader.classList.remove('status-header--operational')
        statusHeader.classList.remove('status-header--intermittent')
        statusHeader.classList.remove('status-header--down')
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
            statusHeader.innerText = langs[lang].allServicesOperational;
            statusBadge.classList.add('status-badge--operational');
        }    
        if (data.status == "intermittent") {
            statusHeader.classList.add('status-header--intermittent')
            statusHeader.innerText = 'Intermittent Outages';
            statusBadge.classList.add('status-badge--intermittent');
        }  
        if (data.status == "down") {
            statusHeader.classList.add('status-header--down')
            statusHeader.innerText = 'All Services Down';
            statusBadge.classList.add('status-badge--down');
        }  
    }


    function updateLatencySparkline(data) {
        sparkline(sparklineElem, data);
    }

    function updateLatencyScore(data) {
        const lastValue = data.at(-1);
        const latencyScoreElem = document.querySelector('.js-latency-score');
        latencyScoreElem.classList.remove("latency-score--normal");
        latencyScoreElem.classList.remove("latency-score--high");
        if (lastValue > 500) {
            latencyScoreElem.innerText = "High";
            latencyScoreElem.classList.add("latency-score--high");
        } else {
            latencyScoreElem.innerText = "Normal";
            latencyScoreElem.classList.add("latency-score--normal");
        }
    }

    function setMonthNames(months) {
        const monthNames = langs[lang].months;
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
            const status = data[i].status;
            const statusCapitalized = `${langs[lang][status]}`;
            tooltip.innerHTML = `<p>${date.toLocaleDateString(locale)} - ${statusCapitalized}</p> ${tooltipArrow.outerHTML}`;
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
    let latencyHistory;

    function getData() {
        fetch('https://api.openaqstatus.org/historic').then(res => res.json()).then(data => {
            if (data.monthlyAvgs[data.monthlyAvgs.length - 1].date != mostRecentHistoricDate) {
                updateCalendars(data);
                mostRecentHistoricDate = data.monthlyAvgs[data.monthlyAvgs.length - 1].date;
            }
        })
        fetch('https://api.openaqstatus.org/current').then(res => res.json()).then(data => {
            if (data.lastUpdated != lastUpdated) {
                updateStatus(data);
                lastUpdated = data.lastUpdated;
            }
        })
        fetch('https://api.openaqstatus.org/latency').then(res => res.json()).then(data => {
            if (data.latencyHistory != latencyHistory) {
                updateLatencySparkline(data.latencyHistory);
                updateLatencyScore(data.latencyHistory);
                latencyHistory = data.latencyHistory;
            }
        })
    } 

    getData();

    setInterval(getData, 1000 * 60 * 5);
}