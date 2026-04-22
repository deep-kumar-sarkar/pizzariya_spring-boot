package com.pizzariya.backend.services;

import com.pizzariya.backend.dto.CityStats;
import com.pizzariya.backend.entity.Outlet;
import java.util.List;

public interface OutletService {
    List<Outlet> getOutletsByCity(String city);
    Outlet getOutletById(Long id);
    List<CityStats> getCityStats();
    List<Outlet> getAllOutlets();
}
