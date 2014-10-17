var Router = require("Router");
var _ = require("lodash");
require("handlebars");
var http = require("http")();
var XML = require("XML");

var appRouter = new Router();

appRouter.get("/weather/CA", function(req,res) {
  var lang = request.locale.language == 'fr' ? 'f' : 'e';
  var sites = http.get('http://dd.weatheroffice.ec.gc.ca/citypage_weather/xml/siteList.xml',function(response) {
      var siteList = XML.parse(response.body);
      return _.chain(siteList)
      .filter(function(site){
        var name = lang == 'f' ? site.nameFr : site.nameEn;
        return (!req.parameters.province || req.parameters.province.toLowerCase() == site.provinceCode.toLowerCase())
          && (!req.parameters.name || req.parameters.name.toLowerCase() == name.toLowerCase());
      })
      .map(function(site) {
        return {
          name : lang == 'f' ? site.nameFr : site.nameEn,
          province : site.provinceCode,
          stationID : site['@code']
        };
      })
      .sortBy(['province','name'])
      .value();
    });
  res.setBody(sites);
});

appRouter.get("/weather/CA/:prov/:site",function(req,res,prov,site) {
  var lang = request.locale.language == 'fr' ? 'f' : 'e';
  var weather = http.get('http://dd.weatheroffice.ec.gc.ca/citypage_weather/xml/'+prov+'/'+site+'_'+lang+'.xml',function(response){
      var weatherObj = XML.parse(response.body);
      return {
        location : weatherObj.location.name['#text']+", "+weatherObj.location.province['#text'],
        currentConditions : {
          condition : weatherObj.currentConditions.condition,
          temperature : weatherObj.currentConditions.temperature['#text']+" "+weatherObj.currentConditions.temperature['@units'],
        }
      };
    });
  res.setBody(weather);
});



appRouter.get('/weather/US/:zip',function(req,res,zip) {
  var weather = http.request({
    method : 'POST',
    url : 'http://wsf.cdyne.com/WeatherWS/Weather.asmx',
    headers : {
      'Content-Type' : 'text/xml;charset=UTF-8',
      SOAPAction : "http://ws.cdyne.com/WeatherWS/GetCityWeatherByZIP"
    },
    body : require('/templates/getCityWeatherByZip.hbs')({zip:zip})
  },function(response){
    var weatherObj = XML.parse(response.body)['soap:Body'].GetCityWeatherByZIPResponse.GetCityWeatherByZIPResult;
    return {
      location : weatherObj.City+", "+weatherObj.State,
      currentConditions : {
        condition : weatherObj.Description,
        temperature : weatherObj.Temperature+" F",
      }
    };
  });
  res.setBody(weather);
});

appRouter.get('/cities/US/',function(req,res) {
  
  var cityList = http.request({
    method : 'POST',
    url : 'http://graphical.weather.gov/xml/SOAP_server/ndfdXMLserver.php',
    headers : {
      'Content-Type' : 'text/xml;charset=UTF-8',
      SOAPAction : "http://graphical.weather.gov/xml/DWMLgen/wsdl/ndfdXML.wsdl#LatLonListCityNames"
    },
    body : require('/templates/cityListRequest.xml.txt')
  }, function(response){
    var latLonListDwml = XML.parse(XML.parse(response.body)['SOAP-ENV:Body']['ns1:LatLonListCityNamesResponse']['listLatLonOut']['#text']);
    var latLonArray = _.chain([latLonListDwml.latLonList.split(' '),latLonListDwml.cityNameList.split('|')])
      .zip()
      .map(function(cityArray) {
        var latLonArray = cityArray[0].split(',')
        var nameArray = cityArray[1].split(',');
        return {
          name : nameArray[0],
          state : nameArray[1],
          latitude : latLonArray[0],
          longitude : latLonArray[1]
        };
      })
      .filter(function(site){
        return (!req.parameters.state || req.parameters.state.toLowerCase() == site.state.toLowerCase())
          && (!req.parameters.name || req.parameters.name.toLowerCase() == site.name.toLowerCase());
      })
      .sortBy(['state','name'])
      .value();
    return latLonArray;
  });
  res.setBody(cityList);
});
appRouter.all('/*catchall', function(req,res) {
  res.setBody({
    note:'All /weather/CA endpoints are bilingual; set your Accept-Language to fr-CA to test.',
    links :[
    {title: 'Canadian weather stations, supports query params [province, name] (XML)', href: baseUrl+'/weather/CA{?province,name}', templated: true},
    {title: 'Weather stations in Ontario', href: baseUrl+'/weather/CA?province=ON'},
    {title: 'Weather stations named \'Toronto\'', href: baseUrl+'/weather/CA?name=Toronto'},
    {title: 'Canadian weather by weather station (XML)', href: baseUrl+'/weather/CA/{province}/{stationID}', templated: true},
    {title: 'Toronto weather', href: baseUrl+'/weather/CA/ON/s0000458'},
    {title: 'Lat/Lon of US Cities (SOAP/XML)', href: baseUrl+'/cities/US'},
    {title: 'US weather by zip (SOAP/XML)', href: baseUrl+'/weather/US/{zip}', templated: true},
    {title: 'The weather in NYC', href: baseUrl+'/weather/US/10036'}
  ]});
});

module.exports = appRouter;
