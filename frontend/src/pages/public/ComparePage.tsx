import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Layers, Star, CheckCircle2, XCircle, Phone, ArrowLeft, Plus } from 'lucide-react';
import { api } from '../../services/api';
import { useCompare } from '../../context/CompareContext';
import { AppointmentModal } from '../../components/common/AppointmentModal';

export const ComparePage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const { selectedHospitals } = useCompare();
  const [comparison, setComparison] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Booking modal
  const [selectedHospital, setSelectedHospital] = useState<any | null>(null);
  const [isBookingOpen, setIsBookingOpen] = useState(false);

  useEffect(() => {
    const idsParam = searchParams.get('ids');
    let ids: string[] = [];

    if (idsParam) {
      ids = idsParam.split(',').filter(Boolean);
    } else if (selectedHospitals.length > 0) {
      ids = selectedHospitals.map(h => String(h.id));
    } else {
      // Default sample compare for demo
      ids = ['1', '2', '6'];
    }

    if (ids.length > 0) {
      setLoading(true);
      api.compareHospitals(ids)
        .then(setComparison)
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [searchParams, selectedHospitals]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8 space-y-6 pb-16">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Link to="/hospitals" className="text-xs text-teal-600 hover:text-teal-700 font-bold flex items-center mb-1">
            <ArrowLeft className="w-3.5 h-3.5 mr-1" />
            <span>Back to Hospital Discovery</span>
          </Link>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center space-x-2">
            <Layers className="w-6 h-6 text-teal-600" />
            <span>Hospital Comparison Matrix</span>
          </h1>
          <p className="text-xs text-slate-500">
            Transparent side-by-side comparison of hospital infrastructure, ICU bed counts, fees, and government schemes in Indore.
          </p>
        </div>

        <Link
          to="/hospitals"
          className="inline-flex items-center space-x-1 text-xs font-bold text-teal-700 bg-teal-50 px-4 py-2 rounded-xl border border-teal-200"
        >
          <Plus className="w-3.5 h-3.5 mr-1" />
          <span>Add More Hospitals</span>
        </Link>
      </div>

      {loading ? (
        <div className="text-center py-16">
          <div className="w-10 h-10 border-4 border-teal-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-xs text-slate-500 font-semibold">Comparing hospital tariffs and bed inventories...</p>
        </div>
      ) : comparison.length === 0 ? (
        <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center space-y-3">
          <h3 className="text-base font-bold text-slate-800">No Hospitals Selected to Compare</h3>
          <p className="text-xs text-slate-500">Select 2 to 4 hospitals from the directory to view side-by-side details.</p>
          <Link to="/hospitals" className="bg-teal-600 text-white font-bold text-xs px-4 py-2 rounded-xl inline-block">
            Browse Hospitals
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              
              {/* Header: Hospital basic cards */}
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/70">
                  <th className="p-4 font-bold text-slate-500 uppercase tracking-wider w-48 text-[11px]">
                    Comparison Feature
                  </th>
                  {comparison.map((h) => (
                    <th key={h.id} className="p-4 min-w-[240px] text-slate-900 align-top">
                      <div className="space-y-2">
                        <img
                          src={h.image_url || 'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?auto=format&fit=crop&w=300&q=80'}
                          alt={h.name}
                          className="w-full h-28 object-cover rounded-xl border border-slate-200"
                        />
                        <div>
                          <span className="text-[10px] font-bold text-teal-700 uppercase">{h.hospital_type}</span>
                          <h4 className="font-extrabold text-sm text-slate-900 line-clamp-2">{h.name}</h4>
                          <p className="text-[11px] text-slate-500">{h.area}, {h.city}</p>
                        </div>
                        <div className="flex items-center space-x-1 text-xs">
                          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                          <span className="font-bold">{h.rating.toFixed(1)}</span>
                          <span className="text-slate-400">({h.review_count} reviews)</span>
                        </div>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>

              {/* Rows */}
              <tbody className="divide-y divide-slate-100">
                
                {/* Starting Consultation */}
                <tr className="hover:bg-slate-50/50">
                  <td className="p-4 font-bold text-slate-700">OPD Consultation Fee</td>
                  {comparison.map((h) => (
                    <td key={h.id} className="p-4 font-extrabold text-teal-700 text-sm">
                      {h.starting_fee}
                    </td>
                  ))}
                </tr>

                {/* Estimated Treatment Range */}
                <tr className="hover:bg-slate-50/50">
                  <td className="p-4 font-bold text-slate-700">Estimated Treatment Tariff</td>
                  {comparison.map((h) => (
                    <td key={h.id} className="p-4 font-semibold text-slate-800">
                      {h.est_treatment_cost}
                    </td>
                  ))}
                </tr>

                {/* ICU Beds Available */}
                <tr className="hover:bg-slate-50/50 bg-teal-50/30">
                  <td className="p-4 font-bold text-slate-900">Available ICU Beds</td>
                  {comparison.map((h) => (
                    <td key={h.id} className="p-4 font-extrabold text-emerald-700 text-sm">
                      {h.icu_beds_available} Beds Live
                    </td>
                  ))}
                </tr>

                {/* General Beds Available */}
                <tr className="hover:bg-slate-50/50">
                  <td className="p-4 font-bold text-slate-700">Available General Beds</td>
                  {comparison.map((h) => (
                    <td key={h.id} className="p-4 font-semibold text-slate-800">
                      {h.general_beds_available} Beds
                    </td>
                  ))}
                </tr>

                {/* OPD Wait Time */}
                <tr className="hover:bg-slate-50/50">
                  <td className="p-4 font-bold text-slate-700">OPD Wait Time</td>
                  {comparison.map((h) => (
                    <td key={h.id} className="p-4 font-medium text-slate-700">
                      {h.opd_wait_time}
                    </td>
                  ))}
                </tr>

                {/* Emergency Wait Time */}
                <tr className="hover:bg-slate-50/50">
                  <td className="p-4 font-bold text-slate-700">Emergency Response Time</td>
                  {comparison.map((h) => (
                    <td key={h.id} className="p-4 font-bold text-rose-700">
                      {h.emergency_wait_time}
                    </td>
                  ))}
                </tr>

                {/* Ayushman Bharat PM-JAY */}
                <tr className="hover:bg-slate-50/50">
                  <td className="p-4 font-bold text-slate-700">Ayushman Bharat (PM-JAY)</td>
                  {comparison.map((h) => (
                    <td key={h.id} className="p-4 text-xs font-semibold text-blue-800">
                      ✓ {h.ayushman_bharat_pmjay}
                    </td>
                  ))}
                </tr>

                {/* Insurance Cashless */}
                <tr className="hover:bg-slate-50/50">
                  <td className="p-4 font-bold text-slate-700">Cashless Insurance TPA</td>
                  {comparison.map((h) => (
                    <td key={h.id} className="p-4 text-xs font-semibold text-teal-800">
                      ✓ {h.insurance_cashless}
                    </td>
                  ))}
                </tr>

                {/* Ambulance Fleet */}
                <tr className="hover:bg-slate-50/50">
                  <td className="p-4 font-bold text-slate-700">Dedicated Ambulance</td>
                  {comparison.map((h) => (
                    <td key={h.id} className="p-4 text-xs font-semibold text-slate-800">
                      {h.ambulance_available ? '✓ ALS / BLS Fleet Available' : 'On-call'}
                    </td>
                  ))}
                </tr>

                {/* Direct Action Row */}
                <tr className="bg-slate-50/80">
                  <td className="p-4 font-bold text-slate-700">Action</td>
                  {comparison.map((h) => (
                    <td key={h.id} className="p-4 space-y-2">
                      <button
                        onClick={() => {
                          setSelectedHospital(h);
                          setIsBookingOpen(true);
                        }}
                        className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs py-2 rounded-xl transition shadow-xs"
                      >
                        Book Appointment
                      </button>
                      <Link
                        to={`/hospitals/${h.id}`}
                        className="block text-center text-teal-700 hover:underline text-[11px] font-bold"
                      >
                        View Full Details →
                      </Link>
                    </td>
                  ))}
                </tr>

              </tbody>
            </table>
          </div>
        </div>
      )}

      <AppointmentModal
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        hospital={selectedHospital}
      />

    </div>
  );
};
