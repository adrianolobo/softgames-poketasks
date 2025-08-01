import{E as f,l as w,c as ae,H as T,t as P,M as C,a3 as ne,R as H,w as se,F as oe,aa as Be,ab as M,a0 as y,a1 as v,y as R,ac as Fe,ad as $,K as E,ae as U,b as j,B as G,s as q,u as Re,G as De,Z as Ae,af as W,ag as ke,n as ie,q as le,a5 as ue,a8 as de,ah as ce,o as Ve,p as ze,a6 as Ie,a7 as Le,a9 as Oe,ai as Ee,aj as We,ak as Ye,al as Y,am as Xe,D as he,m as fe,an as He,ao as $e,ap as qe,aq as Q,ar as V,e as _,as as Ne}from"./index-CJfeYAhB.js";import{S as D,c as k,a as je,b as Qe,B as pe}from"./colorToUniform-DmtBy-2V.js";class me{constructor(e){this._renderer=e}push(e,t,r){this._renderer.renderPipes.batch.break(r),r.add({renderPipeId:"filter",canBundle:!1,action:"pushFilter",container:t,filterEffect:e})}pop(e,t,r){this._renderer.renderPipes.batch.break(r),r.add({renderPipeId:"filter",action:"popFilter",canBundle:!1})}execute(e){e.action==="pushFilter"?this._renderer.filter.push(e):e.action==="popFilter"&&this._renderer.filter.pop()}destroy(){this._renderer=null}}me.extension={type:[f.WebGLPipes,f.WebGPUPipes,f.CanvasPipes],name:"filter"};function Ke(o,e){e.clear();const t=e.matrix;for(let r=0;r<o.length;r++){const a=o[r];a.globalDisplayStatus<7||(e.matrix=a.worldTransform,e.addBounds(a.bounds))}return e.matrix=t,e}const Ze=new ne({attributes:{aPosition:{buffer:new Float32Array([0,0,1,0,1,1,0,1]),format:"float32x2",stride:8,offset:0}},indexBuffer:new Uint32Array([0,1,2,0,2,3])});class Je{constructor(){this.skip=!1,this.inputTexture=null,this.backTexture=null,this.filters=null,this.bounds=new oe,this.container=null,this.blendRequired=!1,this.outputRenderSurface=null,this.globalFrame={x:0,y:0,width:0,height:0}}}class xe{constructor(e){this._filterStackIndex=0,this._filterStack=[],this._filterGlobalUniforms=new w({uInputSize:{value:new Float32Array(4),type:"vec4<f32>"},uInputPixel:{value:new Float32Array(4),type:"vec4<f32>"},uInputClamp:{value:new Float32Array(4),type:"vec4<f32>"},uOutputFrame:{value:new Float32Array(4),type:"vec4<f32>"},uGlobalFrame:{value:new Float32Array(4),type:"vec4<f32>"},uOutputTexture:{value:new Float32Array(4),type:"vec4<f32>"}}),this._globalFilterBindGroup=new ae({}),this.renderer=e}get activeBackTexture(){var e;return(e=this._activeFilterData)==null?void 0:e.backTexture}push(e){const t=this.renderer,r=e.filterEffect.filters,a=this._pushFilterData();a.skip=!1,a.filters=r,a.container=e.container,a.outputRenderSurface=t.renderTarget.renderSurface;const n=t.renderTarget.renderTarget.colorTexture.source,s=n.resolution,i=n.antialias;if(r.length===0){a.skip=!0;return}const l=a.bounds;if(this._calculateFilterArea(e,l),this._calculateFilterBounds(a,t.renderTarget.rootViewPort,i,s,1),a.skip)return;const u=this._getPreviousFilterData(),h=this._findFilterResolution(s);let d=0,c=0;u&&(d=u.bounds.minX,c=u.bounds.minY),this._calculateGlobalFrame(a,d,c,h,n.width,n.height),this._setupFilterTextures(a,l,t,u)}generateFilteredTexture({texture:e,filters:t}){const r=this._pushFilterData();this._activeFilterData=r,r.skip=!1,r.filters=t;const a=e.source,n=a.resolution,s=a.antialias;if(t.length===0)return r.skip=!0,e;const i=r.bounds;if(i.addRect(e.frame),this._calculateFilterBounds(r,i.rectangle,s,n,0),r.skip)return e;const l=n;this._calculateGlobalFrame(r,0,0,l,a.width,a.height),r.outputRenderSurface=T.getOptimalTexture(i.width,i.height,r.resolution,r.antialias),r.backTexture=P.EMPTY,r.inputTexture=e,this.renderer.renderTarget.finishRenderPass(),this._applyFiltersToTexture(r,!0);const c=r.outputRenderSurface;return c.source.alphaMode="premultiplied-alpha",c}pop(){const e=this.renderer,t=this._popFilterData();t.skip||(e.globalUniforms.pop(),e.renderTarget.finishRenderPass(),this._activeFilterData=t,this._applyFiltersToTexture(t,!1),t.blendRequired&&T.returnTexture(t.backTexture),T.returnTexture(t.inputTexture))}getBackTexture(e,t,r){const a=e.colorTexture.source._resolution,n=T.getOptimalTexture(t.width,t.height,a,!1);let s=t.minX,i=t.minY;r&&(s-=r.minX,i-=r.minY),s=Math.floor(s*a),i=Math.floor(i*a);const l=Math.ceil(t.width*a),u=Math.ceil(t.height*a);return this.renderer.renderTarget.copyToTexture(e,n,{x:s,y:i},{width:l,height:u},{x:0,y:0}),n}applyFilter(e,t,r,a){const n=this.renderer,s=this._activeFilterData,l=s.outputRenderSurface===r,u=n.renderTarget.rootRenderTarget.colorTexture.source._resolution,h=this._findFilterResolution(u);let d=0,c=0;if(l){const p=this._findPreviousFilterOffset();d=p.x,c=p.y}this._updateFilterUniforms(t,r,s,d,c,h,l,a),this._setupBindGroupsAndRender(e,t,n)}calculateSpriteMatrix(e,t){const r=this._activeFilterData,a=e.set(r.inputTexture._source.width,0,0,r.inputTexture._source.height,r.bounds.minX,r.bounds.minY),n=t.worldTransform.copyTo(C.shared),s=t.renderGroup||t.parentRenderGroup;return s&&s.cacheToLocalTransform&&n.prepend(s.cacheToLocalTransform),n.invert(),a.prepend(n),a.scale(1/t.texture.frame.width,1/t.texture.frame.height),a.translate(t.anchor.x,t.anchor.y),a}destroy(){}_setupBindGroupsAndRender(e,t,r){if(r.renderPipes.uniformBatch){const a=r.renderPipes.uniformBatch.getUboResource(this._filterGlobalUniforms);this._globalFilterBindGroup.setResource(a,0)}else this._globalFilterBindGroup.setResource(this._filterGlobalUniforms,0);this._globalFilterBindGroup.setResource(t.source,1),this._globalFilterBindGroup.setResource(t.source.style,2),e.groups[0]=this._globalFilterBindGroup,r.encoder.draw({geometry:Ze,shader:e,state:e._state,topology:"triangle-list"}),r.type===H.WEBGL&&r.renderTarget.finishRenderPass()}_setupFilterTextures(e,t,r,a){if(e.backTexture=P.EMPTY,e.blendRequired){r.renderTarget.finishRenderPass();const n=r.renderTarget.getRenderTarget(e.outputRenderSurface);e.backTexture=this.getBackTexture(n,t,a==null?void 0:a.bounds)}e.inputTexture=T.getOptimalTexture(t.width,t.height,e.resolution,e.antialias),r.renderTarget.bind(e.inputTexture,!0),r.globalUniforms.push({offset:t})}_calculateGlobalFrame(e,t,r,a,n,s){const i=e.globalFrame;i.x=t*a,i.y=r*a,i.width=n*a,i.height=s*a}_updateFilterUniforms(e,t,r,a,n,s,i,l){const u=this._filterGlobalUniforms.uniforms,h=u.uOutputFrame,d=u.uInputSize,c=u.uInputPixel,p=u.uInputClamp,b=u.uGlobalFrame,g=u.uOutputTexture;i?(h[0]=r.bounds.minX-a,h[1]=r.bounds.minY-n):(h[0]=0,h[1]=0),h[2]=e.frame.width,h[3]=e.frame.height,d[0]=e.source.width,d[1]=e.source.height,d[2]=1/d[0],d[3]=1/d[1],c[0]=e.source.pixelWidth,c[1]=e.source.pixelHeight,c[2]=1/c[0],c[3]=1/c[1],p[0]=.5*c[2],p[1]=.5*c[3],p[2]=e.frame.width*d[2]-.5*c[2],p[3]=e.frame.height*d[3]-.5*c[3];const x=this.renderer.renderTarget.rootRenderTarget.colorTexture;b[0]=a*s,b[1]=n*s,b[2]=x.source.width*s,b[3]=x.source.height*s,t instanceof P&&(t.source.resource=null);const m=this.renderer.renderTarget.getRenderTarget(t);this.renderer.renderTarget.bind(t,!!l),t instanceof P?(g[0]=t.frame.width,g[1]=t.frame.height):(g[0]=m.width,g[1]=m.height),g[2]=m.isRoot?-1:1,this._filterGlobalUniforms.update()}_findFilterResolution(e){let t=this._filterStackIndex-1;for(;t>0&&this._filterStack[t].skip;)--t;return t>0&&this._filterStack[t].inputTexture?this._filterStack[t].inputTexture.source._resolution:e}_findPreviousFilterOffset(){let e=0,t=0,r=this._filterStackIndex;for(;r>0;){r--;const a=this._filterStack[r];if(!a.skip){e=a.bounds.minX,t=a.bounds.minY;break}}return{x:e,y:t}}_calculateFilterArea(e,t){if(e.renderables?Ke(e.renderables,t):e.filterEffect.filterArea?(t.clear(),t.addRect(e.filterEffect.filterArea),t.applyMatrix(e.container.worldTransform)):e.container.getFastGlobalBounds(!0,t),e.container){const a=(e.container.renderGroup||e.container.parentRenderGroup).cacheToLocalTransform;a&&t.applyMatrix(a)}}_applyFiltersToTexture(e,t){const r=e.inputTexture,a=e.bounds,n=e.filters;if(this._globalFilterBindGroup.setResource(r.source.style,2),this._globalFilterBindGroup.setResource(e.backTexture.source,3),n.length===1)n[0].apply(this,r,e.outputRenderSurface,t);else{let s=e.inputTexture;const i=T.getOptimalTexture(a.width,a.height,s.source._resolution,!1);let l=i,u=0;for(u=0;u<n.length-1;++u){n[u].apply(this,s,l,!0);const d=s;s=l,l=d}n[u].apply(this,s,e.outputRenderSurface,t),T.returnTexture(i)}}_calculateFilterBounds(e,t,r,a,n){var g;const s=this.renderer,i=e.bounds,l=e.filters;let u=1/0,h=0,d=!0,c=!1,p=!1,b=!0;for(let x=0;x<l.length;x++){const m=l[x];if(u=Math.min(u,m.resolution==="inherit"?a:m.resolution),h+=m.padding,m.antialias==="off"?d=!1:m.antialias==="inherit"&&d&&(d=r),m.clipToViewport||(b=!1),!!!(m.compatibleRenderers&s.type)){p=!1;break}if(m.blendRequired&&!(((g=s.backBuffer)==null?void 0:g.useBackBuffer)??!0)){se("Blend filter requires backBuffer on WebGL renderer to be enabled. Set `useBackBuffer: true` in the renderer options."),p=!1;break}p=m.enabled||p,c||(c=m.blendRequired)}if(!p){e.skip=!0;return}if(b&&i.fitBounds(0,t.width/a,0,t.height/a),i.scale(u).ceil().scale(1/u).pad((h|0)*n),!i.isPositive){e.skip=!0;return}e.antialias=d,e.resolution=u,e.blendRequired=c}_popFilterData(){return this._filterStackIndex--,this._filterStack[this._filterStackIndex]}_getPreviousFilterData(){let e,t=this._filterStackIndex-1;for(;t>1&&(t--,e=this._filterStack[t],!!e.skip););return e}_pushFilterData(){let e=this._filterStack[this._filterStackIndex];return e||(e=this._filterStack[this._filterStackIndex]=new Je),this._filterStackIndex++,e}}xe.extension={type:[f.WebGLSystem,f.WebGPUSystem],name:"filter"};class A extends Be{constructor(e){e instanceof M&&(e={context:e});const{context:t,roundPixels:r,...a}=e||{};super({label:"Graphics",...a}),this.renderPipeId="graphics",t?this._context=t:this._context=this._ownedContext=new M,this._context.on("update",this.onViewUpdate,this),this.didViewUpdate=!0,this.allowChildren=!1,this.roundPixels=r??!1}set context(e){e!==this._context&&(this._context.off("update",this.onViewUpdate,this),this._context=e,this._context.on("update",this.onViewUpdate,this),this.onViewUpdate())}get context(){return this._context}get bounds(){return this._context.bounds}updateBounds(){}containsPoint(e){return this._context.containsPoint(e)}destroy(e){this._ownedContext&&!e?this._ownedContext.destroy(e):(e===!0||(e==null?void 0:e.context)===!0)&&this._context.destroy(e),this._ownedContext=null,this._context=null,super.destroy(e)}_callContextMethod(e,t){return this.context[e](...t),this}setFillStyle(...e){return this._callContextMethod("setFillStyle",e)}setStrokeStyle(...e){return this._callContextMethod("setStrokeStyle",e)}fill(...e){return this._callContextMethod("fill",e)}stroke(...e){return this._callContextMethod("stroke",e)}texture(...e){return this._callContextMethod("texture",e)}beginPath(){return this._callContextMethod("beginPath",[])}cut(){return this._callContextMethod("cut",[])}arc(...e){return this._callContextMethod("arc",e)}arcTo(...e){return this._callContextMethod("arcTo",e)}arcToSvg(...e){return this._callContextMethod("arcToSvg",e)}bezierCurveTo(...e){return this._callContextMethod("bezierCurveTo",e)}closePath(){return this._callContextMethod("closePath",[])}ellipse(...e){return this._callContextMethod("ellipse",e)}circle(...e){return this._callContextMethod("circle",e)}path(...e){return this._callContextMethod("path",e)}lineTo(...e){return this._callContextMethod("lineTo",e)}moveTo(...e){return this._callContextMethod("moveTo",e)}quadraticCurveTo(...e){return this._callContextMethod("quadraticCurveTo",e)}rect(...e){return this._callContextMethod("rect",e)}roundRect(...e){return this._callContextMethod("roundRect",e)}poly(...e){return this._callContextMethod("poly",e)}regularPoly(...e){return this._callContextMethod("regularPoly",e)}roundPoly(...e){return this._callContextMethod("roundPoly",e)}roundShape(...e){return this._callContextMethod("roundShape",e)}filletRect(...e){return this._callContextMethod("filletRect",e)}chamferRect(...e){return this._callContextMethod("chamferRect",e)}star(...e){return this._callContextMethod("star",e)}svg(...e){return this._callContextMethod("svg",e)}restore(...e){return this._callContextMethod("restore",e)}save(){return this._callContextMethod("save",[])}getTransform(){return this.context.getTransform()}resetTransform(){return this._callContextMethod("resetTransform",[])}rotateTransform(...e){return this._callContextMethod("rotate",e)}scaleTransform(...e){return this._callContextMethod("scale",e)}setTransform(...e){return this._callContextMethod("setTransform",e)}transform(...e){return this._callContextMethod("transform",e)}translateTransform(...e){return this._callContextMethod("translate",e)}clear(){return this._callContextMethod("clear",[])}get fillStyle(){return this._context.fillStyle}set fillStyle(e){this._context.fillStyle=e}get strokeStyle(){return this._context.strokeStyle}set strokeStyle(e){this._context.strokeStyle=e}clone(e=!1){return e?new A(this._context.clone()):(this._ownedContext=null,new A(this._context))}lineStyle(e,t,r){y(v,"Graphics#lineStyle is no longer needed. Use Graphics#setStrokeStyle to set the stroke style.");const a={};return e&&(a.width=e),t&&(a.color=t),r&&(a.alpha=r),this.context.strokeStyle=a,this}beginFill(e,t){y(v,"Graphics#beginFill is no longer needed. Use Graphics#fill to fill the shape with the desired style.");const r={};return e!==void 0&&(r.color=e),t!==void 0&&(r.alpha=t),this.context.fillStyle=r,this}endFill(){y(v,"Graphics#endFill is no longer needed. Use Graphics#fill to fill the shape with the desired style."),this.context.fill();const e=this.context.strokeStyle;return(e.width!==M.defaultStrokeStyle.width||e.color!==M.defaultStrokeStyle.color||e.alpha!==M.defaultStrokeStyle.alpha)&&this.context.stroke(),this}drawCircle(...e){return y(v,"Graphics#drawCircle has been renamed to Graphics#circle"),this._callContextMethod("circle",e)}drawEllipse(...e){return y(v,"Graphics#drawEllipse has been renamed to Graphics#ellipse"),this._callContextMethod("ellipse",e)}drawPolygon(...e){return y(v,"Graphics#drawPolygon has been renamed to Graphics#poly"),this._callContextMethod("poly",e)}drawRect(...e){return y(v,"Graphics#drawRect has been renamed to Graphics#rect"),this._callContextMethod("rect",e)}drawRoundedRect(...e){return y(v,"Graphics#drawRoundedRect has been renamed to Graphics#roundRect"),this._callContextMethod("roundRect",e)}drawStar(...e){return y(v,"Graphics#drawStar has been renamed to Graphics#star"),this._callContextMethod("star",e)}}class et{constructor(){this.batches=[],this.batched=!1}destroy(){this.batches.forEach(e=>{R.return(e)}),this.batches.length=0}}class ge{constructor(e,t){this.state=D.for2d(),this.renderer=e,this._adaptor=t,this.renderer.runners.contextChange.add(this)}contextChange(){this._adaptor.contextChange(this.renderer)}validateRenderable(e){const t=e.context,r=!!e._gpuData,a=this.renderer.graphicsContext.updateGpuContext(t);return!!(a.isBatchable||r!==a.isBatchable)}addRenderable(e,t){const r=this.renderer.graphicsContext.updateGpuContext(e.context);e.didViewUpdate&&this._rebuild(e),r.isBatchable?this._addToBatcher(e,t):(this.renderer.renderPipes.batch.break(t),t.add(e))}updateRenderable(e){const r=this._getGpuDataForRenderable(e).batches;for(let a=0;a<r.length;a++){const n=r[a];n._batcher.updateElement(n)}}execute(e){if(!e.isRenderable)return;const t=this.renderer,r=e.context;if(!t.graphicsContext.getGpuContext(r).batches.length)return;const n=r.customShader||this._adaptor.shader;this.state.blendMode=e.groupBlendMode;const s=n.resources.localUniforms.uniforms;s.uTransformMatrix=e.groupTransform,s.uRound=t._roundPixels|e._roundPixels,k(e.groupColorAlpha,s.uColor,0),this._adaptor.execute(this,e)}_rebuild(e){const t=this._getGpuDataForRenderable(e),r=this.renderer.graphicsContext.updateGpuContext(e.context);t.destroy(),r.isBatchable&&this._updateBatchesForRenderable(e,t)}_addToBatcher(e,t){const r=this.renderer.renderPipes.batch,a=this._getGpuDataForRenderable(e).batches;for(let n=0;n<a.length;n++){const s=a[n];r.addToBatch(s,t)}}_getGpuDataForRenderable(e){return e._gpuData[this.renderer.uid]||this._initGpuDataForRenderable(e)}_initGpuDataForRenderable(e){const t=new et;return e._gpuData[this.renderer.uid]=t,t}_updateBatchesForRenderable(e,t){const r=e.context,a=this.renderer.graphicsContext.getGpuContext(r),n=this.renderer._roundPixels|e._roundPixels;t.batches=a.batches.map(s=>{const i=R.get(Fe);return s.copyTo(i),i.renderable=e,i.roundPixels=n,i})}destroy(){this.renderer=null,this._adaptor.destroy(),this._adaptor=null,this.state=null}}ge.extension={type:[f.WebGLPipes,f.WebGPUPipes,f.CanvasPipes],name:"graphics"};class N{constructor(){this.batcherName="default",this.packAsQuad=!1,this.indexOffset=0,this.attributeOffset=0,this.roundPixels=0,this._batcher=null,this._batch=null,this._textureMatrixUpdateId=-1,this._uvUpdateId=-1}get blendMode(){return this.renderable.groupBlendMode}get topology(){return this._topology||this.geometry.topology}set topology(e){this._topology=e}reset(){this.renderable=null,this.texture=null,this._batcher=null,this._batch=null,this.geometry=null,this._uvUpdateId=-1,this._textureMatrixUpdateId=-1}setTexture(e){this.texture!==e&&(this.texture=e,this._textureMatrixUpdateId=-1)}get uvs(){const t=this.geometry.getBuffer("aUV"),r=t.data;let a=r;const n=this.texture.textureMatrix;return n.isSimple||(a=this._transformedUvs,(this._textureMatrixUpdateId!==n._updateID||this._uvUpdateId!==t._updateID)&&((!a||a.length<r.length)&&(a=this._transformedUvs=new Float32Array(r.length)),this._textureMatrixUpdateId=n._updateID,this._uvUpdateId=t._updateID,n.multiplyUvs(r,a))),a}get positions(){return this.geometry.positions}get indices(){return this.geometry.indices}get color(){return this.renderable.groupColorAlpha}get groupTransform(){return this.renderable.groupTransform}get attributeSize(){return this.geometry.positions.length/2}get indexSize(){return this.geometry.indices.length}}class K{destroy(){}}class _e{constructor(e,t){this.localUniforms=new w({uTransformMatrix:{value:new C,type:"mat3x3<f32>"},uColor:{value:new Float32Array([1,1,1,1]),type:"vec4<f32>"},uRound:{value:0,type:"f32"}}),this.localUniformsBindGroup=new ae({0:this.localUniforms}),this.renderer=e,this._adaptor=t,this._adaptor.init()}validateRenderable(e){const t=this._getMeshData(e),r=t.batched,a=e.batched;if(t.batched=a,r!==a)return!0;if(a){const n=e._geometry;if(n.indices.length!==t.indexSize||n.positions.length!==t.vertexSize)return t.indexSize=n.indices.length,t.vertexSize=n.positions.length,!0;const s=this._getBatchableMesh(e);return s.texture.uid!==e._texture.uid&&(s._textureMatrixUpdateId=-1),!s._batcher.checkAndUpdateTexture(s,e._texture)}return!1}addRenderable(e,t){const r=this.renderer.renderPipes.batch,{batched:a}=this._getMeshData(e);if(a){const n=this._getBatchableMesh(e);n.setTexture(e._texture),n.geometry=e._geometry,r.addToBatch(n,t)}else r.break(t),t.add(e)}updateRenderable(e){if(e.batched){const t=this._getBatchableMesh(e);t.setTexture(e._texture),t.geometry=e._geometry,t._batcher.updateElement(t)}}execute(e){if(!e.isRenderable)return;e.state.blendMode=$(e.groupBlendMode,e.texture._source);const t=this.localUniforms;t.uniforms.uTransformMatrix=e.groupTransform,t.uniforms.uRound=this.renderer._roundPixels|e._roundPixels,t.update(),k(e.groupColorAlpha,t.uniforms.uColor,0),this._adaptor.execute(this,e)}_getMeshData(e){var t,r;return(t=e._gpuData)[r=this.renderer.uid]||(t[r]=new K),e._gpuData[this.renderer.uid].meshData||this._initMeshData(e)}_initMeshData(e){var t,r;return e._gpuData[this.renderer.uid].meshData={batched:e.batched,indexSize:(t=e._geometry.indices)==null?void 0:t.length,vertexSize:(r=e._geometry.positions)==null?void 0:r.length},e._gpuData[this.renderer.uid].meshData}_getBatchableMesh(e){var t,r;return(t=e._gpuData)[r=this.renderer.uid]||(t[r]=new K),e._gpuData[this.renderer.uid].batchableMesh||this._initBatchableMesh(e)}_initBatchableMesh(e){const t=new N;return t.renderable=e,t.setTexture(e._texture),t.transform=e.groupTransform,t.roundPixels=this.renderer._roundPixels|e._roundPixels,e._gpuData[this.renderer.uid].batchableMesh=t,t}destroy(){this.localUniforms=null,this.localUniformsBindGroup=null,this._adaptor.destroy(),this._adaptor=null,this.renderer=null}}_e.extension={type:[f.WebGLPipes,f.WebGPUPipes,f.CanvasPipes],name:"mesh"};class tt{execute(e,t){const r=e.state,a=e.renderer,n=t.shader||e.defaultShader;n.resources.uTexture=t.texture._source,n.resources.uniforms=e.localUniforms;const s=a.gl,i=e.getBuffers(t);a.shader.bind(n),a.state.set(r),a.geometry.bind(i.geometry,n.glProgram);const u=i.geometry.indexBuffer.data.BYTES_PER_ELEMENT===2?s.UNSIGNED_SHORT:s.UNSIGNED_INT;s.drawElements(s.TRIANGLES,t.particleChildren.length*6,u,0)}}class rt{execute(e,t){const r=e.renderer,a=t.shader||e.defaultShader;a.groups[0]=r.renderPipes.uniformBatch.getUniformBindGroup(e.localUniforms,!0),a.groups[1]=r.texture.getTextureBindGroup(t.texture);const n=e.state,s=e.getBuffers(t);r.encoder.draw({geometry:s.geometry,shader:t.shader||e.defaultShader,state:n,size:t.particleChildren.length*6})}}function Z(o,e=null){const t=o*6;if(t>65535?e||(e=new Uint32Array(t)):e||(e=new Uint16Array(t)),e.length!==t)throw new Error(`Out buffer length is incorrect, got ${e.length} and expected ${t}`);for(let r=0,a=0;r<t;r+=6,a+=4)e[r+0]=a+0,e[r+1]=a+1,e[r+2]=a+2,e[r+3]=a+0,e[r+4]=a+2,e[r+5]=a+3;return e}function at(o){return{dynamicUpdate:J(o,!0),staticUpdate:J(o,!1)}}function J(o,e){const t=[];t.push(`

        var index = 0;

        for (let i = 0; i < ps.length; ++i)
        {
            const p = ps[i];

            `);let r=0;for(const n in o){const s=o[n];if(e!==s.dynamic)continue;t.push(`offset = index + ${r}`),t.push(s.code);const i=E(s.format);r+=i.stride/4}t.push(`
            index += stride * 4;
        }
    `),t.unshift(`
        var stride = ${r};
    `);const a=t.join(`
`);return new Function("ps","f32v","u32v",a)}class nt{constructor(e){this._size=0,this._generateParticleUpdateCache={};const t=this._size=e.size??1e3,r=e.properties;let a=0,n=0;for(const h in r){const d=r[h],c=E(d.format);d.dynamic?n+=c.stride:a+=c.stride}this._dynamicStride=n/4,this._staticStride=a/4,this.staticAttributeBuffer=new U(t*4*a),this.dynamicAttributeBuffer=new U(t*4*n),this.indexBuffer=Z(t);const s=new ne;let i=0,l=0;this._staticBuffer=new j({data:new Float32Array(1),label:"static-particle-buffer",shrinkToFit:!1,usage:G.VERTEX|G.COPY_DST}),this._dynamicBuffer=new j({data:new Float32Array(1),label:"dynamic-particle-buffer",shrinkToFit:!1,usage:G.VERTEX|G.COPY_DST});for(const h in r){const d=r[h],c=E(d.format);d.dynamic?(s.addAttribute(d.attributeName,{buffer:this._dynamicBuffer,stride:this._dynamicStride*4,offset:i*4,format:d.format}),i+=c.size):(s.addAttribute(d.attributeName,{buffer:this._staticBuffer,stride:this._staticStride*4,offset:l*4,format:d.format}),l+=c.size)}s.addIndex(this.indexBuffer);const u=this.getParticleUpdate(r);this._dynamicUpload=u.dynamicUpdate,this._staticUpload=u.staticUpdate,this.geometry=s}getParticleUpdate(e){const t=st(e);return this._generateParticleUpdateCache[t]?this._generateParticleUpdateCache[t]:(this._generateParticleUpdateCache[t]=this.generateParticleUpdate(e),this._generateParticleUpdateCache[t])}generateParticleUpdate(e){return at(e)}update(e,t){e.length>this._size&&(t=!0,this._size=Math.max(e.length,this._size*1.5|0),this.staticAttributeBuffer=new U(this._size*this._staticStride*4*4),this.dynamicAttributeBuffer=new U(this._size*this._dynamicStride*4*4),this.indexBuffer=Z(this._size),this.geometry.indexBuffer.setDataWithSize(this.indexBuffer,this.indexBuffer.byteLength,!0));const r=this.dynamicAttributeBuffer;if(this._dynamicUpload(e,r.float32View,r.uint32View),this._dynamicBuffer.setDataWithSize(this.dynamicAttributeBuffer.float32View,e.length*this._dynamicStride*4,!0),t){const a=this.staticAttributeBuffer;this._staticUpload(e,a.float32View,a.uint32View),this._staticBuffer.setDataWithSize(a.float32View,e.length*this._staticStride*4,!0)}}destroy(){this._staticBuffer.destroy(),this._dynamicBuffer.destroy(),this.geometry.destroy()}}function st(o){const e=[];for(const t in o){const r=o[t];e.push(t,r.code,r.dynamic?"d":"s")}return e.join("_")}var ot=`varying vec2 vUV;
varying vec4 vColor;

uniform sampler2D uTexture;

void main(void){
    vec4 color = texture2D(uTexture, vUV) * vColor;
    gl_FragColor = color;
}`,it=`attribute vec2 aVertex;
attribute vec2 aUV;
attribute vec4 aColor;

attribute vec2 aPosition;
attribute float aRotation;

uniform mat3 uTranslationMatrix;
uniform float uRound;
uniform vec2 uResolution;
uniform vec4 uColor;

varying vec2 vUV;
varying vec4 vColor;

vec2 roundPixels(vec2 position, vec2 targetSize)
{       
    return (floor(((position * 0.5 + 0.5) * targetSize) + 0.5) / targetSize) * 2.0 - 1.0;
}

void main(void){
    float cosRotation = cos(aRotation);
    float sinRotation = sin(aRotation);
    float x = aVertex.x * cosRotation - aVertex.y * sinRotation;
    float y = aVertex.x * sinRotation + aVertex.y * cosRotation;

    vec2 v = vec2(x, y);
    v = v + aPosition;

    gl_Position = vec4((uTranslationMatrix * vec3(v, 1.0)).xy, 0.0, 1.0);

    if(uRound == 1.0)
    {
        gl_Position.xy = roundPixels(gl_Position.xy, uResolution);
    }

    vUV = aUV;
    vColor = vec4(aColor.rgb * aColor.a, aColor.a) * uColor;
}
`,ee=`
struct ParticleUniforms {
  uProjectionMatrix:mat3x3<f32>,
  uColor:vec4<f32>,
  uResolution:vec2<f32>,
  uRoundPixels:f32,
};

@group(0) @binding(0) var<uniform> uniforms: ParticleUniforms;

@group(1) @binding(0) var uTexture: texture_2d<f32>;
@group(1) @binding(1) var uSampler : sampler;

struct VSOutput {
    @builtin(position) position: vec4<f32>,
    @location(0) uv : vec2<f32>,
    @location(1) color : vec4<f32>,
  };
@vertex
fn mainVertex(
  @location(0) aVertex: vec2<f32>,
  @location(1) aPosition: vec2<f32>,
  @location(2) aUV: vec2<f32>,
  @location(3) aColor: vec4<f32>,
  @location(4) aRotation: f32,
) -> VSOutput {
  
   let v = vec2(
       aVertex.x * cos(aRotation) - aVertex.y * sin(aRotation),
       aVertex.x * sin(aRotation) + aVertex.y * cos(aRotation)
   ) + aPosition;

   let position = vec4((uniforms.uProjectionMatrix * vec3(v, 1.0)).xy, 0.0, 1.0);

    let vColor = vec4(aColor.rgb * aColor.a, aColor.a) * uniforms.uColor;

  return VSOutput(
   position,
   aUV,
   vColor,
  );
}

@fragment
fn mainFragment(
  @location(0) uv: vec2<f32>,
  @location(1) color: vec4<f32>,
  @builtin(position) position: vec4<f32>,
) -> @location(0) vec4<f32> {

    var sample = textureSample(uTexture, uSampler, uv) * color;
   
    return sample;
}`;class lt extends q{constructor(){const e=Re.from({vertex:it,fragment:ot}),t=De.from({fragment:{source:ee,entryPoint:"mainFragment"},vertex:{source:ee,entryPoint:"mainVertex"}});super({glProgram:e,gpuProgram:t,resources:{uTexture:P.WHITE.source,uSampler:new W({}),uniforms:{uTranslationMatrix:{value:new C,type:"mat3x3<f32>"},uColor:{value:new Ae(16777215),type:"vec4<f32>"},uRound:{value:1,type:"f32"},uResolution:{value:[0,0],type:"vec2<f32>"}}}})}}class be{constructor(e,t){this.state=D.for2d(),this.localUniforms=new w({uTranslationMatrix:{value:new C,type:"mat3x3<f32>"},uColor:{value:new Float32Array(4),type:"vec4<f32>"},uRound:{value:1,type:"f32"},uResolution:{value:[0,0],type:"vec2<f32>"}}),this.renderer=e,this.adaptor=t,this.defaultShader=new lt,this.state=D.for2d()}validateRenderable(e){return!1}addRenderable(e,t){this.renderer.renderPipes.batch.break(t),t.add(e)}getBuffers(e){return e._gpuData[this.renderer.uid]||this._initBuffer(e)}_initBuffer(e){return e._gpuData[this.renderer.uid]=new nt({size:e.particleChildren.length,properties:e._properties}),e._gpuData[this.renderer.uid]}updateRenderable(e){}execute(e){const t=e.particleChildren;if(t.length===0)return;const r=this.renderer,a=this.getBuffers(e);e.texture||(e.texture=t[0].texture);const n=this.state;a.update(t,e._childrenDirty),e._childrenDirty=!1,n.blendMode=$(e.blendMode,e.texture._source);const s=this.localUniforms.uniforms,i=s.uTranslationMatrix;e.worldTransform.copyTo(i),i.prepend(r.globalUniforms.globalUniformData.projectionMatrix),s.uResolution=r.globalUniforms.globalUniformData.resolution,s.uRound=r._roundPixels|e._roundPixels,k(e.groupColorAlpha,s.uColor,0),this.adaptor.execute(this,e)}destroy(){this.defaultShader&&(this.defaultShader.destroy(),this.defaultShader=null)}}class ye extends be{constructor(e){super(e,new tt)}}ye.extension={type:[f.WebGLPipes],name:"particle"};class Te extends be{constructor(e){super(e,new rt)}}Te.extension={type:[f.WebGPUPipes],name:"particle"};class ut extends N{constructor(){super(),this.geometry=new ke}destroy(){this.geometry.destroy()}}class ve{constructor(e){this._renderer=e}addRenderable(e,t){const r=this._getGpuSprite(e);e.didViewUpdate&&this._updateBatchableSprite(e,r),this._renderer.renderPipes.batch.addToBatch(r,t)}updateRenderable(e){const t=this._getGpuSprite(e);e.didViewUpdate&&this._updateBatchableSprite(e,t),t._batcher.updateElement(t)}validateRenderable(e){const t=this._getGpuSprite(e);return!t._batcher.checkAndUpdateTexture(t,e._texture)}_updateBatchableSprite(e,t){t.geometry.update(e),t.setTexture(e._texture)}_getGpuSprite(e){return e._gpuData[this._renderer.uid]||this._initGPUSprite(e)}_initGPUSprite(e){const t=e._gpuData[this._renderer.uid]=new ut,r=t;return r.renderable=e,r.transform=e.groupTransform,r.texture=e._texture,r.roundPixels=this._renderer._roundPixels|e._roundPixels,e.didViewUpdate||this._updateBatchableSprite(e,r),t}destroy(){this._renderer=null}}ve.extension={type:[f.WebGLPipes,f.WebGPUPipes,f.CanvasPipes],name:"nineSliceSprite"};const dt={name:"tiling-bit",vertex:{header:`
            struct TilingUniforms {
                uMapCoord:mat3x3<f32>,
                uClampFrame:vec4<f32>,
                uClampOffset:vec2<f32>,
                uTextureTransform:mat3x3<f32>,
                uSizeAnchor:vec4<f32>
            };

            @group(2) @binding(0) var<uniform> tilingUniforms: TilingUniforms;
            @group(2) @binding(1) var uTexture: texture_2d<f32>;
            @group(2) @binding(2) var uSampler: sampler;
        `,main:`
            uv = (tilingUniforms.uTextureTransform * vec3(uv, 1.0)).xy;

            position = (position - tilingUniforms.uSizeAnchor.zw) * tilingUniforms.uSizeAnchor.xy;
        `},fragment:{header:`
            struct TilingUniforms {
                uMapCoord:mat3x3<f32>,
                uClampFrame:vec4<f32>,
                uClampOffset:vec2<f32>,
                uTextureTransform:mat3x3<f32>,
                uSizeAnchor:vec4<f32>
            };

            @group(2) @binding(0) var<uniform> tilingUniforms: TilingUniforms;
            @group(2) @binding(1) var uTexture: texture_2d<f32>;
            @group(2) @binding(2) var uSampler: sampler;
        `,main:`

            var coord = vUV + ceil(tilingUniforms.uClampOffset - vUV);
            coord = (tilingUniforms.uMapCoord * vec3(coord, 1.0)).xy;
            var unclamped = coord;
            coord = clamp(coord, tilingUniforms.uClampFrame.xy, tilingUniforms.uClampFrame.zw);

            var bias = 0.;

            if(unclamped.x == coord.x && unclamped.y == coord.y)
            {
                bias = -32.;
            }

            outColor = textureSampleBias(uTexture, uSampler, coord, bias);
        `}},ct={name:"tiling-bit",vertex:{header:`
            uniform mat3 uTextureTransform;
            uniform vec4 uSizeAnchor;

        `,main:`
            uv = (uTextureTransform * vec3(aUV, 1.0)).xy;

            position = (position - uSizeAnchor.zw) * uSizeAnchor.xy;
        `},fragment:{header:`
            uniform sampler2D uTexture;
            uniform mat3 uMapCoord;
            uniform vec4 uClampFrame;
            uniform vec2 uClampOffset;
        `,main:`

        vec2 coord = vUV + ceil(uClampOffset - vUV);
        coord = (uMapCoord * vec3(coord, 1.0)).xy;
        vec2 unclamped = coord;
        coord = clamp(coord, uClampFrame.xy, uClampFrame.zw);

        outColor = texture(uTexture, coord, unclamped == coord ? 0.0 : -32.0);// lod-bias very negative to force lod 0

        `}};let z,I;class ht extends q{constructor(){z??(z=ie({name:"tiling-sprite-shader",bits:[je,dt,le]})),I??(I=ue({name:"tiling-sprite-shader",bits:[Qe,ct,de]}));const e=new w({uMapCoord:{value:new C,type:"mat3x3<f32>"},uClampFrame:{value:new Float32Array([0,0,1,1]),type:"vec4<f32>"},uClampOffset:{value:new Float32Array([0,0]),type:"vec2<f32>"},uTextureTransform:{value:new C,type:"mat3x3<f32>"},uSizeAnchor:{value:new Float32Array([100,100,.5,.5]),type:"vec4<f32>"}});super({glProgram:I,gpuProgram:z,resources:{localUniforms:new w({uTransformMatrix:{value:new C,type:"mat3x3<f32>"},uColor:{value:new Float32Array([1,1,1,1]),type:"vec4<f32>"},uRound:{value:0,type:"f32"}}),tilingUniforms:e,uTexture:P.EMPTY.source,uSampler:P.EMPTY.source.style}})}updateUniforms(e,t,r,a,n,s){const i=this.resources.tilingUniforms,l=s.width,u=s.height,h=s.textureMatrix,d=i.uniforms.uTextureTransform;d.set(r.a*l/e,r.b*l/t,r.c*u/e,r.d*u/t,r.tx/e,r.ty/t),d.invert(),i.uniforms.uMapCoord=h.mapCoord,i.uniforms.uClampFrame=h.uClampFrame,i.uniforms.uClampOffset=h.uClampOffset,i.uniforms.uTextureTransform=d,i.uniforms.uSizeAnchor[0]=e,i.uniforms.uSizeAnchor[1]=t,i.uniforms.uSizeAnchor[2]=a,i.uniforms.uSizeAnchor[3]=n,s&&(this.resources.uTexture=s.source,this.resources.uSampler=s.source.style)}}class ft extends ce{constructor(){super({positions:new Float32Array([0,0,1,0,1,1,0,1]),uvs:new Float32Array([0,0,1,0,1,1,0,1]),indices:new Uint32Array([0,1,2,0,2,3])})}}function pt(o,e){const t=o.anchor.x,r=o.anchor.y;e[0]=-t*o.width,e[1]=-r*o.height,e[2]=(1-t)*o.width,e[3]=-r*o.height,e[4]=(1-t)*o.width,e[5]=(1-r)*o.height,e[6]=-t*o.width,e[7]=(1-r)*o.height}function mt(o,e,t,r){let a=0;const n=o.length/e,s=r.a,i=r.b,l=r.c,u=r.d,h=r.tx,d=r.ty;for(t*=e;a<n;){const c=o[t],p=o[t+1];o[t]=s*c+l*p+h,o[t+1]=i*c+u*p+d,t+=e,a++}}function xt(o,e){const t=o.texture,r=t.frame.width,a=t.frame.height;let n=0,s=0;o.applyAnchorToTexture&&(n=o.anchor.x,s=o.anchor.y),e[0]=e[6]=-n,e[2]=e[4]=1-n,e[1]=e[3]=-s,e[5]=e[7]=1-s;const i=C.shared;i.copyFrom(o._tileTransform.matrix),i.tx/=o.width,i.ty/=o.height,i.invert(),i.scale(o.width/r,o.height/a),mt(e,2,0,i)}const F=new ft;class gt{constructor(){this.canBatch=!0,this.geometry=new ce({indices:F.indices.slice(),positions:F.positions.slice(),uvs:F.uvs.slice()})}destroy(){var e;this.geometry.destroy(),(e=this.shader)==null||e.destroy()}}class Ce{constructor(e){this._state=D.default2d,this._renderer=e}validateRenderable(e){const t=this._getTilingSpriteData(e),r=t.canBatch;this._updateCanBatch(e);const a=t.canBatch;if(a&&a===r){const{batchableMesh:n}=t;return!n._batcher.checkAndUpdateTexture(n,e.texture)}return r!==a}addRenderable(e,t){const r=this._renderer.renderPipes.batch;this._updateCanBatch(e);const a=this._getTilingSpriteData(e),{geometry:n,canBatch:s}=a;if(s){a.batchableMesh||(a.batchableMesh=new N);const i=a.batchableMesh;e.didViewUpdate&&(this._updateBatchableMesh(e),i.geometry=n,i.renderable=e,i.transform=e.groupTransform,i.setTexture(e._texture)),i.roundPixels=this._renderer._roundPixels|e._roundPixels,r.addToBatch(i,t)}else r.break(t),a.shader||(a.shader=new ht),this.updateRenderable(e),t.add(e)}execute(e){const{shader:t}=this._getTilingSpriteData(e);t.groups[0]=this._renderer.globalUniforms.bindGroup;const r=t.resources.localUniforms.uniforms;r.uTransformMatrix=e.groupTransform,r.uRound=this._renderer._roundPixels|e._roundPixels,k(e.groupColorAlpha,r.uColor,0),this._state.blendMode=$(e.groupBlendMode,e.texture._source),this._renderer.encoder.draw({geometry:F,shader:t,state:this._state})}updateRenderable(e){const t=this._getTilingSpriteData(e),{canBatch:r}=t;if(r){const{batchableMesh:a}=t;e.didViewUpdate&&this._updateBatchableMesh(e),a._batcher.updateElement(a)}else if(e.didViewUpdate){const{shader:a}=t;a.updateUniforms(e.width,e.height,e._tileTransform.matrix,e.anchor.x,e.anchor.y,e.texture)}}_getTilingSpriteData(e){return e._gpuData[this._renderer.uid]||this._initTilingSpriteData(e)}_initTilingSpriteData(e){const t=new gt;return t.renderable=e,e._gpuData[this._renderer.uid]=t,t}_updateBatchableMesh(e){const t=this._getTilingSpriteData(e),{geometry:r}=t,a=e.texture.source.style;a.addressMode!=="repeat"&&(a.addressMode="repeat",a.update()),xt(e,r.uvs),pt(e,r.positions)}destroy(){this._renderer=null}_updateCanBatch(e){const t=this._getTilingSpriteData(e),r=e.texture;let a=!0;return this._renderer.type===H.WEBGL&&(a=this._renderer.context.supports.nonPowOf2wrapping),t.canBatch=r.textureMatrix.isSimple&&(a||r.source.isPowerOfTwo),t.canBatch}}Ce.extension={type:[f.WebGLPipes,f.WebGPUPipes,f.CanvasPipes],name:"tilingSprite"};const _t={name:"local-uniform-msdf-bit",vertex:{header:`
            struct LocalUniforms {
                uColor:vec4<f32>,
                uTransformMatrix:mat3x3<f32>,
                uDistance: f32,
                uRound:f32,
            }

            @group(2) @binding(0) var<uniform> localUniforms : LocalUniforms;
        `,main:`
            vColor *= localUniforms.uColor;
            modelMatrix *= localUniforms.uTransformMatrix;
        `,end:`
            if(localUniforms.uRound == 1)
            {
                vPosition = vec4(roundPixels(vPosition.xy, globalUniforms.uResolution), vPosition.zw);
            }
        `},fragment:{header:`
            struct LocalUniforms {
                uColor:vec4<f32>,
                uTransformMatrix:mat3x3<f32>,
                uDistance: f32
            }

            @group(2) @binding(0) var<uniform> localUniforms : LocalUniforms;
         `,main:`
            outColor = vec4<f32>(calculateMSDFAlpha(outColor, localUniforms.uColor, localUniforms.uDistance));
        `}},bt={name:"local-uniform-msdf-bit",vertex:{header:`
            uniform mat3 uTransformMatrix;
            uniform vec4 uColor;
            uniform float uRound;
        `,main:`
            vColor *= uColor;
            modelMatrix *= uTransformMatrix;
        `,end:`
            if(uRound == 1.)
            {
                gl_Position.xy = roundPixels(gl_Position.xy, uResolution);
            }
        `},fragment:{header:`
            uniform float uDistance;
         `,main:`
            outColor = vec4(calculateMSDFAlpha(outColor, vColor, uDistance));
        `}},yt={name:"msdf-bit",fragment:{header:`
            fn calculateMSDFAlpha(msdfColor:vec4<f32>, shapeColor:vec4<f32>, distance:f32) -> f32 {

                // MSDF
                var median = msdfColor.r + msdfColor.g + msdfColor.b -
                    min(msdfColor.r, min(msdfColor.g, msdfColor.b)) -
                    max(msdfColor.r, max(msdfColor.g, msdfColor.b));

                // SDF
                median = min(median, msdfColor.a);

                var screenPxDistance = distance * (median - 0.5);
                var alpha = clamp(screenPxDistance + 0.5, 0.0, 1.0);
                if (median < 0.01) {
                    alpha = 0.0;
                } else if (median > 0.99) {
                    alpha = 1.0;
                }

                // Gamma correction for coverage-like alpha
                var luma: f32 = dot(shapeColor.rgb, vec3<f32>(0.299, 0.587, 0.114));
                var gamma: f32 = mix(1.0, 1.0 / 2.2, luma);
                var coverage: f32 = pow(shapeColor.a * alpha, gamma);

                return coverage;

            }
        `}},Tt={name:"msdf-bit",fragment:{header:`
            float calculateMSDFAlpha(vec4 msdfColor, vec4 shapeColor, float distance) {

                // MSDF
                float median = msdfColor.r + msdfColor.g + msdfColor.b -
                                min(msdfColor.r, min(msdfColor.g, msdfColor.b)) -
                                max(msdfColor.r, max(msdfColor.g, msdfColor.b));

                // SDF
                median = min(median, msdfColor.a);

                float screenPxDistance = distance * (median - 0.5);
                float alpha = clamp(screenPxDistance + 0.5, 0.0, 1.0);

                if (median < 0.01) {
                    alpha = 0.0;
                } else if (median > 0.99) {
                    alpha = 1.0;
                }

                // Gamma correction for coverage-like alpha
                float luma = dot(shapeColor.rgb, vec3(0.299, 0.587, 0.114));
                float gamma = mix(1.0, 1.0 / 2.2, luma);
                float coverage = pow(shapeColor.a * alpha, gamma);

                return coverage;
            }
        `}};let L,O;class vt extends q{constructor(e){const t=new w({uColor:{value:new Float32Array([1,1,1,1]),type:"vec4<f32>"},uTransformMatrix:{value:new C,type:"mat3x3<f32>"},uDistance:{value:4,type:"f32"},uRound:{value:0,type:"f32"}});L??(L=ie({name:"sdf-shader",bits:[Ve,ze(e),_t,yt,le]})),O??(O=ue({name:"sdf-shader",bits:[Ie,Le(e),bt,Tt,de]})),super({glProgram:O,gpuProgram:L,resources:{localUniforms:t,batchSamplers:Oe(e)}})}}class Ct extends A{destroy(){this.context.customShader&&this.context.customShader.destroy(),super.destroy()}}class Pe{constructor(e){this._renderer=e,this._renderer.renderableGC.addManagedHash(this,"_gpuBitmapText")}validateRenderable(e){const t=this._getGpuBitmapText(e);return e._didTextUpdate&&(e._didTextUpdate=!1,this._updateContext(e,t)),this._renderer.renderPipes.graphics.validateRenderable(t)}addRenderable(e,t){const r=this._getGpuBitmapText(e);te(e,r),e._didTextUpdate&&(e._didTextUpdate=!1,this._updateContext(e,r)),this._renderer.renderPipes.graphics.addRenderable(r,t),r.context.customShader&&this._updateDistanceField(e)}updateRenderable(e){const t=this._getGpuBitmapText(e);te(e,t),this._renderer.renderPipes.graphics.updateRenderable(t),t.context.customShader&&this._updateDistanceField(e)}_updateContext(e,t){const{context:r}=t,a=Ee.getFont(e.text,e._style);r.clear(),a.distanceField.type!=="none"&&(r.customShader||(r.customShader=new vt(this._renderer.limits.maxBatchableTextures)));const n=We.graphemeSegmenter(e.text),s=e._style;let i=a.baseLineOffset;const l=Ye(n,s,a,!0),u=s.padding,h=l.scale;let d=l.width,c=l.height+l.offsetY;s._stroke&&(d+=s._stroke.width/h,c+=s._stroke.width/h),r.translate(-e._anchor._x*d-u,-e._anchor._y*c-u).scale(h,h);const p=a.applyFillAsTint?s._fill.color:16777215;for(let b=0;b<l.lines.length;b++){const g=l.lines[b];for(let x=0;x<g.charPositions.length;x++){const m=g.chars[x],S=a.chars[m];S!=null&&S.texture&&r.texture(S.texture,p||"black",Math.round(g.charPositions[x]+S.xOffset),Math.round(i+S.yOffset))}i+=a.lineHeight}}_getGpuBitmapText(e){return e._gpuData[this._renderer.uid]||this.initGpuText(e)}initGpuText(e){const t=new Ct;return e._gpuData[this._renderer.uid]=t,this._updateContext(e,t),t}_updateDistanceField(e){const t=this._getGpuBitmapText(e).context,r=e._style.fontFamily,a=Y.get(`${r}-bitmap`),{a:n,b:s,c:i,d:l}=e.groupTransform,u=Math.sqrt(n*n+s*s),h=Math.sqrt(i*i+l*l),d=(Math.abs(u)+Math.abs(h))/2,c=a.baseRenderedFontSize/e._style.fontSize,p=d*a.distanceField.range*(1/c);t.customShader.resources.localUniforms.uniforms.uDistance=p}destroy(){this._renderer=null}}Pe.extension={type:[f.WebGLPipes,f.WebGPUPipes,f.CanvasPipes],name:"bitmapText"};function te(o,e){e.groupTransform=o.groupTransform,e.groupColorAlpha=o.groupColorAlpha,e.groupColor=o.groupColor,e.groupBlendMode=o.groupBlendMode,e.globalDisplayStatus=o.globalDisplayStatus,e.groupTransform=o.groupTransform,e.localDisplayStatus=o.localDisplayStatus,e.groupAlpha=o.groupAlpha,e._roundPixels=o._roundPixels}class Pt extends pe{constructor(e){super(),this.generatingTexture=!1,this._renderer=e,e.runners.resolutionChange.add(this)}resolutionChange(){const e=this.renderable;e._autoResolution&&e.onViewUpdate()}destroy(){this._renderer.htmlText.returnTexturePromise(this.texturePromise),this.texturePromise=null,this._renderer=null}}function X(o,e){const{texture:t,bounds:r}=o,a=e._style._getFinalPadding();Xe(r,e._anchor,t);const n=e._anchor._x*a*2,s=e._anchor._y*a*2;r.minX-=a-n,r.minY-=a-s,r.maxX-=a-n,r.maxY-=a-s}class Se{constructor(e){this._renderer=e}validateRenderable(e){return e._didTextUpdate}addRenderable(e,t){const r=this._getGpuText(e);e._didTextUpdate&&(this._updateGpuText(e).catch(a=>{console.error(a)}),e._didTextUpdate=!1,X(r,e)),this._renderer.renderPipes.batch.addToBatch(r,t)}updateRenderable(e){const t=this._getGpuText(e);t._batcher.updateElement(t)}async _updateGpuText(e){e._didTextUpdate=!1;const t=this._getGpuText(e);if(t.generatingTexture)return;t.texturePromise&&(this._renderer.htmlText.returnTexturePromise(t.texturePromise),t.texturePromise=null),t.generatingTexture=!0,e._resolution=e._autoResolution?this._renderer.resolution:e.resolution;const r=this._renderer.htmlText.getTexturePromise(e);t.texturePromise=r,t.texture=await r;const a=e.renderGroup||e.parentRenderGroup;a&&(a.structureDidChange=!0),t.generatingTexture=!1,X(t,e)}_getGpuText(e){return e._gpuData[this._renderer.uid]||this.initGpuText(e)}initGpuText(e){const t=new Pt(this._renderer);return t.renderable=e,t.transform=e.groupTransform,t.texture=P.EMPTY,t.bounds={minX:0,maxX:1,minY:0,maxY:0},t.roundPixels=this._renderer._roundPixels|e._roundPixels,e._resolution=e._autoResolution?this._renderer.resolution:e.resolution,e._gpuData[this._renderer.uid]=t,t}destroy(){this._renderer=null}}Se.extension={type:[f.WebGLPipes,f.WebGPUPipes,f.CanvasPipes],name:"htmlText"};function St(){const{userAgent:o}=he.get().getNavigator();return/^((?!chrome|android).)*safari/i.test(o)}const wt=new oe;function we(o,e,t,r){const a=wt;a.minX=0,a.minY=0,a.maxX=o.width/r|0,a.maxY=o.height/r|0;const n=T.getOptimalTexture(a.width,a.height,r,!1);return n.source.uploadMethodId="image",n.source.resource=o,n.source.alphaMode="premultiply-alpha-on-upload",n.frame.width=e/r,n.frame.height=t/r,n.source.emit("update",n.source),n.updateUvs(),n}function Mt(o,e){const t=e.fontFamily,r=[],a={},n=/font-family:([^;"\s]+)/g,s=o.match(n);function i(l){a[l]||(r.push(l),a[l]=!0)}if(Array.isArray(t))for(let l=0;l<t.length;l++)i(t[l]);else i(t);s&&s.forEach(l=>{const u=l.split(":")[1].trim();i(u)});for(const l in e.tagStyles){const u=e.tagStyles[l].fontFamily;i(u)}return r}async function Ut(o){const t=await(await he.get().fetch(o)).blob(),r=new FileReader;return await new Promise((n,s)=>{r.onloadend=()=>n(r.result),r.onerror=s,r.readAsDataURL(t)})}async function re(o,e){const t=await Ut(e);return`@font-face {
        font-family: "${o.fontFamily}";
        src: url('${t}');
        font-weight: ${o.fontWeight};
        font-style: ${o.fontStyle};
    }`}const B=new Map;async function Gt(o,e,t){const r=o.filter(a=>Y.has(`${a}-and-url`)).map((a,n)=>{if(!B.has(a)){const{url:s}=Y.get(`${a}-and-url`);n===0?B.set(a,re({fontWeight:e.fontWeight,fontStyle:e.fontStyle,fontFamily:a},s)):B.set(a,re({fontWeight:t.fontWeight,fontStyle:t.fontStyle,fontFamily:a},s))}return B.get(a)});return(await Promise.all(r)).join(`
`)}function Bt(o,e,t,r,a){const{domElement:n,styleElement:s,svgRoot:i}=a;n.innerHTML=`<style>${e.cssStyle}</style><div style='padding:0;'>${o}</div>`,n.setAttribute("style",`transform: scale(${t});transform-origin: top left; display: inline-block`),s.textContent=r;const{width:l,height:u}=a.image;return i.setAttribute("width",l.toString()),i.setAttribute("height",u.toString()),new XMLSerializer().serializeToString(i)}function Ft(o,e){const t=fe.getOptimalCanvasAndContext(o.width,o.height,e),{context:r}=t;return r.clearRect(0,0,o.width,o.height),r.drawImage(o,0,0),t}function Rt(o,e,t){return new Promise(async r=>{t&&await new Promise(a=>setTimeout(a,100)),o.onload=()=>{r()},o.src=`data:image/svg+xml;charset=utf8,${encodeURIComponent(e)}`,o.crossOrigin="anonymous"})}class Me{constructor(e){this._renderer=e,this._createCanvas=e.type===H.WEBGPU}getTexture(e){return this.getTexturePromise(e)}getTexturePromise(e){return this._buildTexturePromise(e)}async _buildTexturePromise(e){const{text:t,style:r,resolution:a,textureStyle:n}=e,s=R.get(He),i=Mt(t,r),l=await Gt(i,r,$e.defaultTextStyle),u=qe(t,r,l,s),h=Math.ceil(Math.ceil(Math.max(1,u.width)+r.padding*2)*a),d=Math.ceil(Math.ceil(Math.max(1,u.height)+r.padding*2)*a),c=s.image,p=2;c.width=(h|0)+p,c.height=(d|0)+p;const b=Bt(t,r,a,l,s);await Rt(c,b,St()&&i.length>0);const g=c;let x;this._createCanvas&&(x=Ft(c,a));const m=we(x?x.canvas:g,c.width-p,c.height-p,a);return n&&(m.source.style=n),this._createCanvas&&(this._renderer.texture.initSource(m.source),fe.returnCanvasAndContext(x)),R.return(s),m}returnTexturePromise(e){e.then(t=>{this._cleanUp(t)}).catch(()=>{se("HTMLTextSystem: Failed to clean texture")})}_cleanUp(e){T.returnTexture(e,!0),e.source.resource=null,e.source.uploadMethodId="unknown"}destroy(){this._renderer=null}}Me.extension={type:[f.WebGLSystem,f.WebGPUSystem,f.CanvasSystem],name:"htmlText"};class Dt extends pe{constructor(e){super(),this._renderer=e,e.runners.resolutionChange.add(this)}resolutionChange(){const e=this.renderable;e._autoResolution&&e.onViewUpdate()}destroy(){this._renderer.canvasText.returnTexture(this.texture),this._renderer=null}}class Ue{constructor(e){this._renderer=e}validateRenderable(e){return e._didTextUpdate}addRenderable(e,t){const r=this._getGpuText(e);e._didTextUpdate&&(this._updateGpuText(e),e._didTextUpdate=!1),this._renderer.renderPipes.batch.addToBatch(r,t)}updateRenderable(e){const t=this._getGpuText(e);t._batcher.updateElement(t)}_updateGpuText(e){const t=this._getGpuText(e);t.texture&&this._renderer.canvasText.returnTexture(t.texture),e._resolution=e._autoResolution?this._renderer.resolution:e.resolution,t.texture=t.texture=this._renderer.canvasText.getTexture(e),X(t,e)}_getGpuText(e){return e._gpuData[this._renderer.uid]||this.initGpuText(e)}initGpuText(e){const t=new Dt(this._renderer);return t.renderable=e,t.transform=e.groupTransform,t.bounds={minX:0,maxX:1,minY:0,maxY:0},t.roundPixels=this._renderer._roundPixels|e._roundPixels,e._gpuData[this._renderer.uid]=t,t}destroy(){this._renderer=null}}Ue.extension={type:[f.WebGLPipes,f.WebGPUPipes,f.CanvasPipes],name:"text"};class Ge{constructor(e){this._renderer=e}getTexture(e,t,r,a){typeof e=="string"&&(y("8.0.0","CanvasTextSystem.getTexture: Use object TextOptions instead of separate arguments"),e={text:e,style:r,resolution:t}),e.style instanceof Q||(e.style=new Q(e.style)),e.textureStyle instanceof W||(e.textureStyle=new W(e.textureStyle)),typeof e.text!="string"&&(e.text=e.text.toString());const{text:n,style:s,textureStyle:i}=e,l=e.resolution??this._renderer.resolution,{frame:u,canvasAndContext:h}=V.getCanvasAndContext({text:n,style:s,resolution:l}),d=we(h.canvas,u.width,u.height,l);if(i&&(d.source.style=i),s.trim&&(u.pad(s.padding),d.frame.copyFrom(u),d.updateUvs()),s.filters){const c=this._applyFilters(d,s.filters);return this.returnTexture(d),V.returnCanvasAndContext(h),c}return this._renderer.texture.initSource(d._source),V.returnCanvasAndContext(h),d}returnTexture(e){const t=e.source;t.resource=null,t.uploadMethodId="unknown",t.alphaMode="no-premultiply-alpha",T.returnTexture(e,!0)}renderTextToCanvas(){y("8.10.0","CanvasTextSystem.renderTextToCanvas: no longer supported, use CanvasTextSystem.getTexture instead")}_applyFilters(e,t){const r=this._renderer.renderTarget.renderTarget,a=this._renderer.filter.generateFilteredTexture({texture:e,filters:t});return this._renderer.renderTarget.bind(r,!1),a}destroy(){this._renderer=null}}Ge.extension={type:[f.WebGLSystem,f.WebGPUSystem,f.CanvasSystem],name:"canvasText"};_.add(ge);_.add(Ne);_.add(_e);_.add(ye);_.add(Te);_.add(Ge);_.add(Ue);_.add(Pe);_.add(Me);_.add(Se);_.add(Ce);_.add(ve);_.add(xe);_.add(me);
