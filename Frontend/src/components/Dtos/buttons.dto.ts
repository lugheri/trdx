export type ToggleType = {
  value: boolean;
  setValue: React.Dispatch<React.SetStateAction<boolean>>;
};

export type ButtonType = {
  name?: string;
  onClick?: () => void;
};