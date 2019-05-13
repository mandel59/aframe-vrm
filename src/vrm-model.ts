import * as AFRAME from 'aframe';
import { VRMLoader, VRM, VRMPhysics } from 'three-vrm';

export interface VRMModelComponent extends AFRAME.Component<{ src: string }> {
    loader: VRMLoader;
    vrm: VRM | null;
    physics: VRMPhysics | null;
}

const vrmModel: Partial<VRMModelComponent> = {
    schema: {
        src: { type: 'model' }
    },
    init(this: VRMModelComponent) {
        this.loader = new VRMLoader();
        this.vrm = null;
    },
    update(this: VRMModelComponent, oldData) {
        var el = this.el;
        var src = this.data.src;
        if (oldData.src !== src) {
            this.remove();
            if (!src) {
                return;
            }
            this.loader.load(src,
                /* onLoad */
                (vrm) => {
                    this.vrm = vrm;
                    this.physics = new VRMPhysics(vrm);
                    var model = this.vrm.model;
                    el.setObject3D('mesh', model);
                    el.emit('model-loaded', { format: 'vrm', vrm: vrm, model: model });
                },
                /* onProgress */ undefined,
                /* onFailed */
                (error) => {
                    var message = (error && error.message) ? error.message : 'Failed to load VRM model';
                    console.warn(message);
                    el.emit('model-error', { format: 'vrm', src: src });
                }
            );
        }
    },
    tick(this: VRMModelComponent, time, timeDelta) {
        if (this.physics) { this.physics.update(timeDelta * 0.001); }
    },
    remove(this: VRMModelComponent) {
        if (this.vrm) { this.el.removeObject3D('mesh'); }
        this.vrm = null;
        this.physics = null;
    }
}

export const VRMModelComponent = AFRAME.registerComponent('vrm-model', vrmModel) as AFRAME.ComponentConstructor<VRMModelComponent>;
