// client/src/components/BusinessAnalytics/PickupHeatmap.js
import React, { useEffect } from 'react';
import { Paper, Text, Box, Loader, Center, Alert } from '@mantine/core';
import { IconAlertCircle } from '@tabler/icons-react';

const PickupHeatmap = ({ locations, isLoading }) => {
  const [mapReady, setMapReady] = React.useState(false);
  const mapRef = React.useRef(null);

  useEffect(() => {
    // Check if Leaflet is available
    if (typeof window !== 'undefined' && window.L) {
      setMapReady(true);
    }
  }, []);

  if (!mapReady) {
    return (
      <Paper p="lg" radius="md" withBorder>
        <Alert
          icon={<IconAlertCircle size={16} />}
          title="Map Library Not Loaded"
          color="blue"
        >
          Leaflet map library is not available. Please install @react-leaflet/react-leaflet.
        </Alert>
      </Paper>
    );
  }

  if (isLoading) {
    return (
      <Paper p="lg" radius="md" withBorder>
        <Center h={400}>
          <Loader />
        </Center>
      </Paper>
    );
  }

  if (!locations || locations.length === 0) {
    return (
      <Paper p="lg" radius="md" withBorder>
        <Text c="dimmed">No pickup location data available for the selected date range</Text>
      </Paper>
    );
  }

  // Simple heatmap visualization using CSS heatmap representation
  // Coordinates are clustered by grid
  const gridSize = 0.1; // degrees - roughly 10km
  const clusters = {};

  locations.forEach(location => {
    const gridLat = Math.floor(location.latitude / gridSize) * gridSize;
    const gridLng = Math.floor(location.longitude / gridSize) * gridSize;
    const key = `${gridLat},${gridLng}`;

    if (!clusters[key]) {
      clusters[key] = {
        latitude: gridLat,
        longitude: gridLng,
        count: 0,
        weight: 0,
        locations: []
      };
    }
    clusters[key].count += 1;
    clusters[key].weight += location.weight;
    clusters[key].locations.push(location);
  });

  const clusterArray = Object.values(clusters);
  const maxCount = Math.max(...clusterArray.map(c => c.count));

  return (
    <Paper p="lg" radius="md" withBorder>
      <Text fw={600} size="lg" mb="md">
        Pickup Density by Area
      </Text>

      <Box
        p="md"
        style={{
          backgroundColor: '#f8f9fa',
          borderRadius: '8px',
          border: '1px solid #dee2e6'
        }}
      >
        <Alert
          icon={<IconAlertCircle size={16} />}
          title="Map Feature Info"
          color="blue"
          mb="md"
        >
          Interactive map requires React Leaflet library installation. Showing density summary below.
        </Alert>

        <Box>
          <Text fw={600} size="sm" mb="md">
            Pickup Density Summary
          </Text>

          <Box
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
              gap: '12px'
            }}
          >
            {clusterArray.map((cluster, index) => {
              const intensity = (cluster.count / maxCount) * 100;
              return (
                <Box
                  key={index}
                  p="sm"
                  style={{
                    backgroundColor: `rgba(255, 99, 71, ${intensity / 100})`,
                    border: '1px solid #ffa94d',
                    borderRadius: '8px',
                    cursor: 'pointer'
                  }}
                >
                  <Text fw={600} size="sm">
                    Location {index + 1}
                  </Text>
                  <Text size="xs" c="dimmed">
                    Coordinates: {cluster.latitude.toFixed(2)}, {cluster.longitude.toFixed(2)}
                  </Text>
                  <Text size="xs" fw={500}>
                    {cluster.count} pickups • {cluster.weight.toFixed(2)} kg
                  </Text>

                  {cluster.locations.length > 0 && (
                    <Box mt="xs">
                      <Text size="xs" fw={600} mb="xs">
                        Addresses in this area:
                      </Text>
                      {cluster.locations.slice(0, 3).map((loc, i) => (
                        <Text key={i} size="xs" c="dimmed">
                          • {loc.address}
                        </Text>
                      ))}
                      {cluster.locations.length > 3 && (
                        <Text size="xs" c="dimmed">
                          + {cluster.locations.length - 3} more
                        </Text>
                      )}
                    </Box>
                  )}
                </Box>
              );
            })}
          </Box>
        </Box>
      </Box>

      <Alert
        icon={<IconAlertCircle size={16} />}
        title="To Enable Full Map View"
        color="yellow"
        mt="md"
      >
        Install Leaflet: npm install leaflet react-leaflet leaflet-heatmap
      </Alert>
    </Paper>
  );
};

export default PickupHeatmap;
