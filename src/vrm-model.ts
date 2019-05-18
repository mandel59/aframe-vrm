import * as AFRAME from 'aframe';
import { VRMLoader, VRM, VRMPhysics, VRMBlendShape, VRMBlendShapeGroup } from 'three-vrm';

interface Blend {
    morphTargetInfluences: number[];
    index: number;
    weight: number;
}
interface MaterialBlend {
    material: THREE.Material
}

interface PresetBlendShape {
    neutral?: BlendShapeGroup;
    a?: BlendShapeGroup;
    i?: BlendShapeGroup;
    u?: BlendShapeGroup;
    e?: BlendShapeGroup;
    o?: BlendShapeGroup;
    blink?: BlendShapeGroup;
    joy?: BlendShapeGroup;
    angry?: BlendShapeGroup;
    sorrow?: BlendShapeGroup;
    fun?: BlendShapeGroup;
    lookup?: BlendShapeGroup;
    lookdown?: BlendShapeGroup;
    lookleft?: BlendShapeGroup;
    lookright?: BlendShapeGroup;
    blink_l?: BlendShapeGroup;
    blink_r?: BlendShapeGroup;
}

function clamp(value: number, lo: number = 0, hi: number = 1) {
    if (value > hi) return hi;
    if (value < lo) return lo;
    return value;
}

class BlendShapeGroup {
    private _value: number;
    constructor(
        readonly name: string,
        readonly presetName: string,
        private blends: Blend[],
        _materialBlends: MaterialBlend[],
        readonly isBinary: boolean,
    ) {
        this._value = 0;
    }
    static fromVRMBlendShapeGroup(vrm: VRM, group: VRMBlendShapeGroup) {
        // @ts-ignore
        const meshes: THREE.Mesh[][] = vrm.meshes;
        // @ts-ignore
        const { name, presetName, binds, materialValues, isBinary } = group;
        const blends: Blend[] = [];
        for (const { mesh, index, weight } of binds) {
            for (const { morphTargetInfluences } of meshes[mesh]) {
                if (morphTargetInfluences) {
                    const blend = {
                        morphTargetInfluences,
                        index,
                        weight: weight * 0.01,
                    }
                    blends.push(blend)
                }
            }
        }
        return new BlendShapeGroup(name, presetName, blends, [], isBinary);
    }
    get value() {
        return this._value;
    }
    set value(v: number) {
        v = clamp(v);
        if (this._value !== v) {
            this._value = v;
            this._update(v);
        }
    }
    private _update(value: number) {
        for (const { morphTargetInfluences, index, weight } of this.blends) {
            morphTargetInfluences[index] = value * weight;
        }
    }
}

interface VRMModelComponentSchema {
    src: string;
    "blend-shape-neutral": number;
    "blend-shape-a": number;
    "blend-shape-i": number;
    "blend-shape-u": number;
    "blend-shape-e": number;
    "blend-shape-o": number;
    "blend-shape-blink": number;
    "blend-shape-joy": number;
    "blend-shape-angry": number;
    "blend-shape-sorrow": number;
    "blend-shape-fun": number;
    "blend-shape-lookup": number;
    "blend-shape-lookdown": number;
    "blend-shape-lookleft": number;
    "blend-shape-lookright": number;
    "blend-shape-blink_l": number;
    "blend-shape-blink_r": number;
}

export interface VRMModelComponent extends AFRAME.Component<VRMModelComponentSchema> {
    loader: VRMLoader;
    vrm: VRM | null;
    physics: VRMPhysics | null;
    blendShape: Partial<Record<string, BlendShapeGroup>>;
    presetBlendShape: PresetBlendShape;
    initBlendShape(blendShape: VRMBlendShape): void;
}

const vrmModel: Partial<VRMModelComponent> = {
    schema: {
        src: { type: 'model' },
        "blend-shape-neutral": { type: 'number', default: 0 },
        "blend-shape-a": { type: 'number', default: 0 },
        "blend-shape-i": { type: 'number', default: 0 },
        "blend-shape-u": { type: 'number', default: 0 },
        "blend-shape-e": { type: 'number', default: 0 },
        "blend-shape-o": { type: 'number', default: 0 },
        "blend-shape-blink": { type: 'number', default: 0 },
        "blend-shape-joy": { type: 'number', default: 0 },
        "blend-shape-angry": { type: 'number', default: 0 },
        "blend-shape-sorrow": { type: 'number', default: 0 },
        "blend-shape-fun": { type: 'number', default: 0 },
        "blend-shape-lookup": { type: 'number', default: 0 },
        "blend-shape-lookdown": { type: 'number', default: 0 },
        "blend-shape-lookleft": { type: 'number', default: 0 },
        "blend-shape-lookright": { type: 'number', default: 0 },
        "blend-shape-blink_l": { type: 'number', default: 0 },
        "blend-shape-blink_r": { type: 'number', default: 0 },
    },
    init(this: VRMModelComponent) {
        this.loader = new VRMLoader();
        this.vrm = null;
        this.blendShape = Object.freeze({});
        this.presetBlendShape = Object.freeze({});
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
                    this.initBlendShape(vrm.blendShapeMaster);
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
        if (this.presetBlendShape["neutral"]) this.presetBlendShape["neutral"].value = this.data["blend-shape-neutral"];
        if (this.presetBlendShape["a"]) this.presetBlendShape["a"].value = this.data["blend-shape-a"];
        if (this.presetBlendShape["i"]) this.presetBlendShape["i"].value = this.data["blend-shape-i"];
        if (this.presetBlendShape["u"]) this.presetBlendShape["u"].value = this.data["blend-shape-u"];
        if (this.presetBlendShape["e"]) this.presetBlendShape["e"].value = this.data["blend-shape-e"];
        if (this.presetBlendShape["o"]) this.presetBlendShape["o"].value = this.data["blend-shape-o"];
        if (this.presetBlendShape["blink"]) this.presetBlendShape["blink"].value = this.data["blend-shape-blink"];
        if (this.presetBlendShape["joy"]) this.presetBlendShape["joy"].value = this.data["blend-shape-joy"];
        if (this.presetBlendShape["angry"]) this.presetBlendShape["angry"].value = this.data["blend-shape-angry"];
        if (this.presetBlendShape["sorrow"]) this.presetBlendShape["sorrow"].value = this.data["blend-shape-sorrow"];
        if (this.presetBlendShape["fun"]) this.presetBlendShape["fun"].value = this.data["blend-shape-fun"];
        if (this.presetBlendShape["lookup"]) this.presetBlendShape["lookup"].value = this.data["blend-shape-lookup"];
        if (this.presetBlendShape["lookdown"]) this.presetBlendShape["lookdown"].value = this.data["blend-shape-lookdown"];
        if (this.presetBlendShape["lookleft"]) this.presetBlendShape["lookleft"].value = this.data["blend-shape-lookleft"];
        if (this.presetBlendShape["lookright"]) this.presetBlendShape["lookright"].value = this.data["blend-shape-lookright"];
        if (this.presetBlendShape["blink_l"]) this.presetBlendShape["blink_l"].value = this.data["blend-shape-blink_l"];
        if (this.presetBlendShape["blink_r"]) this.presetBlendShape["blink_r"].value = this.data["blend-shape-blink_r"];
    },
    initBlendShape(this: VRMModelComponent, blendShape: VRMBlendShape) {
        if (this.vrm == null) return;
        this.blendShape = {};
        this.presetBlendShape = {};
        for (const group of blendShape.blendShapeGroups) {
            const g = BlendShapeGroup.fromVRMBlendShapeGroup(this.vrm, group);
            this.blendShape[g.name] = g;
            if (g.presetName !== "unknown") {
                this.presetBlendShape[g.presetName as keyof PresetBlendShape] = g;
            }
        }
        Object.freeze(this.blendShape);
        Object.freeze(this.presetBlendShape);
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
