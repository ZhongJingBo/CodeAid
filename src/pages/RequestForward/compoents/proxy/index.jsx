import React, { useState, useEffect } from "react";
import { Button, Modal, Form, Input, Switch, message, Table } from "antd";
import dayjs from "dayjs";
import "./index.less";
import RequestForwardService from "@/services/RequestForwardService";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";
import { trimObjectValues } from "@/utils/environment";
import { FORWARD_RULE_KEY } from "../../../../constants";
import Editor from "../editor";
import {
  formatJSONString,
  stripJSONComments,
  cleanJSON,
  validateAndTransformRules,
} from "@/utils";
const Proxy = (props) => {
  const { group, type, rule, updateData, groupEnabled, jsonc, editorUpdata, loadData } =
    props;
  const [forwardRules, setForwardRules] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingRule, setEditingRule] = useState(null);
  const [inputData, setInputData] = useState({});
  const [showEditor, setShowEditor] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    loadForwardRules();
  }, []);

  // 切换编辑态
  const onDoubleClick = ({ record, key }) => {
    setInputData({ [record.id]: true, value: record[key], key: key });
  };

  //获取代理规则
  const loadForwardRules = async () => {
    setForwardRules(rule);
  };

  // 保存规则到 storage
  const saveRulesToStorage = async (rules) => {
    const result = await chrome.storage.local.get(FORWARD_RULE_KEY);
    const { [FORWARD_RULE_KEY]: forwardRules } = result;
    const rulesObject = {
      [group]: {
        key: group,
        group: group,
        rule: rules,
        groupEnabled: forwardRules?.[group]?.groupEnabled,
      },
    };

    try {
      // 更新规则和store数据
      await updateData(rulesObject);

      // 更新UI状态
      setForwardRules(rules);
    } catch (error) {
      console.error("Failed to save rules:", error);
    }
  };

  // 处理编辑规则保存
  const handleUpdate = async () => {
    try {
      const newRules = JSON.parse(JSON.stringify(forwardRules));
      if (editingRule) {
        // 编辑现有规则
        const index = newRules.findIndex((r) => r.id === editingRule.id);
        newRules[index] = {
          ...editingRule,
        };
      } else {
        // 添加新规则
        newRules.push({
          ...values,
          id: Date.now(),
          enabled: true,
        });
      }
      setForwardRules(newRules);
      await saveRulesToStorage(newRules);
      message.success(`${editingRule ? "更新" : "添加"}规则成功`);
      setInputData({});
    } catch (error) {
      console.error("Save rule error:", error);
      message.error("保存失败，请检查表单");
      setInputData({});
    }
  };

  // 处理规则删除
  const handleDelete = async (id) => {
    Modal.confirm({
      title: "确认删除",
      content: "确定要删除这条规则吗？",
      onOk: async () => {
        const newRules = forwardRules.filter((rule) => rule.id !== id);
        console.log(newRules, "newRules");
        message.success("删除成功");
      },
    });
  };

  // 处理规则编辑
  const handleEdit = ({ record, key, value }) => {
    setInputData((prev) => ({
      ...prev,
      value: value,
      [record.id]: true,
    }));
    setEditingRule({
      ...record,
      [key]: value,
    });
  };

  const editorChange = (value) => {
    const cleanValue = formatJSONString(stripJSONComments(value));
    const jsonData = JSON.parse(cleanJSON(cleanValue));
    const transformedRules = validateAndTransformRules(jsonData.proxy);

    // 可以直接保存的数据 transformedRules
    editorUpdata(transformedRules, value, group);
  };

  const columns = [
    {
      title: "启用",
      dataIndex: "enabled",
      width: 80,
      render: (enabled, record) => (
        <Switch
          checked={enabled}
          onChange={(checked) => handleToggleRule(record.id, checked)}
        />
      ),
    },
    {
      title: "匹配规则",
      dataIndex: "pattern",
      ellipsis: true,
      render: (_, record) => {
        return renderEditableCell(record, "pattern", "输入匹配规则");
      },
    },
    {
      title: "目标地址",
      dataIndex: "target",
      ellipsis: true,
      render: (_, record) => {
        return renderEditableCell(record, "target", "输入目标地址");
      },
    },
  ];

  const renderEditableCell = (record, key, placeholder) => {
    return (
      <div>
        {inputData[record.id] && key === inputData.key ? (
          <Input
            placeholder={placeholder}
            onChange={(e) => {
              handleEdit({ record, key, value: e.target.value });
            }}
            onPressEnter={(e) => {
              if (e.key === "Enter") {
                handleUpdate();
              }
            }}
            onBlur={() => {
              handleUpdate();
            }}
            value={inputData.value || record[key]}
          />
        ) : (
          <div
            onDoubleClick={() => {
              onDoubleClick({
                record,
                key,
              });
            }}
          >
            {record[key]}
          </div>
        )}
      </div>
    );
  };

  // 处理规则启用/禁用
  const handleToggleRule = async (id, enabled) => {
    const newRules = forwardRules.map((rule) =>
      rule.id === id ? { ...rule, enabled } : rule
    );
    await saveRulesToStorage(newRules);
    message.success(`${enabled ? "启用" : "禁用"}成功`);
  };

  // 处理新建规则保存
  const handleSave = async () => {
    try {
      // 验证表单
      const values = await form.validateFields();
      const newRules = [...forwardRules];

      const trimmedData = trimObjectValues(values);
      // 添加新规则
      newRules.push({
        ...trimmedData,
        id: newRules.length || 0,
        enabled: true,
      });

      // 保存规则
      await saveRulesToStorage(newRules);
      setForwardRules(newRules);

      // 关闭弹窗并重置状态
      setModalVisible(false);
      setEditingRule(null);
      form.resetFields();

      message.success(`${editingRule ? "更新" : "添加"}规则成功`);
    } catch (error) {
      console.error("Save rule error:", error);
      message.error("保存失败，请检查表单");
    }
  };

  const handleSwitch = async () => {
    // 切换视图
    setShowEditor(!showEditor);
    // 重新加载数据
    if(showEditor){
      await loadData();
    }
  
  };

  return (
    <div className="request-forward-container">
      <div className="header">
        {!showEditor ? (
          <Button
            icon={<PlusOutlined />}
            onClick={() => {
              setEditingRule(null);
              form.resetFields();
              setModalVisible(true);
            }}
          >
            添加规则
          </Button>
        ) : null}

        <Button type="primary" onClick={handleSwitch}>
          切换
        </Button>
      </div>

      {showEditor ? (
        <Editor jsonc={jsonc} onChange={editorChange} />
      ) : (
        <Table
          columns={columns}
          dataSource={forwardRules}
          rowKey="id"
          pagination={false}
        />
      )}

      <Modal
        title={editingRule ? "编辑转发规则" : "添加转发规则"}
        open={modalVisible}
        onOk={handleSave}
        onCancel={() => {
          setModalVisible(false);
          form.resetFields();
          setEditingRule(null);
        }}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="pattern"
            label="匹配规则"
            rules={[{ required: true, message: "请输入匹配规则" }]}
            extra="支持正则表达式，例如: ^https://api\\.example\\.com/.*"
          >
            <Input placeholder="请输入URL匹配规则" />
          </Form.Item>

          <Form.Item
            name="target"
            label="目标地址"
            rules={[{ required: true, message: "请输入目标地址" }]}
            extra="支持替换组，例如: https://test-api.example.com/$1"
          >
            <Input placeholder="请输入目标地址" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Proxy;
