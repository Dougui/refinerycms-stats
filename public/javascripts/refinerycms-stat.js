// Copyright 2009 Google Inc. All Rights Reserved.

/* Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
 /**
 * @fileoverview A very simple demo showing how easy it is to visualize
 * GA data in the Google Visualization API. In this demo we show the
 * top 10 tracked pages tiles and page URIs by pageviews in a
 * Gviz Table, Pie Chart and Column Chart.
 */

var myService;
var dataTable;
var pageViewsTable;
var pageViewsChart;
var pageViewsColumnChart;
var visitsLineChart;
var visitsTable;
var timesOnSiteLineChart;
var timesOnSiteTable;
var sourcePieChart;
var sourceTable;
var keywordPieChart;
var keywordTable;
var scope = 'https://www.google.com/analytics/feeds';
var profileId;
var pageCode;

/**
 * Initialize all the objects from the Google AJAX Apis once they
 *     have been loaded and are ready to use.
 */
function collectStatsData(pageCodeArg) {
  var divLogin = document.getElementById('login');
  var divLogged = document.getElementById('logged');
  divLogin.style.visibility = 'hidden';
  divLogged.style.visibility = 'hidden';

  if (google.accounts.user.checkLogin(scope)) {
    divLogin.style.visibility = 'hidden';
    divLogged.style.visibility = 'visible';
    divLogged.style.position = 'relative';
    divLogged.style.position = "relative";
    divLogged.style.top = -divLogin.offsetHeight+"px";

    pageCode = pageCodeArg;
    myService = new google.gdata.analytics.AnalyticsService('gaExportAPI_gViz_v1.0');
    pageViewsTable = new google.visualization.Table(document.getElementById('pageViewsTableDiv'));
    pageViewsChart = new google.visualization.PieChart(document.getElementById('pageViewsChartDiv'));
    pageViewsColumnChart = new google.visualization.ColumnChart(document.getElementById('pageViewsColumnChartDiv'));


    sourcePieChart = new google.visualization.PieChart(document.getElementById('sourcePieChartDiv'));
    sourceTable = new google.visualization.Table(document.getElementById('sourceTableDiv'));

    keywordPieChart = new google.visualization.PieChart(document.getElementById('keywordPieChartDiv'));
    keywordTable = new google.visualization.Table(document.getElementById('keywordTableDiv'));

    visitsLineChart = new google.visualization.LineChart(document.getElementById('visitsLineChartDiv'));
    visitsTable = new google.visualization.Table(document.getElementById('visitsTableDiv'));

    visitorsLineChart = new google.visualization.LineChart(document.getElementById('visitorsLineChartDiv'));
    visitorsTable = new google.visualization.Table(document.getElementById('visitorsTableDiv'));

    timesOnSiteLineChart = new google.visualization.LineChart(document.getElementById('timesOnSiteLineChartDiv'));
    timesOnSiteTable = new google.visualization.Table(document.getElementById('timesOnSiteTableDiv'));

    getWebPropertyFeed();
  } else {
    divLogin.style.visibility = 'visible';
    divLogged.style.visibility = 'hidden';	  
    document.getElementById('buttonLogin').onclick = handleLogin;
  }
}

function handleLogin() {
  google.accounts.user.login(scope);
}

function getWebPropertyFeed() {
  var webPropertyFeedUri = [scope, '/datasources/ga/accounts/',pageCode.split('-')[1],'/webproperties/',pageCode,'/profiles'].join('');

  // Send asynchronous request to the Management API.
  myService.getManagementFeed(webPropertyFeedUri, printWebPropertyFeed,handleError);
}

function printWebPropertyFeed(result) {
  var feed = result.feed;
  var entries = feed.getEntries();
  var GAProfileId;
  if (entries.length) {
    for (var i = 0, entry; entry = entries[i]; ++i) {
      GAProfileId = entry.getPropertyValue('ga:profileId');
    }
  }
  profileId = GAProfileId;
  getPageViewsDataFeed();
  getVisitsDataFeed();
  getVisitorsDataFeed();
  getTimeOnSiteDataFeed();
	getSourceDataFeed();
	getKeywordDataFeed();
}

function getDateConditions() {
  var toDay = new Date(); 
  var lastMonth = new Date (toDay.getFullYear(), toDay.getMonth()-1, toDay.getDate());

  var lastMonthStr;
  if ((lastMonth.getMonth() + 1) < 10) {
    lastMonthStr = '0'+(lastMonth.getMonth() + 1);
  } else {
    lastMonthStr = (lastMonth.getMonth() + 1);
  }

  var lastMonthDayStr;
  if ((lastMonth.getDate() + 1) < 10) {
    lastMonthDayStr = '0'+(lastMonth.getDate());
  } else {
    lastMonthDayStr = (lastMonth.getDate());
  }

  var currentMonthStr;
  if ((toDay.getMonth() + 1) < 10) {
    currentMonthStr = '0'+(toDay.getMonth() + 1);
  } else {
    currentMonthStr = (toDay.getMonth() + 1);
  }

  var currentMonthDayStr;
  if ((toDay.getDate() + 1) < 10) {
    currentMonthDayStr = '0'+(toDay.getDate());
  } else {
    currentMonthDayStr = (toDay.getDate());
  }

  var conditions = '?start-date='+ lastMonth.getFullYear() + '-' + lastMonthStr + '-' + lastMonthDayStr + '&end-date='+ toDay.getFullYear() + '-' + currentMonthStr + '-' + currentMonthDayStr

  return conditions;
}

/**
 * Request data from GA Export API
 */
function getPageViewsDataFeed() {
	var myFeedUri = scope + '/data' + getDateConditions() +
    '&dimensions=ga:pageTitle,ga:pagePath' +
    '&metrics=ga:pageviews' +
    '&sort=-ga:pageviews' +
    '&max-results=10' +
    '&ids=ga:' + profileId;

  myService.getDataFeed(myFeedUri, handlePageViewsDataFeed, handleError);
}

/**
 * Request data from GA Export API
 */
function getVisitsDataFeed() {
  var myFeedUri = scope + '/data' + getDateConditions() +
    '&dimensions=ga:day,ga:year,ga:month,ga:date' +
  	'&metrics=ga:visits' +
  	'&sort=ga:date' +
    '&ids=ga:' + profileId;

  myService.getDataFeed(myFeedUri, handleVisitsDataFeed, handleError);
}

/**
 * Request data from GA Export API
 */
function getVisitorsDataFeed() {
  var myFeedUri = scope + '/data' + getDateConditions() +
    '&dimensions=ga:day,ga:year,ga:month,ga:date' +
  	'&metrics=ga:visitors' +
  	'&sort=ga:date' +
    '&ids=ga:' + profileId;

  myService.getDataFeed(myFeedUri, handleVisitorsDataFeed, handleError);
}

/**
 * Request data from GA Export API
 */
function getTimeOnSiteDataFeed() {
  var myFeedUri = scope + '/data' + getDateConditions() +
    '&dimensions=ga:day,ga:year,ga:month,ga:date' +
  	'&metrics=ga:timeOnSite,ga:visits' +
  	'&sort=ga:date' +
    '&ids=ga:' + profileId;

  myService.getDataFeed(myFeedUri, handleTimeOnSiteDataFeed, handleError);
}

/**
 * Request data from GA Export API
 */
function getSourceDataFeed() {
  var myFeedUri = scope + '/data' + getDateConditions() +    
		'&dimensions=ga:source' +
    '&metrics=ga:visits' +
    '&sort=-ga:visits' +
    '&max-results=20' +
    '&ids=ga:' + profileId;

  myService.getDataFeed(myFeedUri, handleSourceDataFeed, handleError);
}

/**
 * Request data from GA Export API
 */
function getKeywordDataFeed() {
  var myFeedUri = scope + '/data' + getDateConditions() +    
		'&dimensions=ga:keyword' +
    '&metrics=ga:visits' +
    '&sort=-ga:visits' +
    '&max-results=20' +
    '&ids=ga:' + profileId;

  myService.getDataFeed(myFeedUri, handleKeywordDataFeed, handleError);
}

/**
 * Handle and display any error that occurs from the API request.
 * @param {Object} e The error object returned by the Analytics API.
 */
function handleError(e) {
  var msg = e.cause ? e.cause.statusText : e.message;
  msg = 'ERROR: ' + msg;
  alert(msg);
}

/**
 * Handle all the data returned by GA Export API.
 * Delete existing GViz dataTable before creating a new one.
 * @param {Object} myResultsFeedRoot the feed object
 *     retuned by the data feed.
 */
function handlePageViewsDataFeed(resultsFeedRoot) {
  dataTable = new google.visualization.DataTable();
  fillPageViewsDataTable(dataTable, resultsFeedRoot);
  pageViewsTable.draw(dataTable);

  // remove the URI column to only graph 1 dimension
  dataTable.removeColumn(0);
  pageViewsChart.draw(dataTable, {width: 950, height: 400});
  pageViewsColumnChart.draw(dataTable, {width: 950, height: 300, legend: 'none'});
}

/**
 * Handle all the data returned by GA Export API.
 * Delete existing GViz dataTable before creating a new one.
 * @param {Object} myResultsFeedRoot the feed object
 *     retuned by the data feed.
 */
function handleVisitsDataFeed(resultsFeedRoot) {
	dataTable = new google.visualization.DataTable();
  fillVisitsDataTable(dataTable, resultsFeedRoot);
  visitsLineChart.draw(dataTable, {width: 750, height: 500, legend: 'none'});
  visitsTable.draw(dataTable);
}

function handleVisitorsDataFeed(resultsFeedRoot) {
	dataTable = new google.visualization.DataTable();
  fillVisitorsDataTable(dataTable, resultsFeedRoot);
  visitorsLineChart.draw(dataTable, {width: 750, height: 500, legend: 'none'});
  visitorsTable.draw(dataTable); 
}

function handleTimeOnSiteDataFeed(resultsFeedRoot) {
	dataTable = new google.visualization.DataTable();
  fillTimesOnSiteDataTable(dataTable, resultsFeedRoot);
  timesOnSiteLineChart.draw(dataTable, {width: 750, height: 500, legend: 'none'});
  timesOnSiteTable.draw(dataTable);
}

function handleSourceDataFeed(resultsFeedRoot) {
	dataTable = new google.visualization.DataTable();
  fillSourceDataTable(dataTable, resultsFeedRoot);
  sourcePieChart.draw(dataTable, {width: 600, height: 400, legend: 'none'});
  sourceTable.draw(dataTable);
}

function handleKeywordDataFeed(resultsFeedRoot) {
	dataTable = new google.visualization.DataTable();
  fillKeywordDataTable(dataTable, resultsFeedRoot);
  keywordPieChart.draw(dataTable, {width: 600, height: 400, legend: 'none'});
  keywordTable.draw(dataTable);
}

/**
 * Put the feed result into a GViz Data Table.
 * @param {Object} dataTable the GViz dataTable
    dataTable.setCell(0, 1, '0'); object to put data into.
 * @param {Object} myResultsFeedRoot the feed returned by the GA Export API.
 * @return {Objcet} GViz DataTable object.
 */
function fillPageViewsDataTable(dataTable, myResultsFeedRoot) {
  var entries = myResultsFeedRoot.feed.getEntries();

  var datas = getGADatasInTable(entries, ['pageTitle','pagePath','pageviews']); 
  fillDataTable(entries, dataTable, [['string', I18n.t('admin.stats.title'), datas[0]],['string',  I18n.t('admin.stats.path'), datas[1]],['number',  I18n.t('admin.stats.page_views'), datas[2]]]);
}

function fillKeywordDataTable(dataTable, myResultsFeedRoot) {
  var entries = myResultsFeedRoot.feed.getEntries();
	var keywords = new Array();
  var visits = new Array();

  for (var i = 0, entry; entry = entries[i]; ++i) {
		
    if (entry.getValueOf('ga:keyword') != '(not set)') {
      keywords.push(entry.getValueOf('ga:keyword'));
      visits.push(entry.getValueOf('ga:visits'));
    }
  }

  fillDataTable(entries, dataTable, [['string', I18n.t('admin.stats.keywords'), keywords],['number',  I18n.t('admin.stats.visits'), visits]]);
	dataTable.removeRow(dataTable.getNumberOfRows()-1);
}

function fillSourceDataTable(dataTable, myResultsFeedRoot) {
  var entries = myResultsFeedRoot.feed.getEntries();
	var dates = new Array();

  var datas = getGADatasInTable(entries, ['source', 'visits']);
  fillDataTable(entries, dataTable, [['string', I18n.t('admin.stats.source'), datas[0]],['number',  I18n.t('admin.stats.visits'), datas[1]]]);
}

function fillVisitsDataTable(dataTable, myResultsFeedRoot) {
  var entries = myResultsFeedRoot.feed.getEntries();
	var dates = new Array();

  var datas = getGADatasInTable(entries, ['visits'], dates);
  fillDataTable(entries, dataTable, [['string', I18n.t('admin.stats.date'), dates],['number', I18n.t('admin.stats.visits'), datas[0]]]);
}

function fillVisitorsDataTable(dataTable, myResultsFeedRoot) {
  var entries = myResultsFeedRoot.feed.getEntries();
  var dates = new Array();

  var datas = getGADatasInTable(entries, ['visitors'], dates);
  fillDataTable(entries, dataTable, [['string',I18n.t('admin.stats.date'), dates],['number', I18n.t('admin.stats.visitors'), datas[0]]]);
}

function fillTimesOnSiteDataTable(dataTable, myResultsFeedRoot) {
  var entries = myResultsFeedRoot.feed.getEntries();
  var timesOnSite = new Array();
  var dates = new Array();

  for (var i = 0, entry; entry = entries[i]; ++i) {
    fillDate(entry, timesOnSite, dates);

    if (entry.getValueOf('ga:visits') != 0) {
      timesOnSite.push(entry.getValueOf('ga:timeOnSite') / entry.getValueOf('ga:visits'));
    } else {
      timesOnSite.push(0);    
    }
  }

  for (var i = 0; i < timesOnSite.length ; ++i) {
      timesOnSite[i] = Math.round(timesOnSite[i] / 60);
  }

	convertDates(dates);

  fillDataTable(entries, dataTable, [['string',I18n.t('admin.stats.date'), dates],['number', I18n.t('admin.stats.average_time'), timesOnSite]]);
}

function fillDate(entry, dataTable, dateTable) {
  var date = new Date(entry.getValueOf('ga:year'), entry.getValueOf('ga:month')-1, entry.getValueOf('ga:day'));

  // At the beginning of each day, check if data was missing for previous
  // day.  Insert "0" in appropriate visitor's array as necessary, using
  // fillToSameSize helper method.
  var lastDate = dateTable[dateTable.length - 1];
  if(lastDate) {
    while (Date.parse(date) != Date.parse(lastDate)) {
      lastDate = new Date (lastDate.getFullYear(), lastDate.getMonth(), lastDate.getDate() + 1);
      if (Date.parse(date) != Date.parse(lastDate)) {
        dataTable.push(0); 
        dateTable.push(lastDate);
      }
    }
  }

  dateTable.push(date);	
}

function fillDataTable(entries, dataTable, datas) {
  for (var i = 0; i < datas.length; i++) {
    dataTable.addColumn(datas[i][0], datas[i][1]);
  }
  
  dataTable.addRows(entries.length);

  for (var idx = 0; idx < entries.length; idx++) {
    var entry = entries[idx];
    for (var i = 0; i < datas.length; i++) {
      dataTable.setCell(idx, i, datas[i][2][idx]);
    }
  }
}

function getGADatasInTable(entries, datas, dates) {  
  var results = new Array();

  for (var idx = 0; idx < entries.length; idx++) {
    var entry = entries[idx];
    for (var i = 0; i <datas.length; i++) {
      results.push(new Array());
      var GAData = entry.getValueOf('ga:'+datas[i]);
      if (dates) {
        fillDate(entry, results[i], dates);
      }
      results[i].push(GAData);
    }
  }

  convertDates(dates);
  return results
}

function convertDates(dates) {
  if (dates) {
    for (var i = 0; i < dates.length; i++) {
      dates[i] = dates[i].toLocaleString().substr(0,10);
    }	
  }
}

// Load the Google Visualization API client Libraries
google.load('visualization', '1', {packages: ['piechart', 'table', 'columnchart', 'linechart']});

// Load the Google data JavaScript client library
google.load('gdata', '2.x', {packages: ['analytics']});
