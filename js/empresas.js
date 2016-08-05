var div = d3.select("body").append("div")
  .attr("class", "tooltip")
  .style("opacity", 0);

var empresas = ["JBS"],
  groups = null,
  candidatos = {},
  mudou = null,
  formatNumber = d3.format(",d"),
  arquivo = null,
  width = $("#grafico").width() -20,
  height = $("#grafico").height(),
  formatNumber = d3.format(",d")
  clusters = {};

var raio = d3.scaleLinear()
    .domain([40,541])
    .range([2, 30]);

var svg = d3.select("#grafico").append("svg")
    .attr("viewBox", "0 0 " + width + " " + height )

//ZOOM
//  .append("g")
//  .call(d3.behavior.zoom().scaleExtent([0.7, 8]).on("zoom", zoom))

caixa = svg.append("rect")
  .attr("width", width)
  .attr("height", height)
  .style("stroke","#000")
  .style("fill","#fff")
  .on("click", function(d) {
    div.transition()
      .duration(500)
      .style("opacity", 0);
  });

var cores = {
  'Atletismo':'#e31a1c',
  'Badminton':'gray',
  'Basquete':'#b2df8a',
  'Boxe':'#cab2d6',
  'Canoagem':'#1f78b4',
  'Ciclismo':'#33a02c',
  'Decatlo':'#ff7f00',
  'Esgrima':'#cab2d6',
  'Futebol':'#fccde5',
  'Ginástica':'gray',
  'Golfe':'gray',
  'Handebol':'gray',
  'Heptatlo':'#ff7f00',
  'Hóquei':'#FFF0AA',
  'Judô':'#cab2d6',
  'Luta':'#cab2d6',
  'Natação':'#1f78b4',
  'Pentatlo':'#ff7f00',
  'Polo Aquático':'#1f78b4',
  'Remo':'#1f78b4',
  'Rugby':'gray',
  'Vela':'#1f78b4',
  'Salto ornamental':'#1f78b4',
  'Taekwondo':'#cab2d6',
  'Tênis':'#a6cee3',
  'Triatlo':'#ff7f00',
  'Vôlei':'#fdbf6f',
  'Vôlei de praia':'#fdbf6f'
}

var simulation = d3.forceSimulation()
    .force("link", d3.forceLink().id(function(d) { return d.id; }))
    .force("charge", d3.forceManyBody())
    .force("center", d3.forceCenter(width / 2, height / 2));


d3.json("dados_grafico.json", function(error, graph) {
  function testa_link(l) {
    var saida = [false,false]
    for (var f in graph.nodes) {
      var n = graph.nodes[f]
      if (l['source'] == n['id']) {
        saida[0] = true
      }
      if (l['target'] == n['id']) {
        saida[1] = true
      }
    }
    return saida
  }

  for (var f in graph.links) {
    var l = graph.links[f]
    var saida = testa_link(l)
    if (!(saida[0] && saida[1])) {
      console.log(l,saida)
    }
  }

  if (error) throw error;
  function ticked() {

  link
      .attr("x1", function(d) { return d.source.x; })
      .attr("y1", function(d) { return d.source.y; })
      .attr("x2", function(d) { return d.target.x; })
      .attr("y2", function(d) { return d.target.y; });

  node
      .attr("cx", function(d) { return d.x; })
      .attr("cy", function(d) { return d.y; });
}


  var link = svg.append("g")
      .attr("class", "links")
      .selectAll("line")
      .data(graph.links)
      .enter().append("line")
      .attr("stroke-width",0.5);

  var node = svg.append("g")
      .attr("class", "nodes")
    .selectAll("circle")
    .data(graph.nodes)
    .enter().append("circle")
      .attr("r", function (d) { return raio(d.seguidores_atletas) })
      .attr("fill", function(d) { return cores[d.esporte]; })
      .call(d3.drag()
          .on("start", dragstarted)
          .on("drag", dragged)
          .on("end", dragended));

  node.append("title")
      .text(function(d) { return d.usuario + " - "+d.nome + ' - '+ d.esporte; });

  simulation
      .nodes(graph.nodes)
      .on("tick", ticked);

  simulation.force("link")
      .links(graph.links);

});

function dragstarted(d) {
  if (!d3.event.active) simulation.alphaTarget(0.3).restart();
  d.fx = d.x;
  d.fy = d.y;
}

function dragged(d) {
  d.fx = d3.event.x;
  d.fy = d3.event.y;
}

function dragended(d) {
  if (!d3.event.active) simulation.alphaTarget(0);
  d.fx = null;
  d.fy = null;
}

d3.select(window).on("resize",resize)

function resize() {
  width = $("#grafico").width() -20,
  height = $("#grafico").height(),

  svg.attr("viewBox", "0 0 " + width + " " + height )
  caixa.attr("width", width)
  .attr("height", height)

}
