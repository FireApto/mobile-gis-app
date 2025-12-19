// components/BuildingCard.tsx
import { Building } from '@/types/database.types';
import { MapPin, Clock, Wrench, ChevronRight, Star } from 'lucide-react';

interface BuildingCardProps {
  building: Building;
  isFavorite?: boolean;
  onToggleFavorite?: (buildingId: number) => void;
  onClick?: () => void;
}

export function BuildingCard({
  building,
  isFavorite = false,
  onToggleFavorite,
  onClick
}: BuildingCardProps) {
  const categoryColor = building.category?.color || '#0891B2';
  const categoryName = building.category?.name || 'General';
  const description = building.details?.description || 'Campus building';
  const hours = building.details?.opening_hours || null;
  const facilities = building.details?.facilities_count || 0;

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 overflow-hidden cursor-pointer group"
    >
      <div className="p-4">
        {/* Header */}
        <div className="flex items-start gap-3 mb-3">
          {/* Icon */}
          <div
            className="flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center"
            style={{ backgroundColor: `${categoryColor}15` }}
          >
            <MapPin
              className="w-6 h-6"
              style={{ color: categoryColor }}
            />
          </div>

          {/* Title */}
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-gray-900 truncate">
              {building.name || 'Unnamed Building'}
            </h3>
            <span
              className="inline-block px-2 py-0.5 text-xs font-medium rounded mt-1"
              style={{
                backgroundColor: `${categoryColor}20`,
                color: categoryColor
              }}
            >
              {categoryName}
            </span>
          </div>

          {/* Favorite & Arrow */}
          <div className="flex items-center gap-1">
            {onToggleFavorite && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleFavorite(building.id);
                }}
                className="p-2 rounded-full hover:bg-gray-100"
              >
                <Star
                  className={isFavorite ? "w-5 h-5 fill-yellow-400 text-yellow-400" : "w-5 h-5 text-gray-400"}
                />
              </button>
            )}
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </div>
        </div>

        {/* Description */}
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
          {description}
        </p>

        {/* Hours & Facilities */}
        <div className="flex items-center gap-4 text-xs text-gray-500">
          {hours && (
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>{hours}</span>
            </div>
          )}
          {facilities > 0 && (
            <div className="flex items-center gap-1">
              <Wrench className="w-4 h-4" />
              <span>{facilities} facilities</span>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Link */}
      <div
        className="px-4 py-2 bg-gray-50 border-t flex items-center gap-1 text-sm font-medium"
        style={{ color: categoryColor }}
      >
        <MapPin className="w-4 h-4" />
        <span>View on map</span>
      </div>
    </div>
  );
}