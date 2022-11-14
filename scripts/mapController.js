const mapController = (function () {
  var _map = undefined;

  mapboxgl.accessToken =
    "pk.eyJ1IjoiZHJkZXJhaWxtZW50IiwiYSI6ImNsYWZ1M2pwMDE3bnEzcm1sYmpoczNteGoifQ.RIv-5FJ79Ee6jHOPoVQwaw";

  return {
    initializeMap: initializeMap,
    addMarker: addMarker,
    updateMarkerLngLat: updateMarkerLngLat,
    updateMarkerPopUp: updateMarkerPopUp,
    map: _map,
  };

  function initializeMap(containerElementId) {
    let newMap = new mapboxgl.Map({
      container: containerElementId,
      style: "mapbox://styles/mapbox/dark-v10",
      center: [-71.091542, 42.358862],
      zoom: 12,
    });

    _map = newMap;
    return newMap;
  }

  function addMarker(lngLat, elementBuilder) {
    let newMarker =
      typeof elementBuilder === "function"
        ? new mapboxgl.Marker(elementBuilder())
        : new mapboxgl.Marker();

    console.log(newMarker);
    newMarker.setLngLat(lngLat);
    newMarker.addTo(_map);

    return newMarker;
  }

  function updateMarkerPopUp(marker, offset, textHtml) {
    marker.setPopup(
      new mapboxgl.Popup({ offset: offset }).setHTML(
        textHtml
      )
    );
  }
  
  function updateMarkerLngLat(marker, lngLat) {
    marker.setLngLat(lngLat);
  }
})();
