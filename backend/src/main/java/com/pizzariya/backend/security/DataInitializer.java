package com.pizzariya.backend.security;

import com.pizzariya.backend.entity.MenuItem;
import com.pizzariya.backend.entity.Outlet;
import com.pizzariya.backend.repository.MenuItemRepository;
import com.pizzariya.backend.repository.OutletRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import java.util.List;

@Configuration
public class DataInitializer {

    @Bean
    CommandLineRunner initDatabase(OutletRepository outletRepository, MenuItemRepository menuItemRepository) {
        return args -> {
            if (outletRepository.count() == 0) {
                // Create Outlets for Delhi
                Outlet delhi1 = Outlet.builder()
                        .name("Pizzariya Express Delhi")
                        .city("Delhi")
                        .address("Connaught Place, Block B")
                        .phone("011-23456789")
                        .build();

                Outlet delhi2 = Outlet.builder()
                        .name("Pizzariya South Delhi")
                        .city("Delhi")
                        .address("Saket District Centre")
                        .phone("011-45678901")
                        .build();

                Outlet delhi3 = Outlet.builder()
                        .name("Pizzariya North Delhi")
                        .city("Delhi")
                        .address("Rohini Sector 7")
                        .phone("011-56789012")
                        .build();

                // Create Outlets for Mumbai
                Outlet mumbai1 = Outlet.builder()
                        .name("Pizzariya Mumbai Central")
                        .city("Mumbai")
                        .address("Marine Drive, Near Station")
                        .phone("022-98765432")
                        .build();

                Outlet mumbai2 = Outlet.builder()
                        .name("Pizzariya Bandra West")
                        .city("Mumbai")
                        .address("Hill Road, Bandra")
                        .phone("022-87654321")
                        .build();

                List<Outlet> savedOutlets = outletRepository.saveAll(List.of(delhi1, delhi2, delhi3, mumbai1, mumbai2));
                
                // Link some pizzas to different outlets for variety
                menuItemRepository.saveAll(List.of(
                    MenuItem.builder().outlet(savedOutlets.get(0)).name("Margherita Classic").description("Thin crust with fresh mozzarella.").price(299.0).isVegetarian(true).cuisineType("Italian").build(),
                    MenuItem.builder().outlet(savedOutlets.get(1)).name("Spicy Paneer Tikka").description("Topped with marinated paneer.").price(449.0).isVegetarian(true).cuisineType("Indian Fusion").build(),
                    MenuItem.builder().outlet(savedOutlets.get(2)).name("Chicken Pepperoni").description("Loaded with chicken pepperoni.").price(599.0).isVegetarian(false).cuisineType("American").build(),
                    MenuItem.builder().outlet(savedOutlets.get(3)).name("Mumbai Masala Pizza").description("Local spicy chutney base.").price(349.0).isVegetarian(true).cuisineType("Fusion").build(),
                    MenuItem.builder().outlet(savedOutlets.get(4)).name("Seafood Special").description("Fresh prawns and fish.").price(799.0).isVegetarian(false).cuisineType("Continental").build()
                ));

                System.out.println("--- Database Seeded Successfully with 5 Outlets! ---");
            }
        };
    }
}
