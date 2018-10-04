define(function (){
  camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );
  camera.position.x = cameraPosition[0].x;
  camera.position.y = cameraPosition[0].y;
  camera.position.z = cameraPosition[0].z;
	camera.lookAt( new THREE.Vector3( 2065, 100, 0 ) );
	// camera.up = new THREE.Vector3( 0, .5, -.5 );
  camera.updateProjectionMatrix();
	camera.userData.animation = [];
	for (var i = 0; i <= cameraAnimationFrames; i++) {
		camera.userData.animation.push({
			x: cameraPosition[0].x,
			y: cameraPosition[0].y - ((cameraPosition[0].y - cameraPosition[1].y) * (i)/(cameraAnimationFrames)),
			z: cameraPosition[0].z - ((cameraPosition[0].z - cameraPosition[1].z) * (i)/(cameraAnimationFrames))
		});
	}
	camera.userData.lookAt = [];
	for (var i = 0; i <= cameraAnimationFrames; i++) {
		if (i <= cameraAnimationFrames / 2) {
			camera.userData.lookAt.push({
				x: lookAt[0].x,
				y: lookAt[0].y - ((lookAt[0].y - lookAt[1].y) * (i*2)/(cameraAnimationFrames)),
				z: lookAt[0].z - ((lookAt[0].z - lookAt[1].z) * (i*2)/(cameraAnimationFrames)),
			});
		} else {
			camera.userData.lookAt.push({
				x: lookAt[1].x,
				y: lookAt[1].y - ((lookAt[1].y - lookAt[2].y) * (i*2)/(cameraAnimationFrames)),
				z: lookAt[1].z - ((lookAt[1].z - lookAt[2].z) * (i*2)/(cameraAnimationFrames)),
			});
		}
	}

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

	var xLabels = [
		[scaleYears(1880), 5, -1],
		[scaleYears(1890), 5, -1],
		[scaleYears(1900), 5, -1],
		[scaleYears(1910), 5, -1],
		[scaleYears(1920), 5, -1],
		[scaleYears(1930), 5, -1],
		[scaleYears(1940), 5, -1],
		[scaleYears(1950), 5, -1],
		[scaleYears(1960), 5, -1],
		[scaleYears(1970), 5, -1],
		[scaleYears(1980), 5, -1],
		[scaleYears(1990), 5, -1],
		[scaleYears(2000), 5, -1],
		[scaleYears(2010), 5, -1]
	];
	var yLabels = [
		[scaleYears(1875), 10, -1],
		[scaleYears(1875), 20, -1],
		[scaleYears(1875), 30, -1],
		[scaleYears(1875), 40, -1],
		[scaleYears(1875), 50, -1],
		[scaleYears(1875), 60, -1],
		[scaleYears(1875), 70, -1],
		[scaleYears(1875), 80, -1],
		[scaleYears(1875), 90, -1],
		[scaleYears(1875), 100, -1],
		[scaleYears(1875), 110, -1],
		[scaleYears(1875), 120, -1],
		[scaleYears(1875), 130, -1],
		[scaleYears(1875), 140, -1],
		[scaleYears(1875), 150, -1],
		[scaleYears(1875), 160, -1],
		[scaleYears(1875), 170, -1]
	];
	var zLabels = [
		[scaleYears(1875), -1, scaleZ(1)],
		[scaleYears(1875), -1, scaleZ(2)],
		[scaleYears(1875), -1, scaleZ(3)],
		[scaleYears(1875), -1, scaleZ(4)],
		[scaleYears(1875), -1, scaleZ(5)],
		[scaleYears(1875), -1, scaleZ(6)],
		[scaleYears(1875), -1, scaleZ(7)],
		[scaleYears(1875), -1, scaleZ(8)],
		[scaleYears(1875), -1, scaleZ(9)],
		[scaleYears(1875), -1, scaleZ(10)],
		[scaleYears(1875), -1, scaleZ(11)]
	];
	var lines0 = [
		[[scaleYears(1875), 10, -1], [scaleYears(2010), 10, -1]],
		[[scaleYears(1875), 20, -1], [scaleYears(2010), 20, -1]],
		[[scaleYears(1875), 30, -1], [scaleYears(2010), 30, -1]],
		[[scaleYears(1875), 40, -1], [scaleYears(2010), 40, -1]],
		[[scaleYears(1875), 50, -1], [scaleYears(2010), 50, -1]],
		[[scaleYears(1875), 60, -1], [scaleYears(2010), 60, -1]],
		[[scaleYears(1875), 70, -1], [scaleYears(2010), 70, -1]],
		[[scaleYears(1875), 80, -1], [scaleYears(2010), 80, -1]],
		[[scaleYears(1875), 90, -1], [scaleYears(2010), 90, -1]],
		[[scaleYears(1875), 100, -1], [scaleYears(2010), 100, -1]],
		[[scaleYears(1875), 110, -1], [scaleYears(2010), 110, -1]],
		[[scaleYears(1875), 120, -1], [scaleYears(2010), 120, -1]],
		[[scaleYears(1875), 130, -1], [scaleYears(2010), 130, -1]],
		[[scaleYears(1875), 140, -1], [scaleYears(2010), 140, -1]],
		[[scaleYears(1875), 150, -1], [scaleYears(2010), 150, -1]],
		[[scaleYears(1875), 160, -1], [scaleYears(2010), 160, -1]],
		[[scaleYears(1875), 170, -1], [scaleYears(2010), 170, -1]],
		[[scaleYears(1880), 5, -1], [scaleYears(1880), 170, -1]],
		[[scaleYears(1890), 5, -1], [scaleYears(1890), 170, -1]],
		[[scaleYears(1900), 5, -1], [scaleYears(1900), 170, -1]],
		[[scaleYears(1910), 5, -1], [scaleYears(1910), 170, -1]],
		[[scaleYears(1920), 5, -1], [scaleYears(1920), 170, -1]],
		[[scaleYears(1930), 5, -1], [scaleYears(1930), 170, -1]],
		[[scaleYears(1940), 5, -1], [scaleYears(1940), 170, -1]],
		[[scaleYears(1950), 5, -1], [scaleYears(1950), 170, -1]],
		[[scaleYears(1960), 5, -1], [scaleYears(1960), 170, -1]],
		[[scaleYears(1970), 5, -1], [scaleYears(1970), 170, -1]],
		[[scaleYears(1980), 5, -1], [scaleYears(1980), 170, -1]],
		[[scaleYears(1990), 5, -1], [scaleYears(1990), 170, -1]],
		[[scaleYears(2000), 5, -1], [scaleYears(2000), 170, -1]],
		[[scaleYears(2010), 5, -1], [scaleYears(2010), 170, -1]]
	];
	var lines1 = [
		[[scaleYears(1875), -1, scaleZ(1)], [scaleYears(2010), -1, scaleZ(1)]],
		[[scaleYears(1875), -1, scaleZ(2)], [scaleYears(2010), -1, scaleZ(2)]],
		[[scaleYears(1875), -1, scaleZ(3)], [scaleYears(2010), -1, scaleZ(3)]],
		[[scaleYears(1875), -1, scaleZ(4)], [scaleYears(2010), -1, scaleZ(4)]],
		[[scaleYears(1875), -1, scaleZ(5)], [scaleYears(2010), -1, scaleZ(5)]],
		[[scaleYears(1875), -1, scaleZ(6)], [scaleYears(2010), -1, scaleZ(6)]],
		[[scaleYears(1875), -1, scaleZ(7)], [scaleYears(2010), -1, scaleZ(7)]],
		[[scaleYears(1875), -1, scaleZ(8)], [scaleYears(2010), -1, scaleZ(8)]],
		[[scaleYears(1875), -1, scaleZ(9)], [scaleYears(2010), -1, scaleZ(9)]],
		[[scaleYears(1875), -1, scaleZ(10)], [scaleYears(2010), -1, scaleZ(10)]],
		[[scaleYears(1875), -1, scaleZ(11)], [scaleYears(2010), -1, scaleZ(11)]],
		[[scaleYears(1880), -1, scaleZ(0.5)], [scaleYears(1880), -1, scaleZ(11)]],
		[[scaleYears(1890), -1, scaleZ(0.5)], [scaleYears(1890), -1, scaleZ(11)]],
		[[scaleYears(1900), -1, scaleZ(0.5)], [scaleYears(1900), -1, scaleZ(11)]],
		[[scaleYears(1910), -1, scaleZ(0.5)], [scaleYears(1910), -1, scaleZ(11)]],
		[[scaleYears(1920), -1, scaleZ(0.5)], [scaleYears(1920), -1, scaleZ(11)]],
		[[scaleYears(1930), -1, scaleZ(0.5)], [scaleYears(1930), -1, scaleZ(11)]],
		[[scaleYears(1940), -1, scaleZ(0.5)], [scaleYears(1940), -1, scaleZ(11)]],
		[[scaleYears(1950), -1, scaleZ(0.5)], [scaleYears(1950), -1, scaleZ(11)]],
		[[scaleYears(1960), -1, scaleZ(0.5)], [scaleYears(1960), -1, scaleZ(11)]],
		[[scaleYears(1970), -1, scaleZ(0.5)], [scaleYears(1970), -1, scaleZ(11)]],
		[[scaleYears(1980), -1, scaleZ(0.5)], [scaleYears(1980), -1, scaleZ(11)]],
		[[scaleYears(1990), -1, scaleZ(0.5)], [scaleYears(1990), -1, scaleZ(11)]],
		[[scaleYears(2000), -1, scaleZ(0.5)], [scaleYears(2000), -1, scaleZ(11)]],
		[[scaleYears(2010), -1, scaleZ(0.5)], [scaleYears(2010), -1, scaleZ(11)]]
	];
	var material = new THREE.LineBasicMaterial({
		color:0x999999,
		transparent: true,
		opacity: 1
	});
	for (var i = 0; i < lines0.length; i++) {
		var lineGeo = new THREE.Geometry();
		lineGeo.vertices.push(
			new THREE.Vector3( lines0[i][0][0], lines0[i][0][1], lines0[i][0][2] ),
			new THREE.Vector3( lines0[i][1][0], lines0[i][1][1], lines0[i][1][2] )
		);
		var line = new THREE.Line( lineGeo, material );
		linesZero.push(line);
		scene.add(line);

	}
	var material = new THREE.LineBasicMaterial({
		color:0x999999,
		transparent: true,
		opacity: 0
	});
	for (var i = 0; i < lines1.length; i++) {
		var lineGeo = new THREE.Geometry();
		lineGeo.vertices.push(
			new THREE.Vector3( lines1[i][0][0], lines1[i][0][1], lines1[i][0][2] ),
			new THREE.Vector3( lines1[i][1][0], lines1[i][1][1], lines1[i][1][2] )
		);
		var line = new THREE.Line( lineGeo, material );
		linesOne.push(line);
		scene.add(line);

	}

	var pane = document.createElement("Div");
	pane.setAttribute("id", "pane");
	document.body.appendChild( pane );

	var paneTitle = document.createElement("H2");
	paneTitle.setAttribute("id", "pane-title");
	var titleText = document.createTextNode( "Hover on a point to see more details" );
	paneTitle.appendChild( titleText );
	pane.appendChild( paneTitle );

	var header = document.createElement("Div");
	header.setAttribute("id", "header");
	document.body.appendChild( header );

	var title = document.createElement("H1");
	title.setAttribute("id", "title");
	var titleText = document.createTextNode( "Distribution of Career Batting Wins Above Replacement (WAR) for Hall of Fame Position Players" );
	title.appendChild( titleText );
	header.appendChild( title );

  window.addEventListener( 'resize', onWindowResize, false );
  // document.addEventListener( 'mousedown', onDocumentMouseDown, false );
  document.addEventListener( 'mousemove', onDocumentMouseMove, false );
	// document.addEventListener( 'touchend', onDocumentMouseMove, false )
  // document.addEventListener( 'mouseleave', onDocumentMouseLeave, false );

	for (var i = 0; i < xLabels.length; i++) {
		var pos = new THREE.Vector3(
			xLabels[i][0] - camera.position.x,
			xLabels[i][1] - camera.position.y,
			xLabels[i][2] - camera.position.z
		);
		var posXY = pos.applyMatrix4(camera.projectionMatrix);
		var left = pos.x * window.innerWidth / 2 + window.innerWidth / 2;
		var bottom = pos.y * window.innerHeight / 2 + window.innerHeight / 2;
		var box = document.createElement("DIV");
		box.setAttribute("class", "x-label");
		box.style.left = left;
		box.style.bottom = bottom;
		var label = document.createElement("P");
		var labelText = document.createTextNode( 10 * i + 1880 );
		box.appendChild( label );
		label.appendChild( labelText );
		document.body.appendChild( box );
	}
	for (var i = 0; i < yLabels.length; i++) {
		var pos = new THREE.Vector3(
			yLabels[i][0] - camera.position.x,
			yLabels[i][1] - camera.position.y,
			yLabels[i][2] - camera.position.z
		);
		var posXY = pos.applyMatrix4(camera.projectionMatrix);
		var left = posXY.x * window.innerWidth / 2 + window.innerWidth / 2;
		var bottom = posXY.y * window.innerHeight / 2 + window.innerHeight / 2;
		if (i == Math.floor(yLabels.length / 2)) {
			var axisLabelDiv = document.createElement("DIV");
			var axisLabelP = document.createElement("P");
			var axisLabelText = document.createTextNode("Career WAR");
			axisLabelP.appendChild( axisLabelText );
			axisLabelDiv.setAttribute("id", "y-axis-label");
			axisLabelDiv.appendChild( axisLabelP );
			axisLabelDiv.style.left = left;
			axisLabelDiv.style.bottom = bottom;
			document.body.appendChild( axisLabelDiv );
		}

		var box = document.createElement("DIV");
		box.setAttribute("class", "y-label");
		box.style.left = left;
		box.style.bottom = bottom;
		var label = document.createElement("P");
		var labelText = document.createTextNode( 10 * i + 10 );
		box.appendChild( label );
		label.appendChild( labelText );
		document.body.appendChild( box );
	}

	for (var i = 0; i < zLabels.length; i++) {
		var pos = new THREE.Vector3(
			zLabels[i][0] - cameraPosition[1].x,
			zLabels[i][2] - cameraPosition[1].z,
			zLabels[i][1] - cameraPosition[1].y
		);
		var posXY = pos.applyMatrix4(camera.projectionMatrix);
		var left = posXY.x * window.innerWidth / 2 + window.innerWidth / 2;
		var bottom = posXY.y * window.innerHeight / 2 + window.innerHeight / 2;
		if (i == Math.floor(zLabels.length / 2)) {
			var axisLabelDiv = document.createElement("DIV");
			var axisLabelP = document.createElement("P");
			var axisLabelText = document.createTextNode("Career WAR per 162 game season");
			axisLabelP.appendChild( axisLabelText );
			axisLabelDiv.setAttribute("id", "z-axis-label");
			axisLabelDiv.appendChild( axisLabelP );
			axisLabelDiv.style.left = left;
			axisLabelDiv.style.bottom = bottom;
			document.body.appendChild( axisLabelDiv );
		}

		var box = document.createElement("DIV");
		box.setAttribute("class", "z-label");
		box.style.left = left;
		box.style.bottom = bottom;
		var label = document.createElement("P");
		var labelText = document.createTextNode( 11- 1 * i );
		box.appendChild( label );
		label.appendChild( labelText );
		document.body.appendChild( box );
	}
});
