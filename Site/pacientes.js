const instance = axios.create({
    // baseURL: 'http://192.168.1.101:8000/',
    baseURL: 'http://localhost:8000/',

});
const enviar = document.getElementById('enviar');
const input_pesquisa = document.getElementById('pesquisar-tabela');
const conteudo_tabela = document.getElementById('patients');
let resData;
let resComplex;
//função para mostrar dados dos pacientes na tabela, com a função show
async function getData() {
    try {
        resData = await instance.get('patient/readall')
        show(resData.data.patients);
    }
    catch (error) {
        console.log(error);
        document.getElementById("infos").innerHTML = "Erro no servidor!";
    }
}
function show(data) {
    if (data.length == 0) {
        document.getElementById("infos").innerHTML = "Não tem nenhum paciente criado até ao momento.";
        return false;
    }
    let tab =
        `<thead class="table-primary table-bordered border-secondary" >
            <tr>
                <th>#</th>
                <th onclick="sortTable(1)">Nome <span style="float:right; margin-top:3px;"><iconify-icon icon="bi:arrow-down-circle-fill" rotate="180deg" flip="vertical"></iconify-icon></span></th>
                <th>Género</th>
                <th>Distrito</th>
                <th>Complexo</th>
            </tr>
        </thead>
    <tbody>`;
    for (let p of data) {
        tab +=
            `<tr> 
            <td><input type="checkbox" name="${p.name}" genero="${p.gender}" id="checkbox" class="form-check-input marcar" value="${p._id}"></td>
            <td id="${p._id}" onclick="Mostrar_Infor(this.id)">${p.name}</td>
            <td id="${p._id}" onclick="Mostrar_Infor(this.id)">${p.gender}</td>
            <td id="${p._id}" onclick="Mostrar_Infor(this.id)">${p.complex.district}</td> 
            <td id="${p._id}" onclick="Mostrar_Infor(this.id)">${p.complex.name}</td>
        </tr>`;
    }
    tab += `</tbody>`;
    document.getElementById("patients").innerHTML = tab;
}
//Mostrar os complexos existentes quando esta a editar um paciente ou a adicionar.
async function getComplex() {
    try {
        resComplex = await instance.get('/complex/readall')
        //console.log(resComplex.data);
        const selectElimi = document.getElementById('complexo-post')
        for (let p in resComplex.data) {
            const opt = document.createElement('option');
            opt.value = resComplex.data[p]._id;
            opt.innerHTML = resComplex.data[p].name;
            //console.log(opt.innerHTML + " id: " + opt.value);
            selectElimi.appendChild(opt);
        }
        const selectEdit = document.getElementById('complexo-edit')
        for (let p in resComplex.data) {
            const opt1 = document.createElement('option');
            opt1.value = resComplex.data[p]._id;
            opt1.innerHTML = resComplex.data[p].name;
            //console.log(opt1.innerHTML + " id: " + opt1.value);
            selectEdit.appendChild(opt1);
        }
    } catch (error) {
        console.log(error);
    }
}
//mostra os pacientes nos selects para eliminar ou editar
function getPacients() {
    const selectpacientDelete = document.getElementById('pacienteElim')
    for (let p in resData.data.patients) {
        //console.log(resPacients.data.patients[p].name);
        //console.log(resPacients.data.patients[p]._id);
        const opt1 = document.createElement('option');
        opt1.value = resData.data.patients[p]._id;
        opt1.innerHTML = resData.data.patients[p].name;
        selectpacientDelete.appendChild(opt1);
    }
    const selectpacientEdit = document.getElementById('pacienteEdit')
    for (let p in resData.data.patients) {
        const opt1 = document.createElement('option');
        opt1.value = resData.data.patients[p]._id;
        opt1.innerHTML = resData.data.patients[p].name;
        selectpacientEdit.appendChild(opt1);
    }
}
//pesquisa na tabela, pela string passada, percorre esta função sempre que adicionar um letra('keyup')
input_pesquisa.addEventListener('keyup', () => {
    let expressao = input_pesquisa.value.toLowerCase();
    if (expressao.length === 1) {
        return;
    }
    tbody = conteudo_tabela.getElementsByTagName("tbody")[0];
    tr = tbody.getElementsByTagName("tr");
    for (i = 0; i < tr.length; i++) {
        td = tr[i].getElementsByTagName("td")[0].innerHTML.toLowerCase();
        td_sem_acentos = td.normalize("NFD").replace(/[^a-zA-Z\s]/g, "");
        if (true === td_sem_acentos.includes(expressao) || true === td.includes(expressao)) {
            tr[i].style.display = "";
        } else {
            tr[i].style.display = "none"
        }
    }
});
getData();
getComplex();
//função para criar novo paciente
const postData = async (e) => {
    const nome = document.getElementById("nome-post").value;
    const genero = document.getElementById("genero-post").value;
    const id = document.getElementById("complexo-post").value;
    const comentarios = document.getElementById("comentario-post").value;
    const data = {
        name: nome,
        gender: genero,
        comments: comentarios,
        complex: id
    };
    try {
        const x = await instance.post('patient/create', JSON.stringify(data), { headers: { "Content-Type": "application/json" } });
        console.log(x)
        getData();
        $('#myModal').modal('hide');
    }
    catch (error) {
        console.log(error.response.data);
    }
}
enviar.addEventListener('click', postData);
//função para eliminar um paciente
const deletePatient = async () => {
    var checkboxes = document.querySelectorAll('input[type="checkbox"]:checked');
    for (var i = 0; i < checkboxes.length; i++) {
        var id = checkboxes[i].value;
        try {
            const x = await instance.delete('patient/delete', { data: { id: id } }, { headers: { "Content-Type": "application/json" } });
            //console.log(x);
        } catch (error) {
            console.log(error);
        }
    }
    location.reload();
}
//função para editar um paciente
const Editpatient = async (e) => {
    var checkboxes = document.querySelectorAll('input[type="checkbox"]:checked');
    for (var i = 0; i < checkboxes.length; i++) {
        var id = checkboxes[i].value;
    }
    const nome = document.getElementById("nome-edit").value;
    const genero = document.getElementById("genero-edit").value;
    const id_complexo = document.getElementById("complexo-edit").value;
    const comentarios = document.getElementById("comentario-edit").value;
    const data = {
        id: id,
        name: nome,
        gender: genero,
        comments: comentarios,
        complex: id_complexo
    };
    try {
        const x = await instance.post('patient/update', JSON.stringify(data), { headers: { "Content-Type": "application/json" } });
    }
    catch (error) {
        console.log(error.response.data);
    }
}
editar.addEventListener('click', Editpatient);
//abrir modal de editar
$(document).ready(function () {
    $('.editbtn').on('click', function () {

        var checkboxes = document.querySelectorAll('input[type="checkbox"]:checked');
        console.log(checkboxes.length);

        if (checkboxes.length === 1) {
            for (var i = 0; i < checkboxes.length; i++) {
                var id = checkboxes[i].value;
            }
            for (let p in resData.data.patients) {
                if (resData.data.patients[p]._id === id) {
                    var nome = resData.data.patients[p].name;
                    var genero = resData.data.patients[p].gender;
                    var comentario = resData.data.patients[p].comments;
                    var complexo = resData.data.patients[p].complex._id;
                }
            }
            $('#editmodal').modal('show');
            $('#nome-edit').val(nome);
            $('#genero-edit').val(genero);
            $('#complexo-edit').val(complexo);
            $('#comentario-edit').val(comentario);
        }
        else if (checkboxes.length === 0) {
            $('#myModalAlert').modal('show');
            $('.modal_bodyAlert').html('Selecione pelo menos um Paciente para editar...');
        }
        else {
            $('#myModalAlert').modal('show');
            $('.modal_bodyAlert').html('Só pode selecionar um Paciente para editar...');
        }
    });
});
//abrir modal de delete
$(document).ready(function () {
    $('.delete').on('click', function () {
        var checkboxes = document.querySelectorAll('input[type="checkbox"]:checked');
        //console.log(checkboxes.length);
        if (checkboxes.length === 0) {
            $('#myModalAlert').modal('show');
            $('.modal_bodyAlert').html('Selecione pelo menos um Paciente para eliminar!');
        }
        else if (checkboxes.length === 1) {
            let str1 = "";
            console.log(resData.data.patients.length);
            for (var i = 0; i < resData.data.patients.length; i++) {
                if (resData.data.patients[i].name === checkboxes[0].name) {
                    if (resData.data.patients[i].gender == "F") {
                        str1 += "Vai eliminar a paciente: ";
                    } else {
                        str1 += "Vai eliminar o paciente: ";
                    }
                }
            }
            $('#myModalElim').modal('show');
            str1 += `${checkboxes[0].name} <br>`;
            str1 += " e todas as suas sessões.";
            $('.modal_body1').html(str1);
        }
        else {
            let str1 = "Vai eliminar os/as pacientes:  <br>";
            $('#myModalElim').modal('show');
            for (var i = 0; i < checkboxes.length; i++) {
                str1 += `${checkboxes[i].name},  <br>`;
            }
            str1 += " e todas as suas sessões.";
            $('.modal_body1').html(str1);
        }
    });
});
//abrir modal de informações
$(document).ready(function () {
    $('.infobtn').on('click', function () {
        var checkboxes = document.querySelectorAll('input[type="checkbox"]:checked');
        if (checkboxes.length === 1) {
            var id = checkboxes[0].value;
            for (let p in resData.data.patients) {
                if (resData.data.patients[p]._id === id) {
                    var nome = resData.data.patients[p].name;
                    var genero = resData.data.patients[p].gender;
                    var comentario = resData.data.patients[p].comments;
                    var complexoNome = resData.data.patients[p].complex.name;
                    var complexoNumero = resData.data.patients[p].complex.contactNumbers;
                    var complexoEmail = resData.data.patients[p].complex.email;
                }
            }
            let strNome = "";
            for (var i = 0; i < checkboxes.length; i++) {
                console.log(checkboxes[i].value);
                strNome += `Mais informações de  ${checkboxes[i].name}`;
            }
            $('#myModalInfos').modal('show');
            $('.modal_title').html(strNome);
            $('#nome').val(nome);
            $('#genero').val(genero);
            $('#complexoNome').val(complexoNome);
            $('#complexoEmail').val(complexoEmail[0]);
            $('#complexoNumero').val(complexoNumero[0]);
            $('#comentario').val(comentario);
        }
        else if (checkboxes.length === 0) {
            $('#myModalAlert').modal('show');
            $('.modal_bodyAlert').html('Selecione um Paciente para ver as informações...');
        }
        else {
            $('#myModalAlert').modal('show');
            $('.modal_bodyAlert').html('Só pode selecionar um Paciente para ver as informações...');
        }
    });
});
//desmarcar checkedboxes depois de fechar algum modal
function desmarcarCheckboxs() {
    $('.marcar').each(function () {
        if (this.checked)
            $(this).attr("checked", false);
    });
}
function Mostrar_Infor(clicked_id) {
    for (let p in resData.data.patients) {
        if (resData.data.patients[p]._id === clicked_id) {
            var nome = resData.data.patients[p].name;
            var genero = resData.data.patients[p].gender;
            var comentario = resData.data.patients[p].comments;
            var complexoNome = resData.data.patients[p].complex.name;
            var complexoNumero = resData.data.patients[p].complex.contactNumbers;
            var complexoEmail = resData.data.patients[p].complex.email;
        }
    }
    $('#myModalInfos').modal('show');
    let strNome = `Mais informações de ` + nome;
    $('#myModalInfos').modal('show');
    $('.modal_title').html(strNome);
    $('#nome').val(nome);
    $('#genero').val(genero);
    $('#complexoNome').val(complexoNome);
    $('#complexoEmail').val(complexoEmail[0]);
    $('#complexoNumero').val(complexoNumero[0]);
    $('#comentario').val(comentario);
}
function sortTable(n) {
    var table, rows, switching, i, x, y, shouldSwitch, dir, switchcount = 0;
    table = document.getElementById("patients");
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