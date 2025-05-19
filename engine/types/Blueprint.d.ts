declare module BP {
    class BlueprintCreateUtil {
        static __init__(): Promise<void>;
        static reg(): void;
    }
    class BlueprintDecorator {
        static bpUserMap: Map<Function, TBPDeclaration>;
        static initDeclaration(name: string, cls: Function): TBPDeclaration;
        /**
         * 蓝图装饰器
         * @param options
         */
        static bpClass(target: any, options: BPDecoratorsOptionClass): TBPDeclaration;
        /**
         * 蓝图装饰器,属性
         */
        static bpProperty(target: any, propertyKey: string, options: BPDecoratorsOptionProp): void;
        /**
         * 蓝图装饰器，方法
         */
        static bpFunction(target: any, propertyKey: string, descriptor: any, options: BPDecoratorsOptionFunction): void;
        /**
         * 蓝图装饰器，getset
         */
        static bpAccessor(target: any, propertyKey: string, descriptor: any, options: BPDecoratorsOptionProp): void;
        /**
         * 增加一个蓝图枚举
         * @param name 枚举名称
         * @param merbers 枚举成员
         */
        static createBPEnum(name: string, merbers: TBPDeclarationMerber[]): void;
    }
    /**
     * 蓝图装饰器
     * @param options
     */
    function bpClass(options: BPDecoratorsOptionClass): (target: any) => void;
    /**
     * 蓝图装饰器,属性
     */
    function bpProperty(options: BPDecoratorsOptionProp): (target: any, propertyKey: string) => void;
    /**
     * 蓝图装饰器，方法
     */
    function bpFunction(options?: BPDecoratorsOptionFunction): (target: any, propertyKey: string, descriptor: any) => void;
    /**
     * 蓝图装饰器，getset
     */
    function bpAccessor(options: BPDecoratorsOptionProp): (target: any, propertyKey: string, descriptor: any) => void;
    /**
     * 增加一个蓝图枚举
     * @param name 枚举名称
     * @param merbers 枚举成员
     */
    function createBPEnum(name: string, merbers: TBPDeclarationMerber[]): void;
    class BlueprintLoader implements IResourceLoader {
        load(task: ILoadTask): Promise<BlueprintResource>;
        postLoad(task: ILoadTask, bp: BlueprintResource): Promise<void>;
    }
    class BlueprintResource extends Resource {
        data: IBPSaveData;
        dec: TBPDeclaration;
        allData: Record<string, any>;
        private _cls;
        private _bid;
        private varMap;
        private allNode;
        constructor(bid: string);
        get cls(): Function;
        private _initTarget;
        initClass(data: IBPSaveData): void;
        parse(): void;
        protected _disposeResource(): void;
    }
    class BlueprintConst {
        static MAX_CODELINE: number;
        static NULL_NODE: number;
        static VERSION: number;
        static EXT: string;
        static TYPE: string;
        static configPath: string;
    }
    const EXECID = "-1";
    const TARGETID = "-2";
    class BlueprintData {
        /**对当前打开的蓝图数据进行检测的逻辑 */
        getConstDataExt: (target: string, dataId: string) => IBPCNode;
        static allDataMap: Map<string, Record<string, IBPCNode>>;
        private static defFunOut;
        private static defFunIn;
        private static defTarget;
        private static defEventOut;
        /**所有的数据 */
        /**
         * constData里面的数据应该包含customData的数据
         */
        constData: Record<string, IBPConstNode>;
        /**自動生成的模板數據，這些數據不會在鼠標右鍵菜單中出現，也不會傳輸到ide層去 */
        autoCreateData: Record<string, IBPCNode>;
        private static readonly funlike;
        private static readonly checklike;
        private _extendsData;
        private _regFunction;
        private _getClass;
        static formatName(param: TBPDeclarationParam): string;
        static formatType(type: Laya.FPropertyType): Laya.FPropertyType;
        constructor(extendsData: Record<string, TBPDeclaration>, regFunction?: (fname: string, fun: Function, isMember: boolean, cls: any, target: string) => void, getClass?: (name: string) => any);
        get extendsData(): Record<string, TBPDeclaration>;
        getExtends(ext: string, arr?: string[]): string[];
        getConstDataById(target: string, dataId: string): IBPCNode;
        private _getConstData;
        /**在引擎执行的时候需要启用catch来提高效率，在ide中不需要，因为ide中有时候会经常变动数据 */
        isStartCatch: boolean;
        static clone<T>(obj: T): T;
        private _getConstByNode;
        getConstNode(node: IBPNode): IBPCNode;
        private _checkAndPush;
        private _createExtData;
        private _createConstData;
        isResetData: boolean;
        removeData(ext: string): void;
        resetData(data: TBPDeclaration, ext: string): void;
        initData(data: Record<string, TBPDeclaration>): void;
        private static handleCDataTypes;
        private static createCData;
        static formatData(data: IBPSaveData, assetId: string, dataMap?: Record<string, IBPCNode>, varMap?: Record<string, IBPVariable>): TBPDeclaration;
        private static _initTarget;
    }
    abstract class BlueprintNode<T extends BlueprintPin> {
        id: string;
        nid: number;
        name: string;
        type: BPType;
        def: IBPCNode;
        pins: T[];
        constructor();
        abstract createPin(def: TBPPinDef): T;
        addPin(pin: T): void;
        parse(def: IBPCNode): void;
        getPropertyItem(key: string): import("../datas/types/IBlueprint").IBPCInput;
        getValueType(key: string): "class" | "resource";
        isEmptyObj(o: any): boolean;
        /**
         * 强制写入target的inputValue
         * @param node
         * @returns
         */
        private _checkTarget;
        parseLinkData(node: IBPNode, manger: INodeManger<BlueprintNode<T>>): void;
        protected onParseLinkData(node: IBPNode, manger: INodeManger<BlueprintNode<T>>): void;
        setFunction(fun: Function, isMember: boolean): void;
        setType(type: BPType): void;
        addInput(input: TBPPinDef[]): void;
        addOutput(output: TBPPinDef[]): void;
        getPinByName(id: string): T;
    }
    class BlueprintPin {
        private _direction;
        get direction(): EPinDirection;
        set direction(value: EPinDirection);
        id: string;
        name: string;
        nid: string;
        type: EPinType;
        otype: string;
        linkTo: BlueprintPin[];
        value: any;
        constructor();
        parse(def: TBPPinDef): void;
        startLinkTo(e: BlueprintPin): void;
    }
    class BlueprintUtil {
        static classMap: any;
        static bpData: BlueprintData;
        static onfinishCallbacks: Record<number, [
            Function,
            any,
            any[]
        ]>;
        static resouceMap: Map<string, any>;
        static CustomClassFinish: string;
        static customModify: boolean;
        static clone<T>(obj: T): T;
        static getConstNode(node?: IBPNode): IBPCNode;
        static getConstDataById(target: string, dataId: string): IBPCNode;
        /**
         * hook
         * @param name
         * @param data
         */
        static addCustomData(name: string, data: TBPDeclaration): void;
        static getDeclaration(name: string): TBPDeclaration;
        static initConstNode(): void;
        static getClass(ext: any): any;
        static regClass(name: string, cls: any): void;
        static regResByUUID(uuid: string, res: any): void;
        static getResByUUID(uuid: string): any;
        static getNameByUUID(uuid: string): string;
    }
    /**
     * 引脚方向
     */
    enum EPinDirection {
        Input = 0,
        Output = 1,
        All = 2
    }
    /**
     * 节点类型
     */
    enum EBlueNodeType {
        Unknow = "unkown",
        Event = "event",
        Fun = "fun",
        Pure = "pure",
        GetVariable = "var",
        SetVarialbe = "setVar",
        Branch = "branch",
        Sequnece = "sequnece"
    }
    /**
     * 引脚类型
     */
    enum EPinType {
        Exec = 0,
        BPFun = 1,
        Other = 2
    }
    interface IBluePrintSubclass {
        [BlueprintFactory.bpSymbol]: BlueprintRuntime;
        [BlueprintFactory.contextSymbol]: IRunAble;
        [key: string]: any;
    }
    interface IExcuteListInfo {
        nid: number;
    }
    interface INodeManger<T> {
        getNodeById(id: any): T;
        dataMap: Record<string, IBPCNode | IBPVariable>;
    }
    interface IOutParm {
        readonly name: string;
        setValue(runId: number, value: any): void;
    }
    interface IRuntimeDataManger {
        getDataById(nid: number): RuntimeNodeData;
        setPinData(pin: BlueprintPinRuntime, value: any, runId: number): void;
        getPinData(pin: BlueprintPinRuntime, runId: number): any;
        getRuntimePinById(id: string): RuntimePinData;
        getVar(name: string, runId: number): any;
        setVar(name: string, value: any, runId: number): void;
        clearVar(runId: number): void;
        saveContextData(from: number, to: number): void;
    }
    type TBPNodeDef = {
        name: string;
        id: string;
        type: BPType;
        inPut?: TBPPinDef[];
        outPut?: TBPPinDef[];
        fun?: Function;
    };
    type TBPPinDef = {
        id: string;
        name: string;
        type: string;
    };
    type TBPNodeData = {
        id: string;
        did: string;
        data: Record<string, TBPPinData>;
    };
    type TBPLinkInfo = {
        varname: string;
    };
    type TBPPinData = {
        value?: any;
        linkto?: string[];
    };
    const BlueprintDataList: IBPCNode[];
    /**
     * 开发者自定义相关
     */
    const customData: Record<string, TBPDeclaration>;
    const extendsData: Record<string, TBPDeclaration>;
    type TBPDecoratorsPropertType = "function" | "property" | "class";
    type TBPDecoratorsFuncType = "pure" | "function" | "event" | BPType.Pure | BPType.Function | BPType.Event;
    type TBPDeclarationType = "Enum" | "Node" | "Component" | "Others";
    /** 修饰符 */
    type BPModifiers = {
        /** 是否是私有 */
        isPrivate?: boolean;
        /** 是否是公有 */
        isPublic?: boolean;
        /** 是否是受保护的 */
        isProtected?: boolean;
        /** 是否是静态 */
        isStatic?: boolean;
        /** 是否为只读 */
        isReadonly?: boolean;
        /**
         * 是否是自动运行
         */
        isAutoRun?: boolean;
    };
    type TBPDeclaration = {
        /** 包名 */
        module?: string;
        /** 当前描述名 */
        name: string;
        /** 当前描述的具体类型 */
        type: TBPDeclarationType;
        /** 能否被继承 */
        canInherited?: boolean;
        /** 父类  */
        extends?: string;
        /** 事件相关 */
        events?: TBPDeclarationEvent[];
        /** 实现的接口名 */
        implements?: string[];
        /** 该描述的属性列表 */
        props?: TBPDeclarationProp[];
        /** 该描述的方法列表 */
        funcs?: TBPDeclarationFunction[];
        /** 构造函数 */
        construct?: TBPDeclarationConstructor;
        /** 枚举成员 */
        merbers?: TBPDeclarationMerber[];
        /** 显示名称，没有默认使用name */
        caption?: string;
        /** 分组 */
        catalog?: string;
        /** 提示内容 */
        tips?: string;
    };
    type TBPDeclarationMerber = {
        /** 枚举名称 */
        name: string;
        /** 枚举值 */
        value: number | string;
        /** 显示名称，没有默认使用name */
        caption?: string;
        /** 分组 */
        catalog?: string;
        /** 提示内容 */
        tips?: string;
    };
    type TBPDeclarationEvent = {
        name: string;
        params?: TBPDeclarationEventData[];
    };
    type TBPDeclarationEventData = {
        id?: number;
        /** 参数名称 */
        name: string;
        /** 参数类型 */
        type: string;
        /** 显示名称，没有默认使用name */
        caption?: string;
        /** 分组 */
        catalog?: string;
        /** 提示内容 */
        tips?: string;
    };
    type TBPDeclarationConstructor = {
        params?: TBPDeclarationParam[];
        /** 显示名称，没有默认使用name */
        caption?: string;
        /** 分组 */
        catalog?: string;
        /** 提示内容 */
        tips?: string;
    };
    type TBPDeclarationProp = {
        /** 变量名称 */
        name: string;
        value?: any;
        /** 变量类型 */
        type?: string | Function;
        customId?: string | number;
        /** 是否有getter 方法 */
        getter?: boolean;
        /** 是否有setter 方法 */
        setter?: boolean;
        /** 泛型 */
        typeParameters?: any;
        /** 修饰符 */
        modifiers?: BPModifiers;
        /** 是否来自父类 */
        fromParent?: string;
        /** 显示名称，没有默认使用name */
        caption?: string;
        /** 分组 */
        catalog?: string;
        /** 提示内容 */
        tips?: string;
    };
    type TBPDeclarationFunction = {
        /** 方法名称 */
        name: string;
        /**鼠标右键里面的菜单路径,如果填写none则代表不在菜单中显示 */
        menuPath?: string;
        /** 具体方法类型 */
        type?: TBPDecoratorsFuncType;
        /** 修饰符 */
        modifiers?: BPModifiers;
        /** 方法的参数列表 */
        params?: TBPDeclarationParam[];
        /** 方法的返回类型 */
        returnType: string | any[];
        /** 方法的返回注释 */
        returnTips?: string;
        /** 泛型 */
        typeParameters?: any;
        /** 注册的原始方法 */
        originFunc?: Function;
        /** 是否来自父类 */
        fromParent?: string;
        customId?: number | string;
        /** 显示名称，没有默认使用name */
        caption?: string;
        /** 分组 */
        catalog?: string;
        /** 提示内容 */
        tips?: string;
    };
    type TBPDeclarationParam = {
        id?: number;
        /** 参数名称 */
        name: string;
        /** 参数类型 */
        type: string;
        /** 是否为可选项 */
        optional?: boolean;
        /** 是否为...方法 */
        dotdotdot?: boolean;
        /** 显示名称，没有默认使用name */
        caption?: string;
        /** 分组 */
        catalog?: string;
        /** 提示内容 */
        tips?: string;
    };
    interface BPDecoratorsOptionBase {
        /** 标题，如果不提供将使用name */
        caption?: string;
        /** 注册对象成员类型 */
        propertType?: TBPDecoratorsPropertType;
        /** 修饰符 */
        modifiers?: BPModifiers;
        /** 分类 */
        catalog?: string;
        /** 提示内容 */
        tips?: string;
    }
    interface BPDecoratorsOptionClass extends BPDecoratorsOptionBase {
        /** 注册名称 */
        name: string;
        /** 继承的父类 */
        extends?: string;
        /** 能否被继承 */
        canInherited?: boolean;
        /** 构造函数参数 */
        construct?: TBPDeclarationConstructor;
        /** 事件相关 */
        events?: TBPDeclarationEvent[];
    }
    interface BPDecoratorsOptionFunction extends BPDecoratorsOptionBase {
        /** 方法或者构造函数参数，必填 */
        params?: TBPDeclarationParam[];
        /**
         * 方法分类
         * @default BPType.Function
         */
        type?: TBPDecoratorsFuncType;
        /**
         * 返回类型
         */
        returnType?: string;
    }
    interface BPDecoratorsOptionProp extends BPDecoratorsOptionBase {
        /** 参数类型 */
        type: string;
    }
    interface IBPSaveData {
        autoID: number;
        preload?: string[];
        extends: string;
        blueprintArr: Array<IBPStageData>;
        variable: IBPVariable[];
        functions: IBPStageData[];
        events: IBPCNode[];
        source?: any;
        globalInfo?: Record<string, any>;
    }
    interface CopyType {
        arr: (IBPNode | IBComment)[];
        width: number;
        height: number;
    }
    interface IBPVariable extends Partial<IBPCNode> {
        name: string;
        type: string;
        value?: any;
    }
    interface IBPStageData extends Partial<IBPCNode> {
        /** 修饰符 */
        modifiers?: BPModifiers;
        name: string;
        id: number;
        uiData?: {
            /**场景的x坐标位置 */
            x: number;
            /**场景的y坐标位置 */
            y: number;
            /**场景的缩放 */
            scale: number;
        };
        /**临时变量数据 */
        variable?: IBPVariable[];
        arr: Array<IBPNode>;
        comments?: Array<IBComment>;
        /**保存的时候不会有这个值，这是build的时候传值用的 */
        dataMap?: Record<string, IBPCNode>;
        tips?: string;
        properties?: Array<IBPCInput>;
        output?: IBPCOutput[];
    }
    interface IBComment {
        id: number;
        x: number;
        y: number;
        width: number;
        height: number;
        desc: string;
        fontSize?: number;
        color?: {
            r: number;
            g: number;
            b: number;
        };
        noSticky?: boolean;
    }
    interface IBPConstNode {
        extends?: string;
        data: Record<string, IBPCNode>;
        caption?: string;
    }
    interface IBPCNode {
        isSelf?: boolean;
        /**程序中用到的名字 */
        name: string;
        caption?: string;
        /** */
        bpType?: "function" | "event" | "prop" | "construct";
        target?: string;
        /**target有可能是uuid，所以需要这个别名 */
        targetAliasName?: string;
        /** 提示内容 */
        tips?: string;
        module?: string;
        /**如果是自定义函数会有这个id号 */
        customId?: number;
        /**泛型的类型定义 */
        typeParameters?: Record<string, {
            extends?: string[];
        }>;
        /** 修饰符 */
        modifiers?: BPModifiers;
        /** 数据唯一的id号,可以不写，默认为name*/
        id?: string | number;
        /** 旧的id号，用于兼容旧的版本 */
        oldId?: string;
        /**该节点的类型，如果是variable则类型为string */
        type: BPType | string;
        /**鼠标右键里面的菜单路径,如果填写none则代表不在菜单中显示 */
        menuPath?: string;
        /**版本号 */
        ver?: number;
        properties: Array<IBPCInput>;
        output?: IBPCOutput[];
        /**插槽上的默認值 */
        inputValue?: Record<string, any>;
        const?: boolean;
    }
    interface IBPCOutput {
        /**插槽的id号，一般用户自定义插槽会有这个值 */
        id?: string | number;
        /** 插槽名称 */
        name?: string;
        /**插槽的别名，通常用于自定义函数中 */
        caption?: string;
        tips?: string;
        /** 插槽允许的输出连接类型，输入字符串表示仅能连接该类型，数组表示可连接数组内类型*/
        type: Laya.FPropertyType;
    }
    interface IBPCInput {
        id?: string | number;
        type?: Laya.FPropertyType;
        name?: string;
        caption?: string;
        tips?: string;
        /**input简介提示，UI上显示使用，鼠标挪动到UI上会出现该提示信息 */
        alt?: string;
        /**inputValue的类型 */
        valueType?: "class" | "resource";
        isAsset?: boolean;
    }
    enum BPType {
        Event = "event",
        Function = "function",
        BPEvent = "bpEvent",
        Pure = "pure",
        Class = "class",
        Operator = "operator",
        GetValue = "getvalue",
        SetValue = "setvalue",
        GetTmpValue = "getTmpValue",
        SetTmpValue = "setTmpValue",
        Branch = "branch",
        Block = "Block",
        Sequence = "sequence",
        NewTarget = "newtarget",
        CustomFun = "customFun",
        CustomFunStart = "customFunStart",
        CustomFunReturn = "customFunReturn",
        Expression = "expression",
        Assertion = "Assertion"
    }
    interface IBPNode {
        /** 数据唯一的id号*/
        id: number;
        ver?: number;
        /**当前的类 */
        target?: string;
        name?: string;
        /** constData的id号 */
        cid: string;
        /**var或者event的id */
        dataId?: string;
        customId?: number;
        /**所有UI所用到的数据 */
        uiData?: {
            /**数据的x坐标位置 */
            x: number;
            /**数据的y坐标位置 */
            y: number;
            /**函数注释 */
            desc?: any;
            /**是否隐藏 */
            isHidden?: boolean;
            /**是否显示desc的气泡 */
            isShowDesc?: boolean;
        };
        debugType?: number;
        input?: Record<string, IBPInput>;
        /**对应inputValue的type关键字，如果typeKey发生变化说明inputValue需要被清空 */
        typeKey?: string;
        /**插槽上的默認值 */
        inputValue?: Record<string, any>;
        /**动态增加的input节点 */
        properties?: Array<IBPCInput>;
        /**动态增加的输出节点 */
        outputs?: IBPCOutput[];
        output?: Record<string, IBPOutput>;
        autoReg?: boolean;
    }
    interface IBPInput {
        type?: Laya.FPropertyType;
        /**插槽注释 */
        desc?: string;
        class?: string;
        resource?: string;
    }
    interface IBPOutput {
        infoArr: IBPConnType[];
    }
    interface IBPConnType {
        /** 插槽连接到的另一个节点的id */
        nodeId: number;
        /** 插槽连接到的另一个节点的第n个插槽 */
        index?: number;
        /**连接到的input或者output的ID号 */
        id?: string;
        /**连接到的input或者output的name */
        name?: string;
    }
    interface IBPProperty {
        title?: string;
        type: string;
        data: any;
    }
    class BPArray<T> {
        length: number;
        static getItem<T>(arr: Array<T>, index: number): T;
        static setItem<T>(arr: Array<T>, index: number, value: T): void;
        push(item: T): number;
        pop(): T;
        splice(start: number, deleteCount?: number): T;
        shift(): T;
        unshift(item: T): T;
        join(separator?: string): string;
        concat(item: ConcatArray<T>): T;
    }
    class BPMathLib {
        /**
         * 两数相加
         * @param a 第一个数
         * @param b 第二个数
         * @returns 两数相加的结果
         */
        static add(a: number, b: number): number;
        /**
         * 两数相减
         * @param a 被减数
         * @param b 减数
         * @returns 两数相减的结果
         */
        static subtract(a: number, b: number): number;
        /**
         * 两数相乘
         * @param a 第一个数
         * @param b 第二个数
         * @returns 两数相乘的结果
         */
        static multiply(a: number, b: number): number;
        /**
         * 两数相除
         * @param a 被除数
         * @param b 除数
         * @returns 两数相除的结果
         * @throws 如果除数为0，则抛出错误
         */
        static divide(a: number, b: number): number;
        /**
         * 计算数字的幂次方
         * @param base 底数
         * @param exponent 指数
         * @returns 幂次方的结果
         */
        static power(base: number, exponent: number): number;
        /**
         * 计算平方根
         * @param value 数字
         * @returns 平方根的结果
         * @throws 如果数字为负数，则抛出错误
         */
        static sqrt(value: number): number;
        /**
         * 计算一个数的绝对值
         * @param value 数字
         * @returns 数字的绝对值
         */
        static abs(value: number): number;
        /**
         * 计算正弦值
         * @param angle 角度
         * @returns 正弦值
         */
        static sin(angle: number): number;
        /**
         * 计算余弦值
         * @param angle 角度
         * @returns 余弦值
         */
        static cos(angle: number): number;
        /**
         * 计算正切值
         * @param angle 角度
         * @returns 正切值
         */
        static tan(angle: number): number;
        /**
         * 计算反正弦值
         * @param value 数值
         * @returns 反正弦值
         */
        static asin(value: number): number;
        /**
         * 计算反余弦值
         * @param value 数值
         * @returns 反余弦值
         */
        static acos(value: number): number;
        /**
         * 计算反正切值
         * @param value 数值
         * @returns 反正切值
         */
        static atan(value: number): number;
        /**
         * 计算 y/x（弧度表示）的反正切值
         * @param y y 轴坐标
         * @param x x 轴坐标
         * @returns 弧度
         */
        static atan2(y: number, x: number): number;
        /**
         * 计算两点之间的距离
         * @param x1 第一个点的x坐标
         * @param y1 第一个点的y坐标
         * @param x2 第二个点的x坐标
         * @param y2 第二个点的y坐标
         * @returns 两点之间的距离
         */
        static distance(x1: number, y1: number, x2: number, y2: number): number;
        /**
         * 四舍五入到指定的小数位数
         * @param value 要四舍五入的数字
         * @param decimals 小数位数，默认为0
         * @returns 四舍五入后的结果
         */
        static round(value: number, decimals?: number): number;
        /**
         * 向下取整
         * @param value 数字
         * @returns 向下取整后的结果
         */
        static floor(value: number): number;
        /**
         * 向上取整
         * @param value 数字
         * @returns 向上取整后的结果
         */
        static ceil(value: number): number;
        /**
         * 计算余数
         * @param dividend 被除数
         * @param divisor 除数
         * @returns 余数
         */
        static mod(dividend: number, divisor: number): number;
        /**
         * 计算两数的最小值
         * @param a 第一个数
         * @param b 第二个数
         * @returns 两数的最小值
         */
        static min(a: number, b: number): number;
        /**
         * 计算两数的最大值
         * @param a 第一个数
         * @param b 第二个数
         * @returns 两数的最大值
         */
        static max(a: number, b: number): number;
        /**
         * 生成随机数，介于 0（包含） 到 1（不包括）之间
         * @returns 随机数
         */
        static random(): number;
        /**
         * 判断a是否大于b
         * @param a 第一个数字
         * @param b 第二个数字
         * @returns 如果a大于b，则返回true；否则返回false
         */
        static greater(a: number, b: number): boolean;
        /**
         * 判断a是否小于b
         * @param a 第一个数字
         * @param b 第二个数字
         * @returns 如果a小于b，则返回true；否则返回false
         */
        static less(a: number, b: number): boolean;
        /**
         *
         * @param a
         * @param b
         * @returns 是否相同
         */
        static equal(a: any, b: any): any;
        /**
         * 判断a是否大于等于b
         * @param a 第一个数字
         * @param b 第二个数字
         * @returns 如果a大于等于b，则返回true；否则返回false
         */
        static greaterEqual(a: number, b: number): boolean;
        /**
         * 判断a是否小于等于b
         * @param a 第一个数字
         * @param b 第二个数字
         * @returns 如果a小于等于b，则返回true；否则返回false
         */
        static lessEqual(a: number, b: number): boolean;
    }
    class BPObject<T> {
        static getItem<T>(obj: Record<string, T>, key: string): T;
        static setItem<T>(obj: Record<string, T>, key: string, value: T): void;
    }
    class ExpressParse {
        _catch: Map<string, ExpressTree>;
        static brackets: string[];
        static brackmap: any;
        private static _instance;
        static get instance(): ExpressParse;
        private isOperator;
        private tokenize;
        parse(expression: string): ExpressTree;
    }
    class ExpressTree {
        value: any;
        left: ExpressTree | null;
        right: ExpressTree | null;
        static strReg: RegExp;
        static realMap: any;
        call(context: any): any;
        constructor(value: any);
        static autoFormat(value: string): any;
        equal(value: any, context: any): void;
        private static isNumber;
        private static isString;
        private static isExpress;
        private static splitExpress;
        clone(): ExpressTree;
        static operatorPriority: any;
        static _inited: boolean;
        static parseProperty(express: string): ExpressTree;
        static creatreExpressTree(express: string): ExpressTree;
        static init(): void;
    }
    class ExpressOrgin extends ExpressTree {
        constructor(value: any);
        call(context: any): any;
    }
    class ExpressString extends ExpressTree {
        constructor(value: any);
        call(context: any): any;
    }
    class ExpressProperty extends ExpressTree {
        constructor(value: any);
        propertys: string[];
        realObj: any;
        realKey: string;
        equal(value: any, context: any): any;
        call(context: any): any;
    }
    class ExpressFunction extends ExpressProperty {
        params: ExpressTree[];
        call(context: any): any;
    }
    class ExpressDict extends ExpressTree {
        call(context: any): any;
        equal(value: any, context: any): void;
    }
    const Precedence: any;
    class BlueprintExcuteNode extends BlueprintRunBase implements IRunAble {
        owner: any;
        varDefineMap: Map<string, boolean>;
        runtimeDataMgrMap: Map<string | symbol, RuntimeDataManger>;
        readCache: boolean;
        private _cacheMap;
        setCacheAble(node: BlueprintRuntimeBaseNode, runId: number, value: any): void;
        getCacheAble(node: BlueprintRuntimeBaseNode, runId: number): boolean;
        constructor(data: any);
        finish(runtime: IBPRutime): void;
        getDataMangerByID(id: string | symbol): IRuntimeDataManger;
        initData(key: string | symbol, nodeMap: Map<number, BlueprintRuntimeBaseNode>, localVarMap: Record<string, IBPVariable>, parentId?: string | symbol): void;
        debuggerPause: boolean;
        pushBack(excuteNode: IExcuteListInfo, callback: any): void;
        getSelf(): any;
        initVar(name: string, value: any): void;
        setVar(name: string, value: any): void;
        getVar(name: string): any;
        getCode(): string;
        beginExcute(runtimeNode: BlueprintRuntimeBaseNode, runner: IBPRutime, enableDebugPause: boolean, fromPin: BlueprintPinRuntime, parmsArray: any[], prePin: BlueprintPinRuntime): BlueprintPromise;
        endExcute(runtimeNode: BlueprintRuntimeBaseNode): void;
        parmFromCustom(parmsArray: any[], parm: any, parmname: string): void;
        vars: {
            [key: string]: any;
        };
        parmFromOtherPin(current: BlueprintPinRuntime, runtimeDataMgr: IRuntimeDataManger, from: BlueprintPinRuntime, parmsArray: any[], runId: number): void;
        parmFromSelf(current: BlueprintPinRuntime, runtimeDataMgr: IRuntimeDataManger, parmsArray: any[], runId: number): void;
        parmFromOutPut(outPutParmPins: BlueprintPinRuntime[], runtimeDataMgr: IRuntimeDataManger, parmsArray: any[]): void;
        excuteFun(nativeFun: Function, returnResult: BlueprintPinRuntime, runtimeDataMgr: IRuntimeDataManger, caller: any, parmsArray: any[], runId: number): any;
        reCall(index: number): void;
    }
    class RuntimeDataManger implements IRuntimeDataManger {
        id: symbol | string;
        isInit: boolean;
        /**
        * 节点数据区Map
        */
        nodeMap: Map<number, RuntimeNodeData>;
        /**
         * 引脚数据Map
         */
        pinMap: Map<string, RuntimePinData>;
        parmsArray: RuntimePinData[];
        localVarObj: any;
        localVarMap: Map<number, any>;
        constructor(id: symbol | string);
        saveContextData(from: number, to: number): void;
        private _initGetVarObj;
        clearVar(runId: number): void;
        getVar(name: string, runId: number): any;
        setVar(name: string, value: any, runId: number): void;
        getDataById(nid: number): RuntimeNodeData;
        getRuntimePinById(id: string): RuntimePinData;
        setPinData(pin: BlueprintPinRuntime, value: any, runId: number): void;
        getPinData(pin: BlueprintPinRuntime, runId: number): any;
        initData(nodeMap: Map<number, BlueprintRuntimeBaseNode>, localVarMap: Record<string, IBPVariable>): void;
    }
    class BlueprintGenCodeNode extends BlueprintRunBase implements IRunAble {
        finish(runtime: IBPRutime): void;
        setCacheAble(node: BlueprintRuntimeBaseNode, runId: number, value: any): void;
        getCacheAble(node: BlueprintRuntimeBaseNode, runId: number): boolean;
        getDataMangerByID(id: string | symbol): IRuntimeDataManger;
        initData(key: string | symbol, nodeMap: Map<number, BlueprintRuntimeBaseNode>): void;
        debuggerPause: boolean;
        readCache: boolean;
        pushBack(excuteNode: IExcuteListInfo): void;
        getSelf(): void;
        reCall(index: number): void;
        getVar(name: string): void;
        initVar(name: string, value: any): void;
        setVar(name: string, value: any): void;
        find(input: any, outExcutes: BlueprintPinRuntime[]): BlueprintPinRuntime;
        codes: string[][];
        currentFun: string[];
        vars: {
            [key: string]: any;
        };
        blockMap: Map<number, any>;
        beginExcute(runtimeNode: BlueprintRuntimeBaseNode): BlueprintPromise;
        endExcute(runtimeNode: BlueprintRuntimeBaseNode): void;
        parmFromOtherPin(current: BlueprintPinRuntime, runtimeDataMgr: IRuntimeDataManger, from: BlueprintPinRuntime, parmsArray: any[], runId: number): void;
        parmFromSelf(current: BlueprintPinRuntime, runtimeDataMgr: IRuntimeDataManger, parmsArray: any[], runId: number): void;
        parmFromOutPut(outPutParmPins: BlueprintPinRuntime[], runtimeDataMgr: IRuntimeDataManger, parmsArray: any[]): void;
        parmFromCustom(parmsArray: any[], parm: any, parmname: string): void;
        excuteFun(nativeFun: Function, returnResult: BlueprintPinRuntime, runtimeDataMgr: IRuntimeDataManger, caller: any, parmsArray: any[], runId: number): void;
        toString(): string;
        getCode(): string;
    }
    class BlueprintRunBase {
        listNode: BlueprintRuntimeBaseNode[];
    }
    class RuntimeNodeData {
        map: Map<number, any[]>;
        callFunMap: Map<number, Function>;
        eventName: string;
        constructor();
        getCallFun(runId: number): Function;
        setCallFun(runId: number, fun: Function): void;
        getParamsArray(runId: number): any[];
    }
    class RuntimePinData implements IOutParm {
        name: string;
        private value;
        private valueMap;
        constructor();
        copyValue(runId: number, toRunId: number): void;
        initValue(value: any): void;
        setValue(runId: number, value: any): void;
        private getValueOnly;
        getValue(runId: number): any;
    }
    class BluePrintBlock implements INodeManger<BlueprintRuntimeBaseNode>, IBPRutime {
        hasRefAnony: boolean;
        localVarMap: Record<string, IBPVariable>;
        get blockSourceType(): EBlockSource;
        private poolIds;
        protected _maxID: number;
        /**
         * block ID 注释
         */
        id: symbol | string;
        /**
         * block 名称
         */
        name: string;
        /**
         * 节点Map
         */
        nodeMap: Map<any, BlueprintRuntimeBaseNode>;
        /**
         * 执行list
         */
        excuteList: BlueprintRuntimeBaseNode[];
        anonymousfunMap: Map<number, BlueprintEventNode>;
        anonymousBlockMap: Map<string, BluePrintEventBlock>;
        dataMap: Record<string, IBPVariable | IBPCNode>;
        constructor(id: symbol | string);
        getDataMangerByID(context: IRunAble): IRuntimeDataManger;
        get bpId(): string;
        getNodeById(id: any): BlueprintRuntimeBaseNode;
        idToIndex: Map<number, number>;
        private _addNode;
        optimizeByStart(value: BlueprintRuntimeBaseNode, excuteAbleList: BlueprintRuntimeBaseNode[]): void;
        clear(): void;
        optimize(): void;
        protected onParse(bpjson: IBPNode[]): void;
        append(node: BlueprintRuntimeBaseNode, item: IBPNode): void;
        getRunID(): number;
        _recoverRunID(id: number, runtimeDataMgr: IRuntimeDataManger): void;
        recoverRunID(id: number, runtimeDataMgr: IRuntimeDataManger): void;
        runAnonymous(context: IRunAble, event: BlueprintEventNode, parms: any[], cb: Function, runId: number, execId: number, newRunId: number, oldRuntimeDataMgr: IRuntimeDataManger): boolean;
        runByContext(context: IRunAble, runtimeDataMgr: IRuntimeDataManger, node: IExcuteListInfo, enableDebugPause: boolean, cb: Function, runId: number, fromPin: BlueprintPinRuntime, prePin: BlueprintPinRuntime, notRecover?: boolean): boolean;
        finish(context: IRunAble): void;
    }
    enum EBlockSource {
        Unknown = 0,
        Main = 1,
        Function = 2
    }
    class BluePrintComplexBlock extends BluePrintBlock {
        static EventId: number;
        private _asList;
        private _pendingClass;
        private _eventId;
        constructor(id: symbol | string);
        protected initEventBlockMap(map: Map<number, BlueprintEventNode>, eventMap: Map<string, BluePrintEventBlock>): void;
        optimize(): void;
        parse(bpjson: Array<IBPNode>, getCNodeByNode: (node: IBPNode) => IBPCNode, varMap: Record<string, IBPVariable>): void;
        private _onReParse;
        protected onEventParse(eventName: string): void;
        private _checkReady;
        append(node: BlueprintRuntimeBaseNode, item: IBPNode): void;
        finishChild(context: IRunAble, runtime: IBPRutime): void;
    }
    class BluePrintEventBlock extends BluePrintBlock {
        protected parentId: symbol | string;
        protected parent: BluePrintComplexBlock;
        haRef: boolean;
        static findParamPin(node: BlueprintRuntimeBaseNode, nodeMap: Map<any, BlueprintRuntimeBaseNode>, anonymousfunMap: Map<number, BlueprintEventNode>, excuteList: BlueprintRuntimeBaseNode[], bluePrintEventBlock: BluePrintEventBlock): void;
        init(event: BlueprintEventNode): void;
        private _checkRef;
        optimizeByBlockMap(parent: BluePrintComplexBlock): void;
        getRunID(): number;
        recoverRunID(id: number, runtimeDataMgr: IRuntimeDataManger): void;
        run(context: IRunAble, event: BlueprintEventNode, parms: any[], cb: Function, runId: number, execId: number): boolean;
        getDataMangerByID(context: IRunAble): IRuntimeDataManger;
        get bpId(): string;
        get blockSourceType(): EBlockSource;
        finish(context: IRunAble): void;
    }
    class BluePrintFunBlock extends BluePrintComplexBlock {
        mainBlock: BluePrintMainBlock;
        funStart: BlueprintCustomFunStart;
        isStatic: boolean;
        funBlock: BluePrintFunStartBlock;
        get bpId(): string;
        get blockSourceType(): EBlockSource;
        optimize(): void;
        protected onParse(bpjson: IBPNode[]): void;
        parse(bpjson: IBPNode[], getCNodeByNode: (node: IBPNode) => IBPCNode, varMap: Record<string, IBPVariable>): void;
        run(context: IRunAble, eventName: string, parms: any[], cb: Function, runId: number, execId: number, outExcutes: BlueprintPinRuntime[], runner: IBPRutime, oldRuntimeDataMgr: IRuntimeDataManger): boolean;
    }
    class BluePrintFunStartBlock extends BluePrintEventBlock {
        funEnds: BlueprintCustomFunReturn[];
        funStart: BlueprintCustomFunStart;
        init(event: BlueprintCustomFunStart): void;
        runFun(context: IRunAble, eventName: string, parms: any[], cb: Function, runId: number, execId: number, outExcutes: BlueprintPinRuntime[], runner: IBPRutime, oldRuntimeDataMgr: IRuntimeDataManger): boolean;
    }
    class BluePrintMainBlock extends BluePrintComplexBlock {
        autoAnonymousfuns: BlueprintEventNode[];
        autoRunNodes: BlueprintAutoRun[];
        eventBlockMap: Map<string, BluePrintEventBlock>;
        constructor(id: symbol);
        get bpName(): string;
        get blockSourceType(): EBlockSource;
        eventMap: Map<any, BlueprintEventNode>;
        cls: Function;
        optimize(): void;
        protected onEventParse(eventName: string): void;
        protected _onEventParse(...args: any[]): void;
        append(node: BlueprintRuntimeBaseNode, item: IBPNode): void;
        runAuto(context: IRunAble): void;
        run(context: IRunAble, event: BlueprintEventNode, parms: any[], cb: Function, runId: number, execId: number): boolean;
        finishChild(context: IRunAble, runtime: IBPRutime): void;
    }
    class BlueprintFactory {
        static readonly bpSymbol: unique symbol;
        static readonly contextSymbol: unique symbol;
        static readonly onChangeSymbol: unique symbol;
        static readonly autoRunSymbol: unique symbol;
        private static _funMap;
        private static _instance;
        private static _bpMap;
        private static _bpContextMap;
        static bpNewMap: Map<string, IBPCNode>;
        static BPExcuteCls: any;
        static BPRuntimeCls: any;
        /**
         * 根据节点类型创建相应的对象
         * @param type
         * @param cls
         */
        static regBPClass(type: BPType, cls: new () => BlueprintRuntimeBaseNode): void;
        static regFunction(fname: string, fun: Function, isMember?: boolean, cls?: any, target?: string): void;
        static getFunction(fname: string, target: string): [
            Function,
            boolean
        ];
        static regBPContextData(type: BPType, cls: new () => RuntimeNodeData): void;
        static getBPContextData(type: BPType): new () => RuntimeNodeData;
        /**
         * 生成类
         * @param name
         * @param cls
         * @returns
         */
        static createCls<T>(name: string, cls: T): T;
        /**
         * 解析数组
         * @param name
         * @param isPlaying
         * @param newClass
         * @param data
         * @param funs
         * @param varMap
         */
        static parseCls(name: string, saveData: IBPSaveData, newClass: any, data: IBPStageData, funs: IBPStageData[], varMap: Record<string, IBPVariable>, preload: string[]): void;
        static createClsNew<T>(name: string, saveData: IBPSaveData, cls: T, data: IBPStageData, funs: IBPStageData[], varMap: Record<string, IBPVariable>): T;
        static initClassHook(parent: string, cls: Function): void;
        static onPropertyChanged_EM(bp: any): void;
        static get instance(): BlueprintFactory;
        createNew(config: IBPCNode, item: IBPNode): BlueprintRuntimeBaseNode;
    }
    class BlueprintPinRuntime extends BlueprintPin {
        /**
         * 所属节点
        */
        owner: BlueprintRuntimeBaseNode;
        step(context: IRunAble, runtimeDataMgr: IRuntimeDataManger, runner: IBPRutime, runId: number, prePin: BlueprintPinRuntime): BlueprintPinRuntime | BlueprintPromise | number;
        excute(context: IRunAble, runtimeDataMgr: IRuntimeDataManger, runner: IBPRutime, runId: number): BlueprintPinRuntime;
        getValueCode(): any;
    }
    class BlueprintPromise implements IExcuteListInfo {
        nid: number;
        enableDebugPause: boolean;
        pin: BlueprintPinRuntime;
        prePin: BlueprintPinRuntime;
        static create(): BlueprintPromise;
        private _completed;
        private _callback;
        /**
        * 等待行为完成回调
        * @param callback 完成回调接口
        */
        wait(callback: (mis: BlueprintPromise) => void): void;
        hasCallBack(): boolean;
        complete(): void;
        recover(): void;
        clear(): void;
    }
    class BlueprintRuntime {
        isRunningInIDE: boolean;
        mainBlock: BluePrintMainBlock;
        funBlockMap: Map<string, BluePrintFunBlock>;
        varMap: Record<string, IBPVariable>;
        dataMap: Record<string, IBPVariable | IBPCNode>;
        constructor();
        run(context: IRunAble, event: BlueprintEventNode, parms: any[], cb: Function): void;
        /**
         * 执行自定义函数
         * @param context
         * @param funName
         * @param parms
         */
        runCustomFun(context: IRunAble, funId: string, parms: any[], cb: Function, runId: number, execId: number, outExcutes: BlueprintPinRuntime[], runner: IBPRutime, oldRuntimeDataMgr: IRuntimeDataManger): boolean;
        parse(mainBlockData: IBPStageData, getCNodeByNode: (node: IBPNode) => IBPCNode, varMap: Record<string, IBPVariable>, newCls: Function): void;
        parseFunction(funData: IBPStageData, getCNodeByNode: (node: IBPNode) => IBPCNode): void;
        toCode(context: IRunAble): void;
    }
    /**
     *
     */
    class BlueprintStaticFun {
        /**
         * @private
         * @param outExcutes
         * @param input
         * @returns
         */
        static switchFun(outExcutes: BlueprintPinRuntime[], input: any): BlueprintPinRuntime;
        /**
         * 打印
         * @param str
         */
        static print(str: string): void;
        static getTempVar(name: string, runtimeDataMgr: IRuntimeDataManger, runId: number): any;
        static setTempVar(value: any, name: string, runtimeDataMgr: IRuntimeDataManger, runId: number): void;
        /**
         * @private
         * @param target
         * @param name
         * @param context
         * @returns
         */
        static getVariable(target: IBluePrintSubclass, name: string, context: IRunAble): any;
        /**
        * @private
        * @param target
        * @param name
        * @param context
        * @returns
        */
        static getSelf(name: string, context: IRunAble): any;
        /**
         * @private
         * @param target
         * @param value
         * @param name
         * @param context
         */
        static setVariable(target: IBluePrintSubclass, value: any, name: string, context: IRunAble): any;
        /**
         * 等待
         * @param second
         * @returns
         */
        static waitTime(second: number): Promise<boolean>;
        /**
         * @private
         * @returns
         */
        static expression(): boolean;
        /**
         * @private
         * @param target
         * @param value
         * @param name
         * @param context
         */
        static typeInstanceof<T>(outExcutes: BlueprintPinRuntime[], target: any, type: new () => T): BlueprintPinRuntime;
        /**
         * @private
         * @param nextExec
         * @param outPutParmPins
         * @param parms
         * @param context
         * @param runner
         * @param runtimeDataMgr
         */
        private static runBranch;
        /**
         * @private
         * @param target
         * @param value
         * @param name
         * @param context
         */
        static forEach(inputExcute: BlueprintPinRuntime, inputExcutes: BlueprintPinRuntime[], outExcutes: BlueprintPinRuntime[], outPutParmPins: BlueprintPinRuntime[], context: IRunAble, runner: IBPRutime, runtimeDataMgr: IRuntimeDataManger, runId: number, array: any[]): BlueprintPinRuntime;
        /**
        * @private
        * @param target
        * @param value
        * @param name
        * @param context
        */
        static forEachWithBreak(inputExcute: BlueprintPinRuntime, inputExcutes: BlueprintPinRuntime[], outExcutes: BlueprintPinRuntime[], outPutParmPins: BlueprintPinRuntime[], context: IRunAble, runner: IBPRutime, runtimeDataMgr: IRuntimeDataManger, runId: number, array: any[]): BlueprintPinRuntime;
        /**
         * @private
         * @param target
         * @param value
         * @param name
         * @param context
         */
        static forLoop(inputExcute: BlueprintPinRuntime, inputExcutes: BlueprintPinRuntime[], outExcutes: BlueprintPinRuntime[], outPutParmPins: BlueprintPinRuntime[], context: IRunAble, runner: IBPRutime, runtimeDataMgr: IRuntimeDataManger, runId: number, firstIndex: number, lastIndex: number, step?: number): BlueprintPinRuntime;
        /**
        * @private
        * breakNode 1 代表只在执行中，2代表执行中断，0代表执行完毕
        */
        static forLoopWithBreak(inputExcute: BlueprintPinRuntime, inputExcutes: BlueprintPinRuntime[], outExcutes: BlueprintPinRuntime[], outPutParmPins: BlueprintPinRuntime[], context: IRunAble, runner: IBPRutime, runtimeDataMgr: IRuntimeDataManger, runId: number, firstIndex: number, lastIndex: number, step?: number): BlueprintPinRuntime;
        /**
         * 执行表达式
         * @param express
         * @param a
         * @param b
         * @param c
         * @returns
         */
        static runExpress(express: string, a: any, b: any, c: any): any;
    }
    interface IBPRutime {
        readonly name: string;
        readonly blockSourceType: EBlockSource;
        readonly bpId: string;
        getDataMangerByID(context: IRunAble): IRuntimeDataManger;
        getRunID(): number;
        runAnonymous(context: IRunAble, event: BlueprintEventNode, parms: any[], cb: Function, runId: number, execId: number, newRunId: number, oldRuntimeDataMgr: IRuntimeDataManger): boolean;
        runByContext(context: IRunAble, runtimeDataMgr: IRuntimeDataManger, node: IExcuteListInfo, enableDebugPause: boolean, cb: Function, runid: number, fromPin: BlueprintPinRuntime, prePin: BlueprintPinRuntime, notRecover?: boolean): boolean;
    }
    interface IRunAble {
        debuggerPause: boolean;
        readCache: boolean;
        pushBack(excuteNode: IExcuteListInfo, callback: any): void;
        readonly vars: {
            [key: string]: any;
        };
        beginExcute(runtimeNode: BlueprintRuntimeBaseNode, runner: IBPRutime, enableDebugPause: boolean, fromPin: BlueprintPinRuntime, parmsArray: any[], prePin: BlueprintPinRuntime): BlueprintPromise;
        endExcute(runtimeNode: BlueprintRuntimeBaseNode): void;
        parmFromOtherPin(current: BlueprintPinRuntime, runtimeDataMgr: IRuntimeDataManger, from: BlueprintPinRuntime, parmsArray: any[], runId: number): void;
        parmFromSelf(current: BlueprintPinRuntime, runtimeDataMgr: IRuntimeDataManger, parmsArray: any[], runId: number): void;
        parmFromOutPut(outPutParmPins: BlueprintPinRuntime[], runtimeDataMgr: IRuntimeDataManger, parmsArray: any[]): void;
        parmFromCustom(parmsArray: any[], parm: any, parmname: string): void;
        excuteFun(nativeFun: Function, returnResult: BlueprintPinRuntime, runtimeDataMgr: IRuntimeDataManger, caller: any, parmsArray: any[], runId: number): any;
        getCode(): string;
        getVar(name: string): any;
        setVar(name: string, value: any): void;
        initVar(name: string, value: any): void;
        reCall(index: number): void;
        getSelf(): any;
        initData(key: string | symbol, nodeMap: Map<number, BlueprintRuntimeBaseNode>, localVarMap: Record<string, IBPVariable>, parentId?: string | symbol): void;
        getDataMangerByID(id: symbol | string): IRuntimeDataManger;
        setCacheAble(node: BlueprintRuntimeBaseNode, runId: number, value: any): void;
        getCacheAble(node: BlueprintRuntimeBaseNode, runId: number): boolean;
        finish(runtime: IBPRutime): void;
    }
    class BluePrintAsNode extends BlueprintRuntimeBaseNode {
        optimize(): void;
    }
    class BlueprintAutoRun extends BlueprintRuntimeBaseNode {
        protected colloctParam(context: IRunAble, runtimeDataMgr: IRuntimeDataManger, inputPins: BlueprintPinRuntime[], runner: IBPRutime, runId: number, prePin: BlueprintPinRuntime): any[];
    }
    class BluePrintBlockNode extends BlueprintComplexNode {
        deal: (inputExcute: BlueprintPinRuntime, inputExcutes: BlueprintPinRuntime[], outExcutes: BlueprintPinRuntime[], outPutParmPins: BlueprintPinRuntime[], context: IRunAble, runner: IBPRutime, runtimeDataMgr: IRuntimeDataManger, runId: number, ...args: any) => BlueprintPinRuntime;
        next(context: IRunAble, runtimeDataMgr: IRuntimeDataManger, parmsArray: any[], runner: IBPRutime, enableDebugPause: boolean, runId: number, fromPin: BlueprintPinRuntime): BlueprintPinRuntime;
        setFunction(fun: Function): void;
    }
    class BlueprintComplexNode extends BlueprintRuntimeBaseNode {
        /**
         * 输入引脚
         */
        inExcutes: BlueprintPinRuntime[];
        constructor();
        next(context: IRunAble, runtimeDataMgr: IRuntimeDataManger, parmsArray: any[], runner: IBPRutime, enableDebugPause: boolean, runId: number, fromPin: BlueprintPinRuntime): BlueprintPinRuntime;
        find: (outExcutes: BlueprintPinRuntime[], ...args: any) => BlueprintPinRuntime;
        addPin(pin: BlueprintPinRuntime): void;
        setFunction(fun: Function): void;
    }
    class BlueprintCustomFunNode extends BlueprintFunNode {
        /**
         * 输入引脚
         */
        inExcutes: BlueprintPinRuntime[];
        functionID: string;
        staticContext: IRunAble;
        bpruntime: BlueprintRuntime;
        private _isCheck;
        constructor();
        colloctParam(context: IRunAble, runtimeDataMgr: IRuntimeDataManger, inputPins: BlueprintPinRuntime[], runner: IBPRutime, runId: number, prePin: BlueprintPinRuntime): any[];
        private _checkFun;
        protected onParseLinkData(node: IBPNode, manger: INodeManger<BlueprintFunNode>): void;
        protected excuteFun(context: IRunAble, runtimeDataMgr: IRuntimeDataManger, runner: IBPRutime, caller: IBluePrintSubclass, parmsArray: any[], runId: number, fromPin: BlueprintPinRuntime): Promise<any>;
        protected _excuteFun(context: IRunAble, cb: any, parmsArray: any[], runner: IBPRutime): void;
        addPin(pin: BlueprintPinRuntime): void;
        optimize(): void;
        setFunction(fun: Function, isMember: boolean): void;
        customFun(parms: any[]): void;
    }
    class BlueprintCustomFunReturn extends BlueprintRuntimeBaseNode {
        /**
         * 输入引脚
         */
        inExcutes: BlueprintPinRuntime[];
        constructor();
        step(context: IRunAble, runtimeDataMgr: IRuntimeDataManger, fromExcute: boolean, runner: IBPRutime, enableDebugPause: boolean, runId: number, fromPin: BlueprintPinRuntime, prePin: BlueprintPinRuntime): BlueprintPinRuntime | BlueprintPromise | number;
        initData(runtimeDataMgr: IRuntimeDataManger, curRunId: number, runId: number, parms: any[], offset: number, outExcutes: BlueprintPinRuntime[], runner: IBPRutime, oldRuntimeDataMgr: IRuntimeDataManger): void;
        addPin(pin: BlueprintPinRuntime): void;
    }
    class BlueprintCustomFunReturnContext extends RuntimeNodeData {
        returnMap: Map<number, IOutParm[]>;
        runIdMap: Map<number, number>;
        outExcutesMap: Map<number, BlueprintPinRuntime[]>;
        runnerMap: Map<number, [
            IBPRutime,
            IRuntimeDataManger
        ]>;
        constructor();
        initData(curRunId: number, runId: number, parms: any[], offset: number, outExcutes: BlueprintPinRuntime[], runner: IBPRutime, runtimeDataMgr: IRuntimeDataManger): void;
        runExcute(runId: number, index: number, context: IRunAble): void;
        returnResult(runId: number, curRunId: number): void;
    }
    class BlueprintCustomFunStart extends BlueprintEventNode {
        protected onParseLinkData(node: IBPNode, manger: INodeManger<BlueprintEventNode>): void;
    }
    class BlueprintEventNode extends BlueprintRuntimeBaseNode {
        /**
         * 输出引脚
         */
        outExcute: BlueprintPinRuntime;
        eventName: string;
        autoReg: boolean;
        isAnonymous: boolean;
        constructor();
        protected onParseLinkData(node: IBPNode, manger: INodeManger<BlueprintEventNode>): void;
        setFunction(fun: Function, isMember: boolean): void;
        emptyExcute(context: IRunAble, runtimeDataMgr: IRuntimeDataManger, fromExcute: boolean, runner: IBPRutime, enableDebugPause: boolean, runId: number, fromPin: BlueprintPinRuntime): BlueprintPinRuntime | BlueprintPromise;
        step(context: IRunAble, runtimeDataMgr: IRuntimeDataManger, fromExcute: boolean, runner: IBPRutime, enableDebugPause: boolean, runId: number, fromPin: BlueprintPinRuntime, prePin: BlueprintPinRuntime): BlueprintPinRuntime | BlueprintPromise;
        addPin(pin: BlueprintPinRuntime): void;
        optimize(): void;
        initData(runtimeDataMgr: IRuntimeDataManger, parms: any[], curRunId: number): void;
    }
    class BlueprintFunNode extends BlueprintRuntimeBaseNode {
        /**
         * 输入引脚
         */
        inExcute: BlueprintPinRuntime;
        /**
         * 输出引脚
         */
        outExcute: BlueprintPinRuntime;
        eventName: string;
        constructor();
        protected onParseLinkData(node: IBPNode, manger: INodeManger<BlueprintRuntimeBaseNode>): void;
        private excuteHookFun;
        protected excuteFun(context: IRunAble, runtimeDataMgr: IRuntimeDataManger, runner: IBPRutime, caller: any, parmsArray: any[], runId: number, fromPin: BlueprintPinRuntime): any;
        next(): BlueprintPinRuntime;
        addPin(pin: BlueprintPinRuntime): void;
        optimize(): void;
    }
    class BlueprintGetTempVarNode extends BlueprintRuntimeBaseNode {
        protected _varKey: string;
        constructor();
        protected onParseLinkData(node: IBPNode, manger: INodeManger<BlueprintRuntimeBaseNode>): void;
        step(context: IRunAble, runtimeDataMgr: IRuntimeDataManger, fromExcute: boolean, runner: IBPRutime, enableDebugPause: boolean, runId: number, fromPin: BlueprintPinRuntime, prePin: BlueprintPinRuntime): BlueprintPinRuntime | BlueprintPromise;
    }
    class BlueprintGetVarNode extends BlueprintRuntimeBaseNode {
        protected _varKey: string;
        constructor();
        protected onParseLinkData(node: IBPNode, manger: INodeManger<BlueprintRuntimeBaseNode>): void;
        step(context: IRunAble, runtimeDataMgr: IRuntimeDataManger, fromExcute: boolean, runner: IBPRutime, enableDebugPause: boolean, runId: number, fromPin: BlueprintPinRuntime, prePin: BlueprintPinRuntime): BlueprintPinRuntime | BlueprintPromise;
    }
    class BlueprintNewTargetNode extends BlueprintRuntimeBaseNode {
        cls: ClassDecorator;
        parse(def: IBPCNode): void;
        step(context: IRunAble, runtimeDataMgr: IRuntimeDataManger, fromExcute: boolean, runner: IBPRutime, enableDebugPause: boolean, runId: number, fromPin: BlueprintPinRuntime, prePin: BlueprintPinRuntime): BlueprintPinRuntime | BlueprintPromise;
    }
    class BlueprintRuntimeBaseNode extends BlueprintNode<BlueprintPinRuntime> implements IExcuteListInfo {
        private _refNumber;
        staticNext: BlueprintPinRuntime;
        private static _EMPTY;
        nativeFun: Function;
        isMember: boolean;
        funcode: string;
        canCache: boolean;
        /**
         * 输入参数列表
         */
        inPutParmPins: BlueprintPinRuntime[];
        /**
         * 输出参数列表
         */
        outPutParmPins: BlueprintPinRuntime[];
        returnValue: BlueprintPinRuntime;
        /**
         * 输出引脚
        */
        outExcutes: BlueprintPinRuntime[];
        tryExcute: (context: IRunAble, runtimeDataMgr: IRuntimeDataManger, fromExcute: boolean, runner: IBPRutime, enableDebugPause: boolean, runId: number, fromPin: BlueprintPinRuntime, prePin: BlueprintPinRuntime) => BlueprintPinRuntime | BlueprintPromise | number;
        hasDebugger: boolean;
        constructor();
        addRef(): void;
        getRef(): number;
        emptyExcute(context: IRunAble, runtimeDataMgr: IRuntimeDataManger, fromExcute: boolean, runner: IBPRutime, enableDebugPause: boolean, runId: number, fromPin: BlueprintPinRuntime): BlueprintPinRuntime | BlueprintPromise;
        createPin(def: TBPPinDef): BlueprintPinRuntime;
        protected excuteFun(context: IRunAble, runtimeDataMgr: IRuntimeDataManger, runner: IBPRutime, caller: any, parmsArray: any[], runId: number, fromPin: BlueprintPinRuntime): any;
        protected colloctParam(context: IRunAble, runtimeDataMgr: IRuntimeDataManger, inputPins: BlueprintPinRuntime[], runner: IBPRutime, runId: number, prePin: BlueprintPinRuntime): any[];
        private _checkRun;
        step(context: IRunAble, runtimeDataMgr: IRuntimeDataManger, fromExcute: boolean, runner: IBPRutime, enableDebugPause: boolean, runId: number, fromPin: BlueprintPinRuntime, prePin: BlueprintPinRuntime): BlueprintPinRuntime | BlueprintPromise | number;
        next(context: IRunAble, runtimeDataMgr: IRuntimeDataManger, parmsArray: any[], runner: IBPRutime, enableDebugPause: boolean, runId: number, fromPin: BlueprintPinRuntime): BlueprintPinRuntime;
        addPin(pin: BlueprintPinRuntime): void;
        optimize(): void;
        setFunction(fun: Function, isMember: boolean): void;
        protected addNextPIn(): void;
    }
    class BlueprintSequenceNode extends BlueprintComplexNode {
        next(context: IRunAble, runtimeDataMgr: IRuntimeDataManger, parmsArray: any[], runner: IBPRutime, enableDebugPause: boolean, runId: number): BlueprintPinRuntime;
        setFunction(fun: Function): void;
    }
    class BlueprintSetTempVarNode extends BlueprintFunNode {
        protected _varKey: string;
        constructor();
        protected onParseLinkData(node: IBPNode, manger: INodeManger<BlueprintRuntimeBaseNode>): void;
        step(context: IRunAble, runtimeDataMgr: IRuntimeDataManger, fromExcute: boolean, runner: IBPRutime, enableDebugPause: boolean, runId: number, fromPin: BlueprintPinRuntime, prePin: BlueprintPinRuntime): BlueprintPinRuntime | BlueprintPromise;
    }
    class BlueprintSetVarNode extends BlueprintFunNode {
        protected _varKey: string;
        constructor();
        protected onParseLinkData(node: IBPNode, manger: INodeManger<BlueprintRuntimeBaseNode>): void;
        step(context: IRunAble, runtimeDataMgr: IRuntimeDataManger, fromExcute: boolean, runner: IBPRutime, enableDebugPause: boolean, runId: number, fromPin: BlueprintPinRuntime, prePin: BlueprintPinRuntime): BlueprintPinRuntime | BlueprintPromise;
    }
    class TestBluePrint {
        static BPMap: Map<string, TBPNodeDef>;
        regBPNode(): void;
        testBPNode(): void;
        constructor();
    }
    class test {
        constructor();
    }
}
