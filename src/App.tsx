import { useEffect, useMemo, useState } from "react";
import "./App.css";
import {
  addTask,
  deleteTask,
  getTasks,
  updateTaskStatus,
} from "./api/task/task.api";
import type { NewTask, Task, UpdateTaskStatus } from "./api/task/task.dto";
import { ToastError, ToastSuccess } from "./components/Toast/CustomToast";
import type { CollapseProps } from "antd";
import {
  Button,
  Collapse,
  Flex,
  Modal,
  Typography,
  Form,
  Input,
  Popconfirm,
} from "antd";
import { QuestionCircleOutlined } from "@ant-design/icons";

// Box style for the task items
const boxStyle: React.CSSProperties = {
  marginTop: 20,
  width: "100%",
  maxWidth: 600,
};

interface AddTaskFormValues {
  title: string;
  description: string;
}

function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const collapseItems: CollapseProps["items"] = useMemo(() => {
    return tasks?.map((task) => ({
      key: task.id,
      collapsible: "icon",
      label: (
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <span>{task?.title}</span>
          <div style={{ display: "flex", gap: "8px" }}>
            <Button
              size="small"
              type={task.completed ? "default" : "primary"}
              onClick={(e) => {
                e.stopPropagation(); // prevent collapse toggle
                handleUpdateTaskStatus(task.id, !task.completed);
              }}
            >
              {task?.completed ? "Undo" : "Complete"}
            </Button>
            <Popconfirm
              title="Delete the task"
              description="Are you sure to delete this task?"
              icon={<QuestionCircleOutlined style={{ color: "red" }} />}
              onConfirm={() => handleDeleteTask(task.id)}
              okText="Yes"
              cancelText="No"
              okType="danger"
              okButtonProps={{ type: "primary" }}
            >
              <Button size="small" danger>
                Delete
              </Button>
            </Popconfirm>
          </div>
        </div>
      ),
      children: (
        <div>
          <p>{task?.description}</p>
        </div>
      ),
    }));
  }, [tasks]);

  const [addTaskForm] = Form.useForm<AddTaskFormValues>();
  const [open, setOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);

  const loadTasks = async () => {
    try {
      const res = await getTasks();
      setTasks(res?.data || []);
    } catch (error: any) {
      ToastError(error?.response?.data?.message || "Failed to load tasks.");
    }
  };

  // Hooks
  useEffect(() => {
    loadTasks();
  }, []);

  // Handlers
  // Modal handler
  const showModal = () => {
    setOpen(true);
  };

  const handleCancel = () => {
    setOpen(false);
  };

  // Modal add task submit
  const handleModalSubmit = async () => {
    try {
      const values: AddTaskFormValues = await addTaskForm.validateFields();
      if (!values) return;

      setConfirmLoading(true);
      const reqData: NewTask = {
        title: values.title,
        description: values.description,
      };
      const res = await addTask(reqData);
      setTasks((prevTasks) => [
        {
          id: res?.data?.id,
          title: values.title,
          description: values.description,
          completed: false,
        },
        ...prevTasks,
      ]);

      setOpen(false);
      addTaskForm.resetFields();
      ToastSuccess("New task added successfully!");
    } catch (error: any) {
      ToastError(error?.response?.data?.message || "Failed to add new task.");
    } finally {
      setConfirmLoading(false);
    }
  };

  const handleUpdateTaskStatus = async (id: number, completed: boolean) => {
    try {
      const requestBody: UpdateTaskStatus = {
        completed,
      };
      await updateTaskStatus(id, requestBody);
      setTasks((prevTasks) =>
        prevTasks?.map((task) =>
          task.id === id ? { ...task, completed } : task
        )
      );
      ToastSuccess("Task status updated successfully!");
    } catch (error: any) {
      ToastError(
        error?.response?.data?.message || "Failed to update task status."
      );
    }
  };

  const handleDeleteTask = async (id: number) => {
    try {
      await deleteTask(id);
      setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));
      ToastSuccess("Task deleted successfully!");
    } catch (error: any) {
      ToastError(error?.response?.data?.message || "Failed to delete task.");
    }
  };

  return (
    <Flex justify={"center"}>
      <Flex style={boxStyle} vertical={true}>
        <Flex justify={"space-between"} align="center">
          <Typography.Title level={1}>To-do List</Typography.Title>
          <Button type="primary" onClick={showModal}>
            Add Task
          </Button>
        </Flex>

        {/* Modal for adding a new task */}
        <Modal
          title="Add Task"
          open={open}
          onOk={handleModalSubmit}
          confirmLoading={confirmLoading}
          onCancel={handleCancel}
          okText="Add"
        >
          <Form form={addTaskForm} layout="vertical">
            <Form.Item
              label="Title"
              name="title"
              rules={[{ required: true, message: "Please enter task title" }]}
            >
              <Input placeholder="Enter task title" />
            </Form.Item>
            <Form.Item
              label="Description"
              name="description"
              rules={[
                { required: true, message: "Please enter task description" },
              ]}
            >
              <Input.TextArea placeholder="Enter task description" />
            </Form.Item>
          </Form>
        </Modal>
        {tasks?.length > 0 ? (
          <Collapse items={collapseItems} />
        ) : (
          <Typography.Text type="secondary">No tasks available</Typography.Text>
        )}
      </Flex>
    </Flex>
  );
}

export default App;
