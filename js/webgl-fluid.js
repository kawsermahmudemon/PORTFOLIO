/* ══════════════════════════════════════════
   WEBGL FLUID RIPPLE BACKGROUND
   Minimalist WebGL Shader for background distortion
   ══════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('fluid-canvas');
  if (!canvas) return;
  
  // Disable on mobile for performance
  if (window.matchMedia("(pointer: coarse)").matches || window.innerWidth < 1024) {
    canvas.style.display = 'none';
    return;
  }

  const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
  if (!gl) return;

  // Resize canvas
  let width, height;
  function resize() {
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;
    gl.viewport(0, 0, width, height);
  }
  window.addEventListener('resize', resize);
  resize();

  // Shaders
  const vsSource = `
    attribute vec2 position;
    varying vec2 vUv;
    void main() {
      vUv = position * 0.5 + 0.5;
      vUv.y = 1.0 - vUv.y;
      gl_Position = vec4(position, 0.0, 1.0);
    }
  `;

  // Abstract liquid ripple shader
  const fsSource = `
    precision highp float;
    varying vec2 vUv;
    uniform float uTime;
    uniform vec2 uMouse;
    uniform vec2 uResolution;
    
    // Noise function
    vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
    vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
    vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }
    float snoise(vec2 v) {
      const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
      vec2 i  = floor(v + dot(v, C.yy) );
      vec2 x0 = v -   i + dot(i, C.xx);
      vec2 i1;
      i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
      vec4 x12 = x0.xyxy + C.xxzz;
      x12.xy -= i1;
      i = mod289(i);
      vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 )) + i.x + vec3(0.0, i1.x, 1.0 ));
      vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
      m = m*m ;
      m = m*m ;
      vec3 x = 2.0 * fract(p * C.www) - 1.0;
      vec3 h = abs(x) - 0.5;
      vec3 ox = floor(x + 0.5);
      vec3 a0 = x - ox;
      m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
      vec3 g;
      g.x  = a0.x  * x0.x  + h.x  * x0.y;
      g.yz = a0.yz * x12.xz + h.yz * x12.yw;
      return 130.0 * dot(m, g);
    }

    void main() {
      vec2 st = gl_FragCoord.xy/uResolution.xy;
      st.x *= uResolution.x/uResolution.y;
      
      // Mouse interaction
      vec2 mouse = uMouse;
      mouse.x *= uResolution.x/uResolution.y;
      float dist = distance(st, mouse);
      float mouseEffect = smoothstep(0.3, 0.0, dist);
      
      // Liquid distortion
      vec2 pos = vec2(st * 3.0);
      float n = snoise(pos - uTime * 0.2);
      n += snoise(pos * 2.0 + uTime * 0.3) * 0.5;
      
      // Add mouse ripple
      n += mouseEffect * 2.0 * sin(dist * 20.0 - uTime * 5.0);
      
      // Colors based on theme CSS vars implicitly (darkish liquid)
      vec3 colorA = vec3(0.05, 0.05, 0.08); // Dark bg
      vec3 colorB = vec3(0.2, 0.15, 0.4); // Purple/indigo tint
      
      float mixVal = smoothstep(-1.0, 1.0, n);
      vec3 finalColor = mix(colorA, colorB, mixVal);
      
      // If it's a light theme, we'd ideally read CSS, but shaders can't easily.
      // We will make the liquid highly transparent to let the CSS background show through.
      float alpha = mixVal * 0.15 + mouseEffect * 0.2;
      
      gl_FragColor = vec4(finalColor, alpha);
    }
  `;

  function compileShader(type, source) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      console.error(gl.getShaderInfoLog(shader));
      gl.deleteShader(shader);
      return null;
    }
    return shader;
  }

  const vertexShader = compileShader(gl.VERTEX_SHADER, vsSource);
  const fragmentShader = compileShader(gl.FRAGMENT_SHADER, fsSource);

  const program = gl.createProgram();
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);
  gl.useProgram(program);

  // Buffer
  const positionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
    -1.0, -1.0,
     1.0, -1.0,
    -1.0,  1.0,
    -1.0,  1.0,
     1.0, -1.0,
     1.0,  1.0
  ]), gl.STATIC_DRAW);

  const positionLocation = gl.getAttribLocation(program, "position");
  gl.enableVertexAttribArray(positionLocation);
  gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

  // Uniforms
  const uTimeLoc = gl.getUniformLocation(program, "uTime");
  const uMouseLoc = gl.getUniformLocation(program, "uMouse");
  const uResLoc = gl.getUniformLocation(program, "uResolution");

  let mouse = { x: 0.5, y: 0.5 };
  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX / window.innerWidth;
    mouse.y = 1.0 - (e.clientY / window.innerHeight);
  });

  // Enable alpha blending
  gl.enable(gl.BLEND);
  gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

  let startTime = performance.now();
  function render(time) {
    const elapsed = (time - startTime) / 1000;
    
    gl.uniform1f(uTimeLoc, elapsed);
    gl.uniform2f(uMouseLoc, mouse.x, mouse.y);
    gl.uniform2f(uResLoc, width, height);

    gl.drawArrays(gl.TRIANGLES, 0, 6);
    requestAnimationFrame(render);
  }
  requestAnimationFrame(render);
});
