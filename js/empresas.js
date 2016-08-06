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
    .domain([50,900])
    .range([3, 60]);

var svg = d3.select("#grafico").append("svg")
    .attr("viewBox", "0 0 " + width + " " + height )
  //.attr("width", width)
  //.attr("height", height)


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
  'Natação':'#1f78b4',
  'Canoagem':'#1f78b4',
  'Remo':'#1f78b4',
  'Vela':'#1f78b4',
  'Salto ornamental':'#1f78b4',
  'Polo Aquático':'#1f78b4',
  'Basquete':'#b2df8a',
  'Ciclismo':'#33a02c',
  'Triatlo':'#ff7f00',
  'Pentatlo':'#ff7f00',
  'Heptatlo':'#ff7f00',
  'Decatlo':'#ff7f00',
  'Boxe':'#cab2d6',
  'Esgrima':'#cab2d6',
  'Judô':'#cab2d6',
  'Luta':'#cab2d6',
  'Taekwondo':'#cab2d6',
  'Hóquei':'#FFF0AA',
  'Vôlei':'#fdbf6f',
  'Vôlei de praia':'#fdbf6f',
  'Futebol':'#fccde5',
  'Tênis':'#a6cee3',
  'Badminton':'gray',
  'Ginástica':'gray',
  'Golfe':'gray',
  'Handebol':'gray',
  'Rugby':'gray'
}

var l_esportes = [],
    l_cores = []

for (esporte in cores) {
  l_esportes.push(esporte);
  l_cores.push(cores[esporte]);
}

var ordinal = d3.scaleOrdinal()
    .domain(l_esportes)
    .range(l_cores);


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

  node.on('mouseover', function(d) {
    div.transition()
        .duration(200)
        .style("opacity", 0.9);
          div.html("<b>" + d.esporte + " </b></br> " +"<div class='minicontainer'><div><img id='img_twitter' src="+d.imagem+"></div><div class='textim'>" + d.nome + " (@"+d.usuario+")<br/>Número de atletas seguidores: "+d.seguidores_atletas+"</div></div>")
        div.style("left", (d3.event.pageX - 20) + "px")
          .style("top", (d3.event.pageY - 50) + "px")
          .style('background', cores[d.esporte])
      })

  node.on('mousemove', function(d) {
      div.style("left", (d3.event.pageX - 20) + "px")
        .style("top", (d3.event.pageY - 50) + "px");
  })

  node.on("mouseout", function(d) {
      div.transition()
        .duration(500)
        .style("opacity", 0);
  });

  simulation
      .nodes(graph.nodes)
      .on("tick", ticked);

  simulation.force("link")
      .links(graph.links);


  var legend = svg.selectAll(".legend")
    .data(l_esportes)
    .enter().append("g")
      .attr("class", "legend")
      .attr("transform", function(d, i) { return "translate(-15," + (i*20 )+ ")"; });

  legend.append("rect")
      .attr("x", width - 18)
      .attr("width", 18)
      .attr("height", 18)
      .attr("fill", function (d) { return cores[d]});

  legend.append("text")
      .attr("x", width - 24)
      .attr("y", 9)
      .attr("dy", ".35em")
      .attr("text-anchor", "end")
      .attr('stroke','black')
      .style("font-family", "Helvetica")
      .style("font-weight", "100")
      .style("font-size", "14px")


      .text(function(d) { return d; });

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
