import type { ComponentChildren } from "preact";
import { GridProductTableComponent } from "./DataTable";
import { useBoucherDataContext, type BouchureSelectProduct } from "./ContextProvider";
import { roundToPrecision } from "more-rounding";
import { useState } from "preact/hooks";
import { BlockedModal } from "./Modal";
import type { TargetedEvent } from "preact/compat";
import type { BoucherType, BoucherDTO, BoucherDetailDTO } from "../../lib/remote/types";
import { type SellDTOForm } from "../../types";

interface PanelProps {
    title?: string,
    children?: ComponentChildren
}

export function SellPanel (props: PanelProps) {
    return (
        <div class="p-2 w-full mx-2">
            <div class="bg-amber-300 p-2 rounded-t-lg border border-b-0">
                <h1 class="text-center font-bold">{(props.title) ? props.title : "Products"}</h1>
            </div>
            <div class="h-5/12">
                <GridProductTableComponent />
            </div>
        </div>
    );
}

export function BoucherPanel (props: PanelProps) {
    const { cleanBouchure, selectedProducts } = useBoucherDataContext();

    const [ creatingSell, setCreatingSell ] = useState<boolean>(false);
    const [ isOpen, setIsOpen] = useState<boolean>(false);
    const [formData, setFormData] = useState<SellDTOForm | null>(null);

    const showModal = () => {
        setIsOpen(true);
    }

    const hiddenModal = () => {
        setIsOpen(false);
    }

    const onSubmit = async (ev: TargetedEvent<HTMLFormElement>) => {
        ev.preventDefault();
    }

    return (
        <div class="p-2 w-4/12 mx-2 h-full">
            <div class="bg-amber-500 p-2 rounded-t-lg border">
                <h1 class="text-center font-bold">{(props.title) ? props.title : "Ticket"}</h1>
            </div>
            <div class="h-9/12 border border-t-0 border-b-0">
                <PrettyListProductComponent/>
            </div>
            <div class="w-full flex items-center justify-evenly">
                <button disabled={(selectedProducts.length !== 0) ? false : true} class="enabled:hover:cursor-pointer enabled:hover:bg-amber-400 disabled:hover:cursor-not-allowed font-bold border border-r-0 p-1 w-full" type="submit" onClick={showModal}>Crear venta</button>
                <button class="hover:cursor-pointer hover:bg-amber-400 font-bold border p-1 w-full" type="button" onClick={cleanBouchure}>Restablecer</button>
            </div>
            {
                isOpen && (
                    <BlockedModal isOpen={isOpen} onClose={hiddenModal}>
                        <div>
                            <div>
                                <h1 class="text-center font-bold text-2xl">Crear Venta</h1>
                            </div>
                            <form onSubmit={onSubmit}>
                                <div class="grid grid-cols-1 grid-rows-2 gap-y-5">
                                    <div>
                                        <div>
                                            <h2>Tipo de Documento</h2>
                                        </div>
                                        <div>
                                            <input class="mr-2" type="radio" name="bou_type" id="bou_bol" value="BOLETA" />
                                            <label htmlFor="bou_bol">Boleta</label>
                                        </div>
                                        <div>
                                            <input class="mr-2" type="radio" name="bou_type" id="bou_fac" value="FACTURA"/>
                                            <label htmlFor="bou_fac">Factura</label>
                                        </div>
                                    </div>
                                    <div>
                                        <label htmlFor="bou_doc">Número de Documento</label>
                                        <input class="block w-full bg-green-700 text-white p-1" type="text" name="bou_doc" id="bou_doc"/>
                                    </div>
                                </div>
                                <div class="flex items-center justify-evenly w-full mt-15">
                                    <button type="button" onClick={hiddenModal}>Cancelar</button>
                                    <button type="submit">Proceder</button>
                                </div>
                            </form>
                        </div>
                    </BlockedModal>
                )
            }
        </div>
    );
}

export function PrettyListProductComponent () {
    const { selectedProducts } = useBoucherDataContext();

    function totalMount (products: BouchureSelectProduct[]) {
        let final: number = 0;

        selectedProducts.forEach((val) => {
            final += roundToPrecision(val.price * val.quantity);
        });

        return final;
    }

    function getIGV (mount: number) {
        return roundToPrecision(mount * 0.18, 2);
    }

    const fl = totalMount(selectedProducts);
    const igv = getIGV(fl);
    const total = roundToPrecision(fl + igv, 2);

    return (
        <div class="h-full text-sm">
            {
                selectedProducts.length === 0 && (
                    <>
                        <h1 class="p-5 text-lg font-bold text-pretty">No hay productos en el ticket. Agregalos presionando los productos del panel izquierdo.</h1>
                    </>
                )
            }
            {
                selectedProducts.length > 0 && (
                    <>
                    <div class="flex flex-col h-fit max-h-48 overflow-y-auto">
                        {
                            selectedProducts.map((product) => {
                                return (
                                    <div class="mx-2">
                                        <span class="mr-1">x{product.quantity}</span>
                                        <span class="w-max-9/12 wrap-break-word text-wrap">{product.pro_name}</span>
                                        <span class="float-right">S/ {roundToPrecision(product.price * product.quantity, 2)}</span>
                                    </div>
                                );
                            })
                        }
                    </div>
                    <div class="border border-l-0 border-r-0 border-b-0">
                        <div class="flex justify-around">
                            <span class="justify-self-start">Monto final:</span>
                            <span class="justify-self-end">{fl}</span>
                        </div>
                        <div class="flex justify-around">
                            <span class="justify-self-start">IGV (18%):</span>
                            <span class="justify-self-end">{igv}</span>
                        </div>
                        <div class="flex justify-around">
                            <span class="justify-self-start">Total a pagar:</span>
                            <span class="justify-self-end">{total}</span>
                        </div>
                    </div>
                    </>
                )
            }
        </div>
    );
}