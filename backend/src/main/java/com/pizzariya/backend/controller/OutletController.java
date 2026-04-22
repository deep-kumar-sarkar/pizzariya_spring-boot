package com.pizzariya.backend.controller;

import com.pizzariya.backend.dto.CityStats;
import com.pizzariya.backend.entity.Outlet;
import com.pizzariya.backend.services.OutletService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/outlets")
public class OutletController {
    
    @Autowired
    private OutletService outletService;

    @GetMapping
    public List<Outlet> getOutletsByCity(@RequestParam(required = false) String city) {
        if (city != null && !city.isEmpty()) {
            return outletService.getOutletsByCity(city);
        }
        return outletService.getAllOutlets();
    }

    @GetMapping("/cities")
    public List<CityStats> getCityStats() {
        System.out.println("--- Fetching City Stats ---");
        List<CityStats> stats = outletService.getCityStats();
        System.out.println("--- Stats Found: " + stats.size() + " ---");
        return stats;
    }
}
