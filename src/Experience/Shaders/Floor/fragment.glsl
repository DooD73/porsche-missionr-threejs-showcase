uniform float uTime;
uniform vec3 uColor;

varying vec2 vUv;

void main() 
{
    float strength = 1.0 - step(0.01, abs(distance(vUv, vec2(0.5)) - (sin(uTime * 0.5) * 0.25 + 0.25)));
    gl_FragColor = vec4(uColor, strength);

    #include <color_fragment>
}