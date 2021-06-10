const circuits = {
    'bahrain' : { 
        'track-outline' : 'monaco.png',
        'track-sectors' : 'monaco-sectors.png' },
    'imola' : { 
        'track-outline' : 'monaco.png',
        'track-sectors' : 'monaco-sectors.png' },
    'portimao' : { 
        'track-outline' : 'monaco.png',
        'track-sectors' : 'monaco-sectors.png' },
    'catalunya' : { 
        'track-outline' : 'monaco.png',
        'track-sectors' : 'monaco-sectors.png' },
    'monaco' : { 
        'track-outline' : 'monaco.png',
        'track-sectors' : 'monaco-sectors.png' },
    'azerbaijan' : { 
        'track-outline' : 'azerbaijan.png',
        'track-sectors' : 'azerbaijan-sectors.png' },
        
};

// const CONSTRUCTORS = {
//     'alfa' : {
//         'car-image' : 'alra_romeo.png'
//     },
//     'alphatauri' : {
//         'car-image' : 'alphatauri.png'
//     },
//     'alpine' : {
//         'car-image' : 'alpine.png'
//     },
//     'aston_martin' : {
//         'car-image' : 'aston_martin.png'
//     },
//     'ferrari' : {
//         'car-image' : 'ferrari.png'
//     },
//     'haas' : {
//         'car-image' : 'haas.png'
//     },
//     'mclaren' : {
//         'car-image' : 'mclaren.png'
//     },
//     'mercedes' : {
//         'car-image' : 'mercedes.png'
//     },
//     'red_bull' : {
//         'car-image' : 'red_bull.png'
//     },
//     'williams' : {
//         'car-image' : 'williams.png'
//     },
// }

const countryFlags = [
    {
        'nationality' : 'Dutch',
        'code' : 'NL'
    },
    {
        'nationality' : 'Spanish',
        'code' : 'ES'
    },
    {
        'nationality' : 'British',
        'code' : 'GB'
    },
    {
        'nationality' : 'Mexican',
        'code' : 'MX'
    },
    {
        'nationality' : 'German',
        'code' : 'DE'
    },
    {
        'nationality' : 'Canadian',
        'code' : 'CA'
    },
    {
        'nationality' : 'French',
        'code' : 'FR'
    },
    {
        'nationality' : 'Italian',
        'code' : 'IT'
    },
    {
        'nationality' : 'Finnish',
        'code' : 'FI'
    },
    {
        'nationality' : 'Australian',
        'code' : 'AU'
    },
    {
        'nationality' : 'Japanese',
        'code' : 'JP'
    },
    {
        'nationality' : 'Russian',
        'code' : 'RU'
    },
    {
        'nationality' : 'Thai',
        'code' : 'TH'
    },
    {
        'nationality' : 'Danish',
        'code' : 'DK'
    },
    {
        'nationality' : 'Polish',
        'code' : 'PL'
    },
    {
        'nationality' : 'Belgian',
        'code' : 'BE'
    },
    {
        'nationality' : 'Swedish',
        'code' : 'SE'
    },
    {
        'nationality' : 'Brazilian',
        'code' : 'BR'
    },
    {
        'nationality' : 'New Zealander',
        'code' : 'NZ'
    },
    {
        'nationality' : 'Monegasque',
        'code' : 'MC'
    }
]





function drawCircuit(c) {

    $('#body h1').html(c['circuitName']);
    // $('#track').attr("src",`assets/img/${c['circuitId']}.png`);
    // $('#track-sectors').attr("src",`assets/img/${c['circuitId']}-sectors.png`);
    if (circuits[c['circuitId']]) {
        $('#track').attr("src",`assets/img/${circuits[c['circuitId']]['track-outline']}`);
        $('#track-sectors').attr("src",`assets/img/${circuits[c['circuitId']]['track-sectors']}`);
    }
    else {
        $('#track').attr("src",``);
        $('#track-sectors').attr("src",``);
    }

    // GOOGLE MAP API CALL
    let map;
    map = new google.maps.Map(document.getElementById("map"), {     // removed callback function as only gets written when circuit api is done.
        center: { lat: parseFloat(c['Location']['lat']), lng: parseFloat(c['Location']['long']) },        // HAD PROBLEM THAT IT WASNT A NUMBER
        zoom: 18,
        mapTypeId:google.maps.MapTypeId.HYBRID
    });
}


// ERROR WHEN THERE ARE NO LAPS DRIVEN
function drawDriversLapTimes(driverId, containerId) {
    
    jsonCall(`https://ergast.com/api/f1/${F1_SEASON}/${F1_ROUND}/drivers/${driverId}/laps.json?limit=200`, function(response) {

        let ctx = document.getElementById(containerId).getContext('2d'); // HAS ERROR ON CONSOLE
        let labelsArray = [];
        let dataArrayTimes = [];
        let dataArrayPosition = [];

        response['MRData']['RaceTable']['Races'][0]['Laps'].forEach(lap => {
            labelsArray.push(lap['number']);

            let tempTimeSplit = lap['Timings'][0]['time'].split(":"); // FIX IN THE MS2 BOOKMARKS
            let tempTime = (parseFloat(tempTimeSplit[0])*60)+parseFloat(tempTimeSplit[1]);
            if (tempTime > 300) tempTime = 300;

            dataArrayTimes.push(tempTime);
            dataArrayPosition.push(lap['Timings'][0]['position']);
        });


        let myChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labelsArray,
                datasets: [
                    {
                        label: 'Lap time (s)',
                        data: dataArrayTimes,
                        borderColor: 'rgba(255, 99, 132, 1)',
                        borderWidth: 1,
                        yAxisID: 'y',
                    },
                    {
                        label: 'Track position',
                        data: dataArrayPosition,
                        borderColor: 'rgba(0, 0, 132, 0.3)',
                        borderWidth: 1,
                        yAxisID: 'y1',
                    }            
                ]
            },
            options: {
                pointRadius: 0,
                scales: {
                    y: {
                        type: 'linear',
                        display: true,
                        position: 'left',
                        beginAtZero: false
                    },
                    y1: {
                        type: 'linear',
                        display: true,
                        position: 'right',
                        grid: {
                            drawOnChartArea: false,
                        },
                    },
                }
            }
        });
    });    
}



    function drawRaceStandings(r) {
        $('#race-standings tbody').empty();
        r.forEach((e, key) => {

            let flag = countryFlags.find(i => i['nationality'] === e['Driver']['nationality']);
            let flagImg = (flag) ? `<img src="https://www.countryflags.io/${flag['code']}/flat/24.png" alt="${e['Driver']['nationality']}">` : '';
            let gain = parseInt(e['grid'])-parseInt(e['position']);
            
            $('#race-standings tbody').append(`<tr>
                <td>${e['position']}</td>
                <td>${e['number']}</td>
                <td>${e['Driver']['nationality']}</td>
                <td>${flagImg}</td>
                <td>${e['Driver']['givenName']} ${e['Driver']['familyName']}</td>
                <td><img src="assets/img/constructors/${e['Constructor']['constructorId']}.png" width="50"></td>
                <td>${e['Constructor']['name']}</td>
                <td>${e['points']}</td>
                <td>
                    <button class="button head2head-select1" data-key="${key}">a</button>
                    <button class="button head2head-select2" data-key="${key}">b</button>
                </td>
                <td>${e['grid']}</td>
                <td>${gain}</td>
                <td>${(gain >= 1) ? '<i class="fas fa-angle-double-up"></i>' : (gain < 0) ? '<i class="fas fa-angle-double-down"></i>' : '' }</td>
                <td>${('Time' in e) ? e['Time']['time'] : ''}</td>
                <td>${(e['status'] === 'Finished') ? '<i class="fas fa-flag-checkered"></i>' : e['status'] }</td>
            </tr>`);
        });
    
        $(".head2head-select1").click(function() {
            headToHead(r[this.dataset.key],F1_HEAD2HEAD_2);
        })
    
        $(".head2head-select2").click(function() {
            headToHead(F1_HEAD2HEAD_1,r[this.dataset.key]);
        })

    }


    function headToHead(one,two) {

        let loop = one;

        for (i=1; i<=2; i++) {
            let flag = countryFlags.find(i => i['nationality'] === loop['Driver']['nationality']);
            let gain = parseInt(loop['grid'])-parseInt(loop['position']);

            $(`#head2head-${i}`).html(`
                <img class="head2head-car" src="assets/img/constructors/${loop['Constructor']['constructorId']}.png">
                <h3>${loop['Driver']['familyName']} [${loop['Driver']['permanentNumber']}]</h3>
                <img class="head2head-flag" src="https://www.countryflags.io/${flag['code']}/flat/64.png" alt="${loop['Driver']['nationality']}">

                <div class="head2head-position">#${loop['position']}</div>
                <div class="head2head-points">${loop['points']} pts</div>
                <div class="head2head-grid">${gain} ${(gain >= 1) ? '<i class="fas fa-angle-double-up"></i>' : (gain < 0) ? '<i class="fas fa-angle-double-down"></i>' : '' }</div>

                ${ (loop['FastestLap']) ? `
                    <div class="head2head-fastestLap">Fastest Lap ${loop['FastestLap']['Time']['time']} (#${loop['FastestLap']['rank']})</div>
                    <div class="head2head-averageSpeek">${loop['FastestLap']['AverageSpeed']['speed']}${loop['FastestLap']['AverageSpeed']['units']}</div>` : `` }
                    
                <h4>Lap Times</h4>
                <canvas id="head2head-laptimes-${i}" width="400" height="400"></canvas>
                `);

            drawDriversLapTimes(loop['Driver']['driverId'],`head2head-laptimes-${i}`);
            loop = two;
        }
    }


// SHOW ERRORS
function showErrors(e) {
    $('#errors').html(e);
    $('#errors').slideDown('slow');
}


// GET RACE WIKI 
function getWikiInfo(url) {
    $.when($.getJSON(`https://en.wikipedia.org/w/api.php?action=parse&page=2021_Monaco_Grand_Prix&format=json&origin=*`)).then(
        function(wiki) {
            wiki = wiki['parse'];
            console.log('SUCCESS WIKI',wiki);
            $('#wiki').html(wiki['externallinks'][0]);
            
            let imageURL = '';
            wiki['images'].forEach(img => {
                imageURL += `|File:${img}`;
            });

            $.when($.getJSON(`https://en.wikipedia.org/w/api.php?action=query&format=json&prop=imageinfo&iiprop=url&titles=${imageURL}&origin=*`)).then(
                function(wiki) {
                    wiki = wiki['query']['pages'];
                    console.log('SUCCESS WIKI IMG',wiki);
                    for (let key in wiki) {
                        $('#wiki').append(`<img src="${wiki[key]['imageinfo'][0]['url']}" width="100">`);
                        // console.log(wiki[i]);
                    };

                },
                function(e) {
                    console.log('ERROR IMG WIKI',e);
                    showErrors('Error getting WIKI images');
                }
            );

        },
        function(e) {
            console.log('ERROR WIKI',e);
            showErrors(e['statusText']);
        }
    );
}


// JSON CALL FUNCTION. RETURN ERROR IF NEEDED
function jsonCall(url,callback, error = 'Default error'){
    $.when($.getJSON(url)).then(
        function(response) {
            console.log(`JSON SUCCESS: ${url}`,response);
            callback(response);
       },
        function(e) {
            console.log(`JSON ERROR:`,error,e);
            showErrors(`${error} (${e['statusText']})`);
        }
    );
}




    // GAME WHERE YOU GUESS WHERE CARS FINISH BEFORE THE TABLE IS MATCHED UP. POINTS FOR EACH ONE RIGHT.


function navRounds(season) {
    // SHOW ALL ROUNDS FOR THIS SEASON
    jsonCall(`https://ergast.com/api/f1/${season}.json`, function(response) {
        $('#nav-round ul').html('');
        response['MRData']['RaceTable']['Races'].forEach(e => {                
            $('#nav-round ul').append(`
                <li id="nav-round-${season}-${e['round']}" onClick="changeRound(${e['round']})">
                    <div class="nav-round-num">${e['round']}</div>
                    <div class="nav-round-date">${e['date']} ${e['time']}</div>
                    <div class="nav-round-name">${e['raceName']}</div>
                </li>`);
        });
        $(`#nav-round-${F1_SEASON}-${F1_ROUND}`).addClass('nav-selected');

    });   
}



function raceResults(season, round) {

    F1_SEASON = season;
    F1_ROUND = round;

    $('nav ul').slideUp('slow');

    jsonCall(`https://ergast.com/api/f1/${season}/${round}/results.json`, function(response) {

        let race = response['MRData']['RaceTable']['Races'][0];

        if (!race) {
            showErrors('Array Empty');
            return;
        }

        F1_HEAD2HEAD_1 = race['Results'][0];
        F1_HEAD2HEAD_2 = race['Results'][1];

        $('h1').html(`${season} Season | Round ${round} | ${ race['raceName'] }`);

        drawCircuit(race['Circuit']);


        drawRaceStandings(race['Results']);
        drawDriversLapTimes(race['Results'][0]['Driver']['driverId']);// DO THIS AS A MODAL POPUP FOR EACH DRIVER
        headToHead(F1_HEAD2HEAD_1, F1_HEAD2HEAD_2);
    });    
}


// CHANGE ROUND LIST TO THE SEASON YEAR CLICKED ON
function changeSeason(season) {
    F1_SEASON = season;
    $(`#nav-season ul li`).removeClass('nav-selected');
    $(`#nav-season-${season}`).addClass('nav-selected');
    navRounds(season);
}


// PROBLEM - SELECTED ROUND DOES NOT WORK
function changeRound(round) {
    F1_ROUND = round;
    $(`#nav-round ul li`).removeClass('nav-selected');
    $(`#nav-round-${F1_SEASON}-${F1_ROUND}`).addClass('nav-selected');
    raceResults(F1_SEASON, F1_ROUND);
}


// SETUP GLOBAL VARS
var F1_ROUND, F1_SEASON, F1_HEAD2HEAD_1, F1_HEAD2HEAD_2;


    $(document).ready(function() {


        // GET FIRST JSON CALL FOR SEASON AND ROUND NUMBERS
        jsonCall('https://ergast.com/api/f1/current/last/results.json', function(response) {
            
            F1_SEASON = response['MRData']['RaceTable']['season'];
            F1_ROUND = response['MRData']['RaceTable']['round'];


            // SHOW ALL SEAONS
            jsonCall(`https://ergast.com/api/f1/seasons.json?limit=9999`, function(response) {


                response['MRData']['SeasonTable']['Seasons'].forEach(e => {
                    $('#nav-season ul').prepend(`<li id="nav-season-${e['season']}" onClick="changeSeason(${e['season']})">${e['season']}</li>`);
                });
                
                $(`#nav-season-${F1_SEASON}`).addClass('nav-selected');
            });        


            navRounds(F1_SEASON);
            raceResults(F1_SEASON,F1_ROUND);

        });

    



        $('h1').click(function(){
            $('nav ul').slideToggle('slow');
        });

    });