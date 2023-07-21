const instance = axios.create({
    //baseURL: 'http://192.168.1.50:8000/',
    baseURL: 'http://localhost:8000/',

});
let resComplex;
let resPatients;
let resSessions;
let infos = document.getElementById("infos");
let complexo = document.getElementById("complexo");

async function getComplex() {
    try {
        resComplex = await instance.get('/complex/readall');
        document.getElementById("ComplexName").innerHTML = resComplex.data[0].name;
    } catch (error) {
        console.error(error);
        document.getElementById("infos").innerHTML = "Erro no servidor!";
    }
}

async function getPatients() {
    try {
        resPatients = await instance.get('/patient/readAll');
        document.getElementById("NumPatients").innerHTML = resPatients.data.patients.length;
    } catch (error) {
        console.error(error);
    }
}
async function getSessions() {
    try {
        $(".preload").fadeOut(1000);
        var pag = document.getElementById("index");
        resSessions = await instance.get('/session/filter/all');
        GraficoSessoes();
        $(".content").fadeIn(1000);
        pag.style.display = "block";
        document.getElementById("NumSessions").innerHTML = resSessions.data.length;
    } catch (error) {
        console.error(error);
    }
}
getComplex();
let optionsColumnSessions = {
    height: 300,
    hAxis: {
        title: 'Dia',
        titleTextStyle: {
            fontSize: 13,
            bold: 'true'
        },
        format: 'dd MMM',
    },
    vAxis: {
        title: 'Nº de Sessões',
        titleTextStyle: {
            fontSize: 13,
            bold: 'true'
        },
    },
    bar: {
        groupWidth: "50%"
    },
    legend: {
        position: "none"
    },
};
let optionsColumnPac = {
    height: 300,
    hAxis: {
        titleTextStyle: {
            fontSize: 13,
            bold: 'true'
        },
    },
    vAxis: {
        title: 'Nº de Sessões',
        titleTextStyle: {
            fontSize: 13,
            bold: 'true'
        },
    },
    bar: {
        groupWidth: "10%"
    },
    legend: {
        position: "none"
    },
};
let optionsPizzaTasks = {
    legend: {
        position: 'bottom',
    },
    'width': 'auto', 'height': 'auto',
    is3D: true,
}
getSessions();
getPatients();
function GraficoSessoes() {
    let M = 0, F = 0, Q = 0;
    for (let i = 0; i < resPatients.data.patients.length; i++) {
        if (resPatients.data.patients[i].gender === 'F') {
            F++;
        }
        else if (resPatients.data.patients[i].gender === 'M') {
            M++;
        }
        else {
            Q++;
        }
    }
    document.getElementById('masculino').innerHTML = M;
    document.getElementById('feminino').innerHTML = F;

    const monthNames = ["Jan", "Fev", "Mar", "Abr", "Maio", "Jun", "Jul", "Agost", "Set", "Out", "Nov", "Dez"];

    google.charts.load("current", { 'packages': ["corechart"] });
    google.charts.load('current', { 'packages': ['bar'] });

    google.charts.setOnLoadCallback(drawCharts);
    function drawCharts() {
        var dataColumn = new google.visualization.DataTable();
        dataColumn.addColumn('date', 'Time of Day');
        dataColumn.addColumn('number', 'Número de Sessões');

        //dataColumn.addRows([[new Date('2023-01-28'), 5]]);
        var dataColumnPacientes = new google.visualization.DataTable();
        dataColumnPacientes.addColumn('string', 'Paciente');
        dataColumnPacientes.addColumn('number', 'Número de Sessões');

        let Conta = {};
        let ContaPac = {};

        resSessions.data.forEach(function (session) {
            let dataS = new Date(session.updatedAt);
            let day = dataS.toDateString();
            if (Conta[day]) {
                Conta[day]++;
            } else {
                Conta[day] = 1;
            }
            let nome = session.patient.name;
            if (ContaPac[nome]) {
                ContaPac[nome]++;
            }
            else {
                ContaPac[nome] = 1;
            }
        });
        for (let day in Conta) {
            let dataFinal = new Date(day);
            dataColumn.addRows([[new Date(dataFinal.getFullYear(), dataFinal.getMonth(), dataFinal.getDate()), Conta[day]]]);
        }
        for (let nome in ContaPac) {
            dataColumnPacientes.addRows([[nome, ContaPac[nome]]]);
        }

        let tarefa1 = 0, tarefa2 = 0, tarefa3 = 0;

        data = new Date(resSessions.data[resSessions.data.length - 1].updatedAt);
        document.getElementById('dateLastSession').innerHTML = data.getDate() + " - " + monthNames[data.getMonth()] + "-" + data.getFullYear();
        let mediaTempo = 0;
        for (var i = 0; i < resSessions.data.length; i++) {
            if (resSessions.data[i].task.name == 'Tarefa 1.1') {
                tarefa1++;
            }
            else if (resSessions.data[i].task.name == 'Tarefa 1.2') {
                tarefa2++;
            }
            else {
                tarefa3++;
            }
            var inicio = new Date(resSessions.data[i].createdAt);
            var fim = new Date(resSessions.data[i].updatedAt);
            var diferenca = new Date(fim - inicio);
            if (diferenca.getUTCMinutes() == 0) {
                mediaTempo += diferenca.getUTCSeconds();
            }
            else {
                mediaTempo += diferenca.getUTCMinutes() * 60 + diferenca.getUTCSeconds();
            }
        }
        var media = Math.round(mediaTempo / resSessions.data.length);
        if (media > 60) {
            var x = media - 60;
            document.getElementById('MedTime').innerHTML = '1 m ' + x + ' s';
        }
        else {
            document.getElementById('MedTime').innerHTML = media + ' s';
        }
        var dataPizza = new google.visualization.DataTable();
        dataPizza.addColumn('string', 'Tarefa');
        dataPizza.addColumn('number', ' % ');
        dataPizza.addRows([
            ['Tarefa 1.1', (tarefa1 / resSessions.data.length).toFixed(3) * 100],
            ['Tarefa 1.2', (tarefa2 / resSessions.data.length).toFixed(3) * 100],
            ['Tarefa 1.3', (tarefa3 / resSessions.data.length).toFixed(3) * 100],
        ]);
        function resize() {
            var chartColumnSessions = new google.charts.Bar(document.getElementById('div_ColumnChart'));
            chartColumnSessions.draw(dataColumn, google.charts.Bar.convertOptions(optionsColumnSessions));

            var chartColumnPac = new google.charts.Bar(document.getElementById('div_ColumnChartPacientes'));
            chartColumnPac.draw(dataColumnPacientes, google.charts.Bar.convertOptions(optionsColumnPac));
            
            var chartPizzaTasks = new google.visualization.PieChart(document.getElementById('div_TasksChart'));
            chartPizzaTasks.draw(dataPizza, optionsPizzaTasks);
        }
        window.onload = resize();
        window.onresize = resize;
    }
}
$(window).resize(function () {
    GraficoSessoes();
});