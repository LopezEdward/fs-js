import type { ComponentChildren } from "preact";
import { ModalActionContextProvider } from "../ContextProvider";
import { DeleteProductModal, EditProductModal } from "./../Modal";

interface CompBodyProps {
    children?: ComponentChildren
}

export default function ModalSetup (props: CompBodyProps) {
    return (
        <ModalActionContextProvider>
            {props.children}
        </ModalActionContextProvider>
    );
}