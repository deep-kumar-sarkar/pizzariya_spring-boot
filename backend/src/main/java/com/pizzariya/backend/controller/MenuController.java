package com.pizzariya.backend.controller;

import com.pizzariya.backend.entity.MenuItem;
import com.pizzariya.backend.services.MenuService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/menu")
public class MenuController {
    
    @Autowired
    private MenuService menuService;

    @GetMapping
    public List<MenuItem> getMenuByOutlet(@RequestParam(required = false) Long outlet_id) {
        if (outlet_id != null) {
            return menuService.getMenuByOutlet(outlet_id);
        }
        return menuService.getAllMenuItems();
    }
}
