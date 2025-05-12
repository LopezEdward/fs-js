import { BoucherDataProvider, InventoryDataProvider } from "../ContextProvider";
import { BoucherPanel, SellPanel } from "../Panel";
import { Body } from "./Body";

interface SellViewProps {
    sellPanelTitle?: string,
    boucherPanelTitle?: string
}

export default function SellView (props: SellViewProps) {
    return (
        <Body>
            <InventoryDataProvider>
                <div class="rounded border m-2 flex h-full">
                    <BoucherDataProvider>
                        <SellPanel />
                        <BoucherPanel />
                    </BoucherDataProvider>
                </div>
            </InventoryDataProvider>
        </Body>
    );
}