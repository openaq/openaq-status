import sparkline from "@fnando/sparkline"; 

import langs from './i18n';
//lang set globally in previous script tag
{


    const locale = Intl.NumberFormat().resolvedOptions().locale;

    const sparklineElem = document.querySelector(".sparkline");
    
    
    function updateCalendars(data) {
        const d = new Date();
        let month = d.getMonth();

        const d1 = new Date();
        const d2 = new Date();
        
        let year = d.getFullYear();
        if (month == 0) {
            month = 12;
            year = year - 1;
        }
        d1.setFullYear(year);
        d1.setDate(1);
        d1.setMonth(month - 1);
        if (month == 1) {
            month = 13;
            year = year - 1;
        }
        d2.setDate(1);
        d2.setFullYear(year);
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
        const statusBadge = document.querySelector('.js-requests-status-badge');
        resetHeader(statusHeader);
        resetBadge(statusBadge);
        if (data.status == "operational") {
            statusHeader.classList.add('status-header--operational')
            statusHeader.innerText = langs[lang].allServicesOperational;
            statusBadge.classList.add('status-badge--operational');
            statusBadge.querySelector('div > p').innerText = 'All endpoints operational during last hour';
        }    
        if (data.status == "intermittent") {
            statusHeader.classList.add('status-header--intermittent')
            statusHeader.innerText = 'Intermittent Outages';
            statusBadge.classList.add('status-badge--intermittent');
            statusBadge.querySelector('div > p').innerText = 'One or more endpoints errored during last hour';
        }  
        if (data.status == "down") {
            statusHeader.classList.add('status-header--down')
            statusHeader.innerText = 'All Services Down';
            statusBadge.classList.add('status-badge--down');
            statusBadge.querySelector('div > p').innerText = 'All endpoints erroring during last hour';
        }
        for (const endpoint of data.endpoints) {
            const [_, version, path] = endpoint.name.split('\/');
            const badgeElem = document.querySelector(`.js-${version}-${path}-status-badge`);
            if (endpoint.status == "operational") {
                badgeElem.classList.add('status-badge--operational');
                badgeElem.querySelector('div > p').innerText = 'No errors detected during last hour';
            }    
            if (endpoint.status == "intermittent") {
                badgeElem.classList.add('status-badge--intermittent');
                badgeElem.querySelector('div > p').innerText = 'One of more errors detected during last hour';
            }  
            if (endpoint.status == "down") {
                badgeElem.classList.add('status-badge--down');
                badgeElem.querySelector('div > p').innerText = 'complete outage during last hour';
            }
        }  
    }


    function updateResponseTimeSparkline(data) {
        sparkline(sparklineElem, data);
    }

    function updateResponseTimeScore(data) {
        const lastValue = data.at(-1);
        const responseTimeScoreElem = document.querySelector('.js-response-time-score');
        responseTimeScoreElem.classList.remove("response-time-score--normal");
        responseTimeScoreElem.classList.remove("response-time-score--high");
        if (lastValue > 7500) {
            responseTimeScoreElem.innerText = "High";
            responseTimeScoreElem.classList.add("response-time-score--high");
        } else {
            responseTimeScoreElem.innerText = "Normal";
            responseTimeScoreElem.classList.add("response-time-score--normal");
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
            const statusCapitalized = langs[lang][status] || 'no data';
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



    function toggleEndpointCards() {
        const endpointStatuses = document.querySelectorAll('.js-endpoint-status');
        const expandButton = document.querySelector('.js-expand-btn');
        const state = expandButton.getAttribute('data-state');
        if (state == "open") {
            for (const endpointStatus of endpointStatuses) {
                endpointStatus.classList.remove('card-list__item--hidden');
                endpointStatus.classList.add('card-list__item');
            }
        } else {
            for (const endpointStatus of endpointStatuses) {
                endpointStatus.classList.add('card-list__item--hidden');
                endpointStatus.classList.remove('card-list__item');
            }
        }
    }


    const expandButton = document.querySelector('.js-expand-btn');
    expandButton.addEventListener('click', e => {
        const target = e.target;
        const state = target.getAttribute('data-state');
        if (state == 'closed') {
            target.src = '/svg/chevron-up.svg';
            target.setAttribute('data-state', 'open');
        } else {
            target.src = '/svg/chevron-down.svg';
            target.setAttribute('data-state', 'closed');
        }
        toggleEndpointCards();
    });    



    let mostRecentHistoricDate;
    let responseTimeHistory;

    function getData() {
        fetch('https://api.openaqstatus.org/historic').then(res => res.json()).then(data => {
            if (data.monthlyAvgs[data.monthlyAvgs.length - 1].date != mostRecentHistoricDate) {
                updateCalendars(data);
                mostRecentHistoricDate = data.monthlyAvgs[data.monthlyAvgs.length - 1].date;
            }
        })
        fetch('https://api.openaqstatus.org/current').then(res => res.json()).then(data => {
            updateStatus(data);
            lastUpdated = data.lastUpdated;
        })
        fetch('https://api.openaqstatus.org/response-time').then(res => res.json()).then(data => {
            if (data.responseHistory != responseTimeHistory) {
                updateResponseTimeSparkline(data.responseHistory);
                updateResponseTimeScore(data.responseHistory);
                responseTimeHistory = data.responseHistory;
            }
        })
    } 

    getData();

    setInterval(getData, 1000 * 60 * 5);
}