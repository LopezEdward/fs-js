import Button from "./Button";

interface SearcherProps {
    searchAction: () => any
}

export default function Searcher (props: SearcherProps) {
    return (
        <div>
            <div>
                <input type="text" placeholder="Busqueda..." />
                <Button label="Buscar" />
            </div>
        </div>
    );
}