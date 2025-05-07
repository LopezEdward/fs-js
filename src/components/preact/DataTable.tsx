import Button from "./Button";
import type { Product } from "../../types";

interface DataTableProps {
    headers: {label:string, entityProp: string}[],
    data: Product[],
    actions: {
        edit?: (ev:MouseEvent) => any,
        remove?: (ev:MouseEvent) => any
    }
}

export function ProductDataTable (props: DataTableProps) {
    return (
        <table>
            <tbody>
                <tr>
                    {props.headers.map(({label}) => {
                        return (
                            <th key={label}>{label}</th>
                        );
                    })}
                    <th key="col_actions" colSpan={2}>Acciones</th>
                </tr>
                {
                    props.data.map((product) => {
                        return (
                            <tr>
                                {
                                    props.headers.map(({entityProp}) => {
                                        return (
                                            <td key={product.id + "_" + entityProp}>{product[entityProp as keyof Product]}</td>
                                        );
                                    })
                                }
                                {
                                    (props.actions.edit) &&
                                    <td key={"col_" + product.id + "_edit_actions"}><button key={product.id + "_edit"} onClick={props.actions.edit}>Editar</button></td>
                                }
                                {
                                    (props.actions.remove) &&
                                    <td key={"col_" + product.id + "_remove_actions"}><button key={product.id + "_remove"} onClick={props.actions.remove}>Eliminar</button></td>
                                }
                            </tr>
                        );
                    })
                }
            </tbody>
        </table>
    );
}