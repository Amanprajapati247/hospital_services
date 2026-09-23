import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { 
  Filter, 
  Map, 
  List, 
  Search, 
  Star, 
  MapPin, 
  Shield, 
  Activity, 
  X, 
  ChevronDown,
  RotateCcw
} from 'lucide-react';
import { api } from '../../services/api';
import { HospitalListItem } from '../../types';
import { HospitalCard } from '../../components/common/HospitalCard';
import { MapViewer } from '../../components/common/MapViewer';
import { AppointmentModal } from '../../components/common/AppointmentModal';

export const SearchPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const initialCity = searchParams.get('city') || 'Indore';
  const initialSpecialty = searchParams.get('specialty') || '';

  const [query, setQuery] = useState(initialQuery);
  const [selectedCity, setSelectedCity] = useState(initialCity);
  const [selectedArea, setSelectedArea] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState(initialSpecialty);
  const [selectedFacility, setSelectedFacility] = useState('');
  const [maxFee, setMaxFee] = useState<number | undefined>(undefined);
  const [sortBy, setSortBy] = useState('relevance');
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');

  const [hospitals, setHospitals] = useState<HospitalListItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Booking modal
  const [selectedHospital, setSelectedHospital] = useState<HospitalListItem | null>(null);
  const [isBookingOpen, setIsBookingOpen] = useState(false);

  const areas = ['Vijay Nagar', 'Scheme 54', 'New Palasia', 'AB Road', 'Bhawarkua', 'Manik Bagh', 'Bhawrasla'];
  const specialties = ['Cardiology', 'Orthopedics', 'Neurology', 'Pediatrics', 'Gynecology', 'Dermatology', 'General Medicine', 'Gastroenterology'];
  const facilities = ['24x7 Emergency', 'ICU & Critical Care', 'NICU', 'Operation Theatres', 'CT Scan & MRI', 'Blood Bank', 'Dialysis Unit'];

  const fetchHospitals = async () => {
    setLoading(true);
    try {
      const data = await api.getHospitals({
        q: query,
        city: selectedCity,
        area: selectedArea,
        specialty: selectedSpecialty,
        facility: selectedFacility,
        max_fee: maxFee,
        sort_by: sortBy
      });
      setHospitals(data);
    } catch (err) {
      console.error('Error fetching hospitals', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHospitals();
  }, [query, selectedCity, selectedArea, selectedSpecialty, selectedFacility, maxFee, sortBy]);

  const resetFilters = () => {
    setQuery('');
    setSelectedArea('');
    setSelectedSpecialty('');
    setSelectedFacility('');
    setMaxFee(undefined);
    setSortBy('relevance');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8 space-y-6">
      
      {/* Top Header & Search Bar */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              Hospital Discovery in {selectedCity}
            </h1>
            <p className="text-xs text-slate-500">
              Showing {hospitals.length} verified hospitals matching your medical requirements
            </p>
          </div>

          {/* List vs Map Toggle */}
          <div className="flex items-center space-x-1 bg-slate-100 p-1 rounded-xl shrink-0 self-start md:self-auto">
            <button
              onClick={() => setViewMode('list')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                viewMode === 'list' ? 'bg-white text-teal-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <List className="w-4 h-4" />
              <span>List View</span>
            </button>
            <button
              onClick={() => setViewMode('map')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                viewMode === 'map' ? 'bg-white text-teal-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Map className="w-4 h-4" />
              <span>Map View</span>
            </button>
          </div>
        </div>

        {/* Quick Search & Sort Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2 border-t border-slate-100">
          <div className="md:col-span-2 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by hospital name, condition, treatment (e.g. Apollo, Medanta, Angioplasty)..."
              className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold text-slate-500 shrink-0">Sort By:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 text-xs font-semibold rounded-xl px-3 py-2 focus:outline-hidden focus:ring-2 focus:ring-teal-500"
            >
              <option value="relevance">Relevance</option>
              <option value="rating">Highest Rated</option>
              <option value="starting_fee">Consultation Fee: Low to High</option>
              <option value="icu_avail">Most Available ICU Beds</option>
              <option value="reviews">Most Reviewed</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        
        {/* Sticky Filter Sidebar */}
        <aside className="lg:col-span-1 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-6 sticky top-24">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center space-x-1.5 text-slate-900 font-extrabold text-sm">
              <Filter className="w-4 h-4 text-teal-600" />
              <span>Filters</span>
            </div>
            <button
              onClick={resetFilters}
              className="text-xs text-slate-400 hover:text-teal-700 flex items-center space-x-1 font-semibold"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          </div>

          {/* Area Filter */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-800 uppercase tracking-wider block">Indore Area</label>
            <div className="space-y-1 max-h-40 overflow-y-auto pr-1">
              <button
                onClick={() => setSelectedArea('')}
                className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium transition ${!selectedArea ? 'bg-teal-50 text-teal-700 font-bold' : 'text-slate-600 hover:bg-slate-50'}`}
              >
                All Areas
              </button>
              {areas.map((a) => (
                <button
                  key={a}
                  onClick={() => setSelectedArea(a)}
                  className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium transition ${selectedArea === a ? 'bg-teal-50 text-teal-700 font-bold' : 'text-slate-600 hover:bg-slate-50'}`}
                >
                  {a}
                </button>
              ))}
            </div>
          </div>

          {/* Specialty Filter */}
          <div className="space-y-2 pt-3 border-t border-slate-100">
            <label className="text-xs font-bold text-slate-800 uppercase tracking-wider block">Specialty</label>
            <div className="space-y-1 max-h-44 overflow-y-auto pr-1">
              <button
                onClick={() => setSelectedSpecialty('')}
                className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium transition ${!selectedSpecialty ? 'bg-teal-50 text-teal-700 font-bold' : 'text-slate-600 hover:bg-slate-50'}`}
              >
                All Specialties
              </button>
              {specialties.map((s) => (
                <button
                  key={s}
                  onClick={() => setSelectedSpecialty(s)}
                  className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium transition ${selectedSpecialty === s ? 'bg-teal-50 text-teal-700 font-bold' : 'text-slate-600 hover:bg-slate-50'}`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Facilities Filter */}
          <div className="space-y-2 pt-3 border-t border-slate-100">
            <label className="text-xs font-bold text-slate-800 uppercase tracking-wider block">Facilities</label>
            <div className="space-y-1 max-h-40 overflow-y-auto pr-1">
              <button
                onClick={() => setSelectedFacility('')}
                className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium transition ${!selectedFacility ? 'bg-teal-50 text-teal-700 font-bold' : 'text-slate-600 hover:bg-slate-50'}`}
              >
                All Facilities
              </button>
              {facilities.map((f) => (
                <button
                  key={f}
                  onClick={() => setSelectedFacility(f)}
                  className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium transition ${selectedFacility === f ? 'bg-teal-50 text-teal-700 font-bold' : 'text-slate-600 hover:bg-slate-50'}`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          {/* Max Consultation Fee */}
          <div className="space-y-2 pt-3 border-t border-slate-100">
            <div className="flex justify-between text-xs font-bold text-slate-800">
              <span className="uppercase tracking-wider">Max Consultation</span>
              <span>{maxFee ? `₹${maxFee}` : 'Any Fee'}</span>
            </div>
            <input
              type="range"
              min="300"
              max="1500"
              step="100"
              value={maxFee || 1500}
              onChange={(e) => setMaxFee(Number(e.target.value))}
              className="w-full accent-teal-600"
            />
            <div className="flex justify-between text-[10px] text-slate-400">
              <span>₹300</span>
              <span>₹800</span>
              <span>₹1500+</span>
            </div>
          </div>

        </aside>

        {/* Results Area */}
        <main className="lg:col-span-3 space-y-6">
          
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[1, 2, 3, 4].map((n) => (
                <div key={n} className="bg-white rounded-2xl h-80 animate-pulse border border-slate-200" />
              ))}
            </div>
          ) : viewMode === 'map' ? (
            <div className="h-[600px] w-full bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
              <MapViewer
                hospitals={hospitals}
                onMarkerClick={(h) => setSelectedHospital(h)}
              />
            </div>
          ) : hospitals.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {hospitals.map((hospital) => (
                <HospitalCard
                  key={hospital.id}
                  hospital={hospital}
                  onBookClick={(h) => {
                    setSelectedHospital(h);
                    setIsBookingOpen(true);
                  }}
                />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center">
                <Search className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-800">No Hospitals Found</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                No hospitals matched your current filter criteria. Try adjusting your area, fee range, or clearing active filters.
              </p>
              <button
                onClick={resetFilters}
                className="bg-teal-600 text-white text-xs font-bold px-4 py-2 rounded-xl"
              >
                Clear All Filters
              </button>
            </div>
          )}

        </main>

      </div>

      <AppointmentModal
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        hospital={selectedHospital}
      />

    </div>
  );
};
