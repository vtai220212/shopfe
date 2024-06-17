import React from 'react';
import { Steps } from 'antd';
const { Step } = Steps;

const StepComponent = ({ current = 0, items = [] }) => {
    return (
        <Steps current={current}>
            {items.map((item, index) => (
                <Step
                    key={index}
                    title={item.title}
                    description={item.description}
                />
            ))}
        </Steps>
    );
};

export default StepComponent;
