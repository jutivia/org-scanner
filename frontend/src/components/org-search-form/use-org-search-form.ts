import { useState } from "react";

export const useOrgSearchForm = (
  onSubmit: (org: string) => void,
  clearInput: () => void
) => {
  const [inputValue, setInputValue] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(inputValue);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.value) {
      clearInput();
    }
    setInputValue(e.target.value);
  };

  return {
    inputValue,
    handleSubmit,
    handleInputChange,
  };
};
