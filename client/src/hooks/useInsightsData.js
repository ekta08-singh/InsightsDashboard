import { useEffect, useState } from "react";
import { fetchMeta, fetchInsights } from "../services/api";

export const useInsightsData = () => {
  const [meta, setMeta] = useState(null);
  const [filters, setFilters] = useState({
    end_year: "",
    topic: "",
    sector: "",
    region: "",
    pestle: "",
    source: "",
    swot: "",
    country: "",
    city: ""
  });
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  // meta values for filters
  useEffect(() => {
    fetchMeta().then(setMeta);
  }, []);

  // data based on filters
  useEffect(() => {
    setLoading(true);
    fetchInsights(filters)
      .then(setData)
      .finally(() => setLoading(false));
  }, [filters]);

  const updateFilter = (name, value) => {
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  return { meta, filters, updateFilter, data, loading };
};
