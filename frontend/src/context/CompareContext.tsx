import React, { createContext, useContext, useState } from 'react';
import { HospitalListItem } from '../types';

interface CompareContextType {
  selectedHospitals: HospitalListItem[];
  addToCompare: (hospital: HospitalListItem) => void;
  removeFromCompare: (hospitalId: number) => void;
  clearCompare: () => void;
  isInCompare: (hospitalId: number) => boolean;
}

const CompareContext = createContext<CompareContextType | undefined>(undefined);

export const CompareProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [selectedHospitals, setSelectedHospitals] = useState<HospitalListItem[]>([]);

  const addToCompare = (hospital: HospitalListItem) => {
    if (selectedHospitals.some(h => h.id === hospital.id)) return;
    if (selectedHospitals.length >= 4) {
      alert("You can compare up to 4 hospitals at a time.");
      return;
    }
    setSelectedHospitals(prev => [...prev, hospital]);
  };

  const removeFromCompare = (hospitalId: number) => {
    setSelectedHospitals(prev => prev.filter(h => h.id !== hospitalId));
  };

  const clearCompare = () => {
    setSelectedHospitals([]);
  };

  const isInCompare = (hospitalId: number) => {
    return selectedHospitals.some(h => h.id === hospitalId);
  };

  return (
    <CompareContext.Provider value={{ selectedHospitals, addToCompare, removeFromCompare, clearCompare, isInCompare }}>
      {children}
    </CompareContext.Provider>
  );
};

export const useCompare = () => {
  const ctx = useContext(CompareContext);
  if (!ctx) throw new Error('useCompare must be used within CompareProvider');
  return ctx;
};
