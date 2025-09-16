console.log(jsonData)
const tbody = document.querySelector("#dataTable tbody");
for (const [hora, lista] of Object.entries(jsonData)) {
  const item = lista[0];
  //console.log(item)
  const tr = document.createElement("tr");
  const volume = item.volume_eluido
  //console.log(volume)
  tr.innerHTML = `<td>${hora}</td><td>${item.protocolo}</td><td>${volume}</td>`;
  tbody.appendChild(tr);
}


const labels = Object.keys(jsonData);
const volumes = labels.map(ve => jsonData[ve][0].volume_eluido);
const protocolos = labels.map(pr => jsonData[pr][0].protocolo);
let protocolo_demanda = [0]
protocolos.forEach(protocolo => {
  protocolo_demanda.push(protocolo_demanda.at(-1) + protocolo)

});

const atividade = labels.map(at => jsonData[at][0].atividade);
let volumeFinal = [];
volumeFinal.push(volumeInicial);
console.log(volumeFinal)
volumes.forEach(volume => {
  if (volume === 'Nao avaliado') volumeFinal.push(Math.round(volumeFinal.at(-1)))
  else volumeFinal.push(Math.round(volumeFinal.at(-1) - volume))

});
console.log(volumeFinal)
new Chart(document.getElementById('chart1'), {
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

new Chart(document.getElementById('chart2'), {
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

new Chart(document.getElementById('chart3'), {
  type: 'line',
  data: { labels, datasets: [{ label: 'Atividade', data: atividade, borderColor: 'green', fill: true, backgroundColor: 'rgba(0,128,0,0.1)', tension: 0.3 }] },
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