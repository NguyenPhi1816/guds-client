"use client";

import {
  Button,
  DatePicker,
  Divider,
  Flex,
  Form,
  GetProp,
  Input,
  message,
  Radio,
  Typography,
  Upload,
  UploadProps,
} from "antd";
import FormAddress from "@/components/form/address/FormAddress";
import { useEffect, useState } from "react";
import { UserGender } from "@/constant/enum/userGender";
import PageWrapper from "@/components/wrapper/PageWrapper";
import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import { PROFILE_QUERY_KEY } from "@/services/queryKeys";
import { getProfile } from "@/services/user";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { phoneNumberRegex } from "@/constant/regex/phoneNumber";

dayjs.extend(customParseFormat);

const { Title } = Typography;

const dateFormat = "YYYY/MM/DD";

type FileType = Parameters<GetProp<UploadProps, "beforeUpload">>[0];

const getBase64 = (img: FileType, callback: (url: string) => void) => {
  const reader = new FileReader();
  reader.addEventListener("load", () => callback(reader.result as string));
  reader.readAsDataURL(img);
};

const beforeUpload = (file: FileType) => {
  const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
  if (!isJpgOrPng) {
    message.error("You can only upload JPG/PNG file!");
  }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    message.error("Image must smaller than 2MB!");
  }
  return isJpgOrPng && isLt2M;
};

const ProfilePage = () => {
  const [address, setAddress] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string>();

  const { data, isError, isLoading } = useQuery({
    queryKey: [PROFILE_QUERY_KEY],
    queryFn: async () => await getProfile(),
  });

  useEffect(() => {
    if (data) {
      setAddress(data.address);
    }
  }, [data]);

  const handleChange: UploadProps["onChange"] = (info) => {
    if (info.file.status === "uploading") {
      setLoading(true);
      return;
    }
    if (info.file.status === "done") {
      // Get this url from response in real world.
      getBase64(info.file.originFileObj as FileType, (url) => {
        setLoading(false);
        setImageUrl(url);
      });
    }
  };

  const uploadButton = (
    <button style={{ border: 0, background: "none" }} type="button">
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>Upload</div>
    </button>
  );

  const handleFinish = () => {};

  if (data) {
    return (
      <PageWrapper>
        <Title>Thông tin người dùng</Title>
        <Form
          name="login"
          onFinish={handleFinish}
          layout="vertical"
          requiredMark="optional"
          initialValues={{
            firstName: data.firstName,
            lastName: data.lastName,
            phoneNumber: data.phoneNumber,
            email: data.email,
            dateOfBirth: dayjs(data.dateOfBirth, dateFormat),
            gender: UserGender.MALE,
          }}
          validateMessages={{
            required: "${label} là bắt buộc!",
            types: {
              email: "${label} không hợp lệ!",
            },
          }}
        >
          <Flex justify="center">
            <Form.Item label="Ảnh đại diện">
              <Upload
                name="avatar"
                listType="picture-circle"
                className="avatar-uploader"
                showUploadList={false}
                action="https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload"
                beforeUpload={beforeUpload}
                onChange={handleChange}
              >
                {data.image ? (
                  <img
                    src={data.image}
                    alt="avatar"
                    style={{ width: "100%", borderRadius: "50%" }}
                  />
                ) : (
                  uploadButton
                )}
              </Upload>
            </Form.Item>
          </Flex>
          <Flex>
            <Flex style={{ flex: 1 }} vertical>
              <Form.Item
                label="Họ và tên đệm"
                name="firstName"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập họ và tên đệm!",
                  },
                ]}
              >
                <Input placeholder="Họ và tên đệm" size="large" />
              </Form.Item>
              <Form.Item
                label="Tên"
                name="lastName"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập tên!",
                  },
                ]}
              >
                <Input placeholder="Tên" size="large" />
              </Form.Item>
              <Form.Item
                label="Số điện thoại"
                name="phoneNumber"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập số điện thoại!",
                  },
                  {
                    pattern: phoneNumberRegex,
                    message: "Số điện thoại không hợp lệ!",
                  },
                ]}
              >
                <Input placeholder="Số điện thoại" size="large" />
              </Form.Item>
              <Form.Item
                label="Email"
                name="email"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập email!",
                  },
                  {
                    type: "email",
                    message: "Email không hợp lệ!",
                  },
                ]}
              >
                <Input placeholder="Email" size="large" />
              </Form.Item>
              <Form.Item
                label="Ngày sinh"
                name="dateOfBirth"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập ngày sinh!",
                  },
                ]}
              >
                <DatePicker style={{ width: "100%" }} size="large" />
              </Form.Item>
            </Flex>
            <Divider type="vertical" />
            <Flex style={{ flex: 1 }} vertical>
              <FormAddress
                defaultValue={address}
                onChange={(address) => setAddress(address)}
              />

              <Form.Item
                label="Giới tính"
                name="gender"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng chọn giới tính!",
                  },
                ]}
              >
                <Radio.Group value={UserGender.MALE}>
                  <Radio value={UserGender.MALE}>Nam</Radio>
                  <Radio value={UserGender.FEMALE}>Nữ</Radio>
                </Radio.Group>
              </Form.Item>
              <Form.Item>
                <Flex justify="flex-end">
                  <Button
                    block={true}
                    type="primary"
                    htmlType="submit"
                    size="large"
                    loading={false}
                    style={{ width: "35%" }}
                  >
                    Lưu thông tin
                  </Button>
                </Flex>
              </Form.Item>
            </Flex>
          </Flex>
        </Form>
      </PageWrapper>
    );
  }
};

export default ProfilePage;
