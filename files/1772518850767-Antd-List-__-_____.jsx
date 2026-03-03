const antd = require("antd-mobile");
const types = {
  isInvisibleWidget: false,
  type: "SENIOR_LIST_BY_SUN",
  icon: "https://gw.alipayobjects.com/zos/bmw-prod/b874caa9-4458-412a-9ac6-a61486180a62.svg",
  title: "高级列表框",
  version: "1.0.0",
  isGlobalWidget: false,
  properties: [
    {
      key: "__width",
      label: "宽度",
      valueType: "number",
      defaultValue: 200,
      blockOptions: {
        generateBlock: false,
      },
    },
    {
      key: "__height",
      label: "高度",
      valueType: "number",
      defaultValue: 150,
      blockOptions: {
        generateBlock: false,
      },
    },
    {
      key: "__size",
      label: "",
      valueType: "number",
      defaultValue: 0,
      readonly: true,
      blockOptions: {
        setter: {
          keys: ["__height", "__width"],
        },
        getter: {
          keys: ["__height", "__width"],
        },
      },
    },
  ],
  methods: [],
  events: [],
};

types.docs = {
  url: "https://pvllr49v9s.feishu.cn/docx/UK5UdrVn9owtZhxybidcDouWnAg",
};
types.platforms = ["android", "ios", "web"];
types["properties"].push({
  key: "data",
  label: "数据",
  valueType: ["string", "number", "boolean", "array", "object"],
  defaultValue: "",
  blockOptions: {
    color: "#cc66cc",
    icon: "无",
    generateBlock: true,
    inputsInline: true,
    space: 16,
  },
});
class Widget extends VisibleWidget {
  concat = (t) => {
    this.setProps({ data: this.data.concat(t) });
  };
  push = (t) => {
    this.data.push(t), this.setProps({ data: this.data });
  };
  splice = (t, a) => {
    this.data.splice(t, 0, a), this.setProps({ data: this.data });
  };
  pop = () => {
    this.data.pop(), this.setProps({ data: this.data });
  };
  remove = (t) => {
    this.data.splice(t - 1, 1), this.setProps({ data: this.data });
  };
  replace = (t, a) => {
    this.data.splice(t - 1, 1, a), this.setProps({ data: this.data });
  };
  replaceKey = (t, a, s) => {
    (this.data[t - 1][a] = s), this.setProps({ data: this.data });
  };
  empty = () => {
    this.setProps({ data: [] });
  };
  inquire = (t) => this.data[t - 1];
  inquireKey = (t, a) => this.data[t - 1][a];
  length = () => this.data.length;
  constructor(p) {
    
    super(p);
    Object.assign(this, p);
  }
  render() {
    if (typeof this.data !== "object")
      try {
        this.data = JSON.parse(this.data);
      } catch (e) {
        this.data = [];
      }
    return (
      <>
        {this.data.map((item, index) => (
          <antd.List header={item.header} mode={item.mode}>
            <antd.SwipeAction
              key={item.key}
              leftActions={item.leftActions}
              rightActions={item.rightActions}
              closeOnAction={item.closeOnAction}
              closeOnTouchOutside={item.closeOnTouchOutside}
              onAction={(Action) => {
                this.emit("slidingoperation", index + 1, Action);
              }}
            >
              <div
                dangerouslySetInnerHTML={{
                  __html: `<style>
            #${this.__widgetId} {
            overflow:auto
            scroll-behavior: smooth
            }
            </style>`,
                }}
              />

              <antd.List.Item
                extra={
                  item.assembly === "switch" ? (
                    <antd.Switch
                      defaultChecked={item.defaultChecked}
                      disabled={item.disabled}
                      loading={item.loading}
                      checkedText={item.checkedText}
                      uncheckedText={item.uncheckedText}
                      onChange={(v) => {
                        this.emit("switchclick", v, index + 1);
                      }}
                    />
                  ) : item.assembly === "input" ? (
                    <antd.Input
                      defaultValue={item.defaultValue}
                      placeholder={item.placeholder}
                      value={item.value}
                      clearable={item.clearable}
                      disabled={item.disabled}
                      onlyShowClearWhenFocus={item.onlyShowClearWhenFocus}
                      placeholder={item.placeholder}
                      readOnly={item.readOnly}
                      onChange={(val) => {
                        this.data[index].value = val;
                        this.setProps({ data: this.data });
                        this.emit("inputchange", index + 1, val);
                      }}
                      onEnterPress={(e) => {
                        this.emit("inputcomplete", index + 1, e.target.value);
                      }}
                    />
                  ) : (
                    item.extra
                  )
                }
                description={item.description}
                title={item.title}
                prefix={
                  item.prefix
                    ? React.createElement(
                        "img",
                        {
                          src: item.prefix,
                          width: "44px",
                          height: "44px",
                          alt: "",
                        },
                        null
                      )
                    : ""
                }
                arrow={
                  item.righticon === 1
                    ? React.createElement(
                        "img",
                        {
                          src: item.arrow,
                          width: "44px",
                          height: "44px",
                          alt: "",
                        },
                        null
                      )
                    : item.arrow
                }
                onClick={() => {
                  this.emit("onclick", index + 1);
                }}
              >
                {item.text}
              </antd.List.Item>
            </antd.SwipeAction>
          </antd.List>
        ))}
        <div
          dangerouslySetInnerHTML={{
            __html: `<style>
            #${this.__widgetId} {
            overflow:auto
            }
            </style>`,
          }}
        />
      </>
    );
  }
}

types["events"].push({
  key: "onclick",
  label: "被点击时",
  params: [
    {
      key: "listnumber",
      label: "行",
      valueType: "number",
    },
  ],
  blockOptions: {
    color: "#3366ff",
    icon: "https://creation.codemao.cn/coconut/web/1.21.0/static/media/tab.906ad81b.svg",
    generateBlock: true,
    inputsInline: true,
    space: 16,
  },
});
types["events"].push({
  key: "switchclick",
  label: "开关被点击时",
  params: [
    {
      key: "switchdata",
      label: "状态",
      valueType: "boolean",
    },
    {
      key: "listdata",
      label: "行",
      valueType: "number",
    },
  ],
  blockOptions: {
    color: "#3366ff",
    icon: "https://creation.codemao.cn/coconut/web/1.21.0/static/media/tab.906ad81b.svg",
    generateBlock: true,
    inputsInline: true,
    space: 16,
  },
});
types["events"].push({
  key: "inputchange",
  label: "输入框文本变动",
  params: [
    {
      key: "inputchangenumber",
      label: "行",
      valueType: "number",
    },
    {
      key: "inputchangedata",
      label: "内容",
      valueType: "string",
    },
  ],
  blockOptions: {
    color: "#3366ff",
    icon: "https://creation.codemao.cn/coconut/web/1.21.0/static/media/tab.906ad81b.svg",
    generateBlock: true,
    inputsInline: true,
    space: 16,
  },
});
types["events"].push({
  key: "inputcomplete",
  label: "输入框完成输入",
  params: [
    {
      key: "inputcompletenumber",
      label: "行数",
      valueType: "number",
    },
    {
      key: "inputcompletedata",
      label: "内容",
      valueType: "string",
    },
  ],
  blockOptions: {
    color: "#3366ff",
    icon: "https://creation.codemao.cn/coconut/web/1.21.0/static/media/tab.906ad81b.svg",
    generateBlock: true,
    inputsInline: true,
    space: 16,
  },
});
types["events"].push({
  key: "slidingoperation",
  label: "滑动操作按钮被点击",
  params: [
    {
      key: "slidingoperationnumber",
      label: "行数",
      valueType: "number",
    },
    {
      key: "slidingoperationdata",
      label: "key",
      valueType: "string",
    },
  ],
  blockOptions: {
    color: "#3366ff",
    icon: "https://creation.codemao.cn/coconut/web/1.21.0/static/media/tab.906ad81b.svg",
    generateBlock: true,
    inputsInline: true,
    space: 16,
  },
});
types.methods.push(
  ...[
    {
      key: "concat",
      label: "添加",
      params: [
        {
          key: "data",
          label: "列表",
          valueType: [
            "string",
            "number",
            "boolean",
            "array",
            "color",
            "object",
          ],
          defaultValue: "",
        },
      ],
      blockOptions: { callMethodLabel: !1, line: "写入" },
    },
    {
      key: "push",
      label: "添加",
      params: [
        {
          key: "data",
          label: "单行",
          valueType: [
            "string",
            "number",
            "boolean",
            "array",
            "color",
            "object",
          ],
          defaultValue: "",
        },
      ],
      blockOptions: { callMethodLabel: !1 },
    },
    {
      key: "splice",
      label: "插入",
      params: [
        {
          key: "start",
          label: "第",
          labelAfter: "行后",
          valueType: "number",
          defaultValue: 0,
        },
        {
          key: "data",
          label: "",
          valueType: [
            "string",
            "number",
            "boolean",
            "array",
            "color",
            "object",
          ],
          defaultValue: "",
        },
      ],
      blockOptions: { callMethodLabel: !1 },
    },
    {
      key: "pop",
      label: "删除末尾行",
      params: [],
      blockOptions: { callMethodLabel: !1 },
    },
    {
      key: "remove",
      label: "删除",
      params: [
        {
          key: "start",
          label: "第",
          labelAfter: "行",
          valueType: "number",
          defaultValue: 0,
        },
      ],
      blockOptions: { callMethodLabel: !1 },
    },
    {
      key: "replace",
      label: "替换",
      params: [
        {
          key: "start",
          label: "第",
          labelAfter: "行为",
          valueType: "number",
          defaultValue: 0,
        },
        {
          key: "data",
          label: "",
          valueType: [
            "string",
            "number",
            "boolean",
            "array",
            "color",
            "object",
          ],
          defaultValue: "",
        },
      ],
      blockOptions: { callMethodLabel: !1 },
    },
    {
      key: "replaceKey",
      label: "替换",
      params: [
        {
          key: "start",
          label: "第",
          labelAfter: "行",
          valueType: "number",
          defaultValue: 0,
        },
        {
          key: "key",
          label: "键",
          labelAfter: "为",
          valueType: [
            "string",
            "number",
            "boolean",
            "array",
            "color",
            "object",
          ],
          defaultValue: "",
        },
        {
          key: "value",
          label: "",
          valueType: [
            "string",
            "number",
            "boolean",
            "array",
            "color",
            "object",
          ],
          defaultValue: "",
        },
      ],
      blockOptions: { callMethodLabel: !1 },
    },
    {
      key: "empty",
      label: "清空",
      params: [],
      blockOptions: { callMethodLabel: !1 },
    },
    {
      key: "inquire",
      params: [
        {
          key: "start",
          label: "第",
          labelAfter: "行的值",
          valueType: "number",
          defaultValue: 0,
        },
      ],
      valueType: ["string", "number", "boolean", "array", "color", "object"],
      blockOptions: { callMethodLabel: !1, line: "读取" },
    },
    {
      key: "inquireKey",
      params: [
        {
          key: "start",
          label: "第",
          labelAfter: "行",
          valueType: "number",
          defaultValue: 0,
        },
        {
          key: "key",
          label: "键",
          labelAfter: "的值",
          valueType: [
            "string",
            "number",
            "boolean",
            "array",
            "color",
            "object",
          ],
          defaultValue: "",
        },
      ],
      valueType: ["string", "number", "boolean", "array", "color", "object"],
      blockOptions: { callMethodLabel: !1 },
    },
    {
      key: "length",
      label: "行数",
      params: [],
      valueType: "number",
      blockOptions: { callMethodLabel: !1 },
    },
  ]
);
exports.types = types;
exports.widget = Widget;
