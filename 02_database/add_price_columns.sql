-- Migration script to add new price columns to tbl_items
-- Run this script to add the new price fields to your existing database

ALTER TABLE tbl_items 
ADD COLUMN purchase_price DECIMAL(38,2) DEFAULT NULL COMMENT 'Precio de compra al proveedor - solo visible para admin',
ADD COLUMN installation_price DECIMAL(38,2) DEFAULT NULL COMMENT 'Precio con instalación (mano de obra)';
