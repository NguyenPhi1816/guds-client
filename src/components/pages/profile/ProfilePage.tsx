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
  Modal,
  Radio,
  Typography,
  Upload,
  UploadProps,
} from "antd";
import FormAddress from "@/components/form/address/FormAddress";
import { useEffect, useState } from "react";
import { UserGender } from "@/constant/enum/userGender";
import PageWrapper from "@/components/wrapper/PageWrapper";
import {
  ExclamationCircleFilled,
  LoadingOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { PROFILE_QUERY_KEY, SESSION_QUERY_KEY } from "@/services/queryKeys";
import { getProfile, updateProfile } from "@/services/user";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { phoneNumberRegex } from "@/constant/regex/phoneNumber";
import { uploadImages } from "@/services/upload";
import { UpdateProfileRequest } from "@/types/user";
import { useGlobalMessage } from "@/utils/messageProvider/MessageProvider";
import LoadingPage from "../loadingPage";
import ErrorPage from "../errorPage";

dayjs.extend(customParseFormat);

const { Title } = Typography;
const { confirm } = Modal;

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
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);
  const [address, setAddress] = useState<string>("");
  const [image, setImage] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string>();
  const [isChanged, setIsChanged] = useState(false);
  const message = useGlobalMessage();

  const [form] = Form.useForm();

  const { data, isError, isLoading } = useQuery({
    queryKey: [PROFILE_QUERY_KEY],
    queryFn: async () => await getProfile(),
  });

  const updateMutation = useMutation({
    mutationKey: [PROFILE_QUERY_KEY],
    mutationFn: async (requestBody: UpdateProfileRequest) => {
      try {
        setLoading(true);
        if (data) {
          let newImageUrl = data.image;
          if (image) {
            const res = await uploadImages([image]);
            newImageUrl = res.paths[0];
          }
          requestBody.image = newImageUrl;
          const updatedProfile = await updateProfile(requestBody);
          return updatedProfile;
        }
      } catch (error) {
        throw new Error("Cập nhật thông tin cá nhận thất bại");
      } finally {
        setLoading(false);
      }
    },
    onSuccess: (data) => {
      queryClient.setQueryData([PROFILE_QUERY_KEY, SESSION_QUERY_KEY], data);
      message.success("Cập nhật thông tin cá nhân thành công!");
    },
    onError: (error) => message.error(error.message),
  });

  useEffect(() => {
    if (data) {
      setAddress(data.address);
      form.setFieldsValue({
        firstName: data.firstName,
        lastName: data.lastName,
        phoneNumber: data.phoneNumber,
        email: data.email,
        dateOfBirth: dayjs(data.dateOfBirth, dateFormat),
        gender: data.gender,
      });
    }
  }, [data, form]);

  const handleImageChange: UploadProps["onChange"] = (info) => {
    setIsChanged(true);
    getBase64(info.file.originFileObj as FileType, (url) => {
      setImageUrl(url);
    });
  };

  const uploadAction = (file: File) => {
    setImage(file);
    return "";
  };

  const uploadButton = (
    <button style={{ border: 0, background: "none" }} type="button">
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>Upload</div>
    </button>
  );

  const handleFinish = (values: any) => {
    confirm({
      title: "Thay đổi thông tin",
      icon: <ExclamationCircleFilled />,
      content: "Bạn có muốn lưu thông tin không?",
      okText: "Có",
      cancelText: "Không",
      onOk() {
        const requestBody: UpdateProfileRequest = {
          email: values.email,
          address: address,
          phoneNumber: values.phoneNumber,
          firstName: values.firstName,
          lastName: values.lastName,
          dateOfBirth: new Date(
            Date.UTC(
              values.dateOfBirth.$y,
              values.dateOfBirth.$M,
              values.dateOfBirth.$D
            )
          ).toISOString(),
          gender: values.gender,
          image: null, // This will be updated in the mutation function if there is an image
        };
        updateMutation.mutate(requestBody);
      },
      onCancel() {
        console.log("Cancel");
      },
    });
  };

  const handleValuesChange = () => {
    setIsChanged(true);
  };

  if (isLoading) {
    return <LoadingPage />;
  }

  if (isError) {
    return <ErrorPage />;
  }

  if (data) {
    return (
      <PageWrapper>
        <Title>Thông tin người dùng</Title>
        <Form
          form={form}
          name="login"
          onFinish={handleFinish}
          layout="vertical"
          requiredMark="optional"
          onValuesChange={handleValuesChange}
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
                action={uploadAction}
                beforeUpload={beforeUpload}
                onChange={handleImageChange}
              >
                {imageUrl ? (
                  <img
                    src={imageUrl}
                    alt="avatar"
                    style={{ width: "100%", borderRadius: "50%" }}
                  />
                ) : data.image ? (
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
                onChange={(address) => {
                  setAddress(address);
                  setIsChanged(true);
                }}
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
                    loading={updateMutation.isPending}
                    style={{ width: "35%" }}
                    disabled={!isChanged}
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
