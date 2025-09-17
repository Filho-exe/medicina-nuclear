from flask  import Flask, render_template, request
import random, math
from datetime import datetime, timedelta

app = Flask(__name__)
app.config['LOGIN_DISABLE'] = True

#===- Definindo as informações dos radioisótopos -===#
radioisotopo_json = {
    "Tecnécio-99m":{
        "elemento":"Tecnécio-99m",
        "meia_vida":360
    },
    "Iodo-131":{
        "elemento":"Iodo-131",
        "meia_vida":11520
    },
    "Rubídio-82":{
        "elemento":"Rubídio-82",
        "meia_vida":1.25
    }
}
horario = []
coleta=[]

#===- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -===#
#// A função 'time' consiste em pegar as horas que foi realizada a eluição do radiofármaco, como também armazenar os horarios    //#
#// de 30 em 30 minutos - conforme solicitado. Após, ele cria uma diferença entre os horarios e devolve o valor da atividade às //#
#// 08:00 para iniciar o protocolo.                                                                                             //#
#===- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -===#
def time(data, atividade0, meia_vida):
#===- .clear para garantir que a tabela estará limpa ao armazenar dados -===#
    horario.clear()
    coleta.clear()
    horas = datetime.strptime('08:00','%H:%M')
    diff = (horas - datetime.strptime(f'{data}','%H:%M')).seconds/60
    while  horas < datetime.strptime('18:30','%H:%M'):
        if horas >= datetime.strptime('12:30','%H:%M') and horas < datetime.strptime('13:00','%H:%M'):
            horas += timedelta(minutes=30)
        else:
            horario.append(horas.strftime('%H:%M'))
            horas += timedelta(minutes=30)
    atividade = atividade0*math.exp(-(math.log(2)/meia_vida)*diff)
    return round(atividade,2)

#===- Esta são as rotas de acesso -===#
@app.route('/', methods=['GET','POST'])
def main():
    return render_template('main.html')

@app.route('/table', methods=['GET','POST'])
def table():
    print('table')
    return render_template('table.html')

#===- Rota de acesso onde é feito todo o protocolo -===#
@app.route('/search', methods=['GET','POST'])
def search():
#==- Definição de tabelas de dict/json para armazenar os dados ===-#
    concentracao = []
    volume_eluido=[]
    json_final = {}
#===- Requisição no 'form' para obter as entradas do usuário -===#
    radiofarmaco = request.form.get('radiofarmaco')
    volume = int(request.form.get('volume'))
    dataColeta = request.form.get('data')
    meia_vida = radioisotopo_json[radiofarmaco]['meia_vida']
    atividade = time(data=dataColeta, atividade0=int(request.form.get('atividade')), meia_vida=meia_vida)
#==- Aleatorizar os protocolos e definir a concentração em cada instante de tempo t -===#
    protocolos = [random.choice((range(20,41,5))) for _ in range(20)]
    for j in range(len(horario)):
        A = atividade*math.exp(-(math.log(2)/meia_vida)*30*j)
        concentracao.append(round(A,2)/volume)

#===- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -===#
#// coloca-se a tabela de concetracao e protocolo lado a lado, assim quando o volume no frasco, dado a concentracao, nao for o suficiente //#
#// para o protocolo ou o volume acabar, será adicionado ao 'json_final' os valores e o status = false, caso contrário status = true.     //#
#===- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -===#
    for i, (a,b) in enumerate(zip(concentracao,protocolos)):
        if a*(volume - sum(volume_eluido)) < b and (volume-sum(volume_eluido)) > 0:
            json_final[horario[i]]=[{
                'protocolo':b,
                'atividade':a*volume,
                'volume_eluido':'Nao avaliado',
                'volume_final':round(volume - sum(volume_eluido),1),
                'status':False
            }]

        elif a*(volume - sum(volume_eluido)) >b:
            Ve = round(b/a,1)
            volume_eluido.append(Ve)
            json_final[horario[i]]=[{
                'protocolo':b,
                'atividade':a*volume,
                'volume_eluido':Ve,
                'volume_final':round(volume - sum(volume_eluido),1),
                'status': True
            }]
        elif volume - sum(volume_eluido) <= 0:
                json_final[horario[i]]=[{
                'protocolo':b,
                'atividade':a*volume,
                'volume_eluido':'Nao avaliado',
                'volume_final':0,
                'status':False}]    
                
#===- Retorna o template 'table.html' junto às variáveis necessárias para o uso no HTML e JS -===#
    return render_template('table.html', json_final=json_final,
                            _volumeInicial = request.form.get('volume'),
                            _element = radiofarmaco)


app.run(debug=True)