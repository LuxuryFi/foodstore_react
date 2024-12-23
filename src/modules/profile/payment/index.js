import React, { useEffect } from 'react';
import { Table } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { ImEye } from 'react-icons/im';
import { AiFillPrinter } from 'react-icons/ai';

import Tag from '../../../components/Tag';
import Button from '../../../components/Button';
import {
  fetchPayments,
  selectPaymentIsLoading,
  selectPayments,
} from '../../../store/slices/paymentsSlice';
import { formatDateAndTime } from '../../../helpers/formatDate';
import { Link } from 'react-router-dom';

export default function PaymentList() {
  const dispatch = useDispatch();
  const payments = useSelector(selectPayments);
  const isLoading = useSelector(selectPaymentIsLoading);

  useEffect(() => {
    dispatch(fetchPayments());
  }, [dispatch]);

  console.log('payment', payments);
  const paymentColumns = [
    {
      title: 'Order ID',
      key: 'ID',
      dataIndex: 'id',
    },
    {
      title: 'User ID',
      key: 'User_ID',
      dataIndex: 'user_id',
    },
    {
      title: 'Created Date',
      key: 'created date',
      render: (record) => formatDateAndTime(record.created_at),
    },
    // {
    //   title: 'Paid On',
    //   key: 'paid on',
    //   render: (record) =>
    //     !record.status ? 0 : formatDateAndTime(record.created_at),
    // },
    {
      title: 'Status',
      key: 'status',
      render: (record) => <Tag status={record.status ? 0 : 'CREATED' ?? 'RESOLVE'}></Tag>,
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (record) => (
        <div className="button-container">
          <Link
            to={`/payment/view/${record.id}`}
            className="button button--blue--dark square"
          >
            <ImEye className="icon" />
            <span>View</span>
          </Link>
          <Button className="button button--light square">
            <AiFillPrinter className="icon" />
            <span>Print</span>
          </Button>
        </div>
      ),
    },
  ];

  return (
    <Table
      rowClassName="payment-row"
      x={true}
      loading={isLoading}
      scroll={{ x: 300 }}
      pagination={{
        position: ['bottomCenter'],
      }}
      columns={paymentColumns}
      dataSource={payments || []}
      rowKey={(record) => record.order_id}
    />
  );
}
