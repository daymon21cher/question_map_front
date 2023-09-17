<template>
  <div class="yandex-map" ref="mapContainer" style="width: 100%; height: 400px;"></div>
</template>

<script>
/* global ymaps */

export default {
  props: {
    coordinates: {
      type: String,
      default: "",
    },
    zoom: {
      type: Number,
      default: 10,
    },
  },
  data() {
    return {
      mapInstance: null,
    };
  },
  watch: {
    coordinates(newValue) {
      this.updateMap(newValue || "54.782635, 32.045287", this.zoom);
    },
    zoom(newValue) {
      this.updateMap(this.coordinates || "54.782635, 32.045287", newValue);
    },
  },
  mounted() {
    ymaps.ready(() => {
      this.initMap(this.coordinates || "54.782635, 32.045287");
    });
  },
  methods: {
    initMap(coordinates) {
      this.mapInstance = this.createMap(coordinates, this.zoom);
    },
    createMap(coordinates, zoom) {
      const [latitude, longitude] = coordinates.split(',').map(coord => parseFloat(coord.trim()));

      if (isNaN(latitude) || isNaN(longitude)) {
        console.error('Invalid coordinates format.');
        return null;
      }

      const map = new ymaps.Map(this.$refs.mapContainer, {
        center: [latitude, longitude],
        zoom: zoom,
      });

      const placemark = new ymaps.Placemark([latitude, longitude], {});
      map.geoObjects.add(placemark);

      return map;
    },
    updateMap(coordinates, zoom) {
      if (this.mapInstance) {
        const [latitude, longitude] = coordinates.split(',').map(coord => parseFloat(coord.trim()));

        if (isNaN(latitude) || isNaN(longitude)) {
          console.error('Invalid coordinates format.');
          return;
        }

        this.mapInstance.setCenter([latitude, longitude], zoom);
      }
    },
  },
};
</script>

<style>
.yandex-map {
  width: 100%;
  height: 400px;
}
</style>
