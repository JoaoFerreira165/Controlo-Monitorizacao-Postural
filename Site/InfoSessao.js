const instance = axios.create({
    //baseURL: 'http://192.168.1.50:8000/',
    baseURL: 'http://localhost:8000/',

});
const input_pesquisa = document.getElementById('pesquisar-tabela');
const conteudo_tabela = document.getElementById('Sessions');
let resData;
let resComplex;
let resSessionsData;
let id;
function getId() {
    var url = window.location.href;
    id = url.split('?')[1].substring(3, 45);
}
getId();
async function getDados() {
    $(".preload").fadeOut(1000);
    resSessionsData = await instance.get('/session/filter/sessions_data/ids?id[0]=' + id);
    var pag = document.getElementById("pag");
    $(".content").fadeIn(1000);
    pag.style.display = "block";
    if (resSessionsData.data[0].patient[0].gender === "M") {
        document.getElementById("titulo").innerHTML = "Mais informações da Sessão do Paciente " + resSessionsData.data[0].patient[0].name;
    } else if (resSessionsData.data[0].patient[0].gender === "Q") {
        document.getElementById("titulo").innerHTML = "Mais informações da Sessão do/da Paciente " + resSessionsData.data[0].patient[0].name;
    } else {
        document.getElementById("titulo").innerHTML = "Mais informações da Sessão da Paciente " + resSessionsData.data[0].patient[0].name;
    }
    document.getElementById("comentario").value = resSessionsData.data[0].patient[0].comments;
    document.getElementById("descricaoSessao").value = resSessionsData.data[0].description;
    document.getElementById("tarefa").value = resSessionsData.data[0].task.name;
    document.getElementById("descricaoTarefa").value = resSessionsData.data[0].task.description;
    document.getElementById("complexoNome").value = resSessionsData.data[0].complex.name;
    graficos();
    tabelas();
}
getDados();
var maior = 0, menor = 0, maiorRoll = 0, menorRoll = 0, maiorYaw = 0, menorYaw = 0;
var valorroll = 0, valorpitch = 0, valoryaw = 0;
var desvioPadraoPitch, desvioPadraoRoll, desvioPadraoYaw;
let pitch = 0, roll = 0, yaw = 0;
let mediaPitch = 0, mediaRoll = 0, mediaYaw = 0;

let maiorPitchAjust = 0, menorPitchAjust = 0, maiorRollAjust = 0, menorRollAjust = 0, maiorYawAjust = 0, menorYawAjust = 0;
let valorPitchAjust = 0, valorRollAjust = 0, valorYawAjust = 0;
let desvioPitchAjust = 0, desvioRollAjust, desvioYawAjust = 0;
let PitchAjust = 0, RollAjust = 0, YawAjust = 0;
let mediaPitchAjust = 0, mediaRollAjust, mediaYawAjust = 0;
let data = new Object();
google.load("visualization", "1", { packages: ["corechart"] });
function graficos() {
    google.charts.setOnLoadCallback(drawCharts);
    function drawCharts() {
        var dataPitch = new google.visualization.DataTable();
        dataPitch.addColumn('timeofday', 'Time of Day');
        dataPitch.addColumn('number', 'Sagital');
        dataPitch.addColumn({ type: 'string', role: 'style' });
        dataPitch.addColumn('number', 'Ajustada');
        dataPitch.addColumn({ type: 'string', role: 'style' });

        var dataRoll = new google.visualization.DataTable();
        dataRoll.addColumn('timeofday', 'Time of Day');
        dataRoll.addColumn('number', 'Frontal');
        dataRoll.addColumn({ type: 'string', role: 'style' });
        dataRoll.addColumn('number', 'Ajustada');
        dataRoll.addColumn({ type: 'string', role: 'style' });

        var dataYaw = new google.visualization.DataTable();
        dataYaw.addColumn('timeofday', 'Time of Day');
        dataYaw.addColumn('number', 'Transversal');
        dataYaw.addColumn({ type: 'string', role: 'style' });
        dataYaw.addColumn('number', 'Ajustada');
        dataYaw.addColumn({ type: 'string', role: 'style' });

        var dataRollPitch = new google.visualization.DataTable();
        dataRollPitch.addColumn('number', '');
        dataRollPitch.addColumn('number', 'Pitch and Roll');

        var inicio = new Date(resSessionsData.data[0].data_session[0][0].createdAt);
        for (var i = 0; i < resSessionsData.data[0].data_session[0].length; i++) {
            //Criação do gráfico pitch    
            var fim = new Date(resSessionsData.data[0].data_session[0][i].createdAt);
            var diferenca = new Date(fim - inicio);
            dataPitch.addRow([[0, diferenca.getMinutes(), diferenca.getSeconds(), diferenca.getMilliseconds()], resSessionsData.data[0].data_session[0][i].data.pitchRotation, 'color: #6495ED', resSessionsData.data[0].data_session[0][i].data.pitchRotation - resSessionsData.data[0].data_session[0][0].data.pitchRotation, 'color: red']);
            dataRoll.addRow([[0, diferenca.getMinutes(), diferenca.getSeconds(), diferenca.getMilliseconds()], resSessionsData.data[0].data_session[0][i].data.rollRotation, 'color: #6495ED', resSessionsData.data[0].data_session[0][i].data.rollRotation - resSessionsData.data[0].data_session[0][0].data.rollRotation, 'color: red']);
            dataYaw.addRow([[0, diferenca.getMinutes(), diferenca.getSeconds(), diferenca.getMilliseconds()], resSessionsData.data[0].data_session[0][i].data.yawRotation, 'color: #6495ED', resSessionsData.data[0].data_session[0][i].data.yawRotation - resSessionsData.data[0].data_session[0][0].data.yawRotation, 'color: red']);
            dataRollPitch.addRow([resSessionsData.data[0].data_session[0][i].data.rollRotation, resSessionsData.data[0].data_session[0][i].data.pitchRotation]);
        }
        var optionsPitch = {
            responsive: true,
            hAxis: {
                title: 'Tempo  (s)',
                titleTextStyle: {
                    fontSize: 13,
                    bold: 'true'
                },
                format: 'mm:ss',
            },
            vAxis: {
                title: 'Rotação  (graus)',
                titleTextStyle: {
                    fontSize: 13,
                    bold: 'true'
                },
                max: 20,
                min: -20
            },
            legend: {
                position: 'right',
                textStyle: {
                    fontSize: 15,
                    bold: 'true'
                }
            },
            crosshair: {
                focused: {
                    color: 'black',
                    opacity: 1
                },
                trigger: 'both',
            },
            focusTarget: 'category',
            explorer: {
                actions: ['dragToZoom', 'rightClickToReset'],
                axis: 'Vertical',
                keepInBounds: true,
                zoomDelta: 2,
                maxZoomIn: .05,
                maxZoomOut: 2
            },
        };
        var optionsRoll = {
            width: '90%',
            hAxis: {
                title: 'Tempo  (s)',
                titleTextStyle: {
                    fontSize: 13,
                    bold: 'true'
                },
                format: 'mm:ss',
            },
            vAxis: {
                title: 'Rotação  (graus)',
                titleTextStyle: {
                    fontSize: 13,
                    bold: 'true'
                }
            },
            legend: {
                position: 'right',
                textStyle: {
                    fontSize: 15,
                    bold: 'true'
                }
            },
            crosshair: {
                focused: {
                    color: 'black',
                    opacity: 1
                },
                trigger: 'both'
            },
            focusTarget: 'category',
            explorer: {
                actions: ['dragToZoom', 'rightClickToReset'],
                axis: 'Vertical',
                keepInBounds: true,
                zoomDelta: 2,
                maxZoomIn: .05,
                maxZoomOut: 2
            }
        }
        var optionsYaw = {
            width: '90%',
            hAxis: {
                title: 'Tempo  (s)',
                titleTextStyle: {
                    fontSize: 13,
                    bold: 'true'
                },
                format: 'mm:ss',
            },
            vAxis: {
                title: 'Rotação  (graus)',
                titleTextStyle: {
                    fontSize: 13,
                    bold: 'true'
                }
            },
            legend: {
                position: 'right',
                textStyle: {
                    fontSize: 15,
                    bold: 'true'
                }
            },
            crosshair: {
                focused: {
                    color: 'black',
                    opacity: 1
                },
                trigger: 'both'
            },
            focusTarget: 'category',
            explorer: {
                actions: ['dragToZoom', 'rightClickToReset'],
                axis: 'Vertical ',
                keepInBounds: true,
                zoomDelta: 2,
                maxZoomIn: .05,
                maxZoomOut: 2
            }
        }
        var optionsRollPitch = {
            responsive: true,
            width: '90%',
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
            explorer: {
                zoomDelta: 2,
                maxZoomIn: .05,
                maxZoomOut: 2
            },
            colors: ['#6495ED'],
            crosshair: {
                focused: {
                    color: 'black',
                    opacity: 1
                },
                trigger: 'both'
            },
        };

        function resize() {
            var columnsPitch = [0];
            if (document.getElementById('linePitch').checked) {
                columnsPitch.push(1, 2);
            }
            if (document.getElementById('linePitchmedia').checked) {
                columnsPitch.push(3, 4);
            }
            if (!document.getElementById('linePitch').checked && !document.getElementById('linePitchmedia').checked) {
                columnsPitch.push(1, 2, 3, 4);
            }
            var viewPitch = new google.visualization.DataView(dataPitch);
            viewPitch.setColumns(columnsPitch);
            var chartPitch = new google.visualization.LineChart(document.getElementById('div_LineChartPitch'));
            chartPitch.draw(viewPitch, optionsPitch);

            var columnsRoll = [0];
            if (document.getElementById('lineRoll').checked) {
                columnsRoll.push(1, 2);
            }
            if (document.getElementById('lineRollmedia').checked) {
                columnsRoll.push(3, 4);
            }
            if (!document.getElementById('lineRoll').checked && !document.getElementById('lineRollmedia').checked) {
                columnsRoll.push(1, 2, 3, 4);
            }

            var viewRoll = new google.visualization.DataView(dataRoll);
            viewRoll.setColumns(columnsRoll);
            var chartRoll = new google.visualization.LineChart(document.getElementById('div_LineChartRoll'));
            chartRoll.draw(viewRoll, optionsRoll);

            var chartRollPitch = new google.visualization.ScatterChart(document.getElementById('div_dispersaoChart'));
            chartRollPitch.draw(dataRollPitch, optionsRollPitch);

            var columnsYaw = [0];
            if (document.getElementById('lineYaw').checked) {
                columnsYaw.push(1, 2);
            }
            if (document.getElementById('lineYawmedia').checked) {
                columnsYaw.push(3, 4);
            }
            if (!document.getElementById('lineYaw').checked && !document.getElementById('lineYawmedia').checked) {
                columnsYaw.push(1, 2, 3, 4);
            }
            var viewYaw = new google.visualization.DataView(dataYaw);
            viewYaw.setColumns(columnsYaw);
            var chartYaw = new google.visualization.LineChart(document.getElementById('div_LineChartYaw'));
            chartYaw.draw(viewYaw, optionsYaw);
        }
        window.onload = resize();
        window.onresize = resize;
    }
}

function createTables(id, media, dp, max, min, mediaAjust, dpAjust, maxAjust, minAjust) {
    if (id === "grafPitchAndRoll") {
        let tab =
            `<thead class="table-primary table-bordered border-secondary" >
        <tr>
            <th></th>
            <th>Plano Sagital</th>
            <th>Plano Frontal</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td> Média </td>
            <td>${mediaPitch.toFixed(3)}</td>
            <td>${mediaRoll.toFixed(3)}</td>
        </tr>
        <tr>
           <td> Desvio Padrão </td>
            <td>${desvioPadraoPitch.toFixed(3)}</td>
            <td>${desvioPadraoRoll.toFixed(3)}</td>
        </tr>
        <tr>
            <td> Máximo </td>
            <td>${maior}</td>
            <td>${maiorRoll}</td>
        </tr>
        <tr>
            <td> Mínimp </td>
            <td>${menor}</td>
            <td>${menorRoll}</td>
        </tr>
        <tr>
            <td> Amplitude </td>
            <td>${maior - menor}</td>
            <td>${maiorRoll - menorRoll}</td>
        </tr>
    `;
        tab += `</tbody>`;
        document.getElementById(id).innerHTML = tab;
    } else {
        let tab =
            `<thead class="table-primary table-bordered border-secondary" >
        <tr>
            <th></th>
            <th>Dados Originais</th>
            <th>Dados Ajustados</th>
            </tr>
            </thead>
            <tbody>
            <tr>
            <td> Média </td>
            <td>${media.toFixed(3)}</td>
            <td>${mediaAjust.toFixed(3)}</td>
            </tr>
            <tr>
            <td> Desvio Padrão </td>
            <td>${dp.toFixed(3)}</td>
            <td>${dpAjust.toFixed(3)}</td>
            </tr>
            <tr>
            <td> Máximo </td>
            <td>${max}</td>
            <td>${maxAjust}</td>
            </tr>
            <tr>
            <td> Mínimp </td>
            <td>${min}</td>
            <td>${minAjust}</td>
            </tr>
            <tr>
            <td> Amplitude </td>
            <td>${max - min}</td>
            <td>${maxAjust - minAjust}</td>
            </tr>
            `;
        tab += `</tbody>`;
        document.getElementById(id).innerHTML = tab;
    }
}

function tabelas() {
    for (var i = 0; i < resSessionsData.data[0].data_session[0].length; i++) {
        //Máximo e minimo dos gráficos para pitch e roll
        maior = Math.max(maior, resSessionsData.data[0].data_session[0][i].data.pitchRotation);
        menor = Math.min(menor, resSessionsData.data[0].data_session[0][i].data.pitchRotation);
        maiorRoll = Math.max(maiorRoll, resSessionsData.data[0].data_session[0][i].data.rollRotation);
        menorRoll = Math.min(menorRoll, resSessionsData.data[0].data_session[0][i].data.rollRotation);
        maiorYaw = Math.max(maiorYaw, resSessionsData.data[0].data_session[0][i].data.yawRotation);
        menorYaw = Math.min(menorYaw, resSessionsData.data[0].data_session[0][i].data.yawRotation);

        maiorPitchAjust = Math.max(maiorPitchAjust, resSessionsData.data[0].data_session[0][i].data.pitchRotation - resSessionsData.data[0].data_session[0][0].data.pitchRotation);
        menorPitchAjust = Math.min(menorPitchAjust, resSessionsData.data[0].data_session[0][i].data.pitchRotation - resSessionsData.data[0].data_session[0][0].data.pitchRotation);
        maiorRollAjust = Math.max(maiorRollAjust, resSessionsData.data[0].data_session[0][i].data.rollRotation - resSessionsData.data[0].data_session[0][0].data.rollRotation);
        menorRollAjust = Math.min(menorRollAjust, resSessionsData.data[0].data_session[0][i].data.rollRotation - resSessionsData.data[0].data_session[0][0].data.rollRotation);
        maiorYawAjust = Math.max(maiorYawAjust, resSessionsData.data[0].data_session[0][i].data.yawRotation - resSessionsData.data[0].data_session[0][0].data.yawRotation);
        menorYawAjust = Math.min(menorYawAjust, resSessionsData.data[0].data_session[0][i].data.yawRotation - resSessionsData.data[0].data_session[0][0].data.yawRotation);

        //Variaveis para calcular média
        valorpitch += resSessionsData.data[0].data_session[0][i].data.pitchRotation;
        valorroll += resSessionsData.data[0].data_session[0][i].data.rollRotation;
        valoryaw += resSessionsData.data[0].data_session[0][i].data.yawRotation;

        valorPitchAjust += resSessionsData.data[0].data_session[0][i].data.pitchRotation - resSessionsData.data[0].data_session[0][0].data.pitchRotation;
        valorRollAjust += resSessionsData.data[0].data_session[0][i].data.rollRotation - resSessionsData.data[0].data_session[0][0].data.rollRotation;
        valorYawAjust += resSessionsData.data[0].data_session[0][i].data.yawRotation - resSessionsData.data[0].data_session[0][0].data.yawRotation;

    }
    mediaPitch = valorpitch / resSessionsData.data[0].data_session[0].length;
    mediaRoll = valorroll / resSessionsData.data[0].data_session[0].length;
    mediaYaw = valoryaw / resSessionsData.data[0].data_session[0].length;

    mediaPitchAjust = valorPitchAjust / resSessionsData.data[0].data_session[0].length;
    mediaRollAjust = valorRollAjust / resSessionsData.data[0].data_session[0].length;
    mediaYawAjust = valorYawAjust / resSessionsData.data[0].data_session[0].length;

    //Calculo DesvioPadrão
    for (var i = 0; i < resSessionsData.data[0].data_session[0].length; i++) {
        pitch += (resSessionsData.data[0].data_session[0][i].data.pitchRotation - mediaPitch) ** 2;
        roll += (resSessionsData.data[0].data_session[0][i].data.rollRotation - mediaRoll) ** 2;
        yaw += (resSessionsData.data[0].data_session[0][i].data.yawRotation - mediaYaw) ** 2;

        PitchAjust += ((resSessionsData.data[0].data_session[0][i].data.pitchRotation - resSessionsData.data[0].data_session[0][0].data.pitchRotation) - mediaPitchAjust) ** 2;
        RollAjust += ((resSessionsData.data[0].data_session[0][i].data.rollRotation - resSessionsData.data[0].data_session[0][0].data.rollRotation) - mediaRollAjust) ** 2;
        YawAjust += ((resSessionsData.data[0].data_session[0][i].data.yawRotation - resSessionsData.data[0].data_session[0][0].data.yawRotation) - mediaYawAjust) ** 2;

    }
    desvioPadraoPitch = Math.sqrt((pitch / resSessionsData.data[0].data_session[0].length));
    desvioPadraoRoll = Math.sqrt((roll / resSessionsData.data[0].data_session[0].length));
    desvioPadraoYaw = Math.sqrt((yaw / resSessionsData.data[0].data_session[0].length));

    desvioPitchAjust = Math.sqrt((PitchAjust / resSessionsData.data[0].data_session[0].length));
    desvioRollAjust = Math.sqrt((RollAjust / resSessionsData.data[0].data_session[0].length));
    desvioYawAjust = Math.sqrt((YawAjust / resSessionsData.data[0].data_session[0].length));

    createTables("grafPitch", mediaPitch, desvioPadraoPitch, maior, menor, mediaPitchAjust, desvioPitchAjust, maiorPitchAjust, menorPitchAjust, mediaPitch);
    createTables("grafRoll", mediaRoll, desvioPadraoRoll, maiorRoll, menorRoll, mediaRollAjust, desvioRollAjust, maiorRollAjust, menorRollAjust, mediaRoll);
    createTables("grafYaw", mediaYaw, desvioPadraoYaw, maiorYaw, menorYaw, mediaYawAjust, desvioYawAjust, maiorYawAjust, menorYawAjust);
    createTables("grafPitchAndRoll");
}
$(document).ready(function () {
    $('.delete').on('click', function () {
        if (id == '') {
            return false;
        }
        else {
            $('#myModalElim').modal('show');
            $('.modal_body1').html('Vai apagar a Sessão Atual!');
        }
    })
});
$(document).ready(function () {
    $('.eliminar').on('click', async function () {
        const DeleteSession = await instance.delete('/session/delete', { data: { _id: id } }, { headers: { "Content-Type": "application/json" } });
        window.location.href = './TabelaSessoes.html';
    })

});
function Voltar() {
    window.location.href = './TabelaSessoes.html';
}
