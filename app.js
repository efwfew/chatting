let request = require('request');
let cheerio = require('cheerio');

/*REST API 경로*/
// servicekey=키값&stationID=정류소ID
const $url = 'http://openapi.gbis.go.kr/ws/rest/busarrivalservice/station';

/*발급 받은 API키*/
const $KEY = 'ePLg7v%2FsvimLSg0fj32RAM6asHyHdky7eDzH3Mes2nvjvvOLOpFbh2owUU%2FY7OCP7EgQ1s37yvG6kw7lDYuIgw%3D%3D';

/* 조회할 정류소 ID*/
const $station = '233001450';

/* REST API 요청 형식에 맞춰서 키값과 정류소 ID를 조합 */
const $api_url = $url + '?serviceKey=' + $KEY + '&stationId=' + $station;
console.log($api_url);

const express = require('express')
const socket = require('socket.io')
const http = require('http')
const fs = require('fs')
const app = express()
const server = http.createServer(app)
const io = socket(server)

app.use('/css', express.static('./static/css'))
app.use('/js', express.static('./static/js'))
app.get('/', function(request, response) {
    fs.readFile('./static/index.html', function(err, data) {
        if(err) {
            response.send('Error')
        } else {
            response.writeHead(200, {'content-type': 'text/html'})
            response.write(data)
            response.end()
        }
    })
})

/* 해당 URL로 요청 */
request($api_url, function(err, res, body) {

    $ = cheerio.load(body);

    $('busArrivalList').each(function(idx) {
        let no1 = $(this).find('plateNo1').text();
        let no2 = $(this).find('plateNo2').text();
        console.log(`도착 예정 버스: ${no1}, 다음 도착 버스: ${no2 ? no2 : '---'}`);
    });
});

server.listen(10080, function() {
})