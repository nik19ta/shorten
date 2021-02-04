let protocol = "http://";
let protocol_red = "https://";

async function check() {
    if (window.location.search.slice(1).split(',')[0].split('=')[0] == '') {
        create_form()
    } else {
        let response = await fetch('/check', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
            body: JSON.stringify({
                link: window.location.search.slice(1).split(',')[0].split('=')[0]
            })
        })

        let data = await response.json();

        if (data.data == null) {
            document.querySelector("#message").innerHTML = "Такой ссылки нет, или она удаленна :("
            document.querySelector("#to_home").innerHTML = "Создать ссылку"
        } else {
            if (data.data[0]['link'].indexOf('http') == 0) {
                location.replace(data.data[0]['link'])
            } else {
                location.replace(protocol_red + data.data[0]['link'])
            }
        }
    }
}


function create_form() {
    let home_content = document.querySelector('#home_content')

    let form = document.createElement('form');
    form.className = `form`;

    let link_input = document.createElement('input');
    link_input.className = `inp`;
    link_input.id = `link`;
    link_input.placeholder = `Ссылка`;


    let btn = document.createElement('button');
    btn.className = `btn`;
    btn.id = `btn_create_link`;
    btn.innerHTML = `Создать ссылку`;
    btn.onclick = create_link

    form.appendChild(link_input);
    form.appendChild(btn);
    home_content.appendChild(form);


    home_content.addEventListener("submit", create_link, true);
}

check()


async function create_link(event) {
    event.preventDefault();

    function isValidUrl(userInput) {
        let regexQuery = "^(https?://)?(www\\.)?([-a-z0-9]{1,63}\\.)*?[a-z0-9][-a-z0-9]{0,61}[a-z0-9]\\.[a-z]{2,6}(/[-\\w@\\+\\.~#\\?&/=%]*)?$";
        let url = new RegExp(regexQuery, "i");
        return url.test(userInput);
    }

    if (!isValidUrl(document.querySelector('#link').value)) {
        document.querySelector('#alert_message').innerHTML = "Некорректная ссылка"
        document.querySelector('#new_link').innerHTML = "";
    } else {
        let response = await fetch('/new', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
            body: JSON.stringify({
                link: document.querySelector('#link').value
            })
        })

        let data = await response.json();

        if (data.status == null) {
            alert('Error')
        } else if (data.status == "Ссылка не может быть пустой") {
            document.querySelector('#alert_message').innerHTML = "Ссылка не может быть пустой"
            document.querySelector('#new_link').innerHTML = "";
        } else if (data.status == 'ok') {
            document.querySelector('#alert_message').innerHTML = ""
            document.querySelector('#new_link').innerHTML = window.location.host + '/?' + data.shortlink;
            document.querySelector('#new_link').href = protocol + window.location.host + '/?' + data.shortlink;
        }

    }
}