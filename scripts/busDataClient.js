const busDataClient = (function () {
  var _route;
  var _stops = getMBTABusStops();
  var _routes = getMBTARoutes();

  return {
    getBusLocations: getMBTABusLocations,
    getStops: getMBTABusStops,
    getRoutes: getMBTARoutes,
  };

  // Request bus data from MBTA
  async function getMBTABusLocations(route) {
    _route = route ?? '1';
    const url = `https://api-v3.mbta.com/vehicles?filter[route]=${_route}&include=trip`;
    const response = await fetch(url);
    const json = await response.json();

    console.log(json.data);
    return json.data;
  }

  async function getMBTABusStops(route) {
    // this data is pretty static, 
    // so there shouldn't be any need to requery in a signle session
    if (Array.isArray(_stops) && route === _route) return _stops;
    
    _route = route ?? '1';
    const url = `https://api-v3.mbta.com/stops?filter[route]=${_route}`;
    const response = await fetch(url);
    const json = await response.json();

    _stops = json.data;
    console.log(_stops);

    return _stops;
  }


  async function getMBTARoutes() {
    // this data is pretty static, 
    // so there shouldn't be any need to requery in a signle session
    if (Array.isArray(_stops)) return _stops;

    const url = "https://api-v3.mbta.com/routes";
    const response = await fetch(url);
    const json = await response.json();

    _routes = json.data;
    console.log(_routes);

    return _routes;
  }
})();
