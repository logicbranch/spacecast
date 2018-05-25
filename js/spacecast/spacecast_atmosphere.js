var Spacecast3D = Spacecast3D || {}

// based on http://stemkoski.blogspot.fr/2013/07/shaders-in-threejs-glow-and-halo.html

Spacecast3D.Atmosphere = {
  getVertexShader: function() {
  	return [
  		'varying vec3	vVertexWorldPosition;',
  		'varying vec3	vVertexNormal;',

  		'void main(){',
  		'	vVertexNormal	= normalize(normalMatrix * normal);',

  		'	vVertexWorldPosition	= (modelMatrix * vec4(position, 1.0)).xyz;',

  		'	// set gl_Position',
  		'	gl_Position	= projectionMatrix * modelViewMatrix * vec4(position, 1.0);',
  		'}',

  	].join('\n')
  },

  getFragmentShader: function() {
    return [
  		'uniform vec3	glowColor;',
  		'uniform float	coeficient;',
  		'uniform float	power;',

  		'varying vec3	vVertexNormal;',
  		'varying vec3	vVertexWorldPosition;',

  		'void main(){',
  		'	vec3 worldCameraToVertex= vVertexWorldPosition - cameraPosition;',
  		'	vec3 viewCameraToVertex	= (viewMatrix * vec4(worldCameraToVertex, 0.0)).xyz;',
  		'	viewCameraToVertex	= normalize(viewCameraToVertex);',
  		'	float intensity		= pow(coeficient + dot(vVertexNormal, viewCameraToVertex), power);',
  		'	gl_FragColor		= vec4(glowColor, intensity);',
  		'}',
  	].join('\n')
  },

  createMaterial: function(color) {
  	var material	= new THREE.ShaderMaterial({
  		uniforms: {
  			coeficient	: {
  				type	: "f",
  				value	: 1
  			},
  			power		: {
  				type	: "f",
  				value	: 2
  			},
  			glowColor	: {
  				type	: "c",
  				value	: new THREE.Color(color)
  			},
  		},
  		vertexShader	: Spacecast3D.Atmosphere.getVertexShader(),
  		fragmentShader	: Spacecast3D.Atmosphere.getFragmentShader(),
  		transparent	: true,
  		depthWrite	: false,
  	});
  	return material
  }
}
