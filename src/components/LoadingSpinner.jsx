import React from "react";
import styled, { keyframes } from "styled-components";

// 旋转动画
const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

//  spinner 样式
const Spinner = styled.div`
  display: inline-block;
  width: ${(props) => props.size || "40px"};
  height: ${(props) => props.size || "40px"};
  border: 4px solid ${(props) => props.color || "#f3f3f3"};
  border-top: 4px solid ${(props) => props.primaryColor || "#27AE60"};
  border-radius: 50%;
  animation: ${spin} 1s linear infinite;
  margin: 20px auto;
`;

// 容器（用于居中）
const SpinnerContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh; // 全屏居中（根据需求调整）
`;

// 组件接口
const LoadingSpinner = ({ size, color, primaryColor }) => {
  return (
    <SpinnerContainer>
      <Spinner size={size} color={color} primaryColor={primaryColor} />
    </SpinnerContainer>
  );
};

export default LoadingSpinner;