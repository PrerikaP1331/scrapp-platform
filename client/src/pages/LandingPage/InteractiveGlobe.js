import React, { useEffect, useRef, useState } from 'react';
import { Paper, Text, Title, Group, Badge, CloseButton } from '@mantine/core';
import { IconMapPin, IconRecycle, IconUsers, IconTrendingUp } from '@tabler/icons-react';

const InteractiveGlobe = () => {
  const canvasRef = useRef(null);
  const [selectedMarker, setSelectedMarker] = useState(null);
  
  // Recycling locations with real data
  const markersData = [
    { 
      name: 'Bengaluru', 
      lat: 12.9716, 
      long: 77.5946,
      data: {
        households: 156,
        waste: '890 kg',
        co2Saved: '2.1 tons'
      }
    },
    { 
      name: 'Mumbai', 
      lat: 19.0760, 
      long: 72.8777,
      data: {
        households: 98,
        waste: '645 kg',
        co2Saved: '1.5 tons'
      }
    },
    { 
      name: 'Delhi', 
      lat: 28.7041, 
      long: 77.1025,
      data: {
        households: 127,
        waste: '780 kg',
        co2Saved: '1.8 tons'
      }
    },
    {
      name: 'Chennai', 
      lat: 13.0827, 
      long: 80.2707,
      data: {
        households: 34,
        waste: '210 kg',
        co2Saved: '0.5 tons'
      }
    }
    ,{
      name: 'London',
      lat: 51.5074,
      long: -0.1278,
      data: { households: 142, waste: '760 kg', co2Saved: '1.7 tons' }
    }
    ,{
      name: 'New York',
      lat: 40.7128,
      long: -74.0060,
      data: { households: 188, waste: '980 kg', co2Saved: '2.3 tons' }
    }
    ,{
      name: 'Rio de Janeiro',
      lat: -22.9068,
      long: -43.1729,
      data: { households: 96, waste: '520 kg', co2Saved: '1.2 tons' }
    }
    ,{
      name: 'Nairobi',
      lat: -1.286389,
      long: 36.817223,
      data: { households: 68, waste: '310 kg', co2Saved: '0.8 tons' }
    }
    ,{
      name: 'Johannesburg',
      lat: -26.2041,
      long: 28.0473,
      data: { households: 77, waste: '420 kg', co2Saved: '1.0 tons' }
    }
    ,{
      name: 'Sydney',
      lat: -33.8688,
      long: 151.2093,
      data: { households: 132, waste: '680 kg', co2Saved: '1.6 tons' }
    }
    ,{
      name: 'Tokyo',
      lat: 35.6762,
      long: 139.6503,
      data: { households: 205, waste: '1.1 tons', co2Saved: '2.6 tons' }
    }
    ,{
      name: 'Jakarta',
      lat: -6.2088,
      long: 106.8456,
      data: { households: 120, waste: '640 kg', co2Saved: '1.5 tons' }
    }
    ,{
      name: 'Cairo',
      lat: 30.0444,
      long: 31.2357,
      data: { households: 110, waste: '600 kg', co2Saved: '1.4 tons' }
    }
    ,{
      name: 'Paris',
      lat: 48.8566,
      long: 2.3522,
      data: { households: 130, waste: '700 kg', co2Saved: '1.6 tons' }
    }
  ];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const $ = {
      canvas: canvas,
      ctx: canvas.getContext('2d'),
      vCenter: 820,
      scroll: {
        lat: 0,
        long: 20
      },
      markers: markersData,
      timing: {
        speed: 16,
        delta: 0,
        last: 0
      },
      drag: {
        start: { x: 0, y: 0 },
        force: 0,
        prevX: 0,
        isDragging: false
      },
      colors: {
        pushPinBase: '#969799',
        pushPin: '#ed5c50',
        land: '#a3b18a',
        landShade: '#588157',
        ocean: '#2A7B96'
      },
      complexShapes: {}
    };

    const lerp = (norm, min, max) => {
      return (max - min) * norm + min;
    };

    const norm = (value, min, max) => {
      return (value - min) / (max - min);
    };

    const map = (value, sourceMin, sourceMax, destMin, destMax) => {
      return lerp(norm(value, sourceMin, sourceMax), destMin, destMax);
    };

    const dragMove = (e) => {
      if($.drag.isDragging) {
        let long = $.drag.start.long,
            clientX = e.targetTouches ? e.targetTouches[0].clientX : e.clientX,
            change = clientX - $.drag.start.x,
            prevChange = clientX - $.drag.prevX,
            canvasWidth = $.canvas.getBoundingClientRect().width;
        
        long += map(change, 0, canvasWidth, 0, 200);
        
        while(long < 0) {
          long += 360;
        } 
        
        if(prevChange > 0 && $.drag.force < 0) {
          $.drag.force = 0;
        } else if(prevChange < 0 && $.drag.force > 0) {
          $.drag.force = 0;
        }
        
        $.drag.force += prevChange * (600 / canvasWidth);
        $.drag.prevX = clientX;
        $.scroll.long = Math.abs(long) % 360;
      }
    };

    const dragStart = (e) => {
      if (e.targetTouches) {
        e.preventDefault();
        $.drag.start = {
          x: e.targetTouches[0].clientX,
          y: e.targetTouches[0].clientY,
          long: $.scroll.long
        };
      } else {
        $.drag.start = {
          x: e.clientX,
          y: e.clientY,
          long: $.scroll.long
        };
      }
      $.timing.speed = 0;
      $.drag.isDragging = true;
      $.canvas.classList.add('globe--dragging');
    };

    const dragEnd = (e) => {
      if($.drag.isDragging) {
        $.timing.speed = map($.drag.force, 0, 220, 0, 40);
        $.drag.isDragging = false;
        $.canvas.classList.remove('globe--dragging');
      }
    };

    const latLongSphere = (lat, lon, radius) => {
      let x = 900,
          y = $.vCenter,
          z = 0;

      lon = -lon;
      let phi = (90-lat) * (Math.PI/180),
      teta = (lon + 180) * (Math.PI/180);

      x -= -(radius * Math.sin(phi) * Math.cos(teta));
      y -= radius * Math.cos(phi);
      z = radius * Math.sin(phi) * Math.sin(teta);

      return { x, y, z };
    };

    const drawGlobe = (ctx, color) => {
      ctx.beginPath();
      ctx.arc(900, $.vCenter, 600, 0, 2 * Math.PI);
      ctx.closePath();
      ctx.fillStyle = color;
      ctx.fill();
    };

    const getAngle = (p1, p2) => {
      let dy = p2.y - p1.y,
          dx = p2.x - p1.x,
          theta = Math.atan2(dy, dx);
      theta *= 180 / Math.PI;
      return theta;
    };

    const closeCurve = (path, curveStart, p, radius) => {
      let a1 = getAngle({ x: 900, y: $.vCenter}, curveStart),
          a2 = getAngle({ x: 900, y: $.vCenter}, p),
          compare = a1 - a2,
          startAngle = a1 * (Math.PI/180),
          endAngle = a2 * (Math.PI/180);
    
      path.arc(900, $.vCenter, radius, startAngle, endAngle, compare > 0 && compare < 180);
    };

    const distanceBetween = (p1, p2) => {
      let a = p1.long - p2.long,
          b = p1.lat - p2.lat;
      return Math.hypot(a, b);
    };

    const complexify = (landmass, level) => {
      let complex = [];
      
      for (let i = 0; i < (landmass.length - 1); i++) {
        let p1 = landmass[i],
            p2 = landmass[i + 1],
            steps = Math.floor(distanceBetween(p1, p2) / level);

        p1.edge = true;
        complex.push(p1);

        if(steps > 0) {
          let s = Math.floor(100 / steps);
          
          for (let i = 1; i <= steps; i++) {
            let percentage = i * s;
            
            if(percentage <= 100) {
              let p = {
                lat: map(percentage, 0, 100, p1.lat, p2.lat),
                long: map(percentage, 0, 100, p1.long, p2.long)
              };
              
              complex.push(p);
            }
          }
        }
      }
      
      let last = landmass.pop();
      last.edge = true;
      complex.push(last);

      return complex;
    };

    const getLandMassPaths = (name, radius, thickness) => {
      let landmassBasic = continents[name],
          landmass = null,
          first = true,
          paths = {
            ground: new Path2D(),
            top: new Path2D(),
            sections: [],
            isVisible: false
          },
          section = {
            ground: [],
            top: []
          };

      if($.complexShapes[name]) {
        landmass = $.complexShapes[name];
      } else {
        landmass = complexify(landmassBasic, 1);
        $.complexShapes[name] = landmass;
      }
      
      for (let i = 0; i < landmass.length; i++) {
        let point = landmass[0],
            p = latLongSphere(point.lat + $.scroll.lat, point.long + $.scroll.long, radius);
        
        if(p.z < 0) {
          landmass.splice(0, 0, landmass.pop());
        } else {
          break;
        }
      }

      let drawCurve = false,
          curveStart = null,
          sectionIsVisible = false;

      landmass.forEach((point) => {
        let p = latLongSphere(point.lat + $.scroll.lat, point.long + $.scroll.long, radius),
            p2 = latLongSphere(point.lat + $.scroll.lat, point.long + $.scroll.long, radius + thickness);
        
        if(!sectionIsVisible && p.z > -200) {
          sectionIsVisible = true;
        }
        
        section.ground.push({ x: p.x, y: p.y, z: p.z });
        section.top.push({ x: p2.x, y: p2.y, z: p2.z });

        if(point.edge && !first) {
          if(sectionIsVisible) {
            paths.sections.push(Object.assign({}, section));
          }
          
          section = {
            ground: [{x: p.x, y: p.y, z: p.z }],
            top: [{x: p2.x, y: p2.y, z: p2.z }]
          };
          
          sectionIsVisible = false;
        }
        
        first = false;

        if(p.z > 0) {
          if(drawCurve) {
            drawCurve = false;
            closeCurve(paths.ground, curveStart, p, radius);
            closeCurve(paths.top, curveStart, p2, radius + thickness);
          } else {
            paths.ground.lineTo(p.x, p.y);
            paths.top.lineTo(p2.x, p2.y);
            paths.isVisible = true;
          }
        } else {
          if(!drawCurve) {   
            drawCurve = true;
            curveStart = { x: p.x, y: p.y, z: p.z };
          }
        }
      });

      if(drawCurve) {
        drawCurve = false;
        let point = landmass.slice(-1)[0],
            p = latLongSphere(point.lat + $.scroll.lat, point.long + $.scroll.long, radius),
            p2 = latLongSphere(point.lat + $.scroll.lat, point.long + $.scroll.long, radius + thickness);
        
        closeCurve(paths.ground, curveStart, p, radius);
        closeCurve(paths.top, curveStart, p2, radius + thickness);
      }
      
      let p = latLongSphere(landmass[0].lat + $.scroll.lat, landmass[0].long + $.scroll.long, radius),
          p2 = latLongSphere(landmass[0].lat + $.scroll.lat, landmass[0].long + $.scroll.long, radius + thickness);  
      
      section.ground.push({ x: p.x, y: p.y, z: p.z });
      section.top.push({ x: p2.x, y: p2.y, z: p2.z });
    
      if(section) {
        paths.sections.push(Object.assign({}, section));
      }
      
      return paths;
    };

    const continents = {
      africa: [
        { lat: 35.7, long: -5.8 }, { lat: 37.1, long: 10.9 }, { lat: 30, long: 32.2 },
        { lat: 10.6, long: 44 }, { lat: 11.8, long: 51 }, { lat: -27.6, long: 30.5 },
        { lat: -33.8, long: 18.6 }, { lat: 4.7, long: 9.2 }, { lat: 4.9, long: -7.7 },
        { lat: 14.6, long: -16.8 }, { lat: 35.7, long: -5.8 }
      ],
      australia: [
        { lat: -22, long: 114 }, { lat: -19, long: 121 }, { lat: -12, long: 130 },
        { lat: -12, long: 136 }, { lat: -24, long: 153 }, { lat: -37, long: 150 },
        { lat: -37, long: 140 }, { lat: -30, long: 131 }, { lat: -34, long: 115 },
        { lat: -22, long: 114 }
      ],
      southamerica: [
        { lat: 12, long: -73 }, { lat: 10, long: -61 }, { lat: -6, long: -34 },
        { lat: -43, long: -62 }, { lat: -54, long: -67 }, { lat: -51, long: -74 },
        { lat: -18, long: -70 }, { lat: -8, long: -77 }, { lat: -5, long: -81 },
        { lat: 12, long: -73 }
      ],
      northamerica: [
        { lat: 10, long: -72 }, { lat: 7, long: -75 }, { lat: 19, long: -104 },
        { lat: 36, long: -121 }, { lat: 59, long: -140 }, { lat: 54, long: -167 },
        { lat: 70, long: -163 }, { lat: 68, long: -137 }, { lat: 65, long: -88 },
        { lat: 57, long: -92 }, { lat: 54, long: -80 }, { lat: 62, long: -75 },
        { lat: 50, long: -54 }, { lat: 31, long: -80 }, { lat: 25, long: -79 },
        { lat: 26, long: -81 }, { lat: 29, long: -84 }, { lat: 28, long: -96 },
        { lat: 19, long: -95 }, { lat: 20, long: -87 }, { lat: 14, long: -83 },
        { lat: 10, long: -72 }
      ],
      greenland: [
        { lat: 78, long: -68 }, { lat: 81, long: -18 }, { lat: 69, long: -25 },
        { lat: 60, long: -42 }, { lat: 67, long: -52 }, { lat: 78, long: -68 }
      ],
      japan: [
        { lat: 45, long: 141 }, { lat: 43, long: 146 }, { lat: 35, long: 140 },
        { lat: 31, long: 131 }, { lat: 34, long: 129 }, { lat: 36, long: 136 },
        { lat: 39, long: 140 }, { lat: 45, long: 141 }
      ],
      indonesia: [
        { lat: 7, long: 117 }, { lat: 5, long: 119 }, { lat: 0, long: 118 },
        { lat: -4, long: 115 }, { lat: -3, long: 111 }, { lat: 2, long: 108 },
        { lat: 7, long: 117 }
      ],
      papua: [
        { lat: -1, long: 132 }, { lat: -3, long: 142 }, { lat: -10, long: 146 },
        { lat: -7, long: 140 }, { lat: -6, long: 134 }, { lat: -1, long: 132 }
      ],
      nz: [
        { lat: -35, long: 174 }, { lat: -38, long: 178 }, { lat: -46, long: 169 },
        { lat: -45, long: 165 }, { lat: -38, long: 175 }, { lat: -35, long: 174 }
      ],
      asia: [
        { lat: 64, long: 37 }, { lat: 73, long: 80 }, { lat: 66, long: 98 },
        { lat: 69, long: 175 }, { lat: 60, long: 163 }, { lat: 38, long: 118 },
        { lat: 28, long: 119 }, { lat: 23, long: 108 }, { lat: 12, long: 109 },
        { lat: 9, long: 102 }, { lat: 23, long: 88 }, { lat: 16, long: 82 },
        { lat: 7, long: 79 }, { lat: 25, long: 68 }, { lat: 27, long: 62 },
        { lat: 21, long: 58 }, { lat: 13, long: 44 }, { lat: 30, long: 33.5 },
        { lat: 64, long: 37 }
      ],
      europe: [
        { lat: 37, long: -9 }, { lat: 43, long: -9 }, { lat: 44, long: 0 },
        { lat: 48, long: -4 }, { lat: 53, long: 5 }, { lat: 56, long: 8 },
        { lat: 54, long: 11 }, { lat: 55, long: 21 }, { lat: 59, long: 30 },
        { lat: 60, long: 23 }, { lat: 61, long: 22 }, { lat: 65, long: 26 },
        { lat: 65, long: 22 }, { lat: 60, long: 17 }, { lat: 59, long: 19 },
        { lat: 56, long: 16 }, { lat: 56, long: 13 }, { lat: 60, long: 11 },
        { lat: 60, long: 5 }, { lat: 69, long: 15 }, { lat: 70, long: 28 },
        { lat: 68, long: 48 }, { lat: 36, long: 38 }, { lat: 45, long: 16 },
        { lat: 45, long: 12 }, { lat: 40, long: 18 }, { lat: 37, long: 15 },
        { lat: 40, long: 14 }, { lat: 44, long: 8 }, { lat: 41, long: 1 },
        { lat: 37, long: -2 }, { lat: 37, long: -8 }, { lat: 37, long: -9 }
      ],
      britain: [
        { lat: 50, long: -5 }, { lat: 54, long: -3 }, { lat: 57, long: -6 },
        { lat: 57, long: -2 }, { lat: 51, long: 1 }, { lat: 50, long: -5 }
      ],
      madagaskar: [
        { lat: -13, long: 49 }, { lat: -17, long: 43 }, { lat: -24, long: 44 },
        { lat: -25, long: 47 }, { lat: -13, long: 49 }
      ]
    };

    const updateState = (delta) => {
      $.drag.force *= 0.8;
      
      if($.timing.speed) {
        $.scroll.long += ($.timing.speed / 100) * delta;
        
        if($.scroll.long > 360) {
          $.scroll.long = $.scroll.long % 360;
        } else if ($.scroll.long < 0) {
          $.scroll.long += 360;   
        }
      }
    };

    const drawSection = (ctx, section, drawBackside) => {
      let hasStarted = false,
          limit = -25;
      
      section.ground.forEach(p => {
        if(drawBackside && p.z < 0 || !drawBackside && p.z >= limit) {
          if(!hasStarted) {
            ctx.beginPath();
            hasStarted = true;
          }
          ctx.lineTo(p.x, p.y);
        }
      });
    
      section.top = drawBackside ? section.top.reverse() : section.top;
    
      section.top.forEach(p => {
        if(drawBackside && p.z < 0 || !drawBackside && p.z >= limit) {
          ctx.lineTo(p.x, p.y);
        }
      });
    
      if(hasStarted) {
        ctx.closePath();
        ctx.fill();
      }
    };

    const drawMapPushPinBase = (ctx, basePos, topPos, color) => {
      ctx.strokeStyle = color;
      ctx.lineWidth = 7;
      ctx.beginPath();
      ctx.moveTo(basePos.x, basePos.y);
      ctx.lineTo(topPos.x, topPos.y);
      ctx.stroke();
    };

    const drawMapPushPin = (ctx, pos, color) => {
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, 20, 0, 2 * Math.PI);
      ctx.fill();
    };

    const drawMarkers = (ctx, markers, drawFront) => {
      for (let i = 0; i < markers.length; i++) {
        const marker = markers[i];
        let ground = latLongSphere(marker.lat + $.scroll.lat, marker.long + $.scroll.long, 630),
            needleTop = latLongSphere(marker.lat + $.scroll.lat, marker.long + $.scroll.long, 730),
            pinTop = latLongSphere(marker.lat + $.scroll.lat, marker.long + $.scroll.long, 750);
        
        if(ground.z >= 0 && drawFront) {
          drawMapPushPinBase(ctx, ground, needleTop, $.colors.pushPinBase);
          drawMapPushPin(ctx, pinTop, $.colors.pushPin);
        } else if(!drawFront) {
          drawMapPushPin(ctx, pinTop, $.colors.pushPin);
          drawMapPushPinBase(ctx, ground, needleTop, $.colors.pushPinBase);
        }
      }
    };

    const animateLoop = (time) => {
      $.timing.delta = Math.abs($.timing.last - time);
      $.timing.last = time;
      
      updateState($.timing.delta);
      
      $.ctx.clearRect(0, 0, $.canvas.width, $.canvas.height);
      
      drawMarkers($.ctx, $.markers, false);
      
      let continentNames = ['southamerica', 'northamerica', 'greenland', 'japan', 'africa', 'australia', 'asia', 'indonesia', 'europe', 'britain', 'madagaskar', 'papua', 'nz']; 
      let landPaths = [], se = [];
      
      continentNames.forEach((name) => {
        let paths = getLandMassPaths(name, 600, 30);

        if(paths) {
          $.ctx.fillStyle = $.colors.landShade;

          paths.sections.forEach((section) => {
            se.push(section);
            drawSection($.ctx, section, true);
          });

          if(paths.isVisible) {
            landPaths.push(paths.top);
          }
        }
      });
      
      drawGlobe($.ctx, $.colors.ocean);
      
      $.ctx.fillStyle = $.colors.landShade;
      se.forEach((section) => {  
        drawSection($.ctx, section, false);
      });
      
      landPaths.forEach((path) => {
        $.ctx.fillStyle = $.colors.land;
        $.ctx.fill(path);
      });
      
      drawMarkers($.ctx, $.markers, true);
      
      requestAnimationFrame(animateLoop);
    };

    // Click handler for markers
    const handleClick = (e) => {
      const rect = canvas.getBoundingClientRect();
      const scaleX = canvas.width / rect.width;
      const scaleY = canvas.height / rect.height;
      const x = (e.clientX - rect.left) * scaleX;
      const y = (e.clientY - rect.top) * scaleY;
      
      for (let i = 0; i < $.markers.length; i++) {
        const marker = $.markers[i];
        const pinTop = latLongSphere(marker.lat + $.scroll.lat, marker.long + $.scroll.long, 750);
        
        if (pinTop.z >= 0) {
          const dist = Math.sqrt((x - pinTop.x) ** 2 + (y - pinTop.y) ** 2);
          if (dist < 30) {
            setSelectedMarker(selectedMarker === i ? null : i);
            return;
          }
        }
      }
    };

    $.canvas.addEventListener("touchstart", dragStart, false);
    $.canvas.addEventListener("mousedown", dragStart, false);
    $.canvas.addEventListener("touchend", dragEnd, false);
    $.canvas.addEventListener("mouseup", dragEnd, false);
    $.canvas.addEventListener("touchmove", dragMove, false);
    $.canvas.addEventListener("mousemove", dragMove, false);
    $.canvas.addEventListener("mouseleave", dragEnd, false);
    $.canvas.addEventListener("click", handleClick, false);
    
    requestAnimationFrame(animateLoop);

    return () => {
      $.canvas.removeEventListener("touchstart", dragStart);
      $.canvas.removeEventListener("mousedown", dragStart);
      $.canvas.removeEventListener("touchend", dragEnd);
      $.canvas.removeEventListener("mouseup", dragEnd);
      $.canvas.removeEventListener("touchmove", dragMove);
      $.canvas.removeEventListener("mousemove", dragMove);
      $.canvas.removeEventListener("mouseleave", dragEnd);
      $.canvas.removeEventListener("click", handleClick);
    };
  }, [selectedMarker]);

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <style>{`
        .globe {
          width: 100%;
          height: auto;
          cursor: grab;
          display: block;
          margin: 0 auto;
        }
        .globe--dragging {
          cursor: grabbing;
        }
      `}</style>
      
      <canvas 
        ref={canvasRef} 
        className="globe"
        width={1800} 
        height={1600}
      />
      
      {selectedMarker !== null && (
        <Paper
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            padding: '20px',
            background: 'rgba(255, 255, 255, 0.98)',
            borderRadius: '12px',
            border: '2px solid #a3b18a',
            boxShadow: '0 8px 24px rgba(88, 129, 87, 0.2)',
            minWidth: '200px',
            zIndex: 10
          }}
        >
          <Group justify="space-between" mb="sm">
            <Group>
              <IconMapPin size={20} color="#588157" />
              <Title order={4} style={{ color: '#344e41' }}>
                {markersData[selectedMarker].name}
              </Title>
            </Group>
            <CloseButton onClick={() => setSelectedMarker(null)} />
          </Group>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <Group>
              <IconUsers size={18} color="#588157" />
              <div>
                <Text size="xs" c="dimmed">Households</Text>
                <Text fw={600} style={{ color: '#344e41' }}>
                  {markersData[selectedMarker].data.households}
                </Text>
              </div>
            </Group>
            
            <Group>
              <IconRecycle size={18} color="#588157" />
              <div>
                <Text size="xs" c="dimmed">Waste Collected</Text>
                <Text fw={600} style={{ color: '#344e41' }}>
                  {markersData[selectedMarker].data.waste}
                </Text>
              </div>
            </Group>
            
            <Group>
              <IconTrendingUp size={18} color="#588157" />
              <div>
                <Text size="xs" c="dimmed">CO₂ Saved</Text>
                <Text fw={600} style={{ color: '#588157' }}>
                  {markersData[selectedMarker].data.co2Saved}
                </Text>
              </div>
            </Group>
          </div>
          
          <Badge 
            mt="md" 
            fullWidth
            style={{ 
              background: 'linear-gradient(135deg, #a3b18a 0%, #588157 100%)',
              color: 'white'
            }}
          >
            Active Community
          </Badge>
        </Paper>
      )}
      
      
    </div>
  );
};

export default InteractiveGlobe;