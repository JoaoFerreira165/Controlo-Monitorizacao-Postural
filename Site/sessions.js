const instance = axios.create({
    // baseURL: 'http://192.168.1.101:8000/',
    baseURL: 'http://localhost:8000/',

});
let resData;
let sendSession, stopSession;
let Idcomplexo;
let UnfinishedSessions;
let ioClient;
let CriarSessao;
let dadosDisp;
let dataRoll, dataPitchRoll, dataPitch, dataYaw;
let optionsPitch, optionsRoll, optionsPitchRoll, optionsYaw;
let dados = [];
let mostrar = [];

let count = 0;
let intervalId;
let valores = [];

let chart;
let i = 0;

let mediaPitch = 0, mediaRoll = 0, mediayaw = 0, desvioPadraoPitch = 0, desvioPadraoRoll = 0, desvioPadraoYaw = 0;
let valorpitch = 0, valorroll = 0, valoryaw = 0;
let maior = 0, menor = 0, maiorRoll = 0, menorRoll = 0, maioryaw = 0, menoryaw = 0;
document.ge
let tabs = document.getElementById("tabelasDados");
let grafDados = document.getElementById("grafDados");

let infos = document.getElementById("borda");
let infos1 = document.getElementById("borda1");

let mostrarInfos = document.getElementById("mostrarInfos");
let resDispositivo;
async function getDispositivo() {
    try {
        resDispositivo = await instance.get('/device/readall');
        console.log(resDispositivo)
        Idcomplexo = resDispositivo.data.devices[0].complex;
        Socket();
        const selectDispositivo = document.getElementById('mostrar-dispositivos')
        for (let p in resDispositivo.data.devices) {
            const opt = document.createElement('option')
            opt.value = resDispositivo.data.devices[p]._id;
            opt.innerHTML = resDispositivo.data.devices[p].description;
            selectDispositivo.appendChild(opt);
        }
    } catch (error) {
        console.error(error);
    }
}
async function getSessionsUnfinished() {
    UnfinishedSessions = await instance.get('/session/filter/unfinished');
    if (UnfinishedSessions.data.length === 1) {
        document.querySelector('#stop').disabled = false;
        document.getElementById("informacoes").innerHTML = "Tem uma sessão por terminar!";
        $(document).ready(function () {
            $('.stop').on('click', function () {
                Parar();
                document.getElementById("informacoes").innerHTML = "";
                Graficosdefault();
                location.reload(true);
            })
        });
    }
}
getSessionsUnfinished();
getDispositivo();
let last;

const chartPitch = document.getElementById('chartPitch');

var chartPitchjs = new Chart(chartPitch, {
    type: 'line',
    data: {
        labels: [],
        datasets: [{
            label: 'Pitch',
            backgroundColor: 'rgb(141, 191, 255)',
            borderColor: 'rgb(141, 191, 255)',
            data: []
        }]
    },
    options: {
        scales: {
            x: {
                time: {
                    unit: 'second',
                    displayFormats: {
                        second: 'mm:ss'
                    }
                }
            },
            y: {
                type: 'linear',
            }
        }
    }
});

const chartRoll = document.getElementById('chartRoll');

var chartRolljs = new Chart(chartRoll, {
    type: 'line',
    data: {
        labels: [],
        datasets: [{
            label: 'Roll',
            backgroundColor: 'rgb(141, 191, 255)',
            borderColor: 'rgb(141, 191, 255)',
            data: []
        }]
    },
    options: {
        scales: {
            x: {
                time: {
                    unit: 'second',
                    displayFormats: {
                        second: 'mm:ss'
                    }
                }
            },
            y: {
                type: 'linear',
            }
        }
    }
});

const chartYaw = document.getElementById('chartYaw');

var chartYawjs = new Chart(chartYaw, {
    type: 'line',
    data: {
        labels: [],
        datasets: [{
            label: 'Yaw',
            backgroundColor: 'rgb(141, 191, 255)',
            borderColor: 'rgb(141, 191, 255)',
            data: []
        }]
    },
    options: {
        scales: {
            x: {
                time: {
                    unit: 'second',
                    displayFormats: {
                        second: 'mm:ss'
                    }
                }
            },
            y: {
                type: 'linear',
            }
        }
    }
});
function Socket() {
    ioClient = io.connect("http://localhost:8000/", { query: 'complex_id=' + Idcomplexo });
    // Waiting response for connection
    ioClient.on("connection", (data, code) => {
        if (code == 200) {
            console.log("Cliente -> " + data);
            // Create Session
            ioClient.on("start_session", (msg) => {
                CriarSessao = JSON.parse(msg);
                //console.log(CriarSessao);
            });
            ioClient.on("dataSession_ToUser", (msg) => {
                dadosDisp = JSON.parse(msg);
                dados.push(dadosDisp);
                mostrar.push(dadosDisp);

                if (i == 35) {
                    i--;
                    mostrar.shift();
                    dataPitchRoll = new google.visualization.DataTable();
                    dataPitchRoll.addColumn('number', 'Roll');
                    dataPitchRoll.addColumn('number', 'Pitch and Roll');
                    dataPitchRoll.addColumn({ type: 'string', role: 'style' });
                }
                i++;
                for (let i = 0; i < mostrar.length - 1; i++) {
                    dataPitchRoll.addRow([mostrar[i].data.rollRotation, mostrar[i].data.pitchRotation, 'color: #6495ED']);
                }
                if (i != 1) {
                    dataPitchRoll.addRow([dadosDisp.data.rollRotation, dadosDisp.data.pitchRotation, 'color: red']);
                }

                const lastFive = dados.slice(-5);
                ShowData(lastFive);

                var inicio = new Date(CriarSessao.createdAt);
                var fim = new Date(dadosDisp.createdAt);
                var diferenca = new Date(fim - inicio);

                chartPitchjs.data.labels.push(diferenca.getMinutes() + ":" + diferenca.getSeconds() + "s");
                chartPitchjs.data.datasets[0].data.push(dadosDisp.data.pitchRotation);

                chartRolljs.data.labels.push(diferenca.getMinutes() + ":" + diferenca.getSeconds() + "s");
                chartRolljs.data.datasets[0].data.push(dadosDisp.data.rollRotation);

                chartYawjs.data.labels.push(diferenca.getMinutes() + ":" + diferenca.getSeconds() + "s");
                chartYawjs.data.datasets[0].data.push(dadosDisp.data.yawRotation);

                function resize() {
                    chartPitchjs.update();
                    chartRolljs.update();
                    chartYawjs.update();
                    var chart = new google.visualization.ScatterChart(document.getElementById('div_dispersaoChart'));
                    chart.draw(dataPitchRoll, optionsPitchRoll);
                }
                window.onload = resize();
                window.onresize = resize;
            });
            // Stop Session
            ioClient.on("stop_session", (msg) => console.info("Cliente -> " + msg));
        }
        else {
            console.log(data);
        }
    });
}
let resTarefas;
async function getTarefas() {
    try {
        resTarefas = await instance.get('/task/readall');
        const selecttarefas = document.getElementById('mostrar-tarefas')
        for (let p in resTarefas.data.tasks) {
            const opt = document.createElement('option');
            opt.value = resTarefas.data.tasks[p]._id;
            opt.innerHTML = resTarefas.data.tasks[p].name;
            selecttarefas.appendChild(opt);
        }
    } catch (error) {
        console.error(error);
    }
}
getTarefas();

async function autocomplete(inp) {
    try {
        resData = await instance.get('patient/readAll');
    } catch (error) {
        console.error(error);
    }
    var currentFocus;
    var nomes_pacientes = [];
    var id_pacientes = [];
    for (let p in resData.data.patients) {
        nomes_pacientes.push(resData.data.patients[p].name);
        id_pacientes.push(resData.data.patients[p]._id);
    }
    inp.addEventListener("input", function (e) {
        var a, b, i, val = this.value;
        closeAllLists();
        if (!val) { return false; }
        currentFocus = -1;
        a = document.createElement("DIV");
        a.setAttribute("id", this.id + "autocomplete-list");
        a.setAttribute("class", "autocomplete-items");
        this.parentNode.appendChild(a);
        for (i = 0; i < nomes_pacientes.length; i++) {
            var x = 0;
            if (nomes_pacientes[i].substr(0, val.length).toUpperCase().normalize("NFD").replace(/[^a-zA-Z\s]/g, "") == val.toUpperCase().normalize("NFD").replace(/[^a-zA-Z\s]/g, "")) {
                b = document.createElement("DIV");
                b.innerHTML = "<strong>" + nomes_pacientes[i].substr(0, val.length) + "</strong>";
                b.innerHTML += nomes_pacientes[i].substr(val.length);
                b.innerHTML += "<input type='hidden' name='" + nomes_pacientes[i] + "' value=" + id_pacientes[i] + "    >";
                x = i;
                b.addEventListener("click", function (e) {
                    inp.value = this.getElementsByTagName("input")[0].name;
                    closeAllLists();
                });
                a.appendChild(b);
            }
        }
    });
    inp.addEventListener("keydown", function (e) {
        var x = document.getElementById(this.id + "autocomplete-list");
        if (x) x = x.getElementsByTagName("div");
        if (e.keyCode == 40) {
            currentFocus++;
            addActive(x);
        } else if (e.keyCode == 38) { //up
            currentFocus--;
            addActive(x);
        } else if (e.keyCode == 13) {
            e.preventDefault();
            if (currentFocus > -1) {
                if (x) x[currentFocus].click();
            }
        }
    });
    function addActive(x) {
        if (!x) return false;
        removeActive(x);
        if (currentFocus >= x.length) currentFocus = 0;
        if (currentFocus < 0) currentFocus = (x.length - 1);
        x[currentFocus].classList.add("autocomplete-active");
    }
    function removeActive(x) {
        for (var i = 0; i < x.length; i++) {
            x[i].classList.remove("autocomplete-active");
        }
    }
    function closeAllLists(elmnt) {
        var x = document.getElementsByClassName("autocomplete-items");
        for (var i = 0; i < x.length; i++) {
            if (elmnt != x[i] && elmnt != inp) {
                x[i].parentNode.removeChild(x[i]);
            }
        }
    }
    document.addEventListener("click", function (e) {
        closeAllLists(e.target);
    });
}
autocomplete(document.getElementById("nome-paciente"));
//tabelas finais
var medpitch = document.getElementById("medpitch");
var medroll = document.getElementById("medroll");
var medyaw = document.getElementById("medyaw");
var dpitch = document.getElementById("dpitch");
var droll = document.getElementById("droll");
var dyaw = document.getElementById("dyaw");
var maxpitch = document.getElementById("maxpitch");
var maxroll = document.getElementById("maxroll");
var maxyaw = document.getElementById("maxyaw");
var minpitch = document.getElementById("minpitch");
var minroll = document.getElementById("minroll");
var minyaw = document.getElementById("minyaw");
var ampitch = document.getElementById("ampitch");
var amproll = document.getElementById("amproll");
var ampyaw = document.getElementById("ampyaw");
var medp = document.getElementById("medp");
var medr = document.getElementById("medr");
var dp = document.getElementById("dp");
var dr = document.getElementById("dr");
var maxp = document.getElementById("maxp");
var maxr = document.getElementById("maxr");
var minp = document.getElementById("minp");
var minr = document.getElementById("minr");
var amp = document.getElementById("amp");
var ampr = document.getElementById("ampr");

//tabela dos dados instantâneos 
var hora1 = document.getElementById("hora1");
var pitch1 = document.getElementById("pitch1");
var roll1 = document.getElementById("roll1");
var yaw1 = document.getElementById("yaw1");
var hora2 = document.getElementById("hora2");
var pitch2 = document.getElementById("pitch2");
var roll2 = document.getElementById("roll2");
var yaw2 = document.getElementById("yaw2");
var hora3 = document.getElementById("hora3");
var pitch3 = document.getElementById("pitch3");
var roll3 = document.getElementById("roll3");
var yaw3 = document.getElementById("yaw3");
var hora4 = document.getElementById("hora4");
var pitch4 = document.getElementById("pitch4");
var roll4 = document.getElementById("roll4");
var yaw5 = document.getElementById("yaw5");
var hora5 = document.getElementById("hora5");
var pitch5 = document.getElementById("pitch5");
var roll5 = document.getElementById("roll5");
var yaw5 = document.getElementById("yaw5");

function CalHora(atual) {
    var comeco = new Date(CriarSessao.createdAt.substring(0, 19));
    var fim = new Date(atual.createdAt.substring(0, 19));
    var diferenca = new Date(fim - comeco);
    if (diferenca.getUTCMinutes() == 0) {
        var resultado = diferenca.getUTCSeconds() + "s ";
    }
    else {
        resultado = diferenca.getUTCMinutes() + "m ";
        resultado += diferenca.getUTCSeconds() + "s ";
    }
    return resultado;
}
function ShowData(lastFive) {
    if (lastFive.length < 2) {
        hora1.innerHTML = CalHora(lastFive[0]);
        pitch1.innerHTML = lastFive[0].data.pitchRotation;
        roll1.innerHTML = lastFive[0].data.rollRotation;
        yaw1.innerHTML = lastFive[0].data.yawRotation;
    }
    else if (lastFive.length < 3) {
        hora1.innerHTML = CalHora(lastFive[0]);
        pitch1.innerHTML = lastFive[0].data.pitchRotation;
        roll1.innerHTML = lastFive[0].data.rollRotation;
        yaw1.innerHTML = lastFive[0].data.yawRotation;

        hora2.innerHTML = CalHora(lastFive[1]);
        pitch2.innerHTML = lastFive[1].data.pitchRotation;
        roll2.innerHTML = lastFive[1].data.rollRotation;
        yaw2.innerHTML = lastFive[1].data.yawRotation;

    }
    else if (lastFive.length < 4) {
        hora1.innerHTML = CalHora(lastFive[0]);
        pitch1.innerHTML = lastFive[0].data.pitchRotation;
        roll1.innerHTML = lastFive[0].data.rollRotation;
        yaw1.innerHTML = lastFive[0].data.yawRotation;

        hora2.innerHTML = CalHora(lastFive[1]);
        pitch2.innerHTML = lastFive[1].data.pitchRotation;
        roll2.innerHTML = lastFive[1].data.rollRotation;
        yaw2.innerHTML = lastFive[1].data.yawRotation;

        hora3.innerHTML = CalHora(lastFive[2]);
        pitch3.innerHTML = lastFive[2].data.pitchRotation;
        roll3.innerHTML = lastFive[2].data.rollRotation;
        yaw3.innerHTML = lastFive[2].data.yawRotation;

    }
    else if (lastFive.length < 5) {
        hora1.innerHTML = CalHora(lastFive[0]);
        pitch1.innerHTML = lastFive[0].data.pitchRotation;
        roll1.innerHTML = lastFive[0].data.rollRotation;
        yaw1.innerHTML = lastFive[0].data.yawRotation;

        hora2.innerHTML = CalHora(lastFive[1]);
        pitch2.innerHTML = lastFive[1].data.pitchRotation;
        roll2.innerHTML = lastFive[1].data.rollRotation;
        yaw2.innerHTML = lastFive[1].data.yawRotation;

        hora3.innerHTML = CalHora(lastFive[2]);
        pitch3.innerHTML = lastFive[2].data.pitchRotation;
        roll3.innerHTML = lastFive[2].data.rollRotation;
        yaw3.innerHTML = lastFive[2].data.yawRotation;

        hora4.innerHTML = CalHora(lastFive[3]);
        pitch4.innerHTML = lastFive[3].data.pitchRotation;
        roll4.innerHTML = lastFive[3].data.rollRotation;
        yaw4.innerHTML = lastFive[3].data.yawRotation;
    }
    else {
        hora1.innerHTML = CalHora(lastFive[0]);
        pitch1.innerHTML = lastFive[0].data.pitchRotation;
        roll1.innerHTML = lastFive[0].data.rollRotation;
        yaw1.innerHTML = lastFive[0].data.yawRotation;

        hora2.innerHTML = CalHora(lastFive[1]);
        pitch2.innerHTML = lastFive[1].data.pitchRotation;
        roll2.innerHTML = lastFive[1].data.rollRotation;
        yaw2.innerHTML = lastFive[1].data.yawRotation;

        hora3.innerHTML = CalHora(lastFive[2]);
        pitch3.innerHTML = lastFive[2].data.pitchRotation;
        roll3.innerHTML = lastFive[2].data.rollRotation;
        yaw3.innerHTML = lastFive[2].data.yawRotation;

        hora4.innerHTML = CalHora(lastFive[3]);
        pitch4.innerHTML = lastFive[3].data.pitchRotation;
        roll4.innerHTML = lastFive[3].data.rollRotation;
        yaw4.innerHTML = lastFive[3].data.yawRotation;

        hora5.innerHTML = CalHora(lastFive[4]);
        pitch5.innerHTML = lastFive[4].data.pitchRotation;
        roll5.innerHTML = lastFive[4].data.rollRotation;
        yaw5.innerHTML = lastFive[4].data.yawRotation;
    }
} function Tables() {
    maior = 0, menor = 0;
    maiorRoll = 0, menorRoll = 0;
    tabs.style.display = "none";
    grafDados.style.display = "block";
}
function clearTables() {
    dados.length = 0;
    mostrar.length = 0;
    dataPitchRoll = new google.visualization.DataTable();
    dataPitchRoll.addColumn('number', 'Roll');
    dataPitchRoll.addColumn('number', 'Pitch and Roll');
    dataPitchRoll.addColumn({ type: 'string', role: 'style' });

    //dados da tabela Pitch
    medpitch.innerHTML = "";
    dpitch.innerHTML = "";
    maxpitch.innerHTML = "";
    minpitch.innerHTML = "";
    ampitch.innerHTML = "";

    //dados da tabela Roll
    medroll.innerHTML = "";
    droll.innerHTML = "";
    maxroll.innerHTML = "";
    minroll.innerHTML = "";
    amproll.innerHTML = "";

    //dados da tabela yaw
    medyaw.innerHTML = "";
    dyaw.innerHTML = "";
    maxyaw.innerHTML = "";
    minyaw.innerHTML = "";
    ampyaw.innerHTML = "";

}
optionsPitchRoll = {
    width: 540,
    height: 400,
    hAxis: {
        title: 'Rotação no Plano Frontal  (graus)',
        titleTextStyle: {
            fontSize: 13,
            bold: 'true'
        },
    },
    vAxis: {
        title: 'Rotação no Plano Sagital  (graus)',
        titleTextStyle: {
            fontSize: 13,
            bold: 'true'
        },
    },
    legend: {
        position: 'top',
        textStyle: {
            fontSize: 15,
            bold: 'true'
        }
    },
    colors: ['#6495ED'],
    explorer: {
        keepInBounds: true,
        maxZoomIn: 4.0,
    }
};
function Graficosdefault() {
    var optionsPitchRollDefault = {
        width: 540,
        height: 400,
        hAxis: {
            title: 'Rotação  (graus)',
            titleTextStyle: {
                fontSize: 13,
                bold: 'true'
            },
            viewWindow: {
                max: 100,
                min: -100
            }
        },
        vAxis: {
            title: 'Rotação  (graus)',
            titleTextStyle: {
                fontSize: 13,
                bold: 'true'
            },
            viewWindow: {
                max: 100,
                min: -100
            },
        },
        legend: {
            position: 'top',
            textStyle: {
                fontSize: 15,
                bold: 'true'
            }
        },
        colors: ['#6495ED'],
        crosshair: {
            focused: {
                color: 'black',
                opacity: 1
            },
            trigger: 'both'
        },
        explorer: {
            keepInBounds: true,
            maxZoomIn: 4.0,
        }
    };
    google.charts.load("current", { packages: ["corechart"] });
    google.charts.setOnLoadCallback(drawCharts);
    function drawCharts() {
        var chart = new google.visualization.ScatterChart(document.getElementById('div_dispersaoChart'));
        var data = new google.visualization.DataTable();
        data.addColumn('number');
        data.addColumn('number', 'Roll and Pitch');
        chart.draw(data, optionsPitchRollDefault);
    }
    chartPitchjs.data.labels = [];
    chartPitchjs.data.datasets.forEach(function (dataset) {
        dataset.data = [];
    });
    chartPitchjs.update();

    chartRolljs.data.labels = [];
    chartRolljs.data.datasets.forEach(function (dataset) {
        dataset.data = [];
    });
    chartRolljs.update();

    chartYawjs.data.labels = [];
    chartYawjs.data.datasets.forEach(function (dataset) {
        dataset.data = [];
    });
    chartYawjs.update();
    $(document).ready(function () {
        $(window).resize(function () {
            drawCharts();
        });
    });
}
Graficosdefault();
let nometarefa;
let nomedispositivo;
$(document).ready(function () {
    $('.enviar').on('click', async function () {
        count = 0
        resData = await instance.get('patient/readAll');
        const nome = document.getElementById("nome-paciente").value;
        const tarefa = document.getElementById('mostrar-tarefas').value;
        const dispositivo = document.getElementById('mostrar-dispositivos').value;
        let descricao = document.getElementById('descricao').value;
        var x = 0;
        for (let p in resData.data.patients) {
            if (resData.data.patients[p].name == nome) {
                x++;
                var id = resData.data.patients[p]._id;
                var id_complexo = resData.data.patients[p].complex._id;
            }
        }
        for (let p in resTarefas.data.tasks) {
            if (resTarefas.data.tasks[p]._id == tarefa) {
                nometarefa = resTarefas.data.tasks[p].name;
            }

        }
        for (let p in resDispositivo.data.devices) {
            if (resDispositivo.data.devices[p]._id == dispositivo) {
                nomedispositivo = resDispositivo.data.devices[p].description;
            }
        }
        if (x == 0) {
            $('#myModalAlert').modal('show');
            $('.modal_bodyAlert').html('Paciente invalido!');
            return false;
        }
        else if (id_complexo != Idcomplexo) {
            document.getElementById("informacoes").innerHTML = "O paciente não pertence a este complexo!";
            return false;
        }
        else if (tarefa === '') {
            $('#myModalAlert').modal('show');
            $('.modal_bodyAlert').html('Não selecionou nenhuma tarefa!');
            return false;
        }
        else if (dispositivo === '') {
            $('#myModalAlert').modal('show');
            $('.modal_bodyAlert').html('Não selecionou nenhum Dispositivo!');
            return false;
        }
        else if (UnfinishedSessions.data.length == 1) {
            $('#myModalAlert').modal('show');
            $('.modal_bodyAlert').html('Tem uma sessão por terminar!');
            document.querySelector('#parar').disabled = false;
            return false;
        }
        else {
            ioClient.emit('start_session', `{ "patient": "${id}", "task":  "${tarefa}", "device":  "${dispositivo}", "complex":"${Idcomplexo}","description": "${descricao}" }`);
            if (descricao.length == 0) {
                descricao = "Não tem nenhuma descrição para esta sessão"
            }
            document.getElementById("infosPaciente").innerHTML = `<strong> Nome: </strong> ${nome}   &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;     <strong> Tarefa: </strong>${nometarefa}     &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;     <strong> Dispositivo: </strong> ${nomedispositivo}  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <strong> Descrição: </strong> ${descricao}`;
            dados.length = 0;
            google.charts.load('current', { 'packages': ['corechart'] });
            google.charts.setOnLoadCallback(drawCharts);
            function drawCharts() {
                dataPitchRoll = new google.visualization.DataTable();
                dataPitchRoll.addColumn('number', 'Roll');
                dataPitchRoll.addColumn('number', 'Pitch and Roll');
                dataPitchRoll.addColumn({ type: 'string', role: 'style' });
            }
            intervalId = setInterval(function () {
                count++;
                const minutes = Math.floor(count / 60);
                const seconds = count % 60;
                document.querySelector('#time').innerHTML = `${minutes} m : ${seconds} s`;
            }, 1000);
            Graficosdefault();
            clearTables();
            setTimeout(function () {
                if (CriarSessao.message === "There are sessions running") {
                    document.getElementById("informacoes").innerHTML = "Tem outra sessão a decorrer em outra página";
                    Graficosdefault();
                    clearTables();
                    document.querySelector('#parar').disabled = false;
                    return false;
                }
                if (CriarSessao.message === "Device is not found as observer") {
                    document.getElementById("informacoes").innerHTML = "Não se conseguiu conectar ao Dispositivo";
                    count = 0;
                    return false;
                }
                if (CriarSessao.message === "Device complex or pacient complex does not match with declared complex in the request") {
                    document.getElementById("informacoes").innerHTML = "Selecionou o dispositivo errado";
                    return false;
                }
                Tables();
                infos.style.display = "none";
                infos1.style.display = "none";

                mostrarInfos.style.display = "block";
                i = 0;
                valorpitch = 0, valorroll = 0, maior = 0, menor, maiorRoll = 0, menorRoll = 0, desvioPadraoPitch = 0, desvioPadraoRoll = 0;
                valoryaw = 0, maioryaw = 0, menoryaw = 0, desvioPadraoYaw = 0;
                document.getElementById("informacoes").innerHTML = "";

                document.getElementById('nome-paciente').setAttribute('readonly', true);
                $('#mostrar-tarefas').prop("disabled", true);
                $('#mostrar-dispositivos').prop("disabled", true);
                document.getElementById('descricao').setAttribute('readonly', true);
                document.querySelector('#enviar').disabled = true;
                document.querySelector('#clear').disabled = true;
                document.querySelector('#stop').disabled = false;
            }, 750);
        }
    })
});
$(document).ready(function () {
    $('.stop').on('click', async function () {
        ioClient.emit('stop_session', `{ "sessionId": "${CriarSessao._id}","complexId": "${CriarSessao.complex}", "deviceId": "${CriarSessao.device}"} `);
    })
});
async function Parar() {
    var data = {
        sessionId: UnfinishedSessions.data[0]._id,
        complexId: UnfinishedSessions.data[0].complex,
        deviceId: UnfinishedSessions.data[0].device
    }
    const resStop = await instance.post('session/update/endAt', JSON.stringify(data), { headers: { "Content-Type": "application/json" } });
}
$(document).ready(function () {
    $('.parar').on('click', function () {
        document.location.reload(true);
    })
});
$(document).ready(function () {
    $('.stop').on('click', function () {
        infos.style.display = "block";
        infos1.style.display = "block";
        clearInterval(intervalId);
        count = 0;
        mostrarInfos.style.display = "none";

        setTimeout(function () {
            for (let i = 0; i < dados.length - 1; i++) {
                dataPitchRoll.addRow([dados[i].data.rollRotation, dados[i].data.pitchRotation, 'color: #6495ED']);
            }
            dataPitchRoll.addRow([dados[dados.length - 1].data.rollRotation, dados[dados.length - 1].data.pitchRotation, 'color: red']);
            var chart = new google.visualization.ScatterChart(document.getElementById('div_dispersaoChart'));
            chart.draw(dataPitchRoll, optionsPitchRoll);

            for (var i = 0; i < dados.length; i++) {
                valorpitch += dados[i].data.pitchRotation;
                valorroll += dados[i].data.rollRotation;
                valoryaw += dados[i].data.yawRotation;
                maior = Math.max(maior, dados[i].data.pitchRotation);
                menor = Math.min(menor, dados[i].data.pitchRotation);
                maiorRoll = Math.max(maiorRoll, dados[i].data.rollRotation);
                menorRoll = Math.min(menorRoll, dados[i].data.rollRotation);
                maioryaw = Math.max(maioryaw, dados[i].data.yawRotation);
                menoryaw = Math.min(menoryaw, dados[i].data.yawRotation);
            }
            mediaPitch = valorpitch / dados.length;
            mediaRoll = valorroll / dados.length;
            mediayaw = valoryaw / dados.length;
            let pitchval = 0;
            let rollval = 0;
            let yawval = 0;

            for (var i = 0; i < dados.length; i++) {
                pitchval += (dados[i].data.pitchRotation - mediaPitch) ** 2;
                rollval += (dados[i].data.rollRotation - mediaRoll) ** 2;
                yawval += (dados[i].data.yawRotation - mediayaw) ** 2;

            }
            desvioPadraoPitch = Math.sqrt((pitchval / dados.length));
            desvioPadraoRoll = Math.sqrt((rollval / dados.length));
            desvioPadraoYaw = Math.sqrt((yawval / dados.length));

            document.querySelector('#enviar').disabled = false;
            document.querySelector('#clear').disabled = false;
            document.querySelector('#stop').disabled = true;
            document.getElementById('nome-paciente').removeAttribute('readonly');
            $('#mostrar-tarefas').prop("disabled", false);
            $('#mostrar-dispositivos').prop("disabled", false);
            document.getElementById('descricao').removeAttribute('readonly');

            //dados da tabela Pitch
            medpitch.innerHTML = mediaPitch.toFixed(3);
            dpitch.innerHTML = desvioPadraoPitch.toFixed(3);
            maxpitch.innerHTML = maior;
            minpitch.innerHTML = menor;
            ampitch.innerHTML = maior - menor;

            //dados da tabela Roll
            medroll.innerHTML = mediaRoll.toFixed(3);
            droll.innerHTML = desvioPadraoRoll.toFixed(3);
            maxroll.innerHTML = maiorRoll;
            minroll.innerHTML = menorRoll;
            amproll.innerHTML = maiorRoll - menorRoll;

            //dados da tabela yaw
            medyaw.innerHTML = mediayaw.toFixed(3);
            dyaw.innerHTML = desvioPadraoYaw.toFixed(3);
            maxyaw.innerHTML = maioryaw;
            minyaw.innerHTML = menoryaw;
            ampyaw.innerHTML = maioryaw - menoryaw;

            dados.length = 0;
            mediaPitch = 0, mediaRoll = 0, mediayaw = 0, desvioPadraoPitch = 0, desvioPadraoRoll = 0, desvioPadraoYaw = 0, maior = 0, menor = 0, maiorRoll = 0, menorRoll = 0, maioryaw = 0, menoryaw = 0;
            tabs.style.display = "";
            tabs.style.display = "block";
            grafDados.style.display = "none";
        }, 750);
    })
});
async function AvisarPac(link) {
    resSessions = await instance.get('/session/filter/unfinished');
    if (resSessions.data.length == 1) {
        $('#myModalAlert').modal('show');
        $('.modal_bodyAlert').html('Tem de parar a sessão atual para poder mudar de pagina!');
        return false;
    }
    else {
        let x = './' + link;
        location.replace(x);
    }
}

$(window).on('mouseover', (function () {
    window.onbeforeunload = null;
}));
$(window).on('mouseout', (function () {
    window.onbeforeunload = ConfirmLeave;
}));
function ConfirmLeave() {
    return "Tem a certeza?";
}
var prevKey = "";
$(document).keydown(function (e) {
    if (e.key == "F5") {
        window.onbeforeunload = ConfirmLeave;
    }
    else if (e.key.toUpperCase() == "W" && prevKey == "CONTROL") {
        window.onbeforeunload = ConfirmLeave;
    }
    else if (e.key.toUpperCase() == "R" && prevKey == "CONTROL") {
        window.onbeforeunload = ConfirmLeave;
    }
    else if (e.key.toUpperCase() == "F4" && (prevKey == "ALT" || prevKey == "CONTROL")) {
        window.onbeforeunload = ConfirmLeave;
    }
    prevKey = e.key.toUpperCase();
});
