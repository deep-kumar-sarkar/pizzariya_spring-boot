package com.pizzariya.backend.services;

import com.pizzariya.backend.entity.MenuItem;
import java.util.List;

public interface MenuService {
    List<MenuItem> getMenuByOutlet(Long outletId);
    MenuItem getMenuItemById(Long id);
    List<MenuItem> getAllMenuItems();
}
