import { MapPinned } from 'lucide-react';
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { PageTitle, Panel, DataTable } from "./Shared";
import { services } from "../data";

export function ServicesMap() {
  return (
    <div className="flex flex-col gap-4">
      <PageTitle
        title="Humanitarian Protection Service Directory"
        kicker="Geographic Distribution of Protection Posts & Specialized Facilities"
      />

      <div className="h-[380px] w-full border border-slate-200 rounded-lg overflow-hidden relative z-0">
        <MapContainer center={[9.145, 40.4897]} zoom={6} scrollWheelZoom={false} className="h-full w-full">
          <TileLayer
            attribution="&copy; <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a> contributors"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {services.map((service) => (
            <Marker key={service.id} position={[service.lat, service.lng]}>
              <Popup>
                <div className="text-xs font-sans">
                  <strong className="block text-slate-900 font-bold mb-0.5">{service.name}</strong>
                  <span className="text-slate-600 block mb-1">{service.category} &bull; {service.region}</span>
                  <span className="text-slate-500 block">{service.hours}</span>
                  <span className="text-slate-700 font-mono text-[11px] mt-1 block bg-slate-100 p-1 rounded">
                    Services: {service.services}
                  </span>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      <Panel title="Authorized Service Point Directory" icon={<MapPinned size={16} className="text-slate-600" />}>
        <DataTable
          columns={["Facility Name", "Category", "Administrative Region", "Operational Hours", "Offered Protection Services"]}
          rows={services.map((service) => [
            <span key={service.id} className="font-semibold text-slate-800">{service.name}</span>,
            service.category,
            service.region,
            <span key={`${service.id}-h`} className="text-xs text-slate-600">{service.hours}</span>,
            <span key={`${service.id}-s`} className="text-xs text-slate-700">{service.services}</span>
          ])}
        />
      </Panel>
    </div>
  );
}
