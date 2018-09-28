var container, stats;
var camera, scene, renderer;
var particleMaterial;
var raycaster;
var mouse;
var objects = [];
var particleSystem = new THREE.Group();
// var highlight = undefined;
var data;
var meta = [];
var dataPane;
var loader = new THREE.FontLoader();
var font;
var scaleFactor = 2.2;
var thisPoint = undefined;
loader.load(
	// resource URL
	'static/helvetiker_regular.typeface.json',

	// onLoad callback
	function ( font ) {
		// do something with the font
		font = font;
    // console.log(font);
    // console.log(new THREE.Font(font.data));
	},

	// onProgress callback
	function ( xhr ) {
		console.log( (xhr.loaded / xhr.total * 100) + '% loaded' );
	},

	// onError callback
	function ( err ) {
		console.log( 'An error happened' );
	}
);

init();
loadData(buildScene);
animate();

function init() {
  camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );
  camera.position.z = 160;
  camera.position.y = 100;
  camera.position.x = 2065;
  camera.updateProjectionMatrix();
	console.log(camera.position);

  scene = new THREE.Scene();
  scene.background = new THREE.Color( 0xf0f0f0 );

  raycaster = new THREE.Raycaster();

  mouse = new THREE.Vector2();

  renderer = new THREE.WebGLRenderer();
  renderer.setSize( window.innerWidth, window.innerHeight );
  document.body.appendChild( renderer.domElement );

  var light = new THREE.DirectionalLight( 0xffffff, 1 );
  light.position.set( 1, -1, 1 ).normalize();
  scene.add( light );
  light = new THREE.DirectionalLight( 0x222222, 1 );
  light.position.set( -1, 1, -1 ).normalize();
  scene.add( light );

	var lines = [
		[[scaleYears(1875), 10, 0], [scaleYears(2010), 10, 0]],
		[[scaleYears(1875), 20, 0], [scaleYears(2010), 20, 0]],
		[[scaleYears(1875), 30, 0], [scaleYears(2010), 30, 0]],
		[[scaleYears(1875), 40, 0], [scaleYears(2010), 40, 0]],
		[[scaleYears(1875), 50, 0], [scaleYears(2010), 50, 0]],
		[[scaleYears(1875), 60, 0], [scaleYears(2010), 60, 0]],
		[[scaleYears(1875), 70, 0], [scaleYears(2010), 70, 0]],
		[[scaleYears(1875), 80, 0], [scaleYears(2010), 80, 0]],
		[[scaleYears(1875), 90, 0], [scaleYears(2010), 90, 0]],
		[[scaleYears(1875), 100, 0], [scaleYears(2010), 100, 0]],
		[[scaleYears(1875), 110, 0], [scaleYears(2010), 110, 0]],
		[[scaleYears(1875), 120, 0], [scaleYears(2010), 120, 0]],
		[[scaleYears(1875), 130, 0], [scaleYears(2010), 130, 0]],
		[[scaleYears(1875), 140, 0], [scaleYears(2010), 140, 0]],
		[[scaleYears(1875), 150, 0], [scaleYears(2010), 150, 0]],
		[[scaleYears(1875), 160, 0], [scaleYears(2010), 160, 0]],
		[[scaleYears(1875), 170, 0], [scaleYears(2010), 170, 0]],
		[[scaleYears(1880), 5, 0], [scaleYears(1880), 170, 0]],
		[[scaleYears(1890), 5, 0], [scaleYears(1890), 170, 0]],
		[[scaleYears(1900), 5, 0], [scaleYears(1900), 170, 0]],
		[[scaleYears(1910), 5, 0], [scaleYears(1910), 170, 0]],
		[[scaleYears(1920), 5, 0], [scaleYears(1920), 170, 0]],
		[[scaleYears(1930), 5, 0], [scaleYears(1930), 170, 0]],
		[[scaleYears(1940), 5, 0], [scaleYears(1940), 170, 0]],
		[[scaleYears(1950), 5, 0], [scaleYears(1950), 170, 0]],
		[[scaleYears(1960), 5, 0], [scaleYears(1960), 170, 0]],
		[[scaleYears(1970), 5, 0], [scaleYears(1970), 170, 0]],
		[[scaleYears(1980), 5, 0], [scaleYears(1980), 170, 0]],
		[[scaleYears(1990), 5, 0], [scaleYears(1990), 170, 0]],
		[[scaleYears(2000), 5, 0], [scaleYears(2000), 170, 0]],
		[[scaleYears(2010), 5, 0], [scaleYears(2010), 170, 0]]
	];
	var material = new THREE.LineBasicMaterial({
		color: 0x999999
	});
	for (var i = 0; i < lines.length; i++) {
		var lineGeo = new THREE.Geometry();
		lineGeo.vertices.push(
			new THREE.Vector3( lines[i][0][0], lines[i][0][1], lines[i][0][2] ),
			new THREE.Vector3( lines[i][1][0], lines[i][1][1], lines[i][1][2] )
		);
		var line = new THREE.Line( lineGeo, material );
		scene.add(line);
	}

	var pane = document.createElement("Div");
	pane.setAttribute("id", "pane");
	document.body.appendChild( pane );

	var title = document.createElement("H2");
	title.setAttribute("id", "title");
	var titleText = document.createTextNode( "Click on a point to see more details" );
	title.appendChild( titleText );
	pane.appendChild( title );

	var xAxis = document.createElement("Div");
	xAxis.setAttribute("id", "x-axis");
	document.body.appendChild( xAxis );
	// var xLabel = document.createElement("P");
	// xLabel.setAttribute("class", "x-label");
	// xAxis.appendChild( xlabel );
	for (var i = 0; i < 14; i++) {
		var xLabel = document.createElement("SPAN");
		xLabel.setAttribute("class", "x-label");
		xAxis.appendChild( xLabel );
		var xLabelText = document.createTextNode( 10 * i + 1880 );
		xLabel.appendChild( xLabelText );
	}

	var yAxis = document.createElement("Div");
	yAxis.setAttribute("id", "y-axis");
	document.body.appendChild( yAxis );
	// var xLabel = document.createElement("P");
	// xLabel.setAttribute("class", "x-label");
	// xAxis.appendChild( xlabel );
	for (var i = 0; i < 17; i++) {
		var yLabel = document.createElement("P");
		yLabel.setAttribute("class", "y-label");
		yAxis.appendChild( yLabel );
		var yLabelText = document.createTextNode( 170 - 10 * i );
		yLabel.appendChild( yLabelText );
	}

  window.addEventListener( 'resize', onWindowResize, false );
  // document.addEventListener( 'mousedown', onDocumentMouseDown, false );
  document.addEventListener( 'mousemove', onDocumentMouseMove, false );
  // document.addEventListener( 'mouseleave', onDocumentMouseLeave, false );
}

function loadData(cb) {
  loadJSON(function(response) {
    buildScene(parseData(response));
  })
}

function buildScene(data) {

  var minYear = determineMinYear(data);
  var maxYear = determineMaxYear(data);
  var years = maxYear - minYear + 1;
  midYear = Math.ceil( years / 2 ) + minYear;
  // camera.position.x = midYear + years * scaleFactor / 2;

  var barsInScreen = 21; // 80
  var scale = scaleYears(barsInScreen, years);
  var offsetL = 21 / 2;

  var playerGeo;
	// var points = new THREE.BufferGeometry();
	// var positions = [];
	// var colors = [];
	// var sizes = [];
	var color = new THREE.Color();

  for (var i = 0; i < data.length; i++) {
		var points = new THREE.BufferGeometry();
		var positions = [];
		var colors = [];
		var sizes = [];
    // var playerColor = new THREE.MeshBasicMaterial( { color: Math.random() * 0xffffff } );
    var careerWar = 0;
		var playerPoint;
    var careerGames = 0;
    var warPer162 = 0
    var playerGeos;
    var centroid = 0;
    var theta = Math.PI / data[i].stats.length / 2;
    for (var j = 0; j < data[i].stats.length; j++) {
      careerWar += data[i].stats[j].war;
      careerGames += data[i].stats[j].games;
      var absWar = Math.sqrt(data[i].stats[j].war * data[i].stats[j].war);
      centroid += data[i].stats[j].war * ( data[i].stats[j].year - data[i].stats[0].year + 1 );
    }
    warPer162 = careerWar * 162 / careerGames;
    meta.push(Object.assign(
      {},
      {
        name: data[i].name,
        careerWar: careerWar,
        careerGames: careerGames,
        warPer162: warPer162,
        data: data[i],
        position: {
          x: scaleYears(centroid / careerWar + data[i].stats[0].year),
          y: careerWar
        }
      }
    ));

		positions.push( meta[i].position.x );
		positions.push( meta[i].position.y );
		positions.push( 0 );
		color.setRGB( meta[i].warPer162 / 10, 0, 1 - meta[i].warPer162 / 10 );
		colors.push( 1, 1, 0 );
		sizes.push( 20 );


		points.addAttribute( 'position', new THREE.Float32BufferAttribute( positions, 3 ) );
		points.addAttribute( 'color', new THREE.Float32BufferAttribute( colors, 3 ) );
		points.addAttribute( 'size', new THREE.Float32BufferAttribute( sizes, 1 ) );

		var material = new THREE.PointsMaterial({ size: 4 });
		material.color = [ color.r, color.g, color.b ];
		material.needsUpdate = true;
		playerPoint = new THREE.Points( points, material );
		playerPoint.index = i;
		particleSystem.children.push( playerPoint );
		scene.add( playerPoint );
  }

}

function appendText(data) {
	// console.log(data.data.stats);
	if (document.getElementById("pane")) {
		document.getElementById("pane").outerHTML = "";
	}
  var pane = document.createElement("Div");
  pane.setAttribute("id", "pane");
  document.body.appendChild( pane );

	var title = document.createElement("H2");
	title.setAttribute("id", "title");
	var titleText = document.createTextNode( data.name );
	title.appendChild( titleText );
	pane.appendChild( title );

	var stat4 = document.createElement("DIV");
	stat4.setAttribute("class", "years");
	pane.appendChild( stat4 );

	var statName = document.createElement("P");
	stat4.appendChild( statName );
	var statNameText = document.createTextNode( "Years Active: " );
	statName.appendChild( statNameText );

	var statValHolder = document.createElement("P");
	stat4.appendChild( statValHolder );

	var statVal = document.createElement("SPAN");
	var statNameVal = document.createTextNode( "( " );
	statValHolder.appendChild( statVal );
	statVal.appendChild( statNameVal );
	var statVal = document.createElement("SPAN");
	var statNameVal = document.createTextNode( data.data.stats[0].year );
	statValHolder.appendChild( statVal );
	statVal.appendChild( statNameVal );
	var statVal = document.createElement("SPAN");
	var statNameVal = document.createTextNode( " - " );
	statValHolder.appendChild( statVal );
	statVal.appendChild( statNameVal );
	var statVal = document.createElement("SPAN");
	var statNameVal = document.createTextNode( data.data.stats[data.data.stats.length -1].year );
	statValHolder.appendChild( statVal );
	statVal.appendChild( statNameVal );
	var statVal = document.createElement("SPAN");
	var statNameVal = document.createTextNode( " )" );
	statValHolder.appendChild( statVal );
	statVal.appendChild( statNameVal );

	var stat1 = document.createElement("P");
	stat1.setAttribute("class", "stats");
	pane.appendChild( stat1 );

	var statName = document.createElement("SPAN");
	var statNameText = document.createTextNode( "Career WAR: " );
	stat1.appendChild( statName );
	statName.appendChild( statNameText );
	var statVal = document.createElement("SPAN");
	var statNameVal = document.createTextNode( data.careerWar.toFixed(1) );
	statVal.setAttribute("class", "numbers");
	stat1.appendChild( statVal );
	statVal.appendChild( statNameVal );

	// var statName = document.createElement("SPAN");
	// var statNameText = document.createTextNode( "Career WAR: " );
	// stat.appendChild( statNameText );
	// var statVal = document.createElement("SPAN");
	// var statNameVal = document.createTextNode( data.careerWar.toFixed(1) );
	// stat.appendChild( statNameVal );

	var stat2 = document.createElement("P");
	stat2.setAttribute("class", "stats");
	pane.appendChild( stat2 );

	var statName = document.createElement("SPAN");
	var statNameText = document.createTextNode( "Career Games: " );
	stat2.appendChild( statName );
	statName.appendChild( statNameText );
	var statVal = document.createElement("SPAN");
	var statNameVal = document.createTextNode( data.careerGames );
	statVal.setAttribute("class", "numbers");
	stat2.appendChild( statVal );
	statVal.appendChild( statNameVal );

	var stat3 = document.createElement("P");
	stat3.setAttribute("class", "stats");
	pane.appendChild( stat3 );

	var statName = document.createElement("SPAN");
	var statNameText = document.createTextNode( "WAR per 162: " );
	stat3.appendChild( statName );
	statName.appendChild( statNameText );
	var statVal = document.createElement("SPAN");
	var statNameVal = document.createTextNode( data.warPer162.toFixed(1) );
	statVal.setAttribute("class", "numbers");
	stat3.appendChild( statVal );
	statVal.appendChild( statNameVal );


}

function animate() {
  requestAnimationFrame( animate );

  // object.rotation.x += 0.01;
  // object.rotation.y += 0.01;
  raycaster.setFromCamera( mouse, camera );
  var intersects = raycaster.intersectObjects( objects );
  if ( intersects.length > 0 ) {
    // intersects[0].object.material.color.setHex( Math.random() * 0xffffff );
    for (var i = 0; i < intersects.length; i++) {
      // console.log(intersects[i].object.name, intersects[i].object.careerWar, intersects[i].object.warPer162);
    }
    // var particle = new THREE.Sprite( particleMaterial );
    // particle.position.copy( intersects[ 0 ].point );
    // particle.scale.x = particle.scale.y = 16;
    // scene.add( particle );
  }

  renderer.render( scene, camera );
}
//
// function onDocumentMouseMove( event ) {
//   event.preventDefault();
//   mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
//   mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
// }

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize( window.innerWidth, window.innerHeight );
}

// function onDocumentMouseEnter(event) {
//   event.preventDefault();
//
//   mouse.x = ( event.clientX / renderer.domElement.clientWidth ) * 2 - 1;
//   mouse.y = - ( event.clientY / renderer.domElement.clientHeight ) * 2 + 1;
// }
//
// function onDocumentMouseLeave( event ) {
//
// }

function onDocumentMouseMove( event ) {
  event.preventDefault();
	mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
	mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

  raycaster.setFromCamera( mouse, camera );
  var intersects = raycaster.intersectObject( particleSystem, true );
  if ( intersects.length > 0 ) {
		if ( thisPoint === undefined ) {
			thisPoint = intersects[0].object.index;
			particleSystem.children[thisPoint].material.size = 10;
			particleSystem.children[thisPoint].material.size.needsUpdate = true;
			// particleSystem.children[thisPoint].geometry.attributes.size.array = 10;
			// particleSystem.children[thisPoint].geometry.attributes.size.needsUpdate = true;
		}
		// console.log(particleSystem.children[thisPoint].geometry.attributes);
		if (intersects[0].object.index !== thisPoint) {
			// console.log('OLD POINT: ', particleSystem.children[thisPoint]);
			particleSystem.children[thisPoint].material.size = 4;
			particleSystem.children[thisPoint].material.size.needsUpdate = true;
			thisPoint = intersects[0].object.index;
			particleSystem.children[thisPoint].material.size = 10
			particleSystem.children[thisPoint].material.size.needsUpdate = true;

			thisPoint = intersects[0].object.index;
		}
		// var geometry = intersects[0].object.geometry;
		// var attributes = geometry.attributes;
		// if ( thisPoint != intersects[0].index ) {
		// 	// console.log(highlight);
		// 	console.log(particleSystem);
		// 	console.log(attributes);
		// 	highlight = intersects[0].index;
		// 	// console.log(attributes.size[highlight]);
		//
		// 	attributes.size.array = 10
		// 	attributes.size.needsUpdate = true;
		// }
    // var index = intersects[0].object.index;
		// console.log(intersects[0].index);
    // console.log(meta[intersects[0].object.index]);
  	// intersects[0].object.material.color.setHex( Math.random() * 0xffffff );

    // var pane = new THREE.PlaneBufferGeometry(20, 20, 1, 1)
    // var material = new THREE.MeshBasicMaterial( {color: 0x333333 } );
    // dataPane = new THREE.Mesh( pane, material );
    // dataPane.position.x = meta[index].position.x;
    // dataPane.position.y = meta[index].position.y;
    // dataPane.position.z = 10;
    // scene.add(dataPane);

    appendText(meta[thisPoint]);

    // console.log(font);

  	// var geometry = new THREE.TextGeometry( 'Hello three.js!', {
  	// 	font: font,
  	// 	size: 80,
  	// 	height: 1,
  	// 	curveSegments: 12,
  	// 	bevelEnabled: true,
  	// 	bevelThickness: 10,
  	// 	bevelSize: 8,
  	// 	bevelSegments: 5
  	// } );

    // var text = new THREE.Mesh(geometry, material);
    // text.position.x = meta[index].position.x;
    // text.position.y = meta[index].position.y;
    // text.position.z = 10;
    // scene.add(text);
  	// var particle = new THREE.Sprite( particleMaterial );
  	// particle.position.copy( intersects[ 0 ].point );
  	// particle.scale.x = particle.scale.y = 16;
  	// scene.add( particle );
  } else {
		// if (thisPoint !== undefined) {
		// 	particleSystem.children[thisPoint].material.size = 4;
		// 	particleSystem.children[thisPoint].material.size.needsUpdate = true;
		// 	thisPoint = undefined;
		// }
  }
  /*
  // Parse all the faces
  for ( var i in intersects ) {
  	intersects[ i ].face.material[ 0 ].color.setHex( Math.random() * 0xffffff | 0x80000000 );
  }
  */
}

function scaleYears(year) {
	return ( (year - 1871) * scaleFactor ) + 1871
}

function loadJSON(callback) {
   var xobj = new XMLHttpRequest();
       xobj.overrideMimeType("application/json");
   xobj.open('GET', 'static/players.json', true); // Replace 'my_data' with the path to your file || true/false for async/sync
   xobj.onreadystatechange = function () {
         if (xobj.readyState == 4 && xobj.status == "200") {
           // Required use of an anonymous callback as .open will NOT return a value but simply returns undefined in asynchronous mode
           callback(xobj.responseText);
         }
   };
   xobj.send(null);
}

function parseData(data) {
  var players = [];
  var thisPlayer;
  var thisCareer;
  var years = [];
  var unsortedYears = [];
  var sortedYears = [];
  var thisStats = [];
  var pop = [];
  var thisStatsByYear;
  var playerArray = JSON.parse(data);
	playerArray.splice(98, 1);

  for (var i = 0; i < playerArray.length; i++) {
    thisPlayer = JSON.parse(playerArray[i]);
    thisStats = thisPlayer.stats;
    thisCareer = JSON.parse(thisPlayer.career);

    unsortedYears = [];
    for (var j = 0; j < thisStats.length; j++) {
      unsortedYears.push(JSON.parse(thisStats[j]));
    }
    sortedYears = unsortedYears.sort(orderByYear);
    unsortedYears = sortedYears;

    for (var k = 0; k < sortedYears.length; k++) {
      pop = [];
      if (k > 0) {
        if (sortedYears[k].year == sortedYears[k-1].year) {
          sortedYears.splice(k-1, 1, Object.assign(
            {},
            sortedYears[k-1],
            {war: sortedYears[k].war + sortedYears[k-1].war},
            {games: sortedYears[k].games + sortedYears[k-1].games}
          ));
          pop.push(k);
        }
      }
      if (pop.length > 0) {
        for (var q = 0; q < pop.length; q++) {
          sortedYears.splice(pop[q], 1);
        }
      }
    }

    pop = [];
    for (var r = 0; r < sortedYears.length; r++) {
      if (r > 0) {
        if (sortedYears[r].year !== sortedYears[r-1].year + 1) {
          pop.push(r);
        }
      }
    }
    if (pop.length > 0) {
      for (var s = 0; s < pop.length; s++) {
        sortedYears.splice(pop[s], 0, Object.assign(
          {},
          {year: sortedYears[pop[s]].year - 1},
          {war: 0},
          {games: 0}
        ));
      }
    }

    players.push(Object.assign({}, {
      name: thisPlayer.name,
      career: thisCareer,
      stats: sortedYears
    }));
  }

  return players;
}

function orderByYear(a, b) {
  return a.year - b.year
}

function determineMinYear(data) {
  var minYear = 1950;
  for (var i = 0; i < data.length; i++) {
    // console.log(data[i]);
    for (var j = 0; j < data[i].stats.length; j++) {
      // console.log(data[i].stats[j]);
      if (minYear > data[i].stats[j].year) {
        minYear = data[i].stats[j].year;
      }
    }
  }
  return minYear;
}

function determineMaxYear(data) {
  var maxYear = 1950;
  for (var i = 0; i < data.length; i++) {
    for (var j = 0; j < data[i].stats.length; j++) {
      if (maxYear < data[i].stats[j].year) {
        maxYear = data[i].stats[j].year;
      }
    }
  }
  return maxYear;
}
// var scene = new THREE.Scene();
// var camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );
//
// var renderer = new THREE.WebGLRenderer();
// renderer.setSize( window.innerWidth, window.innerHeight );
// document.body.appendChild( renderer.domElement );
//
// window.addEventListener('resize', function() {
//   var width = window.innerWidth;
//   var height = window.innerHeight;
//   renderer.setSize( width / height );
//   camera.aspect( width / height );
//   camera.updateProjectionMatrix();
// });
//
// var geometry = new THREE.BoxGeometry( 1, 1, 1 );
// var material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
// var cube = new THREE.Mesh( geometry, material );
// scene.add( cube );
//
// camera.position.z = 5;
//
// var animate = function () {
//   requestAnimationFrame( animate );
//
//   cube.rotation.x += 0.01;
//   cube.rotation.y += 0.01;
//
//   renderer.render( scene, camera );
// };
//
//
//
// animate();
