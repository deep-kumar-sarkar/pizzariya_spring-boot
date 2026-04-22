package com.pizzariya.backend.services;

import com.pizzariya.backend.entity.MenuItem;
import com.pizzariya.backend.exception.ResourceNotFoundException;
import com.pizzariya.backend.repository.MenuItemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class MenuServiceImpl implements MenuService {

    @Autowired
    private MenuItemRepository menuItemRepository;

    @Override
    public List<MenuItem> getMenuByOutlet(Long outletId) {
        return menuItemRepository.findByOutletId(outletId);
    }

    @Override
    public List<MenuItem> getAllMenuItems() {
        return menuItemRepository.findAll();
    }

    @Override
    public MenuItem getMenuItemById(Long id) {
        return menuItemRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Menu Item not found with id: " + id));
    }
}
