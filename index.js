var express = require('express');
var app = express();
const port = process.env.PORT || 2810

app.set('views', './views')
app.set('view engine', 'pug')
app.use(express.static('public'))

app.get('/', (req, res) => {
  res.render('index')
})

app.get('/simulacao', (req, res) => {
  const origem = req.query.origem
  const destino = req.query.destino
  const tempo = req.query.tempo
  const plano = req.query.plano

  if (validar(origem, destino)){
    const valores = simular(origem, destino, tempo, plano)
    const data = {
        origem: origem, 
        destino: destino, 
        tempo: tempo, 
        plano: plano, 
        valorPlano: valores[0], 
        valorSemPlano: valores[1]
    }
    res.render('simulacao', data)
  } else {
    res.render('simulacao')
  }
})

app.listen(port, () =>
  console.log(`Example app listening on port ${port}!`))

function simular(origem, destino, tempo, plano) {
  const tabela = {
    11: {16: 1.9, 17: 1.7, 18: 0.9},
    16: {11: 2.9},
    17: {11: 2.7},
    18: {11: 1.9}
  }

  let tempoFalado = tempo - plano
  if (tempoFalado < 0) {
    tempoFalado = 0
  }
  const valorTabela = tabela[origem][destino]
  const valorPlano = (tempoFalado * (valorTabela * 1.1)).toFixed(2)
  const valorSemPlano = (tempo * valorTabela).toFixed(2)

  return [valorPlano, valorSemPlano]
}

function validar(origem, destino){
    return origem === '11' || origem === '16' && destino === '11' || origem === '17' && destino === '11' || origem === '18' && destino === '11'
}