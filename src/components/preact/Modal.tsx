import { useState } from "preact/hooks";
import type { Product } from "../../types";

interface DeleteProductModalProps {
    title?: string,
    text?: string
}

const [del_visible, del_setVisible] = useState(false);

export function openDelModal () {
    del_setVisible(true);
}

export function closeDelModal () {
    del_setVisible(false);
}

export function DeleteProductModal (props: DeleteProductModalProps) {
    return (
        <div>
            {
                (del_visible) && 
                <div>
                    <button onClick={closeDelModal}></button>
                    <div>
                        <h1>{props.title}</h1>
                        {
                            (props.text) && 
                                <p>{props.text}</p>
                        }
                        <div>
                            <button>Cancelar</button>
                            <button>Eliminar</button>
                        </div>
                    </div>
                </div>
            }
        </div>
    );
}


interface EditProductModalProps {
    title?: string,
    lastData: Product
}

const [edit_visible, edit_setVisible] = useState(false);

export function openEdModal () {
    edit_setVisible(true);
}

export function closeEdModal () {
    edit_setVisible(false);
}

export function EditProductModal (props: EditProductModalProps) {
    const [categories, setCategories] = useState(null);

    return (
        <div>
            {
                (edit_visible) && 
                <div>
                    <button onClick={closeEdModal}></button>
                    <div>
                        <h1>{props.title}</h1>
                        <form action="/api/v1/inventory/update">
                            <div>
                                <div>
                                    <label htmlFor="pro_name">Nombre</label>
                                    <input name="pro_name" id="pro_name" type="text" maxLength={64} value={props.lastData.name} required/>
                                </div>
                                <div>
                                    <label htmlFor="pro_cat">Categoría</label>
                                    <select name="pro_cat" id="pro_cat" required>
                                        <option>--CHARGUIN DATING</option>
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label htmlFor="pro_des">Descripción</label>
                                <input name="pro_des" id="pro_des" type="text" maxLength={500} />
                            </div>
                            <div>
                                <button>Cancelar</button>
                                <button>Guardar</button>
                            </div>
                        </form>
                    </div>
                </div>
            }
        </div>
    );
}
