import { useState, useEffect } from 'react';
import VehicleCard from '../components/VehicleCard';
import { API_ENDPOINTS } from '../config/api';
import { useSearchParams } from 'react-router-dom';
import { Search, CarFront, Package, CircleCheckBig, Filter, X } from 'lucide-react';
import CustomDropdown from '../components/common/CustomDropdown';
import { useTranslation } from 'react-i18next';

const VehiclesPage = () => {
  const { t } = useTranslation('vehicles');
  const [vehicles, setVehicles] = useState([]);
  const [packages, setPackages] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    type: 'all',
    search: '',
    package: 'all',
    availability: 'all',
  });

  // Fetch vehicles and packages data from API
  useEffect(() => {
    fetchVehicles();
    fetchPackages();
  }, []);

  useEffect(() => {
    const typeFromUrl = searchParams.get("type");
    const packageFromUrl = searchParams.get("package");

    if (typeFromUrl === "car" || typeFromUrl === "bike") {
      setFilters((prev) => ({
        ...prev,
        type: typeFromUrl,
      }));
    }

    if (packageFromUrl && packageFromUrl !== 'all') {
      setFilters((prev) => ({
        ...prev,
        package: packageFromUrl,
      }));
    }
  }, [searchParams]);

  const fetchVehicles = async () => {
    setLoading(true);
    try {
      const response = await fetch(API_ENDPOINTS.vehiclesGrouped);
      const data = await response.json();

      if (data.status === 'success') {
        setVehicles(data.data.vehicles);
      }
    } catch (error) {
      console.error('Error fetching vehicles:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPackages = async () => {
    try {
      const response = await fetch(API_ENDPOINTS.packages);
      const data = await response.json();

      if (data.status === 'success') {
        setPackages(data.data.packages);
      }
    } catch (error) {
      console.error('Error fetching packages:', error);
    }
  };

  const handleTypeChange = (val) => {
    setFilters((prev) => ({ ...prev, type: val }));

    if (val === "all") {
      searchParams.delete("type");
      setSearchParams(searchParams);
    } else {
      setSearchParams({ type: val });
    }
  };

  const handlePackageChange = (val) => {
    setFilters((prev) => ({ ...prev, package: val }));

    if (val === "all") {
      searchParams.delete("package");
      setSearchParams(searchParams);
    } else {
      setSearchParams({ package: val });
    }
  };

  const clearAllFilters = () => {
    setFilters({ type: 'all', search: '', package: 'all', availability: 'all' });
    searchParams.delete("type");
    searchParams.delete("package");
    setSearchParams(searchParams);
  };

  const filteredVehicles = vehicles.filter((vehicle) => {
    // Type filter
    if (filters.type !== 'all' && vehicle.type !== filters.type) return false;

    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      if (
        !vehicle.name.toLowerCase().includes(searchLower) &&
        !vehicle.brand.toLowerCase().includes(searchLower) &&
        !vehicle.location.toLowerCase().includes(searchLower)
      ) {
        return false;
      }
    }

    // Package filter - filter based on vehicle cc_engine falling within package cc range
    if (filters.package !== 'all') {
      const selectedPackage = packages.find(pkg => pkg._id === filters.package);
      if (selectedPackage) {
        if (vehicle.cc_engine < selectedPackage.cc_range_min || vehicle.cc_engine > selectedPackage.cc_range_max) {
          return false;
        }
        if (vehicle.type !== selectedPackage.vehicle_type) {
          return false;
        }
      }
    }

    // Availability filter
    if (filters.availability !== 'all') {
      if (filters.availability === 'available' && vehicle.availability_status !== 'available') return false;
      if (filters.availability === 'booked' && vehicle.availability_status === 'available') return false;
    }

    return true;
  });

  const typeOptions = [
    { value: 'all', label: t('allTypes') },
    { value: 'car', label: t('cars') },
    { value: 'bike', label: t('bikes') },
  ];

  const packageOptions = [
    { value: 'all', label: t('allPackages') },
    ...packages.map(pkg => ({
      value: pkg._id,
      label: `${pkg.name}`
    }))
  ];

  const availabilityOptions = [
    { value: 'all', label: t('all') },
    { value: 'available', label: t('available') },
    { value: 'booked', label: t('booked') },
  ];

  return (
    <div className="min-h-screen bg-neutral-25 py-10 lg:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10 lg:mb-16 text-center max-w-3xl mx-auto">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-gold-50 text-gold-700 rounded-full text-sm font-semibold mb-4">
            <Filter className="w-4 h-4" />{t('exploreFleet')}
          </span>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold mb-4 text-ink-900 leading-tight">
            {t('explore')} <span className="text-gold-500">{t('ourFleet')}</span>
          </h1>
          <p className="text-lg text-ink-500 max-w-2xl mx-auto">{t('subtitle')}</p>
        </div>

        <div className="mb-8 lg:mb-10">
          <div className="bg-white rounded-3xl shadow-card-rest border border-ink-100 p-6 sm:p-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {/* Search */}
              <div>
                <label className="flex items-center text-sm font-semibold text-ink-700 mb-3">
                  <Search className="w-4 h-4 mr-2 text-gold-500" />
                  {t('common:actions.search')}
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder={t('searchPlaceholder')}
                    value={filters.search}
                    onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                    className="w-full pl-11 pr-4 py-3 border-2 border-ink-200 rounded-xl focus:border-gold-500 focus:ring-2 focus:ring-gold-500/20 focus:outline-none transition-all duration-200 text-sm"
                  />
                </div>
              </div>

              {/* Type Filter */}
              <CustomDropdown
                label={t('vehicleType')}
                options={typeOptions}
                value={filters.type}
                onChange={handleTypeChange}
                icon={CarFront}
              />

              {/* Package Filter */}
              <CustomDropdown
                label={t('package')}
                options={packageOptions}
                value={filters.package}
                onChange={handlePackageChange}
                icon={Package}
              />

              {/* Availability */}
              <CustomDropdown
                label={t('availability')}
                options={availabilityOptions}
                value={filters.availability}
                onChange={(val) => setFilters({ ...filters, availability: val })}
                icon={CircleCheckBig}
              />
            </div>

            {(filters.type !== 'all' || filters.search || filters.package !== 'all' || filters.availability !== 'all') && (
              <div className="mt-6 pt-6 border-t border-ink-100">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="text-sm font-semibold text-ink-600">{t('activeFilters')}</span>
                  {filters.type !== 'all' && <span className="px-4 py-2 bg-gradient-to-r from-gold-500 to-gold-600 text-white text-xs rounded-full font-semibold capitalize shadow-md">{t(filters.type === 'car' ? 'cars' : 'bikes')}</span>}
                  {filters.search && <span className="px-4 py-2 bg-gradient-to-r from-gold-500 to-gold-600 text-white text-xs rounded-full font-semibold shadow-md">"{filters.search}"</span>}
                  {filters.package !== 'all' && <span className="px-4 py-2 bg-gradient-to-r from-gold-500 to-gold-600 text-white text-xs rounded-full font-semibold capitalize shadow-md">{packages.find(pkg => pkg._id === filters.package)?.name || t('package')}</span>}
                  {filters.availability !== 'all' && <span className="px-4 py-2 bg-gradient-to-r from-gold-500 to-gold-600 text-white text-xs rounded-full font-semibold capitalize shadow-md">{filters.availability}</span>}
                  <button onClick={clearAllFilters} className="ml-auto px-4 py-2 text-sm text-error-600 hover:text-error-700 font-semibold underline hover:no-underline"> {t('clearAllFilters')}</button>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="mb-8">
          <div className="inline-flex items-center gap-3 bg-gradient-to-r from-gold-50 to-gold-100 px-6 py-3 rounded-full shadow-md border border-gold-200">
            <CircleCheckBig className="w-5 h-5 text-gold-600" />
            <p className="text-ink-700 font-medium">{t('showing')} <span className="font-bold text-gold-600">{filteredVehicles.length}</span> {t('of')} <span className="font-bold text-ink-900">{vehicles.length}</span> {t('vehiclesCount')}</p>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-32">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-2 border-gold-500 border-t-transparent mx-auto mb-4" />
              <p className="text-ink-500 font-medium">{t('loadingVehicles')}</p>
            </div>
          </div>
        ) : filteredVehicles.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {filteredVehicles.map((vehicle) => <VehicleCard key={vehicle._id} vehicle={vehicle} />)}
          </div>
        ) : (
          <div className="text-center py-24 bg-white rounded-3xl shadow-card-rest border border-ink-100">
            <div className="inline-block p-10 bg-gradient-to-br from-ink-100 to-ink-200 rounded-full mb-6">
              <svg className="w-20 h-20 text-ink-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            </div>
            <h3 className="text-3xl font-bold text-ink-900 mb-3">{t('noVehiclesFound')}</h3>
            <p className="text-ink-500 mb-8 text-lg">{t('noVehiclesHint')}</p>
            <button onClick={clearAllFilters} className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-gold-500 to-gold-600 text-white rounded-xl font-semibold">{t('resetFilters')}</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default VehiclesPage;