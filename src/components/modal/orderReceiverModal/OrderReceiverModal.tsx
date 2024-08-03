import FormAddress from "@/components/form/address/FormAddress";
import { phoneNumberRegex } from "@/constant/regex/phoneNumber";
import { Button, Form, Input, Modal } from "antd";
import { useEffect, useState } from "react";

interface IOrderReceiverModal {
  open: boolean;
  receiverName: string;
  receiverPhoneNumber: string;
  receiverAddress: string;
  onSubmit: (
    receiverName: string,
    receiverPhoneNumber: string,
    receiverAddress: string
  ) => void;
  onCancel: () => void;
}

const OrderReceiverModal: React.FC<IOrderReceiverModal> = ({
  open,
  receiverName,
  receiverPhoneNumber,
  receiverAddress,
  onSubmit,
  onCancel,
}) => {
  const [name, setName] = useState<string>("");
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [address, setAddess] = useState<string>("");

  useEffect(() => {
    setName(receiverName);
    setPhoneNumber(receiverPhoneNumber);
    setAddess(receiverAddress);
  }, [receiverName, receiverPhoneNumber, receiverAddress]);

  const handleCancel = () => {
    setName(receiverName);
    setPhoneNumber(receiverPhoneNumber);
    setAddess(receiverAddress);
    onCancel();
  };

  const handleSubmit = () => {
    if (
      !!name &&
      !!phoneNumber &&
      !!address &&
      (name !== receiverName ||
        phoneNumber !== receiverPhoneNumber ||
        address !== receiverAddress)
    ) {
      onSubmit(name, phoneNumber, address);
      handleCancel();
    } else {
      handleCancel();
    }
  };

  return (
    <Modal
      destroyOnClose={true}
      title={"Địa chỉ nhận hàng"}
      open={open}
      onCancel={handleCancel}
      footer={[
        <Button onClick={handleCancel} key={1}>
          Hủy
        </Button>,
        <Button onClick={handleSubmit} type="primary" key={2}>
          Lưu thông tin
        </Button>,
      ]}
    >
      <Form
        name="EditReceiverInfo"
        initialValues={{ name, phoneNumber }}
        layout="vertical"
        requiredMark="optional"
      >
        <Form.Item
          name="name"
          label="Tên người nhận"
          rules={[{ required: true, message: "Vui lòng nhập tên người nhận" }]}
        >
          <Input
            placeholder="Tên người nhận"
            size="large"
            onChange={(e) => setName(e.target.value)}
            value={name}
          />
        </Form.Item>
        <Form.Item
          name="phoneNumber"
          label="Số điện thoại"
          rules={[
            { required: true, message: "Vui lòng nhập số điện thoại" },
            {
              pattern: phoneNumberRegex,
              message: "Số điện thoại không hợp lệ",
            },
          ]}
        >
          <Input
            placeholder="Số điện thoại"
            size="large"
            onChange={(e) => setPhoneNumber(e.target.value)}
            value={phoneNumber}
          />
        </Form.Item>
        <FormAddress
          defaultValue={address}
          onChange={(address) => setAddess(address)}
        />
      </Form>
    </Modal>
  );
};

export default OrderReceiverModal;
