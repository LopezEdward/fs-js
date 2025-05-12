import { Body } from "./Body";
import { AddCategoryModal, AddProductModal } from "./../Modal";
import { useState, useEffect, useContext } from "preact/hooks";
import { CategoryDataTableComponent, ProductDateTableComponent } from "./../DataTable";
import { InventoryDataProvider, useInventoryDataContext } from "../ContextProvider"; 

export const Inventory = function () {
    // Add product modal actions
    const [addModalVisible, setAddModalVisible] = useState(false);

    const showAddModal = () => {
        setAddModalVisible(true);
    }
    const hiddenADdModal = () => {
        setAddModalVisible(false);
    }

    return (
        <Body>
            <InventoryDataProvider>
                <div class="mb-3 flex justify-end">
                    <button onClick={showAddModal} class="font-bold p-2 border-2 rounded hover:cursor-pointer">Agregar Producto</button>
                    <AddProductModal isOpen={addModalVisible} onClose={hiddenADdModal}/>
                </div>
                <ProductDateTableComponent/>
            </InventoryDataProvider>
        </Body>
    );
}

export const Category = function () {
    // Add product modal actions
    const [addModalVisible, setAddModalVisible] = useState(false);

    const showAddModal = () => {
        setAddModalVisible(true);
    }
    const hiddenADdModal = () => {
        setAddModalVisible(false);
    }

    return (
        <Body>
            <InventoryDataProvider>
                <div class="mb-3 flex justify-end">
                    <button onClick={showAddModal} class="font-bold p-2 border-2 rounded hover:cursor-pointer">Agregar Categoría</button>
                    <AddCategoryModal isOpen={addModalVisible} onClose={hiddenADdModal}/>
                </div>
                <CategoryDataTableComponent/>
            </InventoryDataProvider>
        </Body>
    );
}