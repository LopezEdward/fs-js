import Button from "./Button";
import type { Product } from "../../types";
import { useState } from "preact/hooks";

interface DataTableProps {
    headers: {label:string, entityProp: string}[],
    data: Product[]
}

export function ProductDataTable (props: DataTableProps) {
    const [data, setData] = useState(props.data);

    function remove_product (ev:MouseEvent) {
        const elem = ev.target as HTMLElement;
        const elemId = elem.parentNode!.parentNode!.firstChild!.firstChild! as HTMLInputElement;
        const idVal = elemId.value;
        
        console.log(elem);
        console.log(idVal);
    }
    
    const catId: string = "categoryId";

    //console.log(props.actions.edit);

    return (
        <table class="m-4 table border">
            <tbody>
                <tr>
                    {props.headers.map(({label}) => {
                        return (
                            <th class="table-cell border p-1" key={label}>{label}</th>
                        );
                    })}
                    <th class="table-cell border p-1" key="col_actions" colSpan={2}>Acciones</th>
                </tr>
                {
                    props.data.map((product) => {
                        return (
                            <tr>
                                <td class="hidden"><input type="number" value={product.id} hidden={true}/></td>
                                {
                                    props.headers.map(({entityProp}) => {
                                        let val = product[entityProp as keyof Product];
                                        val = (val === null || val === undefined) ? "vacío" : val;

                                        return (
                                            <td class="table-cell border p-1" key={product.id + "_" + entityProp}>{val}</td>
                                        );
                                    })
                                }
                                
                                    <td key={"col_" + product.id + "_edit_actions"} class="p-1 table-cell border hover:font-bold">
                                        <button key={product.id + "_edit"} onClick={remove_product}>Editar</button>
                                    </td>
                                    <td class="p-1 table-cell border" key={"col_" + product.id + "_remove_actions"}>
                                        <button key={product.id + "_remove"} onClick={remove_product}>Eliminar</button>
                                    </td>
                                
                            </tr>
                        );
                    })
                }
            </tbody>
        </table>
    );
}