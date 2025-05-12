import type { Product } from "../../types";
import { useState } from "preact/hooks";
import { DeleteCategoryModal, DeleteProductModal, EditCategoryModal, EditProductModal } from "./Modal";
import type { ComponentChildren } from "preact";
import { useBoucherDataContext, useInventoryDataContext } from "./ContextProvider";
import type { CategoryDTO, ProductDTO } from "../../lib/remote/types";

interface DataTableProps<T> {
    //headers: {label:string, entityProp: string}[]
}

interface ProductDataTableProps extends DataTableProps<Product> {
    children?: ComponentChildren
};

export function ProductDataTable (props: ProductDataTableProps) {
    const { 
        productData, loadingProduct, errorProduct
    } = useInventoryDataContext();
    /*const [selectedProduct, setSelectedProduct] = useState<ProductDTO | null>(null);
    const [selectedCategory, setSelectedCategory] = useState<CategoryDTO | null>(null);*/
    /*const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);*/
    
    const [delModalVisible, setDelModalVisible] = useState(false);
    const [editModalVisible, setEditModalVisible] = useState(false);

    // Estado para almacenar la lista de usuarios
    /*const [products, setProducts] = useState<Product[]>([]);
    // Estado para controlar si está cargando datos
    const [cargando, setCargando] = useState(true);*/
    // Estado para manejar errores
    const [error, setError] = useState<string | null>(null);
    // Estado para almacenar el usuario seleccionado para editar
    const [productSelect, setProductSelect] = useState<ProductDTO | null>(null);
    const [delProductSelect, setDelProductSelect] = useState<ProductDTO | null>(null);
    // Estado para controlar la carga durante el guardado
    //const [guardando, setGuardando] = useState(false);

    // Cargar usuarios al montar el componente
    /*useEffect(() => {
        const cargarUsuarios = async () => {
        try {
            setCargando(true);
            const data = await obtenerUsuarios();
            setProducts(data);
            setError(null);
        } catch (err) {
            setError('Error al cargar usuarios. Por favor, inténtelo de nuevo más tarde.');
            console.error(err);
        } finally {
            setCargando(false);
        }
        };
        
        cargarUsuarios();
    }, []);*/

    const showDelModal = (product: ProductDTO) => {
        setDelProductSelect(product);
        setDelModalVisible(true);
    }
    const hiddenDelModal = () => {
        setDelModalVisible(false);
        setDelProductSelect(null);
    }

    const showEditModal = (product: ProductDTO) => {
        setProductSelect(product);
        setEditModalVisible(true);
    }
    const hiddenEditModal = () => {
        setEditModalVisible(false);
        setProductSelect(null);
    }

    /*const saveUserChanges = async (updateProduct: Product) => {
        if (!selectedUser) return;
        
        try {
          setGuardando(true);
          // Llamar a la API para actualizar el usuario
          const responseProducts = await actualizarUsuario(usuarioSeleccionado.id, usuarioActualizado);
          
          // Actualizar la lista de usuarios en el estado local
          setProducts(prevProducts => 
            prevProducts.map(product => 
                product.id === responseProducts.id ? responseProducts : product
            )
          );
          
          // Mostrar mensaje de éxito (podrías usar un toast aquí)
          alert("Usuario actualizado correctamente");
          
          // Cerrar el modal
          hiddenEditModal();
        } catch (err) {
          setError('Error al actualizar usuario. Por favor, inténtelo de nuevo.');
          console.error(err);
        } finally {
          setGuardando(false);
        }
      };*/

    //console.log(props.actions.edit);

    return (
        <div class="overflow-y-auto scroll-smooth scroll-ml-5 max-h-96">
            {
                errorProduct && (
                    <>
                        <div class="w-full h-full flex-col items-center justify-center">
                            <h1 class="text-center font-bold">Error al cargar los datos de los productos</h1>
                            <p class="text-center">
                                Error: {errorProduct}
                            </p>
                            <button>Reintentar</button>
                        </div>
                    </>
                )
            }
            {
                loadingProduct && <>
                    <div class="w-full h-full flex-col items-center justify-center">
                        <h1 class="text-center font-bold">Cargando los productos...</h1>
                    </div>
                </>
            }
            {
                !loadingProduct && !errorProduct && productData.length == 0 && (
                    <>
                        <div class="w-full h-full flex-col items-center justify-center">
                            <h1 class="text-center font-bold">No tienes productos almacenados. Crealos ahora mismo.</h1>
                        </div>
                    </>
                )
            }
            {
                !errorProduct && productData.length > 0 && (
                    <>
                        <table class="mt-4 table border w-full">
                            <tbody>
                                <tr>
                                    <th class="table-cell border p-1 text-center">ID</th>
                                    <th class="table-cell border p-1 text-center">Nombre</th>
                                    <th class="table-cell border p-1 text-center">Categoría</th>
                                    <th class="table-cell border p-1 text-center">Stock Total</th>
                                    <th class="table-cell border p-1 text-center">Precio</th>            
                                    <th class="table-cell border p-1" key="col_actions" colSpan={2}>Acciones</th>
                                </tr>
                                {
                                    productData.map((product) => {
                                        return (
                                            <tr>
                                                <td class="table-cell border p-1 text-center">{product.id}</td>
                                                <td class="table-cell border p-1">{product.name}</td>
                                                <td class="table-cell border p-1 text-center">{(product.category) ? (product.category.name) ? product.category.name : "ERROR" : "Sin categoría"}</td>
                                                <td class="table-cell border p-1 text-center">{product.stock}</td>
                                                <td class="table-cell border p-1">S/ {product.price}</td>
                                                <td key={"col_" + product.id + "_edit_actions"} class="table-cell border font-bold">
                                                    <button class="p-1 text-center w-full hover:text-white hover:bg-black" key={product.id + "_edit"} onClick={() => showEditModal(product)}>Editar</button>
                                                </td>
                                                <td class="table-cell border font-bold" key={"col_" + product.id + "_remove_actions"}>
                                                    <button class="p-1 text-center w-full hover:text-white hover:bg-black" key={product.id + "_remove"} onClick={() => showDelModal(product)}>Eliminar</button>
                                                </td>
                                            </tr>
                                        );
                                    })
                                }
                                {
                                    productSelect && (
                                        <EditProductModal isOpen={editModalVisible} onClose={hiddenEditModal} product={productSelect} />
                                    )
                                }
                                {
                                    delProductSelect && (
                                        <DeleteProductModal isOpen={delModalVisible} onClose={hiddenDelModal} product={delProductSelect} text="¿Realmente desea eliminar este producto?" />
                                    )
                                }
                            </tbody>
                        </table>
                    </>
                )
            }    
        </div>     
    );
}

export function ProductDateTableComponent (props: ProductDataTableProps) {
    return (
        <ProductDataTable>
            {props.children}
        </ProductDataTable>     
    );
}

export function CategoryDataTableComponent (children?: ComponentChildren) {
    const { 
        categoryData, loadingCategory, errorCategory
    } = useInventoryDataContext();
    
    const [delModalVisible, setDelModalVisible] = useState(false);
    const [editModalVisible, setEditModalVisible] = useState(false);

    // Estado para manejar errores
    const [error, setError] = useState<string | null>(null);

    // Estado para almacenar el usuario seleccionado para editar
    const [categorySelect, setCategorySelect] = useState<CategoryDTO | null>(null);
    const [delCategorySelect, setDelCategorySelect] = useState<CategoryDTO | null>(null);


    const showDelModal = (cat: CategoryDTO) => {
        setDelCategorySelect(cat);
        setDelModalVisible(true);
    }
    const hiddenDelModal = () => {
        setDelModalVisible(false);
        setDelCategorySelect(null);
    }

    const showEditModal = (cat: CategoryDTO) => {
        setCategorySelect(cat);
        setEditModalVisible(true);
    }
    const hiddenEditModal = () => {
        setEditModalVisible(false);
        setCategorySelect(null);
    }

    return (
        <div class="overflow-y-auto scroll-smooth scroll-ml-5 max-h-96">
            {
                errorCategory && (
                    <>
                        <div class="w-full h-full flex-col items-center justify-center">
                            <h1 class="text-center font-bold">Error al cargar los datos de las categorías...</h1>
                            <p class="text-center">
                                Error: {errorCategory}
                            </p>
                            <button>Reintentar</button>
                        </div>
                    </>
                )
            }
            {
                loadingCategory && <>
                    <div class="w-full h-full flex-col items-center justify-center">
                        <h1 class="text-center font-bold">Cargando las categorías...</h1>
                    </div>
                </>
            }
            {
                !loadingCategory && !errorCategory && categoryData.length == 0 && (
                    <>
                        <div class="w-full h-full flex-col items-center justify-center">
                            <h1 class="text-center font-bold">No tienes categorías creadas. ¡Hazlo ahora mismo!.</h1>
                        </div>
                    </>
                )
            }
            {
                !errorCategory && categoryData.length > 0 && (
                    <>
                        <table class="mt-4 table border w-full">
                            <tbody>
                                <tr>
                                    <th class="table-cell border p-1 text-center">ID</th>
                                    <th class="table-cell border p-1 text-center">Nombre</th>          
                                    <th class="table-cell border p-1" key="col_actions" colSpan={2}>Acciones</th>
                                </tr>
                                {
                                    categoryData.map((cat) => {
                                        return (
                                            <tr>
                                                <td class="table-cell border p-1 text-center">{cat.id}</td>
                                                <td class="table-cell border p-1">{cat.name}</td>
                                                <td key={"col_" + cat.id + "_edit_actions"} class="table-cell border font-bold">
                                                    <button class="p-1 text-center w-full hover:text-white hover:bg-black" key={cat.id + "_edit"} onClick={() => showEditModal(cat)}>Editar</button>
                                                </td>
                                                <td class="table-cell border font-bold" key={"col_" + cat.id + "_remove_actions"}>
                                                    <button class="p-1 text-center w-full hover:text-white hover:bg-black" key={cat.id + "_remove"} onClick={() => showDelModal(cat)}>Eliminar</button>
                                                </td>
                                            </tr>
                                        );
                                    })
                                }
                                {
                                    categorySelect && (
                                        <EditCategoryModal isOpen={editModalVisible} onClose={hiddenEditModal} category={categorySelect} />
                                    )
                                }
                                {
                                    delCategorySelect && (
                                        <DeleteCategoryModal isOpen={delModalVisible} onClose={hiddenDelModal} category={delCategorySelect} text="¿Realmente desea eliminar este producto?" />
                                    )
                                }
                            </tbody>
                        </table>
                    </>
                )
            }    
        </div>     
    );
}

export function GridProductTableComponent () {
    const { productData, products, errorProduct, loadingProduct } = useInventoryDataContext();
    const { addProduct, selectedProducts, incrementProductCount } = useBoucherDataContext();

    const [selectProduct, setSelectProduct] = useState<ProductDTO | null>(null);

    const handlerElementClick = (product: ProductDTO) => {
        setSelectProduct(product);
        addProduct(product);
        incrementProductCount(product.id!, 1);
    }

    return (
        <div class="border min-h-60">
            {
                loadingProduct && (
                    <>
                        <h1 class="w-full h-full flex items-center justify-center">Cargando Productos...</h1>   
                    </>
                )
            }
            {
                !loadingProduct && !errorProduct && productData.length > 0 && (
                    <div class="grid gap-1 grid-cols-5 grid-rows-5">
                        {
                            productData.map((product) => {
                                if (product.stock === 0) {
                                    return (
                                        <div key={`bo_item_${product.id}`} class="rounded-b-md border-b-0 min-h-14 place-content-center p-1 bg-red-500 hover:cursor-pointer hover:bg-red-700 hover:text-white">
                                            <p key={`bo_item_${product.id}_name`} class="text-sm wrap-break-word text-pretty text-center">
                                                {product.name}
                                            </p>
                                            <span class="block text-xs text-center w-full">Producto sin Stock - No vendible</span>
                                        </div>
                                    );
                                }

                                return (
                                    <div key={`bo_item_${product.id}`} onClick={() => {handlerElementClick(product)}} class="border-b-0 rounded-b-md min-h-14 place-content-center p-1 bg-green-300 hover:cursor-pointer hover:bg-green-700 hover:text-white">
                                        <p key={`bo_item_${product.id}_name`} class="text-sm wrap-break-word text-pretty text-center">
                                            {product.name}
                                        </p>
                                    </div>
                                );
                            })
                        }
                    </div>
                )
            }
            {
                !loadingProduct && !errorProduct && productData.length === 0 && (
                    <div class="flex flex-col items-center justify-center w-full h-full min-h-60 font-bold text-2xl">
                        <div class="h-full">
                            <h1 class="text-center">No hay productos para vender</h1>
                            <a class="block text-center mt-6 p-3 border-2 rounded hover:border-amber-400 hover:bg-green-700 hover:cursor-pointer hover:text-white" href="/inventory/product">¡Puedes agregarlos desde aquí!</a>
                        </div>
                    </div>
                )
            }
        </div>
    )
}