---
date: 2022-03-31
title: System outage incident report
severity: info
---

# OpenAQ API outage incident report

**Date**: 2022-03-31

**Author**: Russ Biggs

**Summary**: The OpenAQ API

**Description**: Starting at 09:00 UTC on March 20 2022, the OpenAQ API began returning HTTP 503 Service Unavailable errors. The majority of 503 errors stopped around 03:00 UTC March 21 2022. The API continued to have intermittent HTTP 500 errors and slow response times until March 25 2022. Not all endpoints were affected by this issue, which primarily affected the v1 and v2 /measurements and /latest endpoints.

**Root Causes**: Scheduled updates to materialized views began taking much longer than usual when the issue started. The long processing time of these updates created locks on some tables in the OpenAQ database that prevent queries from executing at their requested time. The 503 errors were a result of these queries not completing within the database timeout limit. These locks also prevented other scheduled task in the database to complete causing a backlog. We do not understand what exactly caused the initial slow down that caused the backlong, but we continue to investigate.


**Resolution**: To prevent further outages we have scaled back the frequency of the scheduled refreshes to the material views. This should not affect data services and has restored the database to normal working order and reponsiveness.

