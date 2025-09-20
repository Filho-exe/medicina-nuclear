console.log(jsonData)
const tbody = document.querySelector("#dataTable tbody");
let sucessos = 0
let falhas = 0
for (const [hora, lista] of Object.entries(jsonData)) {
  const item = lista[0];
  //console.log(item)
  const tr = document.createElement("tr");
  const volume = item.volume_eluido
  //console.log(volume)
  //console.log(item.status)
  if (item.status == false) {
    tr.innerHTML = `<td>${hora}</td><td>${item.protocolo}</td><td style="color: red;" >Indisponível</td>`;
    falhas++
  }
  else {
    tr.innerHTML = `<td>${hora}</td><td>${item.protocolo}</td><td>${volume}</td>`;
    sucessos++
  }

  tbody.appendChild(tr);
}

document.getElementById('sucesso').textContent = sucessos
document.getElementById('falhas').textContent = falhas



const labels = Object.keys(jsonData);
const volumes = labels.map(ve => jsonData[ve][0].volume_eluido);
const protocolos = labels.map(pr => jsonData[pr][0].protocolo);
let protocolo_demanda = [0]
protocolos.forEach(protocolo => {
  protocolo_demanda.push(protocolo_demanda.at(-1) + protocolo)

});

const atividade = labels.map(at => jsonData[at][0].atividade);
const atividade2 = []
for (let j = 0; j <= 20; j++) {
  atividade2.push(atividadeInicial * Math.exp(-(Math.log(2) / meiaVida) * 30 * j))
}
let volumeFinal = [];
volumeFinal.push(volumeInicial);
//console.log(volumeFinal)
volumes.forEach(volume => {
  if (volume === 'Nao avaliado') volumeFinal.push(Math.round(volumeFinal.at(-1)))
  else volumeFinal.push(Math.round(volumeFinal.at(-1) - volume))

});
const horario = Object.keys(jsonData);
horario.splice(8, 0, '12:00')
horario.splice(9, 0, '12:30')

let _chart1 = new Chart(document.getElementById('chart1'), {
  type: 'line',
  data: {
    labels,
    datasets: [{
      label: 'Volume no frasco',
      data: volumeFinal,
      borderColor: 'blue',
      fill: true,
      backgroundColor: 'rgba(0,0,255,0.1)'
    }]
  },
  options: {
    responsive: true,
    scales: {
      y: {
        title: {
          display: true,
          text: 'Volume [mL]'
        }
      }
    }
  }
});

let _chart2 = new Chart(document.getElementById('chart2'), {
  type: 'line',
  data: {
    labels,
    datasets: [{
      label: 'Demanda acumulada',
      data: protocolo_demanda,
      borderColor: 'orange',
      fill: true,
      backgroundColor: 'rgba(255,165,0,0.1)'
    },
    {
      label: 'Produção disponível',
      data: atividade,
      borderColor: 'green',
      fill: true,
      backgroundColor: 'rgba(255,165,0,0.1)'
    }]
  },
  options: {
    responsive: true,
    scales: {
      y: {
        title: {
          display: true,
          text: 'Atividade [mCi]'
        }
      }
    }
  }
});

let _chart3 = new Chart(document.getElementById('chart3'), {
  type: 'line',
  data: {
    labels: horario,
    datasets: [{
      label: 'Atividade',
      data: atividade2,
      borderColor: 'green',
      fill: true,
      backgroundColor: 'rgba(0,128,0,0.1)'
    }]
  },
  options: {
    responsive: true,
    scales: {
      y: {
        title: {
          display: true,
          text: 'Atividade [mCi]'
        }
      }
    }
  }
});

document.getElementById('otimizar').addEventListener('click', () => {
  const _otimizado = document.getElementById('otimizado')
  document.getElementById('otimizar').style.display = 'none';
  _otimizado.style.display = 'flex';
  fetch(`/otimizar?A0=${atividadeInicial}&V0=${volumeInicial}&T12=${meiaVida}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(jsonData)
  })
    .then(response => {
      return response.json();
    })
    .then(data => {
      tbody.innerHTML = '';
      falhas = 0
      sucessos = 0
      console.log('otimizado', data)
      for (const [hora, lista] of Object.entries(data)) {
        const item = lista[0];
        //console.log(item)
        const tr = document.createElement("tr");
        const volume = item.volume_eluido
        //console.log(volume)
        //console.log(item.status)
        if (item.status == false) {
          tr.innerHTML = `<td>${hora}</td><td>${item.protocolo}</td><td style="color: red;" >Indisponível</td>`;
          falhas++
        }
        else {
          tr.innerHTML = `<td>${hora}</td><td>${item.protocolo}</td><td>${volume}</td>`;
          sucessos++
        }

        tbody.appendChild(tr);
      }
      document.getElementById('sucesso').textContent = sucessos
      document.getElementById('falhas').textContent = falhas

      const labels = Object.keys(data);
      const volumes = labels.map(ve => data[ve][0].volume_eluido);
      const protocolos = labels.map(pr => data[pr][0].protocolo);
      let protocolo_demanda = [0]
      protocolos.forEach(protocolo => {
        protocolo_demanda.push(protocolo_demanda.at(-1) + protocolo)

      });

      _chart1.destroy()
      _chart2.destroy()
      _chart1 = new Chart(document.getElementById('chart1'), {
        type: 'line',
        data: {
          labels,
          datasets: [{
            label: 'Volume no frasco',
            data: volumeFinal,
            borderColor: 'blue',
            fill: true,
            backgroundColor: 'rgba(0,0,255,0.1)'
          }]
        },
        options: {
          responsive: true,
          scales: {
            y: {
              title: {
                display: true,
                text: 'Volume [mL]'
              }
            }
          }
        }
      });

      _chart2 = new Chart(document.getElementById('chart2'), {
        type: 'line',
        data: {
          labels,
          datasets: [{
            label: 'Demanda acumulada',
            data: protocolo_demanda,
            borderColor: 'orange',
            fill: true,
            backgroundColor: 'rgba(255,165,0,0.1)'
          },
          {
            label: 'Produção disponível',
            data: atividade,
            borderColor: 'green',
            fill: true,
            backgroundColor: 'rgba(255,165,0,0.1)'
          }]
        },
        options: {
          responsive: true,
          scales: {
            y: {
              title: {
                display: true,
                text: 'Atividade [mCi]'
              }
            }
          }
        }
      });

    })
    .catch(error => console.error("Erro:", error));

});