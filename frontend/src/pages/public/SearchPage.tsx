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
  RotateCcw,
  Stethoscope,
  Building2
} from 'lucide-react';
import { api } from '../../services/api';
import { HospitalListItem, Doctor } from '../../types';
import { RAW_HOSPITALS, RAW_DOCTORS } from '../../data/rawHealthcareData';
import { HospitalCard } from '../../components/common/HospitalCard';
import { DoctorCard } from '../../components/common/DoctorCard';
import { MapViewer } from '../../components/common/MapViewer';
import { AppointmentModal } from '../../components/common/AppointmentModal';

export const SearchPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const initialCity = searchParams.get('city') || 'Indore';
  const initialSpecialty = searchParams.get('specialty') || '';

  const isDoctorRoute = typeof window !== 'undefined' && (
    window.location.pathname.includes('/doctors') || 
    Boolean(initialSpecialty)
  );

  const [query, setQuery] = useState(initialQuery);
  const [selectedCity, setSelectedCity] = useState(initialCity);
  const [selectedArea, setSelectedArea] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState(initialSpecialty);
  const [selectedFacility, setSelectedFacility] = useState('');
  const [maxFee, setMaxFee] = useState<number | undefined>(undefined);
  const [sortBy, setSortBy] = useState('relevance');
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  const [activeTab, setActiveTab] = useState<'all' | 'doctors' | 'hospitals'>(isDoctorRoute ? 'doctors' : 'all');
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const [hospitals, setHospitals] = useState<HospitalListItem[]>(() => {
    const q = (initialQuery || initialSpecialty).toLowerCase().trim();
    if (q) {
      const filtered = RAW_HOSPITALS.filter(h => 
        h.name.toLowerCase().includes(q) ||
        h.area.toLowerCase().includes(q) ||
        (h as any).departments?.some((d: any) => (typeof d === 'string' ? d : d.name).toLowerCase().includes(q)) ||
        RAW_DOCTORS.some(doc => doc.specialization.toLowerCase().includes(q) && doc.affiliations?.some(a => a.hospital_id === h.id))
      );
      return filtered.length > 0 ? filtered : RAW_HOSPITALS;
    }
    return RAW_HOSPITALS;
  });

  const [doctors, setDoctors] = useState<Doctor[]>(() => {
    const q = (initialQuery || initialSpecialty).toLowerCase().trim();
    if (q) {
      const filtered = RAW_DOCTORS.filter(d => 
        d.name.toLowerCase().includes(q) ||
        d.specialization.toLowerCase().includes(q) ||
        d.qualification.toLowerCase().includes(q)
      );
      return filtered.length > 0 ? filtered : RAW_DOCTORS;
    }
    return RAW_DOCTORS;
  });

  const [loading, setLoading] = useState(false);

  // Booking modal
  const [selectedHospital, setSelectedHospital] = useState<HospitalListItem | null>(null);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [isBookingOpen, setIsBookingOpen] = useState(false);

  const areas = ['Vijay Nagar', 'Scheme 54', 'New Palasia', 'AB Road', 'Bhawarkua', 'Manik Bagh', 'Bhawrasla'];
  const specialties = ['Cardiology', 'Orthopedics', 'Neurology', 'Pediatrics', 'Gynecology', 'Dermatology', 'General Medicine', 'Gastroenterology'];
  const facilities = ['24x7 Emergency', 'ICU & Critical Care', 'NICU', 'Operation Theatres', 'CT Scan & MRI', 'Blood Bank', 'Dialysis Unit'];

  // Sync URL search params if query/specialty in URL changes
  useEffect(() => {
    const qParam = searchParams.get('q');
    const specParam = searchParams.get('specialty');
    if (qParam !== null && qParam !== query) {
      setQuery(qParam);
    }
    if (specParam !== null && specParam !== selectedSpecialty) {
      setSelectedSpecialty(specParam);
    }
    if (window.location.pathname.includes('/doctors') || specParam) {
      setActiveTab('doctors');
    }
  }, [searchParams]);

  const fetchData = async () => {
    if (hospitals.length === 0 && doctors.length === 0) {
      setLoading(true);
    }
    try {
      const [hospData, docData] = await Promise.all([
        api.getHospitals({
          q: query,
          city: selectedCity,
          area: selectedArea,
          specialty: selectedSpecialty,
          facility: selectedFacility,
          max_fee: maxFee,
          sort_by: sortBy
        }),
        api.getDoctors({
          q: query,
          specialty: selectedSpecialty,
          max_fee: maxFee,
          sort_by: sortBy
        })
      ]);
      setHospitals(hospData);
      setDoctors(docData);
    } catch (err) {
      console.error('Error fetching healthcare data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [query, selectedCity, selectedArea, selectedSpecialty, selectedFacility, maxFee, sortBy]);

  const resetFilters = () => {
    setQuery('');
    setSelectedArea('');
    setSelectedSpecialty('');
    setSelectedFacility('');
    setMaxFee(undefined);
    setSortBy('relevance');
  };

  const totalResults = hospitals.length + doctors.length;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8 space-y-6">
      
      {/* Top Header & Search Bar */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              {activeTab === 'doctors' 
                ? `Doctors & Specialists in ${selectedCity}` 
                : activeTab === 'hospitals'
                ? `Hospitals & Clinics in ${selectedCity}`
                : `Healthcare Discovery in ${selectedCity}`}
            </h1>
            <p className="text-xs text-slate-500">
              Showing {doctors.length} verified doctors and {hospitals.length} hospitals matching your requirements
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
              placeholder="Search by doctor name, specialty, hospital, or symptoms (e.g. Dermatology, Medanta, Dr. Solanki)..."
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

        {/* Category Tabs: All / Doctors / Hospitals */}
        <div className="flex items-center space-x-2 pt-2 border-t border-slate-100 overflow-x-auto pb-1">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 shrink-0 ${
              activeTab === 'all'
                ? 'bg-teal-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <span>All Results</span>
            <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-semibold ${
              activeTab === 'all' ? 'bg-teal-700 text-teal-100' : 'bg-slate-200 text-slate-700'
            }`}>
              {totalResults}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('doctors')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 shrink-0 ${
              activeTab === 'doctors'
                ? 'bg-teal-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Stethoscope className="w-3.5 h-3.5" />
            <span>Doctors</span>
            <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-semibold ${
              activeTab === 'doctors' ? 'bg-teal-700 text-teal-100' : 'bg-slate-200 text-slate-700'
            }`}>
              {doctors.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('hospitals')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 shrink-0 ${
              activeTab === 'hospitals'
                ? 'bg-teal-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>Hospitals</span>
            <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-semibold ${
              activeTab === 'hospitals' ? 'bg-teal-700 text-teal-100' : 'bg-slate-200 text-slate-700'
            }`}>
              {hospitals.length}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Filter Toggle Button */}
      <div className="lg:hidden flex items-center justify-between bg-white px-4 py-3 rounded-2xl border border-slate-200 shadow-xs">
        <button
          onClick={() => setShowMobileFilters(!showMobileFilters)}
          className="flex items-center space-x-2 text-xs font-bold text-teal-700 bg-teal-50 hover:bg-teal-100 px-3 py-2 rounded-xl border border-teal-200 transition"
        >
          <Filter className="w-3.5 h-3.5" />
          <span>{showMobileFilters ? 'Hide Filters' : 'Filter by Area & Specialty'}</span>
          {(selectedArea || selectedSpecialty || selectedFacility || maxFee) && (
            <span className="w-2 h-2 rounded-full bg-teal-600 animate-pulse" />
          )}
        </button>
        <span className="text-xs font-semibold text-slate-500">
          {totalResults} Results
        </span>
      </div>

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        
        {/* Sticky Filter Sidebar */}
        <aside className={`lg:col-span-1 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-6 lg:sticky lg:top-24 ${showMobileFilters ? 'block' : 'hidden lg:block'}`}>
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
                onMarkerClick={(h) => {
                  setSelectedHospital(h);
                  setSelectedDoctor(null);
                }}
              />
            </div>
          ) : (
            <div className="space-y-8">
              
              {/* Doctor Results Section */}
              {(activeTab === 'all' || activeTab === 'doctors') && doctors.length > 0 && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="p-1.5 rounded-lg bg-teal-50 text-teal-700">
                        <Stethoscope className="w-4 h-4" />
                      </div>
                      <h2 className="text-lg font-black text-slate-900">
                        Available Doctors & Specialists ({doctors.length})
                      </h2>
                    </div>
                    {activeTab === 'all' && (
                      <button
                        onClick={() => setActiveTab('doctors')}
                        className="text-xs font-bold text-teal-700 hover:text-teal-800"
                      >
                        View all doctors →
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {doctors.map((doctor) => (
                      <DoctorCard
                        key={doctor.id}
                        doctor={doctor}
                        onBookClick={(d) => {
                          setSelectedDoctor(d);
                          setSelectedHospital(null);
                          setIsBookingOpen(true);
                        }}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Hospital Results Section */}
              {(activeTab === 'all' || activeTab === 'hospitals') && hospitals.length > 0 && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="p-1.5 rounded-lg bg-blue-50 text-blue-700">
                        <Building2 className="w-4 h-4" />
                      </div>
                      <h2 className="text-lg font-black text-slate-900">
                        Verified Hospitals & Clinics ({hospitals.length})
                      </h2>
                    </div>
                    {activeTab === 'all' && (
                      <button
                        onClick={() => setActiveTab('hospitals')}
                        className="text-xs font-bold text-teal-700 hover:text-teal-800"
                      >
                        View all hospitals →
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {hospitals.map((hospital) => (
                      <HospitalCard
                        key={hospital.id}
                        hospital={hospital}
                        onBookClick={(h) => {
                          setSelectedHospital(h);
                          setSelectedDoctor(null);
                          setIsBookingOpen(true);
                        }}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Empty State */}
              {((activeTab === 'all' && totalResults === 0) ||
                (activeTab === 'doctors' && doctors.length === 0) ||
                (activeTab === 'hospitals' && hospitals.length === 0)) && (
                <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center">
                    <Search className="w-6 h-6" />
                  </div>
                  <h3 className="text-base font-bold text-slate-800">
                    {activeTab === 'doctors'
                      ? 'No Doctors Found'
                      : activeTab === 'hospitals'
                      ? 'No Hospitals Found'
                      : 'No Matching Results Found'}
                  </h3>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto">
                    No results matched your current filter or search criteria for "{query || selectedSpecialty || 'selected filters'}". Try clearing filters or searching for another condition.
                  </p>
                  <button
                    onClick={resetFilters}
                    className="bg-teal-600 text-white text-xs font-bold px-4 py-2 rounded-xl hover:bg-teal-700 transition"
                  >
                    Clear All Filters
                  </button>
                </div>
              )}

            </div>
          )}

        </main>

      </div>

      <AppointmentModal
        isOpen={isBookingOpen}
        onClose={() => {
          setIsBookingOpen(false);
          setSelectedHospital(null);
          setSelectedDoctor(null);
        }}
        hospital={selectedHospital}
        doctor={selectedDoctor}
      />

    </div>
  );
};
