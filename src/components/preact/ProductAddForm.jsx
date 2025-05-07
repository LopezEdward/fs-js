export default function ProductAddForm () {
    return (
        <form action="/api/v1/inventory/product/add">
            <div>
                <label htmlFor="pro-name">Nombre</label>
                <input id="pro-name" name="pro-name" type="text" placeholder="Nombre del producto..." maxLength={64} required={true}/>
            </div>
            <div>
                <label htmlFor="pro-description">Descripción</label>
                <input id="pro-description" name="pro-description" placeholder="Descripción" type="text" maxLength={500}/>
            </div>
            <div>
                <label htmlFor="pro-stock">Stock</label>
                <input id="pro-stock" name="pro-stock" type="number" placeholder="Stock" max="9999" value="0" />
            </div>
            <div>
                <input type="submit" onClick={submit_data} >Subir</input>
                <button type="reset" >Reiniciar</button>
            </div>
        </form>
    );
}

function submit_data (e) {
    e.preventDefault();
    console.log(e); return;

    e.preventDefault();

    const target = e.target.form;
    const url = target.action;
    const data = scrap_data(target);

    console.log(data);
        
    fetch(url, {
        method: "POST",
        body: data
    }).then((res) => {
        if (res.ok) {
            alert("The data is aggred correctly!");
        }
    }).catch((err) => {
        console.log(err);

        alert("Some error occurred!");
    })


    console.log(e);
}

function scrap_data (form) {
    const obj = {};

    for (let item of form.elements) {
        if (item.nodeName !== "INPUT") {
            continue;
        }

        obj[item.name] = item.value;
    }

    return obj;
}