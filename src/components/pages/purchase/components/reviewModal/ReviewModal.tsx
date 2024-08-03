import { ORDERS_QUERY_KEY, REVIEWS_QUERY_KEY } from "@/services/queryKeys";
import { createReview, deleteReview, updateReview } from "@/services/review";
import { OrderFull } from "@/types/order";
import { ExclamationCircleFilled } from "@ant-design/icons";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button, Flex, Input, Modal, Rate, Space, Typography } from "antd";
import { useState } from "react";

const { TextArea } = Input;
const { Text } = Typography;
const { confirm } = Modal;

export enum ReviewModalType {
  CREATE,
  EDIT,
}

interface IReviewModal {
  type: ReviewModalType;
  visible: boolean;
  onClose: (message?: string, messageType?: "error" | "success") => void;
  data: OrderFull;
}

const ReviewModal: React.FC<IReviewModal> = ({
  type,
  visible,
  onClose,
  data,
}) => {
  const queryClient = useQueryClient();
  const [rating, setRating] = useState<number>(
    data.orderDetails[0].review ? data.orderDetails[0].review.rating : 5
  );
  const [comment, setComment] = useState<string | null>(
    data.orderDetails[0].review ? data.orderDetails[0].review.comment : null
  );

  const createMutation = useMutation({
    mutationFn: (params: {
      orderId: number;
      rating: number;
      comment: string | null;
    }) => createReview(params.orderId, params.rating, params.comment),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [ORDERS_QUERY_KEY],
      });
      onClose("Gửi đánh giá thành công", "success");
    },
    onError: (error) => onClose(error.message, "error"),
  });

  const updateMutation = useMutation({
    mutationFn: (params: {
      reviewId: number;
      rating: number;
      comment: string | null;
    }) => updateReview(params.reviewId, params.rating, params.comment),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [ORDERS_QUERY_KEY],
      });
      onClose("Sửa đánh giá thành công", "success");
    },
    onError: (error) => onClose(error.message, "error"),
  });

  const deleteMutation = useMutation({
    mutationFn: (reviewId: number) => deleteReview(reviewId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [ORDERS_QUERY_KEY],
      });
      onClose("Xóa đánh giá thành công", "success");
    },
    onError: (error) => onClose(error.message, "error"),
  });

  const handleSubmit = () => {
    switch (type) {
      case ReviewModalType.CREATE: {
        return createMutation.mutate({ orderId: data.id, rating, comment });
      }
      case ReviewModalType.EDIT: {
        const review = data.orderDetails[0].review;
        if (!review) break;
        return updateMutation.mutate({
          reviewId: review.id,
          rating,
          comment,
        });
      }
    }
  };

  const handleDeleteReview = () => {
    confirm({
      title: "Xóa đánh xóa",
      icon: <ExclamationCircleFilled />,
      content: "Bạn có muốn xóa đánh giá không?",
      okText: "Có",
      okType: "danger",
      cancelText: "Không",
      onOk() {
        const review = data.orderDetails[0].review;
        if (review) {
          deleteMutation.mutate(review.id);
        }
      },
      onCancel() {
        console.log("Cancel");
      },
    });
  };

  return (
    <Modal
      title="Đánh giá sản phẩm"
      destroyOnClose={true}
      open={visible}
      onCancel={() => onClose()}
      footer={[
        type === ReviewModalType.EDIT && (
          <Button key="delete" danger onClick={handleDeleteReview}>
            Xóa đánh giá
          </Button>
        ),
        <Button key="submit" type="primary" onClick={handleSubmit}>
          {type === ReviewModalType.CREATE
            ? "Gửi đánh giá"
            : "Chỉnh sửa đánh giá"}
        </Button>,
      ]}
    >
      {data.orderDetails.map((orderDetail) => (
        <div
          key={orderDetail.id}
          style={{
            marginBottom: "1rem",
            padding: "0.5rem",
            border: "1px solid var(--light-grey)",
            borderRadius: "0.5rem",
          }}
        >
          <Flex align="center" key={orderDetail.id}>
            <img
              style={{ width: "3rem", height: "3rem", objectFit: "contain" }}
              src={orderDetail.productImage}
              alt={orderDetail.productName}
            />
            <Space direction="vertical">
              <Text strong>{orderDetail.productName}</Text>
              <Text>{orderDetail.optionValue.join(", ")}</Text>
            </Space>
          </Flex>
        </div>
      ))}
      <Flex justify="center" align="center" vertical>
        <Rate
          defaultValue={rating}
          onChange={(value) => setRating(value)}
          style={{ marginBottom: "1rem", fontSize: "2rem" }}
        />
        <TextArea
          placeholder="Đánh giá sản phẩm"
          rows={4}
          defaultValue={comment ?? ""}
          onBlur={(e) => {
            const value = e.target.value;
            if (!value) {
              return setComment(null);
            }
            setComment(value);
          }}
        />
      </Flex>
    </Modal>
  );
};

export default ReviewModal;
