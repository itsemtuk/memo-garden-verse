
import { useState, useCallback } from 'react';
import { toast } from 'sonner';

interface PlantSearchResult {
  id: number;
  common_name: string;
  scientific_name: string[];
  other_name: string[];
  cycle: string;
  watering: string;
  sunlight: string[];
  default_image?: {
    regular_url: string;
    thumbnail: string;
  };
}

interface PlantDetails {
  id: number;
  common_name: string;
  scientific_name: string[];
  other_name: string[];
  cycle: string;
  watering: string;
  watering_general_benchmark?: {
    value: string;
    unit: string;
  };
  sunlight: string[];
  care_level: string;
  growth_rate: string;
  maintenance: string;
  description: string;
  default_image?: {
    regular_url: string;
    thumbnail: string;
  };
}

const PERENUAL_API_KEY = 'sk-ocWP683979cb448c710754';
const BASE_URL = 'https://perenual.com/api';

export const usePlantAPI = () => {
  const [loading, setLoading] = useState(false);
  const [searchResults, setSearchResults] = useState<PlantSearchResult[]>([]);

  const searchPlants = useCallback(async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        `${BASE_URL}/species-list?key=${PERENUAL_API_KEY}&q=${encodeURIComponent(query)}&indoor=1`
      );
      
      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
      }

      const data = await response.json();
      setSearchResults(data.data || []);
    } catch (error) {
      console.error('Error searching plants:', error);
      toast.error('Failed to search plants. Please try again.');
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const getPlantDetails = useCallback(async (plantId: number): Promise<PlantDetails | null> => {
    try {
      const response = await fetch(
        `${BASE_URL}/species/details/${plantId}?key=${PERENUAL_API_KEY}`
      );
      
      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching plant details:', error);
      toast.error('Failed to fetch plant details. Please try again.');
      return null;
    }
  }, []);

  const getWateringInterval = useCallback((watering: string): number => {
    // Convert watering frequency to days
    const wateringMap: { [key: string]: number } = {
      'frequent': 2,
      'average': 7,
      'minimum': 14,
      'none': 30
    };
    
    return wateringMap[watering.toLowerCase()] || 7; // Default to weekly
  }, []);

  return {
    loading,
    searchResults,
    searchPlants,
    getPlantDetails,
    getWateringInterval,
  };
};
