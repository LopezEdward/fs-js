import ModalSetup from "./ModalSetup";
import { DeleteProductModal, EditProductModal } from "./../Modal";
import { Context } from "./../ContextProvider";
import { useContext, useState } from "preact/hooks";
import type { ComponentChildren } from "preact";
 
interface BodyProps {
    children?: ComponentChildren
}

export const Body = function (props: BodyProps) {
    return (
        <div>
            <ModalSetup>
                {props.children}
            </ModalSetup>
        </div>
    );
}