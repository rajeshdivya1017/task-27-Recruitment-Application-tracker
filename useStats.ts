import api from "./axios";

import type { Stats } from "../types";

export const fetchStats = async (): Promise<Stats> => {
  const response = await api.get<Stats>("/api/stats");

  return response.data;
};

