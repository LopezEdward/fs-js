import { createContext, type ComponentChildren } from "preact";
import { useContext, useEffect, useState } from "preact/hooks";
import type { BoucherDTO, CategoryDTO, CategoryDTOPage, ProductDTO, ProductDTOPage } from "../../lib/remote/types";
import { productCall, categoryCall, sellCall } from "./../../lib/remote/api-call";
import type { SellDTOForm } from "../../types";

interface EditModalAction {
    isOpen: boolean,
    openModal?: () => void,
    closeModal?: () => void,
    setOpenModal: (handler: () => void) => void,
    setCloseModal: (handler: () => void) => void
}

interface RemoveModalAction {
    isOpen: boolean,
    openModal?: () => void,
    closeModal?: () => void,
    setOpenModal: (handler: () => void) => void,
    setCloseModal: (handler: () => void) => void
}

interface ModalAction {
    edit: EditModalAction,
    remove: RemoveModalAction
}

export const Context = createContext<ModalAction | null>(null);

export const ModalActionContextProvider = function ({children}: {children: ComponentChildren}) {
    const props:ModalAction = {
        edit: defaultEditModalAction(),
        remove: defaultRemoveModalAction()
    }

    return (
        <Context.Provider value={props}>
            {children}
        </Context.Provider>
    );
}

function defaultEditModalAction (): EditModalAction {
    const [openModal, setOpenModal] = useState(() => () => console.log("Working!"));
    const [closeModal, setCloseModal] = useState(() => () => console.log("Working!"));

    const updateOpenModal = (func: () => void) => {
        setOpenModal(func);
    }

    const updateCloseModal = (func: () => void) => {
        setCloseModal(func);
    }

    return {
        isOpen: false, openModal, closeModal, setCloseModal: updateCloseModal, setOpenModal: updateOpenModal
    };
}

function defaultRemoveModalAction (): RemoveModalAction {
    const [openModal, setOpenModal] = useState(() => () => console.log("Working!"));
    const [closeModal, setCloseModal] = useState(() => () => console.log("Working!"));

    const updateOpenModal = (func: () => void) => {
        setOpenModal(func);
    }

    const updateCloseModal = (func: () => void) => {
        setCloseModal(func);
    }

    return {
        isOpen: false, openModal, closeModal, setCloseModal: updateCloseModal, setOpenModal: updateOpenModal
    };
}

interface InventoryDataContextProps {
    productData: ProductDTO[],
    categoryData: CategoryDTO[],
    //productDataPage?: ProductDTOPage[],
    //categoryDataPage?: ProductDTOPage[],
    loadingProduct: boolean,
    loadingCategory: boolean,
    errorProduct: string | null,
    errorCategory: string | null,
    products: {
        create: (body: ProductDTO) => Promise<ProductDTO>,
        update: (body: ProductDTO) => Promise<ProductDTO>,
        delete: (id: number) => Promise<boolean>,
        page?: (nPage: number, elements: number | null | void) => Promise<ProductDTOPage>
    },
    categories: {
        create: (body: CategoryDTO) => Promise<CategoryDTO>,
        update: (body: CategoryDTO) => Promise<CategoryDTO>,
        delete: (id: number) => Promise<boolean>,
        page?: (nPage: number, elements: number | null | void) => Promise<CategoryDTOPage>
        loadAll: () => Promise<void>
    }
}

const InventoryDataContext = createContext<InventoryDataContextProps | null>(null);

export function InventoryDataProvider ({children}: {children: ComponentChildren}) {
    const [products, setProducts] = useState<ProductDTO[] | []>([]);
    const [categories, setCategories] = useState<CategoryDTO[] | []>([]);
    const [loadingProduct, setLoadingProduct] = useState(true);
    const [loadingCategory, setLoadingCategory] = useState(true);
    const [errorProduct, setErrorProduct] = useState<string | null>(null);
    const [errorCategory, setErrorCategory] = useState<string | null>(null);
    const [controlStateProduct, setControlStateProduct] = useState<boolean>(true);
    const [controlStateCategory, setControlStateCategory] = useState<boolean>(true);

    async function getInitialData () {
        async function getInitProducts () {
            try {
                setLoadingProduct(true);
                const data = await productCall.page(1, 100);

                //console.log(data);

                setProducts(data.content.sort((a, b) => a.id! - b.id!));
                setErrorProduct(null);
            } catch (err) {
                const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
                setErrorProduct(errorMessage);
                console.error('Error fetching data:', err);
            } finally {
                setControlStateProduct(false);
                setLoadingProduct(false);
            }
        }

        async function getInitCategories () {
            try {
                setLoadingCategory(true);
                const data = await categoryCall.page(1);
                setCategories(data.content.sort((a, b) => a.id! - b.id!));
                setErrorCategory(null);
            } catch (err) {
                const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
                setErrorCategory(errorMessage);
                console.error('Error fetching data:', err);
            } finally {
                setControlStateCategory(false);
                setLoadingCategory(false);
            }
        }

        if (controlStateCategory) getInitCategories();
        if (controlStateProduct) getInitProducts();
    }

    useEffect(() => {
        getInitialData();
    }), [];

    // Función para crear un nuevo registro
    const createProduct = async (newItem: ProductDTO): Promise<ProductDTO> => {
        try {
            setLoadingProduct(true);
            const createdItem = await productCall.add(newItem);

            // Actualizar el estado local añadiendo el nuevo item
            setProducts(prevItems => [...prevItems, createdItem]);
            return createdItem;
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
            setErrorProduct(errorMessage);
            console.error('Error creating item:', err);
            throw err;
        } finally {
            setLoadingProduct(false);
        }
    };

    // Función para actualizar un registro existente
    const updateProduct = async (updatedItem: ProductDTO): Promise<ProductDTO> => {
        try {
            setLoadingProduct(true);
            const updated = await productCall.update(updatedItem);
            
            // Actualizar el estado local reemplazando el item actualizado
            setProducts(prevItems => 
                prevItems.map(item => item.id === updatedItem.id ? updated : item)
            );
            
            return updated;
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
            setErrorProduct(errorMessage);
            console.error('Error updating item:', err);
            throw err;
        } finally {
            setLoadingProduct(false);
        }
    };

    // Función para eliminar un registro
    const deleteProduct = async (id: number): Promise<boolean> => {
        try {
            setLoadingProduct(true);
            const status = await productCall.delete(id);

            if (!status.complete) {
                setErrorProduct("Error al eliminar el producto!");
                
                return false;
            }

            // Actualizar el estado local eliminando el item
            setProducts(prevItems => prevItems.filter(item => item.id !== id));
            
            return true;
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
            setErrorProduct(errorMessage);
            console.error('Error deleting item:', err);
            throw err;
        } finally {
            setLoadingProduct(false);
        }
    };

    // Función para crear un nuevo registro
    const createCategory = async (newItem: CategoryDTO): Promise<CategoryDTO> => {
        try {
            setLoadingCategory(true);
            const createdItem = await categoryCall.add(newItem);

            // Actualizar el estado local añadiendo el nuevo item
            setCategories(prevItems => [...prevItems, createdItem]);
            return createdItem;
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
            setErrorCategory(errorMessage);
            console.error('Error creating item:', err);
            throw err;
        } finally {
            setLoadingCategory(false);
        }
    };

    // Función para actualizar un registro existente
    const updateCategory = async (updatedItem: CategoryDTO): Promise<CategoryDTO> => {
        try {
            setLoadingCategory(true);
            const updated = await categoryCall.update(updatedItem);
            
            // Actualizar el estado local reemplazando el item actualizado
            setCategories(prevItems => 
                prevItems.map(item => item.id === updatedItem.id ? updated : item)
            );
            
            return updated;
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
            setErrorCategory(errorMessage);
            console.error('Error updating item:', err);
            throw err;
        } finally {
            setLoadingCategory(false);
        }
    };

    // Función para eliminar un registro
    const deleteCategory = async (id: number): Promise<boolean> => {
        try {
            setLoadingCategory(true);
            const status = await categoryCall.delete(id);

            if (!status.complete) {
                setErrorProduct("Error al eliminar el producto!");
                
                return false;
            }

            // Actualizar el estado local eliminando el item
            setCategories(prevItems => prevItems.filter(item => item.id !== id));
            
            return true;
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
            setErrorCategory(errorMessage);
            console.error('Error deleting item:', err);
            throw err;
        } finally {
            setLoadingCategory(false);
        }
    };

    // Load news categories
    const loadAllCategories = async (): Promise<void> => {
        try {
            setLoadingCategory(true);
            const data = await categoryCall.all();
            
            if (data.length <= 0) {
                return;
            }

            setCategories(data);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : "Error desconocido";
            setErrorCategory(errorMessage);
            console.error('Load all categories error: :', err);
            throw err;
        } finally {
            setLoadingCategory(false);
        }
    }

    /*//*Page of ProductDTO
    const pageProductDTO = async (nPage: number, elements: number | null | void) => {
        try {
            setLoadingCategory(true);
            const data = await categoryCall.page(nPage, elements);
            
            if (data.content. <= 0) {
                return;
            }

            setCategories(data);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : "Error desconocido";
            setErrorCategory(errorMessage);
            console.error('Load all categories error: :', err);
            throw err;
        } finally {
            setLoadingCategory(false);
        }
    }*/

    const contextValue: InventoryDataContextProps = {
        productData: products as ProductDTO[],
        categoryData: categories as CategoryDTO[],
        loadingProduct: loadingProduct,
        loadingCategory: loadingCategory,
        errorProduct: errorProduct,
        errorCategory: errorCategory,
        products: {
            create: createProduct,
            update: updateProduct,
            delete: deleteProduct,
            //page: pageProductDTO
        },
        categories: {
            create: createCategory,
            update: updateCategory,
            delete: deleteCategory,
            loadAll: loadAllCategories
        }
      };

    return (
        <InventoryDataContext.Provider value={contextValue}>
            {children}
        </InventoryDataContext.Provider>
    );
}

export const useInventoryDataContext = (): InventoryDataContextProps => {
    const context = useContext(InventoryDataContext);
    if (!context) {
      throw new Error('useInventoryDataContext debe ser usado dentro de un InventoryDataProvider');
    }

    return context;
};

export interface BouchureSelectProduct {
    id: number,
    pro_name: string,
    quantity: number,
    max_stock: number,
    price: number
}

interface BoucherDataContextProps {
    selectedProducts: BouchureSelectProduct[] | [],
    addProduct: (dto: ProductDTO) => void,
    decrementProductCount: (id: number, quantity: number) => void,
    incrementProductCount: (id: number, quantity: number) => void
    removeProduct: (id: number) => void,
    cleanBouchure: () => void,
    actions: {
        add: (dto: BoucherDTO, onError: () => void) => Promise<BoucherDTO>,
        delete?: (id: number) => Promise<boolean>,
        update?: (dto: SellDTOForm) => Promise<SellDTOForm>
    }
}

const BoucherDataContext = createContext<BoucherDataContextProps | null>(null);

export function BoucherDataProvider ({children}: {children?: ComponentChildren}) {
    const [selectedProducts, setSelectedProducts] = useState<BouchureSelectProduct[] | []>([]);

    const addProduct = (dto: ProductDTO) => {
        const prodIndex = selectedProducts.findIndex((val) => {
            return dto.id === val.id
        });
        
        //console.log(prodIndex);

        if (prodIndex !== -1) return;

        setSelectedProducts((prev) => ([
            ...prev,
            {
                id: dto.id!,
                pro_name: dto.name,
                quantity: (dto.stock === 0) ? 0 : 1,
                max_stock: dto.stock,
                price: dto.price
            }
        ]));
    }

    const decrementProductCount = (id: number, res: number) => {
        setSelectedProducts(prev => {
            return prev.map(product => {
                return product.id === id ? 
                    { ...product, quantity: product.quantity - res }
                    : product
            });
        });
    }

    const incrementProductCount = (id: number, add: number) => {
        const productIndex = selectedProducts.findIndex(product => product.id === id);

        if (productIndex === -1) return;

        const gP = selectedProducts[productIndex];
        const newQuantity = gP.quantity + add;

        if (newQuantity > gP.max_stock) {
            setSelectedProducts(prev => {
                return prev.map(product => {
                    return product.id === id ? 
                        { ...product, quantity: gP.max_stock}
                        : product
                });
            });

            return;
        }

        setSelectedProducts(prev => {
            return prev.map(product => {
                return product.id === id ? 
                    { ...product, quantity: newQuantity}
                    : product
            });
        });
    }

    const removeProduct = (id: number) => {
        setSelectedProducts(prev => {
            return prev.filter((product) => product.id === id);
        });
    }

    const cleanBouchure = () => {
        setSelectedProducts(prev => []);
    }

    const addSell = async (dto: BoucherDTO, onError?: () => void) => {
        try {
            const data = await sellCall.add(dto);
            
            return data;
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Error desconocido';

            if (onError) {
                onError();
            }

            console.error('Error posting item:', err);
            throw err;
        }
    }
    
    const val:BoucherDataContextProps = {
        selectedProducts, decrementProductCount, incrementProductCount, removeProduct, addProduct, cleanBouchure,
        actions: {
            add: addSell
        }
    };

    return (
        <BoucherDataContext.Provider value={val}>
            {children}
        </BoucherDataContext.Provider>
    );
}

export const useBoucherDataContext = () => {
    const context = useContext(BoucherDataContext);

    if (!context) {
        throw new Error("useBoucherDataContext debe ser usado dentro de un BouchureDataProvider");
    }

    return context;
}