const busTracker = (function () {
  // global bus marker dictionary
  const busMarkers = {};
  var stops;

  return {
    run: run,
  };

  function buildBusMarkerElement() {
    let busElement = {
      element: document.createElement("div"),
      offset: new mapboxgl.Point(0, -25), // sets point of icon at correct location
    };

    busElement.element.classList.add("marker");

    return busElement;
  }

  // recursively queries busData and updates map
  async function run(mapController) {
  
    const locations = await busDataClient.getBusLocations();
    stops = await busDataClient.getStops();

    updateBusLocations(mapController, locations);

    setTimeout(() => run(mapController), 15000);
  }

  function updateBusLocations(mapController, locations) {
    locations.forEach((location) => {
      let bus = location;

      if (busMarkers[bus.attributes.label] === undefined) {
        busMarkers[bus.attributes.label] = mapController.addMarker(
          [0, 0],
          buildBusMarkerElement
        );
      }

      let busMarker = busMarkers[bus.attributes.label];

      updatePopUp(mapController, busMarker, bus);
      updateLocation(mapController, busMarker, bus);

      setOccupancyColor(busMarker, bus);
    });
  }

  function setOccupancyColor(busMarker, busData) {
    let bElem = busMarker.getElement();
    bElem.classList.remove("many");
    bElem.classList.remove("few");
    bElem.classList.remove("full");
    bElem.classList.remove("default");

    let occupancy_status = busData.attributes.occupancy_status;

    let busClass =
      occupancy_status === "MANY_SEATS_AVAILABLE"
        ? "many"
        : occupancy_status === "FEW_SEATS_AVAILABLE"
        ? "few"
        : occupancy_status === "FULL"
        ? "full"
        : "default";

    bElem.classList.add(busClass);
  }

  function updateLocation(mapController, busMarker, bus) {
    mapController.updateMarkerLngLat(busMarker, [
      bus.attributes.longitude,
      bus.attributes.latitude,
    ]);
  }

  function updatePopUp(mapController, busMarker, bus) {
    let direction = getDirectionText(bus);
    let nextStopText = getNextStop(stops, bus);
    let occupancy = getOccupancyText(bus);

    let htmlText = `${bus.attributes.label}<br/>
      ${direction}<br/>
      ${nextStopText}<br/>
      ${occupancy}`;

    mapController.updateMarkerPopUp(busMarker, [0, -50], htmlText);
  }

  function getOccupancyText(bus) {
    return bus.attributes.occupancy_status === "MANY_SEATS_AVAILABLE"
      ? "Many Seats"
      : bus.attributes.occupancy_status === "FEW_SEATS_AVAILABLE"
      ? "Few Seats"
      : bus.attributes.occupancy_status === "FULL"
      ? "No Seats"
      : "seat data missing...";
  }

  function getNextStop(stops, bus) {
    let nextStop = stops.filter(
      (x) => x.id === bus.relationships.stop.data.id
    )[0];
    
    let nextStopText = `Next Stop: ${
      nextStop?.attributes.at_street ?? "not found"
    }`;
    return nextStopText;
  }

  function getDirectionText(bus) {
    return bus.attributes.direction_id === 0
      ? "Outbound (Harvard)"
      : "Inbound (MIT)";
  }
})();
