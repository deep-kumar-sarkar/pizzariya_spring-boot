package com.pizzariya.backend.services;

import com.pizzariya.backend.dto.CityStats;
import com.pizzariya.backend.entity.Outlet;
import com.pizzariya.backend.exception.ResourceNotFoundException;
import com.pizzariya.backend.repository.OutletRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class OutletServiceImpl implements OutletService {

    @Autowired
    private OutletRepository outletRepository;

    @Override
    public List<Outlet> getOutletsByCity(String city) {
        return outletRepository.findByCity(city);
    }

    @Override
    public List<CityStats> getCityStats() {
        return outletRepository.getCityStats();
    }

    @Override
    public List<Outlet> getAllOutlets() {
        return outletRepository.findAll();
    }

    @Override
    public Outlet getOutletById(Long id) {
        return outletRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Outlet not found with id: " + id));
    }
}
