"use client";

import React from "react";

// AppProvider: 전역 Context 공간 (현재 모든 데이터는 fetch API로 직접 로드)
export default function AppProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
