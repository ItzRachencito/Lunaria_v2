package com.santiago_rachen.lunaria_backend_springboot.entity;

public enum MovementType {

    IN("Entrada"),
    OUT("Salida"),
    ADJUSTMENT("Ajuste");

    private final String displayName;

    MovementType(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }


}