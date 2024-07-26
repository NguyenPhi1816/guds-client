import FormAddress from "@/components/form/address/FormAddress";
import { Button, Form, Input, Modal } from "antd";
import useMessage from "antd/es/message/useMessage";
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
  const [messageApi, contextHolder] = useMessage();

  useEffect(() => {
    setName(receiverName);
    setPhoneNumber(receiverPhoneNumber);
    setAddess(receiverAddress);
  }, [receiverName, receiverPhoneNumber, receiverAddress]);

  const handleCancel = () => {
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
    }
    handleCancel();
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
      <Form name="EditReceiverInfo" layout="vertical" requiredMark="optional">
        <Form.Item name="name">
          <Input
            placeholder="Tên người nhận"
            size="large"
            defaultValue={name}
            onChange={(e) => setName(e.target.value)}
          />
        </Form.Item>
        <Form.Item name="phoneNumber">
          <Input
            placeholder="Số điện thoại"
            size="large"
            defaultValue={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
          />
        </Form.Item>
        <FormAddress
          defaultValue={address}
          onChange={(address) => setAddess(address)}
        />
      </Form>
      {contextHolder}
    </Modal>
  );
};

export default OrderReceiverModal;
