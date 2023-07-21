const instance = axios.create({
    //baseURL: 'http://192.168.1.50:8000/',
    baseURL: 'http://localhost:8000/',

});
const input_pesquisa = document.getElementById('pesquisar-tabela');
const conteudo_tabela = document.getElementById('Sessions');
let resData;
let resComplex;
let resSessionsData;
let tamanho;
let TabExport = document.getElementById("div_tabExport");
//função para mostrar dados dos pacientes na tabela, com a função show
async function getData() {
    try {
        resData = await instance.get('session/filter/all')
        updateTable();
    }
    catch (error) {
        console.log(error);
    }
}
async function getDados(id) {
    resSessionsData = await instance.get('/session/filter/sessions_data/ids?id[0]=' + id);
    console.log(resSessionsData.data);
    getCsv();
}

function getCsv() {
    var inicio = new Date(resSessionsData.data[0].createdAt.substring(0, 19));
    var fim = new Date(resSessionsData.data[0].endAt.substring(0, 19));
    var diferenca = new Date(fim - inicio);
    var resultado = diferenca.getUTCMinutes() + "m ";
    resultado += diferenca.getUTCSeconds() + "s ";
    var InfoSessao = {
        Paciente: 'Paciente : ' + resSessionsData.data[0].patient[0].name,
        Task: 'Tarefa : ' + resSessionsData.data[0].task.name,
        Complexo: 'Complexo : ' + resSessionsData.data[0].complex.name,
        Description: 'Descricao : ' + resSessionsData.data[0].description,
        Data: 'Start: ' + resSessionsData.data[0].createdAt,
        TempoSessão: 'Tempo Sessao : ' + resultado
    }
    var itemsFormatted = [];
    resSessionsData.data[0].data_session[0].forEach((item) => {
        itemsFormatted.push({
            DataUpdated: item.updatedAt,
            Pitch: item.data.pitchRotation,
            Roll: item.data.rollRotation,
            Yaw: item.data.yawRotation,
            IndexMCU: item.data.indexMCU,
            tempBNO55: item.data.tempBNO55
        });
    });
    var headers = {
        updatedAt: 'UpdatedAt',
        Pitch: "Pitch: ",
        Roll: "Roll",
        Yaw: "Yaw",
        IndexMCU: "IndexMCU",
        tempBNO55: "tempBNO55"
    };

    var NomeFicheiro = 'dados_' + resSessionsData.data[0]._id; // or 'my-unique-title'
    exportCSVFile(headers, InfoSessao, itemsFormatted, NomeFicheiro);
}

input_pesquisa.addEventListener('keyup', () => {
    let coluna = document.getElementById('escolher-coluna').value;
    let expressao = input_pesquisa.value.toLowerCase();
    if (coluna === '') {
        coluna = 0;
    }
    tbody = conteudo_tabela.getElementsByTagName("tbody")[0];
    tr = tbody.getElementsByTagName("tr");
    for (i = 0; i < tr.length; i++) {
        td = tr[i].getElementsByTagName("td")[coluna].innerHTML.toLowerCase();
        td_sem_acentos = td.normalize("NFD").replace(/[^a-zA-Z\s]/g, "");
        if (true === td_sem_acentos.includes(expressao) || true === td.includes(expressao)) {
            tr[i].style.display = "";
        } else {
            tr[i].style.display = "none"
        }
    }
});
getData();

function sortTable(n) {
    var table, rows, switching, i, x, y, shouldSwitch, dir, switchcount = 0;
    table = document.getElementById("Sessions");
    switching = true;
    dir = "asc";
    while (switching) {
        switching = false;
        rows = table.rows;
        for (i = 1; i < (rows.length - 1); i++) {
            shouldSwitch = false;
            x = rows[i].getElementsByTagName("TD")[n];
            y = rows[i + 1].getElementsByTagName("TD")[n];
            if (dir == "asc") {
                if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
                    shouldSwitch = true;
                    break;
                }
            } else if (dir == "desc") {
                if (x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()) {
                    shouldSwitch = true;
                    break;
                }
            }
        }
        if (shouldSwitch) {
            rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
            switching = true;
            switchcount++;
        } else {
            if (switchcount == 0 && dir == "asc") {
                dir = "desc";
                switching = true;
            }
        }
    }
}
let idclicked;

function Mostrar_Infor(clicked_id) {
    //console.log(window.location.href);
    var url = window.location.href;
    var x = url.substring(0, url.lastIndexOf('/'));
    //console.log(x);
    var newUrl = x + "/InfoSessao.html?id=" + clicked_id;
    window.open(newUrl, '_self');
}

const pageSize = 10;
let currentPage = 0;

let i = 1;
let endIndex;
function updateTable() {
    const startIndex = currentPage * pageSize;
    endIndex = startIndex + pageSize;
    const pageData = resData.data.slice().reverse().slice(startIndex, endIndex);

    let tableHTML =
        `<thead class="table-primary table-bordered border-secondary" >
  <tr>
      <th>#</th>
      <th>Nº</th>
      <th onclick="sortTable(2)">Paciente</th>
      <th>Tarefa</th>
      <th>Dispositivo</th>
      <th onclick="sortTable(5)">Data</th>
      <th onclick="sortTable(6)">Hora Início</th>
      <th>Hora Fim</th>
      <th>Tempo Sessão </th>
      </tr>
      </thead>
<tbody>`;
    for (const item of pageData) {
        var inicio = new Date(item.createdAt.substring(0, 19));
        var fim = new Date(item.updatedAt.substring(0, 19));
        var diferenca = new Date(fim - inicio);
        var resultado = diferenca.getUTCMinutes() + "m ";
        resultado += diferenca.getUTCSeconds() + "s ";
        tableHTML += `<tr><td><input type="checkbox" name="${item.patient.name}" id="${i}" class="form-check-input marcar" value="${item._id}"></td>
    <td id="${item._id}" onclick="Mostrar_Infor(this.id)">${i++}</td>
    <td id="${item._id}" onclick="Mostrar_Infor(this.id)">${item.patient.name}</td>
    <td id="${item._id}" onclick="Mostrar_Infor(this.id)">${item.task.name}</td>
    <td id="${item._id}" onclick="Mostrar_Infor(this.id)">${item.device.description}</td>
    <td id="${item._id}" onclick="Mostrar_Infor(this.id)">${item.createdAt.substring(0, 10)}</td>
    <td id="${item._id}" onclick="Mostrar_Infor(this.id)">${item.createdAt.substring(11, 19)}</td>
    <td id="${item._id}" onclick="Mostrar_Infor(this.id)">${item.updatedAt.substring(11, 19)}</td>
    <td id="${item._id}" onclick="Mostrar_Infor(this.id)">${resultado}</td></tr>`;
    }
    i = 1;
    tableHTML += `</tbody>`;
    document.querySelector("#Sessions").innerHTML = tableHTML;

    const pageCount = Math.ceil(resData.data.length / pageSize);
    document.querySelector("#numeracao").innerHTML = `Page ${currentPage + 1} of ${pageCount}`;

    const prevButton = document.querySelector("#anterior");
    const nextButton = document.querySelector("#proximo");
    prevButton.disabled = currentPage === 0;
    nextButton.disabled = currentPage === pageCount - 1;
}

document.querySelector("#anterior").addEventListener("click", () => {
    if (currentPage > 0) {
        currentPage--;
        updateTable();
    }
});

document.querySelector("#proximo").addEventListener("click", () => {
    if (currentPage < Math.ceil(resData.data.length / pageSize) - 1) {
        currentPage++;
        i = endIndex + 1;
        updateTable();
    }
});

function desmarcarCheckboxs() {
    $('.marcar').each(function () {
        if (this.checked)
            $(this).attr("checked", false);
    });
}
$(document).ready(function () {
    $('.delete').on('click', function () {
        var checkboxes = document.querySelectorAll('input[type="checkbox"]:checked');
        console.log(checkboxes.length);
        if (checkboxes.length === 0) {
            $('#myModalElim').modal('show');
            $('.modal_body1').html('Selecione pelo menos uma Sessão para eliminar!');
        }
        else if (checkboxes.length === 1) {
            let str1 = "";
            console.log(checkboxes[0].value);
            for (var i = 0; i < resData.data.length; i++) {
                if (resData.data[i]._id === checkboxes[0].value) {
                    if (resData.data[i].patient.gender == "F") {
                        str1 += "Vai eliminar a Sessão da paciente: ";
                    } else {
                        str1 += "Vai eliminar a Sessão do paciente: ";
                    }
                }
            }
            $('#myModalElim').modal('show');
            str1 += `${checkboxes[0].name} <br>`;
            $('.modal_body1').html(str1);
        }
        else {
            let str1 = "Vai eliminar as Sessoes selecionadas dos Pacientes:  <br>";
            $('#myModalElim').modal('show');
            for (var i = 0; i < checkboxes.length; i++) {
                str1 += `${checkboxes[i].name},  <br>`;
            }
            $('.modal_body1').html(str1);
        }
    });
});
$(document).ready(function () {
    $('.eliminar').on('click', async function () {
        window.location.href = './TabelaSessoes.html';
    })
});
const deletePatient = async () => {
    var checkboxes = document.querySelectorAll('input[type="checkbox"]:checked');
    for (var i = 0; i < checkboxes.length; i++) {
        var id = checkboxes[i].value;
        try {
            const DeleteSession = await instance.delete('/session/delete', { data: { _id: id } }, { headers: { "Content-Type": "application/json" } });
            //console.log(x);
        } catch (error) {
            console.log(error);
        }
    }
    location.reload();
}
$(document).ready(function () {
    $('.exportDados').on('click', async function () {
        var checkboxes = document.querySelectorAll('input[type="checkbox"]:checked');
        console.log(checkboxes.length);
        if (checkboxes.length === 0) {
            $('#myModalInfoExpor').modal('show');
            $('.modal_body1Export').html('Selecione pelo menos uma Sessão para exportar os Dados!');
        }
        else {
            TabExport.style.display = 'block';
            let tab =
                `<thead class="table-primary table-bordered border-secondary" >
                <tr>
                    <th>#</th>
                    <th>Nome </th>
                    <th>Task</th>
                    <th>Dados</th>
                    <th>Relatorio</th>
                </tr>
            </thead>
            <tbody>`;
            let x = 1;
            for (var j = 0; j < checkboxes.length; j++) {
                for (var i = 0; i < resData.data.length; i++) {
                    if (resData.data[i]._id === checkboxes[j].value) {
                        tab += `<tr>
                            <td>${checkboxes[j].id}</td>
                            <td>${resData.data[i].patient.name}</td>
                            <td>${resData.data[i].task.name}</td>
                            <td id="${resData.data[i]._id}" onclick="getDados(this.id)"><img src="./css/icons/csv.png" class="rounded img-fluid imagemIcon"></img></td>
                            <td id="${resData.data[i]._id}"><img src="./css/icons/pdf.png" class="rounded img-fluid imagemIconPdf"></img></td>
                            </tr>`;
                    }
                }
            }
            tab += `</tbody>`;
            document.getElementById("TabExport").innerHTML = tab;
        }
    })
});

function convertToCSV(objArray) {
    var array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;

    var str = '';
    console.log(array);
    for (var i = 0; i < array.length; i++) {
        var line = '';
        for (var index in array[i]) {
            line += array[i][index] + ';;;';
        }
        line.slice(0, line.length - 1);

        str += line + '\r\n';
    }

    return str;
}

function exportCSVFile(headers, InfoSessao, items, NomeFicheiro) {
    if (headers) {
        items.unshift(headers);
    }
    items.unshift('');
    if (InfoSessao) {
        items.unshift(InfoSessao);
    }
    var jsonObject = JSON.stringify(items);
    var csv = this.convertToCSV(jsonObject);

    var NomeFicheiroExport = NomeFicheiro + '.csv' || 'export.csv';

    var blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    if (navigator.msSaveBlob) { // IE 10+
        navigator.msSaveBlob(blob, NomeFicheiroExport);
    } else {
        var link = document.createElement("a");
        if (link.download !== undefined) {
            var url = URL.createObjectURL(blob);
            link.setAttribute("href", url);
            link.setAttribute("download", NomeFicheiroExport);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    }
}


