package com.pizzariya.backend.repository;

import com.pizzariya.backend.dto.CityStats;
import com.pizzariya.backend.entity.Outlet;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface OutletRepository extends JpaRepository<Outlet, Long> {
    List<Outlet> findByCity(String city);

    @Query("SELECT new com.pizzariya.backend.dto.CityStats(o.city, COUNT(o)) FROM Outlet o GROUP BY o.city")
    List<CityStats> getCityStats();
}
