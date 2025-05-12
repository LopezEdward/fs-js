interface HeaderProps {
    title?: string
}

export default function Header (props: HeaderProps) {
    return (
        <header class="flex">
            <div class="flex-col justify-items-center items-center size-24 ml-6 mr-6">
                <h1>{props.title || ""}</h1>
            </div>
            <div class="">
                <nav class="w-full h-full">
                    <ul class="w-full h-full flex justify-evenly">
                        <li class="flex w-fit justify-center items-center ml-1 mr-1 p-4"><a class="link-lm-color" href="/">Home</a></li>
                        <li class="flex w-fit justify-center items-center ml-1 mr-1 p-4"><a class="link-lm-color" href="/sell">Sell</a></li>
                        <li class="flex w-fit justify-center items-center ml-1 mr-1 p-4"><a class="link-lm-color" href="/inventory">Inventory</a></li>
                        <li class="flex w-fit justify-center items-center ml-1 mr-1 p-4"><a class="link-lm-color" href="/about">About</a></li>
                        <li class="flex w-fit justify-center items-center ml-1 mr-1 p-4"><a class="link-lm-color" href="/account">Account</a></li>
                    </ul>
                </nav>
            </div>
        </header>
    );   
}