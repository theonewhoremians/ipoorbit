'use client';
import {useEffect,useRef,useState} from 'react';
export default function Orbit({paused}:{paused:boolean}){
 const host=useRef<HTMLDivElement>(null);const pauseRef=useRef(paused);const [failed,setFailed]=useState(false);
 useEffect(()=>{pauseRef.current=paused},[paused]);
 useEffect(()=>{let dispose=()=>{};let cancelled=false;
 import('three').then(T=>{if(cancelled||!host.current)return;const el=host.current;
 let renderer:InstanceType<typeof T.WebGLRenderer>;try{renderer=new T.WebGLRenderer({alpha:true,antialias:true,powerPreference:'low-power'});}catch{setFailed(true);return;}
 renderer.setPixelRatio(Math.min(window.devicePixelRatio,1.7));renderer.setClearColor(0,0);el.appendChild(renderer.domElement);
 const scene=new T.Scene();const camera=new T.PerspectiveCamera(35,1,.1,100);camera.position.set(0,0,9.5);
 scene.add(new T.AmbientLight(0xffffff,1));const key=new T.PointLight(0xffc299,65);key.position.set(3,4,5);scene.add(key);const fill=new T.PointLight(0x667dff,24);fill.position.set(-4,-1,2);scene.add(fill);
 const group=new T.Group();scene.add(group);group.rotation.set(.4,.1,-.35);
 const copper=new T.MeshPhysicalMaterial({color:0xd77740,metalness:.85,roughness:.23,clearcoat:1});
 const ring=new T.Mesh(new T.TorusGeometry(1.65,.21,32,150),copper);ring.rotation.x=.78;group.add(ring);
 const ring2=new T.Mesh(new T.TorusGeometry(1.65,.035,12,150),new T.MeshStandardMaterial({color:0xffb177,emissive:0xb35422,emissiveIntensity:.8,metalness:.7,roughness:.4}));ring2.rotation.set(-.7,.65,.3);group.add(ring2);
 const core=new T.Mesh(new T.IcosahedronGeometry(.86,2),new T.MeshPhysicalMaterial({color:0x333941,metalness:.95,roughness:.24,flatShading:true}));group.add(core);
 const wire=new T.Mesh(new T.IcosahedronGeometry(.88,2),new T.MeshBasicMaterial({color:0xc88964,wireframe:true,transparent:true,opacity:.2}));group.add(wire);
 const satellite=new T.Mesh(new T.SphereGeometry(.11,20,20),new T.MeshStandardMaterial({color:0xffd7b4,emissive:0xff7838,emissiveIntensity:2}));group.add(satellite);
 const coords=new Float32Array(180*3);for(let i=0;i<coords.length;i++)coords[i]=(Math.random()-.5)*9;
 const geo=new T.BufferGeometry();geo.setAttribute('position',new T.BufferAttribute(coords,3));const points=new T.Points(geo,new T.PointsMaterial({color:0xdabca8,size:.017,transparent:true,opacity:.65}));scene.add(points);
 const resize=()=>{camera.aspect=el.clientWidth/el.clientHeight;camera.updateProjectionMatrix();renderer.setSize(el.clientWidth,el.clientHeight)};resize();const obs=new ResizeObserver(resize);obs.observe(el);
 let mouseX=0,mouseY=0;const move=(e:PointerEvent)=>{const r=el.getBoundingClientRect();mouseX=((e.clientX-r.left)/r.width-.5)*.3;mouseY=((e.clientY-r.top)/r.height-.5)*.3};el.addEventListener('pointermove',move);
 let frame=0,t=0;const draw=()=>{frame=requestAnimationFrame(draw);if(document.hidden)return;if(!pauseRef.current){t+=.008;group.rotation.y+=.002;core.rotation.y-=.005;points.rotation.y+=.0002;group.position.y=Math.sin(t)*.06;}group.rotation.x+=(.4+mouseY-group.rotation.x)*.025;group.rotation.z+=(-.35+mouseX-group.rotation.z)*.025;satellite.position.set(Math.cos(t)*1.65,Math.sin(t)*1.2,Math.sin(t)*.9);renderer.render(scene,camera)};draw();
 dispose=()=>{cancelAnimationFrame(frame);obs.disconnect();el.removeEventListener('pointermove',move);scene.traverse(o=>{if(o instanceof T.Mesh||o instanceof T.Points){o.geometry.dispose();const ms=Array.isArray(o.material)?o.material:[o.material];ms.forEach(m=>m.dispose());}});renderer.dispose();renderer.domElement.remove();};
 }).catch(()=>setFailed(true));return()=>{cancelled=true;dispose()};},[]);
 return <div className="orbit-canvas" ref={host} role="img" aria-label="Interactive copper orbital sculpture">{failed&&<div className="orbit-fallback">◎</div>}</div>;
}
