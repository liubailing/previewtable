import React, { FC, Component, Fragment } from 'react';
import { Resizable } from 'react-resizable';
import { Row, Input, Col, Form, message } from 'antd';
import { FormComponentProps, WrappedFormUtils } from 'antd/lib/form/Form';
import { TableProps } from 'antd/lib/table';

import './table.css';

const TableRow: React.FC<any> = (props: any) => {
	return <tr {...props}></tr>;
};

export default TableRow;
