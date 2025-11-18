// client/src/components/BusinessAnalytics/PickupHeatmap.js
import React, { useEffect } from 'react';
import { Paper, Text, Box } from '@mantine/core';
import { MapContainer, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

const PickupHeatmap = ({ locations }) => {
  if (!locations || locations.length === 0) {
    return (
      <Paper p="lg" radius="md" withBorder>
        <Text fw={600} size="lg" mb="md">
          Pickup Density by Area
        </Text>
        <Text c="dimmed">No pickup location data available for the selected date range</Text>
      </Paper>
    );
  }

  // Heatmap data is already [lat, lng, intensity] format
  const heatmapData = locations;

  // Calculate center from heatmapData
  const centerLat = heatmapData.reduce((sum, loc) => sum + loc[0], 0) / heatmapData.length;
  const centerLng = heatmapData.reduce((sum, loc) => sum + loc[1], 0) / heatmapData.length;

  const MapWithHeatmap = () => {
    const map = React.useRef(null);

    useEffect(() => {
      if (map.current && heatmapData.length > 0) {
        // Add circles for each heatmap point
        heatmapData.forEach(([lat, lng, intensity]) => {
          const radius = 15 + intensity * 20; // Radius based on intensity
          const color = `rgba(255, ${Math.floor(255 * (1 - intensity))}, 0, ${0.4 + intensity * 0.4})`; // Orange to red
          
          L.circleMarker([lat, lng], {
            radius: radius / 10,
            fillColor: color,
            color: 'none',
            fillOpacity: 0.6,
            weight: 0
          }).addTo(map.current);
        });
      }
    }, []);

    return (
      <MapContainer
        ref={map}
        center={[centerLat, centerLng]}
        zoom={12}
        style={{ height: '400px', width: '100%', borderRadius: '8px' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
      </MapContainer>
    );
  };

  return (
    <Paper p="lg" radius="md" withBorder>
      <Text fw={600} size="lg" mb="md">
        Pickup Density by Area
      </Text>
      <Text size="sm" c="dimmed" mb="md">
        Heatmap showing concentration of pickups across Bangalore (red = high density, blue = low density)
      </Text>

      <Box style={{ borderRadius: '8px', overflow: 'hidden', marginBottom: '16px' }}>
        <MapWithHeatmap />
      </Box>
    </Paper>
  );
};

export default PickupHeatmap;
