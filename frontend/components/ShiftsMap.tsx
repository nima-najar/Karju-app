'use client';

import { useEffect, useRef, useState } from 'react';

interface Shift {
  id: number;
  latitude?: number;
  longitude?: number;
  business_name?: string;
  location: string;
  title: string;
  hourly_wage: number;
  start_time: string;
  end_time: string;
}

interface ShiftsMapProps {
  shifts: Shift[];
  selectedShiftId?: number;
  onShiftClick?: (shiftId: number) => void;
  language?: 'fa' | 'en';
}

export default function ShiftsMap({ shifts, selectedShiftId, onShiftClick, language = 'fa' }: ShiftsMapProps) {
  const mapRef = useRef<any>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const markersRef = useRef<any[]>([]);
  const [isMounted, setIsMounted] = useState(false);
  const [mapError, setMapError] = useState<string | null>(null);

  const NESHAN_MAP_API_KEY = 'web.61b9bb8eea274757b507bffff4c06575';

  // Only load Leaflet on client side
  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted || !mapContainerRef.current) return;

    let L: any;
    let cleanup: (() => void) | null = null;
    let isInitialized = false;

    // Dynamic import Leaflet
    Promise.all([
      import('leaflet'),
      import('leaflet/dist/leaflet.css')
    ])
      .then(([leaflet]) => {
        L = leaflet.default;

        // Fix for default marker icon in Next.js
        delete (L.Icon.Default.prototype as any)._getIconUrl;
        L.Icon.Default.mergeOptions({
          iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
          iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
          shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
        });

        // Initialize map if not already initialized
        if (!mapRef.current && !isInitialized) {
          isInitialized = true;
          // Default center: Tehran
          const defaultCenter: [number, number] = [35.6892, 51.3890];
          
          try {
            mapRef.current = L.map(mapContainerRef.current, {
              center: defaultCenter,
              zoom: 12,
              zoomControl: true,
            });

            // Use CartoDB Positron - a clean, minimal map style
            const mapLayer = L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
              attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors © <a href="https://carto.com/attributions">CARTO</a>',
              subdomains: 'abcd',
              maxZoom: 19,
            });
            
            mapLayer.addTo(mapRef.current);
            console.log('Map initialized with CartoDB Positron tiles');

            // Cleanup function
            cleanup = () => {
              if (mapRef.current) {
                mapRef.current.remove();
                mapRef.current = null;
              }
            };
          } catch (error: any) {
            console.error('Error initializing map:', error);
            setMapError(error.message || 'خطا در بارگذاری نقشه');
          }
        }

        // Only clear and recreate markers if shifts changed, not on every render
        // Clear existing markers
        markersRef.current.forEach(marker => {
          if (mapRef.current) {
            mapRef.current.removeLayer(marker);
          }
        });
        markersRef.current = [];
        
        // Don't proceed if map is not initialized
        if (!mapRef.current) {
          return;
        }

        // Filter shifts with valid coordinates
        console.log('=== MAP DEBUG ===');
        console.log('Total shifts received:', shifts.length);
        
        if (shifts.length > 0) {
          console.log('First shift sample:', {
            id: shifts[0].id,
            location: shifts[0].location,
            latitude: shifts[0].latitude,
            longitude: shifts[0].longitude,
            latType: typeof shifts[0].latitude,
            lngType: typeof shifts[0].longitude,
            latValue: shifts[0].latitude,
            lngValue: shifts[0].longitude
          });
        }
        
        const shiftsWithCoords = shifts.filter(shift => {
          // Convert to number if string
          const lat = typeof shift.latitude === 'string' ? parseFloat(shift.latitude) : shift.latitude;
          const lng = typeof shift.longitude === 'string' ? parseFloat(shift.longitude) : shift.longitude;
          
          const hasLat = lat !== null && lat !== undefined && lat !== '';
          const hasLng = lng !== null && lng !== undefined && lng !== '';
          const latValid = hasLat && !isNaN(lat) && isFinite(lat);
          const lngValid = hasLng && !isNaN(lng) && isFinite(lng);
          
          if (!latValid || !lngValid) {
            console.log(`❌ Shift ${shift.id} missing/invalid coords: lat=${shift.latitude} (${typeof shift.latitude}), lng=${shift.longitude} (${typeof shift.longitude})`);
          } else {
            console.log(`✅ Shift ${shift.id} has valid coords: lat=${lat}, lng=${lng}`);
          }
          
          return latValid && lngValid;
        });

        console.log('=== FILTER RESULTS ===');
        console.log('Shifts with coordinates:', shiftsWithCoords.length);
        console.log('Shifts without coordinates:', shifts.length - shiftsWithCoords.length);
        
        if (shiftsWithCoords.length > 0) {
          console.log('✅ Sample shift with coords:', {
            id: shiftsWithCoords[0].id,
            lat: shiftsWithCoords[0].latitude,
            lng: shiftsWithCoords[0].longitude,
            business: shiftsWithCoords[0].business_name
          });
        } else {
          console.error('❌ NO SHIFTS WITH COORDINATES FOUND!');
          console.log('All shifts data:', shifts.map(s => ({
            id: s.id,
            lat: s.latitude,
            lng: s.longitude
          })));
        }

        if (shiftsWithCoords.length === 0) {
          console.warn('No shifts with coordinates found. Shifts need to be geocoded.');
          if (mapRef.current) {
            // Show a message on the map
            const infoDiv = document.createElement('div');
            const isDark = document.documentElement.classList.contains('dark');
            infoDiv.style.cssText = `position: absolute; top: 10px; left: 10px; background: ${isDark ? '#e0ded9' : 'white'}; padding: 10px; border-radius: 5px; z-index: 1000; box-shadow: 0 2px 5px rgba(0,0,0,0.2);`;
            infoDiv.innerHTML = language === 'fa' 
              ? `<p style="margin:0; color: ${isDark ? '#1a1a1a' : '#666'};">هیچ شیفتی با مختصات جغرافیایی یافت نشد</p>`
              : `<p style="margin:0; color: ${isDark ? '#1a1a1a' : '#666'};">No shifts with coordinates found</p>`;
            mapContainerRef.current?.appendChild(infoDiv);
          }
          return;
        }

        if (!mapRef.current) {
          return;
        }

        // Create markers for each shift
        const bounds: any[] = [];
        
        shiftsWithCoords.forEach(shift => {
          const lat = shift.latitude!;
          const lng = shift.longitude!;
          
          try {
            // Create marker with default icon (we'll update icon later if needed)
            const marker = L.marker([lat, lng], {
              icon: L.icon({
                iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
                iconSize: [25, 41],
                iconAnchor: [12, 41],
                popupAnchor: [1, -34],
                shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
                shadowSize: [41, 41],
              })
            }).addTo(mapRef.current);
            
            // Store shift ID on marker for later reference
            (marker as any).shiftId = shift.id;
            
            // Create detailed popup content that stays on map
            const hourlyWageTomans = Math.floor(shift.hourly_wage / 10);
            const startTime = shift.start_time.substring(0, 5);
            const endTime = shift.end_time.substring(0, 5);
            
            const popupContent = `
              <div style="min-width: 280px; max-width: 320px; direction: ${language === 'fa' ? 'rtl' : 'ltr'}; padding: 12px; font-family: system-ui, -apple-system, sans-serif;">
                <div style="margin-bottom: 10px;">
                  <h3 style="margin: 0 0 6px 0; font-weight: 700; font-size: 16px; color: #1a25a2; line-height: 1.3;">
                    ${shift.business_name || (language === 'fa' ? 'کسب‌وکار' : 'Business')}
                  </h3>
                  <p style="margin: 0; font-size: 13px; color: #666; line-height: 1.4;">
                    ${shift.location}
                  </p>
                </div>
                
                <div style="margin-bottom: 10px; padding: 8px; background: #f8f9ff; border-radius: 6px;">
                  <p style="margin: 0 0 4px 0; font-size: 12px; color: #666;">
                    ${shift.title}
                  </p>
                  <p style="margin: 0; font-size: 14px; font-weight: 600; color: #1a25a2;">
                    ${language === 'fa' ? `ت ${hourlyWageTomans.toLocaleString()}/ساعت` : `${hourlyWageTomans.toLocaleString()} T/hour`}
                  </p>
                </div>
                
                <div style="display: flex; justify-content: space-between; align-items: center; padding-top: 8px; border-top: 1px solid #e5e7eb;">
                  <span style="font-size: 12px; color: #666;">
                    ${startTime} - ${endTime}
                  </span>
                  <a href="/shifts/${shift.id}" style="font-size: 12px; color: #1a25a2; text-decoration: none; font-weight: 600; padding: 4px 8px; background: #f0f0ff; border-radius: 4px; transition: background 0.2s;" 
                     onmouseover="this.style.background='#e0e0ff'" 
                     onmouseout="this.style.background='#f0f0ff'">
                    ${language === 'fa' ? 'مشاهده جزئیات' : 'View Details'}
                  </a>
                </div>
              </div>
            `;
            
            // Bind popup to marker with proper options
            marker.bindPopup(popupContent, {
              maxWidth: 350,
              minWidth: 280,
              className: 'shift-popup',
              closeOnClick: false, // Don't close when clicking on map
              autoPan: true, // Pan map to show popup
              autoPanPadding: [50, 50], // Padding when panning
              keepInView: true, // Keep popup in view
            });

            // Update selected state when marker is clicked (Leaflet will handle popup opening automatically)
            marker.on('click', () => {
              // Close other popups first
              mapRef.current?.eachLayer((layer: any) => {
                if (layer instanceof L.Marker && layer !== marker && layer.isPopupOpen()) {
                  layer.closePopup();
                }
              });
              
              // Update selected state (this will trigger re-render but markers won't be recreated)
              if (onShiftClick) {
                onShiftClick(shift.id);
              }
            });
            
            // Ensure popup is visible when opened
            marker.on('popupopen', () => {
              // Force visibility
              setTimeout(() => {
                const popup = marker.getPopup();
                if (popup) {
                  const popupElement = popup.getElement();
                  if (popupElement) {
                    popupElement.style.display = 'block';
                    popupElement.style.visibility = 'visible';
                    popupElement.style.opacity = '1';
                    popupElement.style.zIndex = '10000';
                  }
                }
              }, 10);
            });

            markersRef.current.push(marker);
            bounds.push([lat, lng]);
          } catch (error) {
            console.error('Error creating marker:', error);
          }
        });

        // Fit map to show all markers
        if (bounds.length > 0 && mapRef.current) {
          try {
            if (bounds.length === 1) {
              mapRef.current.setView(bounds[0] as [number, number], 14);
            } else {
              mapRef.current.fitBounds(bounds, {
                padding: [50, 50],
              });
            }
          } catch (error) {
            console.error('Error fitting bounds:', error);
          }
        }
      })
      .catch((error) => {
        console.error('Error loading Leaflet:', error);
        setMapError('خطا در بارگذاری کتابخانه نقشه');
      });

    return () => {
      // Don't cleanup on every render, only on unmount
      // Cleanup is handled by React component unmount
    };
  }, [shifts, language, isMounted]); // Removed selectedShiftId and onShiftClick to prevent re-renders

  // Separate effect to update marker icons when selectedShiftId changes (without recreating markers)
  useEffect(() => {
    if (!mapRef.current || !isMounted) return;

    import('leaflet').then((leaflet) => {
      const L = leaflet.default;
      
      // Update icon for selected marker
      markersRef.current.forEach((marker: any) => {
        const isSelected = selectedShiftId === marker.shiftId;
        const newIcon = L.icon({
          iconUrl: isSelected 
            ? 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png'
            : 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
          iconSize: [25, 41],
          iconAnchor: [12, 41],
          popupAnchor: [1, -34],
          shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
          shadowSize: [41, 41],
        });
        marker.setIcon(newIcon);
      });
    });
  }, [selectedShiftId, isMounted]);

  if (!isMounted) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-100 dark:bg-concrete rounded-lg" style={{ minHeight: '400px' }}>
        <div className="text-gray-500 dark:text-white">در حال بارگذاری نقشه...</div>
      </div>
    );
  }

  if (mapError) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-100 dark:bg-concrete rounded-lg" style={{ minHeight: '400px' }}>
        <div className="text-red-500 dark:text-safety text-center">
          <p>{mapError}</p>
          <p className="text-sm mt-2 text-gray-600 dark:text-white/70">لطفاً صفحه را رفرش کنید</p>
        </div>
      </div>
    );
  }

  return (
    <div 
      ref={mapContainerRef} 
      className="w-full h-full rounded-lg overflow-hidden"
      style={{ minHeight: '400px', zIndex: 0 }}
    />
  );
}

