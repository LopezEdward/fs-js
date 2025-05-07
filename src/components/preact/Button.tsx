interface ButtonProps {
    label: string,
    action: (ev: MouseEvent) => any
}

export default function Button (props: ButtonProps) {
    return (
        <div>
            <button type="button" onClick={props.action}>{props.label}</button>
        </div>
    );
}