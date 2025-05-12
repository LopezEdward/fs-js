import { useState, useEffect, useRef } from "preact/hooks";
import { type ProductDTOForm, type CategoryDTOForm } from "../../types";
import { type ComponentChildren } from "preact";
import { useInventoryDataContext } from "./ContextProvider";
import type { CategoryDTO, ProductDTO } from "../../lib/remote/types";
import type { TargetedEvent } from "preact/compat";

interface ModalProps {
    isOpen: boolean,
    onClose: () => void,
    children?: ComponentChildren
}

interface EditProductModalProps extends ModalProps {
    title?: string,
    product: ProductDTO
}

interface DeleteProductModalProps extends ModalProps {
    title?: string,
    text?: string,
    product: ProductDTO
}

interface AddProductModalProps extends ModalProps {
    title?: string
}

export function DeleteProductModal(props: DeleteProductModalProps) {
    const { products } = useInventoryDataContext();

    const modalRef = useRef<HTMLDivElement>(null);
    const previousFocusRef = useRef<HTMLElement | null>(null);

    // Guardar el elemento con foco antes de abrir el modal
    useEffect(() => {
        // Guardar estado original del scroll
        const originalOverflow = window.getComputedStyle(document.body).overflow;

        if (props.isOpen) {
            previousFocusRef.current = document.activeElement as HTMLElement;

            // Bloquear scroll
            document.body.style.overflow = 'hidden';

            // Autofocus en el modal
            if (modalRef.current) {
                modalRef.current.focus();
            }
        } else {
            // Restaurar scroll
            document.body.style.overflow = originalOverflow;

            // Devolver el foco al elemento anterior
            if (previousFocusRef.current) {
                previousFocusRef.current.focus();
            }
        }

        return () => {
            // Asegurarnos de que el scroll se restaure siempre
            document.body.style.overflow = originalOverflow;
        };
        //document.body.style.overflow = '';
    }, [props.isOpen]);

    // Gestionar clicks fuera del modal
    useEffect(() => {
        const handleOutsideClick = (event: MouseEvent) => {
            if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
                props.onClose();
            }
        };

        if (props.isOpen) {
            document.addEventListener('mousedown', handleOutsideClick);
        }

        return () => {
            document.removeEventListener('mousedown', handleOutsideClick);
        };


    }, [props.isOpen, props.onClose]);

    // Capturar la tecla Escape para cerrar el modal
    useEffect(() => {
        const handleEscKey = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                props.onClose();
            }
        };

        if (props.isOpen) {
            document.addEventListener('keydown', handleEscKey);
        }

        return () => {
            document.removeEventListener('keydown', handleEscKey);
        };
    }, [props.isOpen, props.onClose]);

    if (!props.isOpen) return (<></>);

    const onSubmit = async (e: TargetedEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            await products.delete(props.product.id!);
        } catch (err) {
            return;
        }

        props.onClose();

        return;
    }

    return (
        <div id="del-modal-id" class="bg-gray-500/60 w-full h-full absolute left-0 top-0 flex justify-center items-center text-white">
            {
                <div class="bg-black/70 p-7 rounded min-h-7/12 min-w-4/12">
                    <div class="flex justify-end">
                        <button class="rounded-4xl border py-1 px-3 font-bold hover:cursor-pointer" onClick={props.onClose}>X</button>
                    </div>
                    <div>
                        <h1 class="text-center font-bold mt-4">{props.title || "Delete Action"}</h1>
                        <form onSubmit={onSubmit}>
                            <div class="mt-10">
                                <p class="text-center">{(props.text) ? props.text : `Are you sure to delete the product "${props.product.name}"?`}</p>
                            </div>
                            <div class="mt-15 flex w-full justify-evenly">
                                <button class="p-2 border rounded hover:cursor-pointer hover:bg-white hover:text-black" onClick={props.onClose} type="button">Cancelar</button>
                                <button class="p-2 border rounded hover:cursor-pointer hover:bg-red-600" type="submit">Eliminar</button>
                            </div>
                        </form>
                    </div>
                </div>
            }
        </div>
    );
}

export function EditProductModal(props: EditProductModalProps) {
    const { categories, categoryData, loadingCategory, products } = useInventoryDataContext();

    const modalRef = useRef<HTMLDivElement>(null);
    const previousFocusRef = useRef<HTMLElement | null>(null);

    // Guardar el elemento con foco antes de abrir el modal
    useEffect(() => {
        // Guardar estado original del scroll
        const originalOverflow = window.getComputedStyle(document.body).overflow;

        if (props.isOpen) {
            previousFocusRef.current = document.activeElement as HTMLElement;

            // Bloquear scroll
            document.body.style.overflow = 'hidden';

            // Autofocus en el modal
            if (modalRef.current) {
                modalRef.current.focus();
            }
        } else {
            // Restaurar scroll
            document.body.style.overflow = originalOverflow;

            // Devolver el foco al elemento anterior
            if (previousFocusRef.current) {
                previousFocusRef.current.focus();
            }
        }

        return () => {
            // Asegurarnos de que el scroll se restaure siempre
            document.body.style.overflow = originalOverflow;
        };
    }, [props.isOpen]);

    // Gestionar clicks fuera del modal
    useEffect(() => {
        const handleOutsideClick = (event: MouseEvent) => {
            if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
                props.onClose();
            }
        };

        if (props.isOpen) {
            document.addEventListener('mousedown', handleOutsideClick);
        }

        return () => {
            document.removeEventListener('mousedown', handleOutsideClick);
        };
    }, [props.isOpen, props.onClose]);

    // Capturar la tecla Escape para cerrar el modal
    useEffect(() => {
        const handleEscKey = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                props.onClose();
            }
        };

        if (props.isOpen) {
            document.addEventListener('keydown', handleEscKey);
        }

        return () => {
            document.removeEventListener('keydown', handleEscKey);
        };
    }, [props.isOpen, props.onClose]);


    const [formData, setFormData] = useState<ProductDTOForm>({
        name: props.product.name, price: props.product.price, stock: props.product.stock, categoryId: (props.product.category) ? props.product.category.id! : undefined
    });

    // Manejar cambios del Input
    const handleChangeInputs = (e: TargetedEvent<HTMLInputElement>) => {
        const target = e.target as HTMLInputElement;
        const { name, value } = target;

        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        console.log(formData);
    }

    const handleChangeSelects = (e: TargetedEvent<HTMLSelectElement>) => {
        const target = e.target as HTMLSelectElement;
        const { name, value } = target;

        //console.log(target);

        setFormData(prev => ({
            ...prev,
            [name]: parseInt(value)
        }));

        /*console.log(parseInt(value));
        console.log(formData);*/
    }

    const chargeCategories = async () => {
        if (!loadingCategory) {
            categories.loadAll();
        }
    }

    const onSubmit = async (e: TargetedEvent<HTMLFormElement>) => {
        e.preventDefault();

        // Transformar
        const dto: ProductDTO = {
            id: props.product.id,
            name: formData.name,
            price: formData.price,
            stock: formData.stock,
            category: (formData.categoryId && !isNaN(formData.categoryId)) ?
                { id: formData.categoryId }
                : null
        };

        try {
            await products.update(dto);
        } catch (err) {
            return;
        }

        setFormData({
            name: '',
            price: 0,
            stock: 0,
            categoryId: undefined
        });

        props.onClose();

        return;
    }

    if (!props.isOpen) return (<></>);

    return (
        <div class="bg-gray-500/60 w-full h-full absolute left-0 top-0 flex justify-center items-center text-white">
            <div class="bg-black/70 p-7 rounded min-h-7/12 min-w-4/12">
                <div class="flex justify-end">
                    <button class="rounded-4xl border py-1 px-3 font-bold hover:cursor-pointer" onClick={props.onClose}>X</button>
                </div>
                <div>
                    <h1 class="text-center font-bold mt-4">{props.title || "Edit Action"}</h1>
                    <form onSubmit={onSubmit}>
                        <div>
                            <div class="my-1 flex flex-col">
                                <label htmlFor="name">Nombre</label>
                                <input onChange={handleChangeInputs} class="bg-green-600 p-0.5" name="name" id="name" type="text" maxLength={64} value={formData.name} required />
                            </div>
                            <div class="my-1 flex flex-col">
                                <label htmlFor="price">Precio</label>
                                <input onChange={handleChangeInputs} class="bg-green-600 p-0.5" name="price" id="price" type="text" max={99999} value={formData.price} required />
                            </div>
                            <div class="my-1 flex flex-col">
                                <label htmlFor="stock">Stock</label>
                                <input onChange={handleChangeInputs} class="bg-green-600 p-0.5" name="stock" id="stock" type="number" max={99999} value={formData.stock} required />
                            </div>
                            <div class="my-1 flex flex-col">
                                <label htmlFor="categoryId">Categoría</label>
                                <select onChange={handleChangeSelects} value={(formData.categoryId) ? formData.categoryId : undefined} onFocus={chargeCategories} onClick={chargeCategories} class="bg-green-600 p-0.5" name="categoryId" id="categoryId" required>
                                    <option>Sin categoría</option>
                                    {
                                        (categoryData.length > 0) && (
                                            categoryData.map((cat) => {
                                                return (
                                                    <option key={`cat_opt_${cat.id}`} value={cat.id!}>{cat.name!}</option>
                                                );
                                            })
                                        )
                                    }
                                </select>
                            </div>
                        </div>
                        <div class="mt-15 flex w-full justify-evenly">
                            <button onClick={props.onClose} type="button">Cancelar</button>
                            <button type="submit">Guardar</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export function AddProductModal(props: AddProductModalProps) {
    const {
        loadingProduct, products, loadingCategory, categories, categoryData

    } = useInventoryDataContext();

    const modalRef = useRef<HTMLDivElement>(null);
    const previousFocusRef = useRef<HTMLElement | null>(null);

    const [formData, setFormData] = useState<ProductDTOForm>({
        name: '', price: 0, stock: 0, categoryId: undefined
    });

    const [submitting, setSubmitting] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    // Manejar cambios del Input
    const handleChangeInputs = (e: TargetedEvent<HTMLInputElement>) => {
        const target = e.target as HTMLInputElement;
        const { name, value } = target;

        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        console.log(formData);
    }

    const handleChangeSelects = (e: TargetedEvent<HTMLSelectElement>) => {
        const target = e.target as HTMLSelectElement;
        const { name, value } = target;

        //console.log(target);

        setFormData(prev => ({
            ...prev,
            [name]: parseInt(value)
        }));

        console.log(parseInt(value));
        console.log(formData);
    }

    // Guardar el elemento con foco antes de abrir el modal
    useEffect(() => {
        // Guardar estado original del scroll
        const originalOverflow = window.getComputedStyle(document.body).overflow;

        if (props.isOpen) {
            previousFocusRef.current = document.activeElement as HTMLElement;

            // Bloquear scroll
            document.body.style.overflow = 'hidden';

            // Autofocus en el modal
            if (modalRef.current) {
                modalRef.current.focus();
            }
        } else {
            // Restaurar scroll
            document.body.style.overflow = originalOverflow;

            // Devolver el foco al elemento anterior
            if (previousFocusRef.current) {
                previousFocusRef.current.focus();
            }
        }

        return () => {
            // Asegurarnos de que el scroll se restaure siempre
            document.body.style.overflow = originalOverflow;
        };
        //document.body.style.overflow = '';
    }, [props.isOpen]);

    // Gestionar clicks fuera del modal
    useEffect(() => {
        const handleOutsideClick = (event: MouseEvent) => {
            if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
                props.onClose();
            }
        };

        if (props.isOpen) {
            document.addEventListener('mousedown', handleOutsideClick);
        }

        return () => {
            document.removeEventListener('mousedown', handleOutsideClick);
        };


    }, [props.isOpen, props.onClose]);

    // Capturar la tecla Escape para cerrar el modal
    useEffect(() => {
        const handleEscKey = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                props.onClose();
            }
        };

        if (props.isOpen) {
            document.addEventListener('keydown', handleEscKey);
        }

        return () => {
            document.removeEventListener('keydown', handleEscKey);
        };
    }, [props.isOpen, props.onClose]);

    // OnSubmit
    const onSubmit = async (e: TargetedEvent<HTMLFormElement>) => {
        e.preventDefault();

        // Transformar
        const dto: ProductDTO = {
            id: null,
            name: formData.name,
            price: formData.price,
            stock: formData.stock,
            category: (formData.categoryId) ?
                { id: formData.categoryId }
                : null
        };

        try {
            await products.create(dto);
        } catch (err) {
            return;
        }

        setFormData({
            name: '',
            price: 0,
            stock: 0,
            categoryId: undefined
        });

        props.onClose();

        return;
    }

    // Volver a cargar las categorías
    const chargeCategories = async () => {
        if (!loadingCategory) {
            categories.loadAll();
        }
    }

    if (!props.isOpen) return (<></>);

    return (
        <div class="bg-gray-500/60 w-full h-full absolute left-0 top-0 flex justify-center items-center text-white">
            <div class="bg-black/70 p-7 rounded min-h-7/12 min-w-4/12">
                {
                    !loadingProduct &&
                    (
                        <>
                            <div class="flex justify-end">
                                <button class="rounded-4xl border py-1 px-3 font-bold hover:cursor-pointer" onClick={props.onClose}>X</button>
                            </div>
                            <div>
                                <h1 class="text-center font-bold mt-4">{props.title || "Add Action"}</h1>
                                <form onSubmit={onSubmit}>
                                    <div>
                                        <div class="my-1 flex flex-col">
                                            <label htmlFor="name">Nombre</label>
                                            <input onChange={handleChangeInputs} value={formData.name} class="bg-green-600 p-0.5" name="name" id="name" type="text" maxLength={64} required />
                                        </div>
                                        <div class="my-1 flex flex-col">
                                            <label htmlFor="stock">Stock</label>
                                            <input onChange={handleChangeInputs} value={formData.stock} class="bg-green-600 p-0.5" name="stock" id="stock" type="number" max={99999} required />
                                        </div>
                                        <div class="my-1 flex flex-col">
                                            <label htmlFor="price">Precio</label>
                                            <input onChange={handleChangeInputs} value={formData.price} class="bg-green-600 p-0.5" name="price" id="price" type="text" max={99999} required />
                                        </div>
                                        <div class="my-1 flex flex-col">
                                            <label htmlFor="categoryId">Categoría</label>
                                            <select onChange={handleChangeSelects} onFocus={chargeCategories} onClick={chargeCategories} class="bg-green-600 p-0.5" name="categoryId" id="categoryId" required>
                                                <option>Sin categoría</option>
                                                {
                                                    (categoryData.length > 0) && (
                                                        categoryData.map((cat) => {
                                                            return (
                                                                <option key={`cat_opt_${cat.id}`} value={cat.id!}>{cat.name!}</option>
                                                            );
                                                        })
                                                    )
                                                }
                                            </select>
                                        </div>
                                    </div>
                                    <div class="mt-15 flex w-full justify-evenly">
                                        <button onClick={props.onClose}>Cancelar</button>
                                        <button type="submit">Guardar</button>
                                    </div>
                                </form>
                            </div>
                        </>
                    )
                }
                {
                    loadingProduct && (
                        <>
                            <div class="w-full h-full flex items-center justify-center text-4xl font-bold">
                                <h1>PROCESANDO...</h1>
                            </div>
                        </>
                    )
                }
            </div>
        </div>
    );
}

interface BaseModalProps {
    onClose: () => void,
    children?: ComponentChildren
    isOpen: boolean
}

export function BaseModal(props: BaseModalProps) {
    return (
        <div class="bg-gray-500/60 w-full h-full absolute left-0 top-0 flex justify-center items-center text-white">
            <div class="bg-black/70 p-7 rounded min-h-7/12 min-w-4/12">
                <div class="flex justify-end">
                    <button class="rounded-4xl border py-1 px-3 font-bold hover:cursor-pointer" onClick={props.onClose}>X</button>
                </div>
                <div>
                    {props.children}
                </div>
            </div>
        </div>
    );
}

interface AddCategoryModalProps extends BaseModalProps {
    title?: string
}

interface EditCategoryModalProps extends ModalProps {
    title?: string,
    category: CategoryDTO
}

interface DeleteCategoryModalProps extends ModalProps {
    title?: string,
    text?: string,
    category: CategoryDTO
}

export function EditCategoryModal(props: EditCategoryModalProps) {
    const { categories, categoryData, loadingCategory } = useInventoryDataContext();

    const modalRef = useRef<HTMLDivElement>(null);
    const previousFocusRef = useRef<HTMLElement | null>(null);

    // Guardar el elemento con foco antes de abrir el modal
    useEffect(() => {
        // Guardar estado original del scroll
        const originalOverflow = window.getComputedStyle(document.body).overflow;

        if (props.isOpen) {
            previousFocusRef.current = document.activeElement as HTMLElement;

            // Bloquear scroll
            document.body.style.overflow = 'hidden';

            // Autofocus en el modal
            if (modalRef.current) {
                modalRef.current.focus();
            }
        } else {
            // Restaurar scroll
            document.body.style.overflow = originalOverflow;

            // Devolver el foco al elemento anterior
            if (previousFocusRef.current) {
                previousFocusRef.current.focus();
            }
        }

        return () => {
            // Asegurarnos de que el scroll se restaure siempre
            document.body.style.overflow = originalOverflow;
        };
    }, [props.isOpen]);

    // Gestionar clicks fuera del modal
    useEffect(() => {
        const handleOutsideClick = (event: MouseEvent) => {
            if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
                props.onClose();
            }
        };

        if (props.isOpen) {
            document.addEventListener('mousedown', handleOutsideClick);
        }

        return () => {
            document.removeEventListener('mousedown', handleOutsideClick);
        };
    }, [props.isOpen, props.onClose]);

    // Capturar la tecla Escape para cerrar el modal
    useEffect(() => {
        const handleEscKey = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                props.onClose();
            }
        };

        if (props.isOpen) {
            document.addEventListener('keydown', handleEscKey);
        }

        return () => {
            document.removeEventListener('keydown', handleEscKey);
        };
    }, [props.isOpen, props.onClose]);


    const [formData, setFormData] = useState<CategoryDTOForm>({
        name: props.category.name as string
    });

    // Manejar cambios del Input
    const handleChangeInputs = (e: TargetedEvent<HTMLInputElement>) => {
        const target = e.target as HTMLInputElement;
        const { name, value } = target;

        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        console.log(formData);
    }

    const onSubmit = async (e: TargetedEvent<HTMLFormElement>) => {
        e.preventDefault();

        // Transformar
        const dto: CategoryDTO = {
            id: props.category.id,
            name: formData.name
        };

        try {
            await categories.update(dto);
        } catch (err) {
            return;
        }

        setFormData({
            name: ''
        });

        props.onClose();

        return;
    }

    if (!props.isOpen) return (<></>);

    return (
        <BaseModal {...props} >
            <div>
                <h1 class="text-center font-bold mt-4">{props.title || "Edit Action"}</h1>
                <form onSubmit={onSubmit}>
                    <div>
                        <div class="my-1 flex flex-col">
                            <label htmlFor="name">Nombre</label>
                            <input onChange={handleChangeInputs} class="bg-green-600 p-0.5" name="name" id="name" type="text" maxLength={40} value={formData.name} required />
                        </div>
                    </div>
                    <div class="mt-15 flex w-full justify-evenly">
                        <button onClick={props.onClose} type="button">Cancelar</button>
                        <button type="submit">Guardar</button>
                    </div>
                </form>
            </div>
        </BaseModal>
    );
}

export function AddCategoryModal(props: AddCategoryModalProps) {
    const {
        loadingCategory, categories
    } = useInventoryDataContext();

    const modalRef = useRef<HTMLDivElement>(null);
    const previousFocusRef = useRef<HTMLElement | null>(null);

    const [formData, setFormData] = useState<CategoryDTOForm>({
        name: ''
    });

    //const [submitting, setSubmitting] = useState<boolean>(false);
    //const [error, setError] = useState<string | null>(null);

    // Manejar cambios del Input
    const handleChangeInputs = (e: TargetedEvent<HTMLInputElement>) => {
        const target = e.target as HTMLInputElement;
        const { name, value } = target;

        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        console.log(formData);
    }

    /*const handleChangeSelects = (e:TargetedEvent<HTMLSelectElement>) => {
        const target = e.target as HTMLSelectElement;
        const { name, value  } = target;

        //console.log(target);

        setFormData(prev => ({
            ...prev,
            [name]: parseInt(value)
        }));

        console.log(parseInt(value));
        console.log(formData);
    }*/

    // Guardar el elemento con foco antes de abrir el modal
    useEffect(() => {
        // Guardar estado original del scroll
        const originalOverflow = window.getComputedStyle(document.body).overflow;

        if (props.isOpen) {
            previousFocusRef.current = document.activeElement as HTMLElement;

            // Bloquear scroll
            document.body.style.overflow = 'hidden';

            // Autofocus en el modal
            if (modalRef.current) {
                modalRef.current.focus();
            }
        } else {
            // Restaurar scroll
            document.body.style.overflow = originalOverflow;

            // Devolver el foco al elemento anterior
            if (previousFocusRef.current) {
                previousFocusRef.current.focus();
            }
        }

        return () => {
            // Asegurarnos de que el scroll se restaure siempre
            document.body.style.overflow = originalOverflow;
        };
        //document.body.style.overflow = '';
    }, [props.isOpen]);

    // Gestionar clicks fuera del modal
    useEffect(() => {
        const handleOutsideClick = (event: MouseEvent) => {
            if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
                props.onClose();
            }
        };

        if (props.isOpen) {
            document.addEventListener('mousedown', handleOutsideClick);
        }

        return () => {
            document.removeEventListener('mousedown', handleOutsideClick);
        };


    }, [props.isOpen, props.onClose]);

    // Capturar la tecla Escape para cerrar el modal
    useEffect(() => {
        const handleEscKey = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                props.onClose();
            }
        };

        if (props.isOpen) {
            document.addEventListener('keydown', handleEscKey);
        }

        return () => {
            document.removeEventListener('keydown', handleEscKey);
        };
    }, [props.isOpen, props.onClose]);

    // OnSubmit
    const onSubmit = async (e: TargetedEvent<HTMLFormElement>) => {
        e.preventDefault();

        // Transformar
        const dto: CategoryDTO = {
            id: null,
            name: formData.name
        };

        try {
            await categories.create(dto);
        } catch (err) {
            return;
        }

        setFormData({
            name: ''
        });

        props.onClose();

        return;
    }

    if (!props.isOpen) return (<></>);

    return (
        <div class="bg-gray-500/60 w-full h-full absolute left-0 top-0 flex justify-center items-center text-white">
            <div class="bg-black/70 p-7 rounded min-h-7/12 min-w-4/12">
                {
                    !loadingCategory &&
                    (
                        <>
                            <div class="flex justify-end">
                                <button class="rounded-4xl border py-1 px-3 font-bold hover:cursor-pointer" onClick={props.onClose}>X</button>
                            </div>
                            <div>
                                <BaseModal isOpen={props.isOpen} onClose={props.onClose}>
                                    <h1 class="text-center font-bold mt-4">{props.title || "Add Action"}</h1>
                                    <form onSubmit={onSubmit}>
                                        <div>
                                            <div class="my-1 flex flex-col">
                                                <label htmlFor="name">Nombre</label>
                                                <input onChange={handleChangeInputs} value={formData.name} class="bg-green-600 p-0.5" name="name" id="name" type="text" maxLength={40} required />
                                            </div>
                                        </div>
                                        <div class="mt-15 flex w-full justify-evenly">
                                            <button onClick={props.onClose}>Cancelar</button>
                                            <button type="submit">Guardar</button>
                                        </div>
                                    </form>
                                </BaseModal>
                            </div>
                        </>
                    )
                }
                {
                    loadingCategory && (
                        <>
                            <div class="w-full h-full flex items-center justify-center text-4xl font-bold">
                                <h1>PROCESANDO...</h1>
                            </div>
                        </>
                    )
                }
            </div>
        </div>
    );
}

export function DeleteCategoryModal(props: DeleteCategoryModalProps) {
    const { categories, loadingCategory, errorCategory } = useInventoryDataContext();

    const modalRef = useRef<HTMLDivElement>(null);
    const previousFocusRef = useRef<HTMLElement | null>(null);

    // Guardar el elemento con foco antes de abrir el modal
    useEffect(() => {
        // Guardar estado original del scroll
        const originalOverflow = window.getComputedStyle(document.body).overflow;

        if (props.isOpen) {
            previousFocusRef.current = document.activeElement as HTMLElement;

            // Bloquear scroll
            document.body.style.overflow = 'hidden';

            // Autofocus en el modal
            if (modalRef.current) {
                modalRef.current.focus();
            }
        } else {
            // Restaurar scroll
            document.body.style.overflow = originalOverflow;

            // Devolver el foco al elemento anterior
            if (previousFocusRef.current) {
                previousFocusRef.current.focus();
            }
        }

        return () => {
            // Asegurarnos de que el scroll se restaure siempre
            document.body.style.overflow = originalOverflow;
        };
        //document.body.style.overflow = '';
    }, [props.isOpen]);

    // Gestionar clicks fuera del modal
    useEffect(() => {
        const handleOutsideClick = (event: MouseEvent) => {
            if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
                props.onClose();
            }
        };

        if (props.isOpen) {
            document.addEventListener('mousedown', handleOutsideClick);
        }

        return () => {
            document.removeEventListener('mousedown', handleOutsideClick);
        };


    }, [props.isOpen, props.onClose]);

    // Capturar la tecla Escape para cerrar el modal
    useEffect(() => {
        const handleEscKey = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                props.onClose();
            }
        };

        if (props.isOpen) {
            document.addEventListener('keydown', handleEscKey);
        }

        return () => {
            document.removeEventListener('keydown', handleEscKey);
        };
    }, [props.isOpen, props.onClose]);

    if (!props.isOpen) return (<></>);

    const onSubmit = async (e: TargetedEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            await categories.delete(props.category.id!);
        } catch (err) {
            return;
        }

        props.onClose();

        return;
    }

    return (
        <BaseModal {...props}>
            <div>
                <h1 class="text-center font-bold mt-4">{props.title || "Delete Action"}</h1>
                <form onSubmit={onSubmit}>
                    <div class="mt-10">
                        <p class="text-center">{(props.text) ? props.text : `Are you sure to delete the product "${props.category.name}"?`}</p>
                    </div>
                    <div class="mt-15 flex w-full justify-evenly">
                        <button class="p-2 border rounded hover:cursor-pointer hover:bg-white hover:text-black" onClick={props.onClose} type="button">Cancelar</button>
                        <button class="p-2 border rounded hover:cursor-pointer hover:bg-red-600" type="submit">Eliminar</button>
                    </div>
                </form>
            </div>
        </BaseModal>
    );
}

export function ProcessCard() {

}

export function BlockedModal (props: BaseModalProps) {
    const modalRef = useRef<HTMLDivElement>(null);
    const previousFocusRef = useRef<HTMLElement | null>(null);

    // Guardar el elemento con foco antes de abrir el modal
    useEffect(() => {
        // Guardar estado original del scroll
        const originalOverflow = window.getComputedStyle(document.body).overflow;

        if (props.isOpen) {
            previousFocusRef.current = document.activeElement as HTMLElement;

            // Bloquear scroll
            document.body.style.overflow = 'hidden';

            // Autofocus en el modal
            if (modalRef.current) {
                modalRef.current.focus();
            }
        } else {
            // Restaurar scroll
            document.body.style.overflow = originalOverflow;

            // Devolver el foco al elemento anterior
            if (previousFocusRef.current) {
                previousFocusRef.current.focus();
            }
        }

        return () => {
            // Asegurarnos de que el scroll se restaure siempre
            document.body.style.overflow = originalOverflow;
        };
    }, [props.isOpen]);

    // Gestionar clicks fuera del modal
    useEffect(() => {
        const handleOutsideClick = (event: MouseEvent) => {
            if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
                props.onClose();
            }
        };

        if (props.isOpen) {
            document.addEventListener('mousedown', handleOutsideClick);
        }

        return () => {
            document.removeEventListener('mousedown', handleOutsideClick);
        };
    }, [props.isOpen, props.onClose]);

    // Capturar la tecla Escape para cerrar el modal
    useEffect(() => {
        const handleEscKey = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                props.onClose();
            }
        };

        if (props.isOpen) {
            document.addEventListener('keydown', handleEscKey);
        }

        return () => {
            document.removeEventListener('keydown', handleEscKey);
        };
    }, [props.isOpen, props.onClose]);

    return (
        <BaseModal {...props}>
            {props.children}
        </BaseModal>
    );
}


/*export const DelModalContextProvider = function ({children}: {children: ComponentChildren}) {
    console.log("PASS HERE");
    console.log("PASS HERE");
    console.log("PASS HERE");
    console.log("PASS HERE");
    console.log("PASS HERE");
    console.log("PASS HERE");
    console.log("PASS HERE");
    console.log("PASS HERE");
    console.log("PASS HERE");
    console.log("PASS HERE");

    const [funcOpenHandler, setFuncOpenHandler] = useState(() => () => console.log("Funciona handler one!"));
    const [funcCloseHandler, setFuncCloseHandler] = useState(() => () => console.log("Funciona handler two!"));
    const [updateFunctions, setUpdateFunction] = useState(false);

    function updateOpenHandlerFunc (func: () => void) {
        setFuncOpenHandler(() => func);
    }

    function updateCloseHandlerFunc (func: () => void) {
        setFuncCloseHandler(() => func);
    }

    const contextVal: ModalContext = {
        openHandler: funcOpenHandler,
        closeHandler: funcCloseHandler,
        updateOpenHandler: updateOpenHandlerFunc,
        updateCloseHandler: updateCloseHandlerFunc,
        wasUpdated: updateFunctions,
        setWasUpdated: setUpdateFunction
    }

    return (
        <DelModalContext.Provider value={contextVal}>
            {children}
        </DelModalContext.Provider>
    );
}

export const EditModalContextProvider = function ({children}: {children: ComponentChildren}) {
    console.log("PASS HERE");
    console.log("PASS HERE");
    console.log("PASS HERE");
    console.log("PASS HERE");
    console.log("PASS HERE");
    console.log("PASS HERE");
    console.log("PASS HERE");
    console.log("PASS HERE");
    console.log("PASS HERE");
    console.log("PASS HERE");

    const [funcOpenHandler, setFuncOpenHandler] = useState(() => () => console.log("Funciona handler one!"));
    const [funcCloseHandler, setFuncCloseHandler] = useState(() => () => console.log("Funciona handler two!"));
    const [updateFunctions, setUpdateFunction] = useState(false);

    function updateOpenHandlerFunc (func: () => void) {
        setFuncOpenHandler(() => func);
    }

    function updateCloseHandlerFunc (func: () => void) {
        setFuncCloseHandler(() => func);
    }

    const contextVal: ModalContext = {
        openHandler: funcOpenHandler,
        closeHandler: funcCloseHandler,
        updateOpenHandler: updateOpenHandlerFunc,
        updateCloseHandler: updateCloseHandlerFunc,
        wasUpdated: updateFunctions,
        setWasUpdated: setUpdateFunction
    }

    return (
        <EditModalContext.Provider value={contextVal}>
            {children}
        </EditModalContext.Provider>
    );
}

export const DualModalContextProvider = function ({children}: {children: ComponentChildren}) {
    return (
        <DelModalContextProvider>
            <EditModalContextProvider>
                {children}
            </EditModalContextProvider>
        </DelModalContextProvider>
    );
}*/